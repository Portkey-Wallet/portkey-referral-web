module.exports = [
  // test3-v2
  { source: '/api/:path*', destination: 'http://192.168.64.201:5001/api/:path*' },
  { source: '/connect/:path*', destination: 'http://192.168.64.201:8080/connect/:path*' },
  { source: '/graphql/:path*', destination: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql/:path*' },
];