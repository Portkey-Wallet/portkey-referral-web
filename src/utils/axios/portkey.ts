/**
 * @description
 * 1. Init axios, config axios, make multiple hook instances, etc
 * Please get more config follow this URL https://www.npmjs.com/package/axios-hooks#useaxiosurlconfig-options
 * 2. Please invoke axiosInit before any usages of the useAxios hook
 */
import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Axios from 'axios';
import { BASE_PORTKEY_URL, PORTKEY_API } from './api';
import { interceptorsBind } from './utils';
import { create } from 'apisauce';
import { RefreshTokenConfig, isValidRefreshTokenConfig, queryAuthorization } from './connect';
import { DIDWalletInfo } from '@portkey/did-ui-react';
import { CurrentNetWork } from '@/constants/network';

const AElf = require('aelf-sdk');
// Please invoke axiosInit before any usages of the useAxios hook
export default function initAxios() {
  const axios = Axios.create({
    baseURL: CurrentNetWork.apiUrl + BASE_PORTKEY_URL,
    timeout: 50000,
  });
  interceptorsBind(axios);

  const cache = new LRU({ max: 10 });

  configure({ axios, cache });
  return axios;
}

const api = create({
  baseURL: CurrentNetWork.apiUrl + BASE_PORTKEY_URL,
  axiosInstance: initAxios(),
});

const portkeyGet = async (url: string, params?: any, config?: any) => {
  const res = await api.get(url, params, config);
  if (res.ok) {
    return res.data as any;
  }
};
const portkeyPost = async (url: string, params?: any, config?: any) => {
  const res = await api.post(url, params, config);
  console.log('portkeyPost!!', res);

  if (res.ok) {
    return res.data as any;
  }
};
const getConnectToken = async (refreshTokenConfig?: RefreshTokenConfig) => {
  try {
    if (!refreshTokenConfig || !isValidRefreshTokenConfig(refreshTokenConfig)) return;
    const authorization = await queryAuthorization(refreshTokenConfig);
    api.setHeader('Authorization', authorization);
    // this.emitConnectTokenChange(authorization);

    return authorization;
  } catch (error) {
    console.log(error, '====error-getConnectToken');
    return;
  }
};
const getAAConnectToken = async (didWallet: DIDWalletInfo) => {
  const timestamp = Date.now();
  const message = Buffer.from(`${didWallet.walletInfo.address}-${timestamp}`).toString('hex');
  const signature = AElf.wallet.sign(message, didWallet.walletInfo.keyPair).toString('hex');
  const pubKey = (didWallet.walletInfo.keyPair as any).getPublic('hex');
  return await getConnectToken({
    grant_type: 'signature',
    client_id: 'CAServer_App',
    scope: 'CAServer',
    signature: signature || '',
    pubkey: pubKey || '',
    timestamp: timestamp || 0,
    ca_hash: didWallet.caInfo.caHash,
    chainId: didWallet.chainId,
  });
};
const logoutPortkeyApi = () => {
  api.deleteHeader('Authorization');
};
export { PORTKEY_API, portkeyGet, portkeyPost, getConnectToken, getAAConnectToken, logoutPortkeyApi };
