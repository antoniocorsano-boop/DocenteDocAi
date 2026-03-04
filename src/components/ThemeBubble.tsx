// MD3 Compliant - Pure CSS tokens, no useTheme dependency

import React from 'react';

interface ThemeBubbleProps {
    name: string;
    colors: { primary: string; secondary: string; tertiary: string };
    isSelected: boolean;
    onClick: () => void;
}

const ThemeBubble: React.FC<ThemeBubbleProps> = ({ name, colors, isSelected, onClick }) => {

    return (
        <button
            style={{
                borderRadius: 'var(--md-sys-shape-corner-large)',
                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-medium)',
                border: isSelected ? 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)' : 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                backgroundColor: isSelected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                padding: 'var(--md-sys-spacing-4)',
                cursor: 'pointer'
            }}
            onClick={onClick}
            title={name}
            aria-label={`Seleziona tema ${name}`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                {/* Background (Primary) */}
                <div  style={{ backgroundColor: colors.primary }}></div>

                {/* Shapes */}
                <div  style={{ backgroundColor: colors.secondary }}></div>
                <div  style={{ backgroundColor: colors.tertiary }}></div>

                {/* Checkmark Overlay */}
                <div  style={{ color: 'var(--md-sys-color-primary)' }}>
                     <span  style={{ fontSize: "var(--md-sys-typescale-title-large-font-size)", fontWeight: "var(--md-sys-typescale-weight-bold)" }}>check_circle</span>
                </div>
            </div>

            <div  style={{
                color: 'var(--md-sys-color-on-surface)',
                fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                fontWeight: 'var(--md-sys-typescale-weight-medium)',
                marginTop: 'var(--md-sys-spacing-2)'
            }}>
                {name}
            </div>
        </button>
    );
};

export default ThemeBubble;

