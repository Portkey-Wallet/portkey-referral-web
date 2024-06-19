import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import { Image } from 'antd';
import BaseImage from '@/components/BaseImage';
import { invitationRankFirst, invitationRankSecond, invitationRankThird } from '@/assets/images';
import { formatStr2EllipsisStr } from '@/utils';

interface RankItemProps {
  rank: number;
  avatar: string;
  caAddress: string;
  count: number;
}

const RankImages = [invitationRankFirst, invitationRankSecond, invitationRankThird];

const RankItem: React.FC<RankItemProps> = ({ rank, avatar, caAddress, count }) => {
  const showRankImage = useMemo(() => {
    return rank === 1 || rank === 2 || rank === 3;
  }, [rank]);
  const rankImage = useMemo(() => {
    if (showRankImage) {
      return RankImages[rank - 1];
    }
    return invitationRankFirst;
  }, [rank, showRankImage]);
  return (
    <div className={styles.container}>
      <div className={styles.item_left_wrap}>
        {showRankImage ? (
          <BaseImage width={25} className={styles.item_left_image} src={rankImage} priority alt="invitation rank"/>
        ) : (
          <div className={styles.item_left_rank}>{rank}</div>
        )}
      </div>
      <div className={styles.item_middle}>
        <Image
          className={styles.item_image}
          width={20}
          src={avatar}
          alt=""
        />
        <div className={styles.item_title}>{formatStr2EllipsisStr(caAddress, 8)}</div>
      </div>
      <div className={styles.item_right}>{count}</div>
    </div>
  );
};

export default RankItem;
