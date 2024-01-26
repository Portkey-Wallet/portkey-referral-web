module.exports = [
  // test3-v2
  { source: '/api/:path*', destination: 'http://192.168.67.127:5001/api/:path*' },
  { source: '/service/:path*', destination: 'http://192.168.67.127:5001/:path*' },
  { source: '/connect/:path*', destination: 'http://192.168.67.127:8080/connect/:path*' },
  {
    source: '/graphql/:path*',
    destination: 'http://192.168.67.99:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql/:path*',
  },
  { source: '/cms/:path*', destination: 'https://localtest-applesign.portkey.finance/cms/:path*' },
];
