const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// S3 Client setup (should already exist)
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Function to upload the file (should already exist)
exports.uploadFileToMinIO = async (key, buffer, contentType) => {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
};

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