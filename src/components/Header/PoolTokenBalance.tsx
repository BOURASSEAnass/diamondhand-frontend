import React from 'react';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import useSyntheticPool from 'src/hooks/useSyntheticPool';
import useSyntheticPoolInfo from 'src/hooks/useSyntheticPoolInfo';
import useSyntheticToken from 'src/hooks/useSyntheticToken';
import Amount from '../Amount';
import TokenSymbol from '../TokenSymbol';
import {
  addDiamondHandToken,
  StyledBalanceWrapper,
  StyledTokenName,
  StyledValue,
} from './AccountTokenBalances';

interface PoolTokenBalanceProps {
  address: string;
  symbol: string;
}

const PoolTokenBalance: React.FC<PoolTokenBalanceProps> = ({ address, symbol }) => {
  const pool = useSyntheticPool(address);
  const { syntheticPoolInfo: poolInfo } = useSyntheticPoolInfo(pool);
  const syntheticToken = useSyntheticToken(poolInfo?.synthetic, poolInfo?.syntheticSymbol);
  const syntheticBalance = useTokenBalance(syntheticToken);

  return (
    <div>
      <StyledBalanceWrapper>
        <TokenSymbol symbol={symbol} size={54} />
        <StyledTokenName onClick={() => addDiamondHandToken(syntheticToken)}>
          {symbol}
        </StyledTokenName>
        <StyledValue>
          <Amount
            value={syntheticBalance}
            decimals={syntheticToken?.decimals}
            precision={6}
            keepZeros={false}
            noUnits={true}
          />
        </StyledValue>
      </StyledBalanceWrapper>
    </div>
  );
};

export default PoolTokenBalance;
