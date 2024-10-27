//import fileUploadService from '../service/upload.service.js';
import {downloadFileFromS3, generatePresignedUrl,getSection} from '../utils/service/download.service.js';
import dotenv from 'dotenv'; 

dotenv.config();

/**
 * upload file to AWS S3
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const downloadFileCntrl = async (req, res, next) => {
    try {
        if(!req.body.unitid && !req.body.sectionId){
            res.send({
                statusCode: 404, 
                errorMessage: "Neither unitid nor sectionId is defined"
            })
        }
        if(req.body.unitid){
            const urlRes =  await generatePresignedUrl(req.body.unitid);
            res.send({
                statusCode: 200, 
                presignedUrl: urlRes
            });
            return;
        }
        if(req.body.sectionId){ 
            section_object = await getSection(req.body.sectionId);
            res.send({
                statusCode: 200, 
                object: section_object
            });
            return;
        }
    } catch (error) {
        return next(error);
    }
};


export { downloadFileCntrl };
