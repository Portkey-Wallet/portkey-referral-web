// import { BackEndNetworkType } from '@/types/network';
// import { BackEndNetWorkMap } from '../../constants/network';

// const NEXT_PUBLIC_NETWORK_ENV: BackEndNetworkType = process.env.NEXT_PUBLIC_NETWORK_ENV as BackEndNetworkType;

// export const BASE_CMS_URL = NEXT_PUBLIC_NETWORK_ENV ? BackEndNetWorkMap[NEXT_PUBLIC_NETWORK_ENV]?.cmsUrl : '';
export const BASE_CMS_URL = '/cms';

export const API = {
  GET: {
    DOWNLOAD:
      'items/download?fields=*,extensionProductImage.filename_disk,extensionProductImage.id,androidProductImage.filename_disk,androidProductImage.id,androidQRCode.filename_disk,androidQRCode.id,iosProductImage.filename_disk,iosProductImage,id,iosQRCode.filename_disk,iosQRCode.id',
  },
};
