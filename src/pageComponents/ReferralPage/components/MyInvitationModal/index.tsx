import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import { List, Avatar } from 'antd';
import VirtualList from 'rc-virtual-list';
import referralApi from '@/utils/axios/referral';
import { useEffectOnce } from '@/hooks/commonHooks';
import { useResponsive } from '@/hooks/useResponsive';

const ContainerHeight = 434;

interface MyInvitationItem {
  isDirectlyInvite: boolean;
  walletName: string;
  referralDate: string;
  avatar: string;
}

interface MyInvitationSection {
  date: string;
  items: MyInvitationItem[];
}

interface MyInvitationProps {
  open: boolean;
  onClose: () => void;
}

interface MyInvitationList {
  skip: number;
  hasNextPage: boolean;
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ open, onClose }) => {
  const [invitationAmount, setInvitationAmount] = useState(0);
  const [sections, setSections] = useState<MyInvitationSection[]>([]);
  const { isLG } = useResponsive();
  const currentList = useRef<MyInvitationList>({
    skip: 0,
    hasNextPage: true,
  });

  const fetchTotalCount = useCallback(async () => {
    try {
      const totalCount = await referralApi.referralTotalCount();
      console.log('referralTotalCount : ', totalCount);
      setInvitationAmount(totalCount ?? 0);
    } catch (error) {
      console.error('referralTotalCount error : ', error);
    }
  }, []);

  const fetchInvitationList = useCallback(async () => {
    if (!currentList.current.hasNextPage) {
      return;
    }
    try {
      const res = await referralApi.referralRecordList({
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
    fetchTotalCount();
  });

  const showInvitation = useMemo(() => {
    return invitationAmount > 0 && sections.length > 0;
  }, [invitationAmount, sections.length]);

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
        <Avatar
          className={styles.list_item_image}
          style={{ backgroundColor: '#303055', verticalAlign: 'middle', fontSize: '12px', color: '#7F7FA7' }}
          size={24}
          src={item.avatar}>
          {item?.walletName ? item.walletName[0].toUpperCase() : ''}
        </Avatar>
        <div className={styles.inviteMethod}>{item.isDirectlyInvite ? 'Invite' : 'Indirectly invite'}</div>
        <div className={styles.walletName}>{item.walletName}</div>
      </div>
    );
  }, []);

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement, UIEvent>) => {
      // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
      if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        fetchInvitationList();
      }
    },
    [fetchInvitationList],
  );

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
  }, [invitationItemDom, invitationSectionHeaderDom, onScroll, sections]);

  return (
    <CommonModal title={'My Invitation'} open={open} onCancel={onClose}>
      <div className={`${styles.container} ${isLG ? styles.padding_h5 : styles.padding_pc}`}>
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

export default MyInvitationModal;
