import { portkeyDownloadPage } from '@/constants/pageData';
import { useCallback, useEffect, useState } from 'react';
import { useEnvironment } from './environment';
import { openWithBlank } from '@/utils/router';
import { CMS_API, cmsGet } from '@/utils/axios';

export const useDownload = () => {
  const { isAndroid, isIOS, isMobile } = useEnvironment();
  const [extensionStoreUrl, setExtensionStoreUrl] = useState('');
  const [androidStoreUrl, setAndroidStoreUrl] = useState('');
  const [iOSStoreUrl, setIOSStoreUrl] = useState('');

  const onJumpToPortkeyWeb = useCallback(() => {
    openWithBlank(portkeyDownloadPage);
  }, []);

  const onJumpToStore = useCallback(() => {
    let url = portkeyDownloadPage;
    if (!isMobile) url = extensionStoreUrl;
    if (isAndroid) url = androidStoreUrl;
    if (isIOS) url = iOSStoreUrl;

    openWithBlank(url);
  }, [androidStoreUrl, extensionStoreUrl, iOSStoreUrl, isAndroid, isIOS, isMobile]);

  const getDownLoadSource = useCallback(
    async (init?: boolean) => {
      if (!androidStoreUrl || !extensionStoreUrl || !iOSStoreUrl || init) {
        const downloadResource = await cmsGet(CMS_API.GET.DOWNLOAD);
        setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
        setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');
        setExtensionStoreUrl(downloadResource?.data?.extensionDownLoadUrl || '');
      }
    },
    [androidStoreUrl, extensionStoreUrl, iOSStoreUrl],
  );

  useEffect(() => {
    getDownLoadSource(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { onJumpToStore, onJumpToPortkeyWeb };
};
