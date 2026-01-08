import React from 'react';
import { cn } from '../../utils/cn';

interface M3IconButtonProps {
  icon: string;
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

const M3IconButton: React.FC<M3IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  disabled = false,
  className,
  title,
  type = 'button',
  variant = 'standard',
  size = 'medium'
}) => {
  // Base classes using MD3 design tokens
  const baseClasses = 'inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant classes using MD3 design tokens
  const variantClasses = {
    standard: 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-variant)] focus:ring-[var(--md-sys-color-primary)]',
    filled: 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hover:bg-[var(--md-sys-color-primary-container)]/80 focus:ring-[var(--md-sys-color-primary)]',
    tonal: 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-secondary-container)]/80 focus:ring-[var(--md-sys-color-secondary)]',
    outlined: 'border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)] focus:ring-[var(--md-sys-color-primary)]'
  };

  // Size classes using MD3 spacing tokens
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  // Icon size classes
  const iconSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn('material-symbols-outlined select-none', iconSizeClasses[size])}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
};

export default M3IconButton;
