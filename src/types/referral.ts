export interface IReferralRecordResponseDto {
  hasNextPage: boolean;
  lastDayReferralTotalCount: number;
  referralRecords: IReferralRecordDetailDto[];
}

export interface IReferralRecordDetailDto {
  referralDate: string;
  caHash: string;
  walletName: string;
  isDirectlyInvite: boolean;
  avatar: string;
}

export interface IReferralRecordsRankResponseDto {
  hasNext: boolean;
  referralRecordsRank: IReferralRecordsRankDetail[];
  currentUserReferralRecordsRankDetail: IReferralRecordsRankDetail;
}

export interface IReferralRecordsRankDetail {
  caAddress: string;
  referralTotalCount: number;
  avatar: string;
  rank: number;
  walletName: string;
}

export interface IActivityDateRange {
  startDate: string;
  endDate: string;
}