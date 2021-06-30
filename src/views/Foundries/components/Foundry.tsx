import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TokenSymbol from 'src/components/TokenSymbol';
import styled, { DefaultTheme } from 'styled-components';
import { darken } from 'polished';
import { ModalStake } from './ModalStake';
import { useFoundry } from '../hooks/useFoundry';
import useDiamondHand from 'src/hooks/useDiamondHand';
import NumberDisplay from 'src/components/Number';
import { BigNumber } from '@ethersproject/bignumber';
import useModal from 'src/hooks/useModal';
import { ModalWithdraw } from './ModalWithdraw';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import useTryConnect from 'src/hooks/useTryConnect';
import { useBlockNumber } from 'src/state/application/hooks';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useFoundryInfo from 'src/hooks/useFoundryInfo';

export type FoundryProps = {
  address: string;
  collateralSymbol: string;
  syntheticSymbol: string;
};

export const Foundry: React.FC<FoundryProps> = ({
  address,
  collateralSymbol,
  syntheticSymbol,
}) => {
  const foundry = useFoundry(address);
  const dh = useDiamondHand();
  const config = useConfiguration();
  const [poolAddress, collateral] = useMemo(() => {
    if (!config) {
      return;
    }
    const poolConfig = config.pools.find((t) => t.foundry === address);
    return [poolConfig?.pool, poolConfig.collateral];
  }, [config, address]);
  const pool = useMemo(() => {
    if (!dh || !poolAddress) {
      return;
    }
    return dh.getPool(poolAddress);
  }, [dh, poolAddress]);
  const fetchFoundryInfo = useFoundryInfo(address, collateral, pool);
  const [showStake] = useModal(<ModalStake foundry={foundry} token={collateralSymbol} />);
  const [balance, setBalance] = useState<BigNumber>();
  const [earned, setEarned] = useState<BigNumber>();
  const [showWidthdraw] = useModal(<ModalWithdraw foundry={foundry} staked={balance} />);
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const { tryConnect } = useTryConnect();
  const lastRefreshBlock = useRef<number>();
  const blockNumber = useBlockNumber();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      const res = await fetchFoundryInfo();
      if (mounted) {
        setBalance(res.balance);
        setEarned(res.earned);
      }
    };

    if (!lastRefreshBlock.current || blockNumber - lastRefreshBlock.current > 10) {
      fetch();
      lastRefreshBlock.current = blockNumber;
    }

    return () => {
      mounted = false;
    };
  }, [blockNumber, lastRefreshBlock, fetchFoundryInfo]);

  const claim = useCallback(() => {
    handleTransactionReceipt(foundry.claimReward(), 'Claim reward');
  }, [foundry, handleTransactionReceipt]);

  const ButtonConnect = useMemo(() => {
    return (
      <InlineButton color="primary" onClick={tryConnect}>
        Connect
      </InlineButton>
    );
  }, [tryConnect]);

  return (
    <FoundryContainer>
      <Heading>
        <HeadingItem>
          <span className="label">APR</span>
          <span className="value">--</span>
        </HeadingItem>
        <HeadingItem>
          <span className="label">Allocation</span>
          <span className="value">--</span>
        </HeadingItem>
        <HeadingItem>
          <span className="label"> Staked</span>
          <span className="value">--</span>
        </HeadingItem>
        <HeadingItem>
          <span className="label">TVL</span>
          <span className="value">
            0 <strong>{collateralSymbol}</strong>
          </span>
        </HeadingItem>
      </Heading>
      <Body>
        <div className="content">
          <TokenExpansion>
            <TokenSymbol size={54} symbol={syntheticSymbol} />
            <div className="text-content">
              <TokenName>{syntheticSymbol}</TokenName>
              <div>
                Daily APR: <span className="text-value">--</span>{' '}
              </div>
            </div>
          </TokenExpansion>
          <Amount color="blue">
            <div className="icon-content">
              <TokenSymbol size={40} symbol={collateralSymbol} noBorder />
            </div>
            <div className="text-content">
              <div>
                <span className="value">
                  <NumberDisplay value={earned} decimals={18} precision={6} />
                </span>{' '}
                <strong>{collateralSymbol}</strong>
              </div>
              <span>
                Estimated earning <strong>0{collateralSymbol}</strong>
              </span>
              <div>
                {dh?.myAccount
                  ? earned &&
                    earned.gt(BigNumber.from(0)) && (
                      <InlineButton onClick={claim} color="success">
                        Claim reward
                      </InlineButton>
                    )
                  : ButtonConnect}
              </div>
            </div>
          </Amount>
          <Amount color="yellow">
            <div className="icon-content">
              <TokenSymbol size={40} symbol={dh?.DIAMOND?.symbol} noBorder />
            </div>
            <div className="text-content">
              <div style={{ whiteSpace: 'nowrap' }}>
                <span className="value">
                  <NumberDisplay value={balance} precision={6} decimals={18} />
                </span>{' '}
                <strong>{dh?.DIAMOND?.symbol}</strong>
                <span className="info">
                  <>&nbsp;=&nbsp; 0{collateralSymbol}</>
                  <>&nbsp;=&nbsp; 0 %</>
                </span>
              </div>
              <span>
                Can unstake from epoch <strong>0</strong>
              </span>
              <div>
                {dh?.myAccount ? (
                  <>
                    <InlineButton onClick={showStake} color="success">
                      Stake
                    </InlineButton>
                    &nbsp;&nbsp;
                    <InlineButton onClick={showWidthdraw} color="success">
                      Unstake
                    </InlineButton>
                  </>
                ) : (
                  ButtonConnect
                )}
              </div>
            </div>
          </Amount>
        </div>
      </Body>
    </FoundryContainer>
  );
};

const FoundryContainer = styled.div`
  border: solid 3px ${(p) => p.theme.color.primary.main};
  margin-bottom: 20px;
`;

const Heading = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5px;
  background-color: ${(p) => p.theme.color.teal[200]};
  color: ${(p) => p.theme.color.primary.main};
  border-bottom: solid 1px ${(p) => p.theme.color.primary.main};
  padding: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const HeadingItem = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.grey[750]};
  .value {
    margin-left: 10px;
    font-weight: bold;
    color: ${({ theme }) => theme.color.primary.main};
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  background-color: ${(p) => p.theme.color.white};
  .content {
    color: ${(p) => p.theme.color.primary.main};
    display: flex;
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      flex-direction: column;
      align-items: center;
    }
  }
  span {
    font-size: 13px;
    text-align: center;
    color: ${({ theme }) => theme.color.grey[750]};
  }
  span.foot-note {
    margin-top: 5px;
    color: ${({ theme }) => theme.color.grey[600]};
  }
`;

const TokenExpansion = styled.div`
  display: flex;
  width: 36%;
  padding: 16px 5px;
  margin: 0 5px;
  position: relative;
  &:first-child {
    width: 24%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 100%;
    width: 100%;
    &:first-child {
      width: 100%;
    }
  }

  .text-value {
    color: ${(p) => p.theme.color.green[600]};
    font-weight: 600;
  }

  .text-content {
    margin-left: 10px;
    font-size: 14px;
  }
`;

const TokenName = styled.div`
  color: ${(p) => p.theme.color.orange[450]};
  font-weight: 600;
  font-size: 24px;
`;

const Amount = styled.div<{ color: 'blue' | 'yellow' }>`
  display: flex;
  align-items: flex-start;
  width: 33.3%;
  padding: 10px 5px;
  margin: 0 5px;
  position: relative;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 100%;
    width: 100%;
  }

  &:after {
    z-index: -2;
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(p) =>
      p.color === 'blue' ? p.theme.color.primary.main : p.theme.color.orange[500]};
    clip-path: polygon(
      15px 0,
      100% 0,
      100% calc(100% - 15px),
      calc(100% - 15px) 100%,
      0 100%,
      0 15px
    );
  }

  &::before {
    z-index: -1;
    content: '';
    position: absolute;
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    top: 1px;
    left: 1px;
    bottom: 1px;
    right: 1px;
    background: ${(p) =>
      p.color === 'blue'
        ? darken(0.5, p.theme.color.primary.main)
        : darken(0.45, p.theme.color.orange[500])};
    clip-path: polygon(
      15px 0,
      100% 0,
      100% calc(100% - 15px),
      calc(100% - 15px) 100%,
      0 100%,
      0 15px
    );
  }

  .text-content {
    margin-left: 10px;
  }

  .icon-content {
    display: flex;
    flex-direction: column;
    p {
      background: ${(p) =>
        p.color === 'blue' ? p.theme.color.orange[400] : p.theme.color.orange[500]};
      margin: 0px;
      padding: 0px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
  }

  .value {
    color: ${(p) => p.theme.color.primary.main};
    font-weight: 600;
    font-size: 20px;
  }

  .info {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }

  strong {
    font-size: 14px;
    color: ${(p) => p.theme.color.grey[750]};
    font-weight: 600;
  }

  span {
    font-size: 13px;
    text-align: center;
    color: ${({ theme }) => theme.color.grey[750]};
  }
`;

const getColor = (
  theme: DefaultTheme,
  color: 'success' | 'primary' | 'danger' | 'secondary',
) => {
  switch (color) {
    case 'primary':
      return theme.color.primary.main;
    case 'success':
      return theme.color.green[600];
    case 'danger':
      return theme.color.red[600];
    case 'secondary':
      return theme.color.secondary;
  }
};

const InlineButton = styled.button<{ color: 'success' | 'primary' | 'danger' | 'secondary' }>`
  padding: 0px 0;
  background-color: transparent;
  font-weight: bold;
  border: none;
  color: ${(p) => getColor(p.theme, p.color)};
  display: inline-block;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.sans};
  text-decoration: underline;
  &:disabled {
    cursor: not-allowed;
    color: ${(p) => getColor(p.theme, 'secondary')};
  }
  &:hover:not(:disabled) {
    color: ${(p) => getColor(p.theme, 'primary')};
  }
`;
