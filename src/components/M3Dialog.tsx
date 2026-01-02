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
 * 
 * @audit Output Tecnici - Sezione 1: Architettura degli Overlay
 */

import React, { useCallback, useEffect, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface M3DialogProps {
  /** Modal ID (required for ModalContext) */
  id?: string;
  
  /** Dialog title - displayed in header */
  title: string;
  
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
}

// ============================================================================
// M3DIALOG COMPONENT
// ============================================================================

/**
 * M3Dialog - Material Design 3 Expressive Dialog
 * 
 * Usage - Standalone mode (legacy):
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <M3Dialog
 *   title="Confirm"
 *   headline="Are you sure?"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * >
 *   Content here
 * </M3Dialog>
 * ```
 * 
 * Usage - With ModalContext:
 * ```tsx
 * const { pushModal } = useModal();
 * 
 * pushModal({
 *   id: 'confirm-dialog',
 *   component: (
 *     <M3Dialog
 *       title="Confirm"
 *       onClose={() => popModal('confirm-dialog')}
 *     >
 *       Content
 *     </M3Dialog>
 *   ),
 * });
 * ```
 */
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
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle backdrop click with proper event delegation
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (backdropClickable && e.target === e.currentTarget) {
        onClose();
      }
    },
    [backdropClickable, onClose]
  );

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && backdropClickable) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, backdropClickable]);

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
      className={`dialog-shell fixed top-0 right-0 bottom-0 left-0 lg:left-[var(--nav-rail-offset-desktop)] flex items-center justify-center p-4 lg:pr-8 lg:pl-6 pointer-events-auto ${
        mode === 'fullscreen' ? '!p-0 md:!p-4' : ''
      }`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* Backdrop - M3 Expressive blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        aria-hidden="true"
      />

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
          ${
            mode === 'fullscreen'
              ? 'w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-[28px] rounded-none'
              : `w-full ${maxWidthMap[maxWidth]} max-h-[90vh] rounded-[28px]`
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
          <div className="px-6 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0 bg-gradient-to-r from-transparent via-surface-container-highest/10 to-transparent">
            {/* Title & Subtitle */}
            <div className="flex-grow min-w-0">
              <h2
                id="dialog-title"
                className="m3-headline-small font-black text-on-surface line-clamp-1 tracking-tight"
              >
                {title}
              </h2>
              {headline && (
                <p className="m3-body-medium text-on-surface-variant opacity-80 line-clamp-2 mt-1 leading-snug">
                  {headline}
                </p>
              )}
            </div>

            {/* Action Buttons (Fullscreen Mode) */}
            {mode === 'fullscreen' && buttons && (
              <div className="hidden md:flex gap-2 ml-4 flex-shrink-0">{buttons}</div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="icon-button !w-10 !h-10 ml-4 flex-shrink-0 hover:bg-surface-container-highest transition-all duration-200 active:scale-95 rounded-full"
              aria-label="Close dialog"
              type="button"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">
                close
              </span>
            </button>
          </div>
        )}

        {/* Content Section */}
        <div
          className={`
            px-4 md:px-6 py-4 md:py-6
            overflow-y-auto overflow-x-hidden
            custom-scrollbar
            flex-grow
            ${mode === 'fullscreen' ? 'bg-surface-container-low' : ''}
          `}
          role="region"
          aria-label="Dialog content"
        >
          {children}
        </div>

        {/* Footer Section */}
        {footerContent ? (
          footerContent
        ) : mode === 'modal' && buttons ? (
          <div className="px-6 py-4 bg-surface-container-highest/30 border-t border-outline-variant/10 flex justify-end gap-3 shrink-0">
            {buttons}
          </div>
        ) : mode === 'fullscreen' && buttons ? (
          <div className="md:hidden px-4 py-3 bg-surface-container-highest/30 border-t border-outline-variant/10 flex justify-end gap-2 shrink-0">
            {buttons}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================================
// PRESET DIALOGS - Common patterns
// ============================================================================

/**
 * M3AlertDialog - Alert/Confirmation dialog
 */
interface M3AlertDialogProps {
  id?: string;
  title: string;
  message: string;
  icon?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const M3AlertDialog: React.FC<M3AlertDialogProps> = ({
  id = 'alert-dialog',
  title,
  message,
  icon,
  severity = 'info',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const severityStyles = {
    info: 'text-primary',
    success: 'text-primary',
    warning: 'text-warning',
    error: 'text-error',
  };

  const severityIcons = {
    info: icon || 'info',
    success: icon || 'check_circle',
    warning: icon || 'warning',
    error: icon || 'error',
  };

  return (
    <M3Dialog
      id={id}
      title={title}
      onClose={onCancel || (() => {})}
      backdropClickable={!onConfirm}
      maxWidth="sm"
      buttons={
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="m3-button-outlined"
              type="button"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="m3-button-filled"
            type="button"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex gap-4 items-start py-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${severityStyles[severity]}`}>
          <span className="material-symbols-outlined text-4xl">{severityIcons[severity]}</span>
        </div>

        {/* Message */}
        <div className="flex-grow">
          <p className="m3-body-large text-on-surface leading-relaxed">{message}</p>
        </div>
      </div>
    </M3Dialog>
  );
};

/**
 * M3FormDialog - Dialog with form content
 */
interface M3FormDialogProps {
  id?: string;
  title: string;
  headline?: string;
  onSubmit: (data: Record<string, FormDataEntryValue>) => void;
  onCancel: () => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const M3FormDialog: React.FC<M3FormDialogProps> = ({
  id = 'form-dialog',
  title,
  headline,
  onSubmit,
  onCancel,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <M3Dialog
      id={id}
      title={title}
      headline={headline}
      onClose={onCancel}
      backdropClickable={!isLoading}
      maxWidth="md"
      buttons={
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="m3-button-outlined"
            type="button"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="m3-button-filled"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">
                  <span className="material-symbols-outlined text-sm">sync</span>
                </span>
                Saving...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
      </form>
    </M3Dialog>
  );
};

/**
 * M3ConfirmDialog - Simple yes/no confirmation
 */
interface M3ConfirmDialogProps {
  id?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const M3ConfirmDialog: React.FC<M3ConfirmDialogProps> = ({
  id = 'confirm-dialog',
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}) => {
  return (
    <M3Dialog
      id={id}
      title={title}
      onClose={onCancel}
      maxWidth="sm"
      buttons={
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="m3-button-outlined"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'px-6 py-2 rounded-full bg-error text-on-error font-medium hover:bg-error/90 transition-all' : 'm3-button-filled'}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="m3-body-large text-on-surface py-4 leading-relaxed">{message}</p>
    </M3Dialog>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export { type M3DialogProps };

/**
 * M3DialogContent - Content wrapper component
 * Use inside M3Dialog to wrap main content
 */
export const M3DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`m3-dialog-content ${className}`}>{children}</div>;

/**
 * M3DialogActions - Actions/footer wrapper component
 * Use inside M3Dialog for buttons in the footer
 */
export const M3DialogActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <footer className={`m3-dialog-actions ${className}`}>{children}</footer>;

