const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const { messageIdRule, addVibeRules, validate } = require('../middleware/validation');

// --- Vibe Routes for Messages ---

// Add or update a vibe on a message
router.post(
    '/:messageId/vibe',
    authMiddleware.authenticate,
    messageIdRule(),
    addVibeRules(),
    validate,
    messageController.addVibeToMessage
);

// Remove a vibe from a message
router.delete(
    '/:messageId/vibe',
    authMiddleware.authenticate,
    messageIdRule(),
    validate,
    messageController.removeVibeFromMessage
);

module.exports = router;

