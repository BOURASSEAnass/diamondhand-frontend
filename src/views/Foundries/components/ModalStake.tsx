import React, { useCallback, useState } from 'react';
import Modal, {
  ModalCloseButton,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from 'src/components/Modal';
import styled from 'styled-components';
import TokenInput from 'src/components/TokenInput';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { FormRow, FormToken } from 'src/components/Form';
import TokenSymbol from 'src/components/TokenSymbol';
import Number from 'src/components/Number';
import { Foundry } from 'src/diamondhand/Foundry';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import { ButtonStake } from './ButtonStake';
import icDiamondChest from '../../../assets/img/ic-diamondchest.svg';

export type ModalStakeProps = ModalProps & {
  foundry: Foundry;
  token?: string;
};

export const ModalStake: React.FC<ModalStakeProps> = ({ onDismiss, token }) => {
  const diamondHand = useDiamondHand();
  const [stakeAmount, setStakeAmount] = useState<BigNumber>(BigNumber.from(0));
  const shareBalance = useTokenBalance(diamondHand?.DIAMOND);

  const updateShareAmount = useCallback((ev) => {
    setStakeAmount(ev);
  }, []);

  return (
    <Modal size="md" padding="0">
      <ModalHeader>
        <ModalTitle>{`Deposit ${diamondHand?.DIAMOND.symbol} earn ${token}`}</ModalTitle>
        <ModalCloseButton onClick={onDismiss}>
          <i className="far fa-times"></i>
        </ModalCloseButton>
      </ModalHeader>
      <ModalContent>
        <FormRowLeftTitle>
          <div className="image">
            <img src={icDiamondChest} />
          </div>
          You have{' '}
          <strong>
            {shareBalance && (
              <Number
                value={shareBalance}
                decimals={diamondHand?.DIAMOND.decimals}
                precision={6}
              />
            )}{' '}
            {diamondHand?.DIAMOND.symbol}
          </strong>{' '}
          &nbsp;available
        </FormRowLeftTitle>
        <FormRow>
          <div className="row-input">
            <TokenInput
              hasError={false}
              token={diamondHand?.DIAMOND}
              decimals={18}
              precision={6}
              onChange={updateShareAmount}
            />
            <FormToken>
              <TokenSymbol size={32} symbol={diamondHand?.DIAMOND.symbol} noBorder />
              <span>{diamondHand.DIAMOND.symbol}</span>
            </FormToken>
          </div>
        </FormRow>
        <div className="group-button">
          <ButtonStake />
        </div>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  padding: 32px;
  .group-button {
    margin-top: 33px;
    justify-content: flex-end;
    display: flex;
  }
`;

const FormRowLeftTitle = styled.div`
  font-size: 16px;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.color.primary.main};
  display: flex;
  align-items: center;
  white-space: pre;
  .image {
    height: 40px;
    margin-right: 10px;
  }
`;

export const ButtonCancel = styled.button`
  padding: 0 15px;
  text-align: center;
  outline: none;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  border: none;
  margin-right: 20px;
  background: none;
  color: ${({ theme }) => theme.color.primary.main};
  &:hover {
    color: ${({ theme }) => theme.color.green[100]};
  }
`;
