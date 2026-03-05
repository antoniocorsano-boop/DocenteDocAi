// MD3 Expressive Transformative — Hero Card
// Prominent banner component for top-of-page hero sections.
// Google-app pattern: large tonal surface, decorative background icon,
// headline + supporting text, optional action slot.
// Expressive upgrades: m3-hero-enter entrance animation, icon hover scale, fullBleed prop.

import React, { useState } from 'react';

// Component-scoped keyframes (documented exception per MD3 contract §9)
const HERO_KEYFRAMES = `
  @keyframes _m3hc-hero-enter {
    from { opacity: 0; transform: translateY(var(--md-sys-spacing-5, 20px)) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3hc-enter { animation-duration: 0.01ms !important; }
  }
`;

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
  /**
   * When true, the card spans full width with no border-radius and no horizontal padding.
   * Ideal for page-top hero banners inside a view's M3Surface wrapper.
   */
  fullBleed?: boolean;
  style?: React.CSSProperties;
}

/**
 * M3HeroCard — expressive hero banner, Google-app style.
 * Entrance: slide-up + fade with spring easing on every mount.
 * Decorative icon: scales on hover for subtle depth emphasis.
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
  fullBleed = false,
  style,
}) => {
  const tokens = COLOR_TOKENS[color];
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <>
      <style>{HERO_KEYFRAMES}</style>
      <div
        // eslint-disable-next-line design-system/no-classname -- _m3hc-enter is a CSS animation class defined in injected HERO_KEYFRAMES (MD3 §9 exception)
        className="_m3hc-enter"
        onMouseEnter={() => setIconHovered(true)}
        onMouseLeave={() => setIconHovered(false)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: fullBleed ? '0' : 'var(--md-sys-shape-corner-extra-large)',
          background: tokens.bg,
          padding: fullBleed
            ? 'var(--md-sys-spacing-6) var(--md-sys-spacing-5) var(--md-sys-spacing-5)'
            : 'var(--md-sys-spacing-6) var(--md-sys-spacing-6) var(--md-sys-spacing-5)',
          // eslint-disable-next-line design-system/no-hardcoded-motion-values -- 500ms is a CSS var() fallback value, not a standalone hardcoded duration
          animation: `_m3hc-hero-enter var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`,
          willChange: 'opacity, transform',
          ...style,
        }}
      >
        {/* Decorative background icon — large, faint, bottom-right, scales on hover */}
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
              transform: iconHovered ? 'scale(1.1)' : 'scale(1)',
              // eslint-disable-next-line design-system/no-hardcoded-motion-values -- 500ms is a CSS var() fallback value
              transition: `transform var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))`,
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
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
              fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
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
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
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
    </>
  );
};

export default M3HeroCard;

