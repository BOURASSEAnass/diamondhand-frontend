import { Configuration } from './config';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import { Overrides } from '@ethersproject/contracts';
import { BaseProvider, JsonRpcProvider, Provider } from '@ethersproject/providers';
import ERC20 from './ERC20';
import Diamond from './Diamond';
import SyntheticPool from './SyntheticPool';
import { Foundry } from './Foundry';
import SyntheticToken from './SyntheticToken';
import { Treasury } from './Treasury';
import PairOracle from './PairOracle';
import { Call, multicall } from './multicall';
import { TreasuryPolicy } from './TreasuryPolicy';
import { FoundryFund } from './FoundryFund';
import { FoundryController } from './FoundryController';
import { VaultProxy } from './VaultProxy';

/**
 * An API module of Diamond Hand contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class DiamondHand {
  myAccount: string;
  private defaultProvider: BaseProvider;
  private signer?: Signer;
  private config: Configuration;
  private externalTokens: { [name: string]: ERC20 } = {};
  private syntheticTokens: { [address: string]: SyntheticToken } = {};
  private pools: Record<string, SyntheticPool> = {};
  private foundries: Record<string, Foundry> = {};
  private pairOracles: Record<string, PairOracle> = {};
  private treasury: Treasury;
  private treasuryPolicy: TreasuryPolicy;
  private foundryFund: FoundryFund;
  private foundryController: FoundryController;
  private diamond: Diamond;
  vaultProxy: VaultProxy;
  multicall: (calls: Call[]) => Promise<any[][]>;

  constructor(cfg: Configuration, provider: JsonRpcProvider) {
    const { abis, externalTokens, addresses } = cfg;
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.diamond = new Diamond(abis.Diamond, addresses.Diamond, provider, 'DND');
    this.treasury = new Treasury(abis.Treasury, addresses.Treasury, provider);
    this.treasuryPolicy = new TreasuryPolicy(
      abis.TreasuryPolicy,
      addresses.TreasuryPolicy,
      provider,
    );
    this.foundryFund = new FoundryFund(abis.FoundryFund, addresses.FoundryFund, provider);
    this.foundryController = new FoundryController(
      abis.FoundryController,
      addresses.FoundryController,
      provider,
    );
    this.vaultProxy = new VaultProxy(abis.VaultProxy, addresses.VaultProxy, provider);
    this.config = cfg;
    this.defaultProvider = provider;
    this.initPools();
    this.multicall = multicall.bind(null, provider, addresses.Multicall);
  }

  private initPools() {
    if (this.config.pools) {
      const poolAbi = this.config.abis.Pool;
      this.config.pools.forEach((p) => {
        const address = p.pool;
        const pool = new SyntheticPool(poolAbi, address, this.provider);
        this.pools[address] = pool;
      });
    }
  }

  public get provider(): Signer | Provider {
    return this.signer || this.defaultProvider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: JsonRpcProvider, account: string) {
    this.signer = provider.getSigner(account);
    this.myAccount = account;
    this.reconnect();
  }

  lock() {
    this.signer = null;
    this.myAccount = null;
    this.reconnect();
  }

  private reconnect() {
    this.diamond.connect(this.provider);
    this.treasury.connect(this.provider);
    this.treasuryPolicy.connect(this.provider);
    this.foundryFund.connect(this.provider);
    this.foundryController.connect(this.provider);
    Object.keys(this.pools).forEach((addr) => this.pools[addr].connect(this.provider));
    Object.keys(this.foundries).forEach((addr) => this.foundries[addr].connect(this.provider));
    Object.keys(this.syntheticTokens).forEach((addr) =>
      this.syntheticTokens[addr].connect(this.provider),
    );
    Object.keys(this.externalTokens).forEach((addr) =>
      this.externalTokens[addr].connect(this.provider),
    );
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  get DIAMOND() {
    return this.diamond;
  }

  get TREASURY() {
    return this.treasury;
  }

  get POOLS() {
    return this.pools;
  }

  get TREASURY_POLICY() {
    return this.treasuryPolicy;
  }

  get FOUNDRY_FUND() {
    return this.foundryFund;
  }

  get FOUNDRY_CONTROLLER() {
    return this.foundryController;
  }

  getPool(address: string) {
    if (this.pools[address]) {
      return this.pools[address];
    }

    const poolAbi = this.config.abis.Pool;
    const pool = new SyntheticPool(poolAbi, address, this.provider);
    this.pools[address] = pool;
    return pool;
  }

  getExternalToken(address: string, symbol: string, decimals: number) {
    if (this.externalTokens[symbol]) {
      return this.externalTokens[symbol];
    }

    const token = new ERC20(address, this.provider, symbol, decimals);
    this.externalTokens[address] = token;
    return token;
  }

  getFoundry(address: string) {
    if (this.foundries[address]) {
      return this.foundries[address];
    }

    const abi = this.config.abis.Foundry;
    const foundry = new Foundry(abi, address, this.provider);
    this.foundries[address] = foundry;
    return foundry;
  }

  getOldFoundry(address: string) {
    const abi = this.config.abis.Foundry;
    const foundry = new Foundry(abi, address, this.provider);
    return foundry;
  }

  getSynthetic(address: string, symbol: string) {
    if (this.syntheticTokens[address]) {
      return this.syntheticTokens[address];
    }
    const abi = this.config.abis.DToken;
    const token = new SyntheticToken(abi, address, this.provider, symbol);
    this.syntheticTokens[address] = token;
    return token;
  }

  getPairOracles(address: string) {
    if (this.pairOracles[address]) {
      return this.pairOracles[address];
    }

    const abi = this.config.abis.PairOracle;
    const oracle = new PairOracle(abi, address, this.provider);
    this.pairOracles[address] = oracle;
    console.log(oracle);
    return oracle;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }
}
