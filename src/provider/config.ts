import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum } from '@aelf-web-login/wallet-adapter-base';
import { ApiHost, ConnectHost, NetworkEnv } from '@/constants/network';

const APP_NAME = 'referral.portkey.finance';
const WEBSITE_ICON = 'https://referral.portkey.finance/favicon.ico';
const CHAIN_ID = 'AELF' as TChainId;
const NETWORK_TYPE = NetworkEnv === 'mainnet' ? NetworkEnum.MAINNET : NetworkEnum.TESTNET;
const RPC_SERVER_AELF = 'https://explorer-test.aelf.io/chain';
const RPC_SERVER_TDVV = 'https://explorer-test-side02.aelf.io/chain';
const RPC_SERVER_TDVW = 'https://explorer-test-side02.aelf.io/chain';
// const GRAPHQL_SERVER = 'https://dapp-aa-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql';
// const CONNECT_SERVER = ;
// ConfigProvider.setGlobalConfig({
//   graphQLUrl: '/graphql',
//   serviceUrl: ApiHost,
//   requestDefaults: {
//     baseURL: ApiHost,
//   },
// });
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
  design: SignInDesignEnum.CryptoDesign, // "SocialDesign" | "CryptoDesign" | "Web2Design"
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
  }),
  new NightElfWallet({
    chainId: CHAIN_ID,
    appName: APP_NAME,
    connectEagerly: true,
    defaultRpcUrl: RPC_SERVER_AELF,
    nodes: {
      AELF: {
        chainId: 'AELF',
        rpcUrl: RPC_SERVER_AELF,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: RPC_SERVER_TDVW,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: RPC_SERVER_TDVV,
      },
    },
  }),
]

export const config: IConfigProps = {
  didConfig,
  baseConfig,
  wallets
};