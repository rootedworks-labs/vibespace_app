// In routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // Import the upload middleware
const { createPostRules, createCommentRules, postIdRule, commentIdRule, validate } = require('../middleware/validation');

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
  upload.single('media'), // Use multer to handle a single file upload with the field name 'media'
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

// --- Comment Routes ---
// GET all comments for a post
router.get(
  '/:postId/comments',
  postIdRule(),
  validate,
  commentController.getCommentsForPost
);

// POST a new comment on a post (protected)
router.post(
  '/:postId/comments',
  authMiddleware.authenticate,
  postIdRule(),
  createCommentRules(),
  validate,
  commentController.createComment
);

// DELETE a comment that you own (protected)
// Note: This route is structured differently as it acts on a specific comment, not a post.
router.delete(
  '/comments/:commentId',
  authMiddleware.authenticate,
  commentIdRule(),
  validate,
  commentController.deleteComment
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
