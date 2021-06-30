import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import ERC20 from './ERC20';

class SyntheticToken extends ERC20 {
  public name: string;
  constructor(
    syntheticAbi: any[],
    address: string,
    provider: Signer | Provider,
    symbol: string,
  ) {
    super(address, provider, symbol, 18, syntheticAbi);
    this.info();
  }

  async info() {
    this.symbol = await this.contract.symbol();
    this.name = await this.contract.name();
  }
}

export default SyntheticToken;
