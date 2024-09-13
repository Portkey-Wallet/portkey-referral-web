'use client';
import { WebLoginProvider, init, useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { config } from './config';
import React from 'react';
import '@/utils/detectProvide';
import '../script/telegram-web-app';

const Provider = ({ children }: { children: React.ReactNode }) => {
  const bridgeAPI = init(config); // upper config
  return <WebLoginProvider bridgeAPI={bridgeAPI}>{children}</WebLoginProvider>;
};
export default Provider;
