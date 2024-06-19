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
  avatar: string;
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
  walletName: string;
}


interface IActivityDateRange {
  startDate: string;
  endDate: string;
}