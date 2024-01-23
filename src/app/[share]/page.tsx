'use client';
import clsx from 'clsx';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  DIDWalletInfo,
  SignIn,
  ISignIn,
  PortkeyProvider,
  singleMessage,
  did,
  ConfigProvider,
} from '@portkey/did-ui-react';
import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoWhite from '/public/portkeyLogoWhite.svg';
import logoWhite from '/public/logoWhite.svg';
import styles from './page.module.scss';
import QRCode from '@/components/QRCode';
import { referralWaterMark, referralColorBox, referralBgLines, referralDiscover } from '@/assets/images';
import { downloadData, portkeyDownloadPage, privacyPolicy, termsOfService } from '@/constants/pageData';
import IOSDownloadBtn from '@/components/DownloadButtons/IOSDownloadBtn';
import AndroidDownloadBtn from '@/components/DownloadButtons/AndroidDownloadBtn';
import '@portkey/did-ui-react/dist/assets/index.css';
import { openWithBlank } from '@/utils/router';
import { useSearchParams } from 'next/navigation';
import { API, get } from '@/utils/axios';
import { isPortkey } from '@/utils/portkey';
import { CurrentNetWork } from '@/constants/network';
import { devices } from '@portkey/utils';

enum REFERRAL_USER_STATE {
  REFERRAL = 'referral',
  INVITEE = 'invitee',
}

type TReferralProps = { share: REFERRAL_USER_STATE };

ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  loginConfig: {
    loginMethodsOrder: ['Google', 'Telegram', 'Apple', 'Phone', 'Email'],
    recommendIndexes: [0, 1],
  },
});

const Referral: React.FC<{ params: TReferralProps }> = ({ params }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [androidStoreUrl, setAndroidStoreUrl] = useState('');
  const [iOSStoreUrl, setIOSStoreUrl] = useState('');
  const [isPortkeyApp, setIsPortkeyApp] = useState<boolean>(true);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();

  const referralCode = searchParams.get('referral_code');
  const projectCode = searchParams.get('project_code');
  const shortLink = searchParams.get('shortLink') || '';
  const userRole = params.share;
  console.log('referralCode', referralCode);
  console.log('projectCode', projectCode);
  console.log('userRole', userRole);

  useEffect(() => {
    // device
    const isMobile = devices.isMobile().tablet || devices.isMobile().phone;
    const isIOS = devices.isMobile().apple.device;
    const isAndroid = devices.isMobile().android.device;
    setIsMobile(isMobile);
    setIsIOS(isIOS);
    setIsAndroid(isAndroid);

    // portkey app
    const isPortkeyApp = isPortkey();
    setIsPortkeyApp(isPortkeyApp);

    if (isPortkeyApp) {
      singleMessage.error({
        duration: 0,
        content: 'Please open the link in browser or scan the code using camera.',
        onClose: () => null,
        onClick: () => null,
      });
    }
  }, []);

  did.setConfig({
    referralInfo: {
      referralCode: referralCode || undefined,
      projectCode: projectCode || undefined,
    },
  });

  const onSignUp = () => {
    console.log('singup');
    signInRef.current?.setOpen(true);
  };

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(async (didWallet: DIDWalletInfo) => {
    console.log('didWallet', didWallet);
    setIsSignUp(true);

    const downloadResource = await get(API.GET.DOWNLOAD);
    setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
    setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');
  }, []);

  const getSloganCls = useMemo(() => {
    return userRole === REFERRAL_USER_STATE.REFERRAL ? styles.sloganReference : styles.sloganInvitee;
  }, [userRole]);

  const onDownload = () => {
    openWithBlank(portkeyDownloadPage);
  };

  const onCopyClick = () => {
    copyToClipboard(shortLink);
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  };

  return (
    <div className={styles.referralPage}>
      <div className={styles.referralBlueContainer}>
        <header className="row-center">
          <div className={clsx(['flex-row-center', styles.referralHeader])}>
            <BaseImage className={styles.portkeyLogo} src={portkeyLogoWhite} priority alt="portkeyLogo" />
          </div>
        </header>
        <div className={styles.referalMainContainer}>
          <BaseImage
            src={referralWaterMark}
            className={styles.bgWaterMark}
            alt="waterMark"
            priority
            width={253}
            height={378}
          />
          <BaseImage src={referralBgLines} className={styles.bgLines} alt="bglines" priority />
          <div className={styles.sloganWrapper}>
            <div className={getSloganCls}></div>
          </div>
          {userRole === REFERRAL_USER_STATE.INVITEE && (
            <div className={styles.inviteeText}>Seize the opportunity. Expect upcoming suprises!</div>
          )}
          <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
        </div>
      </div>

      <div className={styles.referralBlackWrapper}>
        {userRole === REFERRAL_USER_STATE.REFERRAL && shortLink && (
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
        )}

        {userRole === REFERRAL_USER_STATE.INVITEE && (
          <>
            {!isSignUp && (
              <div className={clsx(isMobile && styles.mobileReferralBtn)}>
                <button className={styles.referralBtn} onClick={onSignUp}>
                  Sign up
                </button>
              </div>
            )}

            {isSignUp && !isMobile && (
              <>
                <div className={styles.downTipsPC}>{downloadData.downloadText}</div>
                <button className={styles.referralBtn} onClick={onDownload}>
                  Download
                </button>
              </>
            )}

            {isSignUp && isMobile && (
              <div className={clsx('ios-safe-bottom', styles.Mdownload)}>
                <BaseImage src={logoWhite} width={32} height={32} alt="logo" />
                <div className={styles.downTipM}>{downloadData.downloadText}</div>
                {isIOS && <IOSDownloadBtn url={iOSStoreUrl} />}
                {isAndroid && <AndroidDownloadBtn url={androidStoreUrl} />}
              </div>
            )}
          </>
        )}
      </div>

      {!isPortkeyApp && (
        <PortkeyProvider networkType={CurrentNetWork.networkType}>
          <SignIn
            className={styles['invitee-sign-in']}
            defaultLifeCycle={{
              SignUp: undefined,
            }}
            termsOfService={termsOfService}
            privacyPolicy={privacyPolicy}
            uiType="Modal"
            ref={signInRef}
            onFinish={onFinish}
            onCancel={onCancel}
          />
        </PortkeyProvider>
      )}
    </div>
  );
};

export default Referral;
