import { did } from '@portkey/did-ui-react';
import {
  CRYPTO_GIFT_ORIGIN_CHAIN_ID,
  DEFAULT_CRYPTO_GIFT_WALLET_KEY,
  DEFAULT_CRYPTO_GIFT_WALLET_PIN,
} from '@/constants/storage';
import { getItem } from './storage';
import { sleep } from './index';

export const isLogin = () => !!getItem(DEFAULT_CRYPTO_GIFT_WALLET_KEY);
export const fetchCaHolderInfo = async () => {
  const walletInfo = await did.load(DEFAULT_CRYPTO_GIFT_WALLET_PIN || '', DEFAULT_CRYPTO_GIFT_WALLET_KEY);

  const originChainId = getItem(CRYPTO_GIFT_ORIGIN_CHAIN_ID);

  // adjust data create
  let caHolderInfo;
  try {
    caHolderInfo = await walletInfo.getCAHolderInfo(originChainId || 'AELF');
  } catch (error) {
    console.log('getCAHolderInfo err', error);
    await sleep(1000);
    caHolderInfo = await walletInfo.getCAHolderInfo(originChainId || 'AELF');
  }

  return caHolderInfo;
};
