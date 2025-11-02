const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validation'); // Assuming validation middleware is in this file

// Note: All routes here are authenticated as you must be logged in to manage requests

/**
 * GET /api/follow-requests
 * Retrieves all pending follow requests for the authenticated user.
 */
router.get(
  '/',
  authMiddleware.authenticate,
  followController.getFollowRequests
);

/**
 * POST /api/follow-requests/approve
 * Approves a pending follow request.
 * Body: { "followerId": 123 }
 */
router.post(
  '/approve',
  authMiddleware.authenticate,
  validate, // Add any validation rules if needed, e.g., check('followerId').isInt()
  followController.approveFollowRequest
);

/**
 * POST /api/follow-requests/deny
 * Denies or ignores a pending follow request.
 * Body: { "followerId": 123 }
 */
router.post(
  '/deny',
  authMiddleware.authenticate,
  validate, // Add any validation rules if needed
  followController.denyFollowRequest
);

module.exports = router;
