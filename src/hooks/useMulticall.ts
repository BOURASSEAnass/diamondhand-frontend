import { useCallback } from 'react';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { useEthProvider } from 'src/contexts/ConnectionProvider';
import { Call, multicall } from 'src/diamondhand/multicall';

export const useMulticall = () => {
  const provider = useEthProvider();
  const { addresses } = useConfiguration();
  return useCallback(
    async (calls: Call[]) => {
      if (!addresses?.Multicall) {
        return;
      }
      return await multicall(provider, addresses.Multicall, calls);
    },
    [addresses, provider],
  );
};
