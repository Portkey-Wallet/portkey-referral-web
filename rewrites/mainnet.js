module.exports = [
  { source: '/api/:path*', destination: 'https://did-portkey.portkey.finance/api/:path*' },
  { source: '/connect/:path*', destination: 'https://auth-portkey.portkey.finance/connect/:path*' },
  {
    source: '/graphql/:path*',
    destination: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql/:path*',
  },
  { source: '/cms/:path*', destination: 'https://cms.portkey.finance/cms/:path*' },
];
