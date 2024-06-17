interface IReferralRecordResponseDto {
  lastDayReferralTotalCount: number;
  referralRecords: IReferralRecordDetailDto[];
}
interface IReferralRecordDetailDto {
  referralTime: string;
  caHash: string;
  walletName: string;
  isDirectlyInvite: boolean;
}

interface IReferralRecordsRankResponseDto {
  referralRecordsRank: IReferralRecordsRankDetail[];
  currentUserReferralRecordsRankDetail: IReferralRecordsRankDetail;
}
interface IReferralRecordsRankDetail {
  caAddress: string;
  referralTotalCount: number;
}


interface IActivityDateRange {
  startDate: string;
  endDate: string;
}