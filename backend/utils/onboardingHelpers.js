import { dynamodb } from "./awsConfig.js";
import  { v4 as uuidv4 } from 'uuid';

/*export const getGroupsByCourseId = async (courseId, groupType) => {
  const params = {
    TableName: 'OnboardingDB',
    Key: {
      courseId,
      groupType
    }
  }

  const result = await dynamodb.get(params).promise()
  return result.Item

}

export const createGroup = async (courseId, groupType) => {
  const newGroup = {
    courseId,
    groupType,
    members: []
  }

  const params = {
    TableName: 'OnboardingDB',
    Item: newGroup
  }

  await dynamodb.put(params).promise()
  return newGroup
}

export const addUserToGroup = async (courseId, userId) => {
  try {
    const params = {
      TableName: 'OnboardingDB',
      Key: { courseId },
      UpdateExpression: 'ADD members :userId',
      ExpressionAttributeValues: {
        ':userId': dynamodb.createSet([userId])
      }
    }

    await dynamodb.update(params).promise();
    console.log(`User ${userId} added to group ${courseId}`)

  } catch (error) {
    console.log(`Failed to add user to group: ${error}`)
  }
}

export const onboardUserToGroups = async (userId, courses) => {
  for (let course of courses) {
    const { courseCode, courseNumber, sectionCode, professorName } = course
    const courseId = `${courseCode}_${professorName}`
    const sectionId = `${courseId}_${sectionCode}`

    // General chat for the course
    let generalChatGroup = await getGroupsByCourseId(courseId, 'general')
    if (!generalChatGroup) {
      generalChatGroup = await createGroup(courseId, 'general')
    }
    await addUserToGroup(generalChatGroup.courseId, userId)

    // Section-specific chat
    let sectionChatGroup = await getGroupsByCourseId(sectionId, 'section')
    if (!sectionChatGroup) {
      sectionChatGroup = await createGroup(sectionId, 'section')
    }
    await addUserToGroup(sectionChatGroup.courseId, userId)
  }
}
*/

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
  return result.Item.courses
}

export function generateRoomName(courseCode, courseNumber, professorName, sectionCode = null) {
  const base = `${professorName} ${courseCode} ${courseNumber}`
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
      const { courseCode, courseNumber, sectionCode, professorName } = course
      
      const generalRoomName = generateRoomName(courseCode, courseNumber, professorName)
      const sectionRoomName = generateRoomName(courseCode, courseNumber, professorName, sectionCode)

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