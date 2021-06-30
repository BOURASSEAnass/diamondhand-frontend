import React from 'react';
import styled, { useTheme } from 'styled-components';
import { StyledHeader, StyledTreasury } from '../Treasury';
import icTerm from '../../../assets/img/ic-term.svg';

const TreasuryTerm: React.FC = () => {
  const theme = useTheme();
  return (
    <StyledTreasury marginTop="24px">
      <StyledHeader background={theme.color.blue[400]}>TERMS</StyledHeader>
      <StyledNotes>
        <ul>
          <li>
            <span className="term">Invested Collateral Ratio: </span>
            <div className="content">
              The percentage of idle collateral the protocol using to invest into the vault
            </div>
          </li>
          <li>
            <span className="term">Effective Reserve Collateral Ratio: </span>
            <div className="content">
              The current percentage of reserve collateral can be used for redemption
            </div>
          </li>
          <li>
            <span className="term">Reserve Threshold Ratio: </span>
            <div className="content">
              The threshold which if the effective reserve collateral ratio fall below it, the
              invested collaterals will be recalled to rebalance
            </div>
          </li>
          <li>
            <span className="term">Profit Sharing for Foundry: </span>
            <div className="content">
              The percentage of vault profits distributed to the Foundry for staking rewards.
              The rest is put back into the protocol to increase the Effective Collateral Ratio.
            </div>
          </li>
        </ul>
      </StyledNotes>
    </StyledTreasury>
  );
};

const StyledNotes = styled.div`
  font-size: 16px !important;
  ul {
    list-style-image: url(${icTerm});
  }
  ul li {
    margin-bottom: 12px;
    .term,
    .content {
      display: inline;
    }
    .term {
      font-weight: bold;
      padding-left: 5px;
    }
  }
`;

export default TreasuryTerm;
