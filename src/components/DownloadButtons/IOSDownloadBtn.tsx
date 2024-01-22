import { openWithBlank } from '@/utils/router';
import { downloadData } from '@/constants/pageData';
import BaseImage from '@/components/BaseImage';
import styles from './styles.module.scss';
import { useCallback, useState } from 'react';
import { detectBrowserName } from '@portkey/onboarding';
import OpenInBrowser from '../OpenInBrowser';

export default function IOSDownloadBtn({ url }: { url: string }) {
  const IOSInfo = downloadData.ios;
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
        src={IOSInfo.iconSrc}
        style={{
          width: IOSInfo.iconWidth,
          height: IOSInfo.iconHeight,
        }}
        alt={IOSInfo.iconAlt}
        priority
      />
      {/* ====== mask ====== */}
      {isShowMask && <OpenInBrowser />}
    </>
  );
}
