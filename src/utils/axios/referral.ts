import { portkeyGet } from './portkey';
import { AxiosRequestConfig } from 'axios';
import {
  IReferralRecordResponseDto,
  IReferralRecordsRankResponseDto,
  IActivityDateRange,
  IReferralShortLink,
  IActivityDetail,
  IRewardProgress,
} from '@/types/referral';
import { REFERRAL_PROJECT_CODE } from '@/constants/project';

const ReferralPath = {
  referralRecordList: {
    path: '/growth/referralRecordList',
  },
  referralTotalCount: {
    path: '/growth/referralTotalCount',
  },
  referralRecordRank: {
    path: '/growth/referralRecordRank',
  },
  activityDateRange: {
    path: '/growth/activityDateRange',
  },
  activityDetail: {
    path: 'growth/activityDetails',
  },
  rewardProgress: {
    path: 'growth/rewardProgress',
  },
  getReferralShortLink: {
    path: '/growth/shortLink',
    params: {
      projectCode: REFERRAL_PROJECT_CODE,
    },
  },
};
interface IApiConfig {
  path: string;
  params?: {};
  config?: AxiosRequestConfig;
}
export enum ActivityCycleEnums {
  Day = 1,
  Week = 2,
  Month = 3,
  Year = 4,
}
export enum ActivityEnums {
  Invitation = 1,
  Hamster = 2,
}
interface IReferralRecordRankParams {
  activityCycleEnums?: ActivityCycleEnums;
  activityEnums?: ActivityEnums;
  caHash?: string;
  skip: number;
  limit: number;
}
class ReferralApi {
  private referralRecordListConfig: IApiConfig;
  private referralTotalCountConfig: IApiConfig;
  private referralRecordRankConfig: IApiConfig;
  private activityDateRangeConfig: IApiConfig;
  private getReferralShortLinkConfig: IApiConfig;
  private activityDetailConfig: IApiConfig;
  private rewardProgressConfig: IApiConfig;
  constructor() {
    this.referralRecordListConfig = ReferralPath.referralRecordList;
    this.referralTotalCountConfig = ReferralPath.referralTotalCount;
    this.referralRecordRankConfig = ReferralPath.referralRecordRank;
    this.activityDateRangeConfig = ReferralPath.activityDateRange;
    this.getReferralShortLinkConfig = ReferralPath.getReferralShortLink;
    this.activityDetailConfig = ReferralPath.activityDetail;
    this.rewardProgressConfig = ReferralPath.rewardProgress;
  }
  async referralRecordList(params: {
    caHash?: string;
    skip: number;
    limit: number;
  }): Promise<IReferralRecordResponseDto> {
    return await portkeyGet(
      this.referralRecordListConfig.path,
      { ...this.referralRecordListConfig.params, ...params, activityEnums: ActivityEnums.Hamster },
      this.referralRecordListConfig.config,
    );
  }
  async referralTotalCount(): Promise<number> {
    return await portkeyGet(
      this.referralTotalCountConfig.path,
      { ...this.referralTotalCountConfig.params },
      this.referralTotalCountConfig.config,
    );
  }
  async referralRecordRank(params: IReferralRecordRankParams): Promise<IReferralRecordsRankResponseDto> {
    return await portkeyGet(
      this.referralRecordRankConfig.path,
      { ...this.referralRecordRankConfig.params, ...params, activityEnums: ActivityEnums.Hamster },
      this.referralRecordRankConfig.config,
    );
  }
  async activityDateRange(params: { activityEnums: ActivityEnums }): Promise<IActivityDateRange> {
    return await portkeyGet(
      this.activityDateRangeConfig.path,
      { ...this.activityDateRangeConfig.params, ...params },
      this.activityDateRangeConfig.config,
    );
  }
  async getReferralShortLink(): Promise<IReferralShortLink> {
    return await portkeyGet(
      this.getReferralShortLinkConfig.path,
      { ...this.getReferralShortLinkConfig.params },
      this.getReferralShortLinkConfig.config,
    );
  }
  async getActivityDetail(params: { activityEnums: ActivityEnums }): Promise<IActivityDetail> {
    return await portkeyGet(
      this.activityDetailConfig.path,
      { ...this.activityDetailConfig.params, ...params },
      this.activityDetailConfig.config,
    );
  }
  async getRewardProgress(params: { activityEnums: ActivityEnums }): Promise<IRewardProgress> {
    return await portkeyGet(
      this.rewardProgressConfig.path,
      { ...this.rewardProgressConfig.params, ...params },
      this.rewardProgressConfig.config,
    );
  }
}
const referralApi = new ReferralApi();
export default referralApi;
