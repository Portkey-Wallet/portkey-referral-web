import { openWithBlank } from '@/utils/router';
import { downloadData } from '@/constants/pageData';
import BaseImage from '@/components/BaseImage';
import styles from './styles.module.scss';
import { useCallback } from 'react';

export default function AndroidDownloadBtn({ url }: { url: string }) {
  const AndroidInfo = downloadData.android;

  const goAppleStore = useCallback(() => {
    openWithBlank(url);
  }, [url]);

  return (
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
  );
}
