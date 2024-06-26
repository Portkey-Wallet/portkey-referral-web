let timerRef;

self.onmessage = (event) => {
  const { type, payload } = event.data;
  switch (type) {
    case 'START_TIMER':
      const { remainingWaitingSeconds, remainingExpirationSeconds } = payload;
      startTimer(remainingWaitingSeconds, remainingExpirationSeconds);
      break;
    case 'STOP_TIMER':
      stopTimer();
      break;
    default:
      break;
  }
};

function startTimer(remainingWaitingSeconds, remainingExpirationSeconds) {
  let lastTimestamp = performance.now();

  const tick = (timestamp) => {
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (remainingWaitingSeconds > 0) {
      remainingWaitingSeconds -= delta / 1000;
      self.postMessage({
        type: 'UPDATE_COUNTDOWN',
        payload: {
          claimAgainCountdownSecond: remainingWaitingSeconds > 0 ? remainingWaitingSeconds : 0,
        },
      });
    }

    if (remainingExpirationSeconds > 0) {
      remainingExpirationSeconds -= delta / 1000;
      self.postMessage({
        type: 'UPDATE_EXPIRATION',
        payload: {
          expiredTime: remainingExpirationSeconds > 0 ? remainingExpirationSeconds : 0,
        },
      });
    }

    if (remainingWaitingSeconds > 0 || remainingExpirationSeconds > 0) {
      timerRef = requestAnimationFrame(tick);
    } else {
      self.postMessage({
        type: 'TIMER_FINISHED',
      });
    }
  };

  timerRef = requestAnimationFrame(tick);
}

function stopTimer() {
  timerRef && cancelAnimationFrame(timerRef);
  timerRef = null;
}
