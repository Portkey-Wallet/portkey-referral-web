import React, { useCallback, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import { List } from 'antd';
import VirtualList from 'rc-virtual-list';
import referralApi from '@/utils/axios/referral';
import { useEffectOnce } from '@/hooks/commonHooks';

const ContainerHeight = 400;

interface MyInvitationItem {
  isDirectlyInvite: boolean;
  walletName: string;
  referralDate: string;
}

interface MyInvitationSection {
  date: string;
  items: MyInvitationItem[];
}

interface MyInvitationProps {
  invitationAmount: number;
}

interface MyInvitationList {
  skip: number;
  hasNextPage: boolean;
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ invitationAmount }) => {
  const modal = useModal();
  const [sections, setSections] = useState<MyInvitationSection[]>([]);
  const currentList = useRef<MyInvitationList>({
    skip: 0,
    hasNextPage: true,
  });

  const fetchInvitationList = useCallback(async () => {
    if (!currentList.current.hasNextPage) {
      return;
    }
    try {
      const res = await referralApi.referralRecordList({
        caHash: '2eb1f55de480b8cd5ec2960eebdc2eb8b12376afc7ee040b5a12ce2196776167',
        skip: currentList.current.skip,
        limit: 10,
      });
      const { hasNextPage = true, referralRecords = [] } = res;
      currentList.current.skip += referralRecords.length;
      currentList.current.hasNextPage = hasNextPage;

      if (!referralRecords.length) {
        return;
      }
      referralRecords.forEach((record: MyInvitationItem) => {
        const date = record.referralDate;
        const sectionIndex = sections.findIndex((section) => section.date === date);
        if (sectionIndex === -1) {
          sections.push({
            date,
            items: [record],
          });
        } else {
          sections[sectionIndex].items.push(record);
        }
      });
      setSections([...sections]);
      console.log('sections : ', sections);
    } catch (error) {
      console.error('referralRecordList error : ', error);
    }
  }, [sections]);

  useEffectOnce(() => {
    fetchInvitationList();
  });

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
        <div className={styles.inviteMethod}>{item.isDirectlyInvite ? 'Invite' : 'Indirectly invite'}</div>
        <div className={styles.walletName}>{item.walletName}</div>
      </div>
    );
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      // fetchInvitationList();
    }
  };

  const invitationListDom = useMemo(() => {
    return (
      <List className={styles.listWrap}>
        <VirtualList data={sections} height={ContainerHeight} itemHeight={47} itemKey="email" onScroll={onScroll}>
          {(section: MyInvitationSection) => (
            <div key={section.date}>
              {invitationSectionHeaderDom(section.date)}
              {section.items.map((item, index) => {
                return invitationItemDom(item);
              })}
              <div className={styles.divider}></div>
            </div>
          )}
        </VirtualList>
      </List>
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
