#!/bin/sh

# Exit script on any error
set -e

echo "Waiting for LocalStack S3 to be ready..."
# Use awslocal to wait for the S3 service to be available
# We can just poll the endpoint until it's ready
until awslocal s3api list-buckets --region ${AWS_DEFAULT_REGION:-us-east-1} --endpoint-url=http://localhost:4566 >/dev/null 2>&1; do
  echo "LocalStack S3 not ready yet, sleeping for 2 seconds..."
  sleep 2
done

echo "LocalStack S3 is ready. Configuring bucket..."

# Define the bucket name (must match your S3_BUCKET env var)
S3_BUCKET="vibespace-uploads"

# Create the bucket
echo "Creating bucket ${S3_BUCKET}..."
awslocal s3 mb s3://${S3_BUCKET} --region ${AWS_DEFAULT_REGION:-us-east-1} || echo "Bucket already exists, proceeding..."

# Apply your existing policy.json
echo "Applying policy from /scripts/policy.json to bucket ${S3_BUCKET}..."
awslocal s3api put-bucket-policy \
  --bucket ${S3_BUCKET} \
  --policy file:///scripts/policy.json \
  --region ${AWS_DEFAULT_REGION:-us-east-1}

echo "SUCCESS: LocalStack bucket '${S3_BUCKET}' created and policy applied."