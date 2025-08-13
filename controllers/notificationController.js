// In controllers/notificationController.js
const { query } = require('../db');

/**
 * Retrieves all notifications for the authenticated user.
 */
exports.getNotifications = async (req, res) => {
  const { userId } = req;

  try {
    const notifications = await query(
      `SELECT n.id, n.type, n.is_read, n.created_at, n.entity_id,
              u.username as sender_username, u.profile_picture_url as sender_avatar
       FROM notifications n
       JOIN users u ON n.sender_id = u.id
       WHERE n.recipient_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.status(200).json(notifications.rows);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Server error while fetching notifications.' });
  }
};

/**
 * Marks all unread notifications for the authenticated user as read.
 */
exports.markNotificationsAsRead = async (req, res) => {
  const { userId } = req;

  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE recipient_id = $1 AND is_read = false',
      [userId]
    );

    res.status(204).send();
  } catch (err) {
    console.error('Mark notifications as read error:', err);
    res.status(500).json({ error: 'Server error while updating notifications.' });
  }
};