// In routes/conversations.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const { sendMessageRules, conversationIdRule, createConversationRules, validate } = require('../middleware/validation');

// --- Conversation Routes ---

// Start a new conversation
router.post(
    '/',
    authMiddleware.authenticate,
    createConversationRules(),
    validate,
    messageController.createConversation
);

// Get all of the current user's conversations
router.get(
    '/',
    authMiddleware.authenticate,
    messageController.getConversations
);

// --- Message Routes ---

// Get all messages for a specific conversation
router.get(
    '/:conversationId/messages',
    authMiddleware.authenticate,
    conversationIdRule(),
    validate,
    messageController.getMessagesForConversation
);

// Send a new message in a conversation
router.post(
    '/:conversationId/messages',
    authMiddleware.authenticate,
    conversationIdRule(),
    sendMessageRules(),
    validate,
    messageController.sendMessage
);

module.exports = router;
