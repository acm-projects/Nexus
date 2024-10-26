import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * Upload file to AWS S3
 * @param {string} fileName - The name of the file to download
 * @param {string} bucket - The S3 bucket name
 * @returns {Promise<Buffer>} - The file data as a buffer
 */
export const downloadFileFromS3 = async (fileName, bucket) => {
    const params = {
        Bucket: bucket,
        Key: fileName,
    };
    const data = await s3.getObject(params).promise();
    return data.Body;
};

