import React, { createContext, ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type BackgroundVariant = 'dark' | 'light' | 'dusk' | 'twilight';

interface BackgroundContextType {
  variant: BackgroundVariant;
  setVariant: (variant: BackgroundVariant) => void;
}

export const BackgroundContext = createContext<
  BackgroundContextType | undefined
>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
}) => {
  const [variant, setVariant] = useLocalStorage<BackgroundVariant>(
    'backgroundVariant',
    'twilight',
  );

  return (
    <BackgroundContext.Provider value={{ variant, setVariant }}>
      {children}
    </BackgroundContext.Provider>
  );
};
