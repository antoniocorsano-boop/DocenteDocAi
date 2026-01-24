// MD3 Compliant M3DatePicker Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, and colors
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React, { useId, useState } from 'react';

export type M3DatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
};

const inputStyle: React.CSSProperties = {
  width: 'var(--md-sys-percent-100)',
  padding: 'var(--md-sys-spacing-3)',
  borderRadius: 'var(--md-sys-shape-corner-small)',
  border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
  boxSizing: 'border-box',
  backgroundColor: 'var(--md-sys-color-surface-container-highest)',
  color: 'var(--md-sys-color-on-surface)',
  fontFamily: 'var(--md-sys-typescale-body-large-font)',
  fontSize: 'var(--md-sys-typescale-body-large-font-size)',
};

const inputFocusStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--md-sys-color-primary)',
  boxShadow: `0 0 0 var(--md-sys-spacing-2) var(--md-sys-color-primary-container)`,
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--md-sys-color-error)',
  boxShadow: `0 0 0 var(--md-sys-spacing-2) var(--md-sys-color-error-container)`,
};

const helperStyle: React.CSSProperties = {
  marginTop: 'var(--md-sys-spacing-1)',
  fontSize: 'var(--md-sys-typescale-body-small-font-size)',
  fontFamily: 'var(--md-sys-typescale-body-small-font)',
  color: 'var(--md-sys-color-on-surface-variant)',
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
    <div style={{ width: 'var(--md-sys-percent-100)' }}>
      {label ? (
        <label
          htmlFor={inputId}
          style={{display: 'block',
            marginBottom: 'var(--md-sys-spacing-2)', 
            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
            fontFamily: 'var(--md-sys-typescale-body-large-font)',
            fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
            color: 'var(--md-sys-color-on-surface)'}}
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







