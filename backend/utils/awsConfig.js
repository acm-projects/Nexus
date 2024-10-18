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



export async function saveMessage(roomId, userId, message) {
  const params = {
    TableName: ChatMessagesTable,
    Item: {
      roomId: roomId,
      timestamp: Date.now(),
      userId: userId,
      message: message
    }
  }
  await dynamodb.put(params).promise()
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

export { dynamodb, s3, S3_BUCKET }