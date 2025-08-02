const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consentController');
const authMiddleware = require('../middleware/auth');

// This route allows a logged-in user to grant a specific type of consent.
router.post(
  '/',
  authMiddleware.authenticate, // Ensure the user is logged in
  consentController.grantConsent
);

module.exports = router;