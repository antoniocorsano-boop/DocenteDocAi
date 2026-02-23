/**
 * M3Snackbar.tsx
 * Material Design 3 Snackbar component
 * https://m3.material.io/components/snackbar/overview
 */

import React, { useEffect, useState } from 'react';

interface M3SnackbarProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  duration?: number; // in milliseconds, default 4000
  open: boolean;
}

const M3Snackbar: React.FC<M3SnackbarProps> = ({
  message,
  action,
  onDismiss,
  duration = 4000,
  open,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLeaving(false);
      setIsVisible(true);

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 150); // Wait for exit animation
  };

  const handleAction = () => {
    action?.onClick();
    handleDismiss();
  };

  if (!isVisible && !open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'var(--md-sys-spacing-4)',
        left: '50%',
        transform: isLeaving
          ? 'translateX(-50%) translateY(100%)'
          : 'translateX(-50%) translateY(0)',
        opacity: isLeaving ? 0 : 1,
        zIndex: 'var(--md-sys-z-snackbar)',
        transition: `all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-4)',
          minWidth: '280px',
          maxWidth: '400px',
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
          borderRadius: 'var(--md-sys-shape-corner-small)',
          backgroundColor: 'var(--md-sys-color-inverse-surface)',
          color: 'var(--md-sys-color-inverse-on-surface)',
          boxShadow: 'var(--md-sys-elevation-level-3)',
        }}
      >
        {/* Message */}
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
            lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
          }}
        >
          {message}
        </span>

        {/* Action */}
        {action && (
          <button
            onClick={handleAction}
            style={{
              padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--md-sys-color-inverse-primary)',
              fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
              fontSize: 'var(--md-sys-typescale-label-large-font-size)',
              fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
              cursor: 'pointer',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'rgba(var(--md-sys-color-inverse-primary-rgb), 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {action.label}
          </button>
        )}

        {/* Close button (optional) */}
        <button
          onClick={handleDismiss}
          style={{
            padding: 'var(--md-sys-spacing-1)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-inverse-on-surface)',
            cursor: 'pointer',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              'rgba(var(--md-sys-color-inverse-on-surface-rgb), 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close"
        >
          <span style={{ fontSize: '18px' }}>close</span>
        </button>
      </div>
    </div>
  );
};

export default M3Snackbar;
