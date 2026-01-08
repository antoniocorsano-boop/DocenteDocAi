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
    elevated: 'bg-[var(--md-sys-color-surface)] shadow-[var(--md-sys-elevation-level1)] border border-[var(--md-sys-color-surface-variant)]',
    outlined: 'bg-[var(--md-sys-color-surface)] border-2 border-[var(--md-sys-color-outline)] shadow-none',
    filled: 'bg-[var(--md-sys-color-surface-variant)] shadow-none border-none'
  };

  // Padding classes using MD3 spacing tokens
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
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
        'relative overflow-hidden transition-all duration-300 rounded-[var(--md-sys-shape-corner-large)]',
        variantClasses[variant],
        paddingClasses[padding],
        isClickable && 'cursor-pointer hover:shadow-[var(--md-sys-elevation-level2)] focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default M3Card;
