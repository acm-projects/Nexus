import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const S3_BUCKET = 'nexus-course-documents'
const ChatMessagesTable = 'ChatMessages'



export async function saveMessage(roomId, userId, content, type = 'text') {
  const params = {
    TableName: ChatMessagesTable,
    Item: {
      roomId: roomId,
      timestamp: Date.now(),
      userId: userId,
      content: content,
      type: type
    }
  };

  await dynamodb.put(params).promise();
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