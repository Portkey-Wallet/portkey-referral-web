import { BackEndNetworkType, NetworkItem } from '@/types/network';

export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  test3: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    apiUrl: 'http://192.168.67.127:5001',
    domain: 'https://test3-applesign-v2.portkey.finance',
    graphqlUrl: 'http://192.168.67.99:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.127:8080',
    cmsUrl: 'http://192.168.66.62:3005/graphql',
    portkeyWebsiteUrl: 'https://portkey-website-dev.vercel.app',
  },
  test4: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    apiUrl: 'http://192.168.66.117:5577',
    domain: 'https://test4-applesign-v2.portkey.finance',
    graphqlUrl: 'http://192.168.67.214:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.117:8080',
    cmsUrl: 'http://192.168.66.62:3005/graphql',
    portkeyWebsiteUrl: 'https://portkey-website-dev.vercel.app',
  },
  testnet: {
    name: 'aelf Testnet',
    networkType: 'TESTNET',
    apiUrl: 'https://aa-portkey-test.portkey.finance',
    graphqlUrl: 'https://test-indexer-api.aefinder.io/api/app/graphql/portkey',
    connectUrl: 'https://auth-aa-portkey-test.portkey.finance',
    cmsUrl: 'https://cms-test.portkey.finance',
    portkeyWebsiteUrl: 'https://test.portkey.finance',
    loginType: ['Google', 'Email', 'Apple', 'Telegram', 'Scan'],
    defaultChain: 'tDVW',
    tgMiniAppPath: 'https://t.me/PortkeyTestnet_Bot/crypto_gift',
    tgBotId: '7493109909',
  },
  mainnet: {
    name: 'aelf Mainnet',
    networkType: 'MAINNET',
    apiUrl: 'https://aa-portkey.portkey.finance',
    connectUrl: 'https://auth-aa-portkey.portkey.finance',
    graphqlUrl: 'https://indexer-api.aefinder.io/api/app/graphql/portkey',
    cmsUrl: 'https://cms-portkey.finance',
    portkeyWebsiteUrl: 'https://portkey.finance',
    loginType: ['Google', 'Email', 'Apple', 'Telegram', 'Scan'],
    defaultChain: 'tDVV',
    tgMiniAppPath: 'https://t.me/PortkeyMainnet_Bot/crypto_gift',
    tgBotId: '7489967024',
  },
};

export const NetworkEnv: BackEndNetworkType = process.env.NEXT_PUBLIC_NETWORK_ENV as BackEndNetworkType;
export const CurrentNetWork = BackEndNetWorkMap[NetworkEnv] ?? {};
export const ApiHost = CurrentNetWork.apiUrl;
export const DomainHost = CurrentNetWork.domain || CurrentNetWork.apiUrl;
export const LoginTypes = CurrentNetWork.loginType;
export const ConnectHost = CurrentNetWork.connectUrl;
export const GraphqlHost = CurrentNetWork.graphqlUrl;
export const CmsHost = CurrentNetWork.cmsUrl;
