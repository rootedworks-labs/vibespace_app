const { query } = require('../db');
const sharp = require('sharp');
const { uploadFileToMinIO } = require('../services/fileStorage');

/**
 * Creates a new post for the authenticated user, with an optional image.
 */
exports.createPost = async (req, res) => {
  const { userId } = req;
  // Content now comes from the multipart form body
  const { content, is_public = true } = req.body;
  const file = req.file;

  if (!content && !file) {
    return res.status(400).json({ error: 'Post must have content or an image.' });
  }

  let mediaUrl = null;

  try {
    // If a file is uploaded, process and upload it
    if (file) {
      // Process the image with Sharp for optimization
      const processedImageBuffer = await sharp(file.buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true }) // Resize for social media
        .webp({ quality: 80 }) // Convert to efficient WebP format
        .toBuffer();

      // Define a unique key for the file in MinIO/S3
      const key = `posts/user-${userId}-${Date.now()}.webp`;

      // Upload the processed image using your existing service
      mediaUrl = await uploadFileToMinIO(key, processedImageBuffer, 'image/webp');
    }

    // Insert the new post into the database
    const newPost = await query(
      'INSERT INTO posts (user_id, content, is_public, media_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, content || '', is_public, mediaUrl]
    );
    
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};

/**
 * Retrieves a single post by its ID, including the author's username and like count.
 */
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req; // Can be undefined if user is not logged in

  try {
    const postQuery = `
      SELECT
        p.id,
        p.content,
        p.media_url,
        p.is_public,
        p.created_at,
        u.username,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as has_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1`;

    const { rows } = await query(postQuery, [postId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Server error while fetching post.' });
  }
};

/**
 * Retrieves all posts, including the author's username and like count.
 */
exports.getPosts = async (req, res) => {
  const { userId } = req; // Can be undefined

  try {
    const result = await query(`
      SELECT
        p.*,
        u.username,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as has_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Deletes a post, but only if the authenticated user is the owner.
 */
exports.deletePost = async (req, res) => {
  console.log(`--- DELETE /api/posts/:postId route hit for postId: ${req.params.postId} ---`);
  const { userId } = req; // This is the ID of the user making the request
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID.' });
  }

  try {
    // --- START: DIAGNOSTIC LOGGING ---
    // 1. Let's find out who the author of the post is
    const postAuthorResult = await query('SELECT user_id FROM posts WHERE id = $1', [postId]);

    if (postAuthorResult.rows.length === 0) {
      console.log(`--- DEBUG: Post with ID ${postId} not found at all.`);
      return res.status(404).json({ error: 'Post not found.' });
    }

    const postAuthorId = postAuthorResult.rows[0].user_id;

    // 2. Log the IDs to the console
    console.log('--- DELETE POST DEBUG ---');
    console.log(`Attempting to delete post ID: ${postId}`);
    console.log(`User making request (from token): User ID ${userId}`);
    console.log(`Author of the post (from database): User ID ${postAuthorId}`);
    console.log(`Do the user IDs match? ${userId === postAuthorId}`);
    console.log('-------------------------');
    // --- END: DIAGNOSTIC LOGGING ---

    // The original delete query
    const result = await query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [postId, userId]
    );

    if (result.rowCount === 0) {
      // This part will still run if the IDs do not match
      return res.status(404).json({ error: 'Post not found or you do not have permission to delete it.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * Retrieves the activity feed for the authenticated user.
 */
exports.getFeed = async (req, res) => {
    const { userId } = req;

    try {
      const feedQuery = `
        SELECT
          p.id,
          p.content,
          p.media_url,
          p.created_at,
          u.username,
          u.profile_picture_url,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
          EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as has_liked
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE 
          -- The post is from a user they follow
          p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = $1)
          -- OR the post is their own
          OR p.user_id = $1
        ORDER BY p.created_at DESC;
      `;

      const { rows } = await query(feedQuery, [userId]);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Get feed error:', err);
      res.status(500).json({ error: 'Server error while fetching feed.' });
    }
  };

  exports.getPostsByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null; // For checking 'has_liked' status

  try {
    const result = await query(`
      SELECT
        p.*,
        u.username,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as has_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE u.username = $1
      ORDER BY p.created_at DESC
    `, [username, currentUserId]);

    res.json(result.rows);
  } catch (err) {
    console.error(`Failed to get posts for user ${username}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
};
