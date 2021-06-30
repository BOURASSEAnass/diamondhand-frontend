import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CountdownClock } from 'src/components/CountdownClock/CountdownClock';
import { EpochInfo } from 'src/diamondhand/Treasury';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { useDelay } from 'src/hooks/usePolling';
import styled from 'styled-components';
import { StyledRowData } from '../Sidebar';
import { ProgressBar } from './ProgressBar';

export const SidebarEpochInfo: React.FC = () => {
  const diamondHand = useDiamondHand();
  const [epochInfo, setEpochInfo] = useState<EpochInfo>();
  const [nextRefresh, setNextRefresh] = useState<number>();

  // const reloadEpoch = useCallback(async () => {
  //   const data = await diamondHand?.TREASURY.epochInfo();
  //   if (data) {
  //     setEpochInfo(data);
  //     setNextRefresh(+data.nextEpoch - Date.now());
  //   }
  // }, [diamondHand?.TREASURY]);

  // useEffect(() => {
  //   reloadEpoch();
  // }, [reloadEpoch]);

  // useDelay(reloadEpoch, nextRefresh);

  const isWaitingAllocation = useMemo(() => {
    return epochInfo?.nextEpoch < new Date();
  }, [epochInfo]);

  return (
    <StyledRowData isBorder>
      <div className="header">
        <StyleHref to="/castle" className="title">
          NEXT EPOCH
        </StyleHref>
        <div className="countDown">
          {isWaitingAllocation ? (
            <span>Awaiting for allocation</span>
          ) : (
            <CountdownClock to={epochInfo?.nextEpoch} fontSize="18px" fontWeight="bold" />
          )}
        </div>
      </div>
      <ProgressBar to={epochInfo?.nextEpoch} length={epochInfo?.epochDuration} />
    </StyledRowData>
  );
};

const StyleHref = styled(NavLink)`
  text-decoration: none;
  font-weight: 600;
  &:hover {
    color: ${(p) => p.theme.color.orange[500]};
  }
`;
