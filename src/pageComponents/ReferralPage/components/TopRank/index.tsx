import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List, Avatar } from 'antd';
import styles from './styles.module.scss';
import RankItem, { showRankImage, RankImages } from '../RankItem';
import { directionRight } from '@/assets/images';
import Image from 'next/image';
import LeaderBoardModal from '../LeaderboardModal';
import { formatStr2EllipsisStr, formatAelfAddress } from '@/utils';
import { useReferralRank } from '../../hook';
import { useResponsive } from '@/hooks/useResponsive';

const TopRanks: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
  const { referralRankList: originalReferralRankList, init, next, myRank } = useReferralRank();
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false);
  const { isLG } = useResponsive();

  const referralRankList = useMemo(() => {
    const sliceIndex = originalReferralRankList.findIndex((item) => item.rank > 10);
    return sliceIndex === -1 ? originalReferralRankList : originalReferralRankList.slice(0, sliceIndex);
  }, [originalReferralRankList]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useEffect(() => {
    if (referralRankList.length < 0) return;
    const lastItem = referralRankList[referralRankList.length - 1];
    if (lastItem && lastItem.rank <= 10) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralRankList]);

  const onViewAll = useCallback(() => {
    setShowLeaderBoardModal(true);
  }, []);

  const listLeftItemWidth = useMemo(() => {
    return isLG ? styles.list_item_left_width_h5 : styles.list_item_left_width_pc;
  }, [isLG]);

  const listRightItemWidth = useMemo(() => {
    return isLG ? styles.list_item_right_width_h5 : styles.list_item_right_width_pc;
  }, [isLG]);

  const myRankDom = useMemo(() => {
    return (
      myRank?.caAddress && (
        <div className={styles.my_rank_wrap}>
          <div className={`${styles.list_item_left} ${listLeftItemWidth}`}>
            {showRankImage(myRank?.rank) ? (
              <Image
                width={25}
                className={styles.rank_image}
                src={RankImages[myRank?.rank - 1]}
                priority
                alt="invitation rank"
              />
            ) : (
              <div className={styles.rank_text}>{myRank?.rank > 0 ? myRank?.rank : '--'}</div>
            )}
          </div>
          <div className={styles.list_item_middle}>
            <Avatar
              className={styles.list_item_image}
              style={{ backgroundColor: '#303055', verticalAlign: 'middle', fontSize: '12px', color: '#7F7FA7' }}
              size={20}
              src={myRank?.avatar}>
              {myRank?.walletName ? myRank?.walletName[0].toUpperCase() : ''}
            </Avatar>
            <div className={styles.list_item_title}>
              {formatStr2EllipsisStr(formatAelfAddress(myRank?.caAddress), 8)}
            </div>
            <div className={styles.me_wrap}>
              <div className={styles.me_text}>Me</div>
            </div>
          </div>
          <div className={`${styles.list_item_right} ${listRightItemWidth}`}>{myRank?.referralTotalCount}</div>
        </div>
      )
    );
  }, [myRank, listLeftItemWidth, listRightItemWidth]);

  return (
    <div className={styles.container}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left}></div>
        <div className={styles.header_title}>Leaderboard</div>
        <div className={styles.header_right}></div>
      </div>
      <div className={`${styles.list_wrap} ${isLG ? styles.list_wrap_margin_h5 : styles.list_wrap_margin_pc}`}>
        <div className={styles.list_header_wrap}>
          <div className={`${styles.list_item_left} ${listLeftItemWidth}`}>Rank</div>
          <div className={styles.list_item_middle}>
            <div className={styles.list_item_title}>Wallet Address</div>
          </div>
          <div className={`${styles.list_item_right} ${listRightItemWidth}`}>Invited</div>
        </div>
        <List
          className={styles.list}
          dataSource={referralRankList}
          header={myRankDom}
          renderItem={(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              referralTotalCount={item.referralTotalCount}
              walletName={item?.walletName?.length > 0 ? item.walletName[0].toUpperCase() : ''}
            />
          )}
        />
      </div>
      <a className={styles.view_all_wrap} onClick={onViewAll}>
        <div className={styles.view_all_text}>View More</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </a>
      {showLeaderBoardModal && (
        <LeaderBoardModal
          open={showLeaderBoardModal}
          onClose={() => {
            setShowLeaderBoardModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TopRanks;
