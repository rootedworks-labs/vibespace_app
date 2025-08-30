const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const vibeController = require('../controllers/vibeController'); // 1. Import vibeController
// const likeController = require('../controllers/likeController'); // 2. Remove likeController
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPostRules, createCommentRules, postIdRule, commentIdRule, validate } = require('../middleware/validation');

// --- Post Routes ---
// (These routes remain unchanged)
router.get('/', postController.getPosts);
router.get('/:postId', postIdRule(), validate, postController.getPostById);
router.post('/', authMiddleware.authenticate, upload.single('media'), createPostRules(), validate, postController.createPost);
router.delete('/:postId', authMiddleware.authenticate, postIdRule(), validate, postController.deletePost);


// --- 3. Replace Like Routes with Vibe Routes ---

// POST (add or update) a vibe on a post
router.post(
  '/:postId/vibes',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  vibeController.addVibe
);

// DELETE (remove) a vibe from a post
router.delete(
  '/:postId/vibes',
  authMiddleware.authenticate,
  postIdRule(),
  validate,
  vibeController.removeVibe
);


// --- Comment Routes ---
// (These routes remain unchanged)
router.get('/:postId/comments', postIdRule(), validate, commentController.getCommentsForPost);
router.post('/:postId/comments', authMiddleware.authenticate, postIdRule(), createCommentRules(), validate, commentController.createComment);
router.delete('/comments/:commentId', authMiddleware.authenticate, commentIdRule(), validate, commentController.deleteComment);


module.exports = router;