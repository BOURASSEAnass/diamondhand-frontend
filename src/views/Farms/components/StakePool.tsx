import React from 'react';
import styled from 'styled-components';
import TokenSymbolMini from '../../../components/TokenSymbol/TokenSymbolMini';
import Spacer from '../../../components/Spacer';
import { numberWithCommas } from 'src/utils/formatBN';
import { StakePoolInfo } from 'src/api/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const StakePool: React.FC<{ info: StakePoolInfo }> = ({ info }) => {
  const { token1, token2, token1Percentage, earnedToken, poolAddress, data, suffix } = info;

  return (
    <StyledBank href={`https://bsc.valuedefi.io/#/vfarm/${poolAddress}`} target="_blank">
      <StyledBankIcon>
        <StyledBankIconWrapper marginRight="2px">
          <TokenSymbolMini symbol={token1} />
        </StyledBankIconWrapper>
        <StyledBankIconWrapper>
          <TokenSymbolMini symbol={token2} />
        </StyledBankIconWrapper>
      </StyledBankIcon>
      <StyledBankInfo>
        <StyledBankTitle>
          Earn <StyledBankDataUnit>{earnedToken}</StyledBankDataUnit> with {suffix || ''}
          {token1Percentage ? `${token1Percentage}%` : ''}
          {token1}-{token1Percentage ? `${100 - token1Percentage}%` : ''}
          {token2}
        </StyledBankTitle>
      </StyledBankInfo>
      <StyledBankDataRow className="tvl">
        <StyledBankDataField>TVL</StyledBankDataField>
        <StyledBankDataValue>
          <StyledBankDataUnit>$</StyledBankDataUnit>
          {data?.totalSupplyUSD ? numberWithCommas(data?.totalSupplyUSD?.toFixed(2)) : '--'}
        </StyledBankDataValue>
      </StyledBankDataRow>
      <StyledBankDataRow className="apr">
        <StyledBankDataField>APR</StyledBankDataField>
        <StyledBankDataValue>
          {data ? numberWithCommas(data?.roi?.apy.toFixed(2)) : '--'}
          <StyledBankDataUnit>%</StyledBankDataUnit>
        </StyledBankDataValue>
      </StyledBankDataRow>
      <StyledBankAction>
        ValueDefi
        <Spacer size="xs" />
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </StyledBankAction>
    </StyledBank>
  );
};

const StyledBank = styled.a`
  padding: 0;
  padding: 12px 20px;
  width: 100%;
  overflow: hidden;
  position: relative;
  border: solid 3px ${({ theme }) => theme.color.primary.main};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${({ theme }) => theme.color.blue[100]};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    max-width: 100%;
    flex-direction: column;
  }
`;

const StyledBankIcon = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
`;
const StyledBankIconWrapper = styled.div<{ marginRight?: string }>`
  display: flex;
  align-items: center;
  margin-right: ${({ marginRight }) => marginRight || '0'};
`;

const StyledBankInfo = styled.div`
  margin-left: 8px;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const StyledBankTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #746df7;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 10px;
  }
`;
const StyledBankDataRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 15px;
  margin-right: 15px;

  &.tvl {
    width: 150px;
  }

  &.apr {
    width: 80px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
    margin-right: 0;
    align-items: center;
    margin-bottom: 5px;
    margin-top: 5px;
  }
`;
const StyledBankDataField = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 5px;
`;
const StyledBankDataValue = styled.div`
  font-size: 16px;
  font-weight: 700;
`;
const StyledBankDataUnit = styled.span``;

const StyledBankAction = styled.span`
  appearance: none;
  background: transparent;
  color: #fea430;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  margin-left: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
    margin-right: 0;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;

export default StakePool;
