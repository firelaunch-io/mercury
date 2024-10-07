import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/core';

export const useUserProfileQuery = (userId: string) => {
  const wallet = useWallet();
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () =>
      getUser(
        {
          publicKey: wallet.publicKey!,
          signMessage: wallet.signMessage!,
        },
        userId,
      ),
  });
};
