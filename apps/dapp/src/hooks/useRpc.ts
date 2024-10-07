import { useContext } from 'react';

import { RpcContext } from '@/context';

export const useRpc = () => {
  const context = useContext(RpcContext);
  if (!context) {
    throw new Error('useRpc must be used within an RpcProvider');
  }
  return context;
};
