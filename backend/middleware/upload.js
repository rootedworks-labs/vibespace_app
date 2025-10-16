// middleware/upload.js
const multer = require('multer');
const { sanitizeFilename } = require('../utils/gdprUtils');

const storage = multer.memoryStorage(); // Process files in memory

const fileFilter = (req, file, cb) => {
  // Allow only images and PDFs
  if (/^image\/(jpe?g|png|webp)$|^application\/pdf$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

module.exports = upload;