const { query } = require('../db');

exports.getUsers = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, username, profile_picture_url FROM users'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const userId = req.userId; 

    // Fetch user from DB (excluding sensitive fields)
    const { rows } = await query(
      `SELECT id, username, email, profile_picture_url, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};