import React from 'react';
import { ButtonAction } from 'src/components/ButtonAction';

interface ButtonMintProps {
  mint: () => void;
}

export const ButtonMint: React.FC<ButtonMintProps> = ({ mint }) => {
  return (
    <ButtonAction onClick={mint} buttonStyle="ready">
      Mint
    </ButtonAction>
  );
};

export default ButtonMint;
