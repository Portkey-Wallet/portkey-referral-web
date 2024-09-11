const rewrites = require('./rewrites/index');

/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     async rewrites() {
//         return rewrites;
//     },
// }

module.exports = {
  basePath: '/cryptoGift',
  assetPrefix: '/cryptoGift',
  reactStrictMode: false,
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
  publicRuntimeConfig: {
    basePath: getBasePath(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'portkey-did.s3.ap-northeast-1.amazonaws.com',
        port: '',
        // pathname: '/rmsportal/**',
        pathname: '/**',
      },
    ],
  },
};
