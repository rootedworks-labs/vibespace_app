// In controllers/commentController.js
const { query } = require('../db');

/**
 * Creates a new comment on a specific post.
 */
exports.createComment = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    // Fetch the post and its author's ID
    const postResult = await query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    const postAuthorId = postResult.rows[0].user_id;

    // Insert the new comment
    const newComment = await query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, content]
    );

    // Create a notification if the commenter is not the post author
    if (postAuthorId !== userId) {
        // Use the correct column names: sender_id and entity_id
        await query(
            'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
            [postAuthorId, userId, 'new_comment', postId]
        );
    }

    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Server error while creating comment.' });
  }
};

/**
 * Retrieves all comments for a specific post, including vibe counts.
 */
exports.getCommentsForPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await query(
      `SELECT 
         c.id, 
         c.content, 
         c.created_at, 
         u.username, 
         u.profile_picture_url,
         (
           SELECT COALESCE(json_object_agg(cv.vibe_type, cv.count), '{}'::json)
           FROM (
             SELECT vibe_type, COUNT(*) as count
             FROM comment_vibes
             WHERE comment_id = c.id
             GROUP BY vibe_type
           ) cv
         ) as vibe_counts
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );

    res.status(200).json(comments.rows);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ error: 'Server error while fetching comments.' });
  }
};

/**
 * Deletes a comment, but only if the authenticated user is the owner.
 */
exports.deleteComment = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const result = await query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id',
      [commentId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found or you do not have permission to delete it.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Server error while deleting comment.' });
  }
};

/**
 * Adds or updates a vibe on a comment.
 */
exports.addVibeToComment = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.params;
  const { vibeType } = req.body;

  if (!vibeType) {
    return res.status(400).json({ error: 'vibeType is required.' });
  }

  try {
    // Security check: Ensure comment exists
    const commentCheck = await query('SELECT id, user_id FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    const commentAuthorId = commentCheck.rows[0].user_id;

    // Upsert the vibe
    await query(`
        INSERT INTO comment_vibes (user_id, comment_id, vibe_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, comment_id)
        DO UPDATE SET vibe_type = $3;
    `, [userId, commentId, vibeType]);
    
    // Notify the author of the comment
    if (commentAuthorId !== userId) {
      await createNotification(commentAuthorId, userId, 'new_comment_vibe', commentId);
    }

    res.status(201).json({ message: 'Vibe added/updated successfully.' });
  } catch (err) {
    console.error('Add vibe to comment error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * Removes a vibe from a comment.
 */
exports.removeVibeFromComment = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const result = await query(
        'DELETE FROM comment_vibes WHERE user_id = $1 AND comment_id = $2',
        [userId, commentId]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Vibe not found for this user and comment.' });
    }

    res.status(200).json({ message: 'Vibe removed successfully.' });
  } catch (err) {
    console.error('Remove vibe from comment error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
