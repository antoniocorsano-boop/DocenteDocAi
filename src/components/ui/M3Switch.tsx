/**
 * M3Switch.tsx
 * Material Design 3 Switch component
 * https://m3.material.io/components/switch/overview
 */

import React from 'react';

interface M3SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const M3Switch: React.FC<M3SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      style={{
        position: 'relative',
        width: '52px',
        height: '32px',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        backgroundColor: checked
          ? 'var(--md-sys-color-primary)'
          : 'var(--md-sys-color-surface-container-highest)',
        border: checked
          ? 'none'
          : '2px solid var(--md-sys-color-outline)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        transition: `all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
        outline: 'none',
      }}
    >
      {/* Track */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--md-sys-shape-corner-full)',
        }}
      />

      {/* Thumb/Handle */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: checked ? '24px' : '4px',
          width: '24px',
          height: '24px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          backgroundColor: checked
            ? 'var(--md-sys-color-on-primary)'
            : 'var(--md-sys-color-outline)',
          boxShadow: checked
            ? 'var(--md-sys-elevation-level-1)'
            : 'none',
          transition: `all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Icon (optional, shown when checked) */}
        {checked && (
          <span
            style={{
              fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
              fontSize: '16px',
              color: 'var(--md-sys-color-primary)',
            }}
          >
            check
          </span>
        )}
      </div>

      {/* Focus ring */}
      <div
        style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          border: '2px solid transparent',
          transition: `border-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        }}
        className="m3-switch-focus-ring"
      />
    </div>
  );
};

export default M3Switch;
