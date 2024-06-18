import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useCallback, useState } from 'react';
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
  const { getSignatureAndPublicKey } = useDiscoverProvider();
  console.log('1111wallet is:', walletInfo);
  console.log('1111walletType is:', walletType);
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
    const timestamp = Date.now();
    // const signInfo = Buffer.from(`${walletInfo?.address}-${timestamp}`).toString('hex');

      const signInfo =  AElf.utils.sha256(`${walletInfo?.address}-${timestamp}`)
      const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(walletInfo, walletType);
      setCaHash(caHash);
      saveCaHash(caHash);
      const { pubKey, signatureStr } = await getSignatureAndPublicKey(signInfo);
      console.log("caHash===", caHash);
      console.log("originChainId===", originChainId);
      getConnectToken({
        grant_type: 'signature',
        client_id: 'CAServer_App',
        scope: 'CAServer',
        signature: signatureStr || '',
        pubkey: pubKey|| '',
        timestamp,
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

  return { login, sync, logout, isConnected, isLocking, caHash };
}
