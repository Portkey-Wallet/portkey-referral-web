import referralApi from "@/utils/axios/referral";
import { useCallback, useRef, useState } from "react"

export const useReferralRecordList = (caHash: string) => {
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
  return {referralRecords, init, next};
};
