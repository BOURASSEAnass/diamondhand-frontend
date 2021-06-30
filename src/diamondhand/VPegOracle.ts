import { BigNumber } from '@ethersproject/bignumber';
import { ContractWrapper } from './ContractWrapper';

class VPegOracle extends ContractWrapper {
  async update() {
    return await this.contract.safeCall.update();
  }

  async getRemaingTime() {
    const blockNumber = await this.contract.provider.getBlockNumber();
    const block = await this.contract.provider.getBlock(blockNumber);
    const epochPeriod = <BigNumber>await this.contract.epochPeriod();
    const blockTimestampLast = <BigNumber>await this.contract.blockTimestampLast();
    return epochPeriod.add(blockTimestampLast).toNumber() - block.timestamp;
  }
}

export default VPegOracle;
