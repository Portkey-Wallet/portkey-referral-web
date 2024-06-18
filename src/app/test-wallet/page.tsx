'use client';
import useAccount from '@/hooks/useAccount';
import useDiscoverProvider from '@/hooks/useDiscoverProvider';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { did } from '@portkey/did-ui-react';
import {Button} from 'antd'
import { log } from 'console';
import { useState } from 'react';
const AElf = require('aelf-sdk');

export default function Referral() {
  const timestamp = Date.now();

  did.services.communityRecovery.getHolderInfoByManager
  const { connectWallet, disConnectWallet, walletInfo, walletType } = useConnectWallet();
  const { login, sync, logout, isConnected, isLocking} = useAccount();
  const onConnectBtnClickHandler = async ()=>{
    console.log('wfs~~~');
      try {
      const rs = await connectWallet();
      console.log('connect success', rs);
    } catch (e: any) {
      console.log('connect failed', e.message)
    }
  }
  const onDisConnectBtnClickHandler = () => {
    disConnectWallet()
}
const signInfo = AElf.utils.sha256(`${walletInfo?.address}-${timestamp}`);

const [walletInfo2, setwalletInfo] = useState();
const { getSignatureAndPublicKey } = useDiscoverProvider();
  return <div>
    <Button onClick={async ()=>{
      try {
     const result = await getSignatureAndPublicKey(signInfo);
     const rst2 = await getCaHashAndOriginChainIdByWallet(walletInfo, walletType);
      console.log('wfs=== result', result, 'rst2===', rst2);
      }catch (e){
        console.log('wfs=== catch', e);
      }
    }}>getSignatureAndPublicKey</Button>
    <Button onClick={onConnectBtnClickHandler}>Connect</Button>
     <Button onClick={onDisConnectBtnClickHandler}>DisConnect</Button>
     <Button onClick={async () => {
      const status = await login();
      const caHash = await sync();
      console.log('login success! caHash', caHash);
     }}>Login And Sync</Button>
      <Button onClick={async () => {
      const caHash = await sync();
      console.log('sync success!', caHash);
     }}>Sync</Button>
     <Button onClick={async () => {
      await logout();
     }}>Logout</Button>
     <Button onClick={() => {
      console.log('walletInfo', walletInfo);
      console.log('walletInfo', isConnected);
      console.log('walletInfo2', did.didWallet);
      // setwalletInfo(walletInfo);
     }}>walletInfo</Button>
     
     <div style={{color: 'white'}}>walletInfo: {walletInfo?.address}</div>
     <div style={{color: 'white'}}>isConnected: {isConnected+''}</div>
  </div>;
}
