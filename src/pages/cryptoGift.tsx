'use client';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useMemo } from 'react';

const CryptoGiftPage = dynamic(() => import('../pageComponents/CryptoPage'), { ssr: false });

export const metadata = {
  title: 'Portkey Crypto Gift',
  description: `Portkey is the first account abstraction (AA) wallet from aelf's ecosystem. Users can swiftly log into Portkey via their Web2 social info with no private keys or mnemonics required. Account creation is free for all users!`,
  keywords: ['DID', 'social recovery', 'crypto wallet', 'AA wallet'],
};

export const viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

export default function CryptoGift() {
  const Provider = useMemo(() => {
    return dynamic(() => import('../provider'), { ssr: false });
  }, []);

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics  */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-28MESJ5HTM" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-28MESJ5HTM');
    `}
      </Script>
      <Provider>
        <CryptoGiftPage />
      </Provider>
    </>
  );
}
