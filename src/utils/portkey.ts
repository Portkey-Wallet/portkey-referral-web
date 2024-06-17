import { TWalletInfo, WalletTypeEnum } from "@aelf-web-login/wallet-adapter-base";
import { did } from "@portkey/did-ui-react";
import { ChainId } from '@portkey/provider-types';
import {
  GetCAHolderByManagerParams,
} from '@portkey/services';
export function isPortkey() {
  if (typeof window === 'object') return window.navigator.userAgent.includes('Portkey');
  return false;
}
export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
export const getCaHashAndOriginChainIdByWallet = async (
  wallet: TWalletInfo,
  walletType: WalletTypeEnum,
): Promise<{ caHash: string; originChainId: ChainId }> => {
  let caHash, originChainId;
  if (walletType === WalletTypeEnum.discover) {
    const res = await did.services.communityRecovery.getHolderInfoByManager({
      caAddresses: [wallet?.address],
    } as unknown as GetCAHolderByManagerParams);
    const caInfo = res[0];
    caHash = caInfo?.caHash;
    originChainId = caInfo?.chainId as ChainId;
  } else {
    caHash = wallet?.extraInfo?.portkeyInfo?.caInfo?.caHash;
    originChainId = wallet?.extraInfo?.portkeyInfo?.chainId;
  }
  return {
    caHash: caHash || '',
    originChainId: originChainId,
  };
};