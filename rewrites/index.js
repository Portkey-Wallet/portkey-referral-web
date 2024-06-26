const mainnetConfig = require('./mainnet');
const testnetConfig = require('./testnet');
const test3Config = require('./test3');
const { NEXT_PUBLIC_NETWORK_ENV } = process.env;

module.exports =
  NEXT_PUBLIC_NETWORK_ENV === 'mainnet'
    ? mainnetConfig
    : NEXT_PUBLIC_NETWORK_ENV === 'testnet'
      ? testnetConfig
      : test3Config;
