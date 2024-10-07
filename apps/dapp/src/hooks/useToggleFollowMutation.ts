import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { follow, unfollow, withToast } from '@/core';

export const useToggleFollowMutation = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followedId,
      isFollowing,
    }: {
      followedId: string;
      isFollowing: boolean;
    }) =>
      withToast(
        isFollowing
          ? unfollow(
              {
                publicKey: wallet.publicKey!,
                signMessage: wallet.signMessage!,
              },
              followedId,
            )
          : follow(
              {
                publicKey: wallet.publicKey!,
                signMessage: wallet.signMessage!,
              },
              followedId,
            ),
        {
          loading: isFollowing ? 'Unfollowing user...' : 'Following user...',
          success: isFollowing
            ? 'User unfollowed successfully'
            : 'User followed successfully',
          error: isFollowing
            ? 'Failed to unfollow user'
            : 'Failed to follow user',
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });
};
