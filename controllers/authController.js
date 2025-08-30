const { query } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function for token generation
const generateTokens = (userId) => {
  return {
    accessToken: jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    ),
    refreshToken: jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Long-lived refresh token
    )
  };
};

// Existing registration (modified to include refresh token)
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // 1. Check if user exists (unchanged)
    const userExists = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $2', 
      [email, username]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Hash password (unchanged)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert new user
    const newUser = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, hashedPassword]
    );

    // 4. Generate tokens (updated)
    const { accessToken, refreshToken } = generateTokens(newUser.rows[0].id);

    // 5. Store refresh token
    await query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, newUser.rows[0].id]
    );

    res.status(201).json({ 
      accessToken, 
      refreshToken,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        profile_picture_url: newUser.rows[0].profile_picture_url
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// New login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const { rows } = await query(
      'SELECT id, password_hash, username, profile_picture_url FROM users WHERE email = $1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate new tokens
    const { accessToken, refreshToken } = generateTokens(rows[0].id);

    // 4. Update refresh token in DB
    await query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, rows[0].id]
    );

    res.json({ 
      accessToken,
      refreshToken,
      user: {
        id: rows[0].id,
        username: rows[0].username,
        profile_picture_url: rows[0].profile_picture_url
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// New logout function
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // 1. Add to revoked tokens table
    await query(
      'INSERT INTO revoked_tokens (token) VALUES ($1)',
      [refreshToken]
    );

    // 2. Clear from user record
    await query(
      'UPDATE users SET refresh_token = NULL WHERE refresh_token = $1',
      [refreshToken]
    );

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// New refresh token function
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // 1. Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Check if token was revoked
    const revoked = await query(
      'SELECT 1 FROM revoked_tokens WHERE token = $1',
      [refreshToken]
    );
    
    if (revoked.rows.length) {
      return res.status(401).json({ error: 'Token revoked' });
    }

    // 3. Verify token belongs to user
    const user = await query(
      'SELECT id FROM users WHERE id = $1 AND refresh_token = $2',
      [decoded.id, refreshToken]
    );

    if (!user.rows.length) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 4. Generate new tokens
    const { accessToken, newRefreshToken } = generateTokens(decoded.id);

    // 5. Update refresh token in DB
    await query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [newRefreshToken, decoded.id]
    );

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const userId = req.userId; 

    // Fetch user from DB (excluding sensitive fields)
    const { rows } = await query(
      `SELECT id, username, email, profile_picture_url, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};