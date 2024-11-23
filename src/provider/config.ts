import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum, DEFAULT_PIN } from '@aelf-web-login/wallet-adapter-base';
import { ApiHost, ConnectHost, CurrentNetWork, NetworkEnv, GraphqlHost } from '@/constants/network';
import { ConfigProvider } from '@portkey/did-ui-react';
import { GlobalConfigProps } from '@portkey/did-ui-react/dist/_types/src/components/config-provider/types';
import { isInPortkeyTgBot } from '@/utils';
import { CRYPTO_GIFT_APP_NAME_IN_TG } from '@/constants/storage';

const APP_NAME = isInPortkeyTgBot() ? CRYPTO_GIFT_APP_NAME_IN_TG : 'referral.portkey.finance';
const WEBSITE_ICON = 'https://referral.portkey.finance/favicon.ico';
const CHAIN_ID = CurrentNetWork.defaultChain as TChainId;
const NETWORK_TYPE = NetworkEnv === 'mainnet' ? NetworkEnum.MAINNET : NetworkEnum.TESTNET;

const didConfig: GlobalConfigProps = {
  graphQLUrl: GraphqlHost,
  connectUrl: ConnectHost,
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
    timeout: 30000,
  },
  socialLogin: {
    Portkey: {
      websiteName: APP_NAME,
      websiteIcon: WEBSITE_ICON,
    },
    Telegram: {
      botId: CurrentNetWork.tgBotId,
    },
  },
  loginConfig: {
    loginMethodsOrder: ['Email', 'Google', 'Apple', 'Scan', 'Telegram'],
  },
};

const baseConfig = {
  showVconsole: CurrentNetWork.networkType === 'MAINNET' ? false : true,
  networkType: NETWORK_TYPE,
  chainId: CHAIN_ID,
  keyboard: true,
  noCommonBaseModal: false,
  defaultPin: DEFAULT_PIN, // TODO: should be removed
  omitTelegramScript: true,
  cancelAutoLoginInTelegram: true,
  design: SignInDesignEnum.SocialDesign, // "SocialDesign" | "CryptoDesign" | "Web2Design"
  titleForSocialDesign: 'Sign up and Unlock Web3',
  iconSrcForSocialDesign:
    'data:image/png;base64,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',
};

console.log('baseConfig', baseConfig);

const wallets = [
  new PortkeyAAWallet({
    appName: APP_NAME,
    chainId: CHAIN_ID,
    autoShowUnlock: true,
    noNeedForConfirm: true,
  }),
  // new PortkeyDiscoverWallet({
  //   networkType: NETWORK_TYPE,
  //   chainId: CHAIN_ID,
  //   autoRequestAccount: true,
  //   autoLogoutOnDisconnected: true,
  //   autoLogoutOnNetworkMismatch: true,
  //   autoLogoutOnAccountMismatch: true,
  //   autoLogoutOnChainMismatch: true,
  // }),
];

export const config: IConfigProps = {
  didConfig,
  baseConfig,
  wallets,
};
