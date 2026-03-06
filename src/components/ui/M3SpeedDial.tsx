// MD3 Expressive Transformative — Speed Dial (multi-action FAB)
// Main FAB + staggered mini-FABs with spring entrance animation.
// Component-scoped keyframes (documented exception per MD3 contract §9).

import React, { useState, useId } from 'react';

const SPEED_DIAL_KEYFRAMES = `
  @keyframes _m3sd-item-in {
    0%   { opacity: 0; transform: scale(0.5) translateY(12px); }
    60%  { opacity: 1; transform: scale(1.08) translateY(-4px); }
    80%  { transform: scale(0.96) translateY(2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes _m3sd-item-out {
    0%   { opacity: 1; transform: scale(1) translateY(0); }
    100% { opacity: 0; transform: scale(0.5) translateY(12px); }
  }
  @keyframes _m3sd-main-open {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(45deg); }
  }
  @keyframes _m3sd-main-close {
    0%   { transform: rotate(45deg); }
    100% { transform: rotate(0deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3sd-item, ._m3sd-main-icon { animation-duration: 0.01ms !important; }
  }
`;

export interface M3SpeedDialAction {
  /** Material Symbol icon name */
  icon: string;
  /** Tooltip label */
  label: string;
  onClick: () => void;
  /** aria-label (defaults to label) */
  'aria-label'?: string;
}

export interface M3SpeedDialProps {
  /** Main FAB icon (shown when closed; animates to X when open) */
  mainIcon: string;
  /** Main FAB aria-label */
  mainLabel: string;
  /** Actions to show when open */
  actions: M3SpeedDialAction[];
  /** Direction mini-FABs appear */
  direction?: 'up' | 'left';
  /** Position preset */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  style?: React.CSSProperties;
}

const POSITION_STYLE: Record<NonNullable<M3SpeedDialProps['position']>, React.CSSProperties> = {
  'bottom-right': { bottom: 'var(--md-sys-spacing-4)', right: 'var(--md-sys-spacing-4)' },
  'bottom-left':  { bottom: 'var(--md-sys-spacing-4)', left:  'var(--md-sys-spacing-4)' },
  'top-right':    { top:    'var(--md-sys-spacing-4)', right: 'var(--md-sys-spacing-4)' },
  'top-left':     { top:    'var(--md-sys-spacing-4)', left:  'var(--md-sys-spacing-4)' },
};

/**
 * M3SpeedDial — FAB with spring-staggered action menu.
 *
 * @example
 * <M3SpeedDial
 *   mainIcon="add"
 *   mainLabel="Azioni"
 *   actions={[
 *     { icon: 'note_add', label: 'Nuova nota', onClick: addNote },
 *     { icon: 'upload',   label: 'Carica',     onClick: upload },
 *   ]}
 *   position="bottom-right"
 * />
 */
const M3SpeedDial: React.FC<M3SpeedDialProps> = ({
  mainIcon,
  mainLabel,
  actions,
  direction = 'up',
  position = 'bottom-right',
  style,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);

  const toggle = () => {
    if (!open) setWasOpen(true);
    setOpen(prev => !prev);
  };

  const isUp   = direction === 'up';
  const isLeft = direction === 'left';

  const listStyle: React.CSSProperties = isUp
    ? {
        flexDirection: 'column-reverse',
        bottom: 'calc(var(--md-sys-percent-100) + var(--md-sys-spacing-3))',
        left: 'var(--md-sys-percent-50)',
        transform: 'translateX(-50%)',
      }
    : {
        flexDirection: 'row-reverse',
        right: 'calc(var(--md-sys-percent-100) + var(--md-sys-spacing-3))',
        top: 'var(--md-sys-percent-50)',
        transform: 'translateY(-50%)',
      };

  return (
    <>
      <style>{SPEED_DIAL_KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed',
          ...POSITION_STYLE[position],
          display: 'flex',
          flexDirection: isUp ? 'column-reverse' : 'row-reverse',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-2)',
          zIndex: 'var(--md-sys-z-index-fab, 1200)' as React.CSSProperties['zIndex'],
          ...style,
        }}
      >
        {/* Action list */}
        <div
          role="group"
          aria-label={mainLabel}
          aria-hidden={!open}
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 'var(--md-sys-spacing-2)',
            ...listStyle,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          {actions.map((action, i) => {
            // Stagger delay: 40ms per item, reversed for up direction
            const delay = open
              ? `${(isUp ? i : actions.length - 1 - i) * 40}ms`
              : `${(isUp ? actions.length - 1 - i : i) * 30}ms`;

            return (
              <div
                key={action.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--md-sys-spacing-2)',
                  flexDirection: isLeft ? 'row' : 'column',
                }}
              >
                {/* Tooltip label */}
                <span
                  aria-hidden="true"
                  className="_m3sd-item"
                  style={{
                    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                    fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    padding: `var(--md-sys-spacing-1) var(--md-sys-spacing-2)`,
                    borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                    whiteSpace: 'nowrap',
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    animation: wasOpen
                      ? open
                        ? `_m3sd-item-in var(--md-sys-motion-spring-expressive-fast-spatial-duration, 350ms) var(--md-sys-motion-spring-expressive-fast-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) ${delay} both`
                        : `_m3sd-item-out var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard) ${delay} both`
                      : undefined,
                  }}
                >
                  {action.label}
                </span>

                {/* Mini FAB */}
                <button
                  aria-label={action['aria-label'] ?? action.label}
                  className="_m3sd-item"
                  onClick={() => { action.onClick(); setOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Mini FAB: 40dp (MD3 spec)
                    width: 'var(--md-sys-spacing-10)',
                    height: 'var(--md-sys-spacing-10)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    border: 'none',
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    color: 'var(--md-sys-color-on-surface)',
                    cursor: 'pointer',
                    boxShadow: 'var(--md-sys-elevation-level3)',
                    animation: wasOpen
                      ? open
                        ? `_m3sd-item-in var(--md-sys-motion-spring-expressive-fast-spatial-duration, 350ms) var(--md-sys-motion-spring-expressive-fast-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) ${delay} both`
                        : `_m3sd-item-out var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard) ${delay} both`
                      : 'none',
                    transition: `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={{
                      fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                      fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                    }}
                  >
                    {action.icon}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Main FAB */}
        <button
          id={id}
          aria-label={mainLabel}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--md-sys-spacing-14)',
            height: 'var(--md-sys-spacing-14)',
            minWidth: 'var(--md-sys-spacing-14)',
            borderRadius: open
              ? 'var(--md-sys-shape-corner-large)'
              : 'var(--md-sys-shape-corner-extra-large)',
            border: 'none',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            cursor: 'pointer',
            boxShadow: 'var(--md-sys-elevation-level3)',
            transition: [
              `border-radius var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))`,
              `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
              `box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
            ].join(', '),
            willChange: 'border-radius',
          }}
        >
          <span
            className="material-symbols-outlined _m3sd-main-icon"
            aria-hidden="true"
            style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
              animation: wasOpen
                ? open
                  ? `_m3sd-main-open var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard) forwards`
                  : `_m3sd-main-close var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard) forwards`
                : undefined,
              display: 'inline-block',
            }}
          >
            {mainIcon}
          </span>
        </button>
      </div>
    </>
  );
};

export default M3SpeedDial;
