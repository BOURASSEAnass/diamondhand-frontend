import { useWeb3React } from '@web3-react/core';
import { BigNumber } from '@ethersproject/bignumber';
import { useEffect, useRef, useState } from 'react';
import SyntheticPool from 'src/diamondhand/SyntheticPool';
import { useBlockNumber } from '../state/application/hooks';

const numberOfBlockNumberToSkip = 10;

const useUnclaimedSynthetic = (pool: SyntheticPool) => {
  const { account } = useWeb3React();
  const [unclaimedCollateral, setUnclaimedCollateral] = useState<BigNumber>(BigNumber.from(0));
  const [unclaimedShare, setUnclaimedShare] = useState<BigNumber>(BigNumber.from(0));
  const [isLoading, setIsLoading] = useState(false);
  const blockNumber = useBlockNumber();
  const lastFetchedBlockNumber = useRef<number>();

  useEffect(() => {
    lastFetchedBlockNumber.current = null;
  }, [account]);

  useEffect(() => {
    const fetchUnclaimed = async () => {
      setIsLoading(true);
      setUnclaimedCollateral(await pool.getRedeemCollateralBalances(account));
      setUnclaimedShare(await pool.getRedeemShareBalances(account));
      setIsLoading(false);
    };

    if (
      !blockNumber ||
      (lastFetchedBlockNumber.current &&
        blockNumber - lastFetchedBlockNumber.current < numberOfBlockNumberToSkip)
    ) {
      return;
    }

    if (pool && account) {
      lastFetchedBlockNumber.current = blockNumber;
      fetchUnclaimed();
    }
  }, [account, blockNumber, pool]);

  return {
    unclaimedCollateral,
    unclaimedShare,
    isLoading,
  };
};

export default useUnclaimedSynthetic;
