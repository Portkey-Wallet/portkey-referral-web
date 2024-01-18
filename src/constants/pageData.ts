import { chromeDownload, googleGetIt, appStoreDownload } from '@/assets/images';

export interface SingleDownloadData {
  iconSrc: string;
  iconAlt: string;
  iconWidth?: number;
  iconHeight?: number;
}

export interface DownloadGroupData {
  downloadText: string;
  chrome: SingleDownloadData;
  android: SingleDownloadData;
  ios: SingleDownloadData;
}

export const termsOfService = 'https://portkey.finance/terms-of-service';
export const privacyPolicy = 'https://portkey.finance/privacy-policy';
export const portkeyDownloadPage = 'https://portkey.finance/download';

export const downloadData: DownloadGroupData = {
  downloadText: 'Get Portkey App and make asset management easier.',
  chrome: {
    iconSrc: chromeDownload,
    iconAlt: 'chromeDownloadLogo',
    iconWidth: 156,
    iconHeight: 30,
  },
  android: {
    iconSrc: googleGetIt,
    iconAlt: 'androidDownloadLogo',
    iconWidth: 112,
    iconHeight: 32,
  },
  ios: {
    iconSrc: appStoreDownload,
    iconAlt: 'androidDownloadLogo',
    iconWidth: 112,
    iconHeight: 32,
  },
};
