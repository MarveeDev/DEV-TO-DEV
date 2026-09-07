import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiTarget = process.env.INTERNAL_API_URL || 'http://api:3001';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/api/v1/:path*`, // Proxy to the API container
      },
    ];
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
