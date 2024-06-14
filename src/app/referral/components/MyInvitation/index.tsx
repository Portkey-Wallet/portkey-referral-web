import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import BaseImage from '@/components/BaseImage';
import { myInvitationHeaderBg, directionRight } from '@/assets/images';
import Image from 'next/image';

interface MyInvitationProps {
  invitationAmount: number;
}

const MyInvitation: React.FC<MyInvitationProps> = ({ invitationAmount }) => {

  const onClickViewAll = useCallback(() => {
    console.log('view all');
  }, []);

  return (
    <div className={styles.container}>
      <BaseImage className={styles.header_bg} src={myInvitationHeaderBg} priority alt="my invitation" />
      <div className={styles.invitation_amount}>{invitationAmount}</div>
      <div className={styles.view_all_wrap} onClick={onClickViewAll}>
        <div className={styles.view_all_text}>View All</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </div>
    </div>
  );
};

export default MyInvitation;
