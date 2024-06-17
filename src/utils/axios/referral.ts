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
enum ActivityCycleEnums
{
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4
}
enum ActivityEnums
{
    Invition = 1
}
interface IReferralRecordRankParams {
  activityCycleEnums: ActivityCycleEnums;
  activityEnums: ActivityEnums;
  caHash: string;
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
  referralRecordList(params: {caHash: string, skip: number, limit: number}){
    return portkeyGet(this.referralRecordListConfig.path, {...this.referralRecordListConfig.params, ...params}, this.referralRecordListConfig.config)
  }
  referralTotalCount(params: {caHash: string}){
    return portkeyGet(this.referralTotalCountConfig.path, {...this.referralTotalCountConfig.params, ...params}, this.referralTotalCountConfig.config)
  }
  referralRecordRank(params: IReferralRecordRankParams){
    return portkeyGet(this.referralRecordRankConfig.path, {...this.referralRecordRankConfig.params, ...params}, this.referralRecordRankConfig.config)
  }
  activityDateRange(params: {activityEnums: ActivityEnums}){
    return portkeyGet(this.activityDateRangeConfig.path, {...this.activityDateRangeConfig.params, ...params}, this.activityDateRangeConfig.config)
  }
}
const referralApi = new ReferralApi();
export default referralApi;
