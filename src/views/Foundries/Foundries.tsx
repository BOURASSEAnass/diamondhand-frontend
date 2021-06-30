import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Container from '../../components/Container';
import { Foundry } from './components/Foundry';
import { useFoundries } from './hooks/useFoundries';
import useDiamondHand from 'src/hooks/useDiamondHand';
import TokenSymbol from 'src/components/TokenSymbol';
import Page from 'src/components/Page';
import { BigNumber } from '@ethersproject/bignumber';
import useOldFoundryInfo from 'src/hooks/useOldFoundryInfo';

export const Foundries: React.FC = () => {
  const foundries = useFoundries();
  const diamondHand = useDiamondHand();

  const { fetch: fetchOldBtc, unstake: unstakeBtc } = useOldFoundryInfo(
    '0x4cd17a0E2a7984DF23529Cf2fa78710C6845F5c9',
  );
  const { fetch: fetchOldBnb, unstake: unstakeBnb } = useOldFoundryInfo(
    '0x9E327F36f6333777B5C709306efAb69F4f06B44d',
  );
  const [dndOnOldBnb, setDndOnOldBnb] = useState<BigNumber>();
  const [dndOnOldBtc, setDndOnOldBtc] = useState<BigNumber>();

  useEffect(() => {
    if (!diamondHand || !diamondHand?.myAccount) {
      return;
    }
    Promise.all([fetchOldBnb(), fetchOldBtc()]).then(([oldBnbBal, oldBtcBla]) => {
      setDndOnOldBnb(oldBnbBal);
      setDndOnOldBtc(oldBtcBla);
    });
  }, [diamondHand, diamondHand?.myAccount, fetchOldBnb, fetchOldBtc]);

  return (
    <Page>
      <Container size="lg">
        <Header>
          <TokenSymbol symbol={diamondHand?.DIAMOND.symbol} size={80} />
          <HeaderContent>
            <Title>Stake your Diamond</Title>
            <Subtitle>Deposit {diamondHand?.DIAMOND.symbol} and earn Rewards</Subtitle>
          </HeaderContent>
        </Header>
        <StyledMigrationMessage>
          The Castle was permanently closed. Please unstake your DND and join{' '}
          <a href="https://app.iron.finance/farms">our new farms on IRON Finance's website</a>.
        </StyledMigrationMessage>
        <EpochInfoContainer>
          <EpochDisplay>Closed</EpochDisplay>
          <CoundownDisplay>Closed</CoundownDisplay>
        </EpochInfoContainer>
        {dndOnOldBtc && dndOnOldBtc.gt(BigNumber.from(0)) && (
          <Old>
            We have detected that you have not unstaked your DND from the old BTC castle.
            <br />
            Please <a onClick={unstakeBtc}>click here</a> to exit and claim pending rewards
          </Old>
        )}
        {dndOnOldBnb && dndOnOldBnb.gt(BigNumber.from(0)) && (
          <Old>
            We have detected that you have not unstaked your DND from the old BNB castle.
            <br />
            Please <a onClick={unstakeBnb}>click here</a> to exit and claim pending rewards
          </Old>
        )}
        <div>
          {foundries?.map((t) => (
            <Foundry
              address={t.address}
              key={t.address}
              collateralSymbol={t.collateralSymbol}
              syntheticSymbol={t.syntheticSymbol}
            ></Foundry>
          ))}
        </div>
      </Container>
    </Page>
  );
};

const Old = styled.div`
  background-color: ${(p) => p.theme.color.red[200]};
  color: ${(p) => p.theme.color.white};
  padding: 10px;
  margin-bottom: 20px;
  a {
    cursor: pointer;
    text-decoration: underline;
    font-weight: 700;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const HeaderContent = styled.div`
  flex-grow: 1;
  margin-left: 20px;
`;

const EpochInfoContainer = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-gap: 20px;
  justify-items: center;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Countdown = styled.div`
  font-size: 40px;
  font-family: ${(p) => p.theme.font.heading};
  font-weight: 400;
  color: ${(p) => p.theme.color.primary.main};
  margin-left: auto;
`;

const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 0;
  margin-top: 0;
  color: ${(p) => p.theme.color.white};
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const Subtitle = styled.div`
  font-size: 18px;
  margin-bottom: 0;
  margin-top: 0;
  color: ${(p) => p.theme.color.white};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const BoxDisplay = styled.div`
  color: ${(p) => p.theme.color.primary.main};
  font-family: ${(p) => p.theme.font.heading};
  font-size: 28px;
  flex: 1;
  width: 100%;
  border: solid 3px ${(p) => p.theme.color.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 0 20px;
`;

const EpochDisplay = styled(BoxDisplay)`
  background-color: ${(p) => p.theme.color.yellow};
  font-size: 28px;
`;
const CoundownDisplay = styled(BoxDisplay)`
  background-color: #f69963;
  justify-content: center;
`;
const CountdownLabel = styled.span`
  font-size: 14px;
  color: #6e4242;
  flex: 1;
`;

const StyledMigrationMessage = styled(BoxDisplay)`
  background-color: #ffbbe2;
  font-family: ${(p) => p.theme.font.sans};
  display: block;
  font-size: 16px;
  margin: auto;
  font-weight: 500;
  margin-bottom: 20px;
  height: auto;
  padding: 15px 20px;
  a {
    font-weight: 700;
  }
`;
