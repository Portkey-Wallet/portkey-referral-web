import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { PORTKEY_REFERRAL_CA_HASH } from '@/constants/storage';

export const saveCaHash = (caHash: string) => {
  setItem(PORTKEY_REFERRAL_CA_HASH, caHash);
};
export const getCaHash = () => {
  return getItem(PORTKEY_REFERRAL_CA_HASH);
};
export const removeCaHash = () => {
  removeItem(PORTKEY_REFERRAL_CA_HASH);
};

export default function useAccount() {
  const { connectWallet, disConnectWallet, walletInfo, walletType, isConnected } = useConnectWallet();
  const [caHash, setCaHash] = useState<string | null>(isConnected ? getCaHash() : null);
  const login = useCallback(async () => {
    try {
      const rs = await connectWallet();
      const { caHash } = await getCaHashAndOriginChainIdByWallet(walletInfo, walletType);
      setCaHash(caHash);
      saveCaHash(caHash);
      console.log('connect success', rs);
      console.log('caHash', caHash);
      return caHash;
    } catch (e: any) {
      console.log('connect failed', e.message)
    }
  }, [connectWallet, walletInfo, walletType]);
  const logout = useCallback(async () => {
      await disConnectWallet();
      setCaHash(null);
      removeCaHash();
  }, [disConnectWallet]);

  return { login, logout, isConnected, walletInfo, caHash };
}
