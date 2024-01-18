import { BackEndNetworkType, NetworkItem } from '@/types/network';

export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  dev: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    cmsUrl: 'https://localtest-applesign.portkey.finance/cms/',
  },
  testnet: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    cmsUrl: 'https://cms-test.portkey.finance/',
  },
  mainnet: {
    name: 'aelf Mainnet',
    networkType: 'MAIN',
    cmsUrl: 'https://cms.portkey.finance/',
  },
};
