import { BigNumber } from '@ethersproject/bignumber';
import { ContractWrapper } from './ContractWrapper';

class PairOracle extends ContractWrapper {
  async update() {
    console.log('xxx');
    return await this.contract.safeCall.update();
  }

  async getRemaingTime() {
    const blockNumber = await this.contract.provider.getBlockNumber();
    const block = await this.contract.provider.getBlock(blockNumber);
    const coolDown = <BigNumber>await this.contract.PERIOD();
    const lastCallTime = <BigNumber>await this.contract.blockTimestampLast();
    return coolDown.add(lastCallTime).toNumber() - block.timestamp;
  }

  async getCooldownTime() {
    try {
      return await this.contract
        .PERIOD()
        .then((x: BigNumber) => x.toNumber())
        .catch(() => {
          console.warn('Get cooldown time failed');
          return 0;
        });
    } catch {
      return 0;
    }
  }
}

export default PairOracle;
