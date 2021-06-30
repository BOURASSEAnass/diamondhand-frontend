import { createContext, ReactNode, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenInfo } from 'src/api/backend-api';

type DndInfoContext = {
  price: BigNumber;
  totalSupply: BigNumber;
  marketCap: BigNumber;
};

export const Context = createContext<DndInfoContext>(null);

const tokens = ['DND'];

export const DNDInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const info = useTokenInfo(tokens);

  const value = useMemo(() => {
    return info ? info[0] : null;
  }, [info]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
