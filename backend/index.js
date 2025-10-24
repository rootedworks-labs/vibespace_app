// In index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerdef'); // Correctly imports from our new file
const { initializeWebSocket } = require('./services/websocket');

const app = express();

app.use(cors());
app.use(express.json());

// --- API Documentation Route ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- Your Existing VibeSpace Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/consents', require('./routes/consents'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/waitlist', require('./routes/waitlist'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/data', require('./routes/data'));
app.use('/api/vibes', require('./routes/vibes'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
initializeWebSocket(server);

