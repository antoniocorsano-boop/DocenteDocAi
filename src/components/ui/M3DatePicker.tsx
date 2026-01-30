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
  width: 'var(--app-layout-full)',
  padding: 'var(--app-spacing-element)',
  borderRadius: 'var(--md-sys-shape-corner-small)',
  border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
  boxSizing: 'border-box',
  backgroundColor: 'var(--md-sys-color-surface-container-highest)',
  color: 'var(--app-color-on-surface)',
  fontFamily: 'var(--md-sys-typescale-body-large-font)',
  fontSize: 'var(--app-text-body)',
};

const inputFocusStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--app-color-primary)',
  boxShadow: `0 0 0 var(--app-spacing-component) var(--app-color-primary-container)`,
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--md-sys-color-error)',
  boxShadow: `0 0 0 var(--app-spacing-component) var(--md-sys-color-error-container)`,
};

const helperStyle: React.CSSProperties = {
  marginTop: 'var(--md-sys-spacing-1)',
  fontSize: 'var(--app-text-body)',
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
    <div style={{ width: 'var(--app-layout-full)' }}>
      {label ? (
        <label
          htmlFor={inputId}
          style={{display: 'block',
            marginBottom: 'var(--app-spacing-component)', 
            fontSize: 'var(--app-text-body)',
            fontFamily: 'var(--md-sys-typescale-body-large-font)',
            fontWeight: 'var(--app-text-body-weight)',
            color: 'var(--app-color-on-surface)'}}
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








