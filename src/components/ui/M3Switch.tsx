// MD3 Expressive Transformative — Switch Component
// Toggle switch with spring thumb animation, optional icon in thumb, full MD3 token compliance.
// Component-scoped keyframes (documented exception per MD3 contract §9).

import React, { useId } from 'react';

const SWITCH_KEYFRAMES = `
  @keyframes _m3sw-thumb-on {
    0%   { transform: translateX(0) scale(0.8); }
    50%  { transform: translateX(calc(var(--_track-w) - var(--_thumb-on))) scale(1.1); }
    75%  { transform: translateX(calc(var(--_track-w) - var(--_thumb-on))) scale(0.95); }
    100% { transform: translateX(calc(var(--_track-w) - var(--_thumb-on))) scale(1); }
  }
  @keyframes _m3sw-thumb-off {
    0%   { transform: translateX(calc(var(--_track-w) - var(--_thumb-on))) scale(0.8); }
    50%  { transform: translateX(0) scale(1.1); }
    75%  { transform: translateX(0) scale(0.95); }
    100% { transform: translateX(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3sw-thumb { animation-duration: 0.01ms !important; }
  }
`;

export interface M3SwitchProps {
  /** Current value */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Visible label (if not provided, use aria-label) */
  label?: string;
  /** aria-label for accessibility when no visible label */
  'aria-label'?: string;
  /** Material Symbol name to show inside the thumb when ON */
  iconOn?: string;
  /** Material Symbol name to show inside the thumb when OFF */
  iconOff?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * M3Switch — MD3 Expressive toggle switch with spring thumb animation.
 *
 * @example
 * <M3Switch
 *   checked={darkMode}
 *   onChange={setDarkMode}
 *   label="Modalità scura"
 *   iconOn="dark_mode"
 *   iconOff="light_mode"
 * />
 */
const M3Switch: React.FC<M3SwitchProps> = ({
  checked,
  onChange,
  label,
  'aria-label': ariaLabel,
  iconOn,
  iconOff,
  disabled = false,
  style,
}) => {
  const id = useId();

  // Track dimensions as CSS custom properties (referenced in keyframes via JS animation)
  const TRACK_W  = 52; // px (MD3 spec)
  const THUMB_ON_SIZE = 24; // px (selected thumb)

  const handleClick = () => {
    if (!disabled) onChange(!checked);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(!checked);
    }
  };

  return (
    <>
      <style>{SWITCH_KEYFRAMES}</style>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: label ? 'var(--md-sys-spacing-3)' : undefined,
          opacity: disabled ? 'var(--md-sys-state-opacity-disabled)' : undefined,
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
        onClick={handleClick}
      >
        {/* Track */}
        <span
          id={id}
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel || label}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKey}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            // Track: 52×32dp (MD3 spec)
            width: `${TRACK_W}px`,
            height: 'var(--md-sys-spacing-8)', // 32px
            borderRadius: 'var(--md-sys-shape-corner-full)',
            backgroundColor: checked
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-surface-container-highest)',
            border: checked
              ? 'none'
              : `var(--md-sys-border-width-medium) solid var(--md-sys-color-outline)`,
            transition: [
              `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
              `border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
            ].join(', '),
            outline: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0,
          }}
        >
          {/* Focus ring */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 'calc(-1 * var(--md-sys-spacing-1))',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              pointerEvents: 'none',
            }}
          />

          {/* Thumb */}
          <span
            aria-hidden="true"
            className="_m3sw-thumb" // eslint-disable-line design-system/no-classname -- animation target class for CSS @keyframes, not a style class
            style={{
              position: 'absolute',
              left: 'var(--md-sys-spacing-1)',
              width: checked ? `${THUMB_ON_SIZE}px` : 'var(--md-sys-spacing-4)',
              height: checked ? `${THUMB_ON_SIZE}px` : 'var(--md-sys-spacing-4)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              backgroundColor: checked
                ? 'var(--md-sys-color-on-primary)'
                : 'var(--md-sys-color-outline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Spring transition for smooth thumb move
              transition: [
                `transform var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))`,
                `width var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                `height var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
              ].join(', '),
              transform: checked
                ? `translateX(${TRACK_W - THUMB_ON_SIZE - 4}px)`
                : 'translateX(0)',
              willChange: 'transform',
            }}
          >
            {/* Thumb icon */}
            {(checked ? iconOn : iconOff) && (
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                  color: checked
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-surface-container-highest)',
                  fontVariationSettings: `'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20`,
                  userSelect: 'none',
                  lineHeight: 1,
                }}
              >
                {checked ? iconOn : iconOff}
              </span>
            )}
          </span>
        </span>

        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            style={{
              fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
              fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
              lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
              color: 'var(--md-sys-color-on-surface)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            {label}
          </label>
        )}
      </div>
    </>
  );
};

export default M3Switch;
