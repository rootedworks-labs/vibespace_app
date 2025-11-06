const { query } = require('../db');
const { sendMessageToUser } = require('../services/websocket');
// This file already imports the link preview service, which is used in createMessage
const { extractFirstUrl, fetchLinkMetadata } = require('../services/linkPreviewService');


/**
 * Starts a new conversation with another user or returns the existing one.
 * SPEC 4.3: Added DM privacy check.
 */
exports.createConversation = async (req, res) => {
    const userId = req.userId; // The initiator (User A)
    const { recipientId } = req.body; // The recipient (User B)

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
            // Conversation already exists, return it (spec: does not affect existing)
            return res.status(200).json(existingConversation.rows[0]);
        }

        // --- 1. PRIVACY CHECK (Spec 4.3) ---
        // If conversation does NOT exist, check recipient's privacy settings
        const recipientUser = await query('SELECT dm_privacy FROM users WHERE id = $1', [recipientId]);
        if (recipientUser.rows.length === 0) {
          return res.status(404).json({ error: 'Recipient user not found.' });
        }

        const dmPrivacy = recipientUser.rows[0].dm_privacy;

        if (dmPrivacy === 'mutuals') {
          // Check if User B (recipient) also follows User A (initiator)
          const mutualFollow = await query(
            "SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2 AND status = 'approved'",
            [recipientId, userId]
          );
          
          if (mutualFollow.rowCount === 0) {
            // Not mutuals, block creation
            return res.status(403).json({ error: 'This user only accepts messages from people they follow.' });
          }
        }
        // If dmPrivacy is 'open' or 'mutuals' check passed, proceed.
        // --- END PRIVACY CHECK ---


        // If not, create a new conversation
        const newConversation = await query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
        const conversationId = newConversation.rows[0].id;

        // Add both users as participants
        await query(
            'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)',
            [conversationId, userId, recipientId]
        );

        res.status(201).json({ id: conversationId }); // Return the new conversation ID
    } catch (err) {
        console.error('Create conversation error:', err);
        res.status(500).json({ error: 'Server error while creating conversation.' });
    }
};

/**
 * Creates a new message in a specific conversation.
 */
exports.sendMessage = async (req, res) => {
    const senderId = req.userId;
    const { conversationId, content, mediaUrl, mediaType } = req.body;

    try {
        // Verify user is a participant of the conversation
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, senderId]
        );

        if (participantCheck.rowCount === 0) {
            return res.status(403).json({ error: 'You are not a participant of this conversation.' });
        }

        // --- Link Preview Logic (Already present from previous work) ---
        let linkPreviewData = null;
        const firstUrl = extractFirstUrl(content);
        if (firstUrl) {
            try {
                linkPreviewData = await fetchLinkMetadata(firstUrl);
            } catch (previewError) {
                console.error(`Non-fatal: Failed to fetch link preview for message: ${previewError.message}`);
            }
        }
        // --- End Link Preview Logic ---

        // Insert the message
        const messageQuery = `
            INSERT INTO messages (conversation_id, sender_id, content, media_url, media_type, link_preview_data)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const { rows } = await query(messageQuery, [
            conversationId,
            senderId,
            content,
            mediaUrl || null,
            mediaType || null,
            linkPreviewData ? JSON.stringify(linkPreviewData) : null
        ]);

        const newMessage = rows[0];

        // Get all participants of the conversation
        const participants = await query(
            'SELECT user_id FROM conversation_participants WHERE conversation_id = $1 AND user_id != $2',
            [conversationId, senderId]
        );

        // Send WebSocket notification to each participant (except the sender)
        for (const participant of participants.rows) {
            sendMessageToUser(participant.user_id, {
                type: 'new_message',
                data: newMessage
            });
        }

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
        // This query fetches all conversations for the user,
        // gets the other participant's details, and the last message.
        const conversations = await query(
            `SELECT
                c.id,
                u.id AS user_id,
                u.username,
                u.profile_picture_url,
                m.content AS "lastMessage",
                m.created_at AS "timestamp"
            FROM conversations c
            JOIN conversation_participants cp ON c.id = cp.conversation_id
            JOIN users u ON cp.user_id = u.id
            -- Join to get the *other* participant
            JOIN conversation_participants cp_other ON c.id = cp_other.conversation_id
            -- Join to get the last message
            LEFT JOIN (
                SELECT 
                    conversation_id,
                    content,
                    created_at,
                    ROW_NUMBER() OVER(PARTITION BY conversation_id ORDER BY created_at DESC) as rn
                FROM messages
            ) m ON c.id = m.conversation_id AND m.rn = 1
            WHERE cp_other.user_id = $1 AND cp.user_id != $1
            ORDER BY m.created_at DESC;`,
            [userId]
        );
        res.status(200).json(conversations.rows);
    } catch (err) {
        console.error('Get conversations error:', err);
        res.status(500).json({ error: 'Server error while fetching conversations.' });
    }
};

/**
 * Retrieves all messages for a specific conversation.
 */
exports.getMessagesForConversation = async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;

    try {
        // Verify user is a participant
        const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );

        if (participantCheck.rowCount === 0) {
            return res.status(403).json({ error: 'You are not a participant of this conversation.' });
        }

        // Get messages
        const messages = await query(
            'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
            [conversationId]
        );

        // Mark messages as read (This part is not in the spec, but is good practice)
        // We only mark messages not sent by the current user
        await query(
            'UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL',
            [conversationId, userId]
        );

        res.status(200).json(messages.rows);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Server error while fetching messages.' });
    }
};

// --- ADDED THIS FUNCTION BACK ---
/**
 * Marks all messages in a conversation as read for the authenticated user.
 */
exports.markMessagesAsRead = async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;

    try {
         // Verify user is a participant
         const participantCheck = await query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );

        if (participantCheck.rowCount === 0) {
            return res.status(403).json({ error: 'You are not a participant of this conversation.' });
        }
        
        // Mark messages as read
        await query(
            'UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL',
            [conversationId, userId]
        );

        res.status(200).json({ message: 'Messages marked as read.' });
    } catch (err) {
        console.error('Mark messages as read error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};
// --- END OF ADDED FUNCTION ---

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
            return res.status(404).json({ error: 'Vibe not found or already removed.' });
        }
        res.status(200).json({ message: 'Vibe removed successfully.' });
    } catch (err) {
        console.error('Remove vibe from message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

