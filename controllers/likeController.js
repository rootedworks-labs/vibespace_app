// controllers/likeController.js
const { query } = require('../db');

/**
 * Likes a post.
 */
exports.likePost = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    // Check if the post exists AND get the author's ID at the same time
    const postResult = await query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const postAuthorId = postResult.rows[0].user_id;

    // Insert the like, ignoring conflicts if the user already liked the post
    await query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, postId]
    );

    // Create a notification if the person liking the post is not the author
    if (postAuthorId !== userId) {
        // Use the correct column names: sender_id and entity_id
        await query(
            'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
            [postAuthorId, userId, 'new_like', postId]
        );
    }

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
