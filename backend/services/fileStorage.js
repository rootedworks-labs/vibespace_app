const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// S3 Client setup (should already exist)
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  
});

/**
 * Generates a pre-signed URL for downloading an object.
 * @param {string} objectName - The full path/key of the object in the bucket.
 * @param {number} expiryInSeconds - How long the URL should be valid (e.g., 60 * 5 for 5 minutes).
 * @returns {Promise<string>} - The pre-signed URL.
 */
exports.getPresignedUrl = async (objectName, expiryInSeconds = 60 * 15) => {
  try {
    const bucketName = process.env.S3_BUCKET;

    //console.log(s3.credentials.accessKeyId, s3.credentials.secretAccessKey);
    // --- FIX 1: Use the PUBLIC endpoint variable here for the browser ---
    const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT; // e.g., http://localhost:9000

    if (!bucketName || !publicEndpoint) { // Check for public endpoint
        throw new Error('S3 bucket or public endpoint environment variables are not set.');
    }
    console.log(`Attempting to generate presigned URL for bucket "${bucketName}", object "${objectName}" using public endpoint ${publicEndpoint}`);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    });

    // Generate the signed URL using the internal client, BUT we need the final URL to have the public hostname.
    // The getSignedUrl function *might* use the client's endpoint by default.
    // We will generate it and then replace if necessary.
    const internalSignedUrl = await getSignedUrl(s3, command, { expiresIn: expiryInSeconds });
    console.log(`Generated internal signed URL: ${internalSignedUrl.substring(0, 100)}...`);

    // Replace internal hostname with public hostname if they differ
    const internalEndpoint = process.env.S3_ENDPOINT;
    let publicSignedUrl = internalSignedUrl;
    if (internalEndpoint && publicEndpoint && internalSignedUrl.startsWith(internalEndpoint)) {
        publicSignedUrl = internalSignedUrl.replace(internalEndpoint, publicEndpoint);
        console.log(`Replaced internal endpoint, returning public signed URL: ${publicSignedUrl.substring(0, 100)}...`);
    } else {
        console.log(`Returning originally generated signed URL (endpoints might match or internal not found): ${publicSignedUrl.substring(0, 100)}...`);
    }

    return publicSignedUrl; // Return the browser-accessible URL

  } catch (err) {
    console.error(`Error generating presigned URL for ${objectName}:`, err);
    throw err instanceof Error ? err : new Error('Could not generate temporary file URL.');
  }
};

/**
 * Uploads the file and returns the INTERNAL URL for storage.
 */
exports.uploadFileToMinIO = async (key, buffer, contentType) => {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  // --- FIX 2: Return the INTERNAL URL using S3_ENDPOINT ---
  const internalEndpoint = process.env.S3_ENDPOINT; // e.g., http://minio:9000
  const bucketName = process.env.S3_BUCKET;
  const internalUrl = `${internalEndpoint}/${bucketName}/${key}`;
  console.log(`Upload complete. Storing internal URL: ${internalUrl}`);
  return internalUrl; // Return the internal URL to be saved in the DB
};

// Function to upload the file (should already exist)
// exports.uploadFileToMinIO = async (key, buffer, contentType) => {
//   await s3.send(new PutObjectCommand({
//     Bucket: process.env.S3_BUCKET,
//     Key: key,
//     Body: buffer,
//     ContentType: contentType,
//   }));
//   return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
// };

// New function to delete a file from MinIO
exports.deleteFileFromMinIO = async (fileUrl) => {
  if (!fileUrl) return; // Do nothing if there's no file URL

  try {
    const bucketName = process.env.S3_BUCKET;
    const url = new URL(fileUrl);
    // The key is the part of the path after the bucket name, e.g., "avatars/1-166..."
    const key = url.pathname.substring(bucketName.length + 2);

    await s3.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));
    console.log(`Successfully deleted old file: ${key}`);
  } catch (err) {
    // Log the error but don't crash the upload process
    console.error(`Failed to delete old file from MinIO: ${fileUrl}`, err);
  }
};