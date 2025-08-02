const sharp = require('sharp');
const { query } = require('../db');
const { uploadFileToMinIO, deleteFileFromMinIO } = require('../services/fileStorage');
const { handleUserDeletion } = require('../services/deletionService'); // Added
const sanitizeHtml = require('sanitize-html');

exports.uploadAvatar = async (req, res) => {
  const { userId } = req;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // 1. Fetch the user's current avatar URL to delete it later
    const oldAvatarResult = await query(
      'SELECT profile_picture_url FROM users WHERE id = $1',
      [userId]
    );
    const oldAvatarUrl = oldAvatarResult.rows[0]?.profile_picture_url;

    // 2. Process the new image with Sharp
    const processedImageBuffer = await sharp(req.file.buffer)
      .resize(300, 300) // Resize to a standard 300x300 avatar
      .jpeg({ quality: 90 }) // Convert to high-quality JPEG
      .toBuffer();

    // 3. Define the unique key for the new file in MinIO
    const key = `avatars/user-${userId}-${Date.now()}.jpg`;

    // 4. Upload the new avatar to MinIO
    const newAvatarUrl = await uploadFileToMinIO(key, processedImageBuffer, 'image/jpeg');

    // 5. Update the user's profile_picture_url in the database
    const { rows } = await query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING profile_picture_url',
      [newAvatarUrl, userId]
    );

    // 6. Asynchronously delete the old avatar from MinIO
    if (oldAvatarUrl) {
      deleteFileFromMinIO(oldAvatarUrl);
    }

    res.status(200).json({
      message: 'Avatar updated successfully',
      profile_picture_url: rows[0].profile_picture_url,
    });
  } catch (err) {
    console.error('Avatar upload failed:', err);
    res.status(500).json({ error: 'Server error during avatar upload' });
  }
};

// --- New User Deletion Controller ---
// This function orchestrates the account deletion process.
exports.deleteCurrentUser = async (req, res) => {
  const { userId } = req;

  try {
    await handleUserDeletion(userId);
    
    // Deletion was successful, send a 204 No Content response.
    // This is the standard for successful DELETE requests with no body.
    res.status(204).send();
  } catch (err) {
    console.error(`Failed to delete user ${userId}:`, err);
    res.status(500).json({ error: 'Failed to complete account deletion.' });
  }
};

exports.getCurrentUser = async (req, res) => {
  const { userId } = req;
  try {
    const { rows } = await query(
      'SELECT id, username, email, created_at, profile_picture_url FROM users WHERE id = $1',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to get current user:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Only return public-safe information
    const { rows } = await query('SELECT id, username, profile_picture_url FROM users ORDER BY username');
    res.json(rows);
  } catch (err) {
    console.error('Failed to get users:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req;
  const { username, bio, website } = req.body;

  try {
    // 1. Sanitize user input to prevent XSS attacks
    const sanitizedBio = bio ? sanitizeHtml(bio, { allowedTags: [], allowedAttributes: {} }) : undefined;
    const normalizedWebsite = website ? validator.normalizeUrl(website) : undefined;

    // 2. Validate username uniqueness if it's being changed
    if (username) {
      const userExists = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      if (userExists.rows.length > 0) {
        return res.status(409).json({ error: 'Username is already taken.' });
      }
    }

    // 3. Update the database, only changing fields that were provided
    const { rows } = await query(
      `UPDATE users SET 
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        website = COALESCE($3, website)
      WHERE id = $4 
      RETURNING id, username, email, bio, website, profile_picture_url`,
      [username, sanitizedBio, normalizedWebsite, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: rows[0],
    });

  } catch (err) {
    console.error('Profile update failed:', err);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
};