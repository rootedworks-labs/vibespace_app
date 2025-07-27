// In routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Protected route - requires valid JWT
router.get('/me', authMiddleware.authenticate, userController.getCurrentUser);

router.get('/', userController.getUsers);

module.exports = router;