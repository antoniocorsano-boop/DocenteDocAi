import React, { useId } from 'react';

export type M3DatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: 4,
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

const helperStyle: React.CSSProperties = {
  marginTop: '0.25rem',
  fontSize: '0.85rem',
  color: '#666',
};

const errorStyle: React.CSSProperties = {
  ...helperStyle,
  color: 'var(--sys-error)',
};

function M3DatePicker({
  label,
  helperText,
  error,
  id,
  style,
  className,
  ...inputProps
}: M3DatePickerProps): React.ReactElement {
  const autoId = useId();
  const inputId = id ?? autoId;
  const showError = Boolean(error);

  return (
    <div style={{ width: '100%' }} className={className}>
      {label ? (
        <label htmlFor={inputId} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type="date"
        style={{ ...inputStyle, ...(style as React.CSSProperties) }}
        aria-invalid={showError || undefined}
        aria-describedby={helperText || showError ? `${inputId}-helper` : undefined}
        {...inputProps}
      />
      {helperText && !showError ? (
        <div id={`${inputId}-helper`} style={helperStyle}>
          {helperText}
        </div>
      ) : null}
      {showError ? (
        <div id={`${inputId}-helper`} style={errorStyle}>
          {typeof error === 'string' ? error : 'Invalid date'}
        </div>
      ) : null}
    </div>
  );
}

export default M3DatePicker;
