#!/bin/sh

# Give the MinIO server plenty of time to start
sleep 10

# 1. Log in to the MinIO server
mc alias set local http://minio:9000 corey Sandersco8891

# 2. Create the bucket if it doesn't already exist
mc mb local/vibespace-uploads --ignore-existing

# 3. Set the bucket's policy to allow public downloads
mc policy set download local/vibespace-uploads

echo "SUCCESS: MinIO is ready and 'vibespace-uploads' bucket is public."

# Keep the container running
tail -f /dev/null