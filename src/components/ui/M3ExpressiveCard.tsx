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
  spacing4: 'var(--md-sys-spacing-4)',
  spacing8: 'var(--md-sys-spacing-8)',
  spacing32: 'var(--md-sys-spacing-32)',

  // Motion
  durationShort2: 'var(--md-sys-motion-duration-short2)',
  easingStandard: 'var(--md-sys-motion-easing-standard)',

  // Elevation
  elevation1: 'var(--md-sys-elevation-level1)',
  elevation2: 'var(--md-sys-elevation-level2)',
  elevation3: 'var(--md-sys-elevation-level3)',

  // Typography
  displaySmallFontSize: 'var(--md-sys-typescale-display-small-font-size)',
  titleMediumFontSize: 'var(--md-sys-typescale-title-medium-font-size)',
  headlineSmallFontSize: 'var(--md-sys-typescale-headline-small-font-size)',
  headlineSmallFontFamily: 'var(--md-sys-typescale-headline-small-font-family)',
  bodyLargeFontSize: 'var(--md-sys-typescale-body-large-font-size)',
  bodyLargeFontFamily: 'var(--md-sys-typescale-body-large-font-family)',
} as const;

const isValidColor = (color: string): color is 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' => {
  const validColors: ('primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant')[] = ['primary', 'secondary', 'tertiary', 'surface', 'surfaceVariant'];
  return validColors.includes(color as 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant');
};

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
        border: `1px solid ${MD3_TOKENS.outlineVariant}`,
        borderRadius: MD3_TOKENS.cornerLarge,
        padding: MD3_TOKENS.spacing8,
        minHeight: MD3_TOKENS.spacing8,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: `all ${MD3_TOKENS.durationShort2} ${MD3_TOKENS.easingStandard}`,
        cursor: isClickable ? 'pointer' : 'default',
        boxShadow: hovered ? MD3_TOKENS.elevation3 : MD3_TOKENS.elevation1,
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
                    top: '-4rem',
                    right: '-4rem',
                    width: MD3_TOKENS.spacing32,
                    height: MD3_TOKENS.spacing32,
                    filter: 'blur(3rem)',
                    pointerEvents: 'none',
                    opacity: 0.2,
                    borderRadius: MD3_TOKENS.spacing32,
                    background: `radial-gradient(circle, ${palette.accent}20 0%, transparent 70%)`
                }}
            ></div>

            {/* Subtle accent bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '0.25rem',
                    opacity: 0.6,
                    backgroundColor: palette.accent,
                    borderTopLeftRadius: MD3_TOKENS.cornerLarge,
                    borderTopRightRadius: MD3_TOKENS.cornerLarge
                }}
            ></div>

            <div style={{position: 'relative', zIndex: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: MD3_TOKENS.spacing4}}>
                <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: MD3_TOKENS.cornerLarge,
                    background: 'linear-gradient(to bottom right, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: MD3_TOKENS.elevation2,
                    border: `1px solid rgba(255,255,255,0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: MD3_TOKENS.displaySmallFontSize,
                        opacity: 0.9,
                        userSelect: 'none',
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    }}>{icon}</span>
                </div>
                {isClickable && (
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: MD3_TOKENS.titleMediumFontSize,
                        transition: `opacity ${MD3_TOKENS.durationShort2} ${MD3_TOKENS.easingStandard}`,
                        opacity: hovered ? 0.7 : 0.5
                    }}>arrow_forward</span>
                )}
            </div>

            <div style={{position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: MD3_TOKENS.spacing4}}>
                <h3 style={{
                    fontSize: MD3_TOKENS.headlineSmallFontSize,
                    fontFamily: MD3_TOKENS.headlineSmallFontFamily,
                    fontWeight: 'bold',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.25'
                }}>{title}</h3>
                <p style={{
                    fontSize: MD3_TOKENS.bodyLargeFontSize,
                    fontFamily: MD3_TOKENS.bodyLargeFontFamily,
                    opacity: 0.8,
                    lineHeight: '1.625',
                    fontWeight: '500',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{description}</p>
                {children && <div style={{
                    paddingTop: MD3_TOKENS.spacing4,
                    marginTop: MD3_TOKENS.spacing4,
                    borderTop: `1px solid rgba(255,255,255,0.1)`
                }}>{children}</div>}
            </div>
        </div>
    );
};

export default M3ExpressiveCard;







