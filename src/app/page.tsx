'use client';
import useDiscoverProvider from '@/hooks/useDiscoverProvider';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/portkey';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { did } from '@portkey/did-ui-react';
import {Button} from 'antd'
import { useState } from 'react';

const AElf = require('aelf-sdk');


export default function Referral() {
  const timestamp = Date.now();

  did.services.communityRecovery.getHolderInfoByManager
  const { connectWallet, disConnectWallet, walletInfo, walletType } = useConnectWallet();
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
     <Button onClick={() => {
      console.log('walletInfo', walletInfo);
      // setwalletInfo(walletInfo);
     }}>walletInfo</Button>
     
     <div style={{color: 'white'}}>walletInfo: {walletInfo?.address}</div>
  </div>;
}
