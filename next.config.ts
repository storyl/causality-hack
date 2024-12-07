// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'causality.xyz',
        port: '',
        pathname: '/upload/**',
      },
    ],
  },
}

module.exports = nextConfig