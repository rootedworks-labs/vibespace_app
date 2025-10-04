const { query } = require('../db');
const sharp = require('sharp');
const { uploadFileToMinIO } = require('../services/fileStorage');

/**
 * Creates a new post for the authenticated user, with an optional image and vibe channel tag.
 */
exports.createPost = async (req, res) => {
  const { userId } = req;
  const { content, is_public = true, vibe_channel_tag } = req.body;
  const file = req.file;

  if (!content && !file) {
    return res.status(400).json({ error: 'Post must have content or an image.' });
  }

  let mediaUrl = null;
  let mediaType = null; // Initialize mediaType

  try {
    if (file) {
      // Determine the media type from the mimetype
      if (file.mimetype.startsWith('image/')) {
        mediaType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      }

      const processedImageBuffer = await sharp(file.buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const key = `posts/user-${userId}-${Date.now()}.webp`;
      mediaUrl = await uploadFileToMinIO(key, processedImageBuffer, 'image/webp');
    }

    // Update the INSERT query to include media_type
    const newPost = await query(
      'INSERT INTO posts (user_id, content, is_public, media_url, media_type, vibe_channel_tag) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, content || '', is_public, mediaUrl, mediaType, vibe_channel_tag]
    );
    
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};

/**
 * Retrieves a single post by its ID, including the author's username and vibe data.
 */
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const postQuery = `
      SELECT
        p.id,
        p.content,
        p.media_url,
        p.media_type,
        p.is_public,
        p.created_at,
        u.username,
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $2) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts
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
 * Retrieves all posts, with optional filtering by vibe_channel_tag.
 */
exports.getPosts = async (req, res) => {
  const { userId } = req;
  const { vibe_channel_tag } = req.query;

  let queryText = `
    SELECT
      p.*,
      u.username,
      (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $1) as user_vibe,
      (
        SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
        FROM (
          SELECT vibe_type, COUNT(*) as count
          FROM vibes
          WHERE post_id = p.id
          GROUP BY vibe_type
        ) v
      ) as vibe_counts
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `;
  const queryParams = [userId];

  if (vibe_channel_tag) {
    queryParams.push(vibe_channel_tag);
    queryText += ` WHERE p.vibe_channel_tag = $${queryParams.length}`;
  }

  queryText += ' ORDER BY p.created_at DESC';

  try {
    const result = await query(queryText, queryParams);
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
  const { userId } = req;
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID.' });
  }

  try {
    const result = await query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [postId, userId]
    );

    if (result.rowCount === 0) {
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
  const { time_window = 'all', page = 1, limit = 10 } = req.query;

  try {
    let feedQuery = `
      SELECT
        p.id,
        p.content,
        p.media_url,
        p.media_type,
        p.created_at,
        u.username,
        u.profile_picture_url,
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $1) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts
      FROM posts p
      JOIN users u ON p.user_id = u.id`;

    const queryParams = [userId];
    const whereClauses = [];

    // Base WHERE clause for feed logic (posts from followed users or self)
    whereClauses.push(`(p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = $1) OR p.user_id = $1)`);

    // Add time-of-day filtering if a time_window is specified
    if (time_window !== 'all') {
      switch (time_window) {
        case 'morning':
          whereClauses.push(`(EXTRACT(HOUR FROM p.created_at) >= 6 AND EXTRACT(HOUR FROM p.created_at) < 12)`);
          break;
        case 'afternoon':
          whereClauses.push(`(EXTRACT(HOUR FROM p.created_at) >= 12 AND EXTRACT(HOUR FROM p.created_at) < 17)`);
          break;
        case 'evening':
          whereClauses.push(`(EXTRACT(HOUR FROM p.created_at) >= 17 OR EXTRACT(HOUR FROM p.created_at) < 6)`);
          break;
      }
    }

    feedQuery += ` WHERE ${whereClauses.join(' AND ')}`;

    // Add sorting and pagination
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    feedQuery += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit, 10), offset);

    const { rows } = await query(feedQuery, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get feed error:', err);
    res.status(500).json({ error: 'Server error while fetching feed.' });
  }
};

/**
 * Retrieves all posts for the currently authenticated user.
 */
exports.getPostsForCurrentUser = async (req, res) => {
  const { userId } = req;
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const queryText = `
      SELECT
        p.id,
        p.content,
        p.media_url,
        p.media_type,
        p.created_at,
        u.username,
        u.profile_picture_url,
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $1) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const { rows } = await query(queryText, [userId, parseInt(limit, 10), offset]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get posts for current user error:', err);
    res.status(500).json({ error: 'Server error while fetching posts.' });
  }
};

  exports.getPostsByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null;

  try {
    const result = await query(`
      SELECT
        p.*,
        u.username,
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $2) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts
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

