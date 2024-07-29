import React, { useCallback, useState } from 'react';
import styles from './styles.module.scss';
import BaseImage from '@/components/BaseImage';
import { referralTaskHeaderBg, directionRight, myInvitationLeftBg, myInvitationRightBg } from '@/assets/images';
import Image from 'next/image';
import MyInvitationModal from '../MyInvitationModal';
import { IRewardProgress } from '@/types/referral';

interface MyInvitationBlockProps {
  rewardProgress: IRewardProgress;
}

const MyInvitationBlock: React.FC<MyInvitationBlockProps> = ({ rewardProgress }) => {
  const { data, rewardProcessCount } = rewardProgress;
  const [isMyInvitationModalVisible, setMyInvitationModalVisible] = useState(false);
  const onClickViewAll = useCallback(() => {
    setMyInvitationModalVisible(true);
  }, []);
  const onClose = useCallback(() => {
    setMyInvitationModalVisible(false);
  }, []);

  return (
    <div className={styles.container}>
      <Image className={styles.leftBg} src={myInvitationLeftBg} alt="" />
      <Image className={styles.rightBg} src={myInvitationRightBg} alt="" />
      <div className={styles.header_wrap}>
        <BaseImage className={styles.header_bg} src={referralTaskHeaderBg} priority alt="invitation records" />
        <div className={styles.header_title}>Invitation Records</div>
      </div>
      <div className={styles.estimated_reward}>Estimated Reward</div>
      <div className={styles.invitation_amount}>{rewardProcessCount ?? 0}</div>
      {data?.map((item, index) => {
        return (
          <div key={index} className={styles.reward_wrap}>
            <div className={styles.reward_name}>{item.activityName}</div>
            <div className={styles.reward_value}>{item.referralCount}</div>
          </div>
        );
      })}
      <a className={styles.view_all_wrap} onClick={onClickViewAll}>
        <div className={styles.view_all_text}>View All</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </a>
      {isMyInvitationModalVisible && <MyInvitationModal open={isMyInvitationModalVisible} onClose={onClose} />}
    </div>
  );
};

export default MyInvitationBlock;
