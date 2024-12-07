// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['causality.xyz'],
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