/**
 * M3NavigationDrawer.tsx
 * Material Design 3 Navigation Drawer (Modal and Standard variants)
 * https://m3.material.io/components/navigation-drawer/overview
 */

import React, { useEffect } from 'react';

interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

interface M3NavigationDrawerProps {
  /** Navigation items */
  items: NavigationItem[];
  /** Currently selected item ID */
  selectedId: string;
  /** Callback when item is selected */
  onSelect: (id: string) => void;
  /** Drawer open state */
  open: boolean;
  /** Callback when drawer should close (modal variant) */
  onClose?: () => void;
  /** Visual variant */
  variant?: 'standard' | 'modal';
  /** Header title */
  headerTitle?: string;
  /** Header subtitle */
  headerSubtitle?: string;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Footer content */
  footerContent?: React.ReactNode;
}

const M3NavigationDrawer: React.FC<M3NavigationDrawerProps> = ({
  items,
  selectedId,
  onSelect,
  open,
  onClose,
  variant = 'standard',
  headerTitle,
  headerSubtitle,
  headerContent,
  footerContent,
}) => {
  const isModal = variant === 'modal';

  // Handle escape key for modal
  useEffect(() => {
    if (!isModal || !open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModal, open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModal && open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isModal, open]);

  const handleItemClick = (item: NavigationItem) => {
    if (!item.disabled) {
      onSelect(item.id);
      if (isModal) {
        onClose?.();
      }
    }
  };

  const drawerContent = (
    <div
      role="navigation"
      aria-label="Navigation drawer"
      style={{
        width: '360px',
        maxWidth: '80vw',
        height: '100%',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {(headerTitle || headerContent) && (
        <div
          style={{
            padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-4) var(--md-sys-spacing-2)',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          {headerContent || (
            <>
              {headerTitle && (
                <h2
                  style={{
                    fontFamily: 'var(--md-sys-typescale-title-small-font-family)',
                    fontSize: 'var(--md-sys-typescale-title-small-font-size)',
                    fontWeight: 'var(--md-sys-typescale-title-small-font-weight)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {headerTitle}
                </h2>
              )}
              {headerSubtitle && (
                <p
                  style={{
                    fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                    color: 'var(--md-sys-color-on-surface)',
                    margin: 'var(--md-sys-spacing-1) 0 0 0',
                  }}
                >
                  {headerSubtitle}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-2)',
        }}
      >
        {items.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                marginBottom: 'var(--md-sys-spacing-1)',
                border: 'none',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: isSelected
                  ? 'var(--md-sys-color-secondary-container)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--md-sys-color-on-secondary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.38 : 1,
                textAlign: 'left',
                transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!item.disabled && !isSelected) {
                  e.currentTarget.style.backgroundColor =
                    'var(--md-sys-color-surface-container-highest)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled && !isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              aria-current={isSelected ? 'page' : undefined}
            >
              {/* Icon */}
              {item.icon && (
                <span
                  style={{
                    fontSize: '24px',
                    color: isSelected
                      ? 'var(--md-sys-color-on-secondary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                  }}
                >
                  {item.icon}
                </span>
              )}

              {/* Label */}
              <span
                style={{
                  flex: 1,
                  fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                  fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                  fontWeight: isSelected
                    ? 'var(--md-sys-typescale-label-large-font-weight)'
                    : 'normal',
                }}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <span
                  style={{
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 var(--md-sys-spacing-1)',
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    backgroundColor: 'var(--md-sys-color-error)',
                    color: 'var(--md-sys-color-on-error)',
                    fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
                    fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {footerContent && (
        <div
          style={{
            padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          {footerContent}
        </div>
      )}
    </div>
  );

  // Standard variant - always visible inline
  if (!isModal) {
    return (
      <div
        style={{
          height: '100%',
          transition: `width var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
          overflow: 'hidden',
        }}
      >
        {drawerContent}
      </div>
    );
  }

  // Modal variant - with scrim and animation
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--md-sys-z-drawer)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--md-sys-color-scrim)',
          opacity: open ? 0.4 : 0,
          transition: `opacity var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)`,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
          boxShadow: open ? 'var(--md-sys-elevation-level-3)' : 'none',
        }}
      >
        {drawerContent}
      </div>
    </div>
  );
};

export default M3NavigationDrawer;
