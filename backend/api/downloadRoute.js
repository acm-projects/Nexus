
import express from 'express';
import fileUpload from 'express-fileupload';
import {downloadFileCntrl} from '../controller/fileDownloader.controller.js';

const router = express.Router();


router.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
}));

router
    .route('/aws')
    .post(downloadFileCntrl);

export default router;