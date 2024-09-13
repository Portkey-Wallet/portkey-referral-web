// import { BackEndNetworkType } from '@/types/network';
// import { BackEndNetWorkMap } from '../../constants/network';

// const NEXT_PUBLIC_NETWORK_ENV: BackEndNetworkType = process.env.NEXT_PUBLIC_NETWORK_ENV as BackEndNetworkType;

// export const BASE_CMS_URL = NEXT_PUBLIC_NETWORK_ENV ? BackEndNetWorkMap[NEXT_PUBLIC_NETWORK_ENV]?.cmsUrl : '';
export const BASE_CMS_URL = '/cms';
export const BASE_PORTKEY_URL = '/api/app';
export const BASE_CONNECT_URL = '/connect';

export const CMS_API = {
  GET: {
    DOWNLOAD:
      'items/download?fields=*,extensionProductImage.filename_disk,extensionProductImage.id,androidProductImage.filename_disk,androidProductImage.id,androidQRCode.filename_disk,androidQRCode.id,iosProductImage.filename_disk,iosProductImage,id,iosQRCode.filename_disk,iosQRCode.id',
  },
};

export const PORTKEY_API = {
  GET: {
    CA_HOLDER_INDEX: '/search/caholderindex',
    CRYPTO_GIFT_DETAIL: '/cryptogift/detail',
    LOGIN_CRYPTO_GIFT_DETAIL: '/cryptogift/login/detail',
    INVITEE_CONFIG: '/growth/be-invited-configs',
  },
  POST: {
    GRAB: '/cryptogift/grab',
    LOGIN_USER_GRAB: '/redpackage/logged/grab',
    REPORT_ACCOUNT: '/report/account',
  },
};
