const { query } = require('../db');

/**
 * Creates and stores a new notification.
 * @param {number} recipientId - The ID of the user receiving the notification.
 * @param {number} senderId - The ID of the user who triggered the event.
 * @param {string} type - The type of notification ('like', 'comment', 'follow').
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
        'SELECT username, profile_picture_url FROM users WHERE id = $1',
        [senderId]
    );
    const sender = senderResult.rows[0];

    // Construct the payload
    const notificationPayload = {
      ...newNotification,
      sender_username: sender.username,
      sender_avatar: sender.profile_picture_url,
    };
    
    // Send the notification to the user if they are online
    sendMessageToUser(recipientId, {
      type: 'new_notification',
      payload: notificationPayload,
    });

  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};