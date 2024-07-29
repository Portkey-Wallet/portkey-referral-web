import { BaseSignalr, ISignalrOptions, IListen } from '@portkey/socket';
import { IReferralSignalr, DefaultReferralListenList, DefaultReferralListenListType } from '../../types/socket';

export class ReferralSignalr<T extends DefaultReferralListenListType = DefaultReferralListenListType> extends BaseSignalr<T> implements IReferralSignalr<T> {
  constructor(options?: ISignalrOptions<T>) {
    const { listenList = DefaultReferralListenList as T } = options || {};
    super({ listenList });
  }

  onLeaderBoardChanged(callback: (data: any) => void): IListen {
    return this.listen('onLeaderBoardChanged' as T[keyof T], callback);
  }
}
