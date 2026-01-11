import React from 'react';
import M3Typography from './M3Typography';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    icon,
    className = ''
}) => (
    <div
        className={`flex items-center ${className}`}
        style={{
            gap: 'var(--md-sys-spacing-4)',
            marginBottom: 'var(--md-sys-spacing-6)',
            marginTop: 'var(--md-sys-spacing-6)',
            paddingLeft: 'var(--md-sys-spacing-4)',
            paddingRight: 'var(--md-sys-spacing-4)'
        }}
    >
        {icon && (
            <div
                className="flex items-center justify-center"
                style={{
                    width: 'var(--md-sys-spacing-6)',
                    height: 'var(--md-sys-spacing-6)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)'
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: 'var(--md-sys-spacing-4)'
                    }}
                >
                    {icon}
                </span>
            </div>
        )}
        <div className="flex flex-col">
            <M3Typography
                variant="label-large"
                style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5em',
                    color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 40%, transparent)'
                }}
            >
                {title}
            </M3Typography>
            {subtitle && (
                <M3Typography
                    variant="body-small"
                    style={{
                        marginTop: 'var(--md-sys-spacing-4)',
                        color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 60%, transparent)'
                    }}
                >
                    {subtitle}
                </M3Typography>
            )}
        </div>
    </div>
);

export default SectionHeader;


