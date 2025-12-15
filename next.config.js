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
  // Standard configuration
  experimental: {},
  // Ensure static assets are properly served
  trailingSlash: false,
}

module.exports = nextConfig