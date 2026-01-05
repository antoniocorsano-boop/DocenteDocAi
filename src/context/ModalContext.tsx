/**
 * Material Design 3 Expressive - Modal Management System
 * Architettura degli Overlay - Soluzione "Modal Hell"
 * 
 * Features:
 * - Centralized modal stacking with React Portals
 * - Dynamic Z-index calculation (supports 3+ levels)
 * - M3 Expressive transitions (fade + scale)
 * - Backdrop blur effects
 * - Full TypeScript support
 * - Accessibility first (ARIA attributes)
 * 
 * @audit Sezione 1: Architettura degli Overlay
 */

import React, { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getModalZIndex } from '../design-system/zIndex';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Modal instance in the stack
 */
interface ModalInstance {
  id: string;
  component: React.ReactNode;
  level: number;
  onClose?: () => void;
  backdropClickable?: boolean;
  backdropOpacity?: 'light' | 'medium' | 'dark';
}

/**
 * ModalContext public API
 */
interface ModalContextType {
  // Stack management
  stack: ModalInstance[];
  
  // Modal operations
  pushModal: (options: PushModalOptions) => void;
  popModal: (id: string) => void;
  popAllModals: () => void;
  
  // Utilities
  getZIndex: (level: number) => number;
  isModalOpen: (id: string) => boolean;
  getTopModal: () => ModalInstance | undefined;
}

/**
 * Options for pushing a new modal
 */
interface PushModalOptions {
  id: string;
  component: React.ReactNode;
  onClose?: () => void;
  backdropClickable?: boolean;
  backdropOpacity?: 'light' | 'medium' | 'dark';
}

// ============================================================================
// CONTEXT & HOOKS
// ============================================================================

const ModalContext = createContext<ModalContextType | null>(null);

/**
 * Hook to use Modal Context
 * @throws Error if used outside ModalProvider
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

/**
 * Simplified hook for single modal lifecycle
 */
export const useModalController = (modalId: string): { openModal: (component: React.ReactNode, onClose?: () => void) => void; closeModal: () => void; isOpen: boolean } => {
  const { pushModal, popModal, isModalOpen } = useModal();

  const openModal = useCallback(
    (component: React.ReactNode, onClose?: () => void) => {
      pushModal({
        id: modalId,
        component,
        onClose,
        backdropClickable: true,
        backdropOpacity: 'medium',
      });
    },
    [modalId, pushModal]
  );

  const closeModal = useCallback(() => {
    popModal(modalId);
  }, [modalId, popModal]);

  const isOpen = isModalOpen(modalId);

  return { openModal, closeModal, isOpen };
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface ModalProviderProps {
  children: ReactNode;
}

/**
 * ModalProvider - Wraps app and manages all modals through Context + Portals
 * 
 * Usage:
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [stack, setStack] = useState<ModalInstance[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Initialize portal container on mount
  useEffect(() => {
    let container = document.getElementById('modal-root');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-root';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '1000';
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    return () => {
      // Cleanup: remove empty portal container
      if (container && container.children.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Push modal to stack
  const pushModal = useCallback(
    (options: PushModalOptions): void => {
      setStack((prev) => {
        // Prevent duplicate modal IDs
        if (prev.some((m) => m.id === options.id)) {
          console.warn(`Modal with ID "${options.id}" is already open`);
          return prev;
        }

        const newLevel = prev.length + 1;
        return [
          ...prev,
          {
            id: options.id,
            component: options.component,
            level: newLevel,
            onClose: options.onClose,
            backdropClickable: options.backdropClickable ?? true,
            backdropOpacity: options.backdropOpacity ?? 'medium',
          },
        ];
      });
    },
    []
  );

  // Pop modal from stack
  const popModal = useCallback((id: string) => {
    setStack((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  // Pop all modals
  const popAllModals = useCallback(() => {
    setStack((prev) => {
      prev.forEach((m) => {
        if (m.onClose) {
          m.onClose();
        }
      });
      return [];
    });
  }, []);

  // Calculate Z-index for level using centralized Z_INDEX constant
  // Centralized in: src/design-system/zIndex.ts
  const getZIndex = useCallback((level: number): number => {
    return getModalZIndex(level);
  }, []);

  // Check if modal is open
  const isModalOpen = useCallback((id: string): boolean => {
    return stack.some((m) => m.id === id);
  }, [stack]);

  // Get top modal
  const getTopModal = useCallback((): ModalInstance | undefined => {
    return stack[stack.length - 1];
  }, [stack]);

  const value: ModalContextType = {
    stack,
    pushModal,
    popModal,
    popAllModals,
    getZIndex,
    isModalOpen,
    getTopModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {portalContainer && <ModalPortalContainer stack={stack} getZIndex={getZIndex} />}
    </ModalContext.Provider>
  );
};

// ============================================================================
// PORTAL CONTAINER
// ============================================================================

interface ModalPortalContainerProps {
  stack: ModalInstance[];
  getZIndex: (level: number) => number;
}

/**
 * Portal Container - Renders all modals in dedicated container
 */
const ModalPortalContainer: React.FC<ModalPortalContainerProps> = ({ stack, getZIndex }) => {
  const container = document.getElementById('modal-root');
  if (!container) return null;

  return createPortal(
    <>
      {stack.map((modal) => {
        const backdropZIndex = getZIndex(modal.level - 1);
        const modalZIndex = getZIndex(modal.level);

        return (
          <ModalPortal
            key={modal.id}
            id={modal.id}
            level={modal.level}
            backdropZIndex={backdropZIndex}
            modalZIndex={modalZIndex}
            backdropClickable={modal.backdropClickable}
            backdropOpacity={modal.backdropOpacity}
            onBackdropClick={() => {
              // Context has access via useModal hook
            }}
          >
            {modal.component}
          </ModalPortal>
        );
      })}
    </>,
    container
  );
};

// ============================================================================
// INDIVIDUAL MODAL PORTAL
// ============================================================================

interface ModalPortalProps {
  id: string;
  level: number;
  backdropZIndex: number;
  modalZIndex: number;
  backdropClickable?: boolean;
  backdropOpacity?: 'light' | 'medium' | 'dark';
  onBackdropClick?: () => void;
  children: React.ReactNode;
}

/**
 * Individual Modal Portal - Renders single modal with backdrop
 * Handles animations and accessibility
 */
const ModalPortal: React.FC<ModalPortalProps> = ({
  id,
  level,
  backdropZIndex,
  modalZIndex,
  backdropClickable = true,
  backdropOpacity = 'medium',
  onBackdropClick,
  children,
}) => {
  const opacityMap = {
    light: 'bg-black/20',
    medium: 'bg-black/40',
    dark: 'bg-black/60',
  };

  return (
    <div
      key={`modal-portal-${id}`}
      className="fixed inset-0 flex items-center justify-center p-4 pointer-events-auto"
      style={{ zIndex: modalZIndex }}
      data-modal-id={id}
      data-modal-level={level}
    >
      {/* Backdrop - M3 Expressive with blur */}
      <div
        className={`absolute inset-0 ${opacityMap[backdropOpacity]} backdrop-blur-sm animate-in fade-in duration-300 ${
          backdropClickable ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{ zIndex: backdropZIndex }}
        onClick={backdropClickable ? onBackdropClick : undefined}
        aria-hidden="true"
        role="presentation"
      />

      {/* Modal Content Wrapper */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        data-modal-portal-content
      >
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export { ModalContext, type ModalContextType, type ModalInstance, type PushModalOptions };
