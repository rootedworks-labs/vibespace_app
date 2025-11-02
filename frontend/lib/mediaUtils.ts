// In frontend/lib/utils.ts (or a new mediaUtils.ts)

/**
 * Checks if a URL is a MinIO URL and transforms it into the backend media proxy URL if necessary.
 * Otherwise, returns the original URL.
 *
 * @param originalUrl The URL string to potentially transform (e.g., from post.media_url or user.profile_picture_url)
 * @returns The transformed URL (e.g., /api/media/posts/...) or the original URL.
 */
export const getProxiedMediaUrl = (originalUrl: string | null | undefined): string | undefined => {
    console.log(originalUrl)
  if (!originalUrl) {
    return undefined; // Return undefined if the original URL is null or undefined
  }

  // --- IMPORTANT: Set these in your frontend/.env.local ---
  // Example: NEXT_PUBLIC_MINIO_URL=http://localhost:9000
  // Example: NEXT_PUBLIC_MINIO_BUCKET_NAME=vibespace
  const minioBaseUrl ="https://nbg1.your-objectstorage.com";
  const minioBucketName = "vibespace-dev";

  if (!minioBaseUrl || !minioBucketName) {
    console.warn('MinIO URL or Bucket Name not configured in environment variables for URL proxying.');
    return originalUrl; // Return original URL if config is missing
  }

  // Construct the expected prefix for MinIO URLs in your bucket
  // Example: http://localhost:9000/vibespace/
  const minioUrlPrefix = `${minioBaseUrl.endsWith('/') ? minioBaseUrl : minioBaseUrl + '/'}${minioBucketName}/`;
  console.log("MinIO URL Prefix:", minioUrlPrefix); // Check this output


  // Check if the original URL starts with the MinIO bucket prefix
  if (originalUrl.startsWith(minioUrlPrefix)) {
    const objectKey = originalUrl.substring(minioUrlPrefix.length);
    const transformedUrl = `/api/media/${objectKey}`;
    console.log("Transformed URL:", transformedUrl); // Check this output
    return transformedUrl;
  }

  // If it's not a MinIO URL, return it unchanged
  return originalUrl;
};