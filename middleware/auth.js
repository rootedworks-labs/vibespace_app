const jwt = require('jsonwebtoken');
const { query } = require('../db');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optional: Verify user still exists
    const { rows } = await query('SELECT 1 FROM users WHERE id = $1', [decoded.id]);
    if (!rows.length) throw new Error('User not found');

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Authentication failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};