import { Provider, TransactionResponse } from '@ethersproject/providers';
import fromUnixTime from 'date-fns/fromUnixTime';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import { ContractWrapper } from './ContractWrapper';
import SyntheticToken from './SyntheticToken';

class SyntheticPool extends ContractWrapper {
  constructor(abi: any[], address: string, provider: Signer | Provider) {
    super(abi, address, provider);
  }

  async calcCollateralBalance() {
    return (await this.contract.calcCollateralBalance()) as [BigNumber, boolean];
  }

  async collateralBalance() {
    return (await this.contract.collateralBalance()) as BigNumber;
  }

  static readInfo(info: any[]) {
    return <SyntheticPoolInfo>{
      ceiling: info[0] as BigNumber,
      collateralBalance: info[1] as BigNumber,
      unclaimedPoolCollateral: info[2] as BigNumber,
      unclaimedPoolDiamond: info[3] as BigNumber,
      mintingFee: info[4] as BigNumber,
      redemptionFee: info[5] as BigNumber,
      mintPaused: info[6],
      redeemPaused: info[7],
      collateral: info[8],
      synthetic: info[9],
      collateralSymbol: info[10],
      syntheticSymbol: info[11],
      targetCollateralRatio: info[12] as BigNumber,
      effectiveCollateralRatio: info[13] as BigNumber,
    };
  }

  async getInfo() {
    const info = await this.contract.info();
    return SyntheticPool.readInfo(info);
  }

  async diamondToCollateralPrice() {
    return (await this.contract.diamondToCollateralPrice()) as BigNumber;
  }

  async dTokenToCollateralPrice() {
    return (await this.contract.dTokenToCollateralPrice()) as BigNumber;
  }

  calcMintOutput(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collateralAmount: BigNumber,
    shareAmount: BigNumber,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: {
      collateralRatio: BigNumber;
      sharePrice: BigNumber;
      mintingFee: BigNumber;
      slippage: number;
      missingDecimals: number;
    },
  ) {
    return { minOutput: BigNumber.from(0), mintingFee: BigNumber.from(0) };
  }

  calcRedeemOutput(
    syntheticAmount: BigNumber,
    params: {
      collateralRatio: BigNumber;
      sharePrice: BigNumber;
      redemptionFee: BigNumber;
      slippage: number;
      collateral: SyntheticToken;
    },
  ) {
    const { collateralRatio, sharePrice, redemptionFee, slippage, collateral } = params;
    return {
      minOutputCollateral: BigNumber.from(0),
      minOutputShare: BigNumber.from(0),
      redemptionFee: BigNumber.from(0),
    };
  }

  async collectRedemption(): Promise<TransactionResponse> {
    return await this.contract.safeCall.collectRedemption();
  }

  async getRedeemShareBalances(address: string) {
    return await this.contract.redeem_diamond_balances(address);
  }

  async getRedeemCollateralBalances(address: string) {
    return await this.contract.redeem_collateral_balances(address);
  }

  async getOracles() {
    const oracleDtoken = await this.contract.oracleDToken();
    const oracleDiamond = await this.contract.oracleDiamond();

    return {
      dToken: oracleDtoken,
      diamond: oracleDiamond,
    };
  }

  async getNextRefreshCrTime(): Promise<Date> {
    const lastRefresh: BigNumber = await this.contract.last_refresh_cr_timestamp();
    const cooldown: BigNumber = await this.contract.refresh_cooldown();
    return fromUnixTime(lastRefresh.add(cooldown).toNumber());
  }

  async refreshCollateralRatio() {
    return await this.contract.safeCall.refreshCollateralRatio();
  }

  async toggleTcr() {
    return await this.contract.safeCall.toggleCollateralRatio();
  }

  async toggleEcr() {
    return await this.contract.safeCall.toggleEffectiveCollateralRatio();
  }

  async tcrPaused() {
    return await this.contract.target_collateral_ratio_paused();
  }

  async ecrPaused() {
    return await this.contract.effective_collateral_ratio_paused();
  }
}

export default SyntheticPool;

export type SyntheticPoolInfo = {
  ceiling: BigNumber;
  collateralBalance: BigNumber;
  unclaimedPoolCollateral: BigNumber;
  unclaimedPoolDiamond: BigNumber;
  mintingFee: BigNumber;
  redemptionFee: BigNumber;
  mintPaused: boolean;
  redeemPaused: boolean;
  collateral: string;
  synthetic: string;
  collateralSymbol: string;
  syntheticSymbol: string;
  targetCollateralRatio: BigNumber;
  effectiveCollateralRatio: BigNumber;
};
