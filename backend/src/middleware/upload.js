const multer = require('multer');
const path = require('path');

// Set up storage using memory storage
const storage = multer.memoryStorage();

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only PDF files are allowed!'));
};

// Configure upload middleware (memory storage for GridFS - buffer is uploaded to MongoDB)
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: (parseInt(process.env.UPLOAD_LIMIT, 10) || 10) * 1024 * 1024 // Default 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload; 