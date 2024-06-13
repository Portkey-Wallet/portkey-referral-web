import { CRYPTO_GIFT_CA_HOLDER_INFO } from '@/constants/storage';
import { getItem, setItem } from '@/utils/storage';
import { fetchCaHolderInfo, isLogin } from '@/utils/wallet';
import { useCallback, useEffect, useState } from 'react';

type THolderInfo = {
  avatar: string;
  caHash: string;
  nickName: string;
};

export const useFetchAndStoreCaHolderInfo = () => {
  const [walletInfo, setWalletInfo] = useState<THolderInfo>();

  const fetchAndStoreCaHolderInfo = useCallback(async () => {
    try {
      const result = (await fetchCaHolderInfo()) as unknown as THolderInfo;
      setWalletInfo(result);
      setItem(CRYPTO_GIFT_CA_HOLDER_INFO, JSON.stringify(result));
    } catch (error) {
      console.log('fetchCaHolderInfo err', error);
    }
  }, []);

  useEffect(() => {
    const walletInfo = getItem(CRYPTO_GIFT_CA_HOLDER_INFO);
    setWalletInfo(walletInfo);
    fetchAndStoreCaHolderInfo();
  }, [fetchAndStoreCaHolderInfo]);

  return { walletInfo, setWalletInfo, fetchAndStoreCaHolderInfo };
};
