import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { close } from '@/assets/images';
import Image from 'next/image';

interface MyInvitationProps {
  invitationAmount: number;
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ invitationAmount }) => {
  const modal = useModal();

  const onCancel = useCallback(() => {
    console.log('onCancel');
    modal.hide();
  }, [modal]);

  return (
    <CommonModal
      title={'My Invitation'}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}>
      <div className={styles.titleText}>My Invitation</div>
    </CommonModal>
  );
};

export default NiceModal.create(MyInvitationModal);
