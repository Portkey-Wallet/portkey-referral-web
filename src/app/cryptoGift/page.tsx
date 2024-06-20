'use client';
import clsx from 'clsx';
import { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
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
  alarm,
} from '@/assets/images';
import { privacyPolicy, termsOfService } from '@/constants/pageData';
import '@portkey/did-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import { PORTKEY_API, portkeyGet, portkeyPost } from '@/utils/axios/index';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost } from '@/constants/network';
import OpenInBrowser from '@/components/OpenInBrowser';
import { BackEndNetworkType } from '@/types/network';
import { Dropdown, MenuProps, Image, Avatar, message } from 'antd';
import BreakWord from '@/components/BreakWord';
import { isLogin } from '@/utils/wallet';
import {
  CRYPTO_GIFT_CA_ADDRESS,
  CRYPTO_GIFT_CA_HOLDER_INFO,
  CRYPTO_GIFT_ORIGIN_CHAIN_ID,
  DEFAULT_CRYPTO_GIFT_WALLET_KEY,
  DEFAULT_CRYPTO_GIFT_WALLET_PIN,
} from '@/constants/storage';
import { useFetchAndStoreCaHolderInfo } from '@/hooks/giftWallet';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { useEnvironment } from '@/hooks/environment';
import { useDownload } from '@/hooks/download';
import { AssetsType, CryptoGiftPhase, RedPackageGrabStatus, TCryptoDetail } from '@/types/cryptoGift';
import { CRYPTO_GIFT_PROJECT_CODE } from '@/constants/project';
import { formatSecond2CountDownTime } from '@/utils/time';
import { useLoading } from '@/hooks/global';
import { divDecimalsStr } from '@/utils/converter';
import CommonButton from '@/components/CommonButton';
import { sleep } from '@/utils';
import { useDebounceCallback, useEffectOnce, useLatestRef } from '@/hooks/commonHooks';
import googleAnalytics from '@/utils/googleAnalytics';
import { useCryptoDetailTimer } from '@/hooks/useCryptoDetailTimer';

ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

const CryptoGift: React.FC = () => {
  const isFirstRender = useRef(true);

  const { caHolderInfo, setCaHolderInfo, fetchAndStoreCaHolderInfo } = useFetchAndStoreCaHolderInfo();
  const { isPortkeyApp, isWeChat, isMobile } = useEnvironment();
  const { onJumpToPortkeyWeb, onJumpToStore } = useDownload();
  const [isShowMask, setIsShowMask] = useState(false);
  const { setLoading } = useLoading();
  const [initializing, setInitializing] = useState(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [successClaimCurrentPage, setSuccessClaimCurrentPage] = useState(true);

  const [, copyToClipboard] = useCopyToClipboard();
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();
  const networkType = searchParams.get('networkType') || '';
  const cryptoGiftId = searchParams.get('id') || '';
  const [cryptoDetail, setCryptoGiftDetail] = useState<TCryptoDetail>();
  const { claimAgainCountdownSecond, expiredTime, rootTime } = useCryptoDetailTimer();

  const [btnLoading, setBtnLoading] = useState(false);

  const onRefreshCryptoGiftDetail = useDebounceCallback(
    async (init?: boolean, caHash?: string) => {
      console.log('init', init);
      try {
        init && setInitializing(true);
        const path = isSignUp ? PORTKEY_API.GET.LOGIN_CRYPTO_GIFT_DETAIL : PORTKEY_API.GET.CRYPTO_GIFT_DETAIL;

        const params: { id: string; caHash?: string } = { id: cryptoGiftId };
        if (caHolderInfo?.caHash) params.caHash = caHolderInfo?.caHash;
        if (caHash) params.caHash = caHash;
        const result: TCryptoDetail = await portkeyGet(path, params);

        if (result.cryptoGiftPhase !== CryptoGiftPhase.Claimed) setSuccessClaimCurrentPage(false);

        if (result?.remainingWaitingSeconds || result?.remainingExpirationSeconds)
          rootTime.current = {
            claimAgainCountdownSecond: result?.remainingWaitingSeconds,
            expiredTime: result?.remainingExpirationSeconds,
          };

        setCryptoGiftDetail(result);
      } catch (error) {
        console.log('error', error);
      } finally {
        init && setInitializing(false);
      }
    },
    [caHolderInfo?.caHash, cryptoGiftId, isSignUp],
  );

  const latestOnRefreshCryptoGiftDetail = useLatestRef(onRefreshCryptoGiftDetail);

  useEffectOnce(() => {
    googleAnalytics.firePageViewEvent('crypto_gift_home', 'crypto_gift');
  });

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
      setIsShowMask(true);
      singleMessage.error({
        duration: 0,
        content: 'Please open the link in browser',
        onClose: () => null,
        onClick: () => null,
      });
    }
  }, [isPortkeyApp, isWeChat]);

  const init = useCallback(async () => {
    await fetchAndStoreCaHolderInfo();
    latestOnRefreshCryptoGiftDetail.current(true);
  }, [fetchAndStoreCaHolderInfo, latestOnRefreshCryptoGiftDetail]);

  useLayoutEffect(() => {
    if (!initializing) return;
    if (!isFirstRender.current) return;

    init();
    isFirstRender.current = false;
  }, [fetchAndStoreCaHolderInfo, init, initializing, latestOnRefreshCryptoGiftDetail, onRefreshCryptoGiftDetail]);

  useLayoutEffect(() => {
    const idCode = getItem(cryptoGiftId);

    did.setConfig({
      referralInfo: {
        referralCode: `${cryptoGiftId}#${idCode}`,
        projectCode: CRYPTO_GIFT_PROJECT_CODE,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    console.log('isLogin', isLogin());
    setIsSignUp(isLogin());
  }, []);

  const onSignUp = async () => {
    signInRef.current?.setOpen(true);
  };

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(
    async (didWallet: DIDWalletInfo) => {
      console.log('didWallet', didWallet);

      googleAnalytics.portkeyLoginEvent(didWallet.createType, didWallet.accountInfo.accountType);

      await did.save(DEFAULT_CRYPTO_GIFT_WALLET_PIN, DEFAULT_CRYPTO_GIFT_WALLET_KEY);
      setItem(CRYPTO_GIFT_CA_ADDRESS, didWallet.caInfo.caAddress);
      setItem(CRYPTO_GIFT_ORIGIN_CHAIN_ID, didWallet.chainId);

      setIsSignUp(true);
      setSuccessClaimCurrentPage(true);
      setCaHolderInfo({ caHash: didWallet.caInfo.caHash, avatar: '', nickName: '' });
      await sleep(1000);
      latestOnRefreshCryptoGiftDetail.current(false, didWallet.caInfo.caHash);
      fetchAndStoreCaHolderInfo();
    },
    [fetchAndStoreCaHolderInfo, latestOnRefreshCryptoGiftDetail, setCaHolderInfo],
  );

  const onClaim = useCallback(async () => {
    try {
      setBtnLoading(true);
      if (isSignUp) {
        const result = await portkeyPost(PORTKEY_API.POST.LOGIN_USER_GRAB, {
          id: cryptoGiftId,
          caHash: caHolderInfo?.caHash,
          userCaAddress: getItem(CRYPTO_GIFT_CA_ADDRESS) || '',
        });

        if (result.result === RedPackageGrabStatus.Success) setSuccessClaimCurrentPage(true);

        console.log('result', result);
      } else {
        const { identityCode } = (await portkeyPost(PORTKEY_API.POST.GRAB, { id: cryptoGiftId })) || {};

        if (!identityCode) throw Error('Claim failed');

        did.setConfig({
          referralInfo: {
            referralCode: `${cryptoGiftId}#${identityCode}`,
            projectCode: CRYPTO_GIFT_PROJECT_CODE,
          },
        });
        setItem(cryptoGiftId, identityCode);
      }
    } catch (error: any) {
      console.log('ERROR', error);
    } finally {
      await sleep(500);
      await latestOnRefreshCryptoGiftDetail.current();
      setBtnLoading(false);
    }
  }, [caHolderInfo?.caHash, cryptoGiftId, isSignUp, latestOnRefreshCryptoGiftDetail]);

  const onLogout = useCallback(async () => {
    try {
      setLoading(true);
      const originChainId = getItem(CRYPTO_GIFT_ORIGIN_CHAIN_ID);
      await did.logout({ chainId: originChainId });
      setCaHolderInfo(undefined);

      removeItem(CRYPTO_GIFT_CA_HOLDER_INFO);
      removeItem(DEFAULT_CRYPTO_GIFT_WALLET_KEY);
      removeItem(CRYPTO_GIFT_CA_ADDRESS);
      setIsSignUp(false);

      await latestOnRefreshCryptoGiftDetail.current();
      setSuccessClaimCurrentPage(false);
    } catch (error: any) {
      console.log('onLogout error', error);
      singleMessage.error(error?.message || 'fail');
    } finally {
      setLoading(false);
    }
  }, [latestOnRefreshCryptoGiftDetail, setCaHolderInfo, setLoading]);

  const onCopyClick = useCallback(() => {
    const fullUrl = window?.location?.href;
    try {
      copyToClipboard(fullUrl);
      singleMessage.success('Copied');
    } catch (error) {
      singleMessage.error('Failed');
    }
  }, [copyToClipboard]);

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

  const renderCryptoBoxHeaderDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed && successClaimCurrentPage) return null;

    return (
      <>
        <Avatar
          alt={cryptoDetail?.sender?.nickname || ''}
          className={styles.cryptoGiftSenderImg}
          src={cryptoDetail?.sender?.avatar || ''}>
          {cryptoDetail?.sender?.nickname?.[0] || ''}
        </Avatar>

        <div className={styles.cryptoGiftSenderTitle}>{cryptoDetail?.prompt || ''}</div>
        <div className={styles.cryptoGiftSenderMemo}>{`"${cryptoDetail?.memo || ''}"`}</div>
      </>
    );
  }, [
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.memo,
    cryptoDetail?.prompt,
    cryptoDetail?.sender?.avatar,
    cryptoDetail?.sender?.nickname,
    successClaimCurrentPage,
  ]);

  const renderCryptoBoxImgDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed && successClaimCurrentPage) return null;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) return null;

    let src = boxClosed;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed) src = boxEmpty;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed) src = boxOpened;
    if (
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers
    )
      src = boxCannotClaimed;

    return (
      <>
        <div className={styles.cryptoGiftTopDom} />
        <BaseImage
          src={src}
          className={styles.cryptoGiftImg}
          alt="boxCannotClaimed"
          priority
          width={343}
          height={240}
        />
      </>
    );
  }, [cryptoDetail?.cryptoGiftPhase, successClaimCurrentPage]);

  const renderCryptoGiftTipsDom = useCallback(() => {
    let text = '';
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed) text = `Oops! None left...`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired) text = `Oops! The crypto gift has been Expired`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoQuota)
      text = `Don't worry, it hasn't been claimed yet! You can keep trying to claim after the countdown ends`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased)
      text = `Sorry, you miss the claim expiration time.`;
    if (isSignUp && cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers)
      text = `Oops, only newly registered Portkey users can claim this crypto gift.`;

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed && !successClaimCurrentPage)
      return (
        <div className={styles.cryptoGiftTips}>
          <BreakWord text="You have already claimed " />
          <BreakWord
            className={styles.symbol}
            text={`${divDecimalsStr(cryptoDetail.amount, cryptoDetail.decimals)} ${cryptoDetail.symbol}`}
          />
          <BreakWord text={`of this Crypto Gift and can't reclaim it.`} />
        </div>
      );

    return text ? <div className={styles.cryptoGiftTips}>{text}</div> : null;
  }, [
    cryptoDetail?.amount,
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.decimals,
    cryptoDetail?.symbol,
    isSignUp,
    successClaimCurrentPage,
  ]);

  const renderActionButtonDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed) return null;

    let disabled = false;
    let text = 'Claim Crypto Gift';
    let subText = '';
    let onAction = onClaim;

    // sub title
    if (cryptoDetail?.isNewUsersOnly || cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Available) {
      subText = 'Create a new Portkey account to claim';
    }

    // others
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) {
      text = `Signup to Claim`;
      subText = 'Claim to your Portkey address';
      onAction = onSignUp;
    }

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased) {
      text = `Claim Again`;
    }

    if (claimAgainCountdownSecond || cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoQuota) {
      disabled = !!claimAgainCountdownSecond;
      text = !!claimAgainCountdownSecond
        ? `Try to Claim Again (${formatSecond2CountDownTime(claimAgainCountdownSecond)})`
        : 'Try to Claim Again';
      subText = '';
      onAction = onClaim;
    }

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) {
      text = 'Signup to Claim';
    }

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers && isSignUp) {
      text = '';
      subText = '';
    }

    if (
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed
    ) {
      text = '';
      subText = '';
    }

    return (
      <>
        {text && (
          <CommonButton
            loading={btnLoading}
            disabled={disabled}
            className={clsx([styles.actionBtn, disabled && styles.disabledBtn])}
            onClick={onAction}>
            {text}
          </CommonButton>
        )}
        {subText && <p className={styles.btnTips}>{subText}</p>}
      </>
    );
  }, [
    btnLoading,
    claimAgainCountdownSecond,
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.isNewUsersOnly,
    isSignUp,
    onClaim,
  ]);

  const renderDownLoadDom = useCallback(() => {
    let isShow = false;
    if (
      !isSignUp &&
      (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed)
    )
      isShow = true;

    if (
      isSignUp &&
      (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers)
    )
      isShow = true;

    return isShow ? (
      <div className={styles.downloadWrap} onClick={onJumpToStore}>
        <BaseImage className={styles.portkeyLogo} src={portkeyLogo} priority alt="portkeyLogo" />
        <div className={styles.downloadTips}>Download Portkey and stay tuned for more gifts.</div>
        <div className={styles.downloadBtn}>Download</div>
      </div>
    ) : null;
  }, [cryptoDetail?.cryptoGiftPhase, isSignUp, onJumpToStore]);

  const renderGiftDetailDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase !== CryptoGiftPhase.GrabbedQuota) return null;

    return (
      <div className={styles.giftDetailWrap}>
        <div className={styles.willGet}>You will get</div>
        {cryptoDetail?.assetType === AssetsType.ft ? (
          <>
            <div className={styles.symbol}>{`${divDecimalsStr(cryptoDetail.amount, cryptoDetail.decimals)} ${
              cryptoDetail.symbol
            }`}</div>
            <div className={styles.usdtAmount}>{cryptoDetail.dollarValue}</div>
          </>
        ) : (
          <>
            <div className={styles.nftWrap}>
              <Image
                alt={cryptoDetail?.sender?.nickname || ''}
                wrapperClassName={styles.nftItem}
                src={cryptoDetail?.nftImageUrl || ''}
                width={98}
                height={98}
                preview={false}
              />
              <div className={styles.nftInfoWrap}>
                <p className={styles.nftName}>{cryptoDetail?.nftAlias || ''}</p>
                <p className={styles.nftId}>{`# ${cryptoDetail?.nftTokenId || ''}`}</p>
              </div>
            </div>
            <div className={styles.nftCount}>{divDecimalsStr(cryptoDetail?.amount, cryptoDetail?.decimals)}</div>
          </>
        )}
        <div className={styles.alarmWrap}>
          <BaseImage src={alarm} priority alt="alarm" width={14} height={14} />
          <p className={styles.alarmText}>Expiration: {formatSecond2CountDownTime(expiredTime)}</p>
        </div>
      </div>
    );
  }, [
    cryptoDetail?.amount,
    cryptoDetail?.assetType,
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.decimals,
    cryptoDetail?.dollarValue,
    cryptoDetail?.nftAlias,
    cryptoDetail?.nftImageUrl,
    cryptoDetail?.nftTokenId,
    cryptoDetail?.sender?.nickname,
    cryptoDetail?.symbol,
    expiredTime,
  ]);

  const renderSuccessFullDomFirstTime = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase !== CryptoGiftPhase.Claimed) return null;
    if (!successClaimCurrentPage) return null;

    return (
      <div className={styles.successSectionWrap}>
        <BaseImage
          src={boxOpened}
          className={styles.cryptoGiftImg}
          alt="cryptoGiftImg"
          priority
          width={343}
          height={240}
        />
        <div className={styles.successWrap}>
          <BaseImage src={cryptoSuccess} alt="cryptoSuccess" priority width={20} height={20} />
          <BreakWord
            className={styles['amount-symbol']}
            text={`${divDecimalsStr(cryptoDetail?.amount, cryptoDetail?.decimals)} ${
              cryptoDetail?.assetType === AssetsType.ft
                ? cryptoDetail?.label || cryptoDetail.symbol
                : cryptoDetail?.nftAlias
            }`}
          />
          <BreakWord className={styles.toAddress} text={`has sent to your address`} />
        </div>
        <button onClick={onJumpToStore} className={styles.viewDetails}>
          View Details
        </button>

        <button className={styles.shareBtnWrap} onClick={onCopyClick}>
          <BaseImage src={cryptoShare} alt="cryptoShare" priority width={20} height={20} />
          <p className={styles.buttonText}>Share with your friends</p>
        </button>
      </div>
    );
  }, [
    cryptoDetail?.amount,
    cryptoDetail?.assetType,
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.decimals,
    cryptoDetail?.label,
    cryptoDetail?.nftAlias,
    cryptoDetail?.symbol,
    onCopyClick,
    onJumpToStore,
    successClaimCurrentPage,
  ]);

  const BGDOM = useMemo(() => {
    return (
      <div className={styles.bgWrap}>
        <BaseImage src={bgPortkeyLogo} className={styles.bgPortkeyLogo} alt="bgLines" priority />
        <BaseImage src={bgLine1} className={styles.bgLine1} alt="bgLines" priority />
        <BaseImage src={bgLine2} className={styles.bgLine2} alt="bgLines" priority />
        <BaseImage src={bgLine3} className={styles.bgLine3} alt="bgLines" priority />
      </div>
    );
  }, []);

  return (
    <div className={styles.referralPage}>
      <div className={styles.referralBlueContainer}>
        <header className="row-center">
          <div className={clsx(['flex-row-center', styles.referralHeader])}>
            <BaseImage
              className={styles.portkeyLogo}
              innerClassName={styles.portkeyLogo}
              src={portkeyLogoBlack}
              priority
              alt="portkeyLogo"
              onClick={onJumpToPortkeyWeb}
            />

            {caHolderInfo?.nickName && (
              <Dropdown overlayClassName="logout-drop-down" trigger={['click']} menu={{ items: dropDownItems }}>
                <Avatar alt="avatar" className={styles.userLogo} src={caHolderInfo?.avatar || ''}>
                  {caHolderInfo?.nickName?.[0] || ''}
                </Avatar>
              </Dropdown>
            )}
          </div>
        </header>

        <div className={styles.referralMainContainer}>
          {BGDOM}
          {!initializing && renderCryptoBoxHeaderDom()}
          {renderCryptoBoxImgDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderCryptoGiftTipsDom()}
          {!initializing && renderGiftDetailDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderActionButtonDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderSuccessFullDomFirstTime()}
          {!initializing && !isWeChat && !isPortkeyApp && renderDownLoadDom()}
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

      {/* mask */}
      {isShowMask && <OpenInBrowser isWeChat={isWeChat} />}
    </div>
  );
};

export default CryptoGift;
