import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractWrapper } from './ContractWrapper';

export class Foundry extends ContractWrapper {
  constructor(abi: any[], address: string, signer: Signer | Provider) {
    super(abi, address, signer);
  }

  async earned(address: string) {
    return (await this.contract.earned(address)) as BigNumber;
  }

  async withdraw(amount: BigNumber) {
    return await this.contract.safeCall.withdraw(amount);
  }

  async exit() {
    return await this.contract.safeCall.exit();
  }

  async stake(amount: BigNumber) {
    return await this.contract.safeCall.stake(amount);
  }

  async pool(): Promise<string> {
    return await this.contract.pool();
  }

  async balanceOf(address: string): Promise<BigNumber> {
    return await this.contract.balanceOf(address);
  }

  async claimReward() {
    return await this.contract.safeCall.claimReward();
  }

  async canWithdraw(address: string) {
    return await this.contract.canWithdraw(address);
  }

  async canWithdrawEpoch(address: string) {
    const withdrawLockupEpochs = await this.contract.withdrawLockupEpochs();
    const blacksmithInfo = await this.contract.blacksmiths(address);
    const epochTimerStart = blacksmithInfo.epochTimerStart;
    return parseInt(epochTimerStart.add(withdrawLockupEpochs).toString());
  }
}

export type FoundryInfo = {
  fundBalance: BigNumber;
  epoch: number;
  diamondPrice: BigNumber;
  allocatedAmount: BigNumber;
  dailyApr: BigNumber;
  apr: BigNumber;
  withdrawLockupEpochs: BigNumber;
};
