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
  // Base classes - no custom CSS, only MD3 tokens
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant classes using MD3 design tokens
  const variantClasses = {
    primary: 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary-hover)] focus:ring-[var(--md-sys-color-primary)]',
    secondary: 'bg-[var(--md-sys-color-secondary)] text-[var(--md-sys-color-on-secondary)] hover:bg-[var(--md-sys-color-secondary-hover)] focus:ring-[var(--md-sys-color-secondary)]',
    outline: 'border border-[var(--md-sys-color-outline)] bg-transparent text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)] focus:ring-[var(--md-sys-color-primary)]',
    text: 'bg-transparent text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] focus:ring-[var(--md-sys-color-primary)]'
  };

  // Size classes using MD3 spacing tokens
  const sizeClasses = {
    small: 'h-8 px-3 text-sm gap-2',
    medium: 'h-10 px-4 text-base gap-2',
    large: 'h-12 px-6 text-lg gap-3'
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
    >
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      <span className="flex-1 text-center">{children}</span>
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </button>
  );
};

export default M3Button;
