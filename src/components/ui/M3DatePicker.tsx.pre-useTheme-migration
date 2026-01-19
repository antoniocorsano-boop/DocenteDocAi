// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React, { useId, useState } from 'react';
import { useTheme } from '../../theme/theme';

export type M3DatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
};

const inputStyle: React.CSSProperties = {
  const { layers } = useTheme();
  const { layers } = useTheme();
  width: '100%',
  padding: 'var(--md-sys-spacing-3)',
  borderRadius: 'var(--md-sys-shape-corner-small)',
  border: '1px solid var(--md-sys-color-outline)',
  boxSizing: 'border-box',
  backgroundColor: 'var(--md-sys-color-surfaceContainerHighest)',
  color: 'var(--md-sys-color-onSurface)',
  fontFamily: 'var(--md-sys-typescale-body-large-font)',
  fontSize: 'var(--md-sys-typescale-body-large-font-size)',
};

const inputFocusStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--md-sys-color-primary)',
  boxShadow: '0 0 0 2px var(--md-sys-color-primaryContainer)',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--md-sys-color-error)',
  boxShadow: '0 0 0 2px var(--md-sys-color-error-container)',
};

const helperStyle: React.CSSProperties = {
  marginTop: 'var(--md-sys-spacing-1)',
  fontSize: 'var(--md-sys-typescale-body-small-font-size)',
  fontFamily: 'var(--md-sys-typescale-body-small-font)',
  color: 'var(--md-sys-color-onSurface-variant)',
};

const errorStyle: React.CSSProperties = {
  ...helperStyle,
  color: 'var(--md-sys-color-error)',
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
  const [isFocused, setIsFocused] = useState(false);

  // Determine input style based on state
  const getInputStyle = () => {
    if (showError) return inputErrorStyle;
    if (isFocused) return inputFocusStyle;
    return inputStyle;
  };

  return (
    <div style={{ width: '100%' }} className={className}>
      {label ? (
        <label 
          htmlFor={inputId} 
          style={{display: 'block', 
            marginBottom: layers.ref.spacing['2'], 
            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
            fontFamily: 'var(--md-sys-typescale-body-large-font)',
            fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
            color: ' layers.sys.color.onPrimary'}}
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type="date"
        
        style={{ ...getInputStyle(), ...(style as React.CSSProperties) }}
        aria-invalid={showError || undefined}
        aria-describedby={helperText || showError ? `${inputId}-helper` : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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







