import { DEVICE_TYPE } from '@/constants/enum';
import { parseUserAgent } from '@/utils/parseUserAgent';
import { useEffect, useState } from 'react';

export function useUserAgent(ua?: string) {
  const [type, setType] = useState(DEVICE_TYPE.WebChrome); // default web chrome

  useEffect(() => {
    const uaPrams = ua || navigator?.userAgent || '';
    const uaParse = parseUserAgent(uaPrams);

    if (uaParse.isMobile) {
      if (uaParse.isIOS) {
        setType(DEVICE_TYPE.IOS);
      } else if (uaParse.isAndroid) {
        setType(DEVICE_TYPE.Android);
      }
    } else {
      setType(uaParse.isChrome ? DEVICE_TYPE.WebChrome : DEVICE_TYPE.WebNotChrome);
    }
  }, [type, ua]);

  return type;
}
