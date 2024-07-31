import { BaseSignalr, ISignalrOptions, IListen } from '@portkey/socket';
import { HubConnectionBuilder, HubConnection, HttpTransportType } from '@microsoft/signalr';
import { IReferralSignalr, DefaultReferralListenList, DefaultReferralListenListType } from '../../types/socket';
import { ActivityEnums } from '@/utils/axios/referral';
import { BEARER } from '@/utils/axios/connect';

export class ReferralSignalr<T extends DefaultReferralListenListType = DefaultReferralListenListType>
  extends BaseSignalr<T>
  implements IReferralSignalr<T>
{
  private portkeyToken = '';

  constructor(options?: ISignalrOptions<T>) {
    const { listenList = DefaultReferralListenList as T } = options || {};
    super({ listenList });
  }

  setPortkeyToken(token: string) {
    this.portkeyToken = token;
  }

  public doOpen = async ({ url, clientId }: { url: string; clientId?: string }): Promise<HubConnection> => {
    console.log(': this.portkeyToken', this.portkeyToken);
    const signalr = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => this.formatTokenWithOutBear(this.portkeyToken || ''),
        // headers: { Authorization: this.formatTokenWithOutBear(this.portkeyToken || '') },
        // skipNegotiation: true,
        // transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    if (this.signalr) await this.signalr.stop();

    await signalr.start();
    await signalr.invoke('Connect', clientId || '');
    signalr.onreconnected((connectionId) => this.onReconnected(signalr, connectionId, clientId));
    this.connectionId = signalr.connectionId ?? '';
    this.signalr = signalr;
    this.url = url;

    return signalr;
  };

  async onReconnected(signalr: HubConnection, _connectionId?: string, clientId?: string) {
    try {
      signalr.invoke('Connect', clientId || '');
    } catch (error) {
      console.log('onReconnected error', error);
    }
  }

  requestRewardProgress(clientId: string): Promise<void> {
    return this.invoke('RewardProgress', {
      targetClientId: clientId,
      activityEnums: ActivityEnums.Hamster,
    });
  }
  requestReferralRecordList(clientId: string): Promise<void> {
    return this.invoke('ReferralRecordList', {
      targetClientId: clientId,
      activityEnums: ActivityEnums.Hamster,
      limit: 10,
    });
  }

  onRewardProgressChanged(callback: (data: any) => void): IListen {
    return this.listen('RewardProgressChanged' as T[keyof T], callback);
  }
  onReferralRecordListChanged(callback: (data: any) => void): IListen {
    return this.listen('ReferralRecordListChanged' as T[keyof T], callback);
  }
  onLeaderBoardChanged(callback: (data: any) => void): IListen {
    return this.listen('LeaderBoardChanged' as T[keyof T], callback);
  }

  private formatTokenWithOutBear(token: string) {
    if (token.startsWith(BEARER)) return token.replace(`${BEARER} `, '');
    return token;
  }
}

export const referralSignalr = new ReferralSignalr();
