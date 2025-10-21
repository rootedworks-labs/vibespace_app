const { query } = require('../db');
const { sendMessageToUser } = require('../services/websocket');

/**
 * Starts a new conversation with another user or returns the existing one.
 */
exports.createConversation = async (req, res) => {
    const userId = req.userId; // The initiator
    const { recipientId } = req.body;

    if (userId === recipientId) {
        return res.status(400).json({ error: "You cannot start a conversation with yourself." });
    }

    try {
        // Check if a conversation between these two users already exists
        const existingConversation = await query(
            `SELECT c.id FROM conversations c
             JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
             JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
             WHERE cp1.user_id = $1 AND cp2.user_id = $2`,
            [userId, recipientId]
        );

        if (existingConversation.rows.length > 0) {
            return res.status(200).json(existingConversation.rows[0]);
        }

        // If not, create a new conversation
        const newConversation = await query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
        const conversationId = newConversation.rows[0].id;

        // Add both users as participants
        await query(
            'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)',
            [conversationId, userId, recipientId]
        );
        
        res.status(201).json({ id: conversationId });

    } catch (err) {
        console.error('Create conversation error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};


/**
 * Creates a new message and sends it to the other participant via WebSocket.
 */
// --- FIX: Renamed back to sendMessage to match the route file ---
exports.sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  // --- MODIFICATION: Destructure media_url and media_type from the request body ---
  const { content, media_url, media_type } = req.body;
  const senderId = req.userId;

  // --- MODIFICATION: A message must have either text content or media ---
  if (!content && !media_url) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    const participantRes = await query(
      'SELECT user_id FROM conversation_participants WHERE conversation_id = $1 AND user_id != $2',
      [conversationId, senderId]
    );

    if (participantRes.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation participant not found.' });
    }
    const recipientId = participantRes.rows[0].user_id;

    // --- MODIFICATION: Update the INSERT query to include the new media columns ---
    const newMessageRes = await query(
      'INSERT INTO messages (conversation_id, sender_id, content, media_url, media_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [conversationId, senderId, content || null, media_url || null, media_type || null]
    );
    const newMessage = newMessageRes.rows[0];

    const messagePayload = {
      type: 'new_message',
      payload: newMessage,
    };
    sendMessageToUser(recipientId, messagePayload);
    sendMessageToUser(senderId, messagePayload);
    
    res.status(201).json(newMessage);

  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ error: 'Server error while creating message.' });
  }
};

/**
 * Retrieves all conversations for the authenticated user.
 */
exports.getConversations = async (req, res) => {
    const userId = req.userId;
    try {
        const result = await query(
            `SELECT c.id, 
                    u.username as participant_username, 
                    u.profile_picture_url as participant_avatar
             FROM conversations c
             JOIN conversation_participants cp ON c.id = cp.conversation_id
             JOIN users u ON cp.user_id = u.id
             WHERE c.id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = $1)
             AND cp.user_id != $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get conversations error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Retrieves all messages for a specific conversation.
 */
exports.getMessagesForConversation = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;
    try {
        // Security check to ensure user is a participant
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );
        if (participantCheck.rows.length === 0) {
            return res.status(403).json({ error: 'User is not part of this conversation.' });
        }

        const result = await query(
            'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
            [conversationId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Marks messages in a conversation as read by the current user.
 */
exports.markMessagesAsRead = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;

    try {
        await query(
            `UPDATE messages SET read_at = NOW() 
             WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL`,
            [conversationId, userId]
        );
        res.status(204).send();
    } catch (err) {
        console.error('Mark messages as read error:', err);
        res.status(500).json({ error: 'Server error while updating messages.' });
    }
};

/**
 * Adds or updates a vibe for a specific message.
 */
exports.addVibeToMessage = async (req, res) => {
    const userId = req.userId;
    const { messageId } = req.params;
    const { vibeType } = req.body;

    try {
        const vibeQuery = `
            INSERT INTO message_vibes (user_id, message_id, vibe_type)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, message_id)
            DO UPDATE SET vibe_type = $3;
        `;
        await query(vibeQuery, [userId, messageId, vibeType]);
        res.status(201).json({ message: 'Vibe added to message successfully.' });
    } catch (err) {
        console.error('Add vibe to message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Removes a vibe from a message.
 */
exports.removeVibeFromMessage = async (req, res) => {
    const userId = req.userId;
    const { messageId } = req.params;

    try {
        const result = await query(
            'DELETE FROM message_vibes WHERE user_id = $1 AND message_id = $2',
            [userId, messageId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Vibe not found or you do not have permission to remove it.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Remove vibe from message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

