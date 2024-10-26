import AWS from 'aws-sdk';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

import {combineWithSuperDoc} from './gemini.service.js';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_AWS_ACCESS_ID,
    secretAccessKey: process.env.S3_AWS_SECRET_KEY,
});




/**
 * Uploads a file to AWS S3 and combines it with a super document using Gemini.
 * @param {*} file 
 * @param {*} unitid 
 * @returns {Object} Response with file URL and super document result
 */
export const uploadFileToAWS = async (file, unitid) => {
    try {
        const fileName = `${Date.now()}_${file.name}`;
        const mimetype = file.mimetype;
    
        const params = {
            Bucket: process.env.AWS_S3_PDF_BUCKET,
            Key: fileName,
            Body: file.data,
            ContentType: mimetype,
            ACL: 'public-read',
            Metadata: {
                UnitID: unitid
            }
        };
    
        const res = await s3.upload(params).promise();

        // Combine the file with a super document using Gemini
        const pdfData = await combineWithSuperDoc(file, unitid);
        const sd_params = {
            Bucket: process.env.AWS_S3_PDF_BUCKET,
            Key: unitid,
            Body: pdfData,
            ContentType: mimetype,
            ACL: 'public-read',
            Metadata: {
                UnitID: unitid
            }
        };
        const sd_res = await s3.upload(sd_params).promise();
        console.log("File Upload Successful!");
        return { fileUrl: res.Location, superdoc: sd_res.Location };
    } catch (error) {
        throw error;
    }
};

/**
 * Uploads a unit with a file to AWS S3.
 * @param {*} file 
 * @returns {Object} Response with file URL and unit ID
 */
export const uploadUnitToAWS = async (file) => {
    const fileName = `${Date.now()}`; //
    const mimetype = file.mimetype;

    const params = {
        Bucket: process.env.AWS_S3_PDF_BUCKET,
        Key: fileName,
        Body: file.data ? file.data : Buffer.from("content", 'utf-8'),
        ContentType: mimetype,
        ACL: 'public-read'
    };
    const res = await s3.upload(params).promise();

    return { fileUrl: res.Location, unitid: fileName };
};

/**
 * Checks if a file exists in the given S3 bucket.
 * @param {string} bucketName 
 * @param {string} key 
 * @returns {boolean} True if the file exists, false otherwise.
 */
export const checkIfFileExists = async (bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3.headObject(params).promise();
        console.log('File exists');

        return true;
    } catch (error) {
        if (error.code === 'NotFound') {
            console.log('File does not exist');
            return false;
        }
        throw error;
    }
};
