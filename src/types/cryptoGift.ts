export type TCryptoGiftInfoType = {
  identityCode: string;
  giftInfo: {
    avatar: string;
  };
};

export enum CryptoGiftPhase {
  Expired = 1,
  ReceivedSuccessfully = 2,
  ValidityPeriodExpired = 3,
  NoneLeft = 4,
  OnlyNewUsers = 5,
  ClaimedByMe = 6,
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
};
