import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import BaseImage from '@/components/BaseImage';
import { myInvitationHeaderBg, directionRight, myInvitationLeftBg, myInvitationRightBg } from '@/assets/images';
import Image from 'next/image';
import { useModal } from '@ebay/nice-modal-react';
import MyInvitationModal from '../MyInvitationModal';

interface MyInvitationBlockProps {
  invitationAmount: number;
}

const MyInvitationBlock: React.FC<MyInvitationBlockProps> = ({ invitationAmount }) => {
  const myInvitationModal = useModal(MyInvitationModal);
  const onClickViewAll = useCallback(() => {
    myInvitationModal.show({ invitationAmount });
  }, [invitationAmount, myInvitationModal]);

  return (
    <div className={styles.container}>
      <Image className={styles.leftBg} src={myInvitationLeftBg} alt="" />
      <Image className={styles.rightBg} src={myInvitationRightBg} alt="" />
      <BaseImage className={styles.header_bg} src={myInvitationHeaderBg} priority alt="my invitation" />
      <div className={styles.invitation_amount}>{invitationAmount ?? 0}</div>
      <div className={styles.view_all_wrap} onClick={onClickViewAll}>
        <div className={styles.view_all_text}>View All</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </div>
    </div>
  );
};

export default MyInvitationBlock;
