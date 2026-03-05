import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useNKAStore } from './useNKAStore';
import M3Surface from '../components/ui/M3Surface';
import { M3Typography } from '../components/ui/M3Typography';

export interface NKAProviderProps {
  children: React.ReactNode;
}

const NKAContext = createContext<ReturnType<typeof useNKAStore> | undefined>(undefined);

export const NKAProvider: React.FC<NKAProviderProps> = ({ children }) => {
  const store = useNKAStore();
  const value = useMemo(() => ({ ...store }), [store]);

  return (
    <NKAContext.Provider value={value}>
      {children}
    </NKAContext.Provider>
  );
};

export const useNKAContext = (): ReturnType<typeof useNKAStore> | undefined => {
  const context = useContext(NKAContext);
  
  if (context === undefined) {
    throw new Error('useNKAContext deve essere utilizzato all\'interno di NKAProvider');
  }
  
  return context;
};
