import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { FC, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { CustomRpcModal } from '@/components';
import {
  AuthProvider,
  BackgroundProvider,
  ModalProvider,
  RpcProvider,
  UmiProvider,
} from '@/context';
import { useRpc } from '@/hooks';
import { Home, Profile, CurveView } from '@/views';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/curve/:curveAddress',
    element: <CurveView />,
  },
  {
    path: '/profile/:userId?',
    element: <Profile />,
  },
]);

const AppInner: FC = () => {
  const { rpc } = useRpc();

  // Initialize wallet adapters with the current RPC endpoint
  const wallets = useMemo(
    () => [new SolflareWalletAdapter(), new TorusWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rpc],
  );

  return (
    // Provide React Query capabilities to the entire app
    <QueryClientProvider client={queryClient}>
      {/* Manage modal state and functionality */}
      <ModalProvider>
        {/* Handle background-related state and effects */}
        <BackgroundProvider>
          {/* Establish connection to the Solana network */}
          <ConnectionProvider endpoint={rpc}>
            {/* Manage wallet connection and state */}
            <WalletProvider wallets={wallets} autoConnect>
              {/* Provide wallet connection modal */}
              <WalletModalProvider>
                {/* Set up Umi (Solana development framework) context */}
                <UmiProvider>
                  {/* Handle authentication state and logic */}
                  <AuthProvider>
                    {/* Render the appropriate component based on the current route */}
                    <RouterProvider router={router} />
                  </AuthProvider>
                </UmiProvider>
              </WalletModalProvider>
              {/* Custom modal for RPC endpoint configuration */}
              <CustomRpcModal />
            </WalletProvider>
          </ConnectionProvider>
        </BackgroundProvider>
        {/* Provide toast notifications */}
        <Toaster />
      </ModalProvider>
    </QueryClientProvider>
  );
};

export const App: FC = () => (
  // Manage RPC endpoint state and configuration
  <RpcProvider>
    <AppInner />
  </RpcProvider>
);
