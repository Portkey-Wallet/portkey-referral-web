interface IReferralRecordResponseDto {
  hasNextPage: boolean;
  lastDayReferralTotalCount: number;
  referralRecords: IReferralRecordDetailDto[];
}
interface IReferralRecordDetailDto {
  referralDate: string;
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
  avatar: string;
  rank: number;
}


interface IActivityDateRange {
  startDate: string;
  endDate: string;
}