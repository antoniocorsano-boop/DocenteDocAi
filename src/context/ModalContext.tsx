import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalEntry {
  id: string;
  component: ReactNode;
}

interface ModalContextValue {
  stack: ModalEntry[];
  pushModal: (entry: ModalEntry) => void;
  popModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ModalEntry[]>([]);

  const pushModal = (entry: ModalEntry) => {
    setStack((prev) => {
      if (prev.some((m) => m.id === entry.id)) {
        console.warn(`Modal with ID "${entry.id}" is already open`);
        return prev;
      }
      return [...prev, entry];
    });
  };

  const popModal = (id: string) => {
    setStack((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ModalContext.Provider value={{ stack, pushModal, popModal }}>
      {children}
      {stack.map((entry) => (
        <React.Fragment key={entry.id}>{entry.component}</React.Fragment>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
};
