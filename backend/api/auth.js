import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { dynamodb } from '../utils/awsConfig.js';
import { Router } from "express";
import  { v4 as uuidv4 } from 'uuid'
import { onboardUser } from '../utils/onboardingHelpers.js';

const router = Router()

router.post('/register', async (req, res) => {
  
  try {

    const { email, password, firstName, lastName, username, userCourses } = req.body
  
  if (!email || !password || !firstName || !lastName || !username || !Array.isArray(userCourses)) {
    return res.status(400).json({message: 'All fields must be filled out'})
  }

  const existingUserParams = {
    TableName: 'UserDB',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  }

  const existingUser = await dynamodb.query(existingUserParams).promise();
  if (existingUser.Items && existingUser.Items.length > 0) {
    return res.status(409).json({message: 'User already exists'});
  }

  const userId = uuidv4()
  const hashPassword = await bcrypt.hash(password, 12)

  const params = {
    TableName: 'UserDB',
    Item: {
      userId: userId,
      email: email,
      password: hashPassword
    }
  }

  await dynamodb.put(params).promise()

  const courses = userCourses.map(course => {
    const { courseCode, courseNumber, courseSection, profName } = course;
    
    
    const courseId = profName 
      ? `${courseCode}-${courseNumber}-${profName}-${courseSection}` 
      : `${courseCode}-${courseNumber}-${courseSection}`;

    return {
      courseCode,
      courseNumber,
      courseSection,
      profName: profName || null,  
      courseId,  
    }
  })

  const onboardingParams = {
    TableName: 'OnboardingDB',
    Item: {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      username: username,
      courses: courses
    }
  }

  await dynamodb.put(onboardingParams).promise()


  const result = await onboardUser(userId, firstName, lastName, username, courses)

  if (result.success) {
    const token = jwt.sign({ userId: userId },'urmummy', { expiresIn: '1h' });
    return res.status(201).json({ message: 'User created successfully', token: token });
  } else {
    // If onboarding fails, delete the user from both UserDB and OnboardingDB
    const deleteUserParams = {
      TableName: 'UserDB',
      Key: { userId: userId }
    };
    const deleteOnboardingParams = {
      TableName: 'OnboardingDB',
      Key: { userId: userId }
    };
    await Promise.all([
      dynamodb.delete(deleteUserParams).promise(),
      dynamodb.delete(deleteOnboardingParams).promise()
    ]);
    return res.status(500).json({ message: result.message, error: result.error });
  }


  }
  catch (error) {
    console.log(`Error: ${error}`)
    return res.status(500).json({ message: 'Unable to register user' });
  }
})

router.post('/login', async (req, res) => {
  
  try {

    const { email, password } = req.body

    const params = {
      TableName: 'UserDB',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }
  
    const user = await dynamodb.query(params).promise();

    if (!user.Items[0]) {
      return res.status(404).json({ message: 'User not found' })
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.Items[0].password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
  
    const token = jwt.sign({ userId: user.Items[0].userId }, 'urmummy')

    return res.status(200).json({ token })

  }
  catch (error) {
    console.log(`Error: ${error}`)
    return res.status(500).json({message: 'Unable to login user'})
  }
})

router.post('/onboarding', async (req, res) => {
  try {
    const { userId, firstName, lastName, username, courses } = req.body

    if (!userId || !firstName || !lastName || !username || !Array.isArray(courses)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const result = await onboardUser(userId, firstName, lastName, username, courses);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(500).json({ message: result.message, error: result.error });
    }
  }
  catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ message: 'Unable to complete user onboarding' });
  }
})





export default router;