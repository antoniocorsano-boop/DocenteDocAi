import React from 'react';
import { cn } from '../../utils/cn';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, className, ...buttonProps }: M3ChipProps): React.ReactElement {
  // MD3 Chip variants using design tokens
  const variantClasses = {
    filled: cn(
      'bg-[var(--md-sys-color-secondary-container)]',
      'text-[var(--md-sys-color-on-secondary-container)]',
      'border border-[var(--md-sys-color-secondary-container)]',
      'hover:bg-[var(--md-sys-color-secondary-container)]/80',
      'active:bg-[var(--md-sys-color-secondary-container)]/60'
    ),
    outlined: cn(
      'bg-[var(--md-sys-color-surface)]',
      'text-[var(--md-sys-color-on-surface-variant)]',
      'border-2 border-[var(--md-sys-color-outline)]',
      'hover:bg-[var(--md-sys-color-on-surface-variant)]/8',
      'active:bg-[var(--md-sys-color-on-surface-variant)]/12'
    ),
    elevated: cn(
      'bg-[var(--md-sys-color-surface)]',
      'text-[var(--md-sys-color-on-surface-variant)]',
      'border border-[var(--md-sys-color-surface-variant)]',
      'shadow-[var(--md-sys-elevation-level1)]',
      'hover:shadow-[var(--md-sys-elevation-level2)]',
      'active:shadow-[var(--md-sys-elevation-level1)]'
    )
  };

  const disabledClasses = disabled ? cn(
    'opacity-[var(--md-sys-state-opacity-disabled)]',
    'cursor-not-allowed',
    'pointer-events-none'
  ) : '';

  return (
    <div className={cn(
      'inline-flex items-center gap-[var(--md-sys-spacing-2)]',
      'rounded-[var(--md-sys-shape-corner-small)]',
      'px-[var(--md-sys-spacing-3)] py-[var(--md-sys-spacing-1)]',
      'transition-all duration-200',
      className
    )}>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          'text-[var(--md-sys-typescale-label-large)]',
          'font-[var(--md-sys-typescale-label-large-font)]',
          'leading-[var(--md-sys-typescale-label-large-line-height)]',
          'rounded-[var(--md-sys-shape-corner-small)]',
          'transition-all duration-200',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--md-sys-color-primary)]',
          'focus-visible:ring-offset-1',
          variantClasses[variant],
          disabledClasses
        )}
        {...buttonProps}
      >
        {label}
      </button>
      {onDelete && (
        <button
          type="button"
          aria-label="Delete chip"
          onClick={onDelete}
          disabled={disabled}
          className={cn(
            'w-[var(--md-sys-spacing-4)] h-[var(--md-sys-spacing-4)]',
            'flex items-center justify-center',
            'rounded-full',
            'text-[var(--md-sys-color-on-surface-variant)]',
            'hover:bg-[var(--md-sys-color-on-surface-variant)]/8',
            'active:bg-[var(--md-sys-color-on-surface-variant)]/12',
            'transition-colors duration-200',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--md-sys-color-primary)]',
            'focus-visible:ring-offset-1',
            disabled && 'opacity-[var(--md-sys-state-opacity-disabled)] cursor-not-allowed pointer-events-none'
          )}
        >
          <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-small)]">close</span>
        </button>
      )}
    </div>
  );
}

export default M3Chip;
