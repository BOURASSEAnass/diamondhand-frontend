import React from 'react';
import Number from 'src/components/Number';
import TokenSymbol from 'src/components/TokenSymbol';
import styled from 'styled-components';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { Link } from 'react-router-dom';
import { SyntheticPoolInfo } from 'src/diamondhand/SyntheticPool';
import { BigNumber } from '@ethersproject/bignumber';

interface PoolListItemProps {
  poolAddress: string;
  syntheticPoolInfo: SyntheticPoolInfo;
  syntheticPrice: BigNumber;
  priceCollateralPerShare: BigNumber;
  collateralBalance: BigNumber;
}

const PoolListItem: React.FC<PoolListItemProps> = ({
  poolAddress,
  syntheticPoolInfo,
  syntheticPrice,
  priceCollateralPerShare,
  collateralBalance,
}) => {
  const diamondHand = useDiamondHand();

  return syntheticPoolInfo ? (
    <SyntheticContainer>
      <TopSynthetic>
        <TokenLogo>
          <TokenSymbol size={56} symbol={syntheticPoolInfo?.syntheticSymbol} />
        </TokenLogo>
        <TokenName>{syntheticPoolInfo?.syntheticSymbol}</TokenName>
        <TopRightSynthetic>
          <SyntheticContent>
            <RowSynthetic>
              <DataRow>
                <DataTitle>1</DataTitle>
                <DataField highlight>
                  &nbsp;{syntheticPoolInfo?.syntheticSymbol}&nbsp;=&nbsp;
                </DataField>
                <DataTitle>
                  <Number value={syntheticPrice} decimals={6} precision={4} keepZeros={false} />
                </DataTitle>
                <DataField highlight>&nbsp;{syntheticPoolInfo?.collateralSymbol}</DataField>
              </DataRow>
              <DataRow>
                <DataTitle>1</DataTitle>
                <DataField>&nbsp;{diamondHand?.DIAMOND?.symbol}&nbsp;=&nbsp;</DataField>
                <DataTitle>
                  <Number
                    value={priceCollateralPerShare}
                    decimals={6}
                    precision={4}
                    keepZeros={false}
                  />
                </DataTitle>
                <DataField>&nbsp;{syntheticPoolInfo?.collateralSymbol}</DataField>
              </DataRow>
            </RowSynthetic>
            <RowSynthetic>
              <DataRow>
                <DataField highlight>TCR&nbsp;</DataField>
                <DataTitle>
                  <Number
                    value={syntheticPoolInfo?.targetCollateralRatio}
                    percentage={true}
                    decimals={6}
                    precision={2}
                    keepZeros={false}
                  />
                  %
                </DataTitle>
              </DataRow>
              <DataRow>
                <DataField highlight>ECR&nbsp;</DataField>
                <DataTitle>
                  <Number
                    value={syntheticPoolInfo?.effectiveCollateralRatio}
                    percentage={true}
                    decimals={6}
                    precision={2}
                    keepZeros={false}
                  />
                  %
                </DataTitle>
              </DataRow>
            </RowSynthetic>
            <RowSynthetic className="collateral">
              <DataColum>
                <DataTitle highlight>
                  <Number
                    value={collateralBalance}
                    decimals={18}
                    precision={4}
                    keepZeros={false}
                  />
                  &nbsp;
                  {syntheticPoolInfo?.collateralSymbol}
                </DataTitle>
                <DataField highlight>Total Collateral</DataField>
              </DataColum>
            </RowSynthetic>
          </SyntheticContent>
        </TopRightSynthetic>
        <ButtonContainer>
          <Link to={`/pools/${poolAddress}`} className="btn btn-triangle">
            Enter
          </Link>
        </ButtonContainer>
      </TopSynthetic>
    </SyntheticContainer>
  ) : null;
};

export default PoolListItem;

const SyntheticContainer = styled.div`
  overflow: hidden;
  position: relative;
  padding: 20px 20px;
  margin-bottom: 24px;
  border: solid 3px ${({ theme }) => theme.color.primary.main};
  background: ${({ theme }) => theme.color.white};
  transition: ease-in-out 100ms;
  color: ${({ theme }) => theme.color.primary.main};
`;

const TopSynthetic = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }
  .collateral {
    width: 200px;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
      grid-column: 1/3;
      width: auto;
    }
  }
`;

const RowSynthetic = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopRightSynthetic = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  margin: 0px 60px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 10px 0px 0px 0px;
  }
`;

const TokenName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.orange[450]};
  margin-left: 10px;
`;

const SyntheticContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }
`;

const DataRow = styled.div`
  display: flex;
  align-items: center;
  margin: 3px 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const DataColum = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 10px;
    align-items: center;
  }
`;

export const DataField = styled.div<{ highlight?: boolean }>`
  font-size: ${({ highlight }) => (highlight ? '13px' : '13px')};
`;

const DataTitle = styled.div<{ highlight?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme, highlight }) => (highlight ? '#a72525' : theme.color.primary.main)};
`;

const ButtonContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 20px;
  }
`;
