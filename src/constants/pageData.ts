import {
  chromeDownload,
  googleGetIt,
  appStoreDownload,
} from '@/assets/images';

export interface SingleDownloadData {
  iconSrc: string;
  iconAlt: string;
  url: string;
  iconWidth?: number;
  iconHeight?: number;
}

export interface DownloadGroupData {
  downloadText: string;
  chrome: SingleDownloadData;
  android: SingleDownloadData;
  ios: SingleDownloadData;
}

export const pageData = {

}

export const downloadData: DownloadGroupData = {
  downloadText: 'Get Portkey App and make asset magagement easier.',
  chrome: {
    iconSrc: chromeDownload,
    url: 'https://portkey.finance/download',
    iconAlt: 'chromeDownloadLogo',
    iconWidth: 156,
    iconHeight: 30,
  },
  android: {
    iconSrc: googleGetIt,
    url: 'https://apps.apple.com/us/app/portkey-wallet-crypto-games/id6445808228',
    iconAlt: 'androidDownloadLogo',
    iconWidth: 112,
    iconHeight: 32,
  },
  ios: {
    iconSrc: appStoreDownload,
    url: 'https://play.google.com/store/apps/details?id=com.portkey.did',
    iconAlt: 'androidDownloadLogo',
    iconWidth: 112,
    iconHeight: 32,
  },
};
