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

  /** Optional class applied to the outer dialog shell (useful for E2E hooks) */
  wrapperClassName?: string;

  /** Optional test id applied to the dialog shell (defaults to m3-dialog) */
  wrapperTestId?: string;
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
  wrapperClassName = '',
  wrapperTestId,
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
      className={`dialog-backdrop ${wrapperClassName}`.trim()}
      style={{ ...style, zIndex }}
      onClick={handleBackdropClick}
      role="presentation"
      data-testid={wrapperTestId || 'm3-dialog'}
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
        className={`dialog-container ${
          mode === 'fullscreen'
            ? 'w-full h-full md:h-[90vh] md:max-w-5xl'
            : `w-full ${maxWidthMap[maxWidth]} max-h-[90vh]`
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header Section */}
        {headerContent ? (
          headerContent
        ) : (
          <div className="dialog-header">
            {/* Title & Subtitle */}
            <div>
              <h2
                id="dialog-title"
                className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-black text-[var(--md-sys-color-on-surface)] tracking-tight"
              >
                {title}
              </h2>
              {headline && (
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface-variant)] opacity-80 line-clamp-2 mt-4 leading-snug">
                  {headline}
                </p>
              )}
            </div>

            {/* Close Button */}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="icon-button hover:bg-[var(--md-sys-color-surface-container-highest)] flex items-center justify-center transition-colors"
                data-focus-priority="-1"
                aria-label="Chiudi"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="dialog-content">
          {children}
        </div>

        {/* Footer Section */}
        {(buttons || footerContent) && (
          <div className="dialog-footer">
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
}) => <div className={`dialog-content ${className}`}>{children}</div>;

/**
 * M3DialogActions - Actions/footer wrapper component
 */
export const M3DialogActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`dialog-footer ${className}`}>{children}</div>;

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
      <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] text-[var(--md-sys-color-on-surface)] py-4">{message}</p>
    </M3Dialog>
  );
};

export default M3Dialog;


