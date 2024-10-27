import AWS from 'aws-sdk'
import dotenv from 'dotenv'; 
dotenv.config()


console.log("AWSKey: ",process.env.S3_AWS_ACCESS_ID);
console.log("AWSSecret: ", process.env.S3_AWS_SECRET_KEY);
AWS.config.update({
  region: process.env.S3_AWS_REGION,
  accessKeyId: process.env.S3_AWS_ACCESS_ID,
  secretAccessKey: process.env.S3_AWS_SECRET_KEY
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const S3_BUCKET = 'nexus-course-documents'
const ChatMessagesTable = 'ChatMessages'


export async function saveMessage(roomId, userId, content, type = 'text') {
  const params = {
    TableName: ChatMessagesTable,
    Item: {
      messageId: Date.now().toString(),
      roomId: roomId,
      userId: userId,
      message: content,
      timestamp: Date.now(),
      type: type
    }
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function fetchMessages(roomId, limit = 50) {
  const params = {
    TableName: ChatMessagesTable,
    KeyConditionExpression: 'roomId = :roomId',
    ExpressionAttributeValues: {
      ':roomId': roomId
    },
    ScanIndexForward: false, 
    Limit: limit
  }

  const result = await dynamodb.query(params).promise()
  return result.Items.reverse() // reverse to get the oldest messages first
}

export async function getChatRoom(roomId) {
  const params = {
    TableName: 'ChatRooms',
    Key: { roomId: roomId } // Ensure the key structure matches your table schema
  };

  try {
    const result = await dynamodb.get(params).promise(); // Using DocumentClient's get method

    if (!result.Item) {
      throw new Error('Chat room not found');
    }

    const chatRoom = {
      roomId: result.Item.roomId, // Assuming roomId is a string in DocumentClient
      roomName: result.Item.roomName,
      createdAt: result.Item.createdAt,
      members: result.Item.members ? result.Item.members : [] // Handle the case where members might be undefined
    };

    return chatRoom;
  } catch (error) {
    console.error(`Error retrieving chat room: ${error}`);
    //throw error; // Rethrow the error to handle it in your API
  }
}

export { dynamodb, s3, S3_BUCKET }