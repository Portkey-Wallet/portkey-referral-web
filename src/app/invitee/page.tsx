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
import portkeyLogoWhite from '/public/portkeyLogoWhite.svg';
import logoWhite from '/public/logoWhite.svg';
import styles from './page.module.scss';
import {
  referralColorBox,
  sloganInviteeDefault,
  sloganInviteeDefaultMobile,
  logoutIcon,
  suggestCloseIcon,
} from '@/assets/images';
import { downloadData, portkeyDownloadPage, privacyPolicy, termsOfService } from '@/constants/pageData';
import IOSDownloadBtn from '@/components/DownloadButtons/IOSDownloadBtn';
import AndroidDownloadBtn from '@/components/DownloadButtons/AndroidDownloadBtn';
import '@portkey/did-ui-react/dist/assets/index.css';
import { openWithBlank } from '@/utils/router';
import { useSearchParams } from 'next/navigation';
import { CMS_API, cmsGet, getAAConnectToken, getConnectToken } from '@/utils/axios';
import { isPortkey, isBrowser } from '@/utils/portkey';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost, GraphqlHost } from '@/constants/network';
import OpenInBrowser from '@/components/OpenInBrowser';
import { detectBrowserName } from '@portkey/onboarding';
import { BackEndNetworkType } from '@/types/network';
import { StaticImageData } from 'next/image';
import { useEnvironment } from '@/hooks/environment';
import { useFetchAndStoreCaHolderInfo } from '@/hooks/invitee';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useLoading } from '@/hooks/global';
import { getItem, removeItem, setItem } from '@/utils/storage';
import {
  DEFAULT_INVITEE_WALLET_KEY,
  DEFAULT_INVITEE_WALLET_PIN,
  INVITEE_CA_ADDRESS,
  INVITEE_CA_HOLDER_INFO,
  INVITEE_IS_NEW_ACCOUNT,
  INVITEE_ORIGIN_CHAIN_ID,
} from '@/constants/storage';
import { PORTKEY_API, portkeyGet } from '@/utils/axios/index';
import { sleep } from '@/utils';
import googleAnalytics from '@/utils/googleAnalytics';
import { useEffectOnce } from '@/hooks/commonHooks';

const AElf = require('aelf-sdk');
ConfigProvider.setGlobalConfig({
  graphQLUrl: GraphqlHost,
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

enum StepEnum {
  UnLogin = 'UnLogin',
  TaskOneCompleted = 'TaskOneCompleted',
  SocialRecovery = 'SocialRecovery',
}

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
  const referralCode = searchParams?.get('referral_code');
  const projectCode = searchParams?.get('project_code');
  const networkType = searchParams?.get('networkType') || '';
  const { setLoading } = useLoading();
  const [configAllData, setConfigAllData] = useState<any>();
  const [step, setStep] = useState<StepEnum>(StepEnum.UnLogin);

  const currentStepConfigData = useMemo(() => {
    return configAllData?.[step];
  }, [configAllData, step]);

  useEffect(() => {
    const nodeInfo = BackEndNetWorkMap[networkType as BackEndNetworkType] || CurrentNetWork;

    ConfigProvider.setGlobalConfig({
      graphQLUrl: GraphqlHost,
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
    const _isSignUp = !!getItem(INVITEE_CA_ADDRESS);
    const _isNewAccount = getItem(INVITEE_IS_NEW_ACCOUNT);
    setIsSignUp(_isSignUp);
    setIsNewAccount(_isNewAccount);
    if (_isSignUp) {
      setStep(_isNewAccount ? StepEnum.TaskOneCompleted : StepEnum.SocialRecovery);
    }
  });

  // useEffectOnce(() => {
  // googleAnalytics.firePageViewEvent('invitee_hamster_home', 'hamster');
  // });

  did.setConfig({
    referralInfo: {
      referralCode: referralCode || undefined,
      projectCode: projectCode || undefined,
    },
  });

  const getInviteeConfig = useCallback(async () => {
    const res = await portkeyGet(PORTKEY_API.GET.INVITEE_CONFIG);
    document.title = res.activityTitle ?? 'Portkey Referral Program';
    setConfigAllData(res.data);
  }, []);

  useEffectOnce(() => {
    getInviteeConfig();
  });

  const onSignUp = () => {
    signInRef.current?.setOpen(true);
  };

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(
    async (didWallet: DIDWalletInfo) => {
      console.log('didWallet', didWallet);
      signInRef.current?.setOpen(false);

      googleAnalytics.portkeyLoginEvent(didWallet.createType, didWallet.accountInfo.accountType);

      const _isNewAccount = didWallet.createType === 'register';

      await did.save(DEFAULT_INVITEE_WALLET_PIN, DEFAULT_INVITEE_WALLET_KEY);
      setItem(INVITEE_CA_ADDRESS, didWallet.caInfo.caAddress);
      setItem(INVITEE_ORIGIN_CHAIN_ID, didWallet.chainId);
      setItem(INVITEE_IS_NEW_ACCOUNT, `${_isNewAccount}`);

      setIsSignUp(true);
      setIsNewAccount(_isNewAccount);
      setCaHolderInfo({ caHash: didWallet.caInfo.caHash, avatar: '', nickName: '' });
      setStep(_isNewAccount ? StepEnum.TaskOneCompleted : StepEnum.SocialRecovery);
      await sleep(1000);
      fetchAndStoreCaHolderInfo();

      const downloadResource = await cmsGet(CMS_API.GET.DOWNLOAD);
      setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
      setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');

      await getAAConnectToken(didWallet);
    },
    [fetchAndStoreCaHolderInfo, setCaHolderInfo],
  );

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
      setIsNewAccount(false);
      setStep(StepEnum.UnLogin);
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
  }, [onLogout]);

  useEffect(() => {
    const isInMobile = !isBrowser() || isMobile;
    let sourceUri = isInMobile ? sloganInviteeDefaultMobile : sloganInviteeDefault;

    if (currentStepConfigData) {
      if (isInMobile) {
        sourceUri = currentStepConfigData.mobileTitleCopyWriting;
      } else {
        sourceUri = currentStepConfigData.pcTitleCopyWriting;
      }
    }
    setSrc(sourceUri);
  }, [currentStepConfigData, isMobile, isNewAccount, isSignUp]);

  const SloganDOM = useMemo(() => {
    if (!src) return <div style={{ height: 100 }} />;

    return (
      <div className={styles.sloganWrapper}>
        <BaseImage src={src} alt={src.src} height={100} width={isMobile ? 302 : 480} />
      </div>
    );
  }, [isMobile, src]);

  const blackContainerTitle = useMemo(() => {
    if (isSignUp) {
      return isNewAccount ? 'Tasks' : 'Notice';
    } else {
      return 'Tasks';
    }
  }, [isNewAccount, isSignUp]);

  const TaskDom = useMemo(() => {
    const taskConfig = currentStepConfigData?.taskConfigs;
    if (!(taskConfig ?? []).length) return null;

    const onClick = (item: any) => {
      if (item.buttonAbled) {
        if (item.taskName === 'SignUp') {
          onSignUp();
        } else {
          openWithBlank(item.buttonLink);
        }
      }
    };

    return (
      <div className={clsx(styles.taskWrapper, 'flex-column')}>
        {taskConfig.map((item: any, index: number) => (
          <div className={clsx('flex', styles.taskItem)} key={index}>
            <div className={styles.leftTaskItem}>
              <BaseImage src={item.taskNo} alt={`correct-icon`} height={20} width={20} />
              <div className={styles.dividingLine}></div>
            </div>
            <div className={clsx(styles.rightTaskItem, 'flex-1')}>
              <div className={styles.title}>{item.topic}</div>
              <div className={styles.description}>{item.taskCopyWriting}</div>
              {item.buttonName && (
                <div className={clsx(styles.btn)} onClick={() => onClick(item)}>
                  <button className={clsx(styles.referralBtn, item.buttonAbled ? '' : styles.btnDisabled)}>
                    {item.buttonName}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [currentStepConfigData?.taskConfigs]);

  const NoticeDom = useMemo(() => {
    const noticeConfig = currentStepConfigData?.notice;
    const onClick = () => {
      if (noticeConfig.buttonAbled) {
        if (noticeConfig.noticeName === 'CreateNewAccount') {
          createNewAccount();
        } else {
          openWithBlank(noticeConfig.buttonLink);
        }
      }
    };
    if (noticeConfig) {
      return (
        <div className={clsx(styles.notice, 'flex-column')}>
          <div>{noticeConfig.copyWriting ?? ''}</div>
          <button
            className={clsx(styles.referralBtn, noticeConfig.buttonAbled ? '' : styles.btnDisabled)}
            onClick={onClick}>
            {noticeConfig.buttonName ?? ''}
          </button>
        </div>
      );
    }
    return null;
  }, [createNewAccount, currentStepConfigData?.notice]);

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
            {currentStepConfigData?.logo ? (
              <div className={clsx('row-center', styles.cooperateLogo)}>
                <BaseImage
                  width={isMobile ? 100 : 134}
                  height={isMobile ? 24 : 32}
                  src={portkeyLogoWhite}
                  priority
                  alt="portkeyLogo"
                />
                <BaseImage width={12} height={12} src={suggestCloseIcon} priority alt="closeLogo" />
                <BaseImage
                  width={isMobile ? 40 : 52}
                  height={isMobile ? 28 : 36}
                  src={currentStepConfigData?.logo}
                  priority
                  alt="GameLogo"
                />
              </div>
            ) : (
              <BaseImage className={styles.portkeyLogo} src={portkeyLogoWhite} priority alt="portkeyLogo" />
            )}

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
          {SloganDOM}
          <div className={styles.inviteeText}>
            <span>{currentStepConfigData?.copyWriting}</span>
          </div>
          <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
        </div>
      </div>

      <div className={styles.referralBlackWrapper}>
        <>
          <div className={clsx('flex-column', styles.referralBlackContainer)}>
            <div className={clsx(styles.blackContainerTitle, 'row-center')}>{blackContainerTitle}</div>
            {TaskDom}
            {NoticeDom}
          </div>

          {isSignUp && !isMobile && (
            <div className={clsx(styles.downloadPCWrapper, 'row-center')}>
              <div className="row-center">
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
