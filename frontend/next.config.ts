import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // --- ADD THIS 'images' BLOCK ---
  images: {
    remotePatterns: [
      // For Giphy URLs
      {
        protocol: 'https',
        hostname: 'media4.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media1.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media3.giphy.com',
      },
      // For your seed data
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      // For your local MinIO/S3 instance
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
    ],
  },
  // --- END ADD ---
};

export default nextConfig;
