"use client";
import { WebLoginProvider, init, useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { config } from './config';
import React from 'react';
import { ConfigProvider } from 'antd';

const Provider = ({ children }: { children: React.ReactNode }) => {
  const bridgeAPI = init(config); // upper config
  // return <div>{children}</div>
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <WebLoginProvider bridgeAPI={bridgeAPI}>
        {children}
      </WebLoginProvider>
    </ConfigProvider>
  );
};
export default Provider;
// const Demo = () => {
//   const {
//     connectWallet,
//     disConnectWallet,
//     walletInfo,
//     lock,
//     isLocking,
//     isConnected,
//     loginError,
//     walletType,
//     getAccountByChainId,
//     getWalletSyncIsCompleted,
//     getSignature,
//     callSendMethod,
//     callViewMethod
//   } = useConnectWallet();
// }