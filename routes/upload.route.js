
import express from 'express';
import fileUpload from 'express-fileupload';
import {uploadFileAwsCntrl} from '../controller/uploader.controller.js';

const router = express.Router();


router.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
}));

router
    .route('/aws')
    /** POST http://localhost:3000/upload/aws - upload files to aws s3 bucket */
    .post(uploadFileAwsCntrl);

export default router;