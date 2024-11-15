#!/usr/bin/env python3




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
from selenium.common.exceptions import *


from selenium.webdriver.chrome.options import Options


from flask import Flask, request, jsonify
from flask_cors import CORS






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


class BrowserSession:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.cookies = []
        self.utdid = None
        self.passw = None


    def create_driver(self):
        """Initialize a new headless ChromeDriver."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        self.driver = webdriver.Chrome(options=chrome_options)


    def save_cookies(self):
        """Save cookies from the current driver session."""
        self.cookies = self.driver.get_cookies()


    def load_cookies(self):
        """Load saved cookies into the new driver session."""
        self.driver.delete_all_cookies()
        print("deleted cookies: ",self.driver.get_cookies())
        for cookie in self.cookies:
            self.driver.add_cookie(cookie)


    def close_driver(self):
        """Close the current driver."""
        if self.driver:
            self.driver.quit()


    def continue_with_new_driver(self):
        """Terminate the current driver and continue with a new headless driver."""
        if self.driver:
            self.save_cookies()  # Save cookies before quitting the driver
            self.close_driver()  # Terminate the old driver


        # Reinitialize the driver with the same cookies
        self.create_driver()
        self.driver.get("https://elearning.utdallas.edu/ultra/courses")  # Navigate to the URL of your choice


        # Load the saved cookies into the new driver session
       # self.load_cookies()


        # Refresh the page to ensure the cookies are applied
        #self.driver.refresh()


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




def manual_login(browser):
    """allow user to signs in manually


     waits until the Blackboard homepage appears, returns nothing
     """
    print('Please log into your university Blackboard account - I will'
          ' wait for you to reach the home page!')


    browser.driver.implicitly_wait(5)


    '''
    # Find the input field by its ID (or other attributes) and input the UTD-ID
    netid_input = driver.find_element(By.ID, "netid")  # Locate the input field by ID
    netid_input.send_keys(utdID)  # Replace with your UTD-ID


    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys(password)


    # Locate the button by its ID and click it
    login_button = driver.find_element(By.ID, "submit")  # Locate by ID
    login_button.click()  # Click the button
    '''
    '''
    netid_value = None
    password_value = None


    while not browser.driver.title.startswith('Institution Page'):
        try:
            netid_element = browser.driver.find_element(By.ID, "netid")
            netid_value = netid_element.get_attribute("value")
            password_element = browser.driver.find_element(By.ID, "password")
            password_value = password_element.get_attribute("value")
        except (StaleElementReferenceException,NoSuchElementException):
            pass






    #browser.continue_with_new_driver()


    netid_element = browser.driver.find_element(By.ID, "netid")
    password_element = browser.driver.find_element(By.ID, "password")
    login_button = browser.driver.find_element(By.ID, "submit")


    netid_element.send_keys(netid_value)
    password_element.send_keys(password_value)
    login_button.send_keys(Keys.RETURN)


    '''


    while not browser.driver.title.startswith('Institution Page'):
            pass


    browser.driver.get("https://elearning.utdallas.edu/ultra/course")




    #driver.set_window_position(-2000, 0)  # Adjust values based on your screen size






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
    #driver.set_window_size(1920, 1080)
    #driver.set_window_position(-2000, 0)
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
        course_id_raw = course_parts[0]  # e.g., 'CS 1200.002'
        course_major = course_id_raw.split(' ')[0]
        course_number = course_id_raw.split(' ')[1].split('.')
        course_id = course_major+'-'+course_number[0]+'-'+course_number[1] # e.g., 'CS-1200-002'
        course_name = ' - '.join(course_parts[1:])  # Join the rest of the string for the full course name


        # Print or return the extracted data
        print("Course ID:", course_id)
        print("Course Name:", course_name)
        result.append(course_id)




    return result




def run_scraper(bb_url):
    browser = BrowserSession()


    print("here we go!")
    # choose a nice size - the navpane is invisible at small widths,
    # but selenium can still see its elements
    #browser.driver.set_window_size(600, 500)
    browser.driver.maximize_window()
    #driver.maximize_window()
    browser.driver.get(bb_url)
    print("Intial cookies: ",browser.driver.get_cookies())
    manual_login(browser)
    session = setup_session(browser.driver)
    print('Alright, I can drive from here.')
    # links are visible behind the cookie notice, but it gets annoying
    # plus, there might be legal implications - so accept and move on
    accept_cookies(browser.driver, 1)
    course_ids = get_courses_info(browser.driver, 1, "save")
    print(f'I found {len(course_ids)} courses.')
    browser.driver.get("https://elearning.utdallas.edu/ultra/logout")
    browser.close_driver()
    courses = [
        {"course_id": course_id}
        for course_id in course_ids
    ]


    return courses




app = Flask(__name__)
CORS(app, origins="*")






@app.route('/scrape', methods=['GET'])
def run_script():
    bb_url = 'https://elearning.utdallas.edu/ultra/course'




    courses = run_scraper(bb_url)
    return jsonify({'courses': courses}), 200






if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3030)









