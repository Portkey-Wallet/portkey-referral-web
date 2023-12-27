
'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { SignIn, ISignIn, DIDWalletInfo, PortkeyProvider } from '@portkey/did-ui-react';
import { useCallback, useRef } from 'react';
import '@portkey/did-ui-react/dist/assets/index.css'

export default function Home() {
  const signInRef = useRef<ISignIn>(null);

  const onFinish = useCallback((didWallet: DIDWalletInfo) => {
    console.log('DIDWalletInfo', didWallet);
  }, []);

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  return (
    <div>
      <button onClick={() => signInRef.current?.setOpen(true)}>Sign up</button>
      <PortkeyProvider networkType='TESTNET'>
        <SignIn uiType="Modal" ref={signInRef} onFinish={onFinish} onCancel={onCancel} />
      </PortkeyProvider>
    </div>
  )
}
