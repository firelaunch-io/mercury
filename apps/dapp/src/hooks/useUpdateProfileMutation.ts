import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUser, uploadImage, withToast } from '@/core';
import { useRpc, useUmi } from '@/hooks';
import { ProfileFormData } from '@/views';

export const useUpdateProfileMutation = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();
  const umi = useUmi();
  const { rpc } = useRpc();

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const imageUri = await withToast(uploadImage(umi, rpc, data.image!), {
        loading: 'Uploading profile image...',
        success: 'Profile image uploaded successfully',
        error: 'Failed to upload profile image',
      });
      return withToast(
        updateUser(
          {
            publicKey: wallet.publicKey!,
            signMessage: wallet.signMessage!,
          },
          {
            ...data,
            profileImage: imageUri,
          },
        ),
        {
          loading: 'Updating profile...',
          success: 'Profile updated successfully',
          error: 'Failed to update profile',
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
