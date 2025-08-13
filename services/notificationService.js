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
    await query(
      'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
      [recipientId, senderId, type, entityId]
    );
    console.log(`--- NOTIFICATION CREATED: [${type}] for user ${recipientId} from user ${senderId} ---`);
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};