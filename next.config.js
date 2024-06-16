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
  experimental: {
    'react-use': {
      transform: 'react-use/lib/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ['error'],
  //   },
  // },
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zos.alipayobjects.com', // todo_wade: remove this hostname
        port: '',
        pathname: '/rmsportal/**',
      },
    ],
  },
};