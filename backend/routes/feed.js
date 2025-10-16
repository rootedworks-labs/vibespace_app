// In routes/feed.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const { validateFeedQuery } = require('../middleware/validators'); // Import the new validator

// GET the current user's activity feed
router.get(
  '/',
  authMiddleware.authenticate,
  validateFeedQuery, // Add validation for query parameters
  postController.getFeed
);

module.exports = router;