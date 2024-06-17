import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback } from 'react';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';

export default function useAccount() {
  const { connectWallet, disConnectWallet, walletInfo, walletType } = useConnectWallet();
  const login = useCallback(async () => {
    try {
      const rs = await connectWallet();
      const { caHash } = await getCaHashAndOriginChainIdByWallet(walletInfo, walletType);
      return caHash;
      console.log('connect success', rs);
    } catch (e: any) {
      console.log('connect failed', e.message)
    }
  }, [connectWallet, walletInfo, walletType]);
  const logout = useCallback(async () => {
      await disConnectWallet();
  }, [disConnectWallet]);

  return { login, logout };
}
