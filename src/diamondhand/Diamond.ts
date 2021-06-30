import { Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import ERC20 from './ERC20';

class Diamond extends ERC20 {
  constructor(abi: any[], address: string, provider: Signer | Provider, symbol: string) {
    super(address, provider, symbol, 18, abi);
  }

  async devFund() {
    return await this.contract.devFund();
  }

  async getStartTime() {
    const startTime = <BigNumber>await this.contract.startTime();
    return startTime.toNumber();
  }

  async getEndTime() {
    const endTime = <BigNumber>await this.contract.endTime();
    return endTime.toNumber();
  }

  async getDevFundLastClaimed() {
    const devFundLastClaimed = <BigNumber>await this.contract.safeCall.devFundLastClaimed();
    return devFundLastClaimed.toNumber();
  }

  async getUnclaimedDevFund() {
    return await this.contract.unclaimedDevFund();
  }

  async claimRewards() {
    return await this.contract.safeCall.claimDevFundRewards();
  }
}

export default Diamond;
