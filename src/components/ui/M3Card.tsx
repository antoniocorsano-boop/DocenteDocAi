import React from 'react';
import { cn } from '../../utils/cn';

interface M3CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

const M3Card: React.FC<M3CardProps> = ({
  children,
  className,
  onClick,
  variant = 'elevated',
  padding = 'medium',
  ariaLabel
}) => {
  const isClickable = Boolean(onClick);

  // Padding styles using MD3 spacing tokens
  const paddingStyles = {
    none: '0',
    small: 'var(--md-sys-spacing-3)',
    medium: 'var(--md-sys-spacing-4)',
    large: 'var(--md-sys-spacing-6)'
  };

  // Variant styles using MD3 design tokens
  const variantStyles = {
    elevated: {
      backgroundColor: 'var(--md-sys-color-surface-container-low)',
      boxShadow: 'var(--md-sys-elevation-level-1)',
      border: 'none'
    },
    outlined: {
      backgroundColor: 'var(--md-sys-color-surface)',
      boxShadow: 'none',
      border: '1px solid var(--md-sys-color-outline-variant)'
    },
    filled: {
      backgroundColor: 'var(--md-sys-color-surface-container-highest)',
      boxShadow: 'none',
      border: 'none'
    }
  };

  // Hover styles for clickable cards
  const hoverStyles = isClickable ? {
    cursor: 'pointer'
  } : {};

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      className={cn(className, isClickable && 'm3-transition-interactive')}
      style={{
        padding: paddingStyles[padding],
        borderRadius: 'var(--md-sys-shape-corner-large)',
        ...variantStyles[variant],
        ...hoverStyles
      }}
      onMouseEnter={(e) => {
        if (isClickable && variant === 'elevated') {
          e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level-2)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable && variant === 'elevated') {
          e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level-1)';
        }
      }}
    >
      {children}
    </div>
  );
};

export default M3Card;


