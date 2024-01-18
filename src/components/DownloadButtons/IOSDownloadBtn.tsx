import { openWithBlank } from '@/utils/router';
import { downloadData } from '@/constants/pageData';
import BaseImage from '@/components/BaseImage';
import styles from './styles.module.scss';
import { useCallback } from 'react';

export default function IOSDownloadBtn({ url }: { url: string }) {
  const IOSInfo = downloadData.ios;

  const goAppleStore = useCallback(() => {
    openWithBlank(url);
  }, [url]);

  return (
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
  );
}
