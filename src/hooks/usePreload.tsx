import { ReactElement, useEffect, useState } from 'react';
import logo from '../assets/img/logo.png';
import logoIronTeam from '../assets/img/logo-iron-team.png';
import bgCastle from '../assets/img/bg-castle.jpg';
import bgHome from '../assets/img/bg-home.svg';
import bgPoolView from '../assets/img/bg-pool-view.svg';
import bgMining from '../assets/img/bg-mining.svg';
import bgSidebar from '../assets/img/bg-sidebar.svg';
import bgTvlHome from '../assets/img/bg-tvl-home.svg';
import bgTreasury from '../assets/img/bg-treasury.svg';
import iconDragon from '../assets/img/icon-dragon.svg';
import iconDragonHome from '../assets/img/ic-dragon-home.svg';
import iconMiner from '../assets/img/icon-miner.svg';
import iconMinerHome from '../assets/img/ic-miner-home.svg';
import ETHLogo from 'src/assets/img/tokens/ETH.png';
import ADALogo from 'src/assets/img/tokens/ADA.png';
import DOTLogo from 'src/assets/img/tokens/DOT.png';
import BNBLogo from 'src/assets/img/tokens/BNB.png';
import WBNBLogo from 'src/assets/img/tokens/WBNB.png';
import BTCBLogo from 'src/assets/img/tokens/BTCB.png';
import dETHLogo from 'src/assets/img/tokens/DETH.png';
import dBTCLogo from 'src/assets/img/tokens/DBTC.png';
import dBNBLogo from 'src/assets/img/tokens/DBNB.png';
import DIAMONDLogo from 'src/assets/img/tokens/Diamond.png';
import NoLogo from 'src/assets/img/no_name.png';

const images = [
  logo,
  logoIronTeam,
  bgSidebar,
  bgHome,
  bgMining,
  bgCastle,
  bgTvlHome,
  bgPoolView,
  bgTreasury,
  iconDragon,
  iconMiner,
  iconDragonHome,
  iconMinerHome,
  ETHLogo,
  ADALogo,
  DOTLogo,
  BNBLogo,
  WBNBLogo,
  BTCBLogo,
  dETHLogo,
  dBTCLogo,
  dBNBLogo,
  DIAMONDLogo,
  NoLogo,
];

const load = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
};

const loadAll = (urls: string[]) => Promise.all(urls.map(load));

const timeout = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const withPreload = (Component: React.FC, time: number): React.FC => {
  return (): ReactElement => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      Promise.race([loadAll(images), timeout(time)]).then(() => {
        setLoaded(true);
      });
    }, []);

    if (!loaded) {
      return (
        <div className="initial-loading">
          <img src="/loading-man.gif" />
        </div>
      );
    }

    return <Component />;
  };
};
