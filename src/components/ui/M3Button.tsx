import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface M3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  className,
  type = 'button',
  fullWidth = false,
  title,
  ...props
}) => {
  // Base classes using MD3 design tokens
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant classes using MD3 design tokens
  const variantClasses = {
    primary: 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary)] hover:shadow-md focus:ring-[var(--md-sys-color-primary)]',
    secondary: 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-secondary-container)] hover:shadow-md focus:ring-[var(--md-sys-color-secondary)]',
    outline: 'border border-[var(--md-sys-color-outline)] bg-transparent text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)] focus:ring-[var(--md-sys-color-primary)]',
    text: 'bg-transparent text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] focus:ring-[var(--md-sys-color-primary)]'
  };

  // Size classes using MD3 spacing and typography tokens
  const sizeClasses = {
    small: 'h-[var(--md-sys-spacing-9)] px-[var(--md-sys-spacing-4)] text-[var(--md-sys-typescale-label-large-font-size)] gap-[var(--md-sys-spacing-2)] rounded-[var(--md-sys-shape-corner-small)]',
    medium: 'h-[var(--md-sys-spacing-10)] px-[var(--md-sys-spacing-6)] text-[var(--md-sys-typescale-label-large-font-size)] gap-[var(--md-sys-spacing-2)] rounded-[var(--md-sys-shape-corner-medium)]',
    large: 'h-[var(--md-sys-spacing-12)] px-[var(--md-sys-spacing-8)] text-[var(--md-sys-typescale-label-large-font-size)] gap-[var(--md-sys-spacing-3)] rounded-[var(--md-sys-shape-corner-large)]'
  };

  const combinedClassName = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      title={title}
      style={{
        fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
        fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
        lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
        letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)'
      }}
    >
      {startIcon && <span style={{ flexShrink: 0 }}>{startIcon}</span>}
      <span style={{ flex: 1, textAlign: 'center' }}>{children}</span>
      {endIcon && <span style={{ flexShrink: 0 }}>{endIcon}</span>}
    </button>
  );
};

export default M3Button;


