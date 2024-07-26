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
import BaseImage from '@/components/BaseImage';
import portkeyAndHamsterLogo from '/public/portkeyAndHamsterLogo.svg';
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
  correctIcon,
  logoutIcon,
} from '@/assets/images';
import { downloadData, portkeyDownloadPage, privacyPolicy, termsOfService } from '@/constants/pageData';
import IOSDownloadBtn from '@/components/DownloadButtons/IOSDownloadBtn';
import AndroidDownloadBtn from '@/components/DownloadButtons/AndroidDownloadBtn';
import '@portkey/did-ui-react/dist/assets/index.css';
import { openWithBlank } from '@/utils/router';
import { useSearchParams } from 'next/navigation';
import { CMS_API, cmsGet, getAAConnectToken, getConnectToken } from '@/utils/axios';
import { isPortkey, isBrowser } from '@/utils/portkey';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost } from '@/constants/network';
import OpenInBrowser from '@/components/OpenInBrowser';
import { detectBrowserName } from '@portkey/onboarding';
import { BackEndNetworkType } from '@/types/network';
import { StaticImageData } from 'next/image';
import { useEnvironment } from '@/hooks/environment';
import { useFetchAndStoreCaHolderInfo } from '@/hooks/invitee';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useLoading } from '@/hooks/global';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { DEFAULT_INVITEE_WALLET_KEY, DEFAULT_INVITEE_WALLET_PIN, INVITEE_CA_ADDRESS, INVITEE_CA_HOLDER_INFO, INVITEE_IS_NEW_ACCOUNT, INVITEE_ORIGIN_CHAIN_ID } from '@/constants/storage';
import { PORTKEY_API, portkeyGet } from '@/utils/axios/index';
import { sleep } from '@/utils';
import googleAnalytics from '@/utils/googleAnalytics';
import { useEffectOnce } from '@/hooks/commonHooks';

const AElf = require('aelf-sdk');
ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

const Invitee: React.FC = () => {
  const { caHolderInfo, setCaHolderInfo, fetchAndStoreCaHolderInfo } = useFetchAndStoreCaHolderInfo();
  const { isMobile, isAndroid, isIOS } = useEnvironment();
  const [isShowMask, setIsShowMask] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);
  const [androidStoreUrl, setAndroidStoreUrl] = useState('');
  const [iOSStoreUrl, setIOSStoreUrl] = useState('');
  const [isPortkeyApp, setIsPortkeyApp] = useState<boolean>(true);
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();
  const [src, setSrc] = useState<StaticImageData>();
  const referralCode = searchParams.get('referral_code');
  const projectCode = searchParams.get('project_code');
  const networkType = searchParams.get('networkType') || '';
  const { setLoading } = useLoading();

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

  useEffectOnce(() => {
    const caAddress = getItem(INVITEE_CA_ADDRESS)
    const _isNewAccount = getItem(INVITEE_IS_NEW_ACCOUNT) === 'true'
    setIsSignUp(!!caAddress)
    setIsNewAccount(_isNewAccount)
  })

  did.setConfig({
    referralInfo: {
      referralCode: referralCode || undefined,
      projectCode: projectCode || undefined,
    },
  });

  const getInviteeConfig = useCallback(async () => {
    const res = await portkeyGet(PORTKEY_API.GET.INVITEE_CONFIG)
    console.log('🌹🌹🌹getInviteeConfig', res);
  }, [])

  useEffectOnce(() => {
    getInviteeConfig();
  })

  const onSignUp = () => {
    signInRef.current?.setOpen(true);
  };

  const playHamster = useCallback(() => {
    if (isSignUp) {
      // 
    }
  }, [isSignUp])

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(async (didWallet: DIDWalletInfo) => {
    console.log('didWallet', didWallet);

    googleAnalytics.portkeyLoginEvent(didWallet.createType, didWallet.accountInfo.accountType);

    await did.save(DEFAULT_INVITEE_WALLET_PIN, DEFAULT_INVITEE_WALLET_KEY);
    setItem(INVITEE_CA_ADDRESS, didWallet.caInfo.caAddress);
    setItem(INVITEE_ORIGIN_CHAIN_ID, didWallet.chainId);
    setItem(INVITEE_IS_NEW_ACCOUNT, `${didWallet.createType === 'register'}`)

    setIsSignUp(true);
    setIsNewAccount(didWallet.createType === 'register');
    setCaHolderInfo({ caHash: didWallet.caInfo.caHash, avatar: '', nickName: '' });
    await sleep(1000);
    fetchAndStoreCaHolderInfo();

    const downloadResource = await cmsGet(CMS_API.GET.DOWNLOAD);
    setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
    setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');

    await getAAConnectToken(didWallet);
  }, [fetchAndStoreCaHolderInfo, setCaHolderInfo]);

  const onDownload = useCallback(() => {
    openWithBlank(portkeyDownloadPage);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      setLoading(true);
      const originChainId = getItem(INVITEE_ORIGIN_CHAIN_ID);
      await did.logout({ chainId: originChainId });
      setCaHolderInfo(undefined);

      removeItem(INVITEE_CA_HOLDER_INFO);
      removeItem(DEFAULT_INVITEE_WALLET_KEY);
      removeItem(INVITEE_CA_ADDRESS);
      removeItem(INVITEE_IS_NEW_ACCOUNT);
      setIsSignUp(false);

      // await latestOnRefreshCryptoGiftDetail.current();
    } catch (error: any) {
      console.log('onLogout error', error);
      singleMessage.error(error?.message || 'fail');
    } finally {
      setLoading(false);
    }
  }, [setCaHolderInfo, setLoading]);

  const createNewAccount = useCallback(async () => {
    await onLogout();
    onSignUp();
  }, [onLogout])

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

  const blackContainerTitle = useMemo(() => {
    if (isSignUp) {
      return isNewAccount ? 'Tasks' : 'Notice';
    } else {
      return 'Tasks';
    }
  }, [isNewAccount, isSignUp]);

  const InviteeChapterDom = useMemo(() => {
    if (!isSignUp)
      return (
        <div className={styles.inviteeText}>
          <span>{`Complete referral tasks and earn ELF rewards!`}</span>
        </div>
      );

    if (isNewAccount)
      return (
        <div className={styles.inviteeText}>
          <span>{`You have successfully created a Portkey account! Now, click the button below to play Hamster Woods and start collecting $ACORNS.`}</span>
        </div>
      );

    return (
      <div className={styles.inviteeText}>
        <span>{`The current account can't participate. Only accounts created during the event period are eligible.`}</span>
      </div>
    );
  }, [isNewAccount, isSignUp]);

  const TaskDom = useMemo(() => {
    return (
      <div className={clsx(styles.taskWrapper, 'flex-column')}>
        {isSignUp ? (
          <div className={clsx('flex', styles.taskItem)}>
            <div className={styles.leftTaskItem}>
              <BaseImage src={correctIcon} alt={`correct-icon`} height={20} />
              <div className={styles.dividingLine}></div>
            </div>
            <div className={clsx(styles.rightTaskItem, 'flex-1')}>
              <div className={styles.title}>{`Create a Portkey account`}</div>
              <div className={styles.description}>{`🎉 Portkey account successfully created.`}</div>
            </div>
          </div>
        ) : (
          <div className={clsx('flex', styles.taskItem)}>
            <div className={styles.leftTaskItem}>
              <div className={clsx(styles.numberList, 'flex-center')}>1</div>
              <div className={styles.dividingLine}></div>
            </div>
            <div className={clsx(styles.rightTaskItem, 'flex-1')}>
              <div className={styles.title}>{`Create a Portkey account`}</div>
              <div className={styles.description}>{`Please click the button below to create your Portkey account.`}</div>
              <button className={styles.referralBtn} onClick={onSignUp}>{`Create Account`}</button>
            </div>
          </div>
        )}
        <div className={clsx('flex', styles.taskItem)}>
          <div className={styles.leftTaskItem}>
            <div className={clsx(styles.numberList, 'flex-center')}>2</div>
            <div className={styles.dividingLine}></div>
          </div>
          <div className={clsx(styles.rightTaskItem, 'flex-1')}>
            <div className={styles.title}>{`Play 🐹Hamster Woods and collect 130 $ACORNS`}</div>
            <div
              className={
                styles.description
              }>{`After creating a Portkey account, head to Hamster Woods for gameplay where you can collect on-chain assets $ACORNS for free. Once you collect 130 $ACORNS, the referral task is completed, and both you and the inviter will earn 1 $ELF each.`}</div>
            <button className={clsx(styles.referralBtn, isSignUp ? '': styles.btnDisabled)} onClick={playHamster}>{`Play 🐹Hamster Woods`}</button>
          </div>
        </div>
      </div>
    );
  }, [isSignUp, playHamster]);

  const NoticeDom = useMemo(() => {
    return (
      <div className={clsx(styles.notice, 'flex-column')}>
        <div>{`If you want to participate, please first create a new account via the button below.`}</div>
        <button className={styles.referralBtn} onClick={createNewAccount}>{`Create New Account`}</button>
      </div>
    );
  }, [createNewAccount]);

  const dropDownItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Log Out',
        icon: <BaseImage src={logoutIcon} alt={'logout'} width={16} height={16} />,
        onClick: () => {
          onLogout();
        },
      },
    ],
    [onLogout],
  );

  return (
    <div className={styles.referralPage}>
      <div className={styles.referralBlueContainer}>
        <header className="row-center">
          <div className={clsx(['flex-row-center', styles.referralHeader])}>
            <BaseImage className={styles.portkeyLogo} src={portkeyAndHamsterLogo} priority alt="portkeyLogo" />

            {caHolderInfo?.nickName && (
              <Dropdown overlayClassName="logout-drop-down" trigger={['click']} menu={{ items: dropDownItems }}>
                <Avatar alt="avatar" className={styles.userLogo} src={caHolderInfo?.avatar || ''}>
                  {caHolderInfo?.nickName?.[0]}
                </Avatar>
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
          {InviteeChapterDom}
          <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
        </div>
      </div>

      <div className={styles.referralBlackWrapper}>
        <>
          <div className={clsx('flex-column', styles.referralBlackContainer)}>
            <BaseImage
              src={referralWaterMark}
              className={styles.bgWaterMark}
              alt="waterMark"
              priority
              width={253}
              height={378}
            />
            <div className={clsx(styles.blackContainerTitle, 'row-center')}>{blackContainerTitle}</div>
            {isPortkeyApp ? null : isSignUp && !isNewAccount ? NoticeDom : TaskDom}
          </div>

          {/* {!isSignUp && !isPortkeyApp && (
            <div className={clsx(isMobile && styles.mobileReferralBtn)}>
              <button className={styles.referralBtn} onClick={onSignUp}>
                Sign up
              </button>
            </div>
          )} */}

          {isSignUp && !isMobile && (
            <div className={clsx(styles.downloadPCWrapper, 'row-center')}>
              <div className='row-center'>
                <BaseImage src={logoWhite} width={32} height={32} alt="logo" />
                <div className={styles.downTipsPC}>{downloadData.downloadText}</div>
              </div>
              <button className={styles.downloadPcBtn} onClick={onDownload}>
                Download
              </button>
            </div>
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
            pin={DEFAULT_INVITEE_WALLET_PIN}
          />
        </PortkeyProvider>
      )}

      {/* mask */}
      {isShowMask && <OpenInBrowser />}
    </div>
  );
};

export default Invitee;
