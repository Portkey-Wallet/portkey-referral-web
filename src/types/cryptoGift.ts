export enum RedPackageDisplayType {
  Common = 'Common', // chat redPackage
  CryptoGift = 'CryptoGift',
}
export enum RedPackageGrabStatus {
  Success = 1,
  Fail = 2,
}

export enum AssetsType {
  ft = 1,
  nft = 2,
}

export enum CryptoGiftPhase {
  Available = 0,
  Expired = 1,
  Claimed = 2,
  ExpiredReleased = 3,
  FullyClaimed = 4,
  OnlyNewUsers = 5,
  GrabbedQuota = 6,
  NoQuota = 7,
  AlreadyClaimed = 8,
}

export type TCryptoDetail = {
  amount: number;
  cryptoGiftPhase: CryptoGiftPhase;
  memo: string;
  prompt: string;
  remainingExpirationSeconds: number;
  remainingWaitingSeconds: number;
  sender: { avatar: string; nickname: string };
  subPrompt: string;
  isNewUsersOnly: boolean;
  symbol: string;
  label?: string;
  decimals: number;
  dollarValue: string;
  nftAlias: string;
  nftImageUrl: string;
  nftTokenId: string;
  assetType: AssetsType;
};

export enum OperationType {
  Register = 'Register',
  SocialRecovery = 'SocialRecovery',
}

export enum ClientType {
  TgBot = 'TgBot',
  Android = 'Android',
  IOS = 'IOS',
  Extension = 'Extension',
  H5 = 'H5',
}
