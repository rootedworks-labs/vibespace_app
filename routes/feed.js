// In routes/feed.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// GET the current user's activity feed
router.get(
  '/',
  authMiddleware.authenticate,
  postController.getFeed
);

module.exports = router;