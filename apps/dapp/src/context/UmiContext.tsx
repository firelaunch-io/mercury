import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { Umi } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { createContext, ReactNode, useMemo } from 'react';

import { useRpc } from '@/hooks';

type UmiContextType = {
  umi: Umi;
};

export const UmiContext = createContext<UmiContextType | undefined>(undefined);

/*
const firelaunch = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createFirelaunchProgram(), false);
  },
});
*/

type UmiProviderProps = {
  children: ReactNode;
};

export const UmiProvider: React.FC<UmiProviderProps> = ({ children }) => {
  const wallet = useWallet();
  const { rpc } = useRpc();

  const umi = useMemo(() => {
    const umi = createUmi(rpc);
    umi.use(irysUploader());
    umi.use(mplTokenMetadata());
    //umi.use(firelaunch());
    if (wallet.publicKey) {
      umi.use(walletAdapterIdentity(wallet));
    }
    return umi;
  }, [rpc, wallet]);

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};
