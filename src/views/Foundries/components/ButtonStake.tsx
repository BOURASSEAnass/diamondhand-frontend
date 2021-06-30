import React from 'react';
import { ButtonAction } from 'src/components/ButtonAction';
import styled from 'styled-components';

export const ButtonStake: React.FC = () => {
  return <StyledButtonAction>Stake</StyledButtonAction>;
};

const StyledButtonAction = styled(ButtonAction)`
  display: inline-block;
  width: initial;
`;
