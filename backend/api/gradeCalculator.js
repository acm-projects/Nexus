import express from "express";
import { Router } from "express";
import { dynamodb } from "../utils/awsConfig.js";
import calculateFinalGrade from "../utils/gradeCalculations.js";

const router = Router()

/*router.post('/', (req, res) => {

  const { grades } = req.body

  if (!grades || !Array.isArray(grades)) {
    return res.status(400).json({message: 'Grades data is not formatted properly'})
  }

  try {

    const totalGrade = calculateFinalGrade(grades)
    res.status(200).json({ totalGrade })

  }
  catch(error) {
    return res.status(500).json({message: 'Error: Unable to calculate grade.', error: error.message})
  }
})*/

// Route to get courses and their courseId for a specific user
router.get('/getCourses', async (req, res) => {
  const { userId } = req.query;

  const params = {
    TableName: 'OnboardingDB', 
    Key: { userId },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    const courses = data.Item.courses

    const courseIds = courses.map(course => {
      return {
        courseId: `${course.courseCode}-${course.courseNumber}-${course.ProfName}-${course.sectionCode}`,
        courseDetails: course
      };
    });

    res.status(200).send({ courseIds })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


// Route to add category
router.post('/addCategory', async (req, res) => {
  const { userId, courseId, categoryName, categoryWeight } = req.body

  const decimalWeight = categoryWeight > 1 ? categoryWeight / 100 : categoryWeight;
  
  const params = {
    TableName: 'GradesDB',
    Item: {
      userId,
      courseId,
      categoryName,
      categoryWeight: decimalWeight,
      assignments: [],
      categoryAverage: 0,
    },
  }

  try {
    await dynamoDb.put(params).promise();
    res.status(200).send('Category added.');
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// Route to add assignment score
router.post('/addAssignment', async (req, res) => {
  const { userId, courseId, categoryName, assignmentName, score } = req.body;

  const params = {
    TableName: 'GradesDB',
    Key: { userId, courseId, categoryName },
    UpdateExpression: "SET assignments = list_append(assignments, :a)",
    ExpressionAttributeValues: {
      ":a": [{ assignmentName, score }],
    },
    ReturnValues: "UPDATED_NEW",
  }

  try {
    await dynamoDb.update(params).promise();
    res.status(200).send('Assignment added.');
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Route to calculate average and overall grade
router.get('/calculateGrade', async (req, res) => {
  const { userId, courseId } = req.query;

  const params = {
    TableName: 'GradesDB',
    KeyConditionExpression: 'userId = :u and courseId = :c',
    ExpressionAttributeValues: {
      ':u': userId,
      ':c': courseId,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    let overallGrade = 0
    
    data.Items.forEach(category => {
      const totalScore = category.assignments.reduce((acc, a) => acc + a.score, 0);
      const average = totalScore / category.assignments.length;
      const weightedScore = average * category.categoryWeight;
      overallGrade += weightedScore
      
      // Update category average
      const updateParams = {
        TableName: 'GradesDB',
        Key: { userId, courseId, categoryName: category.categoryName },
        UpdateExpression: "SET categoryAverage = :avg",
        ExpressionAttributeValues: {
          ":avg": average,
        },
      };
      dynamoDb.update(updateParams).promise();
    });
    
    res.status(200).send({ overallGrade })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


export default router