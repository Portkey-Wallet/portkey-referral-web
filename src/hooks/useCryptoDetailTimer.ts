import { useState, useRef, useEffect } from 'react';

export const useCryptoDetailTimer = () => {
  const workerRef = useRef<Worker>();
  const rootTime = useRef({ claimAgainCountdownSecond: 0, expiredTime: 0 });
  const [claimAgainCountdownSecond, setClaimAgainCountdownSecond] = useState(0);
  const [expiredTime, setExpiredTime] = useState(0);

  useEffect(() => {
    if (rootTime.current.claimAgainCountdownSecond <= 0 && rootTime.current.expiredTime <= 0 && workerRef.current) {
      return workerRef?.current.postMessage({ type: 'STOP_TIMER' });
    }

    workerRef.current = new Worker(new URL('../webWorker/cryptoGiftCountDown.js', import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'UPDATE_COUNTDOWN':
          setClaimAgainCountdownSecond(Number(payload.claimAgainCountdownSecond?.toFixed(0)));
          break;
        case 'UPDATE_EXPIRATION':
          setExpiredTime(Number(payload.expiredTime?.toFixed(0)));
          break;
        case 'TIMER_FINISHED':
          workerRef.current && workerRef.current.postMessage({ type: 'STOP_TIMER' });
          break;
        default:
          break;
      }
    };

    workerRef.current.postMessage({
      type: 'START_TIMER',
      payload: {
        remainingWaitingSeconds: rootTime.current.claimAgainCountdownSecond,
        remainingExpirationSeconds: rootTime.current.expiredTime,
      },
    });

    return () => {
      workerRef?.current && workerRef?.current.postMessage({ type: 'STOP_TIMER' });
      workerRef?.current && workerRef?.current.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootTime.current.claimAgainCountdownSecond, rootTime.current.expiredTime]);

  return { claimAgainCountdownSecond, expiredTime, rootTime };
};
