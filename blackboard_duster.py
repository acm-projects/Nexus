#!/usr/bin/env python3
"""
Copyright (C) 2020  Taylor Smith

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see https://www.gnu.org/licenses/


 ~^~
Blackboard Duster
    Scrapes course materials from your Blackboard courses, such as
    lecture notes and homework
Author: Taylor Smith, Winter 2019
Python Version: 3.7
Notes: Uses Selenium to scrape urls from Blackboard, then urllib to
    download files
TODO:
    - avoid redundant visit to course home page (just ignore it?)
    - dump notes from items/assignments into a .txt : use div.details
    - don't abort if navpane is missing, reload or skip
    - put a 'download progress' label on progress bar
    - use etag instead of last-modified date (note - etag may not always be available)
~*~ """

import argparse
import json
import requests
import time

from enum import Enum
from datetime import datetime
from os import get_terminal_size
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common import actions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from urllib.parse import unquote
from selenium.webdriver.chrome.options import Options

from flask import Flask, request, jsonify
import threading


# Last Modified value in the header has a timezone. Once it is
# converted to a datetime object, the timezone info is lost
lastmod_parse_fmt = '%a, %d %b %Y %H:%M:%S %Z'
lastmod_save_fmt = '%a, %d %b %Y %H:%M:%S'


class Link:
    """contains useful information about a link

    'url': url found on page, will (probably) get redirected
    'name': friendly name of link
    'save_path': relative to download path, usually the page's name
    'element': the selenium Element that the url came from
    'lastmod': last modified date
    'full_path': full save path, used for troubleshooting
    """

    def __init__(self, url, name='', save_path=None, element=None):
        self.url = url
        self.name = name
        self.save_path = save_path
        self.element = element
        self.lastmod = None
        self.full_path = None

    def __repr__(self):
        return f'{self.url}\n\t{self.name}\n\t{self.save_path}'

    def set_lastmod(self, datestr):
        self.lastmod = datetime.strptime(
            datestr.strip(), lastmod_parse_fmt)

    def json(self):
        result = {
            'url': self.url,
            'name': self.name,
            'save_path': self.save_path.as_posix(),
            'lastmod': self.lastmod.strftime(lastmod_save_fmt)
        }
        return result


class DLResult(Enum):
    """represents various download results"""
    COLLISION = 0
    DOWNLOADED = 1
    DUPLICATE = 2
    UPDATED = 3


def apply_style(driver, element, res_code):
    style = 'border: '
    if res_code == DLResult.COLLISION:
        style += '4px dotted red'
    elif res_code == DLResult.DOWNLOADED:
        style += '4px solid green'
    elif res_code == DLResult.DUPLICATE:
        style += '4px dashed cyan'
    elif res_code == DLResult.UPDATED:
        style += '4px solid blue'
    else:  # PENDING DOWNLOAD
        style += '1px dotted magenta'
    driver.execute_script(
        'arguments[0].setAttribute("style", arguments[1]);',
        element, style)


def parse_args():
    navpane_ignore = {'Announcements', 'Calendar',
                      'My Grades', 'Blackboard Collaborate'}
    parser = argparse.ArgumentParser(
        description='Scrapes files from Blackboard courses')
    parser.add_argument(
        'bb_url', metavar='BB_base_URL',
        help='URL for your Blackboard instance.')
    parser.add_argument(
        'utdID', metavar='UTD-ID',
        help='URL for your Blackboard instance.')
    parser.add_argument(
        'password', metavar='Password',
        help='URL for your Blackboard instance.')
    parser.add_argument(
        '-s', '--save', metavar='path', default='.',
        help='directory to save your downloads in')
    parser.add_argument(
        '--historypath', '--history', metavar='json',
        default='BlackboardDuster.json',
        help='path to blackboard duster history file. Relative to' +
        ' download directory unless path is absolute. The file' +
        ' will be created if it does not exit.')
    parser.add_argument(
        '--delay', metavar='delay_mult', type=int, default=1,
        help='multiplier for sleep/delays')
    parser.add_argument(
        '-w', '--webdriver', '--wd', metavar='name', default='firefox',
        help='browser WebDriver to use - either "firefox" or' +
        ' "chrome". You must have the WebDriver in your system' +
        ' path. Currently, only firefox is supported; that' +
        ' will change in the future')
    parser.add_argument(
        '-a', '--auto', action='store_true',
        help='disable user input. The script will continue after' +
        ' parsing a page')
    parser.add_argument(
        '-b', '--binary', metavar='file', default=None,
        help='Path to the binary you want to use - use if your' +
        ' browser binary is not in the default location')
    parser.add_argument(
        '-i', '--ignore', metavar='name', action='append',
        help=f'Name of a page in the navpane to ignore; repeat this argument' +
        f' to ignore multiple pages. Defaults are {navpane_ignore}')
    args = parser.parse_args()
    # convert given path string into a Path object
    args.save = Path(args.save)
    # if history path isn't absolute, make it relative to save
    args.historypath = Path(args.historypath)
    if not args.historypath.is_absolute():
        args.historypath = args.save / args.historypath
    # sterilize webdriver name
    args.webdriver = args.webdriver.lower().strip()
    # combine args.ignore with navpane_ignore
    if args.ignore:
        navpane_ignore.update(args.ignore)
    args.ignore = navpane_ignore
    # inform user about auto mode
    print(f'running in {"auto" if args.auto else "manual"} mode')
    return args
# end parse_args()


def wait_on_CSS_selector(driver, selector, delay_mult, delay):
    """delay until an element is located by the given css selector"""
    try:
        WebDriverWait(driver, delay_mult * delay).until(
            EC.presence_of_element_located((
                By.CSS_SELECTOR, selector))
        )
    except TimeoutException:
        return False
    return True
# end wait_on_CSS_selector


def setup_history(path):
    # set up the download history JSON object
    history = None
    try:
        with path.open('r') as file:
            history = json.load(file)
    except json.decoder.JSONDecodeError:
        print('current history file will not parse, aborting')
        exit()
    except IOError:
        print('history file not found, creating new history')
        history = json.loads('{"links":[]}')
    return history


def setup_session(driver):
    """copies login cookies from WebDriver into a requests session"""
    session = requests.Session()
    for cookie in driver.get_cookies():
        session.cookies.set(cookie['name'], cookie['value'])
    return session


def manual_login(driver,utdID,password):
    """allow user to signs in manually

     waits until the Blackboard homepage appears, returns nothing
     """
    print('Please log into your university Blackboard account - I will'
          ' wait for you to reach the home page!')

    driver.implicitly_wait(5)

    # Find the input field by its ID (or other attributes) and input the UTD-ID
    netid_input = driver.find_element(By.ID, "netid")  # Locate the input field by ID
    netid_input.send_keys(utdID)  # Replace with your UTD-ID

    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys(password)

    # Locate the button by its ID and click it
    login_button = driver.find_element(By.ID, "submit")  # Locate by ID
    login_button.click()  # Click the button

    while not driver.title.startswith('Institution Page'):
        pass
    driver.get("https://elearning.utdallas.edu/ultra/course")


def accept_cookies(driver, delay_mult):
    """if the cookie notice appears, click 'accept'"""
    try:
        element = WebDriverWait(driver, delay_mult * 4).until(
            EC.presence_of_element_located((By.ID, 'agree_button'))
        )
        print('I am accepting the cookie notice, I hope that is ok!')
        element.click()
    except TimeoutException:
        print('I did not see a cookie notice.')




def get_courses_info(driver, delay_mult, save_root):
    """returns an array of link objects for each course

    driver: a selenium WebDriver
    delay_mult: delay multiplier
    save_root: base directory for downloads
    expects homepage to already be loaded
    """
    result = []
    driver.maximize_window()
    # TODO course announcements are included in the list
    if not wait_on_CSS_selector(
            driver,'h4.js-course-title-element[id^="course-name-"]',delay_mult,10):
        print('I did not see your course list! Aborting')
        driver.quit()
        exit()
    # be more specific when selecting the links - the wait statement's
    # selector includes announcement links, which we don't want
    course_links = driver.find_elements(By.CSS_SELECTOR, 'h4.js-course-title-element')
    body = driver.find_element(By.CSS_SELECTOR, '.base-courses.js-base-page-skip-link-target')
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", body)

    #body.send_keys(Keys.PAGE_DOWN)
    for c_l in course_links:
        # Extract the text from the element
        '''
                    EC.text_to_be_present_in_element((By.CSS_SELECTOR, 'h4.js-course-title-element'), c_l.text)
                    '''




        WebDriverWait(driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'h4.js-course-title-element[id^="course-name-"]'))
        )
        course_text = c_l.text.strip()

        # Ensure text has been loaded (handle cases where it's still empty)

        if not course_text:
            print("Empty course text found, waiting for it to load...")
            # Retry if course text is empty
            WebDriverWait(driver, 10).until(
                lambda driver: c_l.text.strip() != ""
            )
            course_text = c_l.text.strip()

        if not course_text:
            print("Still no course text, skipping this element.")
            continue

        # Split the text into parts (e.g., 'CS 1200.002 - Introduction to Computer Science and Software Engineering - F24')
        course_parts = course_text.split(' - ')

        # Extract the Course and Course ID
        course_id = course_parts[0]  # e.g., 'CS 1200.002'
        course_name = ' - '.join(course_parts[1:])  # Join the rest of the string for the full course name

        # Print or return the extracted data
        print("Course ID:", course_id)
        print("Course Name:", course_name)
        result.append(course_id)


    return result


def run_scraper(bb_url, utdID, password):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Enable headless mode

    driver = webdriver.Chrome(options=chrome_options)

    print("here we go!")
    # choose a nice size - the navpane is invisible at small widths,
    # but selenium can still see its elements
    driver.maximize_window()
    driver.get(bb_url)
    manual_login(driver,utdID,password)
    session = setup_session(driver)
    print('Alright, I can drive from here.')
    # links are visible behind the cookie notice, but it gets annoying
    # plus, there might be legal implications - so accept and move on
    accept_cookies(driver, 1)
    course_ids = get_courses_info(driver, 1, "save")
    print(f'I found {len(course_ids)} courses.')
    driver.get("https://elearning.utdallas.edu/ultra/logout")
    driver.quit()
    courses = [
        {"course_id": course_id}
        for course_id in course_ids
    ]

    return courses


app = Flask(__name__)


@app.route('/run', methods=['POST'])
def run_script():
    data = request.json
    bb_url = 'https://elearning.utdallas.edu/ultra/course'
    utdId = data.get('utd_id')
    password = data.get('utd_password')

    courses = run_scraper(bb_url, utdId, password)
    return jsonify({'courses': courses}), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

