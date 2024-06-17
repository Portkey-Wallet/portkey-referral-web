import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import RankItem from '../RankItem';
import { List, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { directionDown } from '@/assets/images';

const LeaderBoardModal: React.FC = () => {
  const modal = useModal();
  const list = [
    { rank: 1, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 2, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 3, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 4, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 5, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 6, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 7, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 8, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 9, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 10, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 11, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 12, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 13, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 14, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 15, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
    { rank: 16, avatar: '', caAddress: 'ELF_wwww....wwww_AELF', count: 1000 },
  ];

  const onCancel = useCallback(() => {
    console.log('onCancel');
    modal.hide();
  }, [modal]);

  const selectorDom = useMemo(() => {
    const selectItems = ['All', 'My Invitations'];
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
            <div className={styles.text}>
              All
            </div>
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

  return (
    <CommonModal title={'LeaderBoard'} open={modal.visible} onCancel={onCancel} afterClose={modal.remove}>
      <div className={styles.container}>
        {selectorDom}
        {headerDom}
        <List
          className={styles.list}
          dataSource={list}
          renderItem={(item) => (
            <RankItem rank={item.rank} avatar={item.avatar} caAddress={item.caAddress} count={item.count} />
          )}
        />
      </div>
    </CommonModal>
  );
};

export default NiceModal.create(LeaderBoardModal);
