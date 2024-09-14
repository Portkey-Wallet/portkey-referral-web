/**
 * @description
 * 1. Init axios, config axios, make multiple hook instances, etc
 * Please get more config follow this URL https://www.npmjs.com/package/axios-hooks#useaxiosurlconfig-options
 * 2. Please invoke axiosInit before any usages of the useAxios hook
 */
import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Axios from 'axios';
import { BASE_CMS_URL, BASE_CONNECT_URL, CMS_API } from './api';
import { interceptorsBind } from './utils';
import { ChainId } from '@portkey/types';
import { create } from 'apisauce';
import { stringify } from 'querystring';
import { ConnectHost } from '@/constants/network';

const BEARER = 'Bearer';
const DAY = 24 * 60 * 60 * 1000;

export type RefreshTokenConfig = {
  grant_type: 'signature';
  client_id: 'CAServer_App';
  scope: 'CAServer';
  signature: string;
  pubkey: string;
  timestamp: number;
  ca_hash: string;
  chainId: ChainId;
};
// Please invoke axiosInit before any usages of the useAxios hook
export default function initAxios() {
  const axios = Axios.create({
    baseURL: ConnectHost + BASE_CONNECT_URL,
    timeout: 50000,
  });
  interceptorsBind(axios);

  const cache = new LRU({ max: 10 });

  configure({ axios, cache });
  return axios;
}

const api = create({
  baseURL: ConnectHost + BASE_CONNECT_URL,
  axiosInstance: initAxios(),
});

const queryAuthorization = async (config: RefreshTokenConfig) => {
  const { ..._config } = config;
  const result = await api.post<{ access_token: string }>(
    '/token',
    stringify({ ..._config, chain_id: config.chainId }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // method: 'POST',
      // data: stringify({ ..._config, chain_id: config.chainId }),
    },
  );

  return `${BEARER} ${result.data?.access_token}`;
};
const isValidRefreshTokenConfig = (config: RefreshTokenConfig) => {
  const expireTime = config.timestamp + 1 * DAY;
  return expireTime >= Date.now();
};
export { BASE_CONNECT_URL, queryAuthorization, isValidRefreshTokenConfig };
