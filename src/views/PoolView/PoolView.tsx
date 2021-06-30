import React, { useCallback, useEffect, useState } from 'react';
import Number from 'src/components/Number';
import TokenSymbol from 'src/components/TokenSymbol';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useSyntheticPool from 'src/hooks/useSyntheticPool';
import useSyntheticPoolInfo from 'src/hooks/useSyntheticPoolInfo';
import useSyntheticToken from 'src/hooks/useSyntheticToken';
import styled from 'styled-components';
import MintSyntheticPoll from './components/Mint';
import Redeem from './components/Redeem';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import Container from 'src/components/Container';
import useQuery from 'src/hooks/useQuery';
import Page from 'src/components/Page';

type BankAction = 'mint' | 'redeem';

const PoolView: React.FC = () => {
  const query = useQuery();
  const history = useHistory();
  const { poolAddress } = useParams<{ poolAddress: string }>();
  const syntheticPool = useSyntheticPool(poolAddress);
  const { syntheticPoolInfo, syntheticPrice, priceCollateralPerShare } = useSyntheticPoolInfo(
    syntheticPool,
  );
  const syntheticToken = useSyntheticToken(
    syntheticPoolInfo?.synthetic,
    syntheticPoolInfo?.syntheticSymbol,
  );
  const collateral = useSyntheticToken(
    syntheticPoolInfo?.collateral,
    syntheticPoolInfo?.collateralSymbol,
  );
  const diamondHand = useDiamondHand();
  const [action, setAction] = useState<BankAction>('mint');

  useEffect(() => {
    const action = query?.get('action');
    switch (action) {
      case 'mint':
      case 'redeem':
        setAction(action);
        break;
      default:
        history.replace(`?action=mint`);
        break;
    }
  }, [diamondHand, history, query]);

  const selectAction = useCallback(
    (action: BankAction) => {
      setAction(action);
      history.push(`?action=${action}`);
    },
    [history],
  );

  return (
    <Page>
      <Container>
        <CloseButtonContainer>
          <Link className="link" to="/">
            Pools
          </Link>
          {' / '}
          {syntheticToken?.symbol}
        </CloseButtonContainer>
        <SyntheticContainer>
          <TopSynthetic>
            <TopLeftSynthetic>
              <TokenLogo>
                {syntheticToken && (
                  <TokenSymbol size={52} symbol={syntheticToken?.symbol}></TokenSymbol>
                )}
              </TokenLogo>
              <DataColum>
                <TokenNameContainer>
                  <TokenName>{syntheticToken?.symbol}</TokenName>
                  <div>
                    <RowItemLabel>Total:</RowItemLabel>&nbsp;
                    <RowItemValue>
                      <Number
                        value={syntheticPoolInfo?.collateralBalance}
                        decimals={18}
                        precision={4}
                        keepZeros={false}
                      />
                      &nbsp;
                      {collateral?.symbol}
                    </RowItemValue>
                  </div>
                </TokenNameContainer>
              </DataColum>
            </TopLeftSynthetic>
            <TopRightSynthetic>
              <Switch>
                <SwitchItem active={action === 'mint'} onClick={() => selectAction('mint')}>
                  Mint
                </SwitchItem>
                <SwitchItem active={action === 'redeem'} onClick={() => selectAction('redeem')}>
                  Redeem
                </SwitchItem>
              </Switch>
            </TopRightSynthetic>
          </TopSynthetic>
          <BottomSynthetic>
            <Form>
              <FormControl highlight={action === 'mint'}>
                <MintSyntheticPoll poolAddress={syntheticPool?.address} />
              </FormControl>
              <FormControl highlight={action === 'redeem'}>
                <Redeem poolAddress={syntheticPool?.address} />
              </FormControl>
            </Form>
            <SyntheticContent>
              <DataRow>
                <RowItemValue>1</RowItemValue>
                <RowItemLabel>&nbsp;{syntheticToken?.symbol}&nbsp;=&nbsp;</RowItemLabel>
                <RowItemValue>
                  <Number value={syntheticPrice} decimals={6} precision={6} keepZeros={false} />
                </RowItemValue>
                <RowItemLabel>&nbsp;{collateral?.symbol}</RowItemLabel>
              </DataRow>
              <DataRow>
                <RowItemLabel>TCR&nbsp;</RowItemLabel>
                <RowItemValue>
                  <Number
                    value={syntheticPoolInfo?.targetCollateralRatio}
                    percentage={true}
                    decimals={6}
                    precision={2}
                    keepZeros={false}
                  />
                  %
                </RowItemValue>
              </DataRow>
            </SyntheticContent>
            <SyntheticContent>
              <DataRow>
                <RowItemValue>1</RowItemValue>
                <RowItemLabel>&nbsp;{diamondHand?.DIAMOND?.symbol}&nbsp;=&nbsp;</RowItemLabel>
                <RowItemValue>
                  <Number
                    value={priceCollateralPerShare}
                    decimals={6}
                    precision={6}
                    keepZeros={false}
                  />
                </RowItemValue>
                <RowItemLabel>&nbsp;{collateral?.symbol}</RowItemLabel>
              </DataRow>
              <DataRow>
                <RowItemLabel>ECR&nbsp;</RowItemLabel>
                <RowItemValue>
                  <Number
                    value={syntheticPoolInfo?.effectiveCollateralRatio}
                    percentage={true}
                    decimals={6}
                    precision={2}
                    keepZeros={false}
                  />
                  %
                </RowItemValue>
              </DataRow>
            </SyntheticContent>
          </BottomSynthetic>
        </SyntheticContainer>
      </Container>
    </Page>
  );
};

export default PoolView;

const SyntheticContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border: 3px solid ${(p) => p.theme.color.primary.main};
  width: 480px;
  margin: auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const TopSynthetic = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  background-color: ${(p) => p.theme.color.blue[50]};
  padding: 15px 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.primary.main};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: 15px 10px;
  }
`;

const BottomSynthetic = styled.div`
  padding: 15px 20px;
`;

const TokenLogo = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50%;
`;

const TopRightSynthetic = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: flex-start;
    position: relative;
  }
`;

const TopLeftSynthetic = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const TokenNameContainer = styled.div`
  margin-left: 8px;
`;

const TokenName = styled.div`
  font-size: 28px;
  line-height: 1;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary.main};
  margin-bottom: 2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 1px;
    font-size: 24px;
  }
`;

export const SyntheticContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 20px;
    margin-bottom: -30px;
    overflow-y: auto;
    padding-bottom: 10px;
    flex-wrap: wrap;
  }
`;

export const DataRow = styled.div`
  margin-bottom: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* padding: 0px 15px; */
  }
`;

const DataColum = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const DataFieldSymbol = styled.span<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.light};
  line-height: 18px;
`;

export const RowItemLabel = styled.span<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
  line-height: 18px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
  }
`;

export const RowItemValue = styled.span<{ highlight?: boolean }>`
  color: ${({ theme }) => theme.color.primary.main};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: 700;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
  }
`;

const Switch = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.color.white};
  border: solid 1 px ${({ theme }) => theme.color.primary.main};
  height: 30px;
  margin-right: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0px;
  }
`;

const SwitchItem = styled.button<{ active?: boolean }>`
  padding: 12px 8px;
  appearance: none;
  border: none;
  color: ${({ theme }) => theme.color.primary.main};
  background: ${({ active, theme }) => (active ? theme.color.blue[400] : theme.color.white)};
  text-transform: uppercase;
  width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid ${({ theme }) => `${theme.color.primary.main}66`};
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.color.grey[800]};
  }

  &:first-of-type {
    margin-right: ${(p) => (p.active ? '-2px' : '0px')};
  }

  &:last-of-type {
    margin-left: ${(p) => (p.active ? '-2px' : '0px')};
  }
`;

const Form = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0px 0px;
  }
`;

const FormControl = styled.div<{ highlight?: boolean }>`
  position: ${({ highlight }) => (highlight ? 'relative' : 'absolute')};
  top: ${({ highlight }) => (highlight ? '0px' : '-9999px')};
  left: ${({ highlight }) => (highlight ? '0px' : '-9999px')};
`;

const CloseButtonContainer = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.color.grey[200]};
  font-size: 16px;
  .link {
    text-decoration: none;
  }
`;
