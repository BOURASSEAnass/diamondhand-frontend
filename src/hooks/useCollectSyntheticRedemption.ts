import { BigNumber } from '@ethersproject/bignumber';
import { useCallback } from 'react';
import SyntheticPool from 'src/diamondhand/SyntheticPool';
import { getDisplayNumber } from 'src/utils/formatBN';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import SyntheticToken from 'src/diamondhand/SyntheticToken';
import useDiamondHand from './useDiamondHand';

const useCollectSyntheticRedemption = (pool: SyntheticPool, collateral: SyntheticToken) => {
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const diamondHand = useDiamondHand();
  return useCallback(
    async (collateralAmount: BigNumber, shareAmount: BigNumber) => {
      if (!pool) {
        return;
      }
      const formatCollateralAmount =
        collateralAmount && collateralAmount.gt(0)
          ? `${getDisplayNumber(
              collateralAmount,
              collateral?.decimals,
              6,
              false,
              false,
              false,
              true,
            )} ${collateral?.symbol}`
          : undefined;
      const formatShareAmount =
        shareAmount && shareAmount.gt(0)
          ? `${getDisplayNumber(shareAmount, 18, 6, false, false, false, true)} ${
              diamondHand?.DIAMOND?.symbol
            }`
          : undefined;

      return await handleTransactionReceipt(
        pool.collectRedemption(),
        `Collect ${formatCollateralAmount || ''} ${
          formatShareAmount && formatCollateralAmount ? 'and ' : ''
        }${formatShareAmount || ''}`,
        {
          redemption: {
            poolAddress: pool.address,
          },
        },
      );
    },
    [
      pool,
      collateral?.decimals,
      collateral?.symbol,
      diamondHand?.DIAMOND?.symbol,
      handleTransactionReceipt,
    ],
  );
};

export default useCollectSyntheticRedemption;
