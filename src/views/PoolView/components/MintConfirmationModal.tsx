import React, { useCallback } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal, { ModalCloseButton, ModalLower, ModalUpper } from 'src/components/Modal';
import Number from 'src/components/Number';
import {
  TxModalButtons,
  TxModalDataRow,
  TxModalDataRowField,
  TxModalDataRowValue,
  TxModalSlippageHelper,
} from 'src/components/TxConfirmationModal';
import SyntheticToken from 'src/diamondhand/SyntheticToken';
import { SyntheticPoolInfo } from 'src/diamondhand/SyntheticPool';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { ButtonAction } from 'src/components/ButtonAction';
import icConfirmation from '../../../assets/img/ic-miner-confirmation.svg';
import {
  StyledBackground,
  StyledConfirmTitle,
  StyledImage,
  StyledReceiveTokenHorizontal,
  StyledReceiveTokens,
  TxModalOutputAmountBigSize,
  TxModalTokenNameBigSize,
} from './RedeemConfirmationModal';
import { useTheme } from 'styled-components';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationModalProps {
  collateral: SyntheticToken;
  poolInfo: SyntheticPoolInfo;
  syntheticAmount: BigNumber;
  collateralAmount: BigNumber;
  shareAmount: BigNumber;
  mintFee: BigNumber;
  syntheticPrice: BigNumber;
  priceCollateralPerShare: BigNumber;
  slippage: number;
  onDismiss?: () => void;
  onConfirmed: () => void;
}

const MintConfirmationModal: React.FC<ConfirmationModalProps> = ({
  collateral,
  poolInfo,
  syntheticAmount,
  collateralAmount,
  shareAmount,
  mintFee,
  syntheticPrice,
  priceCollateralPerShare,
  onDismiss,
  onConfirmed,
  slippage,
}) => {
  const theme = useTheme();
  const diamondHand = useDiamondHand();
  const handleConfirm = useCallback(() => {
    onConfirmed();
    onDismiss();
  }, [onDismiss, onConfirmed]);
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
        <StyledReceiveTokens>
          <StyledReceiveTokenHorizontal>
            <TxModalOutputAmountBigSize>
              <Number value={syntheticAmount} decimals={18} precision={6} />
            </TxModalOutputAmountBigSize>
            <TxModalTokenNameBigSize>{poolInfo?.syntheticSymbol}</TxModalTokenNameBigSize>
          </StyledReceiveTokenHorizontal>
        </StyledReceiveTokens>
        <TxModalSlippageHelper>
          Output is estimated at {slippage * 100}% slippage tolerance.
          <br />
          The transaction will be reveted if the actual received amount is lower.
        </TxModalSlippageHelper>
      </ModalUpper>
      <ModalLower>
        {!!collateralAmount && collateralAmount.gt(0) && (
          <TxModalDataRow>
            <TxModalDataRowField>{collateral?.symbol} Deposited</TxModalDataRowField>
            <TxModalDataRowValue>
              <Number value={collateralAmount} decimals={collateral?.decimals} precision={6} />
            </TxModalDataRowValue>
          </TxModalDataRow>
        )}
        {!!shareAmount && shareAmount.gt(0) && (
          <TxModalDataRow>
            <TxModalDataRowField>{diamondHand?.DIAMOND?.symbol} Deposited</TxModalDataRowField>
            <TxModalDataRowValue>
              <Number value={shareAmount} decimals={18} precision={6} />
            </TxModalDataRowValue>
          </TxModalDataRow>
        )}

        <TxModalDataRow>
          <TxModalDataRowField>Rates</TxModalDataRowField>
          <TxModalDataRowValue>
            1 {poolInfo?.syntheticSymbol} ={' '}
            <Number value={syntheticPrice} decimals={6} precision={3} keepZeros={true} />
            &nbsp;{poolInfo?.collateralSymbol}
          </TxModalDataRowValue>
        </TxModalDataRow>
        {!!shareAmount && shareAmount.gt(0) && (
          <TxModalDataRow>
            <TxModalDataRowField></TxModalDataRowField>
            <TxModalDataRowValue>
              1 {diamondHand?.DIAMOND?.symbol} ={' '}
              <Number
                value={priceCollateralPerShare}
                decimals={6}
                precision={3}
                keepZeros={true}
              />
              &nbsp;{collateral?.symbol}{' '}
            </TxModalDataRowValue>
          </TxModalDataRow>
        )}
        <TxModalDataRow>
          <TxModalDataRowField>Mint Fee</TxModalDataRowField>
          <TxModalDataRowValue>
            <Number
              value={mintFee}
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

export default MintConfirmationModal;
