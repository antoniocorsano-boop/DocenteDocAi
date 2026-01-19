// MD3 Compliant M3Dialog Component
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

import React, { useCallback, useState } from 'react';
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
  backdropClickable = true,
  maxWidth = 'lg',
  headerContent,
  footerContent,
  level = 1,
  style = {},
  isOpen = true,
  hideBackdrop = false,
  hideCloseButton = false,
  wrapperTestId,
}) => {
  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const scrim = 'var(--md-sys-color-scrim)';
  const surfaceContainerHigh = 'var(--md-sys-color-surface-container-high)';
  const onSurface = 'var(--md-sys-color-on-surface)';
  const onSurfaceVariant = 'var(--md-sys-color-on-surface-variant)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';
  const primary = 'var(--md-sys-color-primary)';
  const error = 'var(--md-sys-color-error)';
  const onPrimary = 'var(--md-sys-color-on-primary)';

  // Elevation token
  const level3 = 'var(--md-sys-elevation-level-3)';

  // Shape token
  const large = 'var(--md-sys-shape-corner-large)';

  // Typography tokens
  const heading1 = {
    fontSize: 'var(--md-sys-typescale-headline-large-font)',
    fontWeight: 'var(--md-sys-typescale-headline-large-weight)',
    lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
    letterSpacing: 'var(--md-sys-typescale-headline-large-tracking)'
  };
  const body1 = {
    fontSize: 'var(--md-sys-typescale-body-large-font)',
    fontWeight: 'var(--md-sys-typescale-body-large-weight)',
    lineHeight: 'var(--md-sys-typescale-body-large-line-height)'
  };
  const labelLarge = {
    fontSize: 'var(--md-sys-typescale-label-large-font)',
    fontWeight: 'var(--md-sys-typescale-label-large-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)'
  };

  const zIndex = Number(style.zIndex) || getModalZIndex(level);
  const [closeButtonHovered, setCloseButtonHovered] = useState(false);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex,
        ...style
      }}
      onClick={handleBackdropClick}
      role="presentation"
      data-testid={wrapperTestId || 'm3-dialog'}
      data-fullscreen={mode === 'fullscreen' ? 'true' : 'false'}
    >
      {/* Backdrop - M3 Expressive blur effect */}
      {!hideBackdrop && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: scrim,
            opacity: 0.32, // MD3 scrim opacity
            backdropFilter: 'blur(8px)', // MD3 glass blur
            animation: 'fade-in 300ms ease-out'
          }}
          aria-hidden="true"
        />
      )}

      {/* Dialog Panel - M3 Expressive */}
      <div
        style={{
          width: '100%',
          ...(mode === 'fullscreen'
            ? {
                height: '100%',
                maxHeight: '90vh',
                maxWidth: 'var(--md-sys-spacing-80)' // Using MD3 spacing token
              }
            : {
                maxWidth: maxWidthMap[maxWidth],
                maxHeight: '90vh'
              }
          ),
          margin: 'auto',
          backgroundColor: surfaceContainerHigh,
          borderRadius: large,
          boxShadow: level3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: zIndex + 1
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header Section */}
        {headerContent ? (
          headerContent
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 'var(--md-sys-spacing-6)',
              borderBottom: `1px solid ${outlineVariant}`
            }}
          >
            {/* Title & Subtitle */}
            <div>
              <h2
                id="dialog-title"
                style={{
                  fontSize: heading1.fontSize,
                  fontWeight: heading1.fontWeight,
                  lineHeight: heading1.lineHeight,
                  letterSpacing: heading1.letterSpacing,
                  color: onSurface,
                  margin: 0
                }}
              >
                {title}
              </h2>
              {headline && (
                <p
                  style={{
                    fontSize: body1.fontSize,
                    fontWeight: body1.fontWeight,
                    lineHeight: body1.lineHeight,
                    color: onSurfaceVariant,
                    opacity: 0.8,
                    margin: `var(--md-sys-spacing-4) 0 0 0`,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {headline}
                </p>
              )}
            </div>

            {/* Close Button */}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--md-sys-spacing-2)',
                  borderRadius: large,
                  backgroundColor: closeButtonHovered ? surfaceContainerHigh : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'}}
                onMouseEnter={() => setCloseButtonHovered(true)}
                onMouseLeave={() => setCloseButtonHovered(false)}
                data-focus-priority="-1"
                aria-label="Chiudi"
              >
                <span
                  style={{fontFamily: 'Material Symbols Outlined',
                    fontSize: body1.fontSize,
                    color: onSurfaceVariant}}
                >
                  close
                </span>
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div
          style={{flex: 1,
            padding: 'var(--md-sys-spacing-6)',
            overflowY: 'auto'}}
        >
          {children}
        </div>

        {/* Footer Section */}
        {(buttons || footerContent) && (
          <div
            style={{padding: 'var(--md-sys-spacing-6)',
              borderTop: `1px solid ${outlineVariant}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--md-sys-spacing-3)'}}
          >
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
export const M3DialogContent: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style = {},
}) => {
  // MD3 Token mapping - no useTheme() dependency
  return (
    <div
      style={{flex: 1,
        padding: 'var(--md-sys-spacing-6)',
        overflowY: 'auto',
        ...style}}
    >
      {children}
    </div>
  );
};

/**
 * M3DialogActions - Actions/footer wrapper component
 */
export const M3DialogActions: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style = {},
}) => {
  // MD3 Token mapping - no useTheme() dependency
  const outlineVariant = 'var(--md-sys-color-outline-variant)';
  return (
    <div
      style={{padding: 'var(--md-sys-spacing-6)',
        borderTop: `1px solid ${outlineVariant}`,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--md-sys-spacing-3)',
        ...style}}
    >
      {children}
    </div>
  );
};

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
  // MD3 Token mapping - no useTheme() dependency
  const primary = 'var(--md-sys-color-primary)';
  const error = 'var(--md-sys-color-error)';
  const onPrimary = 'var(--md-sys-color-on-primary)';
  const onSurface = 'var(--md-sys-color-on-surface)';
  const large = 'var(--md-sys-shape-corner-large)';
  const labelLarge = {
    fontSize: 'var(--md-sys-typescale-label-large-font)',
    fontWeight: 'var(--md-sys-typescale-label-large-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)'
  };
  const body1 = {
    fontSize: 'var(--md-sys-typescale-body-large-font)',
    fontWeight: 'var(--md-sys-typescale-body-large-weight)',
    lineHeight: 'var(--md-sys-typescale-body-large-line-height)'
  };

  return (
    <M3Dialog
      title={title}
      onClose={onCancel}
      maxWidth="sm"
      buttons={
        <>
          <button
            onClick={onCancel}
            style={{
              padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
              border: 'none',
              backgroundColor: 'transparent',
              color: primary,
              borderRadius: large,
              fontSize: labelLarge.fontSize,
              fontWeight: labelLarge.fontWeight,
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
              border: 'none',
              backgroundColor: danger ? error : primary,
              color: onPrimary,
              borderRadius: large,
              fontSize: labelLarge.fontSize,
              fontWeight: labelLarge.fontWeight,
              cursor: 'pointer'}}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p
        style={{
          fontSize: body1.fontSize,
          fontWeight: body1.fontWeight,
          lineHeight: body1.lineHeight,
          color: onSurface,
          padding: `var(--md-sys-spacing-4) 0`,
          margin: 0}}
      >
        {message}
      </p>
    </M3Dialog>
  );
};

export default M3Dialog;







