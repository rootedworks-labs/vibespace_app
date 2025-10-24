const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const url = require('url');

const onlineUsers = new Map();
let wss;

function initializeWebSocket(server) {
  wss = new WebSocketServer({ noServer: true }); // We'll handle the upgrade manually

  // --- THIS IS THE FIX FOR 'ws' ---
  // We intercept the HTTP 'upgrade' request to check the origin (CORS)
  // before establishing the WebSocket connection.
  server.on('upgrade', (request, socket, head) => {
    const { origin } = request.headers;
    const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000").split(',');

    if (!origin || !allowedOrigins.includes(origin)) {
      console.log(`WebSocket: Denying connection from origin ${origin}`);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
  // --- END OF FIX ---

  wss.on('connection', async (ws, req) => {
    const token = url.parse(req.url, true).query.token;

    if (!token) {
      return ws.close(1008, 'Token required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      onlineUsers.set(userId, ws);
      console.log(`WebSocket: User ${userId} connected.`);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          const recipientId = parseInt(data.payload.recipientId, 10);
          // Find the recipient's socket connection
          const recipientSocket = onlineUsers.get(recipientId);
          console.log(recipientSocket);
          if (recipientSocket && recipientSocket.readyState === 1) {

            // Relay typing events without saving them
            if (data.type === 'start_typing' || data.type === 'stop_typing') {
              recipientSocket.send(JSON.stringify({
                type: data.type,
                payload: {
                  conversation_id: data.payload.conversationId,
                  sender_id: userId
                }
              }));
            }
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      });
      ws.on('close', () => {
        onlineUsers.delete(userId);
        console.log(`WebSocket: User ${userId} disconnected.`);
      });
    } catch (err) {
      ws.close(1008, 'Invalid token');
    }
  });

  console.log('WebSocket server (ws) initialized.');
}

function sendMessageToUser(recipientId, message) {
  const recipientSocket = onlineUsers.get(recipientId);

  if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
    recipientSocket.send(JSON.stringify(message));
    console.log(`Sent real-time message to user ${recipientId}`);
  } else {
    console.log(`User ${recipientId} is not online. Message will be delivered on next fetch.`);
  }
}

module.exports = { initializeWebSocket, sendMessageToUser };

