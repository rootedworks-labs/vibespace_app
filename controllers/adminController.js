const { query } = require('../db');

/**
 * Suspends a user for a specified duration.
 */
exports.suspendUser = async (req, res) => {
  const { userId } = req.params;
  const { durationHours } = req.body;

  let suspendedUntil;

  if (durationHours === null || durationHours === 'permanent') {
    // For permanent suspension, set a date far in the future.
    suspendedUntil = new Date('9999-12-31T23:59:59Z');
  } else {
    suspendedUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000);
  }

  try {
    const client = await query('BEGIN'); // Start transaction

    // 1. Set the suspension timestamp
    const updatedUser = await query(
      'UPDATE users SET suspended_until = $1 WHERE id = $2 RETURNING id, refresh_token',
      [suspendedUntil, userId]
    );

    if (updatedUser.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ error: 'User not found.' });
    }

    const { refresh_token } = updatedUser.rows[0];

    // 2. Revoke the user's current refresh token to force logout
    if (refresh_token) {
      await query('INSERT INTO revoked_tokens (token) VALUES ($1)', [refresh_token]);
      await query('UPDATE users SET refresh_token = NULL WHERE id = $1', [userId]);
    }

    await query('COMMIT'); // Commit transaction

    res.status(200).json({ message: `User ${userId} has been suspended until ${suspendedUntil.toISOString()}.` });
  } catch (err) {
    await query('ROLLBACK');
    console.error('Suspend user error:', err);
    res.status(500).json({ error: 'Server error while suspending user.' });
  }
};
