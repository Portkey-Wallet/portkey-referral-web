import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatSecond2CountDownTime = (second: number) => {
  if (second <= 0 || typeof second !== 'number') return '00:00';
  return dayjs.duration(second, 'seconds').format('mm:ss');
};
