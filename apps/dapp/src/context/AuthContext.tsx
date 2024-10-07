import { useWallet } from '@solana/wallet-adapter-react';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import React, { createContext, ReactNode } from 'react';

import { auth } from '@/core';
import { useMemoryStoredToken } from '@/hooks';

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: UseMutateFunction<unknown, Error, void, unknown>;
  isPending: boolean;
  isSuccess: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallet = useWallet();
  const [token] = useMemoryStoredToken();

  const {
    mutate: signIn,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      if (token) {
        return Promise.resolve();
      }
      if (!wallet.publicKey || !wallet.signMessage) {
        throw new Error('Wallet not connected');
      }
      const user = await auth({
        publicKey: wallet.publicKey,
        signMessage: wallet.signMessage,
      });
      return user;
    },
  });

  const isAuthenticated = isSuccess || !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, isPending, isSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};
