import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://api:3001/api/v1/:path*', // Proxy to Docker API container
      },
    ];
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
