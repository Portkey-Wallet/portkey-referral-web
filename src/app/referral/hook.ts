import referralApi, { ActivityEnums } from '@/utils/axios/referral';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IReferralRecordDetailDto, IReferralRecordsRankDetail } from '@/types/referral';

const INIT_PAGE = { hasNext: true, skip: 0, limit: 10 };

export const useReferralHome = (caHash: string) => {
  const [viewTotal, setViewTotal] = useState<string>('--');
  const [referralRecords, setReferralRecords] = useState<IReferralRecordDetailDto[]>();
  const pageRef = useRef<{ skip: number; limit: number }>(INIT_PAGE);
  const next = useCallback(async () => {
    const result = await referralApi.referralRecordList({
      caHash,
      skip: pageRef.current?.skip,
      limit: pageRef.current?.limit,
    });
    setReferralRecords(result.referralRecords);
  }, [caHash]);
  const init = useCallback(async () => {
    pageRef.current = INIT_PAGE;
    return await next();
  }, [next]);
  useEffect(() => {
    (async () => {
      const result = await referralApi.referralTotalCount({ caHash });
      setViewTotal(result + '');
    })();
  }, [caHash]);
  return { referralRecords, viewTotal, init, next };
};

export const useReferralRank = (caHash?: string) => {
  const [referralRankList, setReferralRankList] = useState<IReferralRecordsRankDetail[]>([]);
  const [myRank, setMyRank] = useState<IReferralRecordsRankDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const pageRef = useRef<{ hasNext: boolean; skip: number; limit: number }>(INIT_PAGE);
  const next = useCallback(
    async (init?: boolean) => {
      if (!caHash) return;
      if (!pageRef.current?.hasNext) return;
      const result = await referralApi.referralRecordRank({
        caHash,
        activityEnums: ActivityEnums.Invitation,
        skip: pageRef.current?.skip,
        limit: pageRef.current?.limit,
      });
      pageRef.current = {
        ...pageRef.current,
        skip: pageRef.current.skip + result.referralRecordsRank.length,
        hasNext: result.hasNext,
      };
      init && setMyRank(result.currentUserReferralRecordsRankDetail);
      const newRankList = init ? result.referralRecordsRank : referralRankList.concat(result.referralRecordsRank);
      setReferralRankList([...newRankList]);
    },
    [caHash, referralRankList],
  );
  const init = useCallback(() => {
    pageRef.current = INIT_PAGE;
    return next(true);
  }, [next]);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       console.log('aaa useReferralRank caHash : ', caHash);
  //       setLoading(true);
  //       await init();
  //     } catch (e: any) {
  //       setError(e?.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [caHash, init]);
  return { referralRankList, myRank, loading, error, init, next };
};
