import { CRYPTO_GIFT_RANDOM_DEVICE_ID_KEY } from '@/constants/storage';
import { randomId } from '.';

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const removeItem = (key: string) => {
  if (localStorage.getItem(key) === null) return;
  return localStorage.removeItem(key);
};

export const getItem = (key: string): any => {
  let result = localStorage.getItem(key) || '';

  try {
    result = JSON.parse(result);
    return result;
  } catch (error) {
    return result;
  }
};

export const setLocalRandomDeviceId = (forceUpdate?: boolean): string => {
  if (!getLocalRandomDeviceId() || forceUpdate) {
    const id = randomId();
    setItem(CRYPTO_GIFT_RANDOM_DEVICE_ID_KEY, id);
    return id;
  }
  return getLocalRandomDeviceId();
};

export const getLocalRandomDeviceId = (): string => {
  return getItem(CRYPTO_GIFT_RANDOM_DEVICE_ID_KEY);
};
