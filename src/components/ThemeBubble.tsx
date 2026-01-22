// LEGACY - MD3 Non-compliant

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
                transition: 'all var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-medium)',
                border: isSelected ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
                backgroundColor: isSelected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                padding: 'var(--md-sys-spacing-4)',
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
                     <span  style={{ fontSize: "1.5rem", fontWeight: "bold" }}>check_circle</span>
                </div>
            </div>

            <div  style={{
                color: themeColors.onSurface,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginTop: spacing.xs
            }}>
                {name}
            </div>
        </button>
    );
};

export default ThemeBubble;







