import { BigNumber } from '@ethersproject/bignumber';
import { useState } from 'react';
import SyntheticPool from 'src/diamondhand/SyntheticPool';

const useSyntheticPrice = (pool: SyntheticPool) => {
  const [priceCollateralPerShare] = useState<BigNumber>();
  const [syntheticPrice] = useState<BigNumber>();

  return { priceCollateralPerShare, syntheticPrice };
};

export default useSyntheticPrice;
