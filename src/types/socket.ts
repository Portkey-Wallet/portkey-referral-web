import { ISignalr, IListen } from '@portkey/socket';

export const DefaultReferralListenList = ['RewardProgressChanged', 'ReferralRecordListChanged'];

export type DefaultReferralListenListType = typeof DefaultReferralListenList;

export interface IReferralSignalr<T extends DefaultReferralListenListType = DefaultReferralListenListType> extends ISignalr<T> {
  onLeaderBoardChanged(callback: (data: any) => void): IListen;
}

