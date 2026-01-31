// MD3 Compliant - Updated for layered theme access
import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
}

/**
 * EmptyState - Component for displaying empty state messages.
 * Shows an icon, title, and description when no content is available.
 */

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = 'inbox'
}) => {

    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--md-sys-spacing-8)',
        textAlign: 'center',
        backgroundColor: `color-mix(in srgb, var(--md-sys-color-surface-container-low) var(--md-sys-state-opacity-50), transparent)`,
        backdropFilter: 'blur(var(--md-sys-blur-small))',
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        border: `var(--md-sys-border-width-normal) dashed color-mix(in srgb, var(--md-sys-color-outline-variant) var(--md-sys-state-opacity-30), transparent)`
    }}>
        <div style={{
            width: 'var(--md-sys-spacing-16)',
            height: 'var(--md-sys-spacing-16)',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--md-sys-spacing-4)',
            color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-state-opacity-30), transparent)`,
            boxShadow: 'var(--md-sys-elevation-level1)'
        }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: 'var(--app-text-display)',
                fontWeight: 300
            }}>{icon}</span>
        </div>
        <h3 style={{
            fontSize: 'var(--app-text-title)',
            fontFamily: 'var(--md-sys-typescale-font-family)',
            color: 'var(--md-sys-color-on-surface)',
            fontWeight: 800,
            letterSpacing: '-0.025em'
        }}>{title}</h3>
        <p style={{
            fontSize: 'var(--app-text-body)',
            fontFamily: 'var(--md-sys-typescale-font-family)',
            color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-state-opacity-60), transparent)`,
            maxWidth: 'var(--md-sys-spacing-16)',
            margin: `var(--md-sys-spacing-4) auto 0`,
            fontWeight: 700,
            fontStyle: 'italic'
        }}>
            "{description}"
        </p>
    </div>
    );
};

export default EmptyState;








