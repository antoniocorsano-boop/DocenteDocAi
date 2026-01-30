// MD3 Compliant - Block J Migration Complete (4 violations eliminated)

import React from 'react';
import { useTheme } from '../theme/theme';

interface ThemeBubbleProps {
    name: string;
    colors: { primary: string; secondary: string; tertiary: string };
    isSelected: boolean;
    onClick: () => void;
}

const ThemeBubble: React.FC<ThemeBubbleProps> = ({ name, colors, isSelected, onClick }) => {
    const { layers: { sys: { colors: themeColors }, ref: { spacing } } } = useTheme();

    return (
        <button
            style={{
                borderRadius: 'var(--md-sys-shape-corner-large)',
                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-easing-standard) var(--app-motion-standard)',
                border: isSelected ? 'var(--app-border-thick) solid var(--app-color-primary)' : 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)',
                backgroundColor: isSelected ? 'var(--app-color-primary-container)' : 'var(--app-color-surface-container)',
                color: isSelected ? 'var(--app-color-on-primary-container)' : 'var(--app-color-on-surface)',
                padding: 'var(--app-spacing-container)',
                cursor: 'pointer'
            }}
            onClick={onClick}
            title={name}
            aria-label={`Seleziona tema ${name}`}
        >
            <div >
                {/* Background (Primary) */}
                <div  style={{ backgroundColor: colors.primary }}></div>

                {/* Shapes */}
                <div  style={{ backgroundColor: colors.secondary }}></div>
                <div  style={{ backgroundColor: colors.tertiary }}></div>

                {/* Checkmark Overlay */}
                <div  style={{ color: themeColors.primary }}>
                     <span  style={{ fontSize: "var(--app-text-title)", fontWeight: "bold" }}>check_circle</span>
                </div>
            </div>

            <div  style={{
                color: themeColors.onSurface,
                fontSize: 'var(--app-text-body)',
                fontWeight: 500,
                marginTop: spacing.xs
            }}>
                {name}
            </div>
        </button>
    );
};

export default ThemeBubble;








