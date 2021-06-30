import React, { useMemo } from 'react';
import { TokenIcons } from 'src/config';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import ERC20 from 'src/diamondhand/ERC20';
import useDiamondHand from 'src/hooks/useDiamondHand';
import styled from 'styled-components';
import Amount from '../Amount';
import TokenSymbol from '../TokenSymbol';
import PoolTokenBalance from './PoolTokenBalance';

const AccountTokenBalances: React.FC = () => {
  const config = useConfiguration();
  const diamondHand = useDiamondHand();
  const shareBalance = useTokenBalance(diamondHand?.DIAMOND);

  const pools = useMemo(() => {
    if (!config?.pools) return [];
    return Object.values(config?.pools);
  }, [config]);

  return (
    <div>
      <StyledBalanceWrapper>
        <TokenSymbol symbol={diamondHand?.DIAMOND?.symbol} size={54} />
        <StyledTokenName onClick={() => addDiamondHandToken(diamondHand?.DIAMOND)}>
          {diamondHand?.DIAMOND?.symbol}
        </StyledTokenName>
        <StyledValue>
          <Amount
            value={shareBalance}
            decimals={18}
            precision={6}
            keepZeros={false}
            noUnits={true}
          />
        </StyledValue>
      </StyledBalanceWrapper>
      {pools?.map(({ pool, syntheticSymbol }) => (
        <PoolTokenBalance key={pool} address={pool} symbol={syntheticSymbol} />
      ))}
    </div>
  );
};

export const addToken = (
  address: string,
  symbol: string,
  decimals: number,
  image?: string,
): void => {
  window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: address,
        symbol: symbol.slice(0, 6),
        decimals: decimals,
        image: image,
      },
    },
  });
};

export const addDiamondHandToken = async (token: ERC20): Promise<unknown> => {
  const image = TokenIcons[token.symbol];
  return await addToken(token.address, token.symbol, token.decimals, image);
};

export const StyledBalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 18px 28px 0px 28px;
  border-bottom: dashed 1px ${({ theme }) => theme.color.grey[400]};
  padding-bottom: 14px;
`;

export const StyledValue = styled.div`
  color: ${(props) => props.theme.color.orange[500]};
  font-size: 20px;
  font-family: ${(props) => props.theme.font.monospace};
  font-weight: bold;
  margin-left: auto;
`;
export const StyledTokenName = styled.a`
  margin-left: 15px;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.color.primary.main};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default AccountTokenBalances;
