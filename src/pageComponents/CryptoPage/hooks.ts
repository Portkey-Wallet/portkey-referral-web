import { setLocalRandomDeviceId, getLocalRandomDeviceId } from '@/utils/storage';
import { useLayoutEffect, useState } from 'react';

export const useLocalRandomDeviceId = () => {
  const [id, setId] = useState('');

  useLayoutEffect(() => {
    const tmpId = setLocalRandomDeviceId();
    setId(tmpId);
  }, []);

  return id;
};
