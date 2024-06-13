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
import portkeyLogoBlack from '/public/portkeyLogoBlack.svg';
import styles from './page.module.scss';
import {
  referralDiscover,
  bgLine1,
  bgLine2,
  bgLine3,
  bgPortkeyLogo,
  boxCannotClaimed,
  boxClosed,
  boxEmpty,
  boxOpened,
  portkeyLogo,
  logoutIcon,
  cryptoSuccess,
  cryptoShare,
} from '@/assets/images';
import { privacyPolicy, termsOfService } from '@/constants/pageData';
import '@portkey/did-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import { CMS_API, PORTKEY_API, cmsGet, portkeyGet, portkeyPost } from '@/utils/axios/index';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost } from '@/constants/network';
import OpenInBrowser from '@/components/OpenInBrowser';
import { BackEndNetworkType } from '@/types/network';
import { StaticImageData } from 'next/image';
import { Dropdown, MenuProps, Image, Alert } from 'antd';
import BreakWord from '@/components/BreakWord';
import { isLogin } from '@/utils/wallet';
import {
  CRYPTO_GIFT_CA_HOLDER_INFO,
  CRYPTO_GIFT_USER_ID_CODE,
  DEFAULT_CRYPTO_GIFT_WALLET_KEY,
  DEFAULT_CRYPTO_GIFT_WALLET_PIN,
} from '@/constants/storage';
import { useFetchAndStoreCaHolderInfo } from '@/hooks/giftWallet';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { useEnvironment } from '@/hooks/environment';
import { useDownload } from '@/hooks/download';
import { CryptoGiftPhase, TCryptoDetail } from '@/types/cryptoGift';
import { CRYPTO_GIFT_PROJECT_CODE } from '@/constants/project';

ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

const Referral: React.FC = () => {
  const { walletInfo, setWalletInfo, fetchAndStoreCaHolderInfo } = useFetchAndStoreCaHolderInfo();
  const { isMobile, isIOS, isAndroid, isPortkeyApp, isWeChat } = useEnvironment();
  const { onJumpToPortkeyWeb, onJumpToStore } = useDownload();
  const [isShowMask, setIsShowMask] = useState(false);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);

  const [copyState, copyToClipboard] = useCopyToClipboard();
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();
  const [src, setSrc] = useState<StaticImageData>();
  const networkType = searchParams.get('networkType') || '';
  const cryptoGiftId = searchParams.get('id') || '';
  const [cryptoDetail, setCryptoGiftDetail] = useState<TCryptoDetail>();
  const [identityCode, setIdentityCode] = useState('');

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
    if (isWeChat) return setIsShowMask(true);

    if (isPortkeyApp) {
      singleMessage.error({
        duration: 0,
        content: 'Please open the link in browser or scan the code using camera.',
        onClose: () => null,
        onClick: () => null,
      });
    }
  }, [isPortkeyApp, isWeChat]);

  useEffect(() => {
    const idCode = getItem(cryptoGiftId);

    did.setConfig({
      referralInfo: {
        referralCode: `${cryptoGiftId}#${idCode}`,
        projectCode: CRYPTO_GIFT_PROJECT_CODE,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const result = await portkeyGet(PORTKEY_API.GET.CRYPTO_GIFT_DETAIL, {
        id: '7d911f61-0511-4121-8cf3-1443d057999e',
      });
      console.log('setCryptoGiftDetail', result);
      setCryptoGiftDetail(result);
    })();
  }, []);

  const onSignUp = () => {
    signInRef.current?.setOpen(true);
  };

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(
    async (didWallet: DIDWalletInfo) => {
      console.log('didWallet', didWallet);
      await did.save(DEFAULT_CRYPTO_GIFT_WALLET_PIN, DEFAULT_CRYPTO_GIFT_WALLET_KEY);
      fetchAndStoreCaHolderInfo();
      // setIsSignUp(true);
      // setIsNewAccount(didWallet.createType === 'register');
    },
    [fetchAndStoreCaHolderInfo],
  );

  const onClaim = useCallback(async () => {
    // TODo： change
    try {
      const { identityCode = '' } = await portkeyPost(PORTKEY_API.POST.GRAB, { id: cryptoGiftId });
      // todo: delete it
      let tmpIdCode = identityCode.replaceAll(`\"`, '');
      did.setConfig({
        referralInfo: {
          referralCode: `${cryptoGiftId}#${tmpIdCode}`,
          projectCode: CRYPTO_GIFT_PROJECT_CODE,
        },
      });

      setItem(cryptoGiftId, tmpIdCode);
      alert(tmpIdCode);
      setIdentityCode(tmpIdCode);
    } catch (error) {
      alert('ERROR' + error);
    }
  }, [cryptoGiftId]);

  const onLogout = useCallback(async () => {
    // todo: check is AELF
    try {
      await did.logout({ chainId: 'AELF' });
      removeItem(DEFAULT_CRYPTO_GIFT_WALLET_KEY);
      removeItem(CRYPTO_GIFT_CA_HOLDER_INFO);
      setWalletInfo(undefined);
      console.log('success!');
    } catch (error) {
      console.log('onLogout', error);
    }
  }, [setWalletInfo]);

  const onCopyClick = useCallback(() => {
    copyToClipboard('XXX');
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  }, [copyState.error, copyState.value, copyToClipboard]);

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

  const dropDownItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Log Out',
        icon: <BaseImage src={logoutIcon} alt={'logout'} width={16} height={16} />,
        onClick: () => {
          onLogout();
        },
        styles: { color: 'red' },
      },
    ],
    [onLogout],
  );

  const CryptoBoxHeaderDom = useMemo(
    () => (
      <>
        <Image
          alt={cryptoDetail?.sender?.nickname || ''}
          wrapperClassName={styles.cryptoGiftSenderImg}
          src={cryptoDetail?.sender?.avatar || ''}
          width={48}
          height={48}
          preview={false}
          onClick={() => {
            onSignUp();
          }}
        />
        <div className={styles.cryptoGiftSenderTitle}>{cryptoDetail?.prompt || ''}</div>
        <div className={styles.cryptoGiftSenderMemo}>{`"${cryptoDetail?.memo || ''}"`}</div>
      </>
    ),
    [cryptoDetail?.memo, cryptoDetail?.prompt, cryptoDetail?.sender?.avatar, cryptoDetail?.sender?.nickname],
  );

  const renderCryptoBoxImgDom = useCallback(() => {
    let src = boxClosed;

    console.log('cryptoDetail?.cryptoGiftPhase', cryptoDetail?.cryptoGiftPhase);
    switch (cryptoDetail?.cryptoGiftPhase) {
      case CryptoGiftPhase.NoneLeft:
        src = boxEmpty;
        break;

      case CryptoGiftPhase.Expired:
        src = boxClosed;
        break;

      case CryptoGiftPhase.Expired:
        src = boxClosed;
        break;

      case CryptoGiftPhase.Expired:
        src = boxClosed;
        break;

      default:
        break;
    }

    return (
      <BaseImage src={src} className={styles.cryptoGiftImg} alt="boxCannotClaimed" priority width={343} height={240} />
    );
  }, [cryptoDetail?.cryptoGiftPhase]);

  const renderCryptoGiftTipsDom = useCallback(() => {
    let text = '';
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoneLeft) text = `Oops! None left...`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired) text = `Oops! The crypto gift has been Expired`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ValidityPeriodExpired)
      text = `Don't worry, it hasn't been claimed yet! You can keep trying to claim after the countdown ends`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired)
      text = `Don't worry, it hasn't been claimed yet! You can keep trying to claim after`;

    return <div className={styles.cryptoGiftTips}>{text}</div>;
  }, [cryptoDetail?.cryptoGiftPhase]);

  const renderActionButtonDom = useCallback(() => {
    if (!isLogin())
      return (
        <>
          <button className={styles.claimBtn} onClick={onClaim}>
            Claim Crypto Gift
          </button>
          {cryptoDetail?.isNewUsersOnly && <p className={styles.btnTips}>Create a new Portkey account to claim</p>}
        </>
      );

    return (
      <>
        <div className={clsx(isMobile && styles.mobileClaimBtn)}>
          <button className={styles.claimBtn} onClick={onSignUp}>
            Sign up
          </button>
        </div>
        <p className={styles.btnTips}>Claim to your Portkey address</p>
      </>
    );
  }, [cryptoDetail?.isNewUsersOnly, isMobile, onClaim]);

  const DownLoadDom = useMemo(() => {
    return (
      <div className={styles.downloadWrap}>
        <BaseImage className={styles.portkeyLogo} src={portkeyLogo} priority alt="portkeyLogo" />
        <div className={styles.downloadTips}>Download and signup to claim more Crypto Gift!</div>
        <div className={styles.downloadBtn}>Download</div>
      </div>
    );
  }, []);

  const GiftDetailDom = useMemo(() => {
    return (
      <div className={styles.giftDetailWrap}>
        <div className={styles.willGet}>You will get</div>
        {isAndroid ? (
          <>
            <div className={styles.symbol}>0.000008</div>
            <div className={styles.usdtAmount}>=$12321223</div>
          </>
        ) : (
          <>
            <div className={styles.nftWrap}>
              <BaseImage
                className={styles.nftItem}
                src={portkeyLogo}
                priority
                alt="portkeyLogo"
                width={98}
                height={98}
              />
              <p className={styles.nftName}>WitchyBean</p>
              <p className={styles.nftId}>#2</p>
            </div>
            <div className={styles.nftCount}>0.000008</div>
          </>
        )}
        <div className={styles.alarmWrap}>
          <BaseImage src={portkeyLogo} priority alt="portkeyLogo" width={14} height={14} />
          <p className={styles.alarmText}>Expiration: 19:56</p>
        </div>
      </div>
    );
  }, [isAndroid]);

  const SuccessFullDom = useMemo(() => {
    return (
      <div className={styles.successSectionWrap}>
        <BaseImage
          src={boxCannotClaimed}
          className={styles.cryptoGiftImg}
          alt="cryptoGiftImg"
          priority
          width={343}
          height={240}
        />
        <div className={styles.successWrap}>
          <BaseImage src={cryptoSuccess} alt="cryptoSuccess" priority width={20} height={20} />
          <BreakWord className={styles['amount-symbol']} text={`100 ELF 100 ELF 100 ELF 100 ELF 100 ELF`} />
          <BreakWord className={styles.toAddress} text={`has sent to your address`} />
        </div>
        <button className={styles.viewDetails}>View Details</button>
        <button className={styles.shareBtnWrap}>
          <BaseImage src={cryptoShare} alt="cryptoShare" priority width={20} height={20} />
          <p className={styles.buttonText}>Share with your friends</p>
        </button>
      </div>
    );
  }, []);

  return (
    <div className={styles.referralPage}>
      <div className={styles.referralBlueContainer}>
        <header className="row-center">
          <div className={clsx(['flex-row-center', styles.referralHeader])}>
            <BaseImage className={styles.portkeyLogo} src={portkeyLogoBlack} priority alt="portkeyLogo" />

            {walletInfo?.avatar && (
              <Dropdown overlayClassName="logout-drop-down" trigger={['click']} menu={{ items: dropDownItems }}>
                <Image
                  alt="avatar"
                  wrapperClassName={styles.userLogo}
                  src={walletInfo?.avatar || ''}
                  width={24}
                  height={24}
                  preview={false}
                />
              </Dropdown>
            )}
          </div>
        </header>
        <div className={styles.referralMainContainer}>
          <div className={styles.bgWrap}>
            <BaseImage src={bgPortkeyLogo} className={styles.bgPortkeyLogo} alt="bgLines" priority />
            <BaseImage src={bgLine1} className={styles.bgLine1} alt="bgLines" priority />
            <BaseImage src={bgLine2} className={styles.bgLine2} alt="bgLines" priority />
            <BaseImage src={bgLine3} className={styles.bgLine3} alt="bgLines" priority />
          </div>

          {CryptoBoxHeaderDom}
          {renderCryptoBoxImgDom()}
          {renderCryptoGiftTipsDom()}
          {renderActionButtonDom()}
          {GiftDetailDom}
          {SuccessFullDom}
          {DownLoadDom}
          {/* <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority /> */}
        </div>
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
            pin={DEFAULT_CRYPTO_GIFT_WALLET_PIN}
            ref={signInRef}
            onFinish={onFinish}
            onCancel={onCancel}
          />
        </PortkeyProvider>
      )}

      {/* <div
        onClick={async () => {
          fetchCaHolderInfo();
        }}>
        GET WALLET
      </div> */}

      {/* mask */}
      {isShowMask && <OpenInBrowser />}
    </div>
  );
};

export default Referral;
