import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getFollowing } from '@/core';

export const useFollowingQuery = (userId: string) => {
  const wallet = useWallet();

  return useQuery({
    queryKey: ['following', userId],
    queryFn: () =>
      getFollowing(
        {
          publicKey: wallet.publicKey!,
          signMessage: wallet.signMessage!,
        },
        userId,
      ),
  });
};
