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
            style={cardStyle}
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
            {/* Enhanced decorative background with gradient */}
            <div
                style={{
                    position: 'absolute',
                    top: `-${MD3_TOKENS.spacing16}`,
                    right: `-${MD3_TOKENS.spacing16}`,
                    width: MD3_TOKENS.spacing32,
                    height: MD3_TOKENS.spacing32,
                    filter: `blur(${MD3_TOKENS.blur48})`,
                    pointerEvents: 'none',
                    opacity: 0.2,
                    borderRadius: MD3_TOKENS.spacing32,
                    background: `radial-gradient(circle, ${palette.accent}20 ${MD3_TOKENS.percent0}, transparent ${MD3_TOKENS.percent70})`
                }}
            ></div>

            {/* Subtle accent bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: MD3_TOKENS.spacing1,
                    opacity: 0.6,
                    backgroundColor: palette.accent,
                    borderTopLeftRadius: MD3_TOKENS.cornerLarge,
                    borderTopRightRadius: MD3_TOKENS.cornerLarge
                }}
            ></div>

            <div style={{position: 'relative', zIndex: 'var(--md-sys-z-modal)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: MD3_TOKENS.spacing4}}>
                {/* MD3 z-index token */}
                <div style={{
                    width: MD3_TOKENS.spacing14,
                    height: MD3_TOKENS.spacing14,
                    borderRadius: MD3_TOKENS.cornerLarge,
                    background: 'var(--md-sys-color-surface-container-high)',
                    boxShadow: 'var(--md-sys-elevation-level2)',
                    border: `${MD3_TOKENS.borderWidthNormal} solid var(--md-sys-color-outline-variant)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: 'var(--md-sys-typescale-display-large-font-size)',
                        opacity: 0.9,
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

            <div style={{position: 'relative', zIndex: 'var(--md-sys-z-modal)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: MD3_TOKENS.spacing4}}>
                {/* MD3 z-index token */}
                <h3 style={{
                    fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                    fontFamily: 'var(--md-sys-typescale-headline-small-font-family)',
                    fontWeight: 'bold',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.25'
                }}>{title}</h3>
                <p style={{
                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                    fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                    opacity: 0.8,
                    lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                    fontWeight: '500',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
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

