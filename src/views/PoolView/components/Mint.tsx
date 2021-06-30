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
import ButtonMintSynthetic from './ButtonMint';
import MintConfirmationModal from './MintConfirmationModal';
import { DataRow, RowItemLabel, RowItemValue } from '../PoolView';
import { ExternalLinks } from 'src/config';

const PRECISION = BigNumber.from(1e6);

interface MintProps {
  poolAddress: string;
}

const Mint: React.FC<MintProps> = ({ poolAddress }) => {
  const slippage = useGetSlippageTolerance();
  const diamondHand = useDiamondHand();
  const pool = useSyntheticPool(poolAddress);
  const {
    syntheticPoolInfo: poolInfo,
    priceCollateralPerShare,
    syntheticPrice,
  } = useSyntheticPoolInfo(pool);
  const syntheticToken = useSyntheticToken(poolInfo?.synthetic, poolInfo?.syntheticSymbol);
  const collateral = useSyntheticToken(poolInfo?.collateral, poolInfo?.collateralSymbol);
  const [collateralAmount, setCollateralAmount] = useState<BigNumber>(BigNumber.from(0));
  const [shareAmount, setShareAmount] = useState<BigNumber>(BigNumber.from(0));
  const [minOutputAmount, setMinOutputAmount] = useState<BigNumber>();
  const syntheticTokenBalance = useTokenBalance(syntheticToken);
  const shareBalance = useTokenBalance(diamondHand?.DIAMOND);
  const collateralBalance = useTokenBalance(collateral);
  const refInputCollateral = useRef(null);
  const refInputShare = useRef(null);

  const isExceededCollateralBalance = useMemo(() => {
    if (diamondHand?.isUnlocked && collateralBalance && collateralAmount && collateral) {
      return collateralAmount.gt(collateralBalance);
    }
    return false;
  }, [collateralBalance, collateralAmount, diamondHand?.isUnlocked, collateral]);

  const isExceededShareBalance = useMemo(() => {
    if (diamondHand?.isUnlocked && shareBalance && shareAmount) {
      return shareAmount.gt(shareBalance);
    }
    return false;
  }, [shareBalance, shareAmount, diamondHand?.isUnlocked]);

  const isFullCollaterallized = useMemo(
    () => poolInfo?.targetCollateralRatio.gte(PRECISION),
    [poolInfo],
  );

  const resetInputs = useCallback(() => {
    refInputCollateral?.current?.resetInput(undefined);
    refInputShare?.current?.resetInput(undefined);
    setCollateralAmount(undefined);
    setShareAmount(undefined);
    setMinOutputAmount(undefined);
  }, [refInputCollateral, refInputShare]);

  const onConfirmed = useCallback(() => {
    resetInputs();
  }, [resetInputs]);

  const [showConfirmModal] = useModal(
    <MintConfirmationModal
      poolInfo={poolInfo}
      syntheticAmount={minOutputAmount}
      collateral={collateral}
      collateralAmount={collateralAmount}
      shareAmount={shareAmount}
      mintFee={poolInfo?.mintingFee}
      slippage={slippage}
      syntheticPrice={syntheticPrice}
      priceCollateralPerShare={priceCollateralPerShare}
      onConfirmed={onConfirmed}
    />,
  );

  const updateCollateralAmount = useCallback((collateralAmount: BigNumber) => {
    console.log('updateCollateralAmount', collateralAmount);
  }, []);

  const updateShareAmount = useCallback((shareAmount: BigNumber) => {
    console.log('updateShareAmount', shareAmount);
  }, []);
  return !poolInfo || !collateral || !syntheticToken ? (
    <PoolContentLoader />
  ) : (
    <>
      <Card animationDuration={0.3} background={'transparent'} padding={'0px'} border={'none'}>
        <CardBody>
          <FormRow>
            <div className="row-header">
              <FormRowLeftTitle>
                Input
                {
                  <>
                    {' '}
                    &middot;{' '}
                    <Number
                      percentage={true}
                      value={poolInfo?.targetCollateralRatio}
                      decimals={6}
                      keepZeros={false}
                      precision={2}
                    />
                    %
                  </>
                }
              </FormRowLeftTitle>
              <FormRowBalance>
                Balance:{' '}
                <Number
                  value={collateralBalance}
                  decimals={collateral.decimals}
                  precision={6}
                />
              </FormRowBalance>
            </div>
            <div className="row-input">
              <TokenInput
                ref={refInputCollateral}
                hasError={isExceededCollateralBalance}
                token={collateral}
                decimals={collateral.decimals}
                precision={6}
                onChange={updateCollateralAmount}
              />
              <FormToken>
                <TokenSymbol size={32} symbol={collateral.symbol} noBorder />
                <span>{collateral.symbol}</span>
              </FormToken>
            </div>
          </FormRow>
          {!isFullCollaterallized && (
            <>
              <FormSeparator>
                <FontAwesomeIcon icon={faPlus} color={theme.color.primary.light} />
              </FormSeparator>

              <FormRow>
                <div className="row-header">
                  <FormRowLeftTitle>
                    {diamondHand?.DIAMOND.symbol} &middot;{' '}
                    <Number
                      percentage={true}
                      value={PRECISION.sub(poolInfo.targetCollateralRatio)}
                      decimals={6}
                      precision={2}
                    />
                    %
                  </FormRowLeftTitle>
                  {shareBalance && (
                    <FormRowBalance>
                      Balance:{' '}
                      <Number
                        value={shareBalance}
                        decimals={diamondHand?.DIAMOND.decimals}
                        precision={6}
                        percentage={false}
                        keepZeros={false}
                      />
                    </FormRowBalance>
                  )}
                </div>
                <div className="row-input">
                  <TokenInput
                    ref={refInputShare}
                    hasError={isExceededShareBalance}
                    token={diamondHand?.DIAMOND}
                    disabled={!syntheticToken}
                    decimals={diamondHand?.DIAMOND.decimals}
                    precision={6}
                    onChange={updateShareAmount}
                  />
                  <FormToken>
                    <TokenSymbol size={32} symbol={diamondHand?.DIAMOND.symbol} noBorder />
                    <span>{diamondHand.DIAMOND.symbol}</span>
                  </FormToken>
                </div>
                <div className="row-footer">
                  <a href={ExternalLinks.buyDND} target="_blank">
                    Buy DND
                  </a>
                </div>
              </FormRow>
            </>
          )}
          <FormSeparator>
            <FontAwesomeIcon icon={faArrowDown} color={theme.color.orange[500]} />
          </FormSeparator>
          <FormRow>
            <div className="row-header">
              <FormRowLeftTitle>Output (estimated)</FormRowLeftTitle>
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
              <FormOutput>
                <Number
                  value={minOutputAmount}
                  decimals={syntheticToken.decimals}
                  precision={6}
                />
              </FormOutput>
              <FormToken>
                <TokenSymbol size={32} symbol={syntheticToken.symbol} noBorder />
                <span>{syntheticToken.symbol}</span>
              </FormToken>
            </div>
          </FormRow>
          <FormButtonsContainer>
            <ButtonMintSynthetic mint={showConfirmModal} />
          </FormButtonsContainer>
        </CardBody>
      </Card>
      <Footer>
        <SyntheticContent>
          <DataRow>
            <RowItemLabel>Minting fee&nbsp;</RowItemLabel>
            <RowItemValue>
              <Number
                value={poolInfo.mintingFee}
                decimals={6}
                percentage={true}
                precision={2}
                keepZeros={false}
              />
              %
            </RowItemValue>
          </DataRow>
          {
            <DataRow>
              <RowItemLabel>Slippage&nbsp;</RowItemLabel>
              <RowItemValue>{slippage * 100}%</RowItemValue>
            </DataRow>
          }
        </SyntheticContent>
      </Footer>
    </>
  );
};

export default Mint;

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
