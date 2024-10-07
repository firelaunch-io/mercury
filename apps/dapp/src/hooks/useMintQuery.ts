import { fetchMint } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';

import { useUmi } from './useUmi';

export const useMintQuery = (mint: string) => {
  const umi = useUmi();
  return useQuery({
    queryKey: ['mint', mint],
    queryFn: async ({ queryKey: [, mint] }) => {
      const mintAccount = await fetchMint(umi, publicKey(mint));
      return mintAccount;
    },
  });
};
