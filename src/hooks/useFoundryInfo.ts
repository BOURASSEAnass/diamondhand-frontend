import { useCallback } from 'react';
import { FoundryInfo } from 'src/diamondhand/Foundry';
import useDiamondHand from './useDiamondHand';

const useFoundryInfo = (foundryAddress: string, collateral: string, pool: any) => {
  const dh = useDiamondHand();

  const fetch = useCallback(async () => {
    if (!dh) {
      return;
    }
    const foundry = dh.getFoundry(foundryAddress);
    const calls: any = [
      // {
      //   contract: dh.FOUNDRY_FUND.contract,
      //   method: 'fundBalance',
      //   params: [collateral],
      // },
      {
        contract: dh.FOUNDRY_CONTROLLER.contract,
        method: 'getFoundryByAddress',
        params: [foundryAddress],
      },
      // { contract: foundry.contract, method: 'info' },
      // { contract: pool.contract, method: 'diamondToCollateralPrice' },
      // { contract: foundry.contract, method: 'withdrawLockupEpochs' },
    ];
    if (dh.myAccount) {
      calls.push(
        { contract: foundry.contract, method: 'balanceOf', params: [dh.myAccount] },
        { contract: foundry.contract, method: 'earned', params: [dh.myAccount] },
      );
    }
    const [
      // [fundBalance],
      data,
      // foundryInfo,
      // [diamondPrice],
      // [withdrawLockupEpochs],
      myBalance,
      myEarned,
    ] = await dh.multicall(calls);
    // const info: FoundryInfo = {
    //   fundBalance: fundBalance,
    //   // epoch: foundryInfo[0].toNumber(),
    //   // nextEpochPoint: foundryInfo[1].toNumber(),
    //   // epochDuration: foundryInfo[2].toNumber(),
    //   // utilizationRatio: foundryInfo[3],
    //   // stakedAmount: foundryInfo[4],
    //   diamondPrice,
    //   dailyApr: undefined,
    //   apr: undefined,
    //   allocatedAmount: data[1],
    //   withdrawLockupEpochs,
    // };
    // if (info.stakedAmount.gt(0) && diamondPrice.gt(0)) {
    //   info.dailyApr = info.allocatedAmount
    //     .mul(1e6)
    //     .mul(1e6)
    //     .mul(24 * 3600)
    //     .div(info.epochDuration)
    //     .div(diamondPrice)
    //     .div(info.stakedAmount);
    //   info.apr = info.dailyApr.mul(365);
    // }
    return {
      // info,
      balance: myBalance ? myBalance[0] : null,
      // balanceRelative: myBalance ? myBalance[0].mul(diamondPrice).div(1e6) : null,
      earned: myEarned ? myEarned[0] : null,
    };
  }, [dh, foundryAddress]);

  return fetch;
};

export default useFoundryInfo;
