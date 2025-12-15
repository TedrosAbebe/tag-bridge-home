/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Production optimizations
  experimental: {},
  // Force CSS generation in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure static assets are properly served
  trailingSlash: false,
  // Empty turbopack config to silence warnings
  turbopack: {},
}

module.exports = nextConfig