// In routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController'); // Import the new controller
const authMiddleware = require('../middleware/auth'); // Import auth middleware for protected routes
const { createPostRules, postIdRule, validate } = require('../middleware/validation');

// --- Post Routes ---

// GET all posts (public)
router.get(
    '/',
    postController.getPosts
);

// GET a single post by its ID (public)
router.get(
  '/:postId',
  postIdRule(),
  validate,
  postController.getPostById
);

// POST (create) a new post (protected)
router.post(
  '/',
  authMiddleware.authenticate,
  createPostRules(),
  validate,
  postController.createPost
);

// DELETE a post that you own (protected)
router.delete(
  '/:postId',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  postController.deletePost
);

// --- Like Routes ---

// POST (like) a post
router.post(
  '/:postId/like',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  likeController.likePost
);

// DELETE (unlike) a post
router.delete(
  '/:postId/like',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  likeController.unlikePost
);

module.exports = router;