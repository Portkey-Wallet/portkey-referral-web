import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback, useEffect } from 'react';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { getConnectToken } from '@/utils/axios';
import useDiscoverProvider from './useDiscoverProvider';
export default function useAccount() {
  const { connectWallet, disConnectWallet, walletInfo, walletType, isConnected, isLocking, getSignature } = useConnectWallet();
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
      getConnectToken({
        grant_type: 'signature',
        client_id: 'CAServer_App',
        scope: 'CAServer',
        signature: signatureStr || '',
        pubkey: pubKey|| '',
        timestamp: timestamp || 0,
        ca_hash: caHash,
        chainId: originChainId,
      })
      return caHash;
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
      const caHash = await sync();
      console.log('useEffect sync success!', caHash);
    })();
  }, [isConnected, sync]);
  return { login, sync, logout, isConnected, isLocking };
}