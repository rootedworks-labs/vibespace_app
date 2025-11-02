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
    
    
    // Verify user still exists in the database and is not suspended
    const { rows } = await query('SELECT suspended_until FROM users WHERE id = $1', [decoded.id]);
    if (!rows.length) {
      console.log(`--- AUTH MIDDLEWARE [FAIL]: User ID ${decoded.id} from token not found in DB.`);
      throw new Error('User not found');
    }

    // Check for suspension
    const { suspended_until } = rows[0];
    if (suspended_until && new Date(suspended_until) > new Date()) {
        console.log(`--- AUTH MIDDLEWARE [FAIL]: User ID ${decoded.id} is suspended.`);
        return res.status(403).json({ error: 'Forbidden: This account is suspended.' });
    }
    
    console.log(`--- AUTH MIDDLEWARE: User ID ${decoded.id} confirmed in DB and not suspended.`);

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

exports.authenticateOptional = async (req, res, next) => {
  console.log(`--- AUTH OPTIONAL MIDDLEWARE [START] for ${req.method} ${req.originalUrl} ---`);
  const authHeader = req.headers.authorization;

  // Check if a Bearer token exists
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log(`--- AUTH OPTIONAL: Token received: ${token.substring(0, 15)}...`);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`--- AUTH OPTIONAL: Token decoded for user ID: ${decoded.id}`);

      // Optional: You might still want basic checks like user existence
      // const { rows } = await query('SELECT id FROM users WHERE id = $1', [decoded.id]);
      // if (rows.length > 0) {
      //   req.userId = decoded.id; // Attach userId if successfully authenticated
      //   console.log(`--- AUTH OPTIONAL: User ID ${decoded.id} attached to request.`);
      // } else {
      //   console.log(`--- AUTH OPTIONAL [WARN]: User ID ${decoded.id} from token not found, proceeding anyway.`);
      // }

      // For simplicity, just attach if decoded:
      req.userId = decoded.id;
      console.log(`--- AUTH OPTIONAL: User ID ${decoded.id} attached to request.`);

    } catch (err) {
      // If token is invalid (expired, wrong secret), just ignore it and proceed
      console.log(`--- AUTH OPTIONAL [WARN]: Invalid token provided - ${err.message}. Proceeding without authentication.`);
      req.userId = null; // Ensure userId is null if token is bad
    }
  } else {
    // No token provided, proceed without authentication
    console.log('--- AUTH OPTIONAL: No token provided. Proceeding without authentication.');
    req.userId = null;
  }

  // Always call next() to allow the request to continue
  console.log('--- AUTH OPTIONAL [SUCCESS]: Calling next()... ---');
  next();
};

