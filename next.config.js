/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images : {
    domains : ['media.geeksforgeeks.org', 'cdn.icon-icons.com', '*']
  },
};

module.exports = nextConfig;
