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
    const { colors: themeColors, spacing, motion } = useTheme();

    return (
        <button
            className={`m3-theme-card ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            title={name}
            aria-label={`Seleziona tema ${name}`}
            style={{
                borderRadius: spacing.md,
                transition: `all ${motion.durationShort4} ${motion.easingStandard}`,
                border: isSelected ? `2px solid ${themeColors.primary}` : `1px solid ${themeColors.outlineVariant}`,
                backgroundColor: themeColors.surfaceContainerLow,
                padding: spacing.sm,
                cursor: 'pointer'
            }}
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







