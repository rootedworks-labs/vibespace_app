const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { query } = require('../db');

// --- S3 Client Setup ---
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

/**
 * Deletes all files associated with a user from MinIO.
 * @param {number} userId - The ID of the user.
 */
async function deleteUserFiles(userId) {
  const bucket = process.env.S3_BUCKET;
  const prefixes = [`avatars/user-${userId}`, `uploads/user-${userId}`]; // Add other folders as needed
  
  for (const prefix of prefixes) {
    // List all objects in the user's folder
    const listCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
    const listedObjects = await s3.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) continue;

    // Prepare for bulk deletion
    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);
    console.log(`Successfully deleted ${listedObjects.Contents.length} files with prefix ${prefix}`);
  }
}

/**
 * Anonymizes the user's record in the database.
 * @param {number} userId - The ID of the user.
 */
async function anonymizeUserInDB(userId) {
  const client = await query('BEGIN'); // Start a transaction
  try {
    // Anonymize the main users table
    await query(
      `UPDATE users SET 
        username = $1, 
        email = $2, 
        password_hash = 'deleted',
        bio = NULL,
        website = NULL,
        profile_picture_url = NULL,
        refresh_token = NULL
      WHERE id = $3`,
      [`deleted_user_${userId}`, `deleted_${userId}@vibespace.com`, userId]
    );

    // Delete related sensitive data
    await query('DELETE FROM user_consents WHERE user_id = $1', [userId]);

    // Add deletions for other tables here (e.g., sessions, notifications)

    await query('COMMIT'); // Commit the transaction
    console.log(`Successfully anonymized user ${userId} in the database.`);
  } catch (err) {
    await query('ROLLBACK'); // Roll back the transaction on error
    throw err;
  }
}

/**
 * Orchestrates the full user deletion process.
 * @param {number} userId - The ID of the user to delete.
 */
exports.handleUserDeletion = async (userId) => {
  // Run both operations concurrently for efficiency
  await Promise.all([
    deleteUserFiles(userId),
    anonymizeUserInDB(userId)
  ]);
};