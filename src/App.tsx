import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Popups from './components/Popups';
import Updaters from './state/Updaters';
import theme from './theme';
import store from './state';
import { Provider } from 'react-redux';
import ModalsProvider from './contexts/Modals';
import IronBankProvider from './contexts/DiamondHandProvider';
import ConnectionProvider from './contexts/ConnectionProvider';
import { ConfigProvider } from './contexts/ConfigProvider/ConfigProvider';
import { AccountBalanceProvider } from './contexts/AccountBalanceProvider/AccountBalanceProvider';
import { DynamicWalletProvider } from './contexts/DynamicWalletProvider/DynamicWalletProvider';
import Disclaimer from './components/Disclaimer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import lazy from '@loadable/component';
import LoadingModal from './components/Loading/LoadingModal';
import { GlobalStyle } from './GlobalStyle';
import MainWrapper from './MainWrapper';
import { withPreload } from './hooks/usePreload';
import DNDInfoProvider from './contexts/DNDInfoProvider';

const Foundries = lazy(() => import('./views/Foundries'));
const Farms = lazy(() => import('./views/Farms'));
const Pools = lazy(() => import('./views/Pools'));
const PoolView = lazy(() => import('./views/PoolView'));
const Treasury = lazy(() => import('./views/Treasury'));
const App: React.FC = () => {
  return (
    <Providers>
      <StyledSite>
        <Router>
          <StyledSidebarContainer>
            <Sidebar />
          </StyledSidebarContainer>
          <MainWrapper>
            <StyledHeaderContainer>
              <Header />
            </StyledHeaderContainer>
            <Switch>
              <Route path="/" exact>
                <Pools />
              </Route>
              <Route path="/pools/:poolAddress">
                <PoolView />
              </Route>
              <Route path="/mines">
                <Farms />
              </Route>
              <Route path="/castle">
                <Foundries />
              </Route>
              <Route path="/treasury">
                <Treasury />
              </Route>
              <Redirect to="/" />
            </Switch>
            <Disclaimer />
          </MainWrapper>
        </Router>
      </StyledSite>
    </Providers>
  );
};

const StyledSite = styled.div``;

const StyledSidebarContainer = styled.div`
  border-right: solid 1px #928ceb;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 281px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-right: none;
  }
`;
const StyledHeaderContainer = styled.div`
  width: 100%;
  /* padding: 30px 44px; */
  margin-bottom: 20px;
  padding: 20px 8px 0 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 20px 24px 0 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 30px 44px;
  }
`;

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ConnectionProvider>
        <ConfigProvider>
          <DynamicWalletProvider>
            <Provider store={store}>
              <Updaters />
              <IronBankProvider>
                <DNDInfoProvider>
                  <AccountBalanceProvider>
                    <ModalsProvider>
                      <>
                        <LoadingModal />
                        <Popups />
                        {children}
                      </>
                    </ModalsProvider>
                  </AccountBalanceProvider>
                </DNDInfoProvider>
              </IronBankProvider>
            </Provider>
          </DynamicWalletProvider>
        </ConfigProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default withPreload(App, 10e3);
