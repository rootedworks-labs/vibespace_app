const jwt = require('jsonwebtoken');
const { query } = require('../db');

exports.authenticate = async (req, res, next) => {
  console.log(`--- AUTH MIDDLEWARE [START] for ${req.method} ${req.originalUrl} ---`);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('--- AUTH MIDDLEWARE [FAIL]: No Bearer token found.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`--- AUTH MIDDLEWARE: Token received: ${token.substring(0, 15)}...`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`--- AUTH MIDDLEWARE: Token decoded successfully for user ID: ${decoded.id}`);
    
    // Verify user still exists in the database
    const { rows } = await query('SELECT 1 FROM users WHERE id = $1', [decoded.id]);
    if (!rows.length) {
      console.log(`--- AUTH MIDDLEWARE [FAIL]: User ID ${decoded.id} from token not found in DB.`);
      throw new Error('User not found');
    }
    console.log(`--- AUTH MIDDLEWARE: User ID ${decoded.id} confirmed in DB.`);

    req.userId = decoded.id;
    
    console.log('--- AUTH MIDDLEWARE [SUCCESS]: Calling next()... ---');
    next();
  } catch (err) {
    console.error('--- AUTH MIDDLEWARE [CAUGHT ERROR] ---');
    console.error(err);
    console.error('------------------------------------');
    
    res.status(401).json({ error: 'Invalid token' });
  }
};
