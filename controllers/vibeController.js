// controllers/vibeController.js
const { query } = require('../db');

/**
 * Adds or updates a vibe on a post for the authenticated user.
 * This uses an "UPSERT" operation: if the user has already vibed on this post,
 * it updates their vibe_type. If not, it inserts a new vibe.
 */
exports.addVibe = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  const { vibeType } = req.body; // The frontend will send the type of vibe (e.g., 'energy', 'flow')

  // Basic validation to ensure a valid vibeType is provided
  if (!vibeType) {
    return res.status(400).json({ error: 'vibeType is required in the request body.' });
  }

  const vibeQuery = `
    INSERT INTO vibes (user_id, post_id, vibe_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET vibe_type = $3;
  `;

  try {
    await query(vibeQuery, [userId, postId, vibeType]);
    res.status(201).json({ message: 'Vibe added/updated successfully.' });
  } catch (err) {
    console.error('Add vibe error:', err);
    res.status(500).json({ error: 'Server error while adding vibe.' });
  }
};

/**
 * Removes a vibe from a post for the authenticated user.
 */
exports.removeVibe = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    const result = await query('DELETE FROM vibes WHERE user_id = $1 AND post_id = $2', [userId, postId]);

    if (result.rowCount === 0) {
      // This isn't necessarily an error, just means there was no vibe to remove.
      return res.status(404).json({ error: 'Vibe not found for this user and post.' });
    }

    res.status(200).json({ message: 'Vibe removed successfully.' });
  } catch (err) {
    console.error('Remove vibe error:', err);
    res.status(500).json({ error: 'Server error while removing vibe.' });
    }
};