const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const vibeController = require('../controllers/vibeController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPostRules, createCommentRules, postIdRule, validate } = require('../middleware/validation');

// --- Post Routes ---
router.get('/', postController.getPosts);
router.get('/:postId', postIdRule(), validate, postController.getPostById);
router.post('/', authMiddleware.authenticate, upload.single('media'), createPostRules(), validate, postController.createPost);
router.delete('/:postId', authMiddleware.authenticate, postIdRule(), validate, postController.deletePost);

// --- Vibe Routes for Posts ---
router.post(
  '/:postId/vibes',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  vibeController.addVibe
);

router.delete(
  '/:postId/vibes',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  vibeController.removeVibe
);

// --- Comment Routes for a specific Post ---
router.get('/:postId/comments', postIdRule(), validate, commentController.getCommentsForPost);
router.post('/:postId/comments', authMiddleware.authenticate, postIdRule(), createCommentRules(), validate, commentController.createComment);

module.exports = router;