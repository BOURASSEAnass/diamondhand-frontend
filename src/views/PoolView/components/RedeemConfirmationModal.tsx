import React, { useCallback, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import Modal, { ModalCloseButton, ModalLower, ModalUpper } from 'src/components/Modal';
import Number from 'src/components/Number';
import {
  TxModalButtons,
  TxModalDataRow,
  TxModalDataRowField,
  TxModalDataRowValue,
  TxModalSlippageHelper,
} from 'src/components/TxConfirmationModal';
import styled, { useTheme } from 'styled-components';
import SyntheticToken from 'src/diamondhand/SyntheticToken';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { SyntheticPoolInfo } from 'src/diamondhand/SyntheticPool';
import { ButtonAction } from 'src/components/ButtonAction';
import bgConfirm from '../../../assets/img/bg_confirm.png';
import icConfirmation from '../../../assets/img/ic-miner-confirmation.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationModalProps {
  poolInfo: SyntheticPoolInfo;
  synthetic: SyntheticToken;
  collateral: SyntheticToken;
  syntheticAmount: BigNumber;
  minOutputCollateralAmount: BigNumber;
  minOutputShareAmount: BigNumber;
  syntheticPrice: BigNumber;
  slippage: number;
  onDismiss?: () => void;
  onConfirmed: () => void;
}

const RedeemConfirmationModal: React.FC<ConfirmationModalProps> = ({
  poolInfo,
  collateral,
  synthetic,
  syntheticAmount,
  minOutputCollateralAmount,
  minOutputShareAmount,
  slippage,
  syntheticPrice,
  onDismiss,
  onConfirmed,
}) => {
  const theme = useTheme();
  const diamondHand = useDiamondHand();
  const handleConfirm = useCallback(() => {
    onConfirmed();
    onDismiss();
  }, [onConfirmed, onDismiss]);

  const hasOnlyOneToken = useMemo(() => {
    if (
      (minOutputShareAmount?.eq(0) && !minOutputShareAmount?.eq(0)) ||
      (!minOutputShareAmount?.eq(0) && minOutputShareAmount?.eq(0))
    ) {
      return true;
    }
    return false;
  }, [minOutputShareAmount]);

  return (
    <Modal size="sm" padding="0">
      <ModalUpper>
        <ModalCloseButton onClick={onDismiss}>
          <FontAwesomeIcon icon={faTimes} />
        </ModalCloseButton>
        <StyledBackground>
          <StyledImage src={icConfirmation} />
        </StyledBackground>
        <StyledConfirmTitle>You will receive</StyledConfirmTitle>
        {hasOnlyOneToken ? (
          <StyledReceiveTokens>
            {!minOutputCollateralAmount?.eq(0) && (
              <StyledReceiveTokenHorizontal>
                <TxModalOutputAmountBigSize>
                  <Number
                    value={minOutputCollateralAmount}
                    decimals={collateral?.decimals}
                    precision={6}
                  />
                </TxModalOutputAmountBigSize>
                <TxModalTokenNameBigSize>{collateral?.symbol}</TxModalTokenNameBigSize>
              </StyledReceiveTokenHorizontal>
            )}
            {!minOutputShareAmount?.eq(0) && (
              <StyledReceiveTokenHorizontal>
                <TxModalOutputAmountBigSize>
                  <Number value={minOutputShareAmount} decimals={18} precision={6} />
                </TxModalOutputAmountBigSize>
                <TxModalTokenNameBigSize>
                  {diamondHand?.DIAMOND?.symbol}
                </TxModalTokenNameBigSize>
              </StyledReceiveTokenHorizontal>
            )}
          </StyledReceiveTokens>
        ) : (
          <StyledReceiveTokens>
            {!minOutputCollateralAmount?.eq(0) && (
              <StyledReceiveTokenHorizontal>
                <TxModalOutputAmountBigSize>
                  <Number
                    value={minOutputCollateralAmount}
                    decimals={collateral?.decimals}
                    precision={6}
                  />
                </TxModalOutputAmountBigSize>
                <TxModalTokenNameBigSize>{collateral?.symbol}</TxModalTokenNameBigSize>
              </StyledReceiveTokenHorizontal>
            )}
            {!minOutputCollateralAmount?.eq(0) && !minOutputShareAmount?.eq(0) && (
              <StyledReceiveTokenPlus>+</StyledReceiveTokenPlus>
            )}
            {!minOutputShareAmount?.eq(0) && (
              <StyledReceiveTokenHorizontal>
                <TxModalOutputAmountBigSize>
                  <Number value={minOutputShareAmount} decimals={18} precision={6} />
                </TxModalOutputAmountBigSize>
                <TxModalTokenNameBigSize>
                  {diamondHand?.DIAMOND?.symbol}
                </TxModalTokenNameBigSize>
              </StyledReceiveTokenHorizontal>
            )}
          </StyledReceiveTokens>
        )}
        <TxModalSlippageHelper>
          Output is estimated at {slippage * 100}% slippage tolerance.
          <br />
          The transaction will be reveted if the actual received amount is lower.
        </TxModalSlippageHelper>
      </ModalUpper>
      <ModalLower>
        <TxModalDataRow>
          <TxModalDataRowField>{synthetic?.symbol} Deposited</TxModalDataRowField>
          <TxModalDataRowValue>
            <Number value={syntheticAmount} decimals={18} precision={6} />
          </TxModalDataRowValue>
        </TxModalDataRow>

        {!minOutputCollateralAmount?.eq(0) && (
          <TxModalDataRow>
            <TxModalDataRowField>Rates</TxModalDataRowField>
            <TxModalDataRowValue>
              1 {synthetic?.symbol} ={' '}
              <Number value={syntheticPrice} decimals={6} precision={6} keepZeros={true} />
              &nbsp;{collateral?.symbol}
            </TxModalDataRowValue>
          </TxModalDataRow>
        )}
        <TxModalDataRow>
          <TxModalDataRowField>Redeem Fee</TxModalDataRowField>
          <TxModalDataRowValue>
            <Number
              value={poolInfo?.redemptionFee}
              decimals={6}
              precision={2}
              keepZeros={false}
              percentage={true}
            />
            %
          </TxModalDataRowValue>
        </TxModalDataRow>

        <TxModalButtons>
          <ButtonAction background={theme.color.orange[500]} onClick={handleConfirm}>
            Confirm
          </ButtonAction>
        </TxModalButtons>
      </ModalLower>
    </Modal>
  );
};

export default RedeemConfirmationModal;

export const StyledBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${bgConfirm});
  background-size: contain;
  background-position: center 50px;
  padding: 20px 0;
`;

export const StyledImage = styled.img`
  width: 109px;
  height: 101px;
`;

export const StyledReceiveTokens = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledReceiveTokenHorizontal = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const TxModalOutputAmountBigSize = styled.div`
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  color: ${(props) => props.theme.color.green[600]};
  font-family: ${(props) => props.theme.font.monospace};
`;

export const TxModalTokenNameBigSize = styled.div`
  font-size: 20px;
  display: inline-block;
  padding-top: 0px;
  color: ${(props) => props.theme.color.grey[750]};
  font-weight: 700;
  margin-left: 8px;
`;

const StyledReceiveTokenPlus = styled.div`
  padding: 0 10px;
  font-weight: 600;
  padding: 0 10px;
  font-size: 40px;
  text-align: center;
  color: ${(props) => props.theme.color.grey[500]};
`;

export const StyledConfirmTitle = styled.h3`
  font-size: 24px;
  text-align: center;
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary.main};
  margin: 0px;
  margin-top: -30px;
`;
