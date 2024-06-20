import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { getConnectToken } from '@/utils/axios';
import useDiscoverProvider from './useDiscoverProvider';

export default function useAccount() {
  const { connectWallet, disConnectWallet, walletInfo, walletType, isConnected, isLocking } = useConnectWallet();
  const [synced, setSynced] = useState<boolean>(false);
  const { getSignatureAndPublicKey } = useDiscoverProvider();
  const login = useCallback(async () => {
    try {
      const rs = await connectWallet();
      return true;
    } catch (e: any) {
      console.log('connect failed', e.message)
      return false;
    }
  }, [connectWallet]);
  const sync = useCallback(async () => {
    try {
      if(!isConnected) {
        console.error('please connect wallet first!');
        return;
      }
      const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(walletInfo, walletType);
      const { pubKey, signatureStr, timestamp } = await getSignatureAndPublicKey();
      const token  = await getConnectToken({
        grant_type: 'signature',
        client_id: 'CAServer_App',
        scope: 'CAServer',
        signature: signatureStr || '',
        pubkey: pubKey|| '',
        timestamp: timestamp || 0,
        ca_hash: caHash,
        chainId: originChainId,
      })
      return token;
    } catch (e: any) {
      console.log('connect failed', e.message)
    }
  }, [getSignatureAndPublicKey, isConnected, walletInfo, walletType]);
  const logout = useCallback(async () => {
      await disConnectWallet();
  }, [disConnectWallet]);
  useEffect(() => {
    (async () => {
      if (!isConnected) return;
      try{
        setSynced(false);
        const token = await sync();
        console.log('jwt token:', token);
      } finally {
        setSynced(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);
  const isLogin = useMemo(() => isConnected && synced, [isConnected, synced]);
  return { login, sync, logout, isLogin, isLocking, isConnected };
}
