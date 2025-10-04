#!/bin/sh

# Give the MinIO server plenty of time to start
sleep 10
# Exit script on any error
set -e

# 1. Log in to the MinIO server
mc alias set local http://minio:9000 corey Sandersco8891
# Define connection details for MinIO, using environment variables from docker-compose
MINIO_ALIAS="local"
MINIO_SERVER_URL="http://minio:9000"

# 2. Create the bucket if it doesn't already exist
mc mb local/vibespace-uploads --ignore-existing
# Wait for MinIO to be available by polling it
echo "Waiting for MinIO server to be ready at ${MINIO_SERVER_URL}..."
until mc alias set ${MINIO_ALIAS} ${MINIO_SERVER_URL} ${S3_ACCESS_KEY} ${S3_SECRET_KEY}; do
  echo "MinIO not ready yet, sleeping for 2 seconds..."
  sleep 2
done
echo "MinIO server is ready. Configuring bucket..."

# 3. Set the bucket's policy to allow public downloads
mc policy set download local/vibespace-uploads
# Create the bucket if it doesn't already exist
mc mb ${MINIO_ALIAS}/${S3_BUCKET} --ignore-existing

echo "SUCCESS: MinIO is ready and 'vibespace-uploads' bucket is public."
# Set the bucket's policy to allow public downloads
mc policy set download ${MINIO_ALIAS}/${S3_BUCKET}

# Keep the container running
tail -f /dev/null
echo "SUCCESS: MinIO is configured and the '${S3_BUCKET}' bucket is public."