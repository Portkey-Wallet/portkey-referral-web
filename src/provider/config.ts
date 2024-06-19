import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum } from '@aelf-web-login/wallet-adapter-base';
import { ApiHost, ConnectHost, NetworkEnv } from '@/constants/network';
import { ConfigProvider } from '@portkey/did-ui-react';

const APP_NAME = 'referral.portkey.finance';
const WEBSITE_ICON = 'https://referral.portkey.finance/favicon.ico';
const CHAIN_ID = 'AELF' as TChainId;
const NETWORK_TYPE = NetworkEnv === 'mainnet' ? NetworkEnum.MAINNET : NetworkEnum.TESTNET;
ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});
const didConfig = {
  graphQLUrl: '/graphql',
  connectUrl: ConnectHost,
  requestDefaults: {
    baseURL: ApiHost,
    timeout: 30000,
  },
  socialLogin: {
    Portkey: {
      websiteName: APP_NAME,
      websiteIcon: WEBSITE_ICON,
    },
  },
};

const baseConfig = {
  networkType: NETWORK_TYPE,
  chainId: CHAIN_ID,
  keyboard: true,
  noCommonBaseModal: false,
  design: SignInDesignEnum.SocialDesign, // "SocialDesign" | "CryptoDesign" | "Web2Design"
  titleForSocialDesign: 'Crypto wallet',
  iconSrcForSocialDesign: 'url or base64',
};

const wallets = [
  new PortkeyAAWallet({
    appName: APP_NAME,
    chainId: CHAIN_ID,
    autoShowUnlock: true,
  }),
  new PortkeyDiscoverWallet({
    networkType: NETWORK_TYPE,
    chainId: CHAIN_ID,
    autoRequestAccount: true,
    autoLogoutOnDisconnected: true,
    autoLogoutOnNetworkMismatch: true,
    autoLogoutOnAccountMismatch: true,
    autoLogoutOnChainMismatch: true,
  })
]

export const config: IConfigProps = {
  didConfig,
  baseConfig,
  wallets
};