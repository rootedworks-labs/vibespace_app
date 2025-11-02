const { query } = require('../db');
const { createNotification } = require('../services/notificationService');

/**
 * Follows a user or sends a follow request if the user's profile is private.
 */
exports.followUser = async (req, res) => {
  const followerId = req.userId; // The current logged-in user
  const { username } = req.params; // The username of the user to follow

  try {
    // 1. Find the user to follow AND check their privacy settings
    const userToFollow = await query(
      'SELECT id, account_privacy FROM users WHERE username = $1',
      [username]
    );
    if (userToFollow.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const followeeId = userToFollow.rows[0].id;
    const accountPrivacy = userToFollow.rows[0].account_privacy;

    // 2. Prevent users from following themselves
    if (followerId === followeeId) {
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    // --- 3. UPDATED FOLLOW LOGIC ---
    if (accountPrivacy === 'private') {
      // User is private, insert a 'pending' request
      const { rowCount } = await query(
        'INSERT INTO follows (follower_id, followee_id, status) VALUES ($1, $2, $3) ON CONFLICT (follower_id, followee_id) DO NOTHING',
        [followerId, followeeId, 'pending']
      );

      if (rowCount > 0) {
        // Only send notification if it's a new request
        await createNotification(followeeId, followerId, 'follow_request');
      }
      
      return res.status(202).json({ message: `Your follow request was sent to ${username}.`, status: 'pending' });

    } else {
      // User is public, insert or update to 'approved'
      // Use ON CONFLICT...DO UPDATE to handle pre-existing 'pending' or 'denied' requests and approve them
      await query(
        'INSERT INTO follows (follower_id, followee_id, status) VALUES ($1, $2, $3) ON CONFLICT (follower_id, followee_id) DO UPDATE SET status = $3',
        [followerId, followeeId, 'approved']
      );

      // Create a 'follow' notification
      await createNotification(followeeId, followerId, 'follow');
      
      return res.status(201).json({ message: `You are now following ${username}.`, status: 'approved' });
    }
    // --- END UPDATED LOGIC ---

  } catch (err) {
    console.error('Follow user error:', err);
    res.status(500).json({ error: 'Server error while trying to follow user.' });
  }
};

/**
 * Unfollows a user. This action is immediate and deletes the relationship,
 * regardless of whether it was 'pending' or 'approved'.
 */
exports.unfollowUser = async (req, res) => {
  const followerId = req.userId;
  const { username } = req.params;

  try {
    // 1. Find the user to unfollow
    const userToUnfollow = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (userToUnfollow.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const followeeId = userToUnfollow.rows[0].id;

    // 2. Delete the follow relationship (works for 'pending' or 'approved')
    const result = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [followerId, followeeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'You were not following this user.' });
    }

    // NOTE: You might want to delete any 'follow' or 'follow_request' notifications here.

    res.status(200).json({ message: `You have unfollowed ${username}.` });
  } catch (err) {
    console.error('Unfollow user error:', err);
    res.status(500).json({ error: 'Server error while trying to unfollow user.' });
  }
};

/**
 * Retrieves the list of users that the specified user is following (approved only).
 */
exports.getFollowing = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null; 

  try {
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const targetUserId = userResult.rows[0].id;

    // --- UPDATED QUERY ---
    // Added "f.status = 'approved'"
    const followingQuery = `
      SELECT
        u.id,
        u.username,
        u.display_name,
        u.profile_picture_url,
        u.bio,
        EXISTS (SELECT 1 FROM follows WHERE follower_id = $2 AND followee_id = u.id AND status = 'approved') as is_following_viewer
      FROM follows f
      JOIN users u ON f.followee_id = u.id
      WHERE f.follower_id = $1 AND f.status = 'approved'
      ORDER BY u.username;
    `;
    const followingResult = await query(followingQuery, [targetUserId, currentUserId]);
    // --- END UPDATED QUERY ---

    res.status(200).json(followingResult.rows);
  } catch (err) {
    console.error(`Get following error for ${username}:`, err);
    res.status(500).json({ error: 'Server error while fetching following list.' });
  }
};

/**
 * Retrieves the list of users who are following the specified user (approved only).
 */
exports.getFollowers = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null;

  try {
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const targetUserId = userResult.rows[0].id;

    // --- UPDATED QUERY ---
    // Added "f.status = 'approved'"
    const followersQuery = `
      SELECT
        u.id,
        u.username,
        u.display_name,
        u.profile_picture_url,
        u.bio,
        EXISTS (SELECT 1 FROM follows WHERE follower_id = $2 AND followee_id = u.id AND status = 'approved') as is_following_viewer
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.followee_id = $1 AND f.status = 'approved'
      ORDER BY u.username;
    `;
    const followersResult = await query(followersQuery, [targetUserId, currentUserId]);
    // --- END UPDATED QUERY ---

    res.status(200).json(followersResult.rows);
  } catch (err) {
    console.error(`Get followers error for ${username}:`, err);
    res.status(500).json({ error: 'Server error while fetching followers list.' });
  }
};


// --- 4. NEW FUNCTIONS REQUIRED BY SPEC 4.3 ---

/**
 * Retrieves all pending follow requests for the authenticated user.
 */
exports.getFollowRequests = async (req, res) => {
  const { userId } = req; // Authenticated user

  try {
    const queryText = `
      SELECT
        u.id,
        u.username,
        u.display_name,
        u.profile_picture_url,
        u.bio
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.followee_id = $1 AND f.status = 'pending'
      ORDER BY f.created_at DESC;
    `;
    const { rows } = await query(queryText, [userId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get follow requests error:', err);
    res.status(500).json({ error: 'Server error while fetching follow requests.' });
  }
};

/**
 * Approves a pending follow request.
 */
exports.approveFollowRequest = async (req, res) => {
  const { userId } = req; // The user who is approving (the followee)
  const { followerId } = req.body; // The user who sent the request

  if (!followerId) {
    return res.status(400).json({ error: 'followerId is required.' });
  }

  try {
    // Update the follow request status from 'pending' to 'approved'
    const { rowCount } = await query(
      "UPDATE follows SET status = 'approved' WHERE follower_id = $1 AND followee_id = $2 AND status = 'pending'",
      [followerId, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Follow request not found or already handled.' });
    }

    // Notify the user (follower) that their request was approved
    await createNotification(followerId, userId, 'follow_approved');

    res.status(200).json({ message: 'Follow request approved.' });
  } catch (err) {
    console.error('Approve follow request error:', err);
    res.status(500).json({ error: 'Server error while approving request.' });
  }
};

/**
 * Denies or ignores a pending follow request.
 */
exports.denyFollowRequest = async (req, res) => {
  const { userId } = req; // The user who is denying (the followee)
  const { followerId } = req.body; // The user who sent the request

  if (!followerId) {
    return res.status(400).json({ error: 'followerId is required.' });
  }

  try {
    // Delete the pending follow request
    const { rowCount } = await query(
      "DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2 AND status = 'pending'",
      [followerId, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Follow request not found or already handled.' });
    }

    res.status(200).json({ message: 'Follow request denied.' });
  } catch (err) {
    console.error('Deny follow request error:', err);
    res.status(500).json({ error: 'Server error while denying request.' });
  }
};
