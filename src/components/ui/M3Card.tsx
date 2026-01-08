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

  // Variant classes using MD3 design tokens
  const variantClasses = {
    elevated: 'm3-card--elevated',
    outlined: 'm3-card--outlined',
    filled: 'm3-card--filled'
  };

  // Padding styles using MD3 spacing tokens
  const paddingStyles = {
    none: '0',
    small: 'var(--md-sys-spacing-3)',
    medium: 'var(--md-sys-spacing-4)',
    large: 'var(--md-sys-spacing-6)'
  };

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
      className={cn(
        'm3-card',
        variantClasses[variant],
        isClickable && 'm3-card--clickable',
        className
      )}
      style={{
        padding: paddingStyles[padding],
        borderRadius: 'var(--md-sys-shape-corner-large)'
      }}
    >
      {children}
    </div>
  );
};

export default M3Card;
