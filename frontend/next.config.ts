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
        hostname: 'picsum.photos',
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
      
    ],
  },

  async rewrites() {
    return [
      {
        // Source path: Any request starting with /api/
        source: '/api/:path*', 
        // Destination: Forward it to your backend server
        destination: 'http://localhost:5000/api/:path*', // Adjust port if needed
      },
    ];
  },
  // --- END ADD ---
};

export default nextConfig;
