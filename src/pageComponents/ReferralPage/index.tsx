'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PortkeyProvider, singleMessage } from '@portkey/did-ui-react';
import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoWhite from '/public/portkeyLogoWhite.svg';
import styles from './styles.module.scss';
import QRCode from '@/components/QRCode';
import MyInvitationBlock from './components/MyInvitationBlock';
import QrcodeModal from './components/QrcodeModal';
import TopRank from './components/TopRank';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  referralWaterMark,
  referralColorBox,
  referralBgLines,
  sloganReference,
  userProfile,
  interactiveCopyWhite,
} from '@/assets/images';
import '@portkey/did-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import referralApi from '@/utils/axios/referral';
import { useResponsive } from '@/hooks/useResponsive';
import useAccount from '@/hooks/useAccount';
import Image from 'next/image';
import { useEnvironment } from '@/hooks/environment';
import { useLoading } from '@/hooks/global';
import { CurrentNetWork } from '@/constants/network';
import googleAnalytics from '@/utils/googleAnalytics';

const Referral: React.FC = () => {
  const searchParams = useSearchParams();
  const shortLink = searchParams.get('shortLink') || '';
  const [, copyToClipboard] = useCopyToClipboard();
  const { isLogin, login, logout } = useAccount();
  const { isLG } = useResponsive();
  const { isPortkeyApp } = useEnvironment();
  const [myInvitedCount, setMyInvitedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setLoading } = useLoading();
  const [referralLink, setReferralLink] = useState(shortLink);

  useEffect(() => {
    (async () => {
      if (shortLink?.length > 0) {
        return;
      }
      if (!isLogin) {
        return;
      }
      try {
        const res = await referralApi.getReferralShortLink();
        setReferralLink(res?.shortLink);
        console.log('aaa getReferralShortLink : ', res);
      } catch (error: any) {
        console.log('aaaa getReferralShortLink error: ', error.message);
      }
    })();
  }, [isLogin, shortLink]);

  const fetchTotalCount = useCallback(async () => {
    try {
      const totalCount = await referralApi.referralTotalCount();
      console.log('referralTotalCount : ', totalCount);
      setMyInvitedCount(totalCount ?? 0);
    } catch (error) {
      console.error('referralTotalCount error : ', error);
    }
  }, []);
  useEffect(() => {
    if (isPortkeyApp) {
      setLoading(true);
    }
    if (isLogin) {
      if (isPortkeyApp) {
        setLoading(false);
      }
    }
  }, [isLogin, isPortkeyApp, setLoading]);
  useEffect(() => {
    if (isLogin) {
      fetchTotalCount();
    }
  }, [fetchTotalCount, isLogin]);

  const onLogout = useCallback(async () => {
    await logout();
    singleMessage.info('Logout successfully');
  }, [logout]);

  const onCopyClick = useCallback(() => {
    try {
      copyToClipboard(referralLink);
      singleMessage.success('Copied');
    } catch (error) {
      singleMessage.error('Failed');
    }
  }, [copyToClipboard, referralLink]);

  const SloganDOM = useMemo(() => {
    return (
      <div className={`${styles.sloganWrapper} ${isLG ? styles.sloganWrapperWidthH5 : styles.sloganWrapperWidthPC}`}>
        <BaseImage src={sloganReference} alt={sloganReference.src} height={isLG ? 94 : 100} />
      </div>
    );
  }, [isLG]);

  const qrcodeDom = useMemo(() => {
    return (
      <div className={styles.QRcodeWrapper}>
        <QRCode value={referralLink} size={132} quietZone={6} ecLevel="H" />
        <div className={styles.QRcodeContent}>
          <div className={styles.QRcodeTitle}>Referral Link</div>
          <div className={styles.QRcodeUrlWrapper}>
            <div className={styles.QRcodeUrl}>{referralLink}</div>
            <div className={styles.QRcodeCopyWrap} onClick={onCopyClick}>
              <BaseImage
                src={interactiveCopyWhite}
                className={styles.QRcodeCopy}
                alt="QRcodeCopy"
                priority
                width={16}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }, [onCopyClick, referralLink]);

  const inviteButton = useMemo(() => {
    return (
      <div
        className={styles.inviteButton}
        onClick={() => {
          googleAnalytics.referralInviteFriendsClickEvent();
          setIsModalOpen(true);
        }}>
        <div className={styles.inviteText}>Invite Friends</div>
      </div>
    );
  }, []);

  const onLogin = useCallback(async () => {
    try {
      await login();
    } catch (e: any) {
      console.error('aaaa connect failed', e.message);
    }
  }, [login]);

  const loginButton = useMemo(() => {
    return (
      <a className={styles.loginButton} onClick={onLogin}>
        <div className={styles.loginText}>Login</div>
      </a>
    );
  }, [onLogin]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={onLogout}>
          Log out
        </a>
      ),
    },
  ];

  return (
    <PortkeyProvider networkType={CurrentNetWork.networkType}>
      <div className={styles.referralPage}>
        <div className={styles.referralBlueContainer}>
          <header className="row-center">
            <div className={clsx(['flex-row-center', styles.referralHeader])}>
              <BaseImage className={styles.portkeyLogo} src={portkeyLogoWhite} priority alt="portkeyLogo" />
              {isLogin && !isPortkeyApp && (
                <Dropdown menu={{ items }} placement="bottomRight">
                  <a className={styles.profileButton}>
                    <Image className={styles.profileImage} width={24} src={userProfile} alt="avatar" />
                  </a>
                </Dropdown>
              )}
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
            <BaseImage
              src={referralColorBox}
              className={`${isLG ? styles.bgColorBoxH5 : styles.bgColorBoxPC}`}
              alt="bgColorBox"
              priority
            />
          </div>
        </div>
        <div className={`${styles.referralBlackWrapper} ${isLG ? styles.referralBlackWrapperMarginTopH5 : styles.referralBlackWrapperMarginTopPC}`}>
          {isLogin ? (
            <>
              <MyInvitationBlock invitationAmount={myInvitedCount} />
              {referralLink?.length > 0 && (isLG ? inviteButton : qrcodeDom)}
            </>
          ) : (
            loginButton
          )}
          <TopRank isLogin={isLogin} />
        </div>
        {isModalOpen && (
          <QrcodeModal
            shortLink={referralLink}
            handleCancel={() => {
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </PortkeyProvider>
  );
};

export default Referral;
