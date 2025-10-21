const { query } = require('../db');
const { getIO } = require('../services/websocket'); // 1. Import getIO

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

    // --- 2. Real-time Push via Socket.IO Room ---
    const io = getIO();
    const recipientRoom = `user_${recipientId}`;
    
    // Emit a simple event. The client will refetch its notifications upon receiving this.
    io.to(recipientRoom).emit('new_notification');
    
    console.log(`Notification event emitted to room: ${recipientRoom}`);
    
    return newNotification;

  } catch (err) {
    console.error('Error creating notification:', err);
  }
};
