import { BackEndNetworkType, NetworkItem } from '@/types/network';

export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  test3: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    apiUrl: 'http://192.168.66.203:5001',
    connectUrl: 'http://192.168.66.203:8001',
    graphqlUrl: 'http://192.168.66.203:8083/AElfIndexer_DApp/PortKeyIndexerCASchema',
    cmsUrl: 'https://localtest-applesign.portkey.finance',
  },
  testnet: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    apiUrl: 'https://did-portkey-test.portkey.finance',
    connectUrl: 'https://auth-portkey-test.portkey.finance',
    graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema',
    cmsUrl: 'https://cms-test.portkey.finance',
  },
  mainnet: {
    name: 'aelf Mainnet',
    networkType: 'MAINNET',
    apiUrl: 'https://did-portkey.portkey.finance',
    connectUrl: 'https://auth-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema',
    cmsUrl: 'https://cms.portkey.finance',
  },
};

export const NetworkEnv: BackEndNetworkType = process.env.NEXT_PUBLIC_NETWORK_ENV as BackEndNetworkType;
export const CurrentNetWork = BackEndNetWorkMap[NetworkEnv];
export const ApiHost = CurrentNetWork.apiUrl;
export const ConnectHost = CurrentNetWork.connectUrl;
export const GraphqlHost = CurrentNetWork.graphqlUrl;
export const CmsHost = CurrentNetWork.cmsUrl;
