import { useMemo } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import bgHome from './assets/img/bg-home.png';
import bgPool from './assets/img/bg-pool-view.png';
import bgMining from './assets/img/bg-mining.png';
import bgCastle from './assets/img/bg-castle.jpg';
import bgTreasury from './assets/img/bg-treasury.png';

const MainWrapper: React.FC = ({ children }) => {
  const location = useLocation();

  const bg = useMemo(() => {
    if (!location) {
      return bgHome;
    }
    switch (true) {
      case location.pathname.startsWith('/pools'):
        return bgPool;
      case location.pathname.startsWith('/mines'):
        return bgMining;
      case location.pathname.startsWith('/castle'):
        return bgCastle;
      case location.pathname.startsWith('/treasury'):
      case location.pathname.startsWith('/job-history'):
        return bgTreasury;
      default:
        return bgHome;
    }
  }, [location]);

  return <StyledMainContent bg={bg}>{children}</StyledMainContent>;
};

const StyledMainContent = styled.div<{ bg: string }>`
  min-height: 100vh;
  margin-left: 281px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
  }

  &::before {
    background-image: url(${(p) => p.bg});
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: cover;
    content: '';
    height: 100vh;
    width: 100%;
    left: 0;
    position: fixed;
    top: 0;
    will-change: transform;
    z-index: -1;
  }
`;
export default MainWrapper;
