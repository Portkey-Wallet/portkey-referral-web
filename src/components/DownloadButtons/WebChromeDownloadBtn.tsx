import { openWithBlank } from '@/utils/router';
import { downloadData } from '@/constants/pageData';
import BaseImage from '@/components/BaseImage';
import styles from './styles.module.scss';
import { useCallback } from 'react';

export default function WebChormeDownloadBtn() {
  const ChromeInfo = downloadData.chrome;

  const goAppleStore = useCallback(() => {
    openWithBlank(ChromeInfo.url);
  }, [ChromeInfo]);

  return (
    <BaseImage 
      onClick={goAppleStore}
      className={styles.downloadBtnWrapper}
      src={ChromeInfo.iconSrc}
      style={{
        width: ChromeInfo.iconWidth,
        height: ChromeInfo.iconHeight
      }}
      alt={ChromeInfo.iconAlt}
      priority
    />
  )
}