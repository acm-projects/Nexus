import { dynamodb } from "./awsConfig.js";
import  { v4 as uuidv4 } from 'uuid';


export async function getUserData(userId) {
  const params = {
    TableName: 'UserDB',
    Key: { userId: userId }
  }

  const result = await dynamodb.get(params).promise()
  return result.Item;
}

export async function getUserCourses(userId) {
  const params = {
    TableName: 'OnboardingDB',
    Key: { userId: userId }
  }

  const result = await dynamodb.get(params).promise()

  const courses = result.Item.courses;
  console.log("Courses from DynamoDB:", courses); // Check if sectionCode exists in each course

  return result.Item.courses
}

export function generateRoomName(courseCode, courseNumber, sectionCode) {
  const base = `${courseCode} ${courseNumber}`
  return sectionCode ? `${base}.${sectionCode}` : base
}

export async function createOrGetChatRoom(roomName) {
  const params = {
    TableName: 'ChatRooms',
    IndexName: 'roomNameIndex',
    KeyConditionExpression: 'roomName = :roomName',
    ExpressionAttributeValues: {
      ':roomName': roomName
    }
  };

  const result = await dynamodb.query(params).promise();

  if (result.Items && result.Items.length > 0) {
    return result.Items[0];
  } else {
    const newRoom = {
      roomId: uuidv4(),
      roomName,
      createdAt: new Date().toISOString(),
      members: []
    }

    await dynamodb.put({
      TableName: 'ChatRooms',
      Item: newRoom
    }).promise()

    return newRoom
  }
}

export async function addUserToChatRoom(roomId, userId) {
  const params = {
    TableName: 'ChatRooms',
    Key: { roomId },
    UpdateExpression: 'SET members = list_append(if_not_exists(members, :emptyList), :userId)',
    ExpressionAttributeValues: {
      ':userId': [userId], 
      ':emptyList': []    
    }
  };

  await dynamodb.update(params).promise();
}

export async function onboardUser(userId, firstName, lastName, username, courses) {
  try {
    
    const onboardingParams = {
      TableName: 'OnboardingDB',
      Item: {
        userId,
        firstName,
        lastName,
        username,
        courses,
        onboardingCompleted: true,
        createdAt: new Date().toISOString()
      }
    };
    await dynamodb.put(onboardingParams).promise()

    for (const course of courses) {
      const { courseCode, courseNumber, courseSection} = course
      console.log("Course Section:", courseSection);
      
      const generalRoomName = generateRoomName(courseCode, courseNumber)
      const sectionRoomName = generateRoomName(courseCode, courseNumber, courseSection)
      console.log(generateRoomName(courseCode, courseNumber, courseSection)); // Check if the room name includes the section code


      const generalRoom = await createOrGetChatRoom(generalRoomName)
      await addUserToChatRoom(generalRoom.roomId, userId)

      const sectionRoom = await createOrGetChatRoom(sectionRoomName)
      await addUserToChatRoom(sectionRoom.roomId, userId)
    }

    return { success: true, message: 'User onboarded successfully and added to chat rooms' }
  } catch (error) {
    console.error(`Onboarding error: ${error}`);
    return { success: false, message: 'Unable to complete user onboarding', error: error.message }
  }
}

export const getSectionChatRooms = async (req, res) => {
  const { userId } = req.params;

  try {
      // Step 1: Fetch the user's courses using helper
      const userCourses = await getUserCourses(userId);
      
      if (!userCourses || userCourses.length === 0) {
          return res.status(404).json({ message: "No courses found for the user." });
      }

      // Step 2: Prepare a DynamoDB query to fetch chat rooms
      const courseRoomIds = userCourses.map(course => `${course.courseCode}.${course.courseNumber}.${course.sectionCode}`);

      // Use a batch query to get all relevant rooms
      const params = {
          RequestItems: {
              'ChatRooms': {
                  Keys: courseRoomIds.map(roomId => ({ roomId })),
              },
          },
      };

      // Step 3: Execute the query
      const data = await dynamodb.batchGet(params).promise();

      if (!data || data.Responses.ChatRooms.length === 0) {
          return res.status(404).json({ message: "No chat rooms found for the user." });
      }

      // Step 4: Return the filtered chat rooms
      return res.status(200).json({ chatRooms: data.Responses.ChatRooms });
  } catch (error) {
      console.error('Error fetching section chat rooms:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
  }
};