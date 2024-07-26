import { INVITEE_CA_HOLDER_INFO } from '@/constants/storage';
import { fetchCaHolderInfo } from '@/utils/inviteeWallet';
import { getItem, setItem } from '@/utils/storage';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

type THolderInfo = {
  avatar: string;
  caHash: string;
  nickName: string;
};

export const useFetchAndStoreCaHolderInfo = () => {
  const [caHolderInfo, setCaHolderInfo] = useState<THolderInfo>();

  const fetchAndStoreCaHolderInfo = useCallback(async () => {
    try {
      const result = (await fetchCaHolderInfo()) as unknown as THolderInfo;
      setCaHolderInfo(result);
      setItem(INVITEE_CA_HOLDER_INFO, JSON.stringify(result));
    } catch (error) {
      console.log('fetchCaHolderInfo err', error);
    }
  }, []);

  useLayoutEffect(() => {
    const caHolderInfo = getItem(INVITEE_CA_HOLDER_INFO);
    setCaHolderInfo(caHolderInfo);
    fetchAndStoreCaHolderInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { caHolderInfo, setCaHolderInfo, fetchAndStoreCaHolderInfo };
};
