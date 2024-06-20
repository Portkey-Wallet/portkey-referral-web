import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import Image from 'next/image';
import RankItem from '../LeaderBoardRankItem';
import { List, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { directionDown } from '@/assets/images';
import { useReferralRank } from '../../hook';
import { formatStr2EllipsisStr,formatAelfAddress } from '@/utils';
import VirtualList from 'rc-virtual-list';
import { useEffectOnce } from '@/hooks/commonHooks';

const ContainerHeight = 350;

interface LeaderBoardModalProps {
  open: boolean;
  onClose: () => void;
}

const LeaderBoardModal: React.FC<LeaderBoardModalProps> = ({ open, onClose }) => {
  const { referralRankList: list, myRank, next, init } = useReferralRank();
  useEffectOnce(() => {
    init();
  });

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement, UIEvent>) => {
      // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
      if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        next();
      }
    },
    [next],
  );

  const selectorDom = useMemo(() => {
    const selectItems = ['All'];
    const items: MenuProps['items'] = selectItems.map((item, index) => {
      return {
        key: index.toString(),
        label: (
          <a
            target="_blank"
            onClick={() => {
              console.log('click item : ', item);
            }}>
            {item}
          </a>
        ),
      };
    });
    return (
      <Dropdown menu={{ items }} trigger={['click']}>
        <div className={styles.dropdownWrap}>
          <div className={styles.dropdown}>
            <div className={styles.text}>All</div>
            <Image className={styles.down_arrow} src={directionDown} alt="rank" />
          </div>
        </div>
      </Dropdown>
    );
  }, []);

  const headerDom = useMemo(() => {
    return (
      <div className={styles.headerWrap}>
        <div className={styles.headerLeft}>Rank</div>
        <div className={styles.headerMiddle}>Wallet Address</div>
        <div className={styles.headerRight}>Invitations</div>
      </div>
    );
  }, []);

  const myRankDom = useMemo(() => {
    return (
      myRank?.caAddress && (
        <div className={styles.myRankWrap}>
          <div className={styles.myRankTextWrap}>
            <div className={styles.myRankText}>{myRank.rank > 0 ? myRank.rank : '--'}</div>
          </div>
          <div className={styles.myRankMiddleWrap}>
            <Avatar
              className={styles.list_item_image}
              style={{ backgroundColor: '#303055', verticalAlign: 'middle', fontSize: '12px', color: '#7F7FA7' }}
              size={20}
              src={myRank?.avatar}>
              {myRank.walletName ? myRank.walletName[0].toUpperCase() : ''}
            </Avatar>
            <div className={styles.list_item_title}>{formatStr2EllipsisStr(formatAelfAddress(myRank?.caAddress), 8)}</div>
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
      <List className={styles.list} dataSource={list} header={myRankDom}>
        <VirtualList data={list ?? []} height={ContainerHeight} itemHeight={47} itemKey="email" onScroll={onScroll}>
          {(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              referralTotalCount={item.referralTotalCount}
              walletName={item?.walletName ? item.walletName[0].toUpperCase() : ''}
            />
          )}
        </VirtualList>
      </List>
    );
  }, [list, myRankDom, onScroll]);

  return (
    <CommonModal title={'LeaderBoard'} open={open} onCancel={onClose}>
      <div className={styles.container}>
        {selectorDom}
        {headerDom}
        {list && listDom}
      </div>
    </CommonModal>
  );
};

export default LeaderBoardModal;
