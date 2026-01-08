import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getModalZIndex } from '../design-system/zIndex';

/**
 * ModalContext - Centralized Modal Management System with React Portals
 * Solves "Modal Hell" by managing Z-index stacking and portal rendering
 * Audit Spec: Material Design 3 Expressive Modal System
 */

interface ModalInstance {
  id: string;
  component: React.ReactNode;
  level: number;
}

interface ModalContextType {
  stack: ModalInstance[];
  pushModal: (id: string, component: React.ReactNode) => void;
  popModal: (id: string) => void;
  getZIndex: (level: number) => number;
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

/**
 * Hook to use Modal Context
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

/**
 * Modal Provider Component
 * Wraps the app and manages all modals through Context + Portals
 */
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ModalInstance[]>([]);

  const pushModal = useCallback((id: string, component: React.ReactNode) => {
    setStack((prev) => {
      // Prevent duplicate modals
      if (prev.some((m) => m.id === id)) return prev;

      const newLevel = prev.length + 1;
      return [...prev, { id, component, level: newLevel }];
    });
  }, []);

  const popModal = useCallback((id: string) => {
    setStack((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getZIndex = useCallback((level: number) => {
    return getModalZIndex(level);
  }, []);

  const isModalOpen = useCallback((id: string) => {
    return stack.some((m) => m.id === id);
  }, [stack]);

  const value: ModalContextType = {
    stack,
    pushModal,
    popModal,
    getZIndex,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Portal for modals - renders outside of component tree */}
      <ModalPortalContainer modals={stack} getZIndex={getZIndex} />
    </ModalContext.Provider>
  );
};

/**
 * Portal Container Component
 * Renders all modals in a dedicated container at DOM root level
 */
interface ModalPortalContainerProps {
  modals: ModalInstance[];
  getZIndex: (level: number) => number;
}

const ModalPortalContainer: React.FC<ModalPortalContainerProps> = ({ modals, getZIndex }) => {
  return (
    <>
      {modals.map((modal) => {
        const backdropZIndex = getZIndex(modal.level - 1);
        const modalZIndex = getZIndex(modal.level);

        return (
          <ModalPortal
            key={modal.id}
            id={modal.id}
            level={modal.level}
            backdropZIndex={backdropZIndex}
            modalZIndex={modalZIndex}
          >
            {modal.component}
          </ModalPortal>
        );
      })}
    </>
  );
};

/**
 * Individual Modal Portal
 * Renders a single modal with backdrop at correct Z-index
 */
interface ModalPortalProps {
  id: string;
  level: number;
  backdropZIndex: number;
  modalZIndex: number;
  children: React.ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({
  id,
  level,
  backdropZIndex,
  modalZIndex,
  children,
}) => {
  // Find or create container
  let container = document.getElementById('modal-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-root';
    document.body.appendChild(container);
  }

  return createPortal(
    <div
      key={id}
      className="fixed inset-0 flex items-center justify-center p-8"
      style={{ zIndex: modalZIndex }}
      data-modal-id={id}
      data-modal-level={level}
    >
      {/* Backdrop with M3 blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        style={{ zIndex: backdropZIndex }}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] rounded-[var(--md-sys-shape-corner-extra-large)]">
        {children}
      </div>
    </div>,
    container
  );
};

/**
 * Helper Hook for Modal Management
 * Provides open/close methods for modal components
 */
export const useModalController = (modalId: string): { openModal: (component: React.ReactNode) => void; closeModal: () => void; isOpen: boolean } => {
  const { pushModal, popModal, isModalOpen } = useModal();

  const openModal = useCallback(
    (component: React.ReactNode) => {
      pushModal(modalId, component);
    },
    [modalId, pushModal]
  );

  const closeModal = useCallback(() => {
    popModal(modalId);
  }, [modalId, popModal]);

  const isOpen = isModalOpen(modalId);

  return { openModal, closeModal, isOpen };
};
