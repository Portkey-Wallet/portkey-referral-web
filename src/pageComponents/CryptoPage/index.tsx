'use client';
import clsx from 'clsx';
import { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { singleMessage, did, TelegramPlatform } from '@portkey/did-ui-react';

import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoBlack from '/public/cryptoGift/portkeyLogoBlack.svg';
import bgLine1 from '/public/cryptoGift/images/cryptoGift/bgLine1.svg';
import bgLine2 from '/public/cryptoGift/images/cryptoGift/bgLine2.svg';
import bgLine3 from '/public/cryptoGift/images/cryptoGift/bgLine3.svg';
import bgPortkeyLogo from '/public/cryptoGift/images/cryptoGift/bgPortkeyLogo.svg';

import portkeyLogo from '/public/cryptoGift/images/cryptoGift/portkeyLogo.svg';
import logoutIcon from '/public/cryptoGift/images/cryptoGift/logout.svg';
import cryptoSuccess from '/public/cryptoGift/images/cryptoGift/success.svg';
import cryptoShare from '/public/cryptoGift/images/cryptoGift/share.svg';
import alarm from '/public/cryptoGift/images/cryptoGift/alarm.svg';

import styles from './styles.module.scss';
import './global.scss';

import '@portkey/did-ui-react/dist/assets/index.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAAConnectToken, PORTKEY_API, portkeyGet, portkeyPost } from '@/utils/axios/index';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost, LoginTypes } from '@/constants/network';

import OpenInBrowser from '@/components/OpenInBrowser';
import { Dropdown, MenuProps, Image, Avatar, message } from 'antd';
import BreakWord from '@/components/BreakWord';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { useEnvironment } from '@/hooks/environment';
import { useDownload } from '@/hooks/download';
import {
  AssetsType,
  ClientType,
  CryptoGiftPhase,
  OperationType,
  RedPackageGrabStatus,
  TCryptoDetail,
} from '@/types/cryptoGift';
import { CRYPTO_GIFT_PROJECT_CODE } from '@/constants/project';
import { formatSecond2CountDownTime } from '@/utils/time';
import { useLoading } from '@/hooks/global';
import { divDecimalsStr } from '@/utils/converter';
import CommonButton from '@/components/CommonButton';
import { getOperationType, hasConnectedInTg, sleep } from '@/utils';
import { useDebounceCallback, useEffectOnce, useLatestRef } from '@/hooks/commonHooks';
import googleAnalytics from '@/utils/googleAnalytics';
import { useCryptoDetailTimer } from '@/hooks/useCryptoDetailTimer';
import useAccount from '@/hooks/useAccount';
import { useLocalRandomDeviceId } from './hooks';
import VConsoleWrap from '@/components/VConsoleWrap';

const boxCannotClaimed = '/cryptoGift/cryptoGift/images/cryptoGift/boxCannotClaimed.png';
const boxClosed = '/cryptoGift/cryptoGift/images/cryptoGift/boxClosed.png';
const boxEmpty = '/cryptoGift/cryptoGift/images/cryptoGift/boxEmpty.png';
const boxOpened = '/cryptoGift/cryptoGift/images/cryptoGift/boxOpened.png';

interface ICryptoGiftProps {
  cryptoGiftId: string;
}

const CryptoGift: React.FC<ICryptoGiftProps> = ({ cryptoGiftId }) => {
  const isFirstRender = useRef(true);
  const timerRef = useRef<NodeJS.Timeout>();
  const randomDeviceId = useLocalRandomDeviceId();

  const { isLogin, login, logout, walletInfo, isLocking, isConnected } = useAccount();
  const walletInfoRef = useRef(walletInfo);
  const router = useRouter();

  const { isPortkeyApp, isWeChat, isMobile } = useEnvironment();
  const { onJumpToPortkeyWeb, onJumpToStore } = useDownload();
  const [isShowMask, setIsShowMask] = useState(false);
  const { setLoading } = useLoading();
  const [initializing, setInitializing] = useState(true);

  const [, copyToClipboard] = useCopyToClipboard();
  const [cryptoDetail, setCryptoGiftDetail] = useState<TCryptoDetail>();
  const { claimAgainCountdownSecond, expiredTime, rootTime } = useCryptoDetailTimer();

  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    walletInfoRef.current = walletInfo;
  }, [walletInfo]);

  const onRefreshCryptoGiftDetail: (init?: boolean, caHash?: string, circulate?: boolean) => void = useDebounceCallback(
    async (init?: boolean, caHash?: string, circulate?: boolean) => {
      try {
        if (circulate) setBtnLoading(true);
        init && setInitializing(true);
        const path = isLogin ? PORTKEY_API.GET.LOGIN_CRYPTO_GIFT_DETAIL : PORTKEY_API.GET.CRYPTO_GIFT_DETAIL;

        const params: { id: string; caHash?: string; random?: string } = { id: cryptoGiftId, random: randomDeviceId };
        if (walletInfoRef?.current?.extraInfo?.portkeyInfo.caInfo.caHash)
          params.caHash = walletInfoRef?.current?.extraInfo?.portkeyInfo.caInfo.caHash;
        if (caHash) params.caHash = caHash;
        const result: TCryptoDetail = await portkeyGet(path, params);

        // circulate fetch
        if (circulate && result.cryptoGiftPhase === CryptoGiftPhase.Available) {
          return onRefreshCryptoGiftDetail(false, caHash, true);
        } else {
          setBtnLoading(false);
        }

        // auto sign up
        if (result.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) {
          onSignUp();
        }

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
    [cryptoGiftId, isLogin, rootTime, randomDeviceId],
  );

  const latestOnRefreshCryptoGiftDetail = useLatestRef(onRefreshCryptoGiftDetail);

  useEffectOnce(() => {
    googleAnalytics.firePageViewEvent('crypto_gift_home', 'crypto_gift', { id: cryptoGiftId });
  });

  useLayoutEffect(() => {
    if (isLocking) login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    latestOnRefreshCryptoGiftDetail.current(true);
  }, [latestOnRefreshCryptoGiftDetail]);

  useLayoutEffect(() => {
    if (!initializing) return;
    if (!isFirstRender.current) return;

    init();
    isFirstRender.current = false;
  }, [init, initializing, latestOnRefreshCryptoGiftDetail, onRefreshCryptoGiftDetail]);

  useLayoutEffect(() => {
    const idCode = getItem(cryptoGiftId);
    const referralInfo = {
      referralCode: `${cryptoGiftId}#${idCode}`,
      projectCode: CRYPTO_GIFT_PROJECT_CODE,
      random: randomDeviceId,
    };

    did.setConfig({
      referralInfo,
    });
  }, [cryptoGiftId, randomDeviceId]);

  const onViewDetails = useCallback(() => {
    if (TelegramPlatform.isTelegramPlatform()) {
      router.push('/');
    } else {
      onJumpToStore();
    }
  }, [onJumpToStore, router]);

  const reportAccount = useCallback(async (walletInfo?: any) => {
    await getAAConnectToken(walletInfo || walletInfoRef?.current?.extraInfo?.portkeyInfo);
    const path = PORTKEY_API.POST.REPORT_ACCOUNT;
    const params: {
      clientType: ClientType;
      projectCode: string;
      operationType: OperationType;
      caHash?: string;
    } = {
      clientType: TelegramPlatform.isTelegramPlatform() ? ClientType.TgBot : ClientType.H5,
      projectCode: CRYPTO_GIFT_PROJECT_CODE,
      operationType: getOperationType(walletInfoRef?.current?.extraInfo?.portkeyInfo?.createType),
      caHash: walletInfoRef?.current?.extraInfo?.portkeyInfo?.caInfo?.caHash,
    };
    portkeyPost(path, params);
  }, []);

  const tgLoggedAccountGetCryptoDetail = useCallback(async () => {
    setBtnLoading(true);
    timerRef.current = setInterval(() => {
      if (!walletInfoRef?.current?.extraInfo?.portkeyInfo?.caInfo?.caHash) return;
      // login
      reportAccount(walletInfoRef?.current);
      latestOnRefreshCryptoGiftDetail.current(
        false,
        walletInfoRef?.current?.extraInfo?.portkeyInfo?.caInfo?.caHash,
        true,
      );
      clearInterval(timerRef.current);
    }, 3000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [latestOnRefreshCryptoGiftDetail, reportAccount]);

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  const onSignUp = useCallback(async () => {
    try {
      const walletInfo = await login();
      if (!walletInfo) return;
      // TODO: change type
      googleAnalytics.portkeyLoginEvent(
        walletInfo?.extraInfo?.portkeyInfo?.createType || walletInfoRef?.current?.extraInfo?.portkeyInfo?.createType,
      );

      await sleep(300);

      if (TelegramPlatform.isTelegramPlatform()) {
        tgLoggedAccountGetCryptoDetail();
      } else {
        reportAccount(walletInfo);
        latestOnRefreshCryptoGiftDetail.current(
          false,
          walletInfo?.extraInfo?.portkeyInfo?.caInfo?.caHash ||
            walletInfoRef?.current?.extraInfo?.portkeyInfo?.caInfo?.caHash,
          true,
        );
      }
    } catch (error) {
      console.log('error', error);
      setBtnLoading(false);
    }
  }, [latestOnRefreshCryptoGiftDetail, login, reportAccount, tgLoggedAccountGetCryptoDetail]);

  const onClaim = useCallback(async () => {
    try {
      setBtnLoading(true);
      if (isLogin) {
        const result = await portkeyPost(PORTKEY_API.POST.LOGIN_USER_GRAB, {
          id: cryptoGiftId,
          caHash: walletInfo?.extraInfo?.portkeyInfo?.caInfo?.caHash || '',
          userCaAddress: walletInfo?.address,
          random: randomDeviceId,
        });

        if (result.errorCode === '10001') return latestOnRefreshCryptoGiftDetail.current(false, undefined, true);

        if (result.result === RedPackageGrabStatus.Success) {
          await latestOnRefreshCryptoGiftDetail.current();
          setBtnLoading(false);
        }
      } else {
        const { identityCode } =
          (await portkeyPost(PORTKEY_API.POST.GRAB, { id: cryptoGiftId, random: randomDeviceId })) || {};

        if (!identityCode) throw Error('Claim failed');

        const referralInfo = {
          referralCode: `${cryptoGiftId}#${identityCode}`,
          projectCode: CRYPTO_GIFT_PROJECT_CODE,
          random: randomDeviceId,
        };

        did.setConfig({
          referralInfo,
        });
        setItem(cryptoGiftId, identityCode);
        await sleep(500);
        await latestOnRefreshCryptoGiftDetail.current();
        setBtnLoading(false);
      }
    } catch (error: any) {
      console.log('ERROR', error);
      latestOnRefreshCryptoGiftDetail.current();
    }
  }, [
    randomDeviceId,
    cryptoGiftId,
    isLogin,
    latestOnRefreshCryptoGiftDetail,
    walletInfo?.address,
    walletInfo?.extraInfo?.portkeyInfo?.caInfo?.caHash,
  ]);

  const onLogout = useCallback(async () => {
    try {
      setLoading(true);
      await logout();

      await latestOnRefreshCryptoGiftDetail.current();
      singleMessage.success('logout success');
    } catch (error: any) {
      console.log('onLogout error', error);
      singleMessage.error(error?.message || 'fail');
    } finally {
      setLoading(false);
    }
  }, [latestOnRefreshCryptoGiftDetail, logout, setLoading]);

  const onCopyClick = useCallback(() => {
    let fullUrl = window?.location?.href;
    if (TelegramPlatform.isTelegramPlatform()) fullUrl = `${CurrentNetWork.tgMiniAppPath}?startapp=${cryptoGiftId}`;

    try {
      copyToClipboard(fullUrl);
      singleMessage.success('Link Copied');
    } catch (error) {
      singleMessage.error('Failed');
    }
  }, [copyToClipboard, cryptoGiftId]);

  const dropDownItems: MenuProps['items'] = useMemo(
    () =>
      TelegramPlatform.isTelegramPlatform()
        ? []
        : [
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
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed) return null;

    return (
      <>
        <VConsoleWrap>
          <Avatar
            alt={cryptoDetail?.sender?.nickname?.[0] || ''}
            className={styles.cryptoGiftSenderImg}
            src={cryptoDetail?.sender?.avatar || ' '}>
            {cryptoDetail?.sender?.nickname?.[0] || ''}
          </Avatar>
        </VConsoleWrap>

        <div className={styles.cryptoGiftSenderTitle}>{cryptoDetail?.prompt || '-- sent you a crypto gift'}</div>
        <div className={styles.cryptoGiftSenderMemo}>{`"${cryptoDetail?.memo || 'Best wishes!'}"`}</div>
      </>
    );
  }, [
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.memo,
    cryptoDetail?.prompt,
    cryptoDetail?.sender?.avatar,
    cryptoDetail?.sender?.nickname,
  ]);

  const renderCryptoBoxImgDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed) return null;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) return null;

    let src = boxClosed;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed) src = boxEmpty;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.AlreadyClaimed) src = boxOpened;
    if (
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
      cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers
    )
      src = boxCannotClaimed;

    return (
      <>
        <div className={styles.cryptoGiftTopDom} />
        <Image
          preview={false}
          alt="cryptoGiftImg"
          src={src}
          className={styles.cryptoGiftImg}
          width={343}
          height={240}></Image>
      </>
    );
  }, [cryptoDetail?.cryptoGiftPhase]);

  const renderCryptoGiftTipsDom = useCallback(() => {
    let text = '';
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed)
      text = `Oh no, all the crypto gifts have been claimed.`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired) text = `Oops, the crypto gift has expired.`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoQuota && claimAgainCountdownSecond)
      text = `Unclaimed gifts may be up for grabs! Try to claim once the countdown ends.`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoQuota && !claimAgainCountdownSecond)
      text = `Unclaimed gifts are up for grabs! Try your luck and claim now.`;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased) text = `Oops, the crypto gift has expired.`;
    if (isLogin && cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers)
      text = `Oops, only newly created Portkey users can claim this crypto gift. Please log out and create a new account to try again.`;

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.AlreadyClaimed)
      return (
        <div className={styles.cryptoGiftTips}>
          <BreakWord text="You've already claimed this crypto gift and received " />
          <BreakWord
            className={styles.symbol}
            text={`${divDecimalsStr(cryptoDetail?.amount, cryptoDetail?.decimals)} ${cryptoDetail?.label || cryptoDetail?.symbol}.`}
          />
          <BreakWord text={`You can't claim it again.`} />
        </div>
      );

    return text ? <div className={styles.cryptoGiftTips}>{text}</div> : null;
  }, [
    claimAgainCountdownSecond,
    cryptoDetail?.amount,
    cryptoDetail?.cryptoGiftPhase,
    cryptoDetail?.decimals,
    cryptoDetail?.label,
    cryptoDetail?.symbol,
    isLogin,
  ]);

  const renderActionButtonDom = useCallback(() => {
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed) return null;
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.AlreadyClaimed) return null;

    let disabled = false;
    let text = 'Claim Crypto Gift';
    let subText = '';
    let onAction = onClaim;

    // sub title
    if (cryptoDetail?.isNewUsersOnly && cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Available) {
      subText = 'Create a new Portkey account to claim';
    }

    // others
    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.GrabbedQuota) {
      text = `Sign up to Receive`;
      subText = 'Receive crypto assets in your Portkey address';
      onAction = onSignUp;
    }

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased) {
      text = `Claim Again`;
    }

    if (claimAgainCountdownSecond || cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.NoQuota) {
      disabled = !!claimAgainCountdownSecond;
      text = !!claimAgainCountdownSecond
        ? `Try Luck (${formatSecond2CountDownTime(claimAgainCountdownSecond)})`
        : 'Try Luck Once More';
      subText = '';
      onAction = onClaim;
    }

    if (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.OnlyNewUsers && isLogin) {
      text = 'Log out';
      subText = '';
      onAction = onLogout;
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
    isLogin,
    onClaim,
    onLogout,
    onSignUp,
  ]);

  const renderDownLoadDom = useCallback(() => {
    let isShow = false;
    if (
      !isLogin &&
      (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed)
    )
      isShow = true;

    if (
      isLogin &&
      (cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Expired ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.Claimed ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.FullyClaimed ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.ExpiredReleased ||
        cryptoDetail?.cryptoGiftPhase === CryptoGiftPhase.AlreadyClaimed)
    )
      isShow = true;

    return isShow ? (
      <div className={styles.downloadWrap} onClick={onJumpToStore}>
        <BaseImage className={styles.portkeyLogo} src={portkeyLogo} priority alt="portkeyLogo" />
        <div className={styles.downloadTips}>Download Portkey and stay tuned for more gifts.</div>
        <div className={styles.downloadBtn}>Download</div>
      </div>
    ) : null;
  }, [cryptoDetail?.cryptoGiftPhase, isLogin, onJumpToStore]);

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

    return (
      <div className={styles.successSectionWrap}>
        <Image
          preview={false}
          src={boxOpened}
          className={styles.cryptoGiftImg}
          alt="cryptoGiftImg"
          width={343}
          height={240}
        />
        <div className={styles.successWrap}>
          <BaseImage src={cryptoSuccess} alt="cryptoSuccess" priority width={20} height={20} />
          <BreakWord
            className={styles['amount-symbol']}
            text={`${divDecimalsStr(cryptoDetail?.amount, cryptoDetail?.decimals)} ${
              cryptoDetail?.assetType === AssetsType.ft
                ? cryptoDetail?.label || cryptoDetail?.symbol
                : cryptoDetail?.nftAlias
            }`}
          />
          <BreakWord className={styles.toAddress} text={`sent to your Portkey address`} />
        </div>
        <button onClick={onViewDetails} className={styles.viewDetails}>
          View Details
        </button>

        <button className={styles.shareBtnWrap} onClick={onCopyClick}>
          <BaseImage src={cryptoShare} alt="cryptoShare" priority width={20} height={20} />
          <p className={styles.buttonText}>Share with Friends</p>
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
    onViewDetails,
  ]);

  const BGDOM = useMemo(() => {
    return (
      <div className={styles.bgWrap}>
        <BaseImage src={bgPortkeyLogo} className={styles.bgPortkeyLogo} alt="bgLines" priority />
        <VConsoleWrap>
          <BaseImage src={bgLine1} className={styles.bgLine1} alt="bgLines" priority />
        </VConsoleWrap>

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

            {isLogin && walletInfo?.name && (
              <Dropdown overlayClassName="logout-drop-down" trigger={['click']} menu={{ items: dropDownItems }}>
                <Avatar alt="avatar" className={styles.userLogo} src={''}>
                  {walletInfo?.name?.[0] || ''}
                </Avatar>
              </Dropdown>
            )}
          </div>
        </header>

        <div className={styles.referralMainContainer}>
          {BGDOM}
          {renderCryptoBoxHeaderDom()}
          {renderCryptoBoxImgDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderCryptoGiftTipsDom()}
          {!initializing && renderGiftDetailDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderActionButtonDom()}
          {!initializing && !isWeChat && !isPortkeyApp && renderSuccessFullDomFirstTime()}
          {!initializing && !isWeChat && !isPortkeyApp && !TelegramPlatform.isTelegramPlatform() && renderDownLoadDom()}
        </div>
      </div>
      {/* mask */}
      {isShowMask && <OpenInBrowser isWeChat={isWeChat} />}
    </div>
  );
};

export const WrappedCryptoGift: React.FC<any> = (props) => {
  const searchParams = useSearchParams();

  const tgStartParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
  const cryptoGiftId = tgStartParam || searchParams?.get('id') || '';

  if (TelegramPlatform.isTelegramPlatform() && !cryptoGiftId) return null;
  if (!cryptoGiftId) return null;

  return <CryptoGift cryptoGiftId={cryptoGiftId} />;
};

export default WrappedCryptoGift;
