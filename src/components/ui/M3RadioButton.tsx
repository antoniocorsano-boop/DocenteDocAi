/**
 * M3RadioButton.tsx
 * Material Design 3 Radio Button component
 * https://m3.material.io/components/radio-button/overview
 */

import React from 'react';

interface M3RadioButtonProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  value?: string;
  name?: string;
  ariaLabel?: string;
}

const M3RadioButton: React.FC<M3RadioButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  value,
  name,
  ariaLabel,
}) => {
  const handleClick = () => {
    if (!disabled && !checked) {
      onChange();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && !checked && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      style={{
        position: 'relative',
        width: '20px',
        height: '20px',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        border: checked
          ? '2px solid var(--md-sys-color-primary)'
          : '2px solid var(--md-sys-color-on-surface-variant)',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Inner dot */}
      <div
        style={{
          width: checked ? '10px' : '0px',
          height: checked ? '10px' : '0px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          backgroundColor: 'var(--md-sys-color-primary)',
          transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        }}
      />

      {/* Focus ring */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          border: '2px solid transparent',
          transition: `border-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        }}
        className="m3-radio-focus-ring"
      />
    </div>
  );
};

export default M3RadioButton;
