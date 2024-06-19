import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { PORTKEY_REFERRAL_CA_HASH } from '@/constants/storage';
import { getConnectToken } from '@/utils/axios';
import useDiscoverProvider from './useDiscoverProvider';
import { ConnectHost } from '@/constants/network';
const AElf = require('aelf-sdk');

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
  const { connectWallet, disConnectWallet, walletInfo, walletType, isConnected, isLocking } = useConnectWallet();
  const [caHash, setCaHash] = useState<string | null>(isConnected ? getCaHash() : null);
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
      setCaHash(null);
      removeCaHash();
  }, [disConnectWallet]);
  useEffect(() => {
    (async () => {
      if (!isConnected) return;
      const caHash = await sync();
      if(caHash) {
        setCaHash(caHash);
        saveCaHash(caHash);
      }
      setSynced(true);
    })();
  }, [isConnected, sync]);
  return { login, sync, logout, isConnected, isLocking, caHash, synced };
}
