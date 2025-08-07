// In routes/consents.js
const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consentController');
const authMiddleware = require('../middleware/auth');
const { grantConsentRules, validate } = require('../middleware/validation');

// This route allows a logged-in user to grant a specific type of consent.
router.post(
  '/',
  authMiddleware.authenticate, // Ensure the user is logged in
  grantConsentRules(),
  validate,
  consentController.grantConsent
);

module.exports = router;