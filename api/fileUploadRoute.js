
import express from 'express';
import fileUpload from 'express-fileupload';
import {uploadFileAwsCntrl} from '../controller/fileUploader.controller.js';

const router = express.Router();


router.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
}));

router
    .route('/s3')
    /** POST http://localhost:3000/upload/s3 - upload files to aws s3 bucket */
    .post(uploadFileAwsCntrl);

export default router;