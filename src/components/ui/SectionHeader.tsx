// MD3 Compliant — Section Header
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
    style?: React.CSSProperties;
    className?: string;
    variant?: string;
    actions?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    icon,
    style,
    className
}) => {

    return (
    <div
        className={className}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-4)',
            marginBottom: 'var(--md-sys-spacing-4)',
            marginTop: 'var(--md-sys-spacing-4)',
            paddingLeft: 'var(--md-sys-spacing-4)',
            paddingRight: 'var(--md-sys-spacing-4)',
            ...style
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
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)'
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: 'var(--icon-size-medium)'
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
                    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
                    color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-percent-40), transparent)`
                }}
            >
                {title}
            </M3Typography>
            {subtitle && (
                <M3Typography
                    variant="body-small"
                    style={{
                        marginTop: 'var(--md-sys-spacing-2)',
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

