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
    const data = await dynamodb.get(params).promise();
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
    await dynamodb.put(params).promise();
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
    Key: { userId }, // Only use userId as the key
    UpdateExpression: "SET assignments = list_append(if_not_exists(assignments, :empty_list), :a)",
    ExpressionAttributeValues: {
      ":a": [{ assignmentName, score }],
      ":empty_list": [] // This initializes assignments if it does not exist
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamodb.update(params).promise();
    res.status(200).send('Assignment added.');
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Route to calculate average and overall grade
router.get('/calculateGrade', async (req, res) => {
  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ message: 'Missing required query parameter: userId' });
  }

  const params = {
    TableName: 'GradesDB',
    KeyConditionExpression: 'userId = :u', // Only query using userId
    ExpressionAttributeValues: {
      ':u': userId,
    },
  };

  try {
    const data = await dynamodb.query(params).promise();
    let overallGrade = 0;

    // Iterate through the returned items to calculate the overall grade
    for (const category of data.Items) {
      const totalScore = category.assignments.reduce((acc, a) => acc + a.score, 0);
      const average = totalScore / (category.assignments.length || 1); // Prevent division by zero
      const weightedScore = average * category.categoryWeight;
      overallGrade += weightedScore;

      // Update category average logic (if needed)
      const updateParams = {
        TableName: 'GradesDB',
        Key: { userId }, 
        UpdateExpression: "SET categoryAverage = :avg",
        ExpressionAttributeValues: {
          ":avg": average,
        },
      };
      await dynamodb.update(updateParams).promise();
    }
    
    res.status(200).send({ overallGrade });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.post('/updateOverallGrade', async (req, res) => {
  const { userId, courseId, overallGrade } = req.body;

  // Validate input
  if (!userId || !courseId || overallGrade === undefined) {
    return res.status(400).json({
      message: 'Missing required fields: userId, courseId, and overallGrade are required'
    });
  }

  const params = {
    TableName: 'GradesDB',
    Key: {userId },
    UpdateExpression: 'SET overallGrade = :grade, lastUpdated = :timestamp',
    ExpressionAttributeValues: {
      ':grade': parseFloat(overallGrade),
      ':timestamp': new Date().toISOString()
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamodb.update(params).promise();
    
    res.status(200).json({
      message: 'Overall grade updated successfully',
      updatedGrade: result.Attributes.overallGrade
    });
  } catch (error) {
    console.error('Error updating overall grade:', error);
    res.status(500).json({
      message: 'Error updating overall grade',
      error: error.message
    });
  }
});

// Add to your existing routes file
router.post('/updateCategoryAverage', async (req, res) => {
  const { userId, courseId, categoryName, categoryAverage } = req.body;

  const params = {
      TableName: 'GradesDB',
      Key: { userId },
      UpdateExpression: 'SET categoryAverage = :avg',
      ExpressionAttributeValues: {
          ':avg': parseFloat(categoryAverage)
      },
      ReturnValues: 'UPDATED_NEW'
  };

  try {
      const result = await dynamodb.update(params).promise();
      res.status(200).json({
          message: 'Category average updated successfully',
          updatedAverage: result.Attributes.categoryAverage
      });
  } catch (error) {
      console.error('Error updating category average:', error);
      res.status(500).json({
          message: 'Error updating category average',
          error: error.message
      });
  }
});

export default router