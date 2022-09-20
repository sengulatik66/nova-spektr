import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { RpcNode, ConnectionType } from '@renderer/domain/connection';
import { ChainId } from '@renderer/domain/shared-kernel';
import { useBalance } from '@renderer/services/balance/balanceService';
import { TEST_PUBLIC_KEY } from '@renderer/services/balance/common/constants';
import { ExtendedChain } from '@renderer/services/network/common/types';
import { useNetwork } from '@renderer/services/network/networkService';
import { useWallet } from '@renderer/services/wallet/walletService';

type NetworkContextProps = {
  connections: Record<string, ExtendedChain>;
  connectToNetwork: (chainId: ChainId, type: ConnectionType, node?: RpcNode) => Promise<void>;
};

const NetworkContext = createContext<NetworkContextProps>({} as NetworkContextProps);

export const NetworkProvider = ({ children }: PropsWithChildren) => {
  const [connectionsReady, setConnectionReady] = useState(false);

  const { connections, setupConnections, connectToNetwork } = useNetwork();
  const { subscribeBalances, subscribeLockBalances } = useBalance();
  const { getActiveWallets } = useWallet();
  const activeWallets = getActiveWallets();

  useEffect(() => {
    if (connectionsReady) return;

    (async () => {
      await setupConnections();
      setConnectionReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!connectionsReady) return;

    const startNetworks = async () => {
      const requestConnections = Object.values(connections).map(({ connection }) => {
        const { chainId, connectionType, activeNode } = connection;

        if (connectionType === ConnectionType.DISABLED) return;

        return connectToNetwork(chainId, connectionType, activeNode);
      });

      try {
        await Promise.allSettled(requestConnections);
      } catch (error) {
        console.warn(error);
      }
    };

    startNetworks();
  }, [connectionsReady]);

  useEffect(() => {
    const unsubscribeBalance = Object.values(connections).map((chain) => {
      const relaychain = chain.parentId && connections[chain.parentId];
      // TODO: Remove TEST_PUBLIC_KEY when select wallet will be implemented
      const publicKey = (activeWallets && activeWallets[0]?.mainAccounts[0]?.publicKey) || TEST_PUBLIC_KEY;

      return subscribeBalances(chain, relaychain, publicKey);
    });

    const unsubscribeLockBalance = Object.values(connections).map((chain) => {
      // TODO: Remove TEST_PUBLIC_KEY when select wallet will be implemented
      const publicKey = (activeWallets && activeWallets[0]?.mainAccounts[0]?.publicKey) || TEST_PUBLIC_KEY;

      return subscribeLockBalances(chain, publicKey);
    });

    return () => {
      Promise.all(unsubscribeBalance).catch((e) => console.error(e));
      Promise.all(unsubscribeLockBalance).catch((e) => console.error(e));
    };
  }, [connections, activeWallets]);

  return <NetworkContext.Provider value={{ connections, connectToNetwork }}>{children}</NetworkContext.Provider>;
};

export const useNetworkContext = () => useContext<NetworkContextProps>(NetworkContext);
