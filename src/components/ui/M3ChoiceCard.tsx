// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React, { useState } from 'react';

// MD3 Token Constants - Direct CSS Variables
const MD3_TOKENS = {
  // Colors
  primary: 'var(--md-sys-color-primary)',
  onPrimary: 'var(--md-sys-color-on-primary)',
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
  outline: 'var(--md-sys-color-outline)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',
  surfaceContainer: 'var(--md-sys-color-surface-container)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  surface: 'var(--md-sys-color-surface)',
  onSurface: 'var(--md-sys-color-on-surface)',

  // Shape
  cornerExtraLarge: 'var(--md-sys-shape-corner-extra-large)',
  cornerMedium: 'var(--md-sys-shape-corner-medium)',

  // Spacing
  spacing4: 'var(--md-sys-spacing-4)',
  spacing6: 'var(--md-sys-spacing-6)',
  spacing8: 'var(--md-sys-spacing-8)',
  spacing12: 'var(--md-sys-spacing-12)',
  spacing16: 'var(--md-sys-spacing-16)',

  // Motion
  durationShort2: 'var(--md-sys-motion-duration-short2)',
  easingStandard: 'var(--md-sys-motion-easing-standard)',

  // Elevation
  elevation2: 'var(--md-sys-elevation-level2)',
  elevation4: 'var(--md-sys-elevation-level4)',

  // Typography
  bodySmallFontSize: 'var(--md-sys-typescale-body-small-font-size)',
  bodySmallFontFamily: 'var(--md-sys-typescale-body-small-font-family)',
} as const;

interface M3ChoiceCardProps {
    icon: string;
    label: string;
    onClick: () => void;
    selected: boolean;
}

const M3ChoiceCard: React.FC<M3ChoiceCardProps> = ({
    icon,
    label,
    onClick,
    selected
}) => {
    const [hovered, setHovered] = useState(false);

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: MD3_TOKENS.spacing8,
        borderRadius: MD3_TOKENS.cornerExtraLarge,
        border: `var(--md-sys-border-width-thick) solid ${selected ? MD3_TOKENS.primary : hovered ? MD3_TOKENS.outline : `${MD3_TOKENS.outlineVariant}30`}`,
        backgroundColor: selected ? MD3_TOKENS.primaryContainer : hovered ? MD3_TOKENS.surfaceContainerHigh : `${MD3_TOKENS.surfaceContainer}80`,
        color: selected ? MD3_TOKENS.onPrimaryContainer : MD3_TOKENS.onSurface,
        boxShadow: selected ? MD3_TOKENS.elevation4 : 'none',
        transform: selected ? 'scale(1.05)' : 'none',
        transition: `all ${MD3_TOKENS.durationShort2} ${MD3_TOKENS.easingStandard}`,
        gap: MD3_TOKENS.spacing4,
        minWidth: MD3_TOKENS.spacing16,
        cursor: 'pointer',
        outline: 'none'
    };

    const iconContainerStyle: React.CSSProperties = {
        width: MD3_TOKENS.spacing12,
        height: MD3_TOKENS.spacing12,
        borderRadius: MD3_TOKENS.cornerMedium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${MD3_TOKENS.durationShort2} ${MD3_TOKENS.easingStandard}`,
        backgroundColor: selected ? MD3_TOKENS.primary : MD3_TOKENS.surface,
        color: selected ? MD3_TOKENS.onPrimary : MD3_TOKENS.primary,
        boxShadow: selected ? MD3_TOKENS.elevation2 : 'none',
        transform: hovered && !selected ? 'scale(1.1)' : 'none'
    };

    const iconStyle: React.CSSProperties = {
        fontFamily: 'Material Symbols Outlined',
        fontSize: MD3_TOKENS.spacing6,
        userSelect: 'none',
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    };

    const labelStyle: React.CSSProperties = {
        fontSize: MD3_TOKENS.bodySmallFontSize,
        fontFamily: MD3_TOKENS.bodySmallFontFamily,
        fontWeight: '800',
        letterSpacing: '0.2em',
        textTransform: 'uppercase'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            style={buttonStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={iconContainerStyle}>
                <span style={iconStyle}>{icon}</span>
            </div>
            <span style={labelStyle}>{label}</span>
        </button>
    );
};

export default M3ChoiceCard;








