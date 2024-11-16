import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nexus-course-documents',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `${uuidv4()}.${fileExtension}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // limit file size to 5MB
  }
});

export default upload;