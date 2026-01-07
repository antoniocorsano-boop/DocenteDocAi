import React from 'react';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function getStyles(variant: M3ChipProps['variant'], disabled?: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    borderRadius: 16,
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: 'var(--md-sys-color-on-surface)',
    boxShadow: 'var(--md-sys-elevation1)',
    transition: 'box-shadow var(--motion-duration-short1) var(--motion-easing-standard), transform var(--motion-duration-short1) var(--motion-easing-standard)',
  };

  switch (variant) {
    case 'outlined':
      return { ...base, border: '1px solid var(--md-sys-color-primary)', backgroundColor: 'transparent', color: 'var(--md-sys-color-on-surface)' };
    case 'elevated':
      return {
        ...base,
        backgroundColor: 'var(--sys-surface-dim)',
        border: '1px solid var(--md-sys-color-outline)',
        boxShadow: disabled ? 'none' : 'var(--md-sys-elevation2)',
      };
    default:
      return { ...base, backgroundColor: 'var(--md-sys-color-primary)', color: '#fff' };
  }
}

const deleteButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  color: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, className, style, ...buttonProps }: M3ChipProps): React.ReactElement {
  const styles = getStyles(variant, disabled);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} className={className}>
      <button
        type="button"
        disabled={disabled}
        style={{ ...styles, ...style }}
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
          style={deleteButtonStyle}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export default M3Chip;
