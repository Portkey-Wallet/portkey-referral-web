import { BOT_UA } from '@/constants/userAgent';
import { UAParser } from 'ua-parser-js';
/**
 * Get the information of an useragent string.
 *
 * @param phrase user agent strings.
 * @returns parsed information.
 */
export function parseUserAgent(phrase: string): UserAgent {
  const result: UAParser.IResult = new UAParser(phrase).getResult();

  const regex = new RegExp(`(${BOT_UA.join('|')})`, 'ig');
  const isBot = phrase ? regex.test(phrase.toLowerCase()) : false;

  const browser: string | undefined = result.browser.name;
  const deviceType: string | null = result.device.type || null;
  const os: string | undefined = result.os.name;
  const engine: string | undefined = result.engine.name;
  const isMobile: boolean = deviceType === 'mobile';
  const isTablet: boolean = deviceType === 'tablet';
  const isIOS: boolean = os === 'iOS';

  const ua: UserAgent = Object.freeze({
    browser,
    deviceType,
    os,
    engine,
    isMobile,
    isTablet,
    isIOS,
    source: phrase,
    deviceVendor: result.device.vendor || null,
    osVersion: result.os?.version ? parseInt(result.os.version, 10) : undefined,
    browserVersion: result.browser?.version ? parseFloat(result.browser.version) : undefined,
    engineVersion: result.engine?.version ? parseFloat(result.engine.version) : undefined,
    isIphone: isMobile && isIOS,
    isIpad: isTablet && isIOS,
    isDesktop: !isMobile && !isTablet,
    isChrome: browser === 'Chrome',
    isFirefox: browser === 'Firefox',
    isSafari: browser === 'Safari',
    isIE: browser === 'IE',
    isEdge: browser === 'Edge',
    isOpera: browser === 'Opera',
    isMac: os === 'Mac OS',
    isChromeOS: os === 'Chromium OS',
    isWindows: os === 'Windows',
    isAndroid: os === 'Android',
    isBot: isBot,
  });

  return ua;
}

export interface UserAgent {
  readonly source: string; // The original user agent string.
  readonly deviceType: string | null;
  readonly deviceVendor: string | null;
  readonly os: string | undefined;
  readonly osVersion: number | undefined;
  readonly browser: string | undefined;
  readonly browserVersion: number | undefined;
  readonly engine: string | undefined;
  readonly engineVersion: number | undefined;
  readonly isIphone: boolean;
  readonly isIpad: boolean;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly isBot: boolean;
  readonly isChrome: boolean;
  readonly isFirefox: boolean;
  readonly isSafari: boolean;
  readonly isIE: boolean;
  readonly isEdge: boolean;
  readonly isOpera: boolean;
  readonly isMac: boolean;
  readonly isChromeOS: boolean;
  readonly isWindows: boolean;
  readonly isIOS: boolean;
  readonly isAndroid: boolean;
}
