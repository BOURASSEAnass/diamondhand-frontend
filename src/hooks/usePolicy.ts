import { BigNumber } from '@ethersproject/bignumber';
import { useState } from 'react';

interface Policy {
  utilizationRatio: BigNumber;
  resevedThreshold: BigNumber;
  profitSharingRatio: BigNumber;
}

const usePolicy = (asset: string) => {
  const [policy] = useState<Policy>();

  return policy;
};

export default usePolicy;
