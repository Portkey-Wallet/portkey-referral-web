import { NetworkType, TSupportAccountType } from '@portkey/did-ui-react';

export type BackEndNetworkType = 'test3' | 'testnet' | 'mainnet' | 'test4';
export type NetworkItem = {
  name: string;
  networkType: NetworkType;
  apiUrl: string;
  domain?: string;
  connectUrl: string;
  graphqlUrl: string;
  cmsUrl: string;
  portkeyWebsiteUrl: string;
  loginType?: TSupportAccountType[];
};
