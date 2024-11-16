import AWS from 'aws-sdk'
import dotenv from 'dotenv' 

dotenv.config()

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const S3_BUCKET = 'nexus-course-documents'
const ChatMessagesTable = 'ChatMessages'


/*export async function saveMessage(roomId, userId, content, type = 'text') {
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
}*/

export const saveMessage = async (roomId, userId, message, type = 'text', username) => {
  const params = {
    TableName: ChatMessagesTable,
    Item: {
      messageId: `${Date.now()}-${userId}`,
      roomId,
      userId,
      username, 
      message,
      type,
      timestamp: Date.now()
    }
  };

  try {
    await dynamodb.put(params).promise();
    return params.Item;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export async function fetchMessages(roomId, limit = 50) {
  const params = {
      TableName: ChatMessagesTable,
      KeyConditionExpression: 'roomId = :roomId',
      ExpressionAttributeValues: {
          ':roomId': roomId
      },
      ScanIndexForward: false,
      Limit: limit
  };

  try {
      const result = await dynamodb.query(params).promise();
      // Add error checking for empty results
      if (!result.Items) {
          console.log('No messages found for room:', roomId);
          return [];
      }
      return result.Items.reverse(); // reverse to get oldest messages first
  } catch (error) {
      console.error('Error in fetchMessages:', error);
      throw error; 
  }
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