import { NetworkType } from '@portkey/did-ui-react';

export type BackEndNetworkType = 'test3' | 'testnet' | 'mainnet';
export type NetworkItem = {
  name: string;
  networkType: NetworkType;
  apiUrl: string;
  connectUrl: string;
  graphqlUrl: string;
  cmsUrl: string;
};
