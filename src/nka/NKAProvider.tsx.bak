// Context provider for NKA state, theme tokens, and settings
import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useNKAStore } from './useNKAStore';

export interface NKAProviderProps {
  children: React.ReactNode;
}

const NKAContext = createContext<ReturnType<typeof useNKAStore> | undefined>(undefined);

export const NKAProvider: React.FC<NKAProviderProps> = ({ children }) => {
  // Placeholder for context values (theme, settings, etc.)
  const store = useNKAStore();
  const value = useMemo(() => ({ ...store }), [store]);
  return <NKAContext.Provider value={value}>{children}</NKAContext.Provider>;
};

export const useNKAContext = (): ReturnType<typeof useNKAStore> | undefined => useContext(NKAContext);


