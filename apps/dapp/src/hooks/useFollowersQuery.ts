import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getFollowers } from '@/core';

export const useFollowersQuery = (userId: string) => {
  const wallet = useWallet();
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () =>
      getFollowers(
        {
          publicKey: wallet.publicKey!,
          signMessage: wallet.signMessage!,
        },
        userId,
      ),
  });
};
