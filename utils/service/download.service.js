import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


AWS.config.update({
    region: process.env.S3_AWS_REGION,
    accessKeyId: process.env.S3_AWS_ACCESS_ID,
    secretAccessKey: process.env.S3_AWS_SECRET_KEY
  })

  
const s3 = new AWS.S3();

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const generatePresignedUrl = async (unitid) => {
    const params = {
      Bucket: 'fileuploadbucket-nexus',
      Key: unitid,
      Expires: 300 // URL valid for 5 minutes
    };
  
    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw error;
    }
  };

  export const getSection = async (sectionId) => {
    const params = {
      TableName: 'SectionDB',
      Key: { sectionId } // Shorthand property syntax
    };
  
    try {
      const result = await dynamodb.get(params).promise();
  
      if (!result.Item) {
        throw new Error('Section not found');
      }
      console.log(result.Item);
      console.log(result.Item.sectionId);
      console.log(result.Item.units);
      return result.Item;
    } catch (error) {
      console.error(`Error retrieving section: ${error}`);
      throw error; // Rethrow the error to handle it in your API
    }
  };

  export const downloadFileFromS3 = async (fileName, bucket) => {
    const params = {
        Bucket: bucket,
        Key: fileName,
    };
    const data = await s3.getObject(params).promise();
    return data.Body;
};