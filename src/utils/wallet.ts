import { did } from '@portkey/did-ui-react';
import { DEFAULT_CRYPTO_GIFT_WALLET_KEY, DEFAULT_CRYPTO_GIFT_WALLET_PIN } from '@/constants/storage';
import { getItem } from './storage';

export const isLogin = () => !!getItem(DEFAULT_CRYPTO_GIFT_WALLET_KEY);
export const fetchCaHolderInfo = async () => {
  const walletInfo = await did.load(DEFAULT_CRYPTO_GIFT_WALLET_PIN || '', DEFAULT_CRYPTO_GIFT_WALLET_KEY);

  const caHolderInfo = await walletInfo.getCAHolderInfo('AELF');
  return caHolderInfo;
};
