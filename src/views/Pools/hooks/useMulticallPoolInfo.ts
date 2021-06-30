import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import DiamondHand from 'src/diamondhand';
import SyntheticPool, { SyntheticPoolInfo } from 'src/diamondhand/SyntheticPool';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { useMulticall } from 'src/hooks/useMulticall';
import { fromPairs } from 'src/utils/objects';

export type PoolListItem = {
  address: string;
  syntheticPoolInfo: SyntheticPoolInfo;
  priceCollateralPerShare: BigNumber;
  syntheticPrice: BigNumber;
  collateralBalance: BigNumber;
};

export const useMulticalPoolInfo = () => {
  const multicall = useMulticall();
  const diamondHand = useDiamondHand();
  const config = useConfiguration();
  const [value, setValue] = useState<PoolListItem[]>([]);

  const getInfo = useCallback(
    async (diamondHand: DiamondHand) => {
      const call = Object.keys(diamondHand.POOLS).map((address) => {
        return {
          contract: diamondHand.POOLS[address].contract,
          method: 'info',
          params: [],
        };
      });

      const data = await multicall(call);
      return fromPairs(Object.keys(diamondHand.POOLS), data.map(SyntheticPool.readInfo));
    },
    [multicall],
  );

  const getCollateralBalances = useCallback(
    async (diamondHand: DiamondHand) => {
      const call = Object.keys(diamondHand.POOLS).map((address) => {
        const poolConfig = config.pools.find((p) => p.pool === address);
        return {
          contract: diamondHand.TREASURY.contract,
          method: 'globalCollateralValue',
          params: [poolConfig?.collateral],
        };
      });

      const data = await multicall(call);
      return fromPairs(
        Object.keys(diamondHand.POOLS),
        data.map((t) => t[0]),
      );
    },
    [multicall, config],
  );

  const getDTokenPrice = useCallback(
    async (diamondHand: DiamondHand) => {
      const call = Object.keys(diamondHand.POOLS).map((address) => {
        return {
          contract: diamondHand.POOLS[address].contract,
          method: 'dTokenToCollateralPrice',
          params: [],
        };
      });

      const data = await multicall(call);
      return fromPairs(
        Object.keys(diamondHand.POOLS),
        data.map((t) => t[0]),
      );
    },
    [multicall],
  );

  const getDiamondPrice = useCallback(
    async (diamondHand: DiamondHand) => {
      const call = Object.keys(diamondHand.POOLS).map((address) => {
        return {
          contract: diamondHand.POOLS[address].contract,
          method: 'diamondToCollateralPrice',
          params: [],
        };
      });

      const data = await multicall(call);
      return fromPairs(
        Object.keys(diamondHand.POOLS),
        data.map((t) => t[0]),
      );
    },
    [multicall],
  );

  useEffect(() => {
    if (!diamondHand) {
      return;
    }
    let mounted = true;
    Promise.all([
      getInfo(diamondHand),
      getDTokenPrice(diamondHand),
      getDiamondPrice(diamondHand),
      getCollateralBalances(diamondHand),
    ]).then(([infos, dtoken, diamond, collateralBalances]) => {
      if (!mounted) {
        return;
      }
      const pools = Object.keys(diamondHand.POOLS);
      setValue(
        pools.map((address) => {
          return {
            address,
            syntheticPoolInfo: infos[address],
            priceCollateralPerShare: diamond[address],
            syntheticPrice: dtoken[address],
            collateralBalance: collateralBalances[address],
          };
        }),
      );
    });

    return () => {
      mounted = false;
    };
  }, [diamondHand, getDTokenPrice, getDiamondPrice, getInfo, getCollateralBalances]);

  return value;
};
