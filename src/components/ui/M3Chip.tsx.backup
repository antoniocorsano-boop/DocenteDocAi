import React from 'react';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};


function M3Chip({ label, variant = 'filled', disabled, onDelete, className, ...buttonProps }: M3ChipProps): React.ReactElement {

  return (
    <div className={`inline-flex align-center gap-2 ${className || ''}`.trim()}>
      <button
        type="button"
        disabled={disabled}
        className={`chip-btn ${variant} ${disabled ? 'disabled' : ''}`}
        {...buttonProps}
      >
        {label}
      </button>
      {onDelete ? (
        <button
          type="button"
          aria-label="Delete chip"
          onClick={onDelete}
          disabled={disabled}
          className="chip-delete-btn"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export default M3Chip;
