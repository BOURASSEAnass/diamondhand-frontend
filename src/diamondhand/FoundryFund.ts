import { ContractWrapper } from './ContractWrapper';

export class FoundryFund extends ContractWrapper {
  async fundBalance(asset: string) {
    return await this.contract.fundBalance(asset);
  }
}
