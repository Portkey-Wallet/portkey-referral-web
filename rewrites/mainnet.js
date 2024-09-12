module.exports = [
  { source: '/api/:path*', destination: 'https://aa-portkey.portkey.finance/api/:path*' },
  { source: '/service/:path*', destination: 'https://aa-portkey.portkey.finance/:path*' },
  { source: '/connect/:path*', destination: 'https://auth-aa-portkey.portkey.finance/connect/:path*' },
  {
    source: '/graphql/:path*',
    destination: 'https://dapp-aa-portkey.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql/:path*',
  },
  { source: '/cms/:path*', destination: 'https://cms.portkey.finance/:path*' }, // cms-aa-portkey.finance
  { source: '/cryptoGift/_next/:path*', destination: '/_next/:path*' },
];
