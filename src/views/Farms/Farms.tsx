import React from 'react';
import Container from 'src/components/Container';
import MiniLoader from 'src/components/MiniLoader';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { numberWithCommas } from 'src/utils/formatBN';
import styled, { useTheme } from 'styled-components';
import Page from '../../components/Page';
import StakePool from './components/StakePool';
import useVSwapPools from 'src/hooks/useVSwapPools';
import ImgMinerTVL from 'src/assets/img/icon-miner.svg';
import ImgDragonTVL from 'src/assets/img/icon-dragon.svg';
import { LoadingLogo } from 'src/components/Loading/LoadingLogo';

const Farms: React.FC = () => {
  const dh = useDiamondHand();
  const theme = useTheme();
  const { diamondPools: pools, tvl, getPoolData } = useVSwapPools();

  return (
    <Page>
      <Container size="lg">
        <StyledTVLContainer>
          <img className="miner" src={ImgMinerTVL} />
          <StyledTvlTitle>TVL in Mining Pools:</StyledTvlTitle>
          <StyledTvlNumber>
            {tvl != null ? (
              <>${numberWithCommas(tvl.toFixed(0))}</>
            ) : (
              <MiniLoader strokeWidth={2} size="24px" stroke={theme.color.white} />
            )}
          </StyledTvlNumber>
          <img className="dragon" src={ImgDragonTVL} />
        </StyledTVLContainer>
        {dh && pools ? (
          <StyledBody>
            <StakePool
              key={pools[0]?.contractAddress}
              info={{
                suffix: 'vPegSwap ',
                token1: 'dBTC',
                token2: 'BTCB',
                earnedToken: dh.DIAMOND.symbol,
                poolAddress: pools[0]?.contractAddress,
                vesting: false,
                stable: true,
                data: getPoolData(pools[0]?.contractAddress),
              }}
            />
            <StakePool
              key={pools[1]?.contractAddress}
              info={{
                suffix: 'vPegSwap ',
                token1: 'dBNB',
                token2: 'WBNB',
                earnedToken: dh.DIAMOND.symbol,
                poolAddress: pools[1]?.contractAddress,
                vesting: false,
                stable: true,
                data: getPoolData(pools[1]?.contractAddress),
              }}
            />
            <StakePool
              key={pools[4]?.contractAddress}
              info={{
                suffix: 'vPegSwap ',
                token1: 'dETH',
                token2: 'ETH',
                earnedToken: dh.DIAMOND.symbol,
                poolAddress: pools[4]?.contractAddress,
                vesting: false,
                stable: true,
                data: getPoolData(pools[4]?.contractAddress),
              }}
            />
            <StakePool
              key={pools[2]?.contractAddress}
              info={{
                token1: 'DND',
                token2: 'WBNB',
                earnedToken: dh.DIAMOND.symbol,
                poolAddress: pools[2]?.contractAddress,
                vesting: false,
                stable: true,
                data: getPoolData(pools[2]?.contractAddress),
              }}
            />
            <StakePool
              key={pools[3]?.contractAddress}
              info={{
                token1: 'IRON',
                token2: 'STEEL',
                token1Percentage: 60,
                earnedToken: dh.DIAMOND.symbol,
                poolAddress: pools[3]?.contractAddress,
                vesting: false,
                stable: true,
                data: getPoolData(pools[3]?.contractAddress),
              }}
            />
          </StyledBody>
        ) : (
          <LoadingLogo />
        )}
      </Container>
    </Page>
  );
};

const StyledBody = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  display: grid;
  grid-gap: 20px;
  justify-items: center;
  grid-template-columns: repeat(1, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTVLContainer = styled.div`
  border: solid 3px ${(p) => p.theme.color.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  padding-left: 180px;
  padding-right: 120px;
  position: relative;
  background-color: ${(p) => p.theme.color.yellow};
  color: ${(p) => p.theme.color.primary.main};
  .miner {
    width: 150px;
    position: absolute;
    left: 10px;
    bottom: 0;
  }
  .dragon {
    width: 130px;
    position: absolute;
    right: -10px;
    bottom: -10px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: 10px;
    padding-right: 10px;
    flex-direction: column;
    padding-bottom: 120px;
  }
`;

const StyledTvlTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 20px;
  margin-left: 10px;
`;

const StyledTvlNumber = styled.div`
  color: ${(p) => p.theme.color.green[100]};
  margin-left: 20px;
  font-size: 48px;
  font-weight: 700;
  -webkit-text-stroke: 1px ${(p) => p.theme.color.primary.main};
`;

export default Farms;
