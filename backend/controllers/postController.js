const { query } = require('../db');
const sharp = require('sharp');
const { uploadFileToMinIO } = require('../services/fileStorage');
// --- 1. Import the link preview service ---
const { extractFirstUrl, fetchLinkMetadata } = require('../services/linkPreviewService');


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

      // TODO: This logic only processes images. Videos will fail.
      // This needs to be refactored to handle videos separately.
      const processedImageBuffer = await sharp(file.buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const key = `posts/user-${userId}-${Date.now()}.webp`;
      mediaUrl = await uploadFileToMinIO(key, processedImageBuffer, 'image/webp');
    }

    // --- 2. Fetch link preview data ---
    let linkPreviewData = null;
    const firstUrl = extractFirstUrl(content);
    if (firstUrl) {
      // Use try/catch so a failed preview doesn't stop the post
      try {
        linkPreviewData = await fetchLinkMetadata(firstUrl);
      } catch (previewError) {
        console.error(`Non-fatal: Failed to fetch link preview for post: ${previewError.message}`);
      }
    }
    // --- End of new block ---

    // Insert post into database
    const insertQuery = `
      INSERT INTO posts (user_id, content, media_url, media_type, is_public, vibe_channel_tag, link_preview_data, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *;
    `;
    const { rows } = await query(insertQuery, [
      userId,
      content || null,
      mediaUrl,
      mediaType,
      is_public,
      vibe_channel_tag || null,
      // --- 3. Add linkPreviewData to parameters ---
      linkPreviewData ? JSON.stringify(linkPreviewData) : null
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};

/**
 * Retrieves the main feed for the authenticated user.
 * SPEC 4.3.1: Only shows posts from 'approved' follows.
 */
exports.getFeed = async (req, res) => {
  const { userId } = req;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const queryText = `
      SELECT
        p.id,
        p.content,
        p.media_url,
        p.media_type,
        p.created_at,
        p.vibe_channel_tag,
        p.user_id,
        p.link_preview_data, -- This was already added
        u.username,
        u.display_name,
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
        ) as vibe_counts,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      -- Logic to get posts from followed users (or other feed logic)
      WHERE (p.user_id IN (
          -- --- PRIVACY CHANGE: Added "AND status = 'approved'" ---
          SELECT followee_id FROM follows WHERE follower_id = $1 AND status = 'approved'
        ) OR p.user_id = $1) -- Include user's own posts
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await query(queryText, [userId, parseInt(limit, 10), offset]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get feed error:', err);
    res.status(500).json({ error: 'Server error while fetching feed.' });
  }
};

/**
 * Retrieves all posts (non-feed, e.g., for discovery).
 * SPEC 4.3.2: Only shows posts from 'public' accounts.
 */
exports.getPosts = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const currentUserId = req.userId || null;

  try {
    // "p.*" will automatically select the new link_preview_data column
    const { rows } = await query(
      `SELECT
        p.*,
        u.username,
        u.display_name,
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
        ) as vibe_counts,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      -- --- PRIVACY CHANGE: Added check for public accounts ---
      WHERE p.is_public = true AND u.account_privacy = 'public'
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `, [currentUserId, parseInt(limit, 10), offset]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Server error while fetching posts.' });
  }
};

/**
 * Retrieves a single post by its ID.
 * SPEC 4.3.3: Checks account privacy before returning.
 */
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const currentUserId = req.userId || null;

  try {
    // "p.*" will automatically select the new link_preview_data column
    const queryText = `
      SELECT
        p.*,
        u.username,
        u.display_name,
        u.profile_picture_url,
        u.account_privacy, -- 1. Select the author's privacy
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $2) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
        -- 2. Ensure 'is_following' only counts 'approved' follows
        EXISTS (SELECT 1 FROM follows WHERE follower_id = $2 AND followee_id = p.user_id AND status = 'approved') as is_following
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1;
    `;
    const { rows } = await query(queryText, [postId, currentUserId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // --- 3. Add Privacy Check ---
    const post = rows[0];
    // Compare as strings or numbers, ensure consistency
    const isOwner = currentUserId && post.user_id.toString() === currentUserId.toString(); 

    if (post.account_privacy === 'private' && !isOwner && !post.is_following) {
      // If account is private, viewer is not the owner, and viewer is not an approved follower
      return res.status(403).json({ error: 'This post is private.' });
    }
    // --- End Privacy Check ---

    res.status(200).json(post);
  } catch (err) {
    console.error('Get post by ID error:', err);
    res.status(500).json({ error: 'Server error while fetching post.' });
  }
};

/**
 * Retrieves all posts for the currently authenticated user.
 */
exports.getPostsForCurrentUser = async (req, res) => {
  const { userId } = req;
  const { limit = 20, offset = 0 } = req.query;

  try {
    // No change needed: "p.*" will automatically select the new link_preview_data column
    const queryText = `
      SELECT
        p.*,
        u.username,
        u.display_name,
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
        ) as vibe_counts,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
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

  /**
   * Retrieves all posts for a specific user by username.
   * SPEC 4.3.4: Checks account privacy before returning.
   */
  exports.getPostsByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null;

  try {
    // --- 1. Check user privacy first ---
    const userResult = await query('SELECT id, account_privacy FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const targetUser = userResult.rows[0];
    const targetUserId = targetUser.id;
    let isAuthorized = false;

    if (targetUser.account_privacy === 'public') {
      isAuthorized = true;
    } else if (currentUserId && currentUserId.toString() === targetUserId.toString()) {
      isAuthorized = true; // User is viewing their own private profile
    } else if (currentUserId) {
      // Check if the viewer is an approved follower
      const followStatus = await query(
        "SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2 AND status = 'approved'",
        [currentUserId, targetUserId]
      );
      if (followStatus.rowCount > 0) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      // Return an empty array instead of 403 to indicate a private profile
      // This is often better UX, but a 403 is also fine.
      // Or, let's return a specific error as per the spec.
      return res.status(403).json({ error: 'This account is private.' });
    }
    // --- End Privacy Check ---


    // --- 2. Proceed with fetching posts ---
    // "p.*" will automatically select the new link_preview_data column
    const result = await query(`
      SELECT
        p.*,
        u.username,
        u.profile_picture_url,
        (SELECT vibe_type FROM vibes WHERE post_id = p.id AND user_id = $2) as user_vibe,
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            WHERE post_id = p.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
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

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body; // Assuming 'content' is sent, not 'text'
  const { userId } = req;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content cannot be empty.' });
  }

  try {
    // 1. Get the post to verify ownership
    const postResult = await query('SELECT user_id FROM posts WHERE id = $1', [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = postResult.rows[0];

    // 2. Check if the authenticated user is the post owner
    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this post.' });
    }

    // --- 5. Fetch link preview data on update ---
    let linkPreviewData = null;
    const firstUrl = extractFirstUrl(content);
    if (firstUrl) {
      try {
        linkPreviewData = await fetchLinkMetadata(firstUrl);
      } catch (previewError) {
        console.error(`Non-fatal: Failed to fetch link preview for post update: ${previewError.message}`);
      }
    }
    // --- End of new block ---


    // 3. User is the owner, proceed with update
    const updateQuery = `
      UPDATE posts
      SET content = $1, updated_at = NOW(), link_preview_data = $2
      WHERE id = $3 AND user_id = $4
      RETURNING *;
    `;
    // --- 6. Add linkPreviewData to parameters ---
    const { rows } = await query(updateQuery, [
      content,
      linkPreviewData ? JSON.stringify(linkPreviewData) : null,
      postId,
      userId
    ]);

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Server error while updating post.' });
  }
};

/**
 * Deletes a post owned by the authenticated user.
 */
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    // Verify ownership before deleting
    const postResult = await query('SELECT user_id FROM posts WHERE id = $1', [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (postResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this post.' });
    }

    // TODO: Delete associated media from S3/MinIO

    await query('DELETE FROM posts WHERE id = $1', [postId]);

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Server error while deleting post.' });
  }
};

