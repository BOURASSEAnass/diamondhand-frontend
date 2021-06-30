import { ContractWrapper } from './ContractWrapper';

export class TreasuryPolicy extends ContractWrapper {
  async getPolicy(asset: string) {
    return await this.contract.getPolicy(asset);
  }
}
