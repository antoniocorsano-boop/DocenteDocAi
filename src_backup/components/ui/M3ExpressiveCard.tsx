// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

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
  const { layers } = useTheme();
  const { sys, ref, motion, elevation } = layers;
    const palette = {
        primary: { bg: sys.color.primaryContainer, fg: sys.color.onPrimaryContainer, accent: sys.color.primary },
        secondary: { bg: sys.color.secondaryContainer, fg: sys.color.onSecondaryContainer, accent: sys.color.secondary },
        tertiary: { bg: sys.color.tertiaryContainer, fg: sys.color.onTertiaryContainer, accent: sys.color.tertiary },
        surface: { bg: sys.color.surfaceContainerHigh, fg: sys.color.onSurface, accent: sys.color.primary },
        surfaceVariant: { bg: sys.color.surfaceContainerLow, fg: sys.color.onSurfaceVariant, accent: sys.color.secondary }
    }[color] || { bg: color, fg: 'inherit', accent: sys.color.primary };

    const isClickable = Boolean(onClick);

    const cardStyle: React.CSSProperties = {
        position: 'relative',
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `1px solid ${sys.color.outlineVariant}`,
        borderRadius: ref.shape.corner.large,
        padding: ref.spacing[32], // p-8
        minHeight: ref.spacing[160],
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
        cursor: isClickable ? 'pointer' : 'default',
        boxShadow: hovered ? elevation.level3 : elevation.level1,
        outline: 'none',
        // For focus
        // outline: focused ? `2px solid ${sys.color.primary}` : 'none',
        // outlineOffset: ref.spacing[2],
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
                    width: ref.spacing[160],
                    height: ref.spacing[160],
                    filter: 'blur(3rem)',
                    pointerEvents: 'none',
                    opacity: 0.2,
                    borderRadius: ref.spacing[9999],
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
                    borderTopLeftRadius: ref.shape.corner.large,
                    borderTopRightRadius: ref.shape.corner.large
                }}
            ></div>

            <div style={{position: 'relative', zIndex: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: ref.spacing[6]}}>
                <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: ref.shape.corner.large,
                    background: 'linear-gradient(to bottom right, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: elevation.level2,
                    border: `1px solid rgba(255,255,255,0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: ref.typography.displaySmall.fontSize,
                        opacity: 0.9,
                        userSelect: 'none',
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    }}>{icon}</span>
                </div>
                {isClickable && (
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: ref.typography.titleMedium.fontSize,
                        transition: `opacity ${motion.duration.short2} ${motion.easing.standard}`,
                        // group-hover:opacity-70, but since no group, use hovered
                        opacity: hovered ? 0.7 : 0.5
                    }}>arrow_forward</span>
                )}
            </div>

            <div style={{position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: ref.spacing[3]}}>
                <h3 style={{
                    fontSize: ref.typography.headlineSmall.fontSize,
                    fontFamily: ref.typography.headlineSmall.fontFamily,
                    fontWeight: 'bold',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.25'
                }}>{title}</h3>
                <p style={{
                    fontSize: ref.typography.bodyLarge.fontSize,
                    fontFamily: ref.typography.bodyLarge.fontFamily,
                    opacity: 0.8,
                    lineHeight: '1.625',
                    fontWeight: '500',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{description}</p>
                {children && <div style={{
                    paddingTop: ref.spacing[3],
                    marginTop: ref.spacing[4],
                    borderTop: `1px solid rgba(255,255,255,0.1)`
                }}>{children}</div>}
            </div>
        </div>
    );
};

export default M3ExpressiveCard;



