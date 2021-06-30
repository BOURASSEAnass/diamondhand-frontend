import React from 'react';
import { ButtonAction } from 'src/components/ButtonAction';
import styled from 'styled-components';

export const ButtonWithdraw: React.FC<{ all?: boolean }> = ({ all }) => {
  return <StyledButtonAction>{all ? 'Unstake all' : 'Unstake'}</StyledButtonAction>;
};

const StyledButtonAction = styled(ButtonAction)`
  display: inline-block;
  width: initial;
`;
