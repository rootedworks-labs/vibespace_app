const sharp = require('sharp');
const { query } = require('../db');
const { uploadFileToMinIO, deleteFileFromMinIO } = require('../services/fileStorage');
const { handleUserDeletion } = require('../services/deletionService'); // Added
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');


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

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.userId || null;
  try {
    const userQuery = `
      SELECT
        u.id, u.username, u.bio, u.website, u.profile_picture_url, u.created_at,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
        (SELECT COUNT(*) FROM follows WHERE followee_id = u.id) as followers_count,
        EXISTS (SELECT 1 FROM follows WHERE follower_id = $2 AND followee_id = u.id) as is_following,
        
        -- Calculate all vibe counts for the user's posts and aggregate into a JSON object
        (
          SELECT COALESCE(json_object_agg(v.vibe_type, v.count), '{}'::json)
          FROM (
            SELECT vibe_type, COUNT(*) as count
            FROM vibes
            JOIN posts ON vibes.post_id = posts.id
            WHERE posts.user_id = u.id
            GROUP BY vibe_type
          ) v
        ) as vibe_counts

      FROM users u
      WHERE u.username = $1
    `;
    const { rows } = await query(userQuery, [username, currentUserId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    // --- Calculate dominant_vibe from vibe_counts ---
    const vibeCounts = user.vibe_counts;
    let dominantVibe = null;
    let maxCount = 0;
    
    if (vibeCounts && typeof vibeCounts === 'object' && Object.keys(vibeCounts).length > 0) {
      const counts = Object.values(vibeCounts);
      maxCount = Math.max(...counts);
      
      const topVibes = Object.keys(vibeCounts).filter(vibe => vibeCounts[vibe] === maxCount);
      
      // If there is only one vibe with the highest count, it's the dominant one.
      // If there's a tie, dominantVibe remains null.
      if (topVibes.length === 1) {
        dominantVibe = topVibes[0];
      }
    }

    // Add the calculated dominant_vibe to the user object
    user.dominant_vibe = dominantVibe;

    res.json(user);
    
  } catch (err) {
    console.error(`Failed to fetch user ${username}:`, err);
    res.status(500).json({ error: 'Server error' });
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

    const finalUsername = username || undefined;
    const finalBio = bio || undefined;
    const finalWebsite = website || undefined;
    // 1. Sanitize user input to prevent XSS attacks
    const sanitizedBio = bio ? sanitizeHtml(bio, { allowedTags: [], allowedAttributes: {} }) : undefined;

    let normalizedWebsite = website || undefined;
    if (normalizedWebsite) {
      // The 'validator' library does not have a `normalizeURL` function as the error indicates.
      // We will attempt to normalize it by adding a protocol if one is missing, then validate it.
      if (!/^(https?:\/\/)/i.test(normalizedWebsite)) {
        normalizedWebsite = `http://${normalizedWebsite}`;
      }
      if (!validator.isURL(normalizedWebsite, { require_protocol: true })) {
        return res.status(400).json({ error: 'Invalid website URL format.' });
      }
    }
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
      [finalUsername, sanitizedBio, normalizedWebsite, userId]
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

/**
 * Searches for users by username.
 */
exports.searchUsers = async (req, res) => {
  const { q } = req.query;

  try {
    // Use ILIKE for case-insensitive partial matching
    const { rows } = await query(
      "SELECT id, username, profile_picture_url FROM users WHERE username ILIKE $1 ORDER BY username",
      [`%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to search for users:', err);
    res.status(500).json({ error: 'Server error during user search.' });
  }
};

exports.exportUserData = async (req, res) => {
  const { userId } = req;

  try {
    // Use Promise.all to run queries concurrently for better performance
    const [
      profileRes,
      postsRes,
      commentsRes,
      likesRes,
      followingRes,
      followersRes,
      consentsRes
    ] = await Promise.all([
      query('SELECT id, username, email, created_at, profile_picture_url, bio, website FROM users WHERE id = $1', [userId]),
      query('SELECT id, content, is_public, created_at, media_url FROM posts WHERE user_id = $1', [userId]),
      query('SELECT id, post_id, content, created_at FROM comments WHERE user_id = $1', [userId]),
      query('SELECT post_id, created_at FROM likes WHERE user_id = $1', [userId]),
      query('SELECT followee_id FROM follows WHERE follower_id = $1', [userId]),
      query('SELECT follower_id FROM follows WHERE followee_id = $1', [userId]),
      query('SELECT consent_type, granted_at, ip_address, user_agent FROM user_consents WHERE user_id = $1', [userId])
    ]);

    // Structure the data into a clean JSON object
    const userData = {
      profile: profileRes.rows[0] || null,
      posts: postsRes.rows,
      comments: commentsRes.rows,
      likes: likesRes.rows,
      following: followingRes.rows.map(r => r.followee_id),
      followers: followersRes.rows.map(r => r.follower_id),
      consents: consentsRes.rows,
    };

    // Set headers to suggest downloading the file
    res.setHeader('Content-Disposition', 'attachment; filename="vibespace_data.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(userData);

  } catch (err) {
    console.error(`Failed to export data for user ${userId}:`, err);
    res.status(500).json({ error: 'Failed to export user data.' });
  }
};
