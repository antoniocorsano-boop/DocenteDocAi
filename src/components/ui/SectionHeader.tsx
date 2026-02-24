import React from 'react';
import M3Typography from './M3Typography';

/**
 * SectionHeader Component
 *
 * Displays a section header with optional icon, title, and subtitle.
 * Uses MD3 design tokens for consistent styling.
 */

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    icon
}) => {

    return (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--app-spacing-container)',
            marginBottom: 'var(--app-spacing-container)',
            marginTop: 'var(--app-spacing-container)',
            paddingLeft: 'var(--app-spacing-container)',
            paddingRight: 'var(--app-spacing-container)'
        }}
    >
        {icon && (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'var(--md-sys-spacing-8)',
                    height: 'var(--md-sys-spacing-8)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: 'var(--app-color-primary-container)',
                    color: 'var(--app-color-on-primary-container)'
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-spacing-section)'
                    }}
                >
                    {icon}
                </span>
            </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <M3Typography
                variant="label-large"
                style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5em',
                    color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-percent-40), transparent)`
                }}
            >
                {title}
            </M3Typography>
            {subtitle && (
                <M3Typography
                    variant="body-small"
                    style={{
                        marginTop: 'var(--app-spacing-component)',
                        color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-percent-60), transparent)`
                    }}
                >
                    {subtitle}
                </M3Typography>
            )}
        </div>
    </div>
    );
};

export default SectionHeader;








