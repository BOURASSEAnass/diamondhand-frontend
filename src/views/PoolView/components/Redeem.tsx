import { faArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useModal from 'src/hooks/useModal';
import useSyntheticPool from 'src/hooks/useSyntheticPool';
import useSyntheticPoolInfo from 'src/hooks/useSyntheticPoolInfo';
import useSyntheticToken from 'src/hooks/useSyntheticToken';
import styled from 'styled-components';
import Card from 'src/components/Card';
import CardBody from 'src/components/CardBody';
import {
  FormButtonsContainer,
  FormOutput,
  FormRow,
  FormSeparator,
  FormToken,
} from 'src/components/Form';
import Number from 'src/components/Number';
import TokenInput from 'src/components/TokenInput';
import TokenSymbol from 'src/components/TokenSymbol';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import { useGetSlippageTolerance } from 'src/state/application/hooks';
import theme from 'src/theme';
import { PoolContentLoader } from './PoolContentLoader';
import ButtonRedeem from './ButtonRedeem';
import CollectRedemption from './CollectRedemption';
import RedeemConfirmationModal from './RedeemConfirmationModal';
import { DataRow, RowItemLabel, RowItemValue } from '../PoolView';

interface RedeemProps {
  poolAddress: string;
}

const Redeem: React.FC<RedeemProps> = ({ poolAddress }) => {
  const slippage = useGetSlippageTolerance();
  const diamondHand = useDiamondHand();
  const pool = useSyntheticPool(poolAddress);
  const { syntheticPoolInfo: poolInfo, syntheticPrice } = useSyntheticPoolInfo(pool);
  const syntheticToken = useSyntheticToken(poolInfo?.synthetic, poolInfo?.syntheticSymbol);
  const collateral = useSyntheticToken(poolInfo?.collateral, poolInfo?.collateralSymbol);

  const [syntheticAmount, setSyntheticAmount] = useState(BigNumber.from(0));
  const [minOutputCollateralAmount, setMinOutputCollateralAmount] = useState(BigNumber.from(0));
  const [minOutputShareAmount, setMinOutputShareAmount] = useState(BigNumber.from(0));

  const syntheticTokenBalance = useTokenBalance(syntheticToken);
  const shareBalance = useTokenBalance(diamondHand?.DIAMOND);
  const collateralBalance = useTokenBalance(collateral);
  const refInputSynthetic = useRef(null);

  const isFullCollateralize = useMemo(
    () => poolInfo?.effectiveCollateralRatio.gte(10 ** 6),
    [poolInfo?.effectiveCollateralRatio],
  );

  const isExceededBalance = useMemo(() => {
    if (syntheticTokenBalance && syntheticAmount) {
      return syntheticAmount.gt(syntheticTokenBalance);
    }
    return false;
  }, [syntheticTokenBalance, syntheticAmount]);

  const updateInputAmount = useCallback((amount: BigNumber) => {
    console.log('updateInputAmount', amount);
  }, []);

  const resetInputs = useCallback(() => {
    refInputSynthetic?.current?.resetInput(undefined);
    setSyntheticAmount(undefined);
    setMinOutputCollateralAmount(undefined);
    setMinOutputShareAmount(undefined);
  }, [refInputSynthetic]);

  const onConfirmed = useCallback(() => {
    resetInputs();
  }, [resetInputs]);

  const [showConfirm] = useModal(
    <RedeemConfirmationModal
      poolInfo={poolInfo}
      collateral={collateral}
      synthetic={syntheticToken}
      syntheticAmount={syntheticAmount}
      minOutputCollateralAmount={minOutputCollateralAmount}
      minOutputShareAmount={minOutputShareAmount}
      slippage={slippage}
      syntheticPrice={syntheticPrice}
      onConfirmed={onConfirmed}
    />,
  );

  return !poolInfo || !collateral || !syntheticToken ? (
    <PoolContentLoader />
  ) : (
    <>
      <CollectRedemption pool={pool} collateral={collateral} />
      <Card animationDuration={0.3} background={'transparent'} padding={'0px'} border={'none'}>
        <CardBody>
          <FormRow>
            <div className="row-header">
              <FormRowLeftTitle>Input</FormRowLeftTitle>
              {syntheticTokenBalance && (
                <FormRowBalance>
                  Balance:{' '}
                  <Number
                    value={syntheticTokenBalance}
                    decimals={syntheticToken.decimals}
                    precision={6}
                  />
                </FormRowBalance>
              )}
            </div>
            <div className="row-input">
              <TokenInput
                ref={refInputSynthetic}
                token={syntheticToken}
                hasError={isExceededBalance}
                decimals={syntheticToken?.decimals}
                precision={6}
                onChange={updateInputAmount}
              />
              <FormToken>
                <TokenSymbol size={32} symbol={syntheticToken.symbol} noBorder />
                <span>{syntheticToken.symbol}</span>
              </FormToken>
            </div>
          </FormRow>

          <FormSeparator>
            <FontAwesomeIcon icon={faArrowDown} color={theme.color.orange[500]} />
          </FormSeparator>

          <FormRow>
            <div className="row-header">
              <FormRowLeftTitle>
                Output {collateral?.symbol} &middot;{' '}
                <Number
                  percentage={true}
                  value={poolInfo?.effectiveCollateralRatio}
                  decimals={6}
                  precision={6}
                />
                %
              </FormRowLeftTitle>
              <FormRowBalance>
                Balance:{' '}
                <Number
                  value={collateralBalance}
                  decimals={collateral?.decimals}
                  precision={6}
                />
              </FormRowBalance>
            </div>
            <div className="row-input">
              <FormOutput>
                <Number
                  value={minOutputCollateralAmount}
                  decimals={collateral?.decimals || 18}
                  precision={6}
                />
              </FormOutput>
              <FormToken>
                <FormToken>
                  <TokenSymbol size={32} symbol={collateral.symbol} noBorder />
                  <span>{collateral.symbol}</span>
                </FormToken>
              </FormToken>
            </div>
          </FormRow>

          {!isFullCollateralize && (
            <FormSeparator>
              <FontAwesomeIcon icon={faPlus} color={theme.color.primary.light} />
            </FormSeparator>
          )}

          {!isFullCollateralize && (
            <FormRow>
              <div className="row-header">
                <FormRowLeftTitle>
                  Ouput {diamondHand.DIAMOND.symbol} &middot;{' '}
                  <Number
                    percentage={true}
                    value={BigNumber.from(1e6).sub(poolInfo?.effectiveCollateralRatio)}
                    decimals={6}
                    precision={6}
                  />
                  %
                </FormRowLeftTitle>
                <FormRowBalance>
                  Balance:{' '}
                  <Number
                    value={shareBalance}
                    decimals={diamondHand?.DIAMOND?.decimals}
                    precision={6}
                  />
                </FormRowBalance>
              </div>
              <div className="row-input">
                <FormOutput>
                  <Number value={minOutputShareAmount} decimals={18} precision={6} />
                </FormOutput>
                <FormToken>
                  <TokenSymbol size={32} symbol={diamondHand.DIAMOND.symbol} noBorder />
                  <span>{diamondHand.DIAMOND.symbol}</span>
                </FormToken>
              </div>
            </FormRow>
          )}
          <FormButtonsContainer>
            <ButtonRedeem redeem={showConfirm} />
          </FormButtonsContainer>
        </CardBody>
      </Card>
      <Footer>
        <SyntheticContent>
          <DataRow>
            <RowItemLabel>Redemption fee&nbsp;</RowItemLabel>
            <RowItemValue>
              <Number
                value={poolInfo.redemptionFee}
                decimals={6}
                percentage={true}
                precision={2}
                keepZeros={false}
              />
              %
            </RowItemValue>
          </DataRow>
          <DataRow>
            <RowItemLabel>Slippage&nbsp;</RowItemLabel>
            <RowItemValue>{slippage * 100}%</RowItemValue>
          </DataRow>
        </SyntheticContent>
      </Footer>
    </>
  );
};

export default Redeem;

const FormRowLeftTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
`;

const FormRowBalance = styled.div`
  margin-left: auto;
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
`;

const Footer = styled.div`
  display: flex;
  padding-top: 20px;
`;

const SyntheticContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 20px;
    margin-bottom: -30px;
    overflow-y: auto;
    padding-bottom: 10px;
    flex-wrap: wrap;
  }
`;
