'use client';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { singleMessage } from '@portkey/did-ui-react';
import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoWhite from '/public/portkeyLogoWhite.svg';
import styles from './page.module.scss';
import QRCode from '@/components/QRCode';
import MyInvitation from './components/MyInvitation';
import AllRanks from './components/AllRanks';
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

const Referral: React.FC = () => {
  const searchParams = useSearchParams();
  const shortLink = searchParams.get('shortLink') || '';
  const [copyState, copyToClipboard] = useCopyToClipboard();

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

  const topRankData = {
    items: [
      { rank: 1, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 2, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 3, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 4, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 5, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 6, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 7, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 8, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 9, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 10, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 11, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 12, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 13, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 14, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 15, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
      { rank: 16, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    ],
    myRank: {
      rank: 3,
      avatar: '',
      caAddress: 'ELF_wwww....wwww_AELF',
      count: 1000,
    },
  };

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
          <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority />
        </div>
      </div>
      <div className={styles.referralBlackWrapper}>
        <MyInvitation invitationAmount={12}/>
        {shortLink && (
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
        <TopRank data={topRankData} />
      </div>
    </div>
  );
};

export default Referral;
