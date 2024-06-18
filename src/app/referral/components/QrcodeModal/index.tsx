import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { close } from '@/assets/images';
import Image from 'next/image';
import BaseImage from '@/components/BaseImage';
import { referralWaterMark, referralDiscover, } from '@/assets/images';
import QRCode from '@/components/QRCode';

interface QrcodeModalProps {
  shortLink: string;
  handleCancel: () => void;
}

const QrcodeModal: React.FC<QrcodeModalProps> = ({ shortLink, handleCancel }) => {
  useEffect(() => {
    console.log('qrcode modal mounted');
  }, []);

  const onCopyClick = useCallback(() => {
    console.log('onCopyClick');
  }, []);

  const onShare = useCallback(() => {}, []);

  const headerDom = useMemo(() => {
    return (
      <div className={styles.headerWrap}>
        <div className={styles.headerTextWrap}>
          <div className={styles.headerText}>Referral Code</div>
          <div className={styles.headerImageWrap} onClick={handleCancel}>
            <Image src={close} width={20} height={20} alt="close" />
          </div>
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
        <div className={styles.titleText}>
          Referral Link
        </div>
        <div className={styles.linkAndCopyWrap}>
          <div className={styles.linkText}>
            https://aa-portkey-test.portkey.finance/api/app/account/4uzgvA
          </div>
          <BaseImage
              src={referralDiscover}
              className={styles.QRcodeCopy}
              alt="QRcodeCopy"
              priority
              width={20}
              onClick={onCopyClick}
            />
        </div>
      </div>
    );
  }, [onCopyClick]);

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
        {shareButton}
      </div>
    </div>
  );
};

export default QrcodeModal;
