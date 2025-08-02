// In routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules, validate } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter'); // Added

// Updated this route to include the rate limiter
router.post(
  '/register',
  authLimiter, // Added
  registerRules(),
  validate,
  authController.registerUser
);

// Updated this route to include the rate limiter
router.post(
  '/login',
  authLimiter, // Added
  loginRules(),
  validate,
  authController.login
);

router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

module.exports = router;