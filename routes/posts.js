// In routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController'); // Import the new controller
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

// --- Like Routes ---

// POST (like) a post
router.post(
  '/:postId/like',
  authMiddleware.authenticate,
  likeController.likePost
);

// DELETE (unlike) a post
router.delete(
  '/:postId/like',
  authMiddleware.authenticate,
  likeController.unlikePost
);

module.exports = router;