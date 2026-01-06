/**
 * M3Dialog - Material Design 3 Expressive Dialog Component
 * 
 * Componente di dialogo completo con:
 * - Supporto per React Portals via ModalContext
 * - M3 Expressive styling (Aura palette)
 * - Transizioni smooth (fade + scale)
 * - Responsive design (mobile, tablet, desktop)
 * - Full accessibility (ARIA, keyboard navigation)
 * - Supporto per fullscreen e varianti
 */

import React, { useCallback } from 'react';
import { getModalZIndex } from '../../design-system/zIndex';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

// ============================================================================
// TYPES
// ============================================================================

export interface M3DialogProps {
  /** Modal ID (required for ModalContext) */
  id?: string;
  
  /** Nesting level for z-index calculation */
  level?: number;
  
  /** Dialog title - displayed in header */
  title: React.ReactNode;
  
  /** Optional subtitle/headline */
  headline?: string;
  
  /** Dialog content */
  children: React.ReactNode;
  
  /** Footer action buttons */
  buttons?: React.ReactNode;
  
  /** Dialog mode */
  mode?: 'modal' | 'fullscreen';
  
  /** Called when modal should close */
  onClose: () => void;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Allow closing via backdrop click */
  backdropClickable?: boolean;
  
  /** Max width constraint (modal mode) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Custom header content (overrides default) */
  headerContent?: React.ReactNode;
  
  /** Custom footer content (overrides default) */
  footerContent?: React.ReactNode;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Backward compatibility: if false, don't render */
  isOpen?: boolean;

  /** If true, don't render the internal backdrop (useful when managed by ModalContext) */
  hideBackdrop?: boolean;

  /** If true, hide the default close button in the header */
  hideCloseButton?: boolean;
}

// ============================================================================
// M3DIALOG COMPONENT
// ============================================================================

export const M3Dialog: React.FC<M3DialogProps> = ({
  title,
  headline,
  children,
  buttons,
  mode = 'modal',
  onClose,
  className = '',
  backdropClickable = true,
  maxWidth = 'lg',
  headerContent,
  footerContent,
  level = 1,
  style = {},
  isOpen = true,
  hideBackdrop = false,
  hideCloseButton = false,
}) => {
  const zIndex = Number(style.zIndex) || getModalZIndex(level);

  // Use centralized keyboard navigation hook
  const dialogRef = useKeyboardNavigation(isOpen, onClose, {
    focusOnOpen: true,
    restoreFocus: true
  });

  // Handle backdrop click with proper event delegation
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (backdropClickable && e.target === e.currentTarget) {
        onClose();
      }
    },
    [backdropClickable, onClose]
  );

  if (!isOpen) return null;

  // Max width mapping
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  };

  // Full dialog wrapper with backdrop
  return (
    <div
      ref={dialogRef}
      className={`dialog-shell fixed inset-0 flex items-center justify-center p-8 pointer-events-auto ${
        mode === 'fullscreen' ? '!p-0 md:!p-8' : ''
      }`}
      style={{ ...style, zIndex }}
      onClick={handleBackdropClick}
      role="presentation"
      data-testid="m3-dialog"
      data-fullscreen={mode === 'fullscreen' ? 'true' : 'false'}
    >
      {/* Backdrop - M3 Expressive blur effect */}
      {!hideBackdrop && (
        <div
          className="absolute inset-0 bg-black/40 animate-in fade-in duration-300"
          style={{ backdropFilter: `blur(var(--sys-glass-blur))` }}
          aria-hidden="true"
        />
      )}

      {/* Dialog Panel - M3 Expressive */}
      <div
        className={`
          relative z-10
          bg-surface-container-high
          border border-outline-variant/20
          shadow-2xl
          overflow-hidden
          animate-in zoom-in-95 duration-300
          flex flex-col
          mx-4
          aura-glass
          ${
            mode === 'fullscreen'
              ? 'w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-3xl rounded-2xl'
              : `w-full ${maxWidthMap[maxWidth]} max-h-[90vh] rounded-2xl md:rounded-3xl`
          }
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header Section */}
        {headerContent ? (
          headerContent
        ) : (
          <div className="px-4 md:px-6 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0 bg-gradient-to-r from-transparent via-surface-container-highest/10 to-transparent">
            {/* Title & Subtitle */}
            <div className="flex-grow min-w-0">
              <h2
                id="dialog-title"
                className="m3-headline-small font-black text-on-surface tracking-tight"
              >
                {title}
              </h2>
              {headline && (
                <p className="m3-body-medium text-on-surface-variant opacity-80 line-clamp-2 mt-4 leading-snug">
                  {headline}
                </p>
              )}
            </div>

            {/* Close Button */}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors ml-4"
                data-focus-priority="-1"
                aria-label="Chiudi"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-6">
          {children}
        </div>

        {/* Footer Section */}
        {(buttons || footerContent) && (
          <div className="px-4 md:px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low/50 flex justify-end items-center gap-6 shrink-0">
            {footerContent || buttons}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * M3DialogContent - Content wrapper component
 */
export const M3DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`m3-dialog-content ${className}`}>{children}</div>;

/**
 * M3DialogActions - Actions/footer wrapper component
 */
export const M3DialogActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <footer className={`m3-dialog-actions flex justify-end gap-6 ${className}`}>{children}</footer>;

/**
 * M3ConfirmDialog - Simple yes/no confirmation
 */
export const M3ConfirmDialog: React.FC<{
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  danger = false,
}) => {
  return (
    <M3Dialog
      title={title}
      onClose={onCancel}
      maxWidth="sm"
      buttons={
        <>
          <button onClick={onCancel} className="m3-button-text">{cancelText}</button>
          <button 
            onClick={onConfirm} 
            className={danger ? 'm3-button-error' : 'm3-button-filled'}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="m3-body-large text-on-surface py-4">{message}</p>
    </M3Dialog>
  );
};

export default M3Dialog;
