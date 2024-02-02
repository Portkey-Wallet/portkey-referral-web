export function isPortkey() {
  if (typeof window === 'object') return window.navigator.userAgent.includes('Portkey');
  return false;
}
export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
