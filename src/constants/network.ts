import { BackEndNetworkType, NetworkItem } from '@/types/network';

export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  test3: {
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
    networkType: 'MAINNET',
    cmsUrl: 'https://cms.portkey.finance/',
  },
};

export const NetworkEnv: BackEndNetworkType = process.env.NEXT_PUBLIC_NETWORK_ENV as BackEndNetworkType;
export const CurrentNetWork = BackEndNetWorkMap[NetworkEnv];
