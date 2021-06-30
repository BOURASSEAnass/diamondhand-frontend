import { useCallback } from 'react';
import useDiamondHand from './useDiamondHand';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useOldFoundryInfo = (foundryAddress: string) => {
  const dh = useDiamondHand();
  const handle = useHandleTransactionReceipt();

  const fetch = useCallback(async () => {
    if (!dh || !dh.myAccount) {
      return;
    }
    const foundry = dh.getOldFoundry(foundryAddress);
    const _balance = await foundry.balanceOf(dh.myAccount);
    return _balance;
  }, [dh, foundryAddress]);

  const unstake = useCallback(async () => {
    if (!dh || !dh.myAccount) {
      return;
    }
    const foundry = dh.getOldFoundry(foundryAddress);
    await handle(foundry.exit(), 'Exit from old Foundry');
  }, [dh, foundryAddress, handle]);

  return { fetch, unstake };
};

export default useOldFoundryInfo;
