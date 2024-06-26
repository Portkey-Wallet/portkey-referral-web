import { openWithBlank } from '@/utils/router';
import { downloadData } from '@/constants/pageData';
import BaseImage from '@/components/BaseImage';
import styles from './styles.module.scss';
import { useCallback, useState } from 'react';
import { detectBrowserName } from '@portkey/onboarding';
import OpenInBrowser from '../OpenInBrowser';

export default function AndroidDownloadBtn({ url }: { url: string }) {
  const AndroidInfo = downloadData.android;
  const [isShowMask, setIsShowMask] = useState(false);

  const goAppleStore = useCallback(() => {
    if (detectBrowserName() === 'WeChat') {
      setIsShowMask(true);
      return;
    }

    openWithBlank(url);
  }, [url]);

  return (
    <>
      <BaseImage
        onClick={goAppleStore}
        className={styles.downloadBtnWrapper}
        src={AndroidInfo.iconSrc}
        style={{
          width: AndroidInfo.iconWidth,
          height: AndroidInfo.iconHeight,
        }}
        alt={AndroidInfo.iconAlt}
        priority
      />
      {/* ====== mask ====== */}
      {isShowMask && <OpenInBrowser />}
    </>
  );
}
