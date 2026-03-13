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
            onClick={onClick}
            title={name}
            aria-label={`Seleziona tema ${name}`}
            aria-pressed={isSelected}
            style={{
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: isSelected
                    ? 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)'
                    : 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                backgroundColor: isSelected
                    ? 'var(--md-sys-color-primary-container)'
                    : 'var(--md-sys-color-surface-container)',
                padding: 'var(--md-sys-spacing-3)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-2)',
                width: '100%',
                transition: [
                    'border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                    'background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                ].join(', '),
            }}
        >
            {/* Color preview: 3 horizontal bands */}
            <div style={{
                display: 'flex',
                width: '100%',
                height: '36px',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <div style={{ backgroundColor: colors.primary, flex: 1 }} />
                <div style={{ backgroundColor: colors.secondary, flex: 1 }} />
                <div style={{ backgroundColor: colors.tertiary, flex: 1 }} />

                {/* Checkmark overlay — only when selected */}
                {isSelected && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                    }}>
                        <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                            style={{ color: 'var(--md-sys-color-on-primary)', fontSize: '20px' }}
                        >check_circle</span>
                    </div>
                )}
            </div>

            {/* Theme name */}
            <span style={{
                fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                fontWeight: isSelected
                    ? 'var(--md-sys-typescale-weight-bold)'
                    : 'var(--md-sys-typescale-weight-medium)',
                color: isSelected
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-on-surface)',
                textAlign: 'center',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
            }}>
                {name}
            </span>
        </button>
    );
};

export default ThemeBubble;

