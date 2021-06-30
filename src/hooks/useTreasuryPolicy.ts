import { BigNumber } from '@ethersproject/bignumber';
import { useState } from 'react';

interface TreasuryInfo {
  utilizationRatio: BigNumber;
  reservedThresholdRatio: BigNumber;
  profitSharingRatio: BigNumber;
  vaultBalance: BigNumber;
  poolBalance: BigNumber;
  reservedCollateralRatio: BigNumber;
  isAboveThreshold: boolean;
}

const useTreasuryPolicy = (asset: string, pool: string) => {
  const [info, setInfo] = useState<TreasuryInfo>();

  return info;
};

export default useTreasuryPolicy;
