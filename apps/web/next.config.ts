import type { NextConfig } from "next";

// Content Security Policy for the DEV-TO-DEV web app.
//
// Design notes:
// - default-src 'self': only same-origin content is allowed by default.
// - script-src 'self' 'unsafe-inline': 'self' loads Next.js chunks; 'unsafe-inline'
//   is required by Next.js App Router's inline bootstrap script and the inline
//   JSON-LD <script> tags in layout.tsx (CSP applies to all <script> elements).
// - style-src 'self' 'unsafe-inline': 'unsafe-inline' is required by styled-jsx
//   and the application's inline style attributes.
// - img-src: Cloudinary media, Google/GitHub OAuth avatars, and YouTube thumbnails.
// - connect-src 'self' ws: wss:: same-origin API proxy plus the Socket.IO WebSocket.
// - object-src 'none' / base-uri 'self' / form-action 'self': harden against
//   plugin/based/form-redirection attacks.
// - frame-src 'self' / frame-ancestors 'self': the app embeds no external iframes
//   (YouTube links open in a new tab) and must not be framed by other origins.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' ws: wss:",
  "media-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async rewrites() {
    const apiTarget = process.env.INTERNAL_API_URL || 'http://api:3001';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/api/v1/:path*`, // Proxy to the API container
      },
      {
        source: '/socket.io/:path*',
        destination: `${apiTarget}/socket.io/:path*`, // Proxy Socket.IO to the API container
      },
    ];
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    // Always-on baseline headers (safe in both development and production).
    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    // Production-only hardening. HSTS is only meaningful over HTTPS; the CSP
    // omits 'unsafe-eval', which is only needed by Next.js dev Fast Refresh.
    const productionHeaders = isProduction
      ? [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
        ]
      : [];

    return [
      {
        source: '/:path*',
        headers: [...baseHeaders, ...productionHeaders],
      },
    ];
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
