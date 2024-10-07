import { useSyncExternalStore } from 'react';

import { MemoryStoredToken } from '@/core';

/**
 * Hook to consume the MemoryStoredToken using useSyncExternalStore
 * @returns {[string | null, (token: string) => void]} A tuple containing the current token and a function to set the token
 */
export const useMemoryStoredToken = (): [
  string | null,
  (token: string) => void,
] => {
  const token = useSyncExternalStore(
    (callback) => {
      const subscription = MemoryStoredToken.getToken$().subscribe(callback);
      return () => subscription.unsubscribe();
    },
    () => MemoryStoredToken.getToken(),
  );

  const setToken = (newToken: string) => MemoryStoredToken.setToken(newToken);

  return [token, setToken];
};
