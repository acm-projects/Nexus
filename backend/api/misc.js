import express from "express";
import { dynamodb } from "../utils/awsConfig.js";
import jwt from 'jsonwebtoken';

const router = express.Router()

router.get('/getOnboardedCourses', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'urmummy');
    const userId = decoded.userId;

    const params = {
      TableName: 'OnboardingDB',
      Key: { userId }
    };

    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ courses: result.Item.courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch user courses' });
  }
});

export default router