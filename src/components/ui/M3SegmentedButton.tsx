// MD3 Expressive Transformative — Segmented Button
// Horizontal control with animated selection pill (spring), full MD3 token compliance.
// Use in place of M3ChipGroup for filtering/navigation (e.g. weekdays in Registro, view tabs).
// Component-scoped keyframes for pill animation (documented exception per MD3 contract §9).

import React, { useId } from 'react';

const PILL_KEYFRAMES = `
  @keyframes _m3sb-pill-in {
    from { transform: scaleX(0.4) scaleY(0.7); opacity: 0.6; }
    65%  { transform: scaleX(1.04) scaleY(1.04); opacity: 1; }
    82%  { transform: scaleX(0.98) scaleY(0.98); }
    100% { transform: scaleX(1) scaleY(1); opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3sb-pill { animation-duration: 0.01ms !important; }
  }
`;

export interface M3SegmentedButtonOption<T extends string = string> {
  value: T;
  label: string;
  /** Optional Material Symbol icon name */
  icon?: string;
  disabled?: boolean;
}

export interface M3SegmentedButtonProps<T extends string = string> {
  options: M3SegmentedButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 'single' = one selected at a time (default). 'multi' not implemented — use M3ChipGroup. */
  density?: 'default' | 'compact';
  /** Full-width: each segment shares equal space. Default: false (fits content) */
  fullWidth?: boolean;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

/**
 * M3SegmentedButton — MD3 Expressive horizontal segmented control.
 *
 * @example
 * <M3SegmentedButton
 *   options={[
 *     { value: 'lun', label: 'Lun' },
 *     { value: 'mar', label: 'Mar' },
 *     { value: 'mer', label: 'Mer' },
 *   ]}
 *   value={selectedDay}
 *   onChange={setSelectedDay}
 *   fullWidth
 * />
 */
function M3SegmentedButton<T extends string = string>({
  options,
  value,
  onChange,
  density = 'default',
  fullWidth = false,
  'aria-label': ariaLabel,
  style,
}: M3SegmentedButtonProps<T>): React.ReactElement {
  const groupId = useId();
  const isCompact = density === 'compact';

  return (
    <>
      <style>{PILL_KEYFRAMES}</style>
      <div
        role="group"
        aria-label={ariaLabel}
        style={{
          display: 'inline-flex',
          width: fullWidth ? 'var(--md-sys-percent-100)' : 'auto',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          border: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)`,
          overflow: 'hidden',
          ...style,
        }}
      >
        {options.map((opt, idx) => {
          const isSelected = opt.value === value;
          const isFirst = idx === 0;
          const isLast = idx === options.length - 1;

          return (
            <button
              key={String(opt.value)}
              id={`${groupId}-${String(opt.value)}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
              disabled={opt.disabled}
              onClick={() => !opt.disabled && onChange(opt.value)}
              style={{
                position: 'relative',
                flex: fullWidth ? 1 : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: opt.icon ? 'var(--md-sys-spacing-2)' : undefined,
                paddingInline: isCompact ? 'var(--md-sys-spacing-3)' : 'var(--md-sys-spacing-4)',
                paddingBlock: isCompact ? 'var(--md-sys-spacing-2)' : 'var(--md-sys-spacing-2-5, var(--md-sys-spacing-2))',
                minHeight: isCompact ? 'var(--md-sys-spacing-9)' : 'var(--md-sys-spacing-11)',
                minWidth: 'var(--md-sys-spacing-12)',
                background: 'transparent',
                border: 'none',
                borderLeft: !isFirst
                  ? `var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)`
                  : 'none',
                cursor: opt.disabled ? 'not-allowed' : 'pointer',
                opacity: opt.disabled ? 'var(--md-sys-state-opacity-disabled)' : undefined,
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                // Shape: first/last segments get pill corners
                borderRadius: isFirst
                  ? `var(--md-sys-shape-corner-full) 0 0 var(--md-sys-shape-corner-full)`
                  : isLast
                    ? `0 var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-full) 0`
                    : '0',
                // Active text accent
                color: isSelected
                  ? 'var(--md-sys-color-on-secondary-container)'
                  : 'var(--md-sys-color-on-surface)',
                fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                fontWeight: isSelected
                  ? 'var(--md-sys-typescale-weight-bold)'
                  : 'var(--md-sys-typescale-label-large-font-weight)',
                lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
                letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
                transition: [
                  `color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                  `font-weight var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                ].join(', '),
                overflow: 'hidden',
              }}
            >
              {/* Animated selection background pill */}
              <span
                aria-hidden="true"
                className={isSelected ? '_m3sb-pill' : undefined} // eslint-disable-line design-system/no-classname -- animation target class for spring keyframe, not a style class
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--md-sys-color-secondary-container)',
                  animation: isSelected
                    ? `_m3sb-pill-in var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`
                    : 'none',
                  opacity: isSelected ? 1 : 0,
                  transition: isSelected
                    ? 'none'
                    : `opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Icon (optional) */}
              {opt.icon && (
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    zIndex: 'var(--md-sys-z-content)',
                    fontSize: 'var(--md-sys-typescale-title-small-font-size)',
                    fontVariationSettings: isSelected
                      ? `'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20`
                      : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
                    transition: `font-variation-settings var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                  }}
                >
                  {opt.icon}
                </span>
              )}

              {/* Checkmark when selected (MD3 spec) */}
              {isSelected && (
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    zIndex: 'var(--md-sys-z-content)',
                    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                    fontVariationSettings: `'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20`,
                  }}
                >
                  check
                </span>
              )}

              {/* Label */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 'var(--md-sys-z-content)',
                  userSelect: 'none',
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default M3SegmentedButton;
