const express = require('express');
const router = express.Router();
// Import the optional auth middleware
const authMiddleware = require('../middleware/auth'); 
// Import the *actual* post controller
const postController = require('../controllers/postController');

/**
 * A handler to map the URL parameter to a query string parameter.
 * This allows us to re-use the existing getFeed function.
 */
const getVibeFeed = (req, res, next) => {
  // 1. Get the channel type from the URL parameter (e.g., "flow")
  const { vibeType } = req.params;
    console.log(vibeType);
  // 2. Create a req.query object and add the tag
  //    This makes it look like the request was /api/feed?vibe_channel_tag=flow
  req.query = { vibe_channel_tag: vibeType };
    console.log(req.query);

  // 3. Pass the modified request to the existing getFeed controller
  postController.getPosts(req, res);
};

router.get(
  '/:vibeType',
  authMiddleware.authenticate, // Runs auth middleware first
  getVibeFeed             // Runs our new handler which calls getFeed
);

module.exports = router;

