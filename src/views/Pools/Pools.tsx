import React, { useMemo } from 'react';
import Container from 'src/components/Container';
import styled from 'styled-components';
import Page from '../../components/Page';
import PoolListItem from './components/PoolListItem';
import ImgMinerTVL from 'src/assets/img/ic-miner-home.svg';
import ImgDragonTVL from 'src/assets/img/ic-dragon-home.svg';
import BgTvl from 'src/assets/img/bg-tvl-home.svg';
import TokenDataTable from './components/TokenDataTable';
import { useTotalValueLocked } from 'src/api/backend-api';
import { useMulticalPoolInfo } from './hooks/useMulticallPoolInfo';
import { numberWithCommas } from 'src/utils/formatBN';

const Pools: React.FC = () => {
  const totalValueLocked = useTotalValueLocked();
  const poolList = useMulticalPoolInfo();
  const tvl = useMemo(() => {
    return totalValueLocked ? numberWithCommas(totalValueLocked.toFixed(0)) : '';
  }, [totalValueLocked]);

  return (
    <Page home>
      <Container size="lg">
        <PageHeader>
          <StyledTVLContainer>
            <StyledTvlTitle>Total Value Locked</StyledTvlTitle>
            <StyledTvlNumber>{!totalValueLocked ? '--' : <>${tvl}</>}</StyledTvlNumber>
            <img className="miner" src={ImgMinerTVL} />
            <img className="dragon" src={ImgDragonTVL} />
          </StyledTVLContainer>
          <StyledDataTable>
            <TokenDataTable list={poolList} />
          </StyledDataTable>
        </PageHeader>
        <PoolList>
          {poolList?.map((item) => (
            <PoolListItem key={item.address} poolAddress={item.address} {...item} />
          ))}
        </PoolList>
      </Container>
    </Page>
  );
};

export default Pools;

const PoolList = styled.div`
  margin-top: 32px;
`;

const PageHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const StyledDataTable = styled.div`
  width: 100%;
  min-height: 240px;
  flex-shrink: 0;
  border: solid 3px ${(p) => p.theme.color.primary.main};
  background-color: #e7faff;
`;

const StyledTVLContainer = styled.div`
  flex: 50%;
  flex-shrink: 0;
  border: solid 3px ${(p) => p.theme.color.primary.main};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 25px;
  background-color: ${(p) => p.theme.color.yellow};
  background-image: url(${BgTvl});
  background-position: center bottom;
  background-size: auto;
  background-repeat: no-repeat;
  color: ${(p) => p.theme.color.primary.main};
  position: relative;
  height: 240px;
  img.miner {
    width: 115px;
    height: auto;
    position: absolute;
    bottom: 0;
    right: 5px;
    display: block;
  }
  img.dragon {
    position: absolute;
    display: block;
    left: -8px;
    width: 125px;
    bottom: -10px;
    height: auto;
  }
`;

const StyledTvlTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 20px;
`;

const StyledTvlNumber = styled.div`
  color: ${(p) => p.theme.color.green[100]};
  font-size: 48px;
  font-weight: 700;
  -webkit-text-stroke: 1px ${(p) => p.theme.color.primary.main};
`;
