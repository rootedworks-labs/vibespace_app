const { query } = require('../db');

exports.followUser = async (req, res) => {
  const followerId = req.userId; // The current logged-in user
  const { username } = req.params; // The username of the user to follow

  try {
    // 1. Find the user to follow by their username
    const userToFollow = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (userToFollow.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const followeeId = userToFollow.rows[0].id;

    // 2. Prevent users from following themselves
    if (followerId === followeeId) {
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    // 3. Insert the follow relationship into the database
    await query(
      'INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followerId, followeeId]
    );

    res.status(201).json({ message: `You are now following ${username}.` });
  } catch (err) {
    console.error('Follow user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.unfollowUser = async (req, res) => {
  const followerId = req.userId; // The current logged-in user
  const { username } = req.params; // The username of the user to unfollow

  try {
    // 1. Find the user to unfollow by their username
    const userToUnfollow = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (userToUnfollow.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const followeeId = userToUnfollow.rows[0].id;

    // 2. Delete the follow relationship
    await query(
      'DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [followerId, followeeId]
    );

    res.status(200).json({ message: `You have unfollowed ${username}.` });
  } catch (err) {
    console.error('Unfollow user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
