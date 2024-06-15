import { useEffect, useState } from 'react';
import  * as devices from '../utils/device';
import { isBrowser, isPortkey } from '@/utils/portkey';
import { detectBrowserName } from '@portkey/onboarding';

export const useEnvironment = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isPortkeyApp, setIsPortkeyApp] = useState<boolean>(false);
  const [isWeChat, setIsWeChat] = useState<boolean>(false);

  useEffect(() => {
    // is wechat
    setIsWeChat(detectBrowserName() === 'WeChat');

    // device
    const isMobile = devices.isMobile().tablet || devices.isMobile().phone || !isBrowser;
    const isIOS = devices.isMobile().apple.device;
    const isAndroid = devices.isMobile().android.device;
    setIsMobile(isMobile);
    setIsIOS(isIOS);
    setIsAndroid(isAndroid);

    // portkey app
    const isPortkeyApp = isPortkey();
    setIsPortkeyApp(isPortkeyApp);
  }, []);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isPortkeyApp,
    isWeChat,
  };
};
