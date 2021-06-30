import { ContractWrapper } from './ContractWrapper';

export class FoundryController extends ContractWrapper {
  async getFoundry(foundry: string) {
    return await this.contract.getFoundry(foundry);
  }
}
