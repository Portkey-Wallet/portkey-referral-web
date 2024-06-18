'use client';
import clsx from 'clsx';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { singleMessage } from '@portkey/did-ui-react';
import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoWhite from '/public/portkeyLogoWhite.svg';
import styles from './page.module.scss';
import QRCode from '@/components/QRCode';
import MyInvitationBlock from './components/MyInvitationBlock';
import QrcodeModal from './components/QrcodeModal';
import TopRank from './components/TopRank';
import {
  referralWaterMark,
  referralColorBox,
  referralBgLines,
  referralDiscover,
  sloganReference,
} from '@/assets/images';
import '@portkey/did-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import referralApi from '@/utils/axios/referral';
import { useResponsive } from '@/hooks/useResponsive';
import useAccount from '@/hooks/useAccount';

const Referral: React.FC = () => {
  const searchParams = useSearchParams();
  const shortLink = searchParams.get('shortLink') || '';
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { isConnected, login } = useAccount();
  const { isLG } = useResponsive();
  const [myInvitedCount, setMyInvitedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchTotalCount();
  });

  const fetchTotalCount = useCallback(async () => {
    try {
      const totalCount = await referralApi.referralTotalCount({
        caHash: 'e47131fc105c8fe0ab230946559f98030cf52c9363f576f639b20ab2b2902f57',
      });
      setMyInvitedCount(totalCount);
    } catch (error) {
      console.error('referralTotalCount error : ', error);
    }
  }, []);

  const onCopyClick = useCallback(() => {
    copyToClipboard(shortLink);
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  }, [copyState.error, copyState.value, copyToClipboard, shortLink]);

  const SloganDOM = useMemo(() => {
    return (
      <div className={styles.sloganWrapper}>
        <BaseImage src={sloganReference} alt={sloganReference.src} height={100} />
      </div>
    );
  }, []);

  const qrcodeDom = useMemo(() => {
    return (
      <div className={styles.QRcodeWrapper}>
        <QRCode value={shortLink} size={132} quietZone={6} ecLevel="H" />
        <div className={styles.QRcodeContent}>
          <div className={styles.QRcodeTitle}>Referral Link</div>
          <div className={styles.QRcodeUrlWrapper}>
            <div className={styles.QRcodeUrl}>{shortLink}</div>
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
      </div>
    );
  }, [onCopyClick, shortLink]);

  const inviteButton = useMemo(() => {
    return (
      <div
        className={styles.inviteButton}
        onClick={() => {
          setIsModalOpen(true);
        }}>
        <div className={styles.inviteText}>Invite Friends</div>
      </div>
    );
  }, []);

  const loginButton = useMemo(() => {
    return (
      <div className={styles.loginButton} onClick={login}>
        <div className={styles.loginText}>Login</div>
      </div>
    );
  }, [login]);

  return (
    <NiceModal.Provider>
      <div className={styles.referralPage}>
        <div className={styles.referralBlueContainer}>
          <header className="row-center">
            <div className={clsx(['flex-row-center', styles.referralHeader])}>
              <BaseImage className={styles.portkeyLogo} src={portkeyLogoWhite} priority alt="portkeyLogo" />
            </div>
          </header>
          <div className={styles.referralMainContainer}>
            <BaseImage
              src={referralWaterMark}
              className={styles.bgWaterMark}
              alt="waterMark"
              priority
              width={253}
              height={378}
            />
            <BaseImage src={referralBgLines} className={styles.bgLines} alt="bglines" priority />
            {SloganDOM}
            <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
          </div>
        </div>
        <div className={styles.referralBlackWrapper}>
          {true ? (
            <>
              <MyInvitationBlock invitationAmount={myInvitedCount} />
              {shortLink && isLG ? inviteButton : qrcodeDom}
            </>
          ) : (
            loginButton
          )}
          <TopRank />
        </div>
        {isModalOpen && (
          <QrcodeModal
            shortLink={shortLink}
            handleCancel={() => {
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </NiceModal.Provider>
  );
};

export default Referral;
