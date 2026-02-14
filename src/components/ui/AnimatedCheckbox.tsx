// MD3 Gold Compliant
// Checkbox con animazione check
// Audit: febbraio 2026

import React, { useState } from 'react';
import { M3Typography } from './index';

interface AnimatedCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  helperText?: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  helperText
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--md-sys-spacing-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        padding: 'var(--md-sys-spacing-2)',
        borderRadius: 'var(--md-sys-spacing-2)',
        transition: 'background-color 200ms',
        ...(isFocused && !disabled && {
          backgroundColor: 'var(--md-sys-color-surface-container)'
        })
      }}
    >
      {/* Custom Checkbox */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0
          }}
        />
        
        <div
          style={{
            width: 'var(--md-sys-spacing-5)',
            height: 'var(--md-sys-spacing-5)',
            borderRadius: 'var(--md-sys-spacing-1)',
            border: `2px solid ${
              checked 
                ? 'var(--md-sys-color-primary)' 
                : 'var(--md-sys-color-outline)'
            }`,
            backgroundColor: checked 
              ? 'var(--md-sys-color-primary)' 
              : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            ...(isFocused && {
              outline: '2px solid var(--md-sys-color-primary)',
              outlineOffset: '2px'
            })
          }}
        >
          {checked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                animation: 'check-in 200ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <path
                d="M13 4L6 11L3 8"
                stroke="var(--md-sys-color-on-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 20,
                  strokeDashoffset: checked ? 0 : 20,
                  transition: 'stroke-dashoffset 200ms cubic-bezier(0.4, 0, 0.2, 1) 50ms'
                }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label & Helper */}
      <div style={{ flex: 1 }}>
        <M3Typography
          variant="body-medium"
          style={{
            color: 'var(--md-sys-color-on-surface)',
            fontWeight: '500',
            marginBottom: helperText ? 'var(--md-sys-spacing-1)' : 0
          }}
        >
          {label}
        </M3Typography>
        
        {helperText && (
          <M3Typography
            variant="body-small"
            style={{
              color: 'var(--md-sys-color-on-surface-variant)'
            }}
          >
            {helperText}
          </M3Typography>
        )}
      </div>

      <style>{`
        @keyframes check-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </label>
  );
};

export default AnimatedCheckbox;
