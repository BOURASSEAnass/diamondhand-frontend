import React from 'react';

import ETHLogo from 'src/assets/img/tokens/ETH.png';
import ADALogo from 'src/assets/img/tokens/ADA.png';
import DOTLogo from 'src/assets/img/tokens/DOT.png';
import BNBLogo from 'src/assets/img/tokens/BNB.png';
import WBNBLogo from 'src/assets/img/tokens/WBNB.png';
import BTCBLogo from 'src/assets/img/tokens/BTCB.png';
import dETHLogo from 'src/assets/img/tokens/DETH.png';
import dBTCLogo from 'src/assets/img/tokens/DBTC.png';
import dBNBLogo from 'src/assets/img/tokens/DBNB.png';
import dADALogo from 'src/assets/img/tokens/DADA.png';
import dDOTLogo from 'src/assets/img/tokens/DDOT.png';
import DIAMONDLogo from 'src/assets/img/tokens/Diamond.png';
import NoLogo from 'src/assets/img/no_name.png';
import styled from 'styled-components';

const logosBySymbol: { [title: string]: string } = {
  ETH: ETHLogo,
  ADA: ADALogo,
  DOT: DOTLogo,
  BNB: BNBLogo,
  WBNB: WBNBLogo,
  BTC: BTCBLogo,
  BTCB: BTCBLogo,
  dETH: dETHLogo,
  dBTC: dBTCLogo,
  dBNB: dBNBLogo,
  dDOT: dDOTLogo,
  dADA: dADALogo,
  DND: DIAMONDLogo,
  NOLOGO: NoLogo,
};

type TokenSymbolProps = {
  symbol: string;
  size?: number;
  noBorder?: boolean;
};

const TokenSymbol: React.FC<TokenSymbolProps> = ({ symbol, size = 64, noBorder = false }) => {
  return (
    <StyleImage
      src={logosBySymbol[symbol] ? logosBySymbol[symbol] : logosBySymbol['NOLOGO']}
      alt={`${symbol} Logo`}
      height={size}
      noBorder={noBorder}
    />
  );
};

export default TokenSymbol;

const StyleImage = styled.img<{ noBorder?: boolean }>``;
