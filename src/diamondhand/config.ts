export type Configuration = {
  chainId: number;
  etherscanUrl: string;
  defaultProvider: string | string[];
  externalTokens?: { [contractName: string]: [string, number] };
  pools?: {
    collateralSymbol?: string;
    syntheticSymbol?: string;
    collateral?: string;
    pool?: string;
    dndOracle?: string;
    dTokenOracle?: string;
    foundry?: string;
  }[];
  config?: EthereumConfig;
  pollingInterval?: number;
  refreshInterval?: number;
  refreshUnclaimedInterval?: number;
  refreshGeneralInfoInterval?: number;
  maxBalanceRefresh?: number;
  maxUnclaimedRefresh?: number;
  defaultSlippageTolerance?: number;
  gasLimitMultiplier?: number;
  backendUrl?: string;
  backendDisabled?: boolean;
  excludedAddress?: string[];
  enabledChart?: boolean;
  enabledPoolInfos?: boolean;
  abis: {
    Pool: any[];
    PairOracle: any[];
    Diamond: any[];
    Treasury: any[];
    DToken: any[];
    Foundry: any[];
    TreasuryPolicy?: any[];
    FoundryFund?: any[];
    FoundryController?: any[];
    VaultProxy?: any[];
  };
  addresses: {
    Diamond: string;
    Treasury: string;
    Multicall: string;
    TreasuryPolicy?: string;
    FoundryFund?: string;
    FoundryController?: string;
    VaultProxy?: string;
  };
  admins: string[];
};

export type EthereumConfig = {
  testing: boolean;
  autoGasMultiplier: number;
  defaultConfirmations: number;
  defaultGas: string;
  defaultGasPrice: string;
  ethereumNodeTimeout: number;
};

export const defaultEthereumConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: '6000000',
  defaultGasPrice: '1000000000000',
  ethereumNodeTimeout: 10000,
};
