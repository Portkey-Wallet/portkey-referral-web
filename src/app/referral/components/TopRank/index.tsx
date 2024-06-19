import React, { useCallback, useEffect, useState } from 'react';
import { List, Avatar } from 'antd';
import styles from './styles.module.scss';
import RankItem, { showRankImage, RankImages } from '../RankItem';
import { directionRight } from '@/assets/images';
import Image from 'next/image';
import LeaderBoardModal from '../LeaderboardModal';
import referralApi from '@/utils/axios/referral';
import { formatStr2EllipsisStr } from '@/utils';
import useAccount from '@/hooks/useAccount';

interface Item {
  rank: number;
  avatar: string;
  caAddress: string;
  referralTotalCount: number;
  walletName: string;
}

interface TopRanksResponse {
  referralRecordsRank: Item[];
  currentUserReferralRecordsRankDetail: Item;
}

const TopRanks: React.FC = () => {
  const [data, setData] = useState<TopRanksResponse | null>(null);
  const { currentUserReferralRecordsRankDetail: myRank } = data ?? {};
  const { isConnected, caHash } = useAccount();
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        // connected: fetch data by caHash
        if (caHash) {
          const res = await referralApi.referralRecordRank({
            caHash,
            activityEnums: 1,
          });
          setData(res);
        }
      } else {
        // not connected: fetch default rank data
        const res = await referralApi.referralRecordRank({
          activityEnums: 1,
        });
        setData(res);
      }
    })();
  }, [isConnected, caHash]);

  const onViewAll = useCallback(() => {
    setShowLeaderBoardModal(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left}></div>
        <div className={styles.header_title}>Leaderboard</div>
        <div className={styles.header_right}></div>
      </div>
      <div className={styles.list_wrap}>
        <div className={styles.list_header_wrap}>
          <div className={styles.list_item_left}>Rank</div>
          <div className={styles.list_item_middle}>
            <div className={styles.list_item_title}>Wallet Address</div>
          </div>
          <div className={styles.list_item_right}>Invite Amount</div>
        </div>
        <List
          className={styles.list}
          dataSource={data?.referralRecordsRank}
          header={
            myRank?.caAddress && (
              <div className={styles.my_rank_wrap}>
                <div className={styles.list_item_left}>
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
                  <div className={styles.list_item_title}>{formatStr2EllipsisStr(myRank?.caAddress, 8)}</div>
                  <div className={styles.me_wrap}>
                    <div className={styles.me_text}>Me</div>
                  </div>
                </div>
                <div className={styles.list_item_right}>{myRank?.referralTotalCount}</div>
              </div>
            )
          }
          renderItem={(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              count={item.referralTotalCount}
              walletName={item?.walletName?.length > 0 ? item.walletName[0].toUpperCase() : ''}
            />
          )}
        />
      </div>
      <div className={styles.view_all_wrap} onClick={onViewAll}>
        <div className={styles.view_all_text}>View More</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </div>
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