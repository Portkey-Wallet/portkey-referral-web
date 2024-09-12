import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import Image from 'next/image';
import RankItem from '../LeaderBoardRankItem';
import { showRankImage, RankImages } from '../RankItem';
import { List, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { directionDown } from '@/assets/images';
import { useReferralRank } from '../../hook';
import { formatStr2EllipsisStr, formatAelfAddress } from '@/utils';
import VirtualList from 'rc-virtual-list';
import { useEffectOnce } from '@/hooks/commonHooks';
import { useResponsive } from '@/hooks/useResponsive';
import { IActivityBaseInfoItem } from '@/types/referral';

interface LeaderBoardModalProps {
  activityItems?: IActivityBaseInfoItem[];
  open: boolean;
  onClose: () => void;
}

const defaultActivityItem: IActivityBaseInfoItem = {
  activityName: 'All',
  activityValue: 0,
  isDefault: true,
  startDate: '',
  endDate: '',
  dateRange: 'All',
};

const LeaderBoardModal: React.FC<LeaderBoardModalProps> = ({
  open,
  onClose,
  activityItems = [defaultActivityItem],
}) => {
  const { referralRankList: list, myRank, next, init } = useReferralRank();
  const [selectItem, setSelectItem] = useState<IActivityBaseInfoItem>(
    activityItems.find((item) => item.isDefault) ?? activityItems[0],
  );
  const { isLG } = useResponsive();

  useEffectOnce(() => {
    init(selectItem.activityValue);
  });

  const containerHeight = useMemo(() => {
    const listHeight = isLG ? 448 : 392;
    const myRankHeight = 56;
    if (myRank?.caAddress) {
      return listHeight;
    } else {
      return listHeight + myRankHeight;
    }
  }, [myRank?.caAddress, isLG]);

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement, UIEvent>) => {
      // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
      if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - containerHeight) <= 1) {
        next(false, selectItem.activityValue);
      }
    },
    [containerHeight, next, selectItem.activityValue],
  );

  const marginHorizontal = useMemo(() => {
    return isLG ? styles.margin_h5 : styles.margin_pc;
  }, [isLG]);

  const selectorDom = useMemo(() => {
    const selectItems = activityItems;
    const items: MenuProps['items'] = selectItems.map((item, index) => {
      return {
        key: index.toString(),
        label: (
          <a
            target="_blank"
            onClick={() => {
              if (selectItem !== item) {
                setSelectItem(item);
                init(item.activityValue);
              }
            }}>
            {item.dateRange}
          </a>
        ),
      };
    });
    return (
      <Dropdown menu={{ items }} trigger={['click']}>
        <div className={`${styles.dropdownWrap} ${marginHorizontal}`}>
          <div className={styles.dropdown}>
            <div className={styles.text}>{selectItem?.dateRange}</div>
            <Image className={styles.down_arrow} src={directionDown} alt="rank" />
          </div>
        </div>
      </Dropdown>
    );
  }, [activityItems, init, marginHorizontal, selectItem]);

  const headerDom = useMemo(() => {
    return (
      <div className={`${styles.headerWrap} ${marginHorizontal}`}>
        <div className={styles.headerLeft}>Rank</div>
        <div className={styles.headerMiddle}>Wallet Address</div>
        <div className={styles.headerRight}>Invitations</div>
      </div>
    );
  }, [marginHorizontal]);

  const myRankDom = useMemo(() => {
    return (
      myRank?.caAddress && (
        <div className={styles.myRankWrap}>
          <div className={styles.myRankTextWrap}>
            {showRankImage(myRank?.rank) ? (
              <Image
                width={25}
                className={styles.rank_image}
                src={RankImages[myRank?.rank - 1]}
                priority
                alt="invitation rank"
              />
            ) : (
              <div className={styles.rank_text}>{myRank?.rank > 0 ? myRank?.rank : '--'}</div>
            )}
          </div>
          <div className={styles.myRankMiddleWrap}>
            <Avatar
              className={styles.list_item_image}
              style={{ backgroundColor: '#303055', verticalAlign: 'middle', fontSize: '12px', color: '#7F7FA7' }}
              size={20}
              src={myRank?.avatar}>
              {myRank.walletName ? myRank.walletName[0].toUpperCase() : ''}
            </Avatar>
            <div className={styles.list_item_title}>
              {formatStr2EllipsisStr(formatAelfAddress(myRank?.caAddress), 8)}
            </div>
            <div className={styles.me_wrap}>
              <div className={styles.me_text}>Me</div>
            </div>
          </div>
          <div className={styles.myInvitationWrap}>
            <div className={styles.myInvitationText}>{myRank.referralTotalCount}</div>
          </div>
        </div>
      )
    );
  }, [myRank]);

  const listDom = useMemo(() => {
    return (
      <List className={styles.list} dataSource={list}>
        <VirtualList data={list ?? []} height={containerHeight} itemHeight={56} itemKey="email" onScroll={onScroll}>
          {(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              referralTotalCount={item.referralTotalCount}
              walletName={item?.walletName ? item.walletName[0].toUpperCase() : ''}
              recordDesc={item.recordDesc}
            />
          )}
        </VirtualList>
      </List>
    );
  }, [containerHeight, list, onScroll]);

  return (
    <CommonModal title={'LeaderBoard'} open={open} onCancel={onClose}>
      <div className={styles.container}>
        {selectorDom}
        {headerDom}
        {myRankDom}
        {list && listDom}
      </div>
    </CommonModal>
  );
};

export default LeaderBoardModal;
