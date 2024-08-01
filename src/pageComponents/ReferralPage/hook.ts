import referralApi, { ActivityEnums } from '@/utils/axios/referral';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IReferralRecordDetailDto, IReferralRecordsRankDetail } from '@/types/referral';

const INIT_PAGE = { hasNext: true, skip: 0, limit: 10 };

export const useReferralHome = () => {
  const [viewTotal, setViewTotal] = useState<string>('--');
  const [referralRecords, setReferralRecords] = useState<IReferralRecordDetailDto[]>();
  const pageRef = useRef<{ skip: number; limit: number }>(INIT_PAGE);
  const next = useCallback(async () => {
    const result = await referralApi.referralRecordList({
      skip: pageRef.current?.skip,
      limit: pageRef.current?.limit,
    });
    setReferralRecords(result.referralRecords);
  }, []);
  const init = useCallback(async () => {
    pageRef.current = INIT_PAGE;
    return await next();
  }, [next]);
  useEffect(() => {
    (async () => {
      const result = await referralApi.referralTotalCount();
      setViewTotal(result + '');
    })();
  }, []);
  return { referralRecords, viewTotal, init, next };
};

export const useReferralRank = () => {
  const [referralRankList, setReferralRankList] = useState<IReferralRecordsRankDetail[]>([]);
  const [myRank, setMyRank] = useState<IReferralRecordsRankDetail | null>(null);
  const [invitations, setInvitations] = useState<string>('');
  const pageRef = useRef<{ hasNext: boolean; skip: number; limit: number }>(INIT_PAGE);
  const next = useCallback(
    async (init?: boolean, activityEnum?: number) => {
      if (!pageRef.current?.hasNext) return;
      if (init) {
        setReferralRankList([]);
        setMyRank(null);
      }
      const result = await referralApi.referralRecordRank({
        activityEnums: activityEnum ?? ActivityEnums.Hamster,
        skip: pageRef.current?.skip,
        limit: pageRef.current?.limit,
      });
      pageRef.current = {
        ...pageRef.current,
        skip: pageRef.current.skip + result.referralRecordsRank.length,
        hasNext: result.hasNext,
      };
      init && setMyRank(result.currentUserReferralRecordsRankDetail);
      init && setInvitations(result.invitations);
      const newRankList = init ? result.referralRecordsRank : referralRankList.concat(result.referralRecordsRank);
      setReferralRankList([...newRankList]);
    },
    [referralRankList],
  );
  const init = useCallback((activityEnum?: number) => {
    pageRef.current = INIT_PAGE;
    return next(true, activityEnum);
  }, [next]);
  return { referralRankList, myRank, invitations, init, next };
};
