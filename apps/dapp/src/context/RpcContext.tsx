import React, { createContext, FC, ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type RpcContextType = {
  rpc: string;
  setRpc: (rpc: string) => void;
};

export const RpcContext = createContext<RpcContextType | undefined>(undefined);

interface RpcProviderProps {
  children: ReactNode;
}

export const RpcProvider: FC<RpcProviderProps> = ({ children }) => {
  const [rpc, setRpc] = useLocalStorage<string>(
    'selectedRpc',
    'https://api.mainnet-beta.solana.com',
  );

  return (
    <RpcContext.Provider value={{ rpc, setRpc }}>
      {children}
    </RpcContext.Provider>
  );
};
