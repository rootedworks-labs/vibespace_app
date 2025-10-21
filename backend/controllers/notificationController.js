const { query } = require('../db');

/**
 * Retrieves all notifications for the authenticated user with a detailed payload.
 */
exports.getNotifications = async (req, res) => {
  // Use req.userId to be consistent with your auth middleware and other functions
  const { userId } = req; 

  try {
    // --- FIX: Modified the SELECT statement to build a nested 'sender' object ---
    const notificationsQuery = `
      SELECT 
        n.id, 
        n.type, 
        n.is_read, 
        n.created_at, 
        n.entity_id as post_id,
        p.content as post_content_preview,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'profile_picture_url', u.profile_picture_url
        ) as sender
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      LEFT JOIN posts p ON n.entity_id = p.id AND n.type IN ('new_vibe', 'new_comment')
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
    `;
    const notifications = await query(notificationsQuery, [userId]);

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
  } catch (err)
 {
    console.error('Mark notifications as read error:', err);
    res.status(500).json({ error: 'Server error while updating notifications.' });
  }
};

