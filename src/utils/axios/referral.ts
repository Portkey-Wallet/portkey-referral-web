import { portkeyGet } from "./portkey"
import { AxiosRequestConfig } from 'axios'
const ReferralPath ={
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
}
interface IApiConfig{
  path: string;
  params?: {}, 
  config?: AxiosRequestConfig;
}
export enum ActivityCycleEnums
{
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4
}
export enum ActivityEnums
{
    Invition = 1
}
interface IReferralRecordRankParams {
  activityCycleEnums?: ActivityCycleEnums;
  activityEnums?: ActivityEnums;
  caHash?: string;
}
class ReferralApi {
  private referralRecordListConfig: IApiConfig;
  private referralTotalCountConfig: IApiConfig;
  private referralRecordRankConfig: IApiConfig;
  private activityDateRangeConfig: IApiConfig;
  constructor(){
    this.referralRecordListConfig = ReferralPath.referralRecordList;
    this.referralTotalCountConfig = ReferralPath.referralTotalCount;
    this.referralRecordRankConfig = ReferralPath.referralRecordRank;
    this.activityDateRangeConfig = ReferralPath.activityDateRange;
  }
  async referralRecordList(params: {caHash: string, skip: number, limit: number}): Promise<IReferralRecordResponseDto>{
    return await portkeyGet(this.referralRecordListConfig.path, {...this.referralRecordListConfig.params, ...params}, this.referralRecordListConfig.config)
  }
  async referralTotalCount(params: {caHash: string}): Promise<number>{
    return await portkeyGet(this.referralTotalCountConfig.path, {...this.referralTotalCountConfig.params, ...params}, this.referralTotalCountConfig.config)
  }
  async referralRecordRank(params: IReferralRecordRankParams): Promise<IReferralRecordsRankResponseDto>{
    return await portkeyGet(this.referralRecordRankConfig.path, {...this.referralRecordRankConfig.params, ...params}, this.referralRecordRankConfig.config)
  }
  async activityDateRange(params: {activityEnums: ActivityEnums}): Promise<IActivityDateRange>{
    return await portkeyGet(this.activityDateRangeConfig.path, {...this.activityDateRangeConfig.params, ...params}, this.activityDateRangeConfig.config)
  }
}
const referralApi = new ReferralApi();
export default referralApi;
