import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'src/components/Container';
import Page from 'src/components/Page';
import HarvestHistory from './components/HarvestHistory';
import TreasuryTerm from './components/TreasuryTerm';
import TreasuryInfo from './components/TreasuryInfo';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import styled from 'styled-components';
import TokenSymbol from 'src/components/TokenSymbol';

export type PoolAsset = {
  collateralSymbol?: string;
  syntheticSymbol?: string;
  collateral?: string;
  pool?: string;
  dndOracle?: string;
  dTokenOracle?: string;
  foundry?: string;
};

const Treasury: React.FC = () => {
  const config = useConfiguration();
  const [asset, setAsset] = useState<PoolAsset | undefined>(undefined);

  const pools = useMemo(() => {
    if (!config) return [];
    return config.pools;
  }, [config]);

  useEffect(() => {
    if (pools?.length > 0) {
      setAsset(pools[0]);
    }
  }, [pools]);

  const selectAsset = useCallback((pool: PoolAsset) => {
    setAsset(pool);
  }, []);

  return (
    <Page>
      <Container size="homepage">
        <StyledTitle>DIAMOND TREASURY</StyledTitle>
        <StyledTreasury>
          <StyledHeader>
            <div className="icon">
              <TokenSymbol symbol={asset?.collateralSymbol} size={32} />
              <div className="symbol">{asset ? asset?.collateralSymbol : '--'}</div>
            </div>
            <StyledGroupButton>
              {pools?.map((pool) => (
                <StyledButton
                  active={pool?.collateral === asset?.collateral}
                  key={pool?.collateral}
                  onClick={() => selectAsset(pool)}
                >
                  {pool?.collateralSymbol}
                </StyledButton>
              ))}
            </StyledGroupButton>
          </StyledHeader>
          <StyledContent>
            <div className="title">Status</div>
            {asset && (
              <TreasuryInfo
                asset={asset.collateral}
                symbol={asset.collateralSymbol}
                poolAddress={asset.pool}
              />
            )}
            <div className="title">History</div>
            {asset && (
              <HarvestHistory asset={asset.collateral} symbol={asset.collateralSymbol} />
            )}
          </StyledContent>
        </StyledTreasury>
        <TreasuryTerm />
      </Container>
    </Page>
  );
};

export const StyledTitle = styled.h1`
  color: ${({ theme }) => theme.color.white};
`;

export const StyledTreasury = styled.div<{ marginTop?: string }>`
  padding: 0px 0px 14px 0px;
  border: solid 3px ${({ theme }) => theme.color.primary.main};
  background-color: ${({ theme }) => theme.color.white};
  margin-top: ${({ marginTop }) => marginTop || '0px'};
`;

export const StyledHeader = styled.div<{ background?: string }>`
  display: flex;
  align-items: center;
  padding: 12px 22px;
  border-bottom: solid 3px ${({ theme }) => theme.color.primary.main};
  background: ${({ theme, background }) => background || theme.color.blue[50]};
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary.main};
  .icon {
    display: flex;
    align-items: center;
  }
  .symbol {
    margin-left: 8px;
  }
  .button {
    margin-left: auto;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

export const StyledGroupButton = styled.div`
  display: flex;
  margin-left: auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 15px 0px 0px 0px;
  }
`;

export const StyledButton = styled.button<{ active?: boolean }>`
  padding: 6px 16px;
  background: ${({ theme, active }) => (active ? theme.color.blue[400] : 'transparent')};
  border: 2px solid ${({ theme }) => theme.color.primary.main};
  :not(:first-child) {
    border-left: none;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
  }
`;

export const StyledContent = styled.div`
  padding: 10px 0px 0px 0px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.primary.main};
  .title {
    margin-left: 22px;
    font-size: 24px;
    font-weight: bold;
    color: #a4a0fb;
    text-transform: uppercase;
  }
`;

export default Treasury;
