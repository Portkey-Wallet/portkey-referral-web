import { LoadingInfoType, OpacityType, setLoading } from '@portkey/did-ui-react';
import { useCallback, useMemo } from 'react';

export const useLoading = () => {
  const _setLoading = useCallback(
    (isLoading: boolean | OpacityType, loadingInfo?: LoadingInfoType) => setLoading(isLoading, loadingInfo),
    [],
  );
  return useMemo(() => ({ setLoading: _setLoading }), [_setLoading]);
};
