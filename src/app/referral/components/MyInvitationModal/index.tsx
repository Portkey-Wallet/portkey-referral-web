import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { close } from '@/assets/images';
import Image from 'next/image';

interface MyInvitationItem {}

interface MyInvitationProps {
  invitationAmount: number;
  items: MyInvitationItem[];
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ invitationAmount, items }) => {
  const modal = useModal();

  const showInvitation = useMemo(() => {
    return invitationAmount > 0 && items.length > 0;
  }, [invitationAmount, items.length]);

  const onCancel = useCallback(() => {
    console.log('onCancel');
    modal.hide();
  }, [modal]);

  return (
    <CommonModal title={'My Invitation'} open={modal.visible} onCancel={onCancel} afterClose={modal.remove}>
      <div className={styles.container}>
        {showInvitation ? (
          <div>My Invitation</div>
        ) : (
          <div className={styles.noInvitationWrap}>
            <div className={styles.noInvitationText}>No invitation</div>
          </div>
        )}
      </div>
    </CommonModal>
  );
};

export default NiceModal.create(MyInvitationModal);
