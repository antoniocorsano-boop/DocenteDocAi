// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React, { useState } from 'react';

// MD3 Token Constants - Direct CSS Variables
const MD3_TOKENS = {
  // Colors
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
  primary: 'var(--md-sys-color-primary)',
  secondaryContainer: 'var(--md-sys-color-secondary-container)',
  onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
  secondary: 'var(--md-sys-color-secondary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
  tertiary: 'var(--md-sys-color-tertiary)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  onSurface: 'var(--md-sys-color-on-surface)',
  surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
  onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',

  // Shape
  cornerLarge: 'var(--md-sys-shape-corner-large)',

  // Spacing
  spacing1: 'var(--md-sys-spacing-1)',
  spacing4: 'var(--md-sys-spacing-4)',
  spacing8: 'var(--md-sys-spacing-8)',
  spacing14: 'var(--md-sys-spacing-14)',
  spacing16: 'var(--md-sys-spacing-16)',
  spacing32: 'var(--md-sys-spacing-32)',

  // Blur
  blurLarge: 'var(--md-sys-blur-large)',
  blur48: 'var(--md-sys-blur-48)',

  // Border Width
  borderWidthNormal: 'var(--md-sys-border-width-normal)',

  // Percentages
  percent0: 'var(--md-sys-percent-0)',
  percent70: 'var(--md-sys-percent-70)',

  // Motion
  durationShort2: 'var(--md-sys-motion-duration-short2)',
  easingStandard: 'var(--md-sys-motion-easing-standard)',

  // Elevation
  elevation1: 'var(--md-sys-elevation-level1)',
  elevation2: 'var(--md-sys-elevation-level2)',
  elevation3: 'var(--md-sys-elevation-level3)',

  // Typography
  displaySmallFontSize: 'var(--md-sys-typescale-display-large-font-size)',
  titleMediumFontSize: 'var(--md-sys-typescale-title-large-font-size)',
  headlineSmallFontSize: 'var(--md-sys-typescale-title-large-font-size)',
  headlineSmallFontFamily: 'var(--md-sys-typescale-headline-small-font-family)',
  bodyLargeFontSize: 'var(--md-sys-typescale-body-large-font-size)',
  bodyLargeFontFamily: 'var(--md-sys-typescale-body-large-font-family)',
} as const;

interface M3ExpressiveCardProps {
    icon: string;
    title: string;
    description: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' | string;
    onClick?: () => void;
    children?: React.ReactNode;
    ariaLabel?: string;
    style?: React.CSSProperties;
}

/**
 * M3ExpressiveCard - Expressive card component built on M3SurfaceCard base.
 * Provides enhanced visual styling with glass effects and decorative elements.
 */
const M3ExpressiveCard: React.FC<M3ExpressiveCardProps> = ({
    icon,
    title,
    description,
    color = 'surface',
    onClick,
    children,
    ariaLabel,
    style,
}) => {
  const [hovered, setHovered] = useState(false);
    const palette = {
        primary: { bg: MD3_TOKENS.primaryContainer, fg: MD3_TOKENS.onPrimaryContainer, accent: MD3_TOKENS.primary },
        secondary: { bg: MD3_TOKENS.secondaryContainer, fg: MD3_TOKENS.onSecondaryContainer, accent: MD3_TOKENS.secondary },
        tertiary: { bg: MD3_TOKENS.tertiaryContainer, fg: MD3_TOKENS.onTertiaryContainer, accent: MD3_TOKENS.tertiary },
        surface: { bg: MD3_TOKENS.surfaceContainerHigh, fg: MD3_TOKENS.onSurface, accent: MD3_TOKENS.primary },
        surfaceVariant: { bg: MD3_TOKENS.surfaceContainerLow, fg: MD3_TOKENS.onSurfaceVariant, accent: MD3_TOKENS.secondary }
    }[color] || { bg: color, fg: 'inherit', accent: MD3_TOKENS.primary };

    const isClickable = Boolean(onClick);

    const cardStyle: React.CSSProperties = {
        position: 'relative',
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `${MD3_TOKENS.borderWidthNormal} solid ${MD3_TOKENS.outlineVariant}`,
        borderRadius: MD3_TOKENS.cornerLarge,
        padding: MD3_TOKENS.spacing8,
        minHeight: MD3_TOKENS.spacing8,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: `blur(${MD3_TOKENS.blurLarge})`,
        WebkitBackdropFilter: `blur(${MD3_TOKENS.blurLarge})`,
        transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        cursor: isClickable ? 'pointer' : 'default',
        boxShadow: hovered ? 'var(--md-sys-elevation-level3)' : 'var(--md-sys-elevation-level1)',
        outline: 'none',
    };

    return (
        <div
            style={{ ...cardStyle, ...style }}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={ariaLabel || (isClickable ? `${title}: ${description}` : undefined)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            // onFocus={() => setFocused(true)}
            // onBlur={() => setFocused(false)}
        >
            {/* Icon and arrow row */}
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: MD3_TOKENS.spacing4}}>
                <div style={{
                    width: 'var(--md-sys-spacing-10)',
                    height: 'var(--md-sys-spacing-10)',
                    borderRadius: MD3_TOKENS.cornerLarge,
                    background: 'var(--md-sys-color-surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                        color: palette.accent,
                        userSelect: 'none',
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    }}>{icon}</span>
                </div>
                {isClickable && (
                    <span className="material-symbols-outlined" style={{
                        fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                        transition: `opacity var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                        opacity: hovered ? 0.7 : 0.5
                    }}>arrow_forward</span>
                )}
            </div>

            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)'}}>
                <h3 style={{
                    fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                    fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
                    fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                    letterSpacing: 'var(--md-sys-typescale-title-medium-letter-spacing)',
                    lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
                    color: 'var(--md-sys-color-on-surface)'
                }}>{title}</h3>
                <p style={{
                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                    fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{description}</p>
                {children && <div style={{
                    paddingTop: MD3_TOKENS.spacing4,
                    marginTop: MD3_TOKENS.spacing4,
                    borderTop: `${MD3_TOKENS.borderWidthNormal} solid var(--md-sys-color-outline-variant)`
                }}>{children}</div>}
            </div>
        </div>
    );
};

export default M3ExpressiveCard;

