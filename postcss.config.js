module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Only add cssnano in production builds, not development
    ...(process.env.NODE_ENV === 'production' && process.env.VERCEL ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    } : {}),
  },
}