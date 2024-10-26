//import fileUploadService from '../service/upload.service.js';
import {uploadUnitToAWS,uploadFileToAWS,checkIfFileExists} from '../utils/service/upload.service.js';

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
        if (!req.files || !req.files.media) {
            return res.status(404).send(errMsg);
        }

        const file = req.files.media;
        let uploadRes = '';

        // If the unitid is specified in the body, it sends the file to the file table, a unit file is uploaded to the table
        if (!req.body) {
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
