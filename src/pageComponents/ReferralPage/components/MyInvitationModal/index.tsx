import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import { List, Avatar } from 'antd';
import VirtualList from 'rc-virtual-list';
import referralApi from '@/utils/axios/referral';
import { useEffectOnce } from '@/hooks/commonHooks';
import { useResponsive } from '@/hooks/useResponsive';
import { IRewardProgress } from '@/types/referral';

const ContainerHeight = 434;

interface MyInvitationItem {
  isDirectlyInvite: boolean;
  walletName: string;
  referralDate: string;
  avatar: string;
  recordDesc: string;
}

interface MyInvitationSection {
  date: string;
  items: MyInvitationItem[];
}

interface MyInvitationProps {
  myRewardProgress: IRewardProgress;
  open: boolean;
  onClose: () => void;
}

interface MyInvitationList {
  skip: number;
  hasNextPage: boolean;
}

const MyInvitationModal: React.FC<MyInvitationProps> = ({ open, onClose, myRewardProgress }) => {
  const [sections, setSections] = useState<MyInvitationSection[]>([]);
  const { isLG } = useResponsive();
  const currentList = useRef<MyInvitationList>({
    skip: 0,
    hasNextPage: true,
  });

  const fetchInvitationList = useCallback(async (init?: boolean) => {
    if (init) {
      currentList.current = {
        skip: 0,
        hasNextPage: true,
      };
      setSections([]);
    }
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
      const localSections = init ? [] : sections;
      referralRecords.forEach((record: MyInvitationItem) => {
        const date = record.referralDate;
        const sectionIndex = localSections.findIndex((section) => section.date === date);
        if (sectionIndex === -1) {
          localSections.push({
            date,
            items: [record],
          });
        } else {
          localSections[sectionIndex].items.push(record);
        }
      });
      setSections([...localSections]);
      console.log('sections : ', localSections);
    } catch (error) {
      console.error('referralRecordList error : ', error);
    }
  }, [sections]);

  useEffect(() => {
    fetchInvitationList(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRewardProgress]);

  const showRewardProgress = useMemo(() => {
    return !!myRewardProgress?.data.length;
  }, [myRewardProgress]);

  const headerDom = useMemo(() => {
    return (
      <div className={styles.headerWrap}>
        {myRewardProgress?.data?.map((item, index) => {
        return (
          <div key={index} className={styles.reward_wrap}>
            <div className={styles.reward_name}>{item.activityName}</div>
            <div className={styles.reward_value}>{item.referralCount}</div>
          </div>
        );
      })}
      </div>
    );
  }, [myRewardProgress]);

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
        <div className={styles.inviteMethod}>{item.recordDesc}</div>
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
        {showRewardProgress ? (
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
