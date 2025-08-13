// In routes/waitlist.js
const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');
const { waitlistRules, validate } = require('../middleware/validation');

// Handle POST requests to /api/waitlist
router.post(
    '/',
    waitlistRules(), // Apply validation rules
    validate,        // Handle any validation errors
    waitlistController.subscribe
);

module.exports = router;
