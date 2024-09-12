const rewrites = require('./rewrites/index');

/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     async rewrites() {
//         return rewrites;
//     },
// }

const projectType = process.env.NEXT_PUBLIC_PROJECT_TYPE;

module.exports = {
  assetPrefix: projectType === 'referral' ? '/' : '/cryptoGift',
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
    basePath: projectType === 'referral' ? '/' : '/cryptoGift',
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
