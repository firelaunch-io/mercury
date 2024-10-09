import { useQuery } from '@tanstack/react-query';

import { MetadataJson } from '@/types';

export const useMetadataQuery = (uri: string) => useQuery({
    queryKey: ['metadata', uri],
    queryFn: async ({ queryKey: [, uri] }) =>
      fetch(uri).then((r) => r.json() as Promise<MetadataJson>),
  });
