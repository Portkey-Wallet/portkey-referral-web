module.exports = [
  { source: '/api/:path*', destination: 'https://aa-portkey-test.portkey.finance/api/:path*' },
  { source: '/service/:path*', destination: 'https://aa-portkey-test.portkey.finance/:path*' },
  { source: '/connect/:path*', destination: 'https://auth-aa-portkey-test.portkey.finance/connect/:path*' },
  {
    source: '/graphql/:path*',
    destination: 'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql/:path*',
  },
  { source: '/cms/:path*', destination: 'https://cms-test.portkey.finance/:path*' }, // cms-test-aa.portkey.finance
  { source: '/HamsterDataReporting/:path*', destination: 'https://aa-portkey-test.portkey.finance/HamsterDataReporting/:path*' },
  { source: '/dataReporting/:path*', destination: 'https://aa-portkey-test.portkey.finance/dataReporting/:path*' },
];
