// We import the 'query' function from your db/index.js file
const { query } = require('../db');

/**
 * Gathers all data for a given user from the database.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object>} - A promise that resolves to an object containing all user data.
 */
async function gatherUserData(userId) {
  // We run all queries in parallel for efficiency
  const [
    profileData,
    postData,
    commentData,
    vibeData,
    followerData,
    followingData,
    conversationData,
    messageData,
    notificationData
  ] = await Promise.all([
    // 1. Get user profile
    query(
      'SELECT id, username, email, bio, website, profile_picture_url, created_at FROM users WHERE id = $1',
      [userId]
    ),
    
    // 2. Get all posts by the user
    query('SELECT * FROM posts WHERE user_id = $1', [userId]),
    
    // 3. Get all comments by the user
    query('SELECT * FROM comments WHERE user_id = $1', [userId]),
    
    // 4. Get all vibes the user has given
    query('SELECT * FROM vibes WHERE user_id = $1', [userId]),
    
    // 5. Get all followers (IDs of users who follow this user)
    query('SELECT follower_id FROM follows WHERE followee_id = $1', [userId]),
    
    // 6. Get all following (IDs of users this user follows)
    query('SELECT followee_id FROM follows WHERE follower_id = $1', [userId]),
    
    // 7. Get all conversations the user is part of (USING THE CORRECT SCHEMA)
    query(
      `SELECT * FROM conversations 
       WHERE id IN (
         SELECT conversation_id FROM conversation_participants WHERE user_id = $1
       )`,
      [userId]
    ),
      
    // 8. Get all messages sent by the user
    query('SELECT * FROM messages WHERE sender_id = $1', [userId]),
    
    // 9. Get all notifications for the user
    query('SELECT * FROM notifications WHERE recipient_id = $1', [userId])
  ]);

  // The 'query' function returns an object with a 'rows' property.
  // We extract the rows from each result.
  const profile = profileData.rows[0] || null;
  const posts = postData.rows;
  const comments = commentData.rows;
  const vibes = vibeData.rows;
  const followers = followerData.rows;
  const following = followingData.rows;
  const conversations = conversationData.rows;
  const messages = messageData.rows;
  const notifications = notificationData.rows;

  // Return a clean, organized object
  return {
    profile,
    posts,
    comments,
    vibes_given: vibes,
    connections: {
      followers: followers.map(f => f.follower_id),
      following: following.map(f => f.followee_id),
    },
    conversations,
    messages_sent: messages,
    notifications,
  };
}

module.exports = {
  gatherUserData,
};