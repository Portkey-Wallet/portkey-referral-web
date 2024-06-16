import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import { directionRight } from '@/assets/images';

interface MyInvitationItem {
  caHash: string;
  directlyInvite: boolean;
  walletName: string;
}

interface MyInvitationSection {
  date: string;
  items: MyInvitationItem[];
}

interface MyInvitationProps {
  invitationAmount: number;
  sections: MyInvitationSection[];
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ invitationAmount, sections }) => {
  const modal = useModal();

  const showInvitation = useMemo(() => {
    return invitationAmount > 0 && sections.length > 0;
  }, [invitationAmount, sections.length]);

  const onCancel = useCallback(() => {
    console.log('onCancel');
    modal.hide();
  }, [modal]);

  const headerDom = useMemo(() => {
    return (
      <div className={styles.headerWrap}>
        <div className={styles.invitationText}>My Invitation</div>
        <div className={styles.headerTitle}>{invitationAmount}</div>
      </div>
    );
  }, [invitationAmount]);

  const invitationSectionHeaderDom = useCallback((date: string) => {
    return <div className={styles.sectionHeader}>{date}</div>;
  }, []);

  const invitationItemDom = useCallback((item: MyInvitationItem) => {
    return (
      <div className={styles.listItemWrap}>
        <Image
          className={styles.list_item_image}
          width={20}
          height={20}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          alt="avatar"
        />
        <div className={styles.inviteMethod}>{item.directlyInvite? 'Invite' : 'Indirectly invite'}</div>
        <div className={styles.walletName}>{item.walletName}</div>
      </div>
    );
  }, []);

  const invitationListDom = useMemo(() => {
    return (
      <div className={styles.listWrap}>
        {sections.map((section, index) => {
          return (
            <div key={index}>
              {invitationSectionHeaderDom(section.date)}
              {section.items.map((item, index) => {
                return invitationItemDom(item);
              })}
              <div className={styles.divider}></div>
            </div>
          );
        })}
      </div>
    );
  }, [invitationItemDom, invitationSectionHeaderDom, sections]);

  return (
    <CommonModal title={'My Invitation'} open={modal.visible} onCancel={onCancel} afterClose={modal.remove}>
      <div className={styles.container}>
        {showInvitation ? (
          <div className={styles.contentWrap}>
            {headerDom}
            {invitationListDom}
          </div>
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
