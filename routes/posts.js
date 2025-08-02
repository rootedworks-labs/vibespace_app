// In routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth'); // Import auth middleware for protected routes

// --- Post Routes ---

// GET all posts (public)
router.get(
    '/', 
    postController.getPosts
);

// GET a single post by its ID (public)
router.get(
  '/:postId',
  postController.getPostById
);

// POST (create) a new post (protected)
router.post(
  '/',
  authMiddleware.authenticate,
  postController.createPost
);

// DELETE a post that you own (protected)
router.delete(
  '/:postId',
  authMiddleware.authenticate,
  postController.deletePost
);

module.exports = router;
