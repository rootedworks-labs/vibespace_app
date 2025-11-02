const express = require('express');
const router = express.Router();
const { getPresignedUrl } = require('../services/fileStorage');
const authMiddleware = require('../middleware/auth'); // Protect the route

// GET /api/media/posts/user-1-12345.webp
// GET /api/media/avatars/user-1-67890.webp
router.get('/:objectKey(*)', 
  authMiddleware.authenticateOptional, // Or authenticate if all media is private
  async (req, res) => {
    const objectKey = req.params.objectKey;
    // Basic validation: prevent directory traversal
    if (!objectKey || objectKey.includes('..')) {
       return res.status(400).send('Invalid object key.');
    }

    try {
      // You might add more authorization logic here based on the key prefix (posts vs avatars etc.)
      // e.g., check if the user has access to the post this media belongs to.

      const presignedUrl = await getPresignedUrl(objectKey, 60 * 5); // 5 minute expiry
      console.log(`Redirecting to presigned URL: ${presignedUrl}`);

      // Redirect the client to the temporary MinIO URL
      res.redirect(presignedUrl); 

    } catch (error) {
      console.error(`Media redirect error for ${objectKey}:`, error);
      res.status(500).send('Could not retrieve media.');
    }
});

module.exports = router;