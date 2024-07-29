import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List, Avatar, Popover, ConfigProvider, Modal as AntdModal } from 'antd';
import styles from './styles.module.scss';
import RankItem, { showRankImage, RankImages } from '../RankItem';
import { directionRight, suggestCircle, close } from '@/assets/images';
import Image from 'next/image';
import LeaderBoardModal from '../LeaderboardModal';
import { formatStr2EllipsisStr, formatAelfAddress } from '@/utils';
import { useReferralRank } from '../../hook';
import { useResponsive } from '@/hooks/useResponsive';
import { useEnvironment } from '@/hooks/environment';
import { IActivityBaseInfoItem } from '@/types/referral';
import referralApi from '@/utils/axios/referral';

const TopRanks: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
  const { referralRankList: originalReferralRankList, init, next, myRank, invitations } = useReferralRank();
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activityBaseInfoItems, setActivityBaseInfoItems] = useState<IActivityBaseInfoItem[]>();
  const { isLG } = useResponsive();
  const { isPortkeyApp } = useEnvironment();

  const referralRankList = useMemo(() => {
    const sliceIndex = originalReferralRankList.findIndex((item) => item.rank > 10);
    return sliceIndex === -1 ? originalReferralRankList : originalReferralRankList.slice(0, sliceIndex);
  }, [originalReferralRankList]);

  const fetchActivityBaseInfo = useCallback(async () => {
    try {
      const res = await referralApi.getActivityBaseInfo();
      setActivityBaseInfoItems(res?.data);
    } catch (error) {
      console.error('referralActivityBaseInfo error : ', error);
    }
  }, []);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useEffect(() => {
    fetchActivityBaseInfo();
  }, [fetchActivityBaseInfo]);

  useEffect(() => {
    if (referralRankList.length < 0) return;
    const lastItem = referralRankList[referralRankList.length - 1];
    if (lastItem && lastItem.rank <= 10) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralRankList]);

  const onViewAll = useCallback(() => {
    setShowLeaderBoardModal(true);
  }, []);

  const listLeftItemWidth = useMemo(() => {
    return isLG ? styles.list_item_left_width_h5 : styles.list_item_left_width_pc;
  }, [isLG]);

  const listRightItemWidth = useMemo(() => {
    return isLG ? styles.list_item_right_width_h5 : styles.list_item_right_width_pc;
  }, [isLG]);

  const suggestionModal = useMemo(() => {
    const modalStyles = {
      header: {
        backgroundColor: '#161630',
      },
      content: {
        backgroundColor: '#161630',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
      },
    };
    return (
      <ConfigProvider
        modal={{
          styles: modalStyles,
        }}>
        <AntdModal
          open={showSuggestions}
          keyboard={false}
          maskClosable={false}
          destroyOnClose={true}
          closeIcon={<Image src={close} width={20} height={20} alt="close" />}
          onCancel={() => {
            setShowSuggestions(false);
          }}
          width={335}
          footer={null}
          centered
          className={styles.modal_web}
          wrapClassName={`${styles['modal-wrap']}`}
          title={
            <div className={styles.titleWrap}>
              <div className={styles.titleText}>Invited</div>
            </div>
          }>
          <div>
            <div className={styles.suggestion_content_modal}>{invitations}</div>
            <a
              className={styles.suggestion_button_modal}
              onClick={() => {
                setShowSuggestions(false);
              }}>
              <div className={styles.suggestion_button_text_modal}>OK</div>
            </a>
          </div>
        </AntdModal>
      </ConfigProvider>
    );
  }, [invitations, showSuggestions]);

  const myRankDom = useMemo(() => {
    return (
      myRank?.caAddress && (
        <div className={styles.my_rank_wrap}>
          <div className={`${styles.list_item_left} ${listLeftItemWidth}`}>
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
          <div className={styles.list_item_middle}>
            <Avatar
              className={styles.list_item_image}
              style={{ backgroundColor: '#303055', verticalAlign: 'middle', fontSize: '12px', color: '#7F7FA7' }}
              size={20}
              src={myRank?.avatar}>
              {myRank?.walletName ? myRank?.walletName[0].toUpperCase() : ''}
            </Avatar>
            <div className={styles.list_item_title}>
              {formatStr2EllipsisStr(formatAelfAddress(myRank?.caAddress), 8)}
            </div>
            <div className={styles.me_wrap}>
              <div className={styles.me_text}>Me</div>
            </div>
          </div>
          <div className={`${styles.list_item_right} ${listRightItemWidth}`}>{myRank?.referralTotalCount}</div>
        </div>
      )
    );
  }, [myRank, listLeftItemWidth, listRightItemWidth]);

  return (
    <div className={styles.container}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left}></div>
        <div className={styles.header_title}>Leaderboard</div>
        <div className={styles.header_right}></div>
      </div>
      <div className={`${styles.list_wrap} ${isLG ? styles.list_wrap_margin_h5 : styles.list_wrap_margin_pc}`}>
        <div className={styles.list_header_wrap}>
          <div className={`${styles.list_item_left} ${listLeftItemWidth}`}>Rank</div>
          <div className={styles.list_item_middle}>
            <div className={styles.list_item_title}>Wallet Address</div>
          </div>
          <div className={`${styles.list_item_right} ${listRightItemWidth}`}>
            <div>Invited</div>
            {Boolean(invitations) && (isLG ? (
              <Image
                className={styles.suggestion_image}
                src={suggestCircle}
                width={14}
                height={14}
                alt="invited"
                onClick={() => {
                  setShowSuggestions(true);
                }}
              />
            ) : (
              <Popover
                content={<div className={styles.suggestion_popover}>{invitations}</div>}
                color="rgba(0, 0, 0, 0.80)"
                overlayStyle={{
                  width: '240px',
                }}
                trigger="click">
                <Image
                  className={styles.suggestion_image}
                  src={suggestCircle}
                  width={14}
                  height={14}
                  alt="invited"
                  onClick={() => {
                    setShowSuggestions(true);
                  }}
                />
              </Popover>
            ))}
          </div>
        </div>
        <List
          className={styles.list}
          dataSource={referralRankList}
          header={myRankDom}
          renderItem={(item, index) => (
            <RankItem
              rank={item.rank ?? index + 1}
              avatar={item.avatar}
              caAddress={item.caAddress}
              referralTotalCount={item.referralTotalCount}
              recordDesc={item.recordDesc}
              walletName={item?.walletName?.length > 0 ? item.walletName[0].toUpperCase() : ''}
            />
          )}
        />
      </div>
      <a className={styles.view_all_wrap} onClick={onViewAll}>
        <div className={styles.view_all_text}>View More</div>
        <Image className={styles.right_arrow} src={directionRight} alt="view all" />
      </a>
      {showLeaderBoardModal && (
        <LeaderBoardModal
          activityItems={activityBaseInfoItems}
          open={showLeaderBoardModal}
          onClose={() => {
            setShowLeaderBoardModal(false);
          }}
        />
      )}
      {showSuggestions && isLG && suggestionModal}
    </div>
  );
};

export default TopRanks;
