import React from 'react';
import { ButtonAction } from 'src/components/ButtonAction';

interface ButtonRedeemProps {
  redeem: () => void;
}

const ButtonRedeem: React.FC<ButtonRedeemProps> = ({ redeem }) => {
  return (
    <ButtonAction onClick={redeem} buttonStyle="ready">
      Redeem
    </ButtonAction>
  );
};

export default ButtonRedeem;
