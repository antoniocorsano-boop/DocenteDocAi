// MD3 Gold Compliant
// Button ottimizzato per touch con ripple effect
// Audit: febbraio 2026

import React, { useState, useRef } from 'react';

interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  loading?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
  loading = false
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;

      setRipples(prev => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    onClick();
  };

  const sizeMap = {
    small: {
      minHeight: 'var(--md-sys-spacing-9)',
      padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
      fontSize: 'var(--md-sys-spacing-3_5)'
    },
    medium: {
      minHeight: 'var(--md-sys-spacing-12)',
      padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)',
      fontSize: 'var(--md-sys-typescale-body-medium-font-size)'
    },
    large: {
      minHeight: 'var(--md-sys-spacing-14)',
      padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-8)',
      fontSize: 'var(--md-sys-spacing-4_5)'
    }
  }[size];

  const variantStyles = {
    filled: {
      backgroundColor: disabled
        ? 'var(--md-sys-color-surface-variant)'
        : 'var(--md-sys-color-primary)',
      color: disabled
        ? 'var(--md-sys-color-on-surface-variant)'
        : 'var(--md-sys-color-on-primary)',
      border: 'none'
    },
    outlined: {
      backgroundColor: 'transparent',
      color: disabled
        ? 'var(--md-sys-color-on-surface-variant)'
        : 'var(--md-sys-color-primary)',
      border: `2px solid ${disabled ? 'var(--md-sys-color-outline-variant)' : 'var(--md-sys-color-primary)'}`
    },
    text: {
      backgroundColor: 'transparent',
      color: disabled
        ? 'var(--md-sys-color-on-surface-variant)'
        : 'var(--md-sys-color-primary)',
      border: 'none'
    }
  }[variant];

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--md-sys-spacing-2)',
        width: fullWidth ? 'var(--md-sys-percent-100)' : 'auto',
        minHeight: sizeMap.minHeight,
        padding: sizeMap.padding,
        fontSize: sizeMap.fontSize,
        fontWeight: '600',
        borderRadius: 'var(--md-sys-spacing-5)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard), opacity var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)`,
        transform: isPressed && !disabled && !loading ? 'scale(0.98)' : 'scale(1)',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...variantStyles
      }}
    >
      {loading && (
        <div
          style={{
            width: 'var(--md-sys-spacing-5)',
            height: 'var(--md-sys-spacing-5)',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: 'var(--md-sys-percent-50)',
            animation: `spin var(--md-sys-motion-duration-spin) var(--md-sys-motion-easing-linear) infinite`
          }}
        />
      )}

      {icon && !loading && (
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 'var(--md-sys-spacing-5)',
            fontVariationSettings: '"FILL" 0, "wght" 600'
          }}
        >
          {icon}
        </span>
      )}

      <span>{children}</span>

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 'var(--md-sys-spacing-2_5)',
            height: 'var(--md-sys-spacing-2_5)',
            borderRadius: 'var(--md-sys-percent-50)',
            backgroundColor: 'var(--md-sys-color-on-primary)',
            opacity: 0.6,
            transform: 'translate(-50%, -50%)',
            animation: `ripple-expand var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-decelerated)`,
            pointerEvents: 'none'
          }}
        />
      ))}

      <style>{`
        @keyframes ripple-expand {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default TouchButton;
