import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import SyntheticPool, { SyntheticPoolInfo } from 'src/diamondhand/SyntheticPool';

const useSyntheticPoolInfo = (pool: SyntheticPool) => {
  const [syntheticPoolInfo, setSyntheticPoolInfo] = useState<SyntheticPoolInfo>();
  const [priceCollateralPerShare, setPriceCollateralPerShare] = useState(BigNumber.from(0));
  const [syntheticPrice, setSyntheticPrice] = useState(BigNumber.from(0));

  const loadInfo = useCallback(async (pool: SyntheticPool) => {
    const info = await pool.getInfo();
    const syntheticPrice = await pool.dTokenToCollateralPrice();
    const diamondPrice = await pool.diamondToCollateralPrice();

    return { info, syntheticPrice, diamondPrice };
  }, []);

  useEffect(() => {
    if (!pool) {
      return;
    }
    let mounted = true;
    loadInfo(pool).then((res) => {
      if (mounted) {
        setSyntheticPoolInfo(res.info);
        setSyntheticPrice(res.syntheticPrice);
        setPriceCollateralPerShare(res.diamondPrice);
      }
    });

    return () => {
      mounted = false;
    };
  }, [loadInfo, pool]);

  return { syntheticPoolInfo, priceCollateralPerShare, syntheticPrice };
};

export default useSyntheticPoolInfo;
