import referralApi from "@/utils/axios/referral";
import { useCallback, useEffect, useRef, useState } from "react"

export const useReferralHome = (caHash: string) => {
  const [viewTotal, setViewTotal] = useState<string>('--');
  const [referralRecords, setReferralRecords] = useState<IReferralRecordDetailDto[]>();
  const pageRef = useRef<{skip: number, limit: number}>({skip: 0, limit: 20});
  const next = useCallback(async () => {
    const result = await referralApi.referralRecordList({caHash, skip: pageRef.current?.skip, limit: pageRef.current?.limit});
    setReferralRecords(result.referralRecords);
  }, [caHash]);
  const init = useCallback(async () => {
    pageRef.current = {skip: 0, limit: 20};
    return await next();
  }, [next]);
  useEffect(() => {
    (async () => {
      const result = await referralApi.referralTotalCount({caHash});
      setViewTotal(result+'')
    })();
  }, [caHash]);
  return {referralRecords, viewTotal, init, next};
};

export const useReferralRank = (caHash: string) => {
  const [referralRankList, setReferralRankList] = useState<IReferralRecordsRankDetail[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const init = useCallback(async () => {
    const result = await referralApi.referralRecordRank({caHash});
    setReferralRankList(result.referralRecordsRank);
  }, [caHash]);
  useEffect(() => {
    (async () => {
      try{
        setLoading(true);
        const result = await init();
      }catch(e){
        setError(e?.message);
      }finally{
        setLoading(false);
      }
    })();
  }, [caHash, init]);
  return {referralRankList, loading, error};
};