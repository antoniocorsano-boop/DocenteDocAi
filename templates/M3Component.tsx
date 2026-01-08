/**
 * [ComponentName] Component - MD3 Compliant
 *
 * [Brief description of what this component does]
 *
 * @version 1.0.0
 * @since 2026-01-08
 */

import React from 'react';
import M3Typography from '../ui/M3Typography';

interface M3ComponentProps {
    // Define your props here
    title?: string;
    variant?: 'primary' | 'secondary' | 'surface';
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

const M3Component: React.FC<M3ComponentProps> = ({
    title,
    variant = 'surface',
    onClick,
    children,
    className = ''
}) => {
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'var(--md-sys-color-primary-container)',
                    onBackground: 'var(--md-sys-color-on-primary-container)'
                };
            case 'secondary':
                return {
                    background: 'var(--md-sys-color-secondary-container)',
                    onBackground: 'var(--md-sys-color-on-secondary-container)'
                };
            case 'surface':
            default:
                return {
                    background: 'var(--md-sys-color-surface-container)',
                    onBackground: 'var(--md-sys-color-on-surface)'
                };
        }
    };

    const colors = getVariantColors();

    return (
        <div
            className={`${className} m3-transition-hover`}
            style={{
                backgroundColor: colors.background,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: 'var(--md-sys-spacing-4)',
                boxShadow: 'var(--md-sys-elevation-level1)',
                border: `1px solid var(--md-sys-color-outline-variant)`,
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
            onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
                e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
            }}
        >
            {title && (
                <M3Typography
                    variant="title-medium"
                    style={{
                        color: colors.onBackground,
                        marginBottom: children ? 'var(--md-sys-spacing-2)' : '0',
                        fontWeight: 600
                    }}
                >
                    {title}
                </M3Typography>
            )}

            {children && (
                <div style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    lineHeight: 1.5
                }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default M3Component;