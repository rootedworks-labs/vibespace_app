const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const { commentIdRule, validate } = require('../middleware/validation');

// --- Vibe Routes for Comments ---

// Add or update a vibe on a comment
router.post(
  '/:commentId/vibe',
  authMiddleware.authenticate,
  commentIdRule(),
  validate,
  commentController.addVibeToComment
);

// Remove a vibe from a comment
router.delete(
  '/:commentId/vibe',
  authMiddleware.authenticate,
  commentIdRule(),
  validate,
  commentController.removeVibeFromComment
);

// --- General Comment Routes ---

// Delete a comment
router.delete(
    '/:commentId', 
    authMiddleware.authenticate, 
    commentIdRule(), 
    validate, 
    commentController.deleteComment
);

module.exports = router;