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
  recordDesc: string;
}

export interface IReferralRecordsRankResponseDto {
  hasNext: boolean;
  referralRecordsRank: IReferralRecordsRankDetail[];
  currentUserReferralRecordsRankDetail: IReferralRecordsRankDetail;
  invitations: string;
}

export interface IReferralRecordsRankDetail {
  caAddress: string;
  referralTotalCount: number;
  avatar: string;
  rank: number;
  walletName: string;
  recordDesc: string;
}

export interface IActivityDateRange {
  startDate: string;
  endDate: string;
}

export interface IReferralShortLink {
  shortLink: string;
}

export interface IActivityConfig {
  activityTitle: string;
  isShow: Boolean;
  imageUrl: string;
  startDate: string;
  startDateFormat: string;
  endDate: string;
  endDateFormat: string;
  taskImageUrl: string;
  pcTaskImageUrl: string;
}

export interface IRulesConfig {
  isRulesShow: Boolean;
  rulesDesc: string;
  rulesUrl: string;
}

export interface IActivityDetail {
  activityConfig: IActivityConfig;
  rulesConfig: IRulesConfig;
}

export interface IRewardProgressDataItem {
  activityName: string;
  referralCount: number;
}

export interface IRewardProgress {
  data: IRewardProgressDataItem[];
  rewardProcessCount: string; // "10.0 ELF"
}
