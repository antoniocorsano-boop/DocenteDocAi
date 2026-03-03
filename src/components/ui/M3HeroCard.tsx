// MD3 Expressive — Hero Card
// Prominent banner component for top-of-page hero sections.
// Google-app pattern: large tonal surface, decorative background icon,
// headline + supporting text, optional action slot.

import React from 'react';

type HeroColor = 'primary' | 'secondary' | 'tertiary';

const COLOR_TOKENS: Record<HeroColor, { bg: string; fg: string; fgSub: string; icon: string }> = {
  primary: {
    bg:    'var(--md-sys-color-primary-container)',
    fg:    'var(--md-sys-color-on-primary-container)',
    fgSub: 'color-mix(in srgb, var(--md-sys-color-on-primary-container) 70%, transparent)',
    icon:  'color-mix(in srgb, var(--md-sys-color-on-primary-container) 14%, transparent)',
  },
  secondary: {
    bg:    'var(--md-sys-color-secondary-container)',
    fg:    'var(--md-sys-color-on-secondary-container)',
    fgSub: 'color-mix(in srgb, var(--md-sys-color-on-secondary-container) 70%, transparent)',
    icon:  'color-mix(in srgb, var(--md-sys-color-on-secondary-container) 14%, transparent)',
  },
  tertiary: {
    bg:    'var(--md-sys-color-tertiary-container)',
    fg:    'var(--md-sys-color-on-tertiary-container)',
    fgSub: 'color-mix(in srgb, var(--md-sys-color-on-tertiary-container) 70%, transparent)',
    icon:  'color-mix(in srgb, var(--md-sys-color-on-tertiary-container) 14%, transparent)',
  },
};

export interface M3HeroCardProps {
  /** Primary headline — use display-medium or headline-large scale */
  headline: React.ReactNode;
  /** Secondary line below the headline */
  supportingText?: React.ReactNode;
  /** Material Symbol name for the large decorative background icon */
  decorativeIcon?: string;
  /** Color role. Default: 'primary' */
  color?: HeroColor;
  /** Optional slot rendered below the text (e.g. chips, buttons) */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * M3HeroCard — expressive hero banner, Google-app style.
 *
 * @example
 * <M3HeroCard
 *   headline="Buongiorno, Marco"
 *   supportingText="Matematica • 2A — tra 20 minuti"
 *   decorativeIcon="school"
 *   color="primary"
 * />
 */
const M3HeroCard: React.FC<M3HeroCardProps> = ({
  headline,
  supportingText,
  decorativeIcon,
  color = 'primary',
  actions,
  style,
}) => {
  const tokens = COLOR_TOKENS[color];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        background: tokens.bg,
        padding: 'var(--md-sys-spacing-6) var(--md-sys-spacing-6) var(--md-sys-spacing-5)',
        ...style,
      }}
    >
      {/* Decorative background icon — large, faint, bottom-right */}
      {decorativeIcon && (
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'calc(var(--md-sys-spacing-4) * -1)',
            bottom: 'calc(var(--md-sys-spacing-4) * -1)',
            fontSize: 'var(--md-sys-spacing-35)',
            color: tokens.icon,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            fontVariationSettings: '"FILL" 1, "wght" 300, "opsz" 48',
          }}
        >
          {decorativeIcon}
        </span>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 'var(--md-sys-z-content)' }}>
        {/* Headline */}
        <div
          style={{
            fontFamily: 'var(--md-sys-typescale-headline-large-font)',
            fontSize: 'var(--md-sys-typescale-headline-large-size)',
            fontWeight: 'var(--md-sys-typescale-headline-large-weight)',
            lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-headline-large-tracking)',
            color: tokens.fg,
          }}
        >
          {headline}
        </div>

        {/* Supporting text */}
        {supportingText && (
          <div
            style={{
              marginTop: 'var(--md-sys-spacing-2)',
              fontFamily: 'var(--md-sys-typescale-body-large-font)',
              fontSize: 'var(--md-sys-typescale-body-large-size)',
              fontWeight: 'var(--md-sys-typescale-body-large-weight)',
              lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
              color: tokens.fgSub,
            }}
          >
            {supportingText}
          </div>
        )}

        {/* Actions slot */}
        {actions && (
          <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default M3HeroCard;

