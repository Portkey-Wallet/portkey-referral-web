'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { close } from '@/assets/images';
import Image from 'next/image';
import BaseImage from '@/components/BaseImage';
import { interactiveCopy } from '@/assets/images';
import QRCode from '@/components/QRCode';
import { useEnvironment } from '@/hooks/environment';
import { useCopyToClipboard } from 'react-use';
import { singleMessage } from '@portkey/did-ui-react';
import detectProviderInstance from '@/utils/detectProvide';

interface QrcodeModalProps {
  shortLink: string;
  handleCancel: () => void;
}

const QrcodeModal: React.FC<QrcodeModalProps> = ({ shortLink, handleCancel }) => {
  const { isPortkeyApp } = useEnvironment();
  const [copyState, copyToClipboard] = useCopyToClipboard();

  const onCopyClick = useCallback(() => {
    copyToClipboard(shortLink);
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  }, [copyState.error, copyState.value, copyToClipboard, shortLink]);

  const onShare = useCallback(async () => {
    detectProviderInstance.share({ title: shortLink, message: shortLink });
  }, [shortLink]);

  const headerDom = useMemo(() => {
    return (
      <div className={styles.headerWrap}>
        <div className={styles.headerTextWrap}>
          <div className={styles.headerText}>Referral Code</div>
        </div>
        <div className={styles.headerImageWrap} onClick={handleCancel}>
          <Image className={styles.headerImage} src={close} width={22} height={22} alt="close" />
        </div>
      </div>
    );
  }, [handleCancel]);

  const qrcodeImageDom = useMemo(() => {
    return (
      <div className={styles.qrcodeImageWrap}>
        <QRCode value={shortLink} size={132} quietZone={6} ecLevel="H" />
      </div>
    );
  }, [shortLink]);

  const linkDom = useMemo(() => {
    return (
      <div className={styles.linkWrap}>
        <div className={styles.titleText}>Referral Link</div>
        <div className={styles.linkAndCopyWrap}>
          <div className={styles.linkText}>{shortLink}</div>
          <div onClick={onCopyClick} className={styles.copyImageWrap}>
            <BaseImage src={interactiveCopy} className={styles.copyImage} alt="QRcodeCopy" priority width={16} />
          </div>
        </div>
      </div>
    );
  }, [onCopyClick, shortLink]);

  const shareButton = useMemo(() => {
    return (
      <div className={styles.shareButton} onClick={onShare}>
        <div className={styles.shareText}>Share</div>
      </div>
    );
  }, [onShare]);

  return (
    <div className={styles.mask}>
      <div className={styles.dialog}>
        {headerDom}
        {qrcodeImageDom}
        {linkDom}
        {isPortkeyApp && shareButton}
      </div>
    </div>
  );
};

export default QrcodeModal;
