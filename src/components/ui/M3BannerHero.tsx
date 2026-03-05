// MD3 Expressive Transformative — Banner Hero
// Full-page-width hero section with display-scale typography, oversized decorative icon,
// gradient tonal background, and spring entrance animation.
// Transforms SectionHeader pattern into an expressive modern statement.
// Component-scoped keyframes (documented exception per MD3 contract §9).

import React from 'react';

const BANNER_KEYFRAMES = `
  @keyframes _m3bh-enter {
    from { opacity: 0; transform: translateY(var(--md-sys-spacing-6, 24px)) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes _m3bh-icon-float {
    0%   { transform: translateY(0) scale(1); }
    50%  { transform: translateY(-6px) scale(1.03); }
    100% { transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3bh-enter-anim { animation-duration: 0.01ms !important; }
    ._m3bh-icon-anim  { animation: none !important; }
  }
`;

type BannerColor = 'primary' | 'secondary' | 'tertiary';

const COLOR_TOKENS: Record<BannerColor, {
  bg: string;
  bgGradient: string;
  fg: string;
  fgSub: string;
  iconColor: string;
}> = {
  primary: {
    bg:          'var(--md-sys-color-primary-container)',
    bgGradient:  'color-mix(in srgb, var(--md-sys-color-primary-container) 60%, var(--md-sys-color-surface-container-highest))',
    fg:          'var(--md-sys-color-on-primary-container)',
    fgSub:       'color-mix(in srgb, var(--md-sys-color-on-primary-container) 65%, transparent)',
    iconColor:   'color-mix(in srgb, var(--md-sys-color-on-primary-container) 12%, transparent)',
  },
  secondary: {
    bg:          'var(--md-sys-color-secondary-container)',
    bgGradient:  'color-mix(in srgb, var(--md-sys-color-secondary-container) 60%, var(--md-sys-color-surface-container-highest))',
    fg:          'var(--md-sys-color-on-secondary-container)',
    fgSub:       'color-mix(in srgb, var(--md-sys-color-on-secondary-container) 65%, transparent)',
    iconColor:   'color-mix(in srgb, var(--md-sys-color-on-secondary-container) 12%, transparent)',
  },
  tertiary: {
    bg:          'var(--md-sys-color-tertiary-container)',
    bgGradient:  'color-mix(in srgb, var(--md-sys-color-tertiary-container) 60%, var(--md-sys-color-surface-container-highest))',
    fg:          'var(--md-sys-color-on-tertiary-container)',
    fgSub:       'color-mix(in srgb, var(--md-sys-color-on-tertiary-container) 65%, transparent)',
    iconColor:   'color-mix(in srgb, var(--md-sys-color-on-tertiary-container) 12%, transparent)',
  },
};

export interface M3BannerHeroProps {
  /** Page/section title. Uses display-small scale for full impact. */
  title: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
  /** Material Symbol name for the large decorative background icon (200%+ opacity icon). */
  decorativeIcon?: string;
  /** Color role. Default: 'primary' */
  color?: BannerColor;
  /**
   * 'full' (default): page-section hero with display typography, tall padding, floating icon.
   * 'compact': section header with headline-medium, reduced padding. Use inside views.
   */
  variant?: 'full' | 'compact';
  /** Optional chip/button actions row below the subtitle. */
  actions?: React.ReactNode;
  /**
   * When true, removes border-radius (flush with viewport edge).
   * Use for top-of-page banners.
   */
  fullBleed?: boolean;
  style?: React.CSSProperties;
}

/**
 * M3BannerHero — Transformative-level page hero section.
 *
 * @example — Full hero (top of Dashboard)
 * <M3BannerHero
 *   title="Benvenuto"
 *   subtitle="Ecco le tue attività di oggi"
 *   decorativeIcon="school"
 *   color="primary"
 *   fullBleed
 * />
 *
 * @example — Compact section header
 * <M3BannerHero
 *   title="I tuoi studenti"
 *   decorativeIcon="group"
 *   color="secondary"
 *   variant="compact"
 * />
 */
const M3BannerHero: React.FC<M3BannerHeroProps> = ({
  title,
  subtitle,
  decorativeIcon,
  color = 'primary',
  variant = 'full',
  actions,
  fullBleed = false,
  style,
}) => {
  const tokens = COLOR_TOKENS[color];
  const isCompact = variant === 'compact';

  return (
    <>
      <style>{BANNER_KEYFRAMES}</style>
      <div
        className="_m3bh-enter-anim" // eslint-disable-line design-system/no-classname -- animation target class for CSS @keyframes
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: fullBleed
            ? '0'
            : isCompact
              ? 'var(--md-sys-shape-corner-extra-large)'
              : 'var(--md-sys-shape-corner-extra-large)',
          background: isCompact
            ? tokens.bg
            : `linear-gradient(135deg, ${tokens.bg} 0%, ${tokens.bgGradient} 100%)`,
          padding: isCompact
            ? 'var(--md-sys-spacing-4) var(--md-sys-spacing-5)'
            : 'var(--md-sys-spacing-8) var(--md-sys-spacing-6) var(--md-sys-spacing-7)',
          // eslint-disable-next-line design-system/no-hardcoded-motion-values -- 500ms is a CSS fallback inside var(), not a standalone hardcoded value
          animation: `_m3bh-enter var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`,
          willChange: 'opacity, transform',
          ...style,
        }}
      >
        {/* Oversized decorative icon — floats in background */}
        {decorativeIcon && (
          <span
            className="material-symbols-outlined _m3bh-icon-anim"
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: isCompact
                ? 'calc(var(--md-sys-spacing-3) * -1)'
                : 'calc(var(--md-sys-spacing-6) * -1)',
              bottom: isCompact
                ? 'calc(var(--md-sys-spacing-3) * -1)'
                : 'calc(var(--md-sys-spacing-6) * -1)',
              fontSize: isCompact
                ? 'var(--md-sys-spacing-24, 96px)'
                : 'var(--md-sys-spacing-40, 160px)',
              color: tokens.iconColor,
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
              fontVariationSettings: '"FILL" 1, "wght" 200, "opsz" 48',
              animation: isCompact
                ? 'none'
                : `_m3bh-icon-float 6000ms var(--md-sys-motion-easing-standard) infinite`,
            }}
          >
            {decorativeIcon}
          </span>
        )}

        {/* Gradient overlay for readability on full variant */}
        {!isCompact && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, ${tokens.bg} 40%, transparent 100%)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 'var(--md-sys-z-content)' }}>
          {/* Title */}
          <div
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: isCompact
                ? 'var(--md-sys-typescale-headline-medium-font-size)'
                : 'var(--md-sys-typescale-display-small-font-size)',
              fontWeight: isCompact
                ? 'var(--md-sys-typescale-headline-medium-font-weight)'
                : 'var(--md-sys-typescale-weight-bold)',
              lineHeight: isCompact
                ? 'var(--md-sys-typescale-headline-medium-line-height)'
                : 'var(--md-sys-typescale-display-small-line-height)',
              letterSpacing: isCompact
                ? 'var(--md-sys-typescale-headline-medium-tracking)'
                : 'var(--md-sys-typescale-display-small-tracking)',
              color: tokens.fg,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                marginTop: isCompact ? 'var(--md-sys-spacing-1)' : 'var(--md-sys-spacing-3)',
                fontFamily: 'var(--font-family)',
                fontSize: isCompact
                  ? 'var(--md-sys-typescale-body-medium-font-size)'
                  : 'var(--md-sys-typescale-title-medium-font-size)',
                fontWeight: isCompact
                  ? 'var(--md-sys-typescale-body-medium-font-weight)'
                  : 'var(--md-sys-typescale-title-medium-font-weight)',
                lineHeight: isCompact
                  ? 'var(--md-sys-typescale-body-medium-line-height)'
                  : 'var(--md-sys-typescale-title-medium-line-height)',
                color: tokens.fgSub,
              }}
            >
              {subtitle}
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

export default M3BannerHero;
