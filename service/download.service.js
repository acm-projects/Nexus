const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const dotenv = require("dotenv");
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * upload file to aws s3
 * @param {*} file
 */
async function downloadFileFromS3(fileName){
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
          };
          const data = await s3.getObject(params).promise();
          return data.Body;
}


module.exports= {
    downloadFileFromS3,
};