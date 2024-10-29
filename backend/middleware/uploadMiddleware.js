import multer from "multer";
import multerS3 from 'multer-s3'
import { s3, S3_BUCKET } from '../utils/awsConfig.js';

export const uploadMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
}).single('file')