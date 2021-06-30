import React from 'react';
import styled from 'styled-components';
import { MobileSidebar } from '../Sidebar/Sidebar';
import Spacer from '../Spacer';
import AccountButton from './AccountButton';
import ButtonMore from './ButtonMore';
import ButtonSettings from './ButtonSettings';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <MobileSidebar />
      <StyledLeftHeader />
      <Spacer size="xs" />
      <AccountButton />
      <ButtonSettings />
      <ButtonMore />
    </StyledHeader>
  );
};
const StyledLeftHeader = styled.div`
  display: flex;
  flex: 1;
`;

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
`;

export default Header;
