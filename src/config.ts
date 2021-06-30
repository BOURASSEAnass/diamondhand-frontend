import { Configuration } from './diamondhand/config';
import deploymentMainnet from './diamondhand/deployments/deployments.mainnet.json';

const configurations: { [env: string]: Configuration } = {
  mainnet: {
    chainId: 56,
    etherscanUrl: 'https://bscscan.com',
    defaultProvider: 'https://bsc-dataseed.binance.org',
    externalTokens: {
      BTCB: ['0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', 18],
      BNB: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18],
      ETH: ['0x2170ed0880ac9a755fd29b2688956bd959f933f8', 18],
      ADA: ['0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', 18],
      DOT: ['0x7083609fce4d1d8dc0c979aab8c869ea2c873402', 18],
    },
    pools: [
      {
        collateralSymbol: 'BTCB',
        syntheticSymbol: 'dBTC',
        collateral: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
        pool: deploymentMainnet.Pool_dBTC.address,
        dndOracle: deploymentMainnet.Oracle_DND_BTCB.address,
        dTokenOracle: deploymentMainnet.Oracle_dBTC_BTCB.address,
        foundry: deploymentMainnet.Foundry_dBTC.address,
      },
    ],
    pollingInterval: 5 * 1000,
    refreshInterval: 10 * 1000,
    refreshUnclaimedInterval: 15 * 1000,
    refreshGeneralInfoInterval: 5 * 60 * 1000,
    defaultSlippageTolerance: 0.001,
    gasLimitMultiplier: 1.2,
    maxBalanceRefresh: 1000000,
    maxUnclaimedRefresh: 5,
    backendUrl: 'https://api.iron.finance',
    backendDisabled: false,
    enabledChart: true,
    enabledPoolInfos: true,
    abis: {
      Pool: deploymentMainnet.Pool_dBTC.abi,
      Diamond: deploymentMainnet.Diamond.abi,
      Treasury: deploymentMainnet.Treasury.abi,
      PairOracle: deploymentMainnet.PairOracle_DND_BNB.abi,
      DToken: deploymentMainnet.dBTC.abi,
      Foundry: deploymentMainnet.Foundry_dBTC.abi,
      VaultProxy: deploymentMainnet.VaultProxy.abi,
      TreasuryPolicy: deploymentMainnet.TreasuryPolicy.abi,
      FoundryFund: deploymentMainnet.FoundryFund.abi,
      FoundryController: deploymentMainnet.FoundryController.abi,
    },
    addresses: {
      Diamond: deploymentMainnet.Diamond.address,
      Treasury: deploymentMainnet.Treasury.address,
      Multicall: deploymentMainnet.Multicall.address,
      TreasuryPolicy: deploymentMainnet.TreasuryPolicy.address,
      FoundryFund: deploymentMainnet.FoundryFund.address,
      FoundryController: deploymentMainnet.FoundryController.address,
      VaultProxy: deploymentMainnet.VaultProxy.address,
    },
    admins: [],
  },
};

export const ExternalLinks = {
  twitter: 'https://twitter.com/IronFinance',
  codes: 'https://github.com/ironfinance',
  discord: 'https://discord.gg/HuekxzYj3p',
  medium: 'https://medium.com/@ironfinance',
  telegram: 'https://t.me/ironfinance',
  buyDND:
    'https://exchange.pancakeswap.finance/#/swap?inputCurrency=BNB&outputCurrency=0x34ea3f7162e6f6ed16bd171267ec180fd5c848da',
};

export const HelpTexts = {
  mintFee: 'The fee users will give when they mint new IRON',
  redemptionFee: 'The fee users will give when they redeem IRON',
  poolCeiling: 'The total amount of collateral can be deposited into a pool',
  poolBalance: 'The amount of collateral was deplosited into a pool at the moment',
  availabelToMint: 'The amount of collateral left before it reaches Pool Ceiling',
  rateRedeem: 'Redeeming IRON is recommended when the price is under $1',
  rateMint: 'Minting IRON is recommended when the price is above $1',
};

const env: string = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'mainnet';

const GATrackingCodes: Record<string, string> = {
  mainnet: '',
};

export const GATrackingCode = GATrackingCodes[env];

export const TokenIcons: { [key: string]: string } = {
  DND: 'https://ironfi.s3.amazonaws.com/images/DND.png',
  dBTC: 'https://ironfi.s3.amazonaws.com/images/DBTC.png',
  dBNB: 'https://ironfi.s3.amazonaws.com/images/DBNB.png',
  dETH: 'https://ironfi.s3.amazonaws.com/images/DETH.png',
};

export const getDefaultConfiguration = () => {
  // config used when no ethereum detected
  return configurations['mainnet'];
};
