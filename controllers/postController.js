const { query } = require('../db');

/**
 * Creates a new post for the authenticated user.
 */
exports.createPost = async (req, res) => {
  const { userId } = req;
  // We can accept is_public from the request body, defaulting to true if not provided.
  const { content, is_public = true } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty.' });
  }

  try {
    const newPost = await query(
      'INSERT INTO posts (user_id, content, is_public) VALUES ($1, $2, $3) RETURNING *',
      [userId, content, is_public]
    );
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};

/**
 * Retrieves a single post by its ID, including the author's username.
 */
exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await query(
      `SELECT p.id, p.content, p.media_url, p.is_public, p.created_at, u.username 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(200).json(post.rows[0]);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Server error while fetching post.' });
  }
};

/**
 * Retrieves all posts, including the author's username.
 */
exports.getPosts = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
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
