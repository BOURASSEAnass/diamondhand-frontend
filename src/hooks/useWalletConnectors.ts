import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { useMemo } from 'react';
import { useEthProvider } from 'src/contexts/ConnectionProvider';
import { ConnectorNames } from 'src/state/application/reducer';

const POLLING_INTERVAL = 1000000;

const useWalletConnectors = () => {
  const defaultProvider = useEthProvider();

  return useMemo(() => {
    if (!defaultProvider) {
      return {};
    }

    const chainId = defaultProvider.network.chainId;
    const networkUrl = defaultProvider.connection.url;

    if (!chainId || !networkUrl) {
      throw new Error('Network configuration is invalid');
    }

    const injected = new InjectedConnector({ supportedChainIds: [chainId] });
    const binanceConnect = new BscConnector({ supportedChainIds: [chainId] });

    const walletConnect = new WalletConnectConnector({
      rpc: { [chainId]: networkUrl },
      bridge: 'https://bridge.walletconnect.org',
      qrcode: true,
      pollingInterval: POLLING_INTERVAL,
    });

    return {
      [ConnectorNames.Injected]: injected,
      [ConnectorNames.WalletConnect]: walletConnect,
      [ConnectorNames.BSC]: binanceConnect,
    };
  }, [defaultProvider]);
};

export default useWalletConnectors;
