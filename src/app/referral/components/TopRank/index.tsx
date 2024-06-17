import React, { useCallback } from 'react';
import { List } from 'antd';
import styles from './styles.module.scss';
import RankItem from '../RankItem';
import { directionRight } from '@/assets/images';
import Image from 'next/image';
import { useModal } from '@ebay/nice-modal-react';
import LeaderBoardModal from '../LeaderBoardModal';

interface Item {
  rank: number;
  avatar: string;
  caAddress: string;
  count: number;
}

interface TopRanksResponse {
  items: Item[];
  myRank: Item;
}

interface TopRanksProps {
  data: TopRanksResponse;
}

const TopRanks: React.FC<TopRanksProps> = ({ data }) => {
  const { myRank } = data;
  const leaderBoardModal = useModal(LeaderBoardModal);

  const onViewAll = useCallback(() => {
    console.log('View All Clicked');
    leaderBoardModal.show();
  }, [leaderBoardModal]);

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
          dataSource={data.items}
          header={
            <div className={styles.list_header_wrap}>
              <div className={styles.list_item_left}>{myRank.rank}</div>
              <div className={styles.list_item_middle}>
                <Image
                  className={styles.list_item_image}
                  width={20}
                  height={20}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt="avatar"
                />
                <div className={styles.list_item_title}>{myRank.caAddress}</div>
                <div className={styles.me_wrap}>
                  <div className={styles.me_text}>Me</div>
                </div>
              </div>
              <div className={styles.list_item_right}>{myRank.count}</div>
            </div>
          }
          renderItem={(item) => (
            <RankItem rank={item.rank} avatar={item.avatar} caAddress={item.caAddress} count={item.count} />
          )}
        />
      </div>
      <div className={styles.view_all_wrap} onClick={onViewAll}>
        <div className={styles.view_all_text}>View More</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </div>
    </div>
  );
};

export default TopRanks;
