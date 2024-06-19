import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import RankItem from '../LeaderBoardRankItem';
import { List, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { directionDown } from '@/assets/images';
import { useReferralRank } from '../../hook';
import { formatStr2EllipsisStr } from '@/utils';
import useAccount from '@/hooks/useAccount';
import VirtualList from 'rc-virtual-list';

const ContainerHeight = 434;

const LeaderBoardModal: React.FC = () => {
  const modal = useModal();
  const { caHash } = useAccount();
  const { referralRankList: list, myRank, loading, error } = useReferralRank(caHash ?? undefined);

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

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
        {/* <a onClick={(e) => e.preventDefault()}>Hover me</a> */}
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
            <Image className={styles.list_item_image} width={20} height={20} src={myRank?.avatar ?? ''} alt="" />
            <div className={styles.list_item_title}>{formatStr2EllipsisStr(myRank?.caAddress, 8)}</div>
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
        <VirtualList data={list ?? []} height={ContainerHeight} itemHeight={47} itemKey="email">
          {(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              count={item.referralTotalCount}
            />
          )}
        </VirtualList>
      </List>
    );
  }, [list, myRankDom]);

  return (
    <CommonModal title={'LeaderBoard'} open={modal.visible} onCancel={onCancel} afterClose={modal.remove}>
      <div className={styles.container}>
        {selectorDom}
        {headerDom}
        {list && listDom}
      </div>
    </CommonModal>
  );
};

export default NiceModal.create(LeaderBoardModal);
