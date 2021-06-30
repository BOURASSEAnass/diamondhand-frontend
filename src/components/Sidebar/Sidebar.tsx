import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import icCastle from '../../assets/img/ic-castle.svg';
import icMines from '../../assets/img/ic-mines.svg';
import icPools from '../../assets/img/ic-pools.svg';
import icTreasury from '../../assets/img/ic-treasury.svg';
import icArrow from '../../assets/img/ic-arrow.svg';
import icClock from '../../assets/img/ic-clock.svg';
import icTwitter from '../../assets/img/setting/ic-twitter.svg';
import icDiscord from '../../assets/img/setting/ic-discord.png';
import icDoc from '../../assets/img/setting/ic-doc.svg';
import icMedium from '../../assets/img/setting/ic-medium.svg';
import icTelegram from '../../assets/img/setting/ic-telegram.svg';
import icGit from '../../assets/img/setting/ic-git.svg';
import logo from '../../assets/img/logo.svg';
import logoIron from '../../assets/img/logo-iron-team.png';
import bgSidebar from '../../assets/img/bg-sidebar.svg';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { SidebarEpochInfo } from './component/SidebarEpochInfo';
import { SidebarPriceInfo } from './component/SidebarPriceInfo';
import { ExternalLinks } from 'src/config';
import { BtnDiamondPriceMobile } from '../Header/BtnDiamondPriceMobile';

interface NavContainerProps {
  onClickItem?: () => void;
}

const NavContainer: React.FC<NavContainerProps> = ({ onClickItem }) => {
  const handleClick = useCallback(() => {
    if (!onClickItem) return;
    onClickItem();
  }, [onClickItem]);

  const config = useConfiguration();
  const dh = useDiamondHand();
  const location = useLocation();

  const matched = useMemo(() => {
    return location.pathname.startsWith('/pools');
  }, [location]);

  return (
    <StyledNavContainer>
      <StyledNavItem onClick={handleClick}>
        <StyledNavLink
          to="/"
          activeClassName="active"
          exact
          className={matched ? 'matched' : ''}
        >
          <Icon src={icPools} />
          Pools
        </StyledNavLink>
      </StyledNavItem>
      <StyledNavItem onClick={handleClick}>
        <StyledExternalLink href="https://app.iron.finance/farms" target="_blank">
          <Icon src={icMines} />
          Farms
        </StyledExternalLink>
      </StyledNavItem>
      <StyledNavItem onClick={handleClick}>
        <StyledNavLink to="/castle">
          <Icon src={icCastle} />
          The Castle
        </StyledNavLink>
      </StyledNavItem>
      <StyledNavItem onClick={handleClick}>
        <StyledNavLink to="/treasury">
          <Icon src={icTreasury} />
          Treasury
        </StyledNavLink>
      </StyledNavItem>
    </StyledNavContainer>
  );
};

export const MobileSidebar: React.FC = () => {
  const [isShowMobileSidebar, setIsShowMobileSidebar] = useState(false);
  const toggleNavbar = useCallback(() => {
    setIsShowMobileSidebar((current) => !current);
  }, []);
  return (
    <StyledMobileSidebar isShow={isShowMobileSidebar}>
      <ButtonContainer isShow={isShowMobileSidebar}>
        <MobileNavToggle onClick={toggleNavbar}>
          <FontAwesomeIcon icon={faBars} />
        </MobileNavToggle>
        <BtnDiamondPriceMobile />
      </ButtonContainer>
      <MobileNavbar isShow={isShowMobileSidebar}>
        <ButtonClose onClick={toggleNavbar}>x</ButtonClose>
        <NavContainer onClickItem={toggleNavbar} />
        <MoreInfo />
      </MobileNavbar>
    </StyledMobileSidebar>
  );
};

const Sidebar: React.FC = () => {
  return (
    <>
      <StyledSidebar>
        <StyledLogoContainer>
          <img src={logo} width={177} />
        </StyledLogoContainer>
        <NavContainer />
        <StyledDataContainer>
          <SidebarPriceInfo />
          {/* <SidebarEpochInfo /> */}
        </StyledDataContainer>
        <StyledAuthorView href="https://iron.finance" target="_blank">
          Developed by &nbsp;
          <img src={logoIron} width={53} />
          &nbsp;team
        </StyledAuthorView>
      </StyledSidebar>
    </>
  );
};

const MoreInfo = () => {
  return (
    <StyledMoreInfo>
      <StyledDropdownItem href={ExternalLinks.codes} target="_blank">
        <img src={icGit} />
        Codes
      </StyledDropdownItem>
      <StyledDropdownItem href={ExternalLinks.medium} target="_blank">
        <img src={icMedium} />
        Medium
      </StyledDropdownItem>
      <StyledDropdownItem href={ExternalLinks.telegram} target="_blank">
        <img src={icTelegram} />
        Telegram
      </StyledDropdownItem>
      <StyledDropdownItem href={ExternalLinks.discord} target="_blank">
        <img src={icDiscord} />
        Discord
      </StyledDropdownItem>
      <StyledDropdownItem href={ExternalLinks.twitter} target="_blank">
        <img src={icTwitter} />
        Twitter
      </StyledDropdownItem>
    </StyledMoreInfo>
  );
};

const StyledMoreInfo = styled.div`
  margin: 20px 10px 0px 10px;
  padding-top: 20px;
  border-top: solid 1px ${({ theme }) => theme.color.primary.main};
`;

const StyledDropdownItem = styled.a`
  width: 100%;
  font-size: 18px;
  font-family: ${({ theme }) => theme.font.heading};
  text-decoration: none;
  text-transform: uppercase;
  border: solid 3px transparent;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0px 15px;
  height: 50px;
  margin-bottom: 10px;
  position: relative;
  img {
    width: 20px;
    margin-right: 16px;
  }
`;

const StyledSidebar = styled.div`
  width: 280px;
  height: 100%;
  background-color: #85e1ff;
  display: flex;
  flex-direction: column;
  background-image: url(${bgSidebar});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const ButtonContainer = styled.div<{ isShow: boolean }>`
  display: flex;
  align-items: center;
`;

const StyledMobileSidebar = styled.div<{ isShow: boolean }>`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileNavbar = styled.div<{ isShow: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #85e1ff;
  padding-top: 40px;
  display: ${(p) => (p.isShow ? 'block' : 'none')};
`;

const ButtonClose = styled.button`
  border: none;
  background-color: transparent;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.5em;
`;

const StyledLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 24px;
  h1 {
    color: ${({ theme }) => theme.color.black};
    padding: 0;
    margin: 0;
  }
`;

const StyledExternalLink = styled.a`
  width: 100%;
  font-size: 18px;
  font-family: ${({ theme }) => theme.font.heading};
  text-decoration: none;
  text-transform: uppercase;
  border: solid 3px transparent;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: relative;
  &:hover {
    border-color: ${({ theme }) => theme.color.primary.light};
  }

  &.active,
  &.matched {
    background-color: #cbf8ff;
    border-color: ${({ theme }) => theme.color.primary.main};
    &:after {
      content: '';
      background-image: url(${icArrow});
      background-repeat: no-repeat;
      background-position: bottom;
      background-size: contain;
      position: absolute;
      right: 10px;
      width: 20px;
      height: 20px;
    }
  }
`;

const StyledNavContainer = styled.ul`
  padding: 0px;
  margin: 30px 10px 0px 10px;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 20px;
  }
`;

const StyledNavItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledNavLink = styled(NavLink)`
  width: 100%;
  font-size: 18px;
  font-family: ${({ theme }) => theme.font.heading};
  text-decoration: none;
  text-transform: uppercase;
  border: solid 3px transparent;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: relative;
  &:hover {
    border-color: ${({ theme }) => theme.color.primary.light};
  }

  &.active,
  &.matched {
    background-color: #cbf8ff;
    border-color: ${({ theme }) => theme.color.primary.main};
    &:after {
      content: '';
      background-image: url(${icArrow});
      background-repeat: no-repeat;
      background-position: bottom;
      background-size: contain;
      position: absolute;
      right: 10px;
      width: 20px;
      height: 20px;
    }
  }
`;

const Icon = styled.img`
  width: 20px;
  margin-right: 16px;
`;

const StyledDataContainer = styled.div`
  padding: 20px 0px 20px 0px;
  border-top: solid 1px ${({ theme }) => `${theme.color.grey[800]}33`};
  border-bottom: solid 1px ${({ theme }) => `${theme.color.grey[800]}33`};
`;

export const StyledRowData = styled.div<{ isBorder?: boolean }>`
  margin: 0px 20px;
  padding: 16px 0px;
  border-top: ${({ theme, isBorder }) =>
    isBorder ? `dashed 1px ${theme.color.grey[500]}` : 'none'};
  i {
    color: ${({ theme }) => theme.color.orange[450]};
    margin-left: 7px;
    cursor: pointer;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: ${({ theme }) => theme.color.primary.main};
    font-weight: 500;
    &.header-alt {
      flex-direction: column;
      .countDown {
        margin-left: 0;
      }
    }
  }
  .title {
    margin: 0px;
  }
  .value {
    margin: 0px;
    margin-left: auto;
    font-size: 18px;
    font-weight: bold;
  }
  .countDown {
    margin-left: auto;
  }
`;

const StyledAuthorView = styled.a`
  padding: 20px 0px 20px 0px;
  display: flex;
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
  justify-content: center;
  text-decoration: none;
  align-items: center;
`;

const MobileNavToggle = styled.button`
  font-size: 1.4rem;
  padding: 0px;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.color.primary.main};
  font-family: ${({ theme }) => theme.font.heading};
  border: none;
  font-weight: 700;
  margin-right: 5px;

  &:hover {
    opacity: 0.9;
  }

  & > div {
    white-space: nowrap;
  }
`;

export default Sidebar;
