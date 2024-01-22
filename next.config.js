const rewrites = require('./rewrites/index');

/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     async rewrites() {
//         return rewrites;
//     },
// }

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewrites;
  },
};
