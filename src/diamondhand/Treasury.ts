import { BigNumber } from '@ethersproject/bignumber';
import fromUnixTime from 'date-fns/fromUnixTime';
import { ContractWrapper } from './ContractWrapper';

export class Treasury extends ContractWrapper {}

export type EpochInfo = {
  epoch: number;
  nextEpoch: Date;
  epochDuration: number;
};
