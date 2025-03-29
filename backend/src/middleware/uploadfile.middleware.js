
  import multer from 'multer';
  import path from 'path';

  // multer configuration for temporary file storage (on disk)
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // local folder to store files temporarily
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  const upload = multer({ storage: storage });

  export default upload;
