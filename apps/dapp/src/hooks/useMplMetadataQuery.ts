import {
  fetchMetadata,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';

import { useUmi } from './useUmi';

export const useMplMetadataQuery = (mint: string) => {
  const umi = useUmi();
  return useQuery({
    queryKey: ['mpl-metadata', mint],
    queryFn: async ({ queryKey: [, mint] }) => {
      const metadata = await fetchMetadata(
        umi,
        findMetadataPda(umi, { mint: publicKey(mint) }),
      );
      return metadata;
    },
  });
};
