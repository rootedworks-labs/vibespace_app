// In index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerdef'); // Correctly imports from our new file

const app = express();

app.use(cors());
app.use(express.json());

// --- API Documentation Route ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- Your Existing VibeSpace Routes ---
app.use('/api/auth', require('./routes/auth'));
// Make sure to add your other routes here
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/consents', require('./routes/consents'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/feed', require('./routes/feed'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
