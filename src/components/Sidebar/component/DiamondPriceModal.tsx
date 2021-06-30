import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal, { ModalCloseButton } from 'src/components/Modal';
import useDiamondHand from 'src/hooks/useDiamondHand';
import TokenSymbol from 'src/components/TokenSymbol';
import { useGetStatistic } from 'src/api/backend-api';
import { Period } from 'src/api/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PriceChart } from './PriceChart';
import NumberDisplay from 'src/components/Number';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDNDInfo } from 'src/contexts/DNDInfoProvider';

export interface DiamondPriceModalProps {
  onDismiss?: () => void;
}

const periods = [
  {
    key: 'lastDay' as Period,
    value: 'DAY',
  },
  {
    key: 'lastWeek' as Period,
    value: 'WEEK',
  },
  {
    key: 'lastMonth' as Period,
    value: 'MONTH',
  },
  {
    key: 'lastYear' as Period,
    value: 'YEAR',
  },
];

export const DiamondPriceModal: React.FC<DiamondPriceModalProps> = ({ onDismiss }) => {
  const diamondHand = useDiamondHand();
  const [period, setPeriod] = useState<Period>('lastDay');
  const [rawData, setData] = useState<[number, string][]>([]);
  const dndInfo = useDNDInfo();
  const getStatistic = useGetStatistic('dnd_price_usd', period);

  useEffect(() => {
    let mounted = true;
    getStatistic().then((res) => {
      if (mounted) {
        setData(res);
      }
    });

    return () => {
      mounted = false;
    };
  }, [getStatistic]);

  return (
    <Modal size="lg" padding="0">
      <ModalCloseButton onClick={onDismiss}>
        <FontAwesomeIcon icon={faTimes} />
      </ModalCloseButton>
      <StyledHeader>
        <TokenSymbol symbol={diamondHand?.DIAMOND?.symbol} size={86} />
        <StyledHeaderInfo>
          <AccountNumber>{diamondHand?.DIAMOND?.symbol}</AccountNumber>
          <StyledPrice>
            1 DIAMOND = $
            {dndInfo ? (
              <NumberDisplay value={dndInfo.price} decimals={6} precision={2} />
            ) : (
              '--'
            )}
          </StyledPrice>
        </StyledHeaderInfo>
        <StyledOption>
          {periods.map((item) => (
            <StyledOptionItem
              key={item.key}
              onClick={() => setPeriod(item.key)}
              isActive={item.key === period}
            >
              {item.value}
            </StyledOptionItem>
          ))}
        </StyledOption>
      </StyledHeader>
      <StyledContent>
        {rawData?.length ? (
          <PriceChart data={rawData} />
        ) : (
          <Loader>
            <FontAwesomeIcon icon={faSpinner} spin />
          </Loader>
        )}
      </StyledContent>
    </Modal>
  );
};

const StyledHeader = styled.div`
  display: flex;
  padding: 18px 24px;
  background: ${({ theme }) => theme.color.blue[50]};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 10px;
    flex-wrap: wrap;
  }
`;

const StyledHeaderInfo = styled.div`
  flex: 1;
  margin-left: 20px;
  align-items: center;
`;

const AccountNumber = styled.h3`
  margin: 0px;
  font-size: 32px;
  color: ${({ theme }) => theme.color.primary.main};
`;

const StyledPrice = styled.p`
  margin: 6px 0px 0px 0px;
  font-size: 16px;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledOption = styled.div`
  display: flex;
  align-self: center;
  border: solid 1px ${({ theme }) => theme.color.primary.main};
  flex-basis: 40%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-basis: 100%;
    width: 100%;
    margin-top: 10px;
  }
`;

const StyledOptionItem = styled.button<{ isActive: boolean }>`
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.color.blue[400] : 'transparent'};
  color: ${({ theme }) => theme.color.primary.main};
  border: 1px solid ${({ theme }) => theme.color.primary.main};
  appearance: none;
  cursor: pointer;
  font-size: 16px;
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: 600;
  flex-grow: 1;
  flex-shrink: 0;
  &:hover {
    background-color: ${(props) => props.theme.color.primary.main};
    color: ${(props) => props.theme.color.grey[200]};
  }
`;

const StyledContent = styled.div`
  padding: 20px 24px 32px 14px;
`;

const Loader = styled.div`
  padding: 20px 0;
  text-align: center;
  color: ${(p) => p.theme.color.primary.main};
`;
