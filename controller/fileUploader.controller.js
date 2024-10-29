//import fileUploadService from '../service/upload.service.js';
import {uploadUnitToAWS,uploadFileToAWS,checkIfFileExists, uploadSectionToAWS} from '../utils/service/upload.service.js';
import dotenv from 'dotenv'; 

dotenv.config();

/**
 * upload file to AWS S3
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadFileAwsCntrl = async (req, res, next) => {
    try {
        const errMsg = {
            message: 'FILES_NOT_FOUND',
            messageCode: 'FILES_NOT_FOUND',
            statusCode: 404,
        };
        let uploadRes = '';
        if(req.body.sectionId){
            uploadRes = await uploadSectionToAWS(req.body.sectionId, req.body.units);
            return res.send(uploadRes);
        }
        if (!req.files || !req.files.media) {
            return res.status(404).send(errMsg);
        }

        const file = req.files.media;
        

        // If the unitid is specified in the body, it sends the file to the file table, a unit file is uploaded to the table
        
        if (!req.body || !req.body.unitid) {
            uploadRes = await uploadUnitToAWS(file);
            return res.send(uploadRes);
        }

        // checks if the unit-id exists before using uploadfile which triggers gemini doc processing
        const unitExists = await checkIfFileExists(process.env.AWS_S3_UNIT_BUCKET, req.body.unitid);
        if (!unitExists) {
            return res.send({
                message: 'UNIT_NOT_FOUND',
                messageCode: 'UNIT_NOT_FOUND',
                statusCode: 404,
            });
        }

        uploadRes = await uploadFileToAWS(file, req.body.unitid);
        return res.send(uploadRes);

    } catch (error) {
        return next(error);
    }
};

export { uploadFileAwsCntrl };
