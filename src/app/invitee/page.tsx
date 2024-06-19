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
import {
  referralWaterMark,
  referralColorBox,
  referralBgLines,
  sloganReference,
  sloganInviteeCreate,
  sloganInviteeCreateMobile,
  sloganInviteeExist,
  sloganInviteeExistMobile,
  sloganInviteeDefault,
  sloganInviteeDefaultMobile,
} from '@/assets/images';
import { downloadData, portkeyDownloadPage, privacyPolicy, termsOfService } from '@/constants/pageData';
import IOSDownloadBtn from '@/components/DownloadButtons/IOSDownloadBtn';
import AndroidDownloadBtn from '@/components/DownloadButtons/AndroidDownloadBtn';
import '@portkey/did-ui-react/dist/assets/index.css';
import { openWithBlank } from '@/utils/router';
import { useSearchParams } from 'next/navigation';
import { CMS_API, cmsGet, getConnectToken } from '@/utils/axios';
import { isPortkey, isBrowser } from '@/utils/portkey';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost } from '@/constants/network';
import OpenInBrowser from '@/components/OpenInBrowser';
import { detectBrowserName } from '@portkey/onboarding';
import { BackEndNetworkType } from '@/types/network';
import { StaticImageData } from 'next/image';
import { useEnvironment } from '@/hooks/environment';

const AElf = require('aelf-sdk');
ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

const Invitee: React.FC = () => {
  const { isMobile, isAndroid, isIOS } = useEnvironment();
  const [isShowMask, setIsShowMask] = useState(false);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);
  const [androidStoreUrl, setAndroidStoreUrl] = useState('');
  const [iOSStoreUrl, setIOSStoreUrl] = useState('');
  const [isPortkeyApp, setIsPortkeyApp] = useState<boolean>(true);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();
  const [src, setSrc] = useState<StaticImageData>();
  const referralCode = searchParams.get('referral_code');
  const projectCode = searchParams.get('project_code');
  const shortLink = searchParams.get('shortLink') || '';
  const networkType = searchParams.get('networkType') || '';

  useEffect(() => {
    const nodeInfo = BackEndNetWorkMap[networkType as BackEndNetworkType] || CurrentNetWork;

    ConfigProvider.setGlobalConfig({
      graphQLUrl: `${networkType && nodeInfo ? `${window.location.origin}/${networkType}/graphql` : '/graphql'}`,
      serviceUrl: nodeInfo?.domain || nodeInfo?.apiUrl || DomainHost,
      requestDefaults: {
        baseURL: networkType && nodeInfo ? `${window.location.origin}/${networkType}` : '',
      },
    });
  }, [networkType]);

  useEffect(() => {
    if (detectBrowserName() === 'WeChat') {
      setIsShowMask(true);
      return;
    }

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
    setIsNewAccount(didWallet.createType === 'register');

    const downloadResource = await cmsGet(CMS_API.GET.DOWNLOAD);
    setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
    setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');

    const timestamp = Date.now();
    const message = Buffer.from(`${didWallet.walletInfo.address}-${timestamp}`).toString('hex');
    const signature = AElf.wallet.sign(message, didWallet.walletInfo.keyPair).toString('hex');
    const pubKey = (didWallet.walletInfo.keyPair as any).getPublic('hex');
    getConnectToken({
      grant_type: 'signature',
      client_id: 'CAServer_App',
      scope: 'CAServer',
      signature: signature || '',
      pubkey: pubKey|| '',
      timestamp: timestamp || 0,
      ca_hash: didWallet.caInfo.caHash,
      chainId: didWallet.chainId,
    })
  }, []);

  const onDownload = useCallback(() => {
    openWithBlank(portkeyDownloadPage);
  }, []);

  const onCopyClick = useCallback(() => {
    copyToClipboard(shortLink);
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  }, [copyState.error, copyState.value, copyToClipboard, shortLink]);

  useEffect(() => {
    const isInMobile = !isBrowser() || isMobile;
    let sourceUri = sloganReference;

    // default
    if (!isSignUp && !isInMobile) {
      sourceUri = sloganInviteeDefault;
    }
    if (!isSignUp && isInMobile) sourceUri = sloganInviteeDefaultMobile;

    // registered
    if (isSignUp && !isInMobile) sourceUri = sloganInviteeCreate;
    if (isSignUp && isNewAccount && isInMobile) sourceUri = sloganInviteeCreateMobile;

    // others
    if (isSignUp && !isNewAccount && !isInMobile) sourceUri = sloganInviteeExist;
    if (isSignUp && !isNewAccount && isInMobile) sourceUri = sloganInviteeExistMobile;

    setSrc(sourceUri);
  }, [isMobile, isNewAccount, isSignUp]);

  const SloganDOM = useMemo(() => {
    if (!src) return <div style={{ height: 100 }} />;

    return (
      <div className={styles.sloganWrapper}>
        <BaseImage src={src} alt={src.src} height={100} />
      </div>
    );
  }, [src]);

  const InviteeChapterDom = useMemo(() => {
    if (!isSignUp)
      return (
        <div className={styles.inviteeText}>
          <span className={styles.row2}>{`Seize the opportunity.`}</span>
          <span className={styles.row2}>{` Expect upcoming surprises!`}</span>
        </div>
      );

    if (isNewAccount)
      return (
        <div className={styles.inviteeText}>
          <span>{`You have signed up on Portkey successfully!`}</span>
        </div>
      );

    return (
      <div className={styles.inviteeText}>
        <div>
          <span className={styles.row2}>{`This is an existing account and can't`}</span>
          <span className={styles.row2}>{` accept invitation.`}</span>
        </div>
        <div>
          <span className={styles.row2}>{`You can access your own Portkey and`}</span>
          <span className={styles.row2}>{` experience Web3 now!`}</span>
        </div>
      </div>
    );
  }, [isNewAccount, isSignUp]);

  return (
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
          {InviteeChapterDom}
          <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
        </div>
      </div>

      <div className={styles.referralBlackWrapper}>
        <>
          {!isSignUp && !isPortkeyApp && (
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

      {/* mask */}
      {isShowMask && <OpenInBrowser />}
    </div>
  );
};

export default Invitee;
