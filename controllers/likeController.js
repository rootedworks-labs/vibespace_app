// controllers/likeController.js
const { query } = require('../db');

/**
 * Likes a post.
 */
exports.likePost = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    // Check if the post exists
    const post = await query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Insert the like, ignoring conflicts if the user already liked the post
    await query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, postId]
    );

    res.status(201).json({ message: 'Post liked successfully.' });
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ error: 'Server error while liking post.' });
  }
};

/**
 * Unlikes a post.
 */
exports.unlikePost = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    const result = await query(
      'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Like not found.' });
    }

    res.status(200).json({ message: 'Post unliked successfully.' });
  } catch (err) {
    console.error('Unlike post error:', err);
    res.status(500).json({ error: 'Server error while unliking post.' });
  }
};