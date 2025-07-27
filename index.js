require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes - IMPORTANT: Add routes ONE AT A TIME
app.use('/api/auth', require('./routes/auth')); // Start with just this one
app.use('/api/users', require('./routes/users')); // Commented out for now
app.use('/api/posts', require('./routes/posts')); // Commented out for now

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));