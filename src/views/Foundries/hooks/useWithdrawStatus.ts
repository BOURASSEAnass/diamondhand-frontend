import { useEffect, useState } from 'react';
import { Foundry } from 'src/diamondhand/Foundry';
import useDiamondHand from 'src/hooks/useDiamondHand';

interface WithdrawStatus {
  canWithdraw?: boolean;
  canWithdrawEpoch?: number;
}

export const useWithdrawStatus = (foundry: Foundry) => {
  const diamondHand = useDiamondHand();
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus>({});

  useEffect(() => {
    if (!foundry || !diamondHand?.myAccount) {
      return;
    }
    Promise.all([
      foundry.canWithdraw(diamondHand?.myAccount),
      foundry.canWithdrawEpoch(diamondHand?.myAccount),
    ]).then(([canWithdraw, canWithdrawEpoch]) => {
      setWithdrawStatus({
        canWithdraw,
        canWithdrawEpoch,
      });
    });
  }, [foundry, diamondHand?.myAccount]);

  return withdrawStatus;
};
