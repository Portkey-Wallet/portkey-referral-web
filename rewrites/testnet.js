module.exports = [
  { source: '/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
  { source: '/connect/:path*', destination: 'https://auth-portkey-test.portkey.finance/connect/:path*' },
  {
    source: '/graphql/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql/:path*',
  },
  { source: '/cms/:path*', destination: 'https://cms-test.portkey.finance/cms/:path*' },
];
