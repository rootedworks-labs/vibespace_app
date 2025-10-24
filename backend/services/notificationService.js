const { query } = require('../db');
// 1. FIX: Import 'sendMessageToUser' instead of 'getIO'
const { sendMessageToUser } = require('./websocket');

/**
 * Creates and stores a new notification.
 * @param {number} recipientId - The ID of the user receiving the notification.
 * @param {number} senderId - The ID of the user who triggered the event.
 * @param {string} type - The type of notification ('follow', 'vibe', 'comment').
 * @param {number|null} entityId - The ID of the related entity (e.g., post_id).
 */
exports.createNotification = async (recipientId, senderId, type, entityId = null) => {
  // Prevent users from receiving notifications for their own actions
  if (recipientId === senderId) {
    return;
  }

  try {
    const result = await query(
      'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [recipientId, senderId, type, entityId]
    );
    const newNotification = result.rows[0];
    console.log(`--- NOTIFICATION CREATED: [${type}] for user ${recipientId} from user ${senderId} ---`);

    // --- Real-time Push via WebSocket ---
    // Fetch sender's info to create a rich payload for the real-time message
    const senderResult = await query(
        'SELECT id, username, profile_picture_url FROM users WHERE id = $1',
        [senderId]
    );
    const sender = senderResult.rows[0];

    // Fetch post preview if it's a comment or vibe
    let postPreview = null;
    if ((type === 'comment' || type === 'vibe') && entityId) {
        const postResult = await query('SELECT content FROM posts WHERE id = $1', [entityId]);
        if (postResult.rows.length > 0) {
            postPreview = postResult.rows[0].content.substring(0, 50) + '...';
        }
    }
    
    // 2. FIX: Construct the payload with the nested 'actor' object
    // This matches what your frontend 'NotificationCard.tsx' component expects
    const notificationPayload = {
      id: newNotification.id,
      type: newNotification.type,
      is_read: newNotification.is_read,
      created_at: newNotification.created_at,
      post_id: newNotification.entity_id,
      post_content_preview: postPreview,
      actor: { // Your frontend component expects 'actor'
        id: sender.id,
        username: sender.username,
        profile_picture_url: sender.profile_picture_url
      }
    };
    
    // 3. FIX: Use 'sendMessageToUser' with the correct message format
    const message = {
      type: 'new_notification',
      payload: notificationPayload
    };
    sendMessageToUser(recipientId, message);

  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

