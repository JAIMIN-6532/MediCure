import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


// Multer storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
         let uploadPath = '';

    if (file.fieldname === 'images') {
      uploadPath = 'public/uploads/images';
    } else if (file.fieldname === 'id') {
      uploadPath = 'public/uploads/id';
    } else if (file.fieldname === 'degree') {
      uploadPath = 'public/uploads/degree';
    }
    cb(null,uploadPath);
    },
    filename: (req, file, cb) => {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },

})

// Multer instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size for each file
});

// Middleware to handle multiple fields (image, id_pdf, and degree_pdf)
export const uploadFiles = upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'id', maxCount: 1 },
  { name: 'degree', maxCount: 1 },
]);
