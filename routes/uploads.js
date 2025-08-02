// routes/uploads.js
const express = require('express');
const router = express.Router();

// Correctly import all required middleware
const authMiddleware = require('../middleware/auth'); // Added
const consentMiddleware = require('../middleware/consent'); // Added
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

router.post(
  '/',
  // The middleware now runs in the correct, secure order
  authMiddleware.authenticate,                  // 1. Check if the user is logged in
  consentMiddleware.checkConsent('file_upload'),// 2. Check if they have given consent
  upload.single('file'),                        // 3. Process the file upload
  uploadController.uploadFile                   // 4. Pass to the final controller logic
);

module.exports = router;