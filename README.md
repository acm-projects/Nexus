<p align="center">
<img src='https://mms.businesswire.com/media/20231024932463/en/1922758/5/wideimage.jpg' width='700'>
</p>

# <h1 align="center">Nexus</h1>

<p align="center">
Students often create group chats for their courses to collaborate and share information, but these groups are not always accessible or inclusive. Nexus solves this problem by providing a centralized platform where every course automatically has a dedicated group. Nexus allows students to communicate, plan ahead, share study notes, and access advanced collaboration tools. These tools include forums, document sharing, and a feature that compares and consolidates typed notes into a comprehensive master document. With Nexus, all students can easily join and benefit from course-specific groups, enhancing their learning experience and academic success.
</p>
<br>

## MVP :trophy:

- User account with secure authentication
- Personal Profile
  - Username
  - Email
  - Major
  - University
  - Current Courses
  - Student Email for Verification
- Course Groups
  - Groups are automatically created for each course
  - Ability to join/leave groups, ensuring accessibility for all students
  - Course information (via UTD Coursebook or Nebula API)
    - Instructor
    - TA
    - Access to Course Syllabus
- Messaging and Collaboration Tools
  - Live messaging
  - Document sharing
    - Via uploading and downloading documents
  - Lecture/Chapter subgroups for easy document navigation
  - Superior Doc
    - Create a summarized or combined document of all the docs in each subgroup
  - Discussion Forums
    - Can be created by students if they want to talk about certain areas within their course.
- AI Assistance
  - AI assistant that can access class chats and study notes to provide help and answer questions.

  <br> <br>

## Stretch Goals :hourglass_flowing_sand:

- OCR scanning to digitize handwritten notes
- OCR Scanner of Student’s Schedule for easier course upload
- Faculty Involvement
- Reward System for those that share their notes
- Shared whiteboards 
- Assignment Calendar

<br>

## Milestones :calendar:

<details>
  
**<summary>Week 1: Set Up :rocket:</summary>**

#### General:
- Discuss with the team who’s frontend/backend and the overall project/tech stack
- Set up communication, environments, and WhenToMeet(Link available in doc) 📆
- Go over GitHub basics
- Create a Figma account and start working on UI designs (For Everyone) 🎨
  - Start with Low Fidelity and then build up to High Fidelity

#### Backend:
- Start looking into AWS and frameworks
- Look into AWS kendra for AI

<br>
</details>
  
<details>
  
**<summary>Week 2: Further Preparations :mag:</summary>**

#### Frontend:
  - Go over some UI design basics and do’s/don’ts
  - Try to finish up the Figma Design by the end of this week

#### Backend:
- Start setting up the User Authentication and the Database. Have a working prototype by the end of the 2nd week
  - Use student email or Full Name to validate that they are a student with UTD Directory (OPT)
- Keep doing research with the AWS Tech Stack
- Start looking into superior Doc feature and start working on Amazon Kendra

<br>
</details>

<details>
  
**<summary>Weeks 3/4: Coding :technologist:</summary>**
  
#### Frontend:
- Start working on the frontend components
- Login/Create Pages
- Home Page :house:
  - Access to Course Group Chats 🧑‍🤝‍🧑
    - Allow the student to enter Course Number and section.
    - Should be able to view who all is in the GC
    - Document Sharing section
      - Has subgroups for Sections/Chapters in the Course
      - Area for Superior Doc Feature
    - Course Details
    - Access to AI Assistant 🤖
    - Access to Discussion forums
  - Access to Profile Page 🧍
    - Should be able to view their information and editable
   
#### Backend:
- Start working on live messaging
- Work on gathering all the courses from UTD Coursebook
    - Store Course Number, section, details and syllabus if available, in DB
- Course Validation
    - Students should be allowed to enter any course they want to enter, but we should validate if that course exists or not.
    - Furthermore, if possible, validate that the student belongs in that course.
- Start developing the database to hold messages and documents
- Once database is setup, start working on the superior doc feature for the docs
    - Should create two docs, a summarized doc, and a comprehensive doc.
    - Should also be able to update both docs whenever new docs are inserted.
- (OPT) Validate the Student via UTD Directory
- Keep looking into AWS Kendra, but do not implement until database and other features are set up first.

<br>
</details>

<details>

**<summary>Weeks 5/6: Middle Ground :construction:</summary>**
#### Frontend:
- Course Group Chats 🧑‍🤝‍🧑
  - Continue on working on the sections
    - Course Details
    - Messaging
    - Roster
    - Document Sharing
    - Discussion Forums
    - AI Assistance
- Profile Page 🧍
  - Has user’s information and their courses.
    - Should be editable if needed
- If not done already, create app logo!!

#### Backend:
- Start connecting pages to Database
  - Needs to have:
    - Course Group Chats messages
    - Documents
    - User’s info
    - Course Details
  - Backend and Frontend need to be able to communicate with each other before moving forward
- Once finished continue working on any remaining pages
  - Prioritize getting the Live Messaging and Superior Doc feature up and working.
  - Once completed, start working on AI Assistance.
- Home Page :house:
  - Each user should have their own listing of courses and be able to access the GC from them.
- Decide if we are going with UTD Coursebook or Nebula API on week 5 and start working on this

#### General:
- The backend team should, one at a time, start connecting the finished backend pages with the frontend. During this process, the frontend team should be testing the connection with a set of basic user cases.
- Moving in and out of pages, uploading correct and wrong information, etc.
<br>
</details>

<details>

**<summary>Weeks 7/8: Finishing Touches :checkered_flag:</summary>**

#### General:
- Finish any remaining pages and implementations by the 7th week
- Finish connecting Frontend with Backend by the 8th week
- If possible work on stretch goals
- Start looking into Presentation material and creating a script
<br>
</details>

<details>

**<summary>Weeks 9/10: Preparations :sparkles:</summary>** 

#### General:
- Prep for Presentation Night! :partying_face:
- Make sure the Slides and Demo are ready and good to go
<br>
</details>

<br>

## Tech Stack & Resources :computer:

#### React Native
- <a href="https://legacy.reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial">Setup</a>
- <a href="https://reactnative.dev/docs/environment-setup">Setting up the Environment</a>
- <a href="https://www.youtube.com/watch?v=mrjy92pW0kM">React Native #1: Setup Visual Studio Code</a>
- Drag & Drop Documents:
  - <a href="https://www.youtube.com/watch?v=8uChP5ivQ1Q">Upload Files in React - Typescript, Drag and Drop, & Form Examples</a>
- Do’s and Don'ts
  - <a href="https://www.youtube.com/watch?v=b0IZo2Aho9Y">10 React Antipatterns to Avoid - Code This, Not That!</a>

#### Node
- <a href="https://nodejs.org/en/download/prebuilt-installer">Node Download</a>
- <a href="https://www.codecademy.com/article/what-is-node">What is Node?</a>
  - This is optional but I recommend taking a look at this.

#### AWS Tech Stack
- Great Video to watch!!
  - <a href="https://www.youtube.com/watch?v=7m_q1ldzw0U">AWS Project: Architect and Build an End-to-End AWS Web Application from Scratch, Step by Step</a>

- Database/Storage:
  - <a href="https://stackoverflow.com/questions/37880961/aws-dynamodb-over-aws-s3">AWS DynamoDB over AWS S3?</a>
  - <a href="https://aws.amazon.com/dynamodb/">DynamoDB</a>
    - <a href="https://www.youtube.com/watch?v=2k2GINpO308">AWS DynamoDB Tutorial For Beginners</a>
  - <a href="https://aws.amazon.com/s3/">S3</a>
    - <a href="https://www.youtube.com/watch?v=mDRoyPFJvlU">Amazon/AWS S3 (Simple Storage Service) Basics | S3 Tutorial, Creating a Bucket | AWS for Beginners</a>
    - <a href="https://www.youtube.com/watch?v=eQAIojcArRY">Storing Images in S3 from Node Server</a>
      - Goes over how to use AWS S3 with Node

- API:
  - <a href="https://aws.amazon.com/amplify/">Amplify</a>
    - <a href="https://www.youtube.com/watch?v=kqi4gPfdVHY">Working with Data in DynamoDB from React with AWS Amplify</a>
      - This video will go over how to use DynamoDB with AWS Amplify and React.
      - 
  - <a href="https://aws.amazon.com/kendra/">Amazon Kendra</a>
    - Amazon Kendra is an advance search service that will retrieve any information based on a basic search query. This is good for if we treat our documents and chats as a knowledge base and have Kendra retrieve relevant information based off the student’s questions
    - <a href="https://www.youtube.com/watch?v=NJoEyIZ_Tas">Build an intelligent search application in a few clicks with Amazon Kendra</a>
    - <a href="https://www.youtube.com/watch?v=QqLE_8mJCR8">AWS Kendra - Enterprise Search Service | Create Index, Custom Datasource & Search Experience</a>
    
  - <a href="https://aws.amazon.com/lex/">Amazon Lex</a>
    - Amazon Lex is a conversational AI that, given any information and question, will be able to reply in a human-like manner. This is great if we combine this with Kendra to gather the important information first and then have Lex reply to the student in a conversational manner.
    - <a href="https://www.youtube.com/watch?v=RB8yw2nzA2Q&list=PLAMHV77MSKJ7s4jE7F_k_Od8qZlFGf1BY">Conversational AI and Chatbot (Amazon Lex Tutorial)</a>
    - <a href="https://www.youtube.com/watch?v=iDCWxfI2EQo">Amazon Lex: 8 Things You HAVE To Know 🔥 | AWS</a>
    
  - <a href="https://aws.amazon.com/blogs/machine-learning/integrate-amazon-kendra-and-amazon-lex-using-a-search-intent/">Integrating Kendra and Lex</a>

  - <a href="https://apify.com/?utm_term=apify&utm_campaign=US-EN+%7C+SEA+%7C+Brand&utm_source=adwords&utm_medium=ppc&hsa_acc=9303439903&hsa_cam=12208847443&hsa_grp=115467448485&hsa_ad=495840157411&hsa_src=g&hsa_tgt=kwd-401768082175&hsa_kw=apify&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gclid=CjwKCAjw2Je1BhAgEiwAp3KY76gLLgb-wTrbohek0h_HAgHMQDZ2w3sbsr5vu651dnyeRYdAiRGe0hoCI8MQAvD_BwE">Apify</a>
    - A powerful automation platform that offers ready-made scraping tools for websites like Facebook, Amazon, and Twitter, and supports JS rendering, CAPTCHA solving, and IP rotation. Use this to web scrape UTD Coursebook.
    - <a href="https://www.youtube.com/watch?v=3rrpfW0bEdc">Apify Tutorial For Beginners | How To Use Apify</a>
    - <a href="https://www.youtube.com/watch?v=K76Hib0cY0k">How to use Web Scraper from Apify to scrape any website</a>

- Servers: (Optional)
  - <a href="https://aws.amazon.com/ec2/">EC2</a>

<br>

## Alternatives 🔄

#### Flutter
- <a href="https://docs.flutter.dev/">Documentation</a>
- Installation:
  - <a href="https://www.youtube.com/watch?v=8saLa5fh0ZI">How to install flutter in windows 10</a>
- Beginners Guide:
  - <a href="https://www.youtube.com/watch?v=33kyEzDMTZU&list=PLdTodMosi-Bxf___3xPh3_NS-on4dc0sJ">How to build a Flutter Website</a>
- Basics:
  - <a href="https://www.youtube.com/watch?v=D4nhaszNW4o">Flutter Basics by a REAL Project</a>

#### MERN Stack
- This works really well with React Native and with MongoDB it can handle any form of data without any issue
- MERN Stack Playlist. It goes over how to create user authentication. Hence, I suggest looking at that portion
  - <a href="https://www.youtube.com/watch?v=P5QbE9aRCLQ&list=PLaAoUJDWH9WrPXMOkqHHsPHxbhvRDqryM">React Native & Node JS Authentication App</a>
- MongoDB Playlist:
  - <a href="https://www.youtube.com/watch?v=ExcRbA7fy_A&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA">Complete MongoDB Tutorial</a>

#### Alternatives to Amazon Kendra
- <a href="https://www.elastic.co/?utm_campaign=Google-B-Amer-US&utm_content=Brand-Core&utm_source=google&utm_medium=cpc&device=c&utm_term=elasticsearch&gad_source=1&gclid=Cj0KCQjw-uK0BhC0ARIsANQtgGO1pKPMVuSnAdgAh-VXuHT4qjSfQpXrN9Terx7H_twhS92yP3RiO34aAvX2EALw_wcB">Elasticsearch:</a>
  - Overview: Elasticsearch is a powerful open-source search engine that can index and search large volumes of data quickly.
- <a href="https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search">Azure Cognitive Search:</a>
  - Overview: A fully managed search service by Microsoft that provides AI-powered search capabilities.

#### Alternatives to Amazon Lex
- <a href="https://cloud.google.com/dialogflow">Dialogflow (by Google Cloud):</a>
  - Overview: Dialogflow is a natural language understanding platform that makes it easy to design and integrate conversational user interfaces. 
- <a href="https://dev.botframework.com/">Microsoft Bot Framework:</a>
  - Overview: A comprehensive framework for building conversational AI experiences, part of the Azure Bot Service.
 
#### Alternative to Apify/UTD Coursebook
- <a href="https://www.utdnebula.com/docs/api-docs/nebula-api">Nebula API:</a>
  - Overview: An API developed by UTD Nebula Labs that provides data regarding UTD class sections as sourced from Coursebook. 

## Roadblocks and Possible Solutions :construction: :bulb:

- Having everyone’s machine work with React.
  - If this is an issue then we can switch to Flutter and see if that works, otherwise confer with others to find a better solution that works for everyone.
- Either the Frontend or Backend team falling behind.
  - If this happens the best course would be to get some assistance from the other side until caught up
- Running into AWS Tech Stack Issues.
  - If for any reason we are having a hard time with utilizing AWS in the early stages of development then we immediately switch over to MERN as it is similar.
- Issues with Amazon Kendra or Lex
  - If we are having a hard time developing either of these two, or the cost becomes abnormally high then we switch to alternatives. If not enough available time then switch AI assistance with the next available stretch goal.

<br>

## Competition :vs:

- Blackboard, Canvas (No dedicated collaboration focus)
- Discord, Slack, GroupMe, Microsoft Teams (General communication tools)
- StudyBlue, Quizlet (Study tools without collaboration focus)
- Google Classroom (Limited collaboration features)

<br>

## Other Resources ➕
- <a href="https://code.visualstudio.com/">Visual Studio Code</a>
- <a href="https://nodejs.org/en/">Node.js</a>
- <a href="https://git-scm.com/downloads">GitHub</a> - <a href="https://docs.github.com/en/get-started/quickstart/hello-world">Docs</a> - <a href="https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners">Tutorial/a>
- <a href="https://react.dev/learn/start-a-new-react-project">React</a>

## Git Commands :notebook:

| Command                       | What it does                        |
| ----------------------------- | ----------------------------------- |
| git branch                    | lists all the branches              |
| git branch "branch name"      | makes a new branch                  |
| git checkout "branch name"    | switches to speicified branch       |
| git checkout -b "branch name" | combines the previous 2 commands    |
| git add .                     | finds all changed files             |
| git commit -m "Testing123"    | commit with a message               |
| git push origin "branch"      | push to branch                      |
| git pull origin "branch"      | pull updates from a specific branch |

<br>

## Nexus TEAM!! :partying_face: :fireworks:

- Prerita B
- Thomas Le
- Naomi Ntuli
- Indrajith Thyagaraja
