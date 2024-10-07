import { useContext } from 'react';

import { UmiContext } from '@/context/UmiContext';

export const useUmi = () => {
  const context = useContext(UmiContext);
  if (context === undefined) {
    throw new Error('useUmi must be used within a UmiProvider');
  }
  return context.umi;
};
