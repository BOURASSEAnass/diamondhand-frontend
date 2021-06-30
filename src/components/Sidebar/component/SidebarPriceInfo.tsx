import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledRowData } from '../Sidebar';
import useModal from 'src/hooks/useModal';
import { DiamondPriceModal } from './DiamondPriceModal';
import { useGetStatistic } from 'src/api/backend-api';
import { PriceChart } from './PriceChart';
import NumberDisplay from 'src/components/Number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ExternalLinks } from 'src/config';
import { useDNDInfo } from 'src/contexts/DNDInfoProvider';

export const SidebarPriceInfo: React.FC = () => {
  const [showPriceModal] = useModal(<DiamondPriceModal />);
  const [data, setData] = useState<[number, string][]>([]);
  const getStatistic = useGetStatistic('dnd_price_usd', 'lastDay');
  const dndInfo = useDNDInfo();

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
    <StyledRowData>
      <div className="header">
        <div>
          <span>DND</span>&nbsp;
        </div>
        <p className="value">
          $<NumberDisplay value={dndInfo?.price} decimals={6} precision={2} />
        </p>
      </div>
      <PriceStatus>
        <div>
          <a className="buy" href={ExternalLinks.buyDND} target="_blank">
            Buy DND
          </a>
        </div>
        <ButtonShowChartModal onClick={showPriceModal} />
      </PriceStatus>
      <PriceChart data={data} isSmall />
    </StyledRowData>
  );
};

const PriceStatus = styled.div<{ color?: string }>`
  margin-top: 2px;
  font-size: 12px;
  margin: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  a.buy {
    text-decoration: none;
    color: ${({ theme }) => theme.color.grey[800]};
    &:hover {
      color: ${({ theme }) => theme.color.primary.main};
    }
  }
`;

const ButtonShowChartModal = styled(FontAwesomeIcon).attrs({ icon: faChartLine })`
  font-size: 16px;
  color: ${({ theme, color }) => color || theme.color.secondary};
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    opacity: 1;
    color: ${({ theme, color }) => color || theme.color.primary.main};
  }
`;
