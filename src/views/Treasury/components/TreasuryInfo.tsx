import React, { useEffect, useState } from 'react';
import useFund from 'src/hooks/useFund';
import usePolicy from 'src/hooks/usePolicy';
import styled from 'styled-components';
import Number from '../../../components/Number';
import { BigNumber } from '@ethersproject/bignumber';

interface TreasuryInfoProps {
  asset: string;
  symbol: string;
  poolAddress: string;
}

const TreasuryInfo: React.FC<TreasuryInfoProps> = ({ asset, symbol }) => {
  const policy = usePolicy(asset);
  const fund = useFund(asset);
  const [collateralBalance] = useState<BigNumber | undefined>(undefined);

  return (
    <StyledGrid>
      <div>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Minting Pool Balance:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            {collateralBalance ? (
              <Number value={collateralBalance} decimals={18} precision={4} />
            ) : (
              '--'
            )}
            &nbsp;{symbol}
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Vault Balance:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number value={fund?.vaultBalance} decimals={18} precision={4} />
            &nbsp;{symbol}
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Foundry Rewards Balance:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number value={fund?.foundryFundBalance} decimals={18} precision={4} />
            &nbsp;{symbol}
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Profit Sharing for Foundry:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number
              value={policy?.profitSharingRatio}
              percentage={true}
              decimals={6}
              precision={2}
            />
            %
          </MonitorBoxItemValue>
        </MonitorBoxItem>
      </div>
      <div>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Invested Collateral Ratio:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number
              value={policy?.utilizationRatio}
              percentage={true}
              decimals={6}
              precision={2}
            />
            %
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Effective Reserve Collateral Ratio:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number
              value={fund?.reservedCollateralRatio}
              decimals={6}
              precision={2}
              percentage={true}
            />
            %
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Reserve Threshold Ratio:&nbsp;</MonitorBoxItemLabel>
          <MonitorBoxItemValue>
            <Number
              value={policy?.resevedThreshold}
              percentage={true}
              decimals={6}
              precision={2}
            />
            %
          </MonitorBoxItemValue>
        </MonitorBoxItem>
        <MonitorBoxItem>
          <MonitorBoxItemLabel>Above threshold:&nbsp;</MonitorBoxItemLabel>
          {fund && (
            <MonitorBoxStatus negative={!fund?.aboveThreshold}>
              {!fund?.aboveThreshold ? 'No' : 'Yes'}
            </MonitorBoxStatus>
          )}
        </MonitorBoxItem>
      </div>
    </StyledGrid>
  );
};

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: dashed 1px ${({ theme }) => theme.color.primary.main};
  margin: 0px 22px 30px 22px;
  padding-bottom: 20px;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MonitorBoxItem = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
`;

export const MonitorBoxItemLabel = styled.span`
  margin-right: 2px;
`;

export const MonitorBoxItemValue = styled.span`
  font-weight: bold;
`;

export const MonitorBoxStatus = styled.span<{ negative?: boolean }>`
  color: ${({ theme, negative }) => (negative ? theme.color.danger : theme.color.success)};
  font-weight: bold;
`;

export default TreasuryInfo;
