// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
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
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

// ============================================================================
// TYPES
// ============================================================================

export interface M3DialogProps {
  /** Modal ID (required for ModalContext) */
  id?: string;
  
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
  style = {},
  isOpen = true,
  hideBackdrop = false,
  hideCloseButton = false,
  wrapperTestId,
}) => {
  // MD3 CSS Variables - Direct token usage (no useTheme dependency)
  const scrim = 'var(--md-sys-color-scrim)';
  const surfaceContainerHigh = 'var(--md-sys-color-surface-container-high)';
  const onSurface = 'var(--app-color-on-surface)';
  const onSurfaceVariant = 'var(--app-color-on-surface-variant)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';
  const spacing4 = 'var(--app-spacing-container)';
  const spacing6 = 'var(--app-spacing-section)';
  const cornerLarge = 'var(--md-sys-shape-corner-large)';
  const headlineLargeFontSize = 'var(--app-text-title)';
  const headlineLargeFontWeight = 'var(--app-text-title-weight)';
  const headlineLargeLineHeight = 'var(--app-text-title-line-height)';
  const headlineLargeLetterSpacing = 'var(--md-sys-typescale-headline-large-letter-spacing)';
  const bodyLargeFontSize = 'var(--app-text-body)';
  const bodyLargeFontWeight = 'var(--app-text-body-weight)';
  const bodyLargeLineHeight = 'var(--app-text-body-line-height)';

  // Use MD3 z-index tokens directly instead of dynamic calculation
  const backdropZIndex = 'var(--app-z-tooltip)';
  const contentZIndex = 'var(--app-z-tooltip)';
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

  // Max width mapping - MD3 compliant (using spacing tokens)
  const maxWidthMap = {
    sm: 'var(--md-sys-spacing-24)', // dialog max-w-sm
    md: 'var(--md-sys-spacing-28)', // dialog max-w-md
    lg: 'var(--md-sys-spacing-32)', // dialog max-w-lg
    xl: 'var(--md-sys-spacing-42)', // dialog max-w-2xl
    '2xl': 'var(--md-sys-spacing-56)', // dialog max-w-4xl
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
        zIndex: backdropZIndex,
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
            backdropFilter: `blur(var(--md-sys-blur-2xl))`, // MD3 glass blur
            animation: `fade-in var(--app-motion-standard) var(--md-sys-motion-easing-decelerated)`
          }}
          aria-hidden="true"
        />
      )}

      {/* Dialog Panel - M3 Expressive */}
      <div
        style={{
          width: 'var(--app-layout-full)',
          ...(mode === 'fullscreen'
            ? {
                height: 'var(--app-layout-full)',
                maxHeight: 'var(--md-sys-percent-90)',
                maxWidth: 'var(--md-sys-spacing-80)', // Using MD3 spacing equivalent
              }
            : {
                maxWidth: maxWidthMap[maxWidth],
                maxHeight: 'var(--md-sys-percent-90)'
              }
          ),
          margin: 'var(--app-layout-auto)',
          backgroundColor: surfaceContainerHigh,
          borderRadius: cornerLarge,
          boxShadow: 'var(--md-sys-elevation-level3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: contentZIndex
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
              padding: spacing6,
              borderBottom: `var(--app-border-normal) solid ${outlineVariant}`
            }}
          >
            {/* Title & Subtitle */}
            <div>
              <h2
                id="dialog-title"
                style={{
                  fontSize: headlineLargeFontSize,
                  fontWeight: headlineLargeFontWeight,
                  lineHeight: headlineLargeLineHeight,
                  letterSpacing: headlineLargeLetterSpacing,
                  color: onSurface,
                  margin: 0
                }}
              >
                {title}
              </h2>
              {headline && (
                <p
                  style={{
                    fontSize: bodyLargeFontSize,
                    fontWeight: bodyLargeFontWeight,
                    lineHeight: bodyLargeLineHeight,
                    color: onSurfaceVariant,
                    opacity: 0.8,
                    margin: `${spacing4} 0 0 0`,
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
                  padding: spacing4,
                  borderRadius: cornerLarge,
                  backgroundColor: closeButtonHovered ? surfaceContainerHigh : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: `background-color var(--app-motion-quick) var(--app-easing-standard)`}}
                onMouseEnter={() => setCloseButtonHovered(true)}
                onMouseLeave={() => setCloseButtonHovered(false)}
                data-focus-priority="-1"
                aria-label="Chiudi"
              >
                <span
                  style={{fontFamily: 'Material Symbols Outlined',
                    fontSize: bodyLargeFontSize,
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
            padding: spacing6,
            overflowY: 'auto'}}
        >
          {children}
        </div>

        {/* Footer Section */}
        {(buttons || footerContent) && (
          <div
            style={{padding: spacing6,
              borderTop: `var(--app-border-normal) solid ${outlineVariant}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--app-spacing-element)'}}
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
        padding: 'var(--app-spacing-section)',
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
  return (
    <div
      style={{padding: 'var(--app-spacing-section)',
        borderTop: `var(--app-border-normal) solid var(--md-sys-color-outline-variant)`,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--app-spacing-element)',
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
  // MD3 CSS Variables - Direct token usage (no useTheme dependency)
  const primaryColor = 'var(--app-color-primary)';
  const errorColor = 'var(--md-sys-color-error)';
  const onPrimaryColor = 'var(--app-color-on-primary)';
  const onSurfaceColor = 'var(--app-color-on-surface)';
  const cornerLargeValue = 'var(--md-sys-shape-corner-large)';
  const labelLargeFontSizeValue = 'var(--app-text-label)';
  const labelLargeFontWeightValue = 'var(--app-text-label-weight)';
  const bodyLargeFontSizeValue = 'var(--app-text-body)';
  const bodyLargeFontWeightValue = 'var(--app-text-body-weight)';
  const bodyLargeLineHeightValue = 'var(--app-text-body-line-height)';

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
              padding: `var(--app-spacing-element) ${spacing4}`,
              border: 'none',
              backgroundColor: 'transparent',
              color: primaryColor,
              borderRadius: cornerLargeValue,
              fontSize: labelLargeFontSizeValue,
              fontWeight: labelLargeFontWeightValue,
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{padding: `var(--app-spacing-element) ${spacing4}`,
              border: 'none',
              backgroundColor: danger ? errorColor : primaryColor,
              color: onPrimaryColor,
              borderRadius: cornerLargeValue,
              fontSize: labelLargeFontSizeValue,
              fontWeight: labelLargeFontWeightValue,
              cursor: 'pointer'}}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p
        style={{
          fontSize: bodyLargeFontSizeValue,
          fontWeight: bodyLargeFontWeightValue,
          lineHeight: bodyLargeLineHeightValue,
          color: onSurfaceColor,
          padding: `${spacing4} 0`,
          margin: 0}}
      >
        {message}
      </p>
    </M3Dialog>
  );
};

export default M3Dialog;








