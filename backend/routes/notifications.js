// In routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// GET all notifications for the current user
router.get('/', authMiddleware.authenticate, notificationController.getNotifications);

// PATCH to mark all notifications as read
router.patch('/read', authMiddleware.authenticate, notificationController.markNotificationsAsRead);

module.exports = router;