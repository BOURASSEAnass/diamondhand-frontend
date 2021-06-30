import React from 'react';
import { useDNDInfo } from 'src/contexts/DNDInfoProvider';
import useModal from 'src/hooks/useModal';
import styled from 'styled-components';
import NumberDisplay from '../Number';
import { DiamondPriceModal } from '../Sidebar/component/DiamondPriceModal';
import TokekSymbol from '../TokenSymbol';

export const BtnDiamondPriceMobile: React.FC = () => {
  const dndInfo = useDNDInfo();
  const [showPriceModal] = useModal(<DiamondPriceModal />);

  if (!dndInfo) {
    return null;
  }
  return (
    <StyledButton onClick={showPriceModal}>
      <TokekSymbol symbol="DND" size={32} />
      <StylePrice>
        $<NumberDisplay value={dndInfo.price} precision={0} keepZeros decimals={6} />
      </StylePrice>
    </StyledButton>
  );
};

const StylePrice = styled.span`
  margin-left: 5px;
  color: ${(p) => p.theme.color.green[100]};
  font-size: 20px;
  font-weight: 700;
  -webkit-text-stroke: 0.2px ${(p) => `${p.theme.color.primary.main}33`};
`;

const StyledButton = styled.div`
  margin-right: 5px;
  white-space: nowrap;
  display: flex;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
