// In controllers/messageController.js
const { query } = require('../db');
const { sendMessageToUser } = require('../services/websocket');


/**
 * Starts a new conversation with another user or returns the existing one.
 */
exports.createConversation = async (req, res) => {
    const { userId } = req; // The initiator
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
 * Retrieves all conversations for the authenticated user.
 */
exports.getConversations = async (req, res) => {
    const { userId } = req;
    try {
        const { rows } = await query(
            `SELECT c.id, u.username AS participant_username, u.profile_picture_url AS participant_avatar
             FROM conversations c
             JOIN conversation_participants cp ON c.id = cp.conversation_id
             JOIN users u ON cp.user_id = u.id
             WHERE c.id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = $1)
             AND cp.user_id != $1`, // Get the *other* participant's info
            [userId]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get conversations error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Retrieves all messages for a specific conversation, now including read status and vibes.
 */
exports.getMessagesForConversation = async (req, res) => {
    const { userId } = req;
    const { conversationId } = req.params;
    try {
        // Security check: Ensure the user is a participant of the conversation
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );
        if (participantCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You are not a participant of this conversation.' });
        }

        const { rows } = await query(
            `SELECT
                m.id,
                m.content,
                m.created_at,
                m.sender_id,
                u.username AS sender_username,
                (m.read_at IS NOT NULL) as read_by_recipient,
                (
                    SELECT COALESCE(json_object_agg(mv.vibe_type, mv.count), '{}'::json)
                    FROM (
                        SELECT vibe_type, COUNT(*) as count
                        FROM message_vibes
                        WHERE message_id = m.id
                        GROUP BY vibe_type
                    ) mv
                ) as vibe_counts
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.conversation_id = $1
             ORDER BY m.created_at ASC`,
            [conversationId]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};


/**
 * Sends a new message in a conversation.
 */
exports.sendMessage = async (req, res) => {
    const { userId } = req; // This is the sender's ID
    const { conversationId } = req.params;
    const { content } = req.body;

    try {
        // Security check: Ensure the user is a participant
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );
        if (participantCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You are not a participant of this conversation.' });
        }

        // 1. Save the message to the database
        const { rows } = await query(
            'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
            [conversationId, userId, content]
        );
        const newMessage = rows[0];

        // 2. Find the recipient's ID
        const recipientResult = await query(
            'SELECT user_id FROM conversation_participants WHERE conversation_id = $1 AND user_id != $2',
            [conversationId, userId]
        );
        const recipientId = recipientResult.rows[0]?.user_id;

        // 3. Push the message in real-time
        if (recipientId) {
            sendMessageToUser(recipientId, {
                type: 'new_message',
                payload: newMessage
            });
        }

        // 4. Send the HTTP response back to the sender
        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Marks messages in a conversation as read by the current user.
 */
exports.markMessagesAsRead = async (req, res) => {
    const { userId } = req;
    const { conversationId } = req.params;

    try {
        // Security Check: User must be a participant
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );
        if (participantCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Forbidden.' });
        }
        
        // Update messages that were NOT sent by the current user and are unread
        await query(
            `UPDATE messages
             SET read_at = NOW()
             WHERE conversation_id = $1
             AND sender_id != $2
             AND read_at IS NULL`,
            [conversationId, userId]
        );

        res.status(204).send();

    } catch (err) {
        console.error('Mark messages as read error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Adds or updates a vibe on a message.
 */
exports.addVibeToMessage = async (req, res) => {
    const { userId } = req;
    const { messageId } = req.params;
    const { vibeType } = req.body;

    try {
        // TODO: Add a security check to ensure the user is part of the message's conversation.

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
    const { userId } = req;
    const { messageId } = req.params;

    try {
        const result = await query(
            'DELETE FROM message_vibes WHERE user_id = $1 AND message_id = $2',
            [userId, messageId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Vibe not found.' });
        }
        res.status(200).json({ message: 'Vibe removed from message successfully.' });
    } catch (err) {
        console.error('Remove vibe from message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};
