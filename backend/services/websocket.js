// In services/websocket.js
const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

// This map will store the WebSocket connection for each online user
const onlineUsers = new Map();

let wss;

function initializeWebSocket(server) {
    wss = new WebSocketServer({ server });

    wss.on('connection', async (ws, req) => {
        // The token will be sent as a query parameter, e.g., ws://localhost:5000?token=...
        const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');

        if (!token) {
            return ws.close(1008, 'Token required');
        }

        try {
            // 1. Authenticate the connection
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // 2. Store the connection
            onlineUsers.set(userId, ws);
            console.log(`WebSocket: User ${userId} connected.`);

            // 3. Handle incoming messages (optional for now, but good for future features)
            ws.on('message', (message) => {
                console.log(`Received message from user ${userId}: ${message}`);
            });

            // 4. Handle disconnection
            ws.on('close', () => {
                onlineUsers.delete(userId);
                console.log(`WebSocket: User ${userId} disconnected.`);
            });

        } catch (err) {
            ws.close(1008, 'Invalid token');
        }
    });

    console.log('WebSocket server initialized.');
}

/**
 * Sends a message to a specific user if they are online.
 * @param {number} recipientId - The ID of the user to send the message to.
 * @param {object} message - The message object to send.
 */
function sendMessageToUser(recipientId, message) {
    const recipientSocket = onlineUsers.get(recipientId);

    if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
        recipientSocket.send(JSON.stringify(message));
        console.log(`Sent real-time message to user ${recipientId}`);
    } else {
        console.log(`User ${recipientId} is not online. Message will be delivered on next fetch.`);
    }
}

module.exports = {
    initializeWebSocket,
    sendMessageToUser
};
