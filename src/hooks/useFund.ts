import { useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

interface FundState {
  reservedCollateralRatio: BigNumber;
  vaultBalance: BigNumber;
  foundryFundBalance: BigNumber;
  aboveThreshold: boolean;
}

const useFund = (asset: string) => {
  const [fundState] = useState<FundState>();

  return fundState;
};

export default useFund;
