/**
 * ActionTile Component - MD3 Compliant
 *
 * Interactive tile component for action buttons with Material Design 3 styling.
 * Supports multiple variants (primary, secondary, tertiary, surface) with proper
 * accessibility, hover states, and responsive design.
 *
 * @version 2.0.0 - MD3 Migration
 * @since 2024-01-08
 */

import React from 'react';
import { useTheme } from '../../theme/theme';
import M3Typography from './M3Typography';

interface ActionTileProps {
    title: string;
    subtitle?: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
    tooltip?: string;
    ariaLabel?: string;
}

const ActionTile: React.FC<ActionTileProps> = ({
    title,
    subtitle,
    icon,
    onClick,
    variant = 'surface',
    tooltip,
    ariaLabel
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'var(--md-sys-color-primary-container)',
                    iconColor: 'var(--md-sys-color-on-primary-container)',
                    iconBg: 'var(--md-sys-color-primary)' // or another suitable M3 token
                };
            case 'secondary':
                return {
                    background: 'var(--md-sys-color-secondary-container)',
                    iconColor: 'var(--md-sys-color-on-secondary-container)',
                    iconBg: 'var(--md-sys-color-secondary)'
                };
            case 'tertiary':
                return {
                    background: 'var(--md-sys-color-tertiary-container)',
                    iconColor: 'var(--md-sys-color-on-tertiary-container)',
                    iconBg: 'var(--md-sys-color-tertiary)'
                };
            case 'surface':
            default:
                return {
                    background: 'var(--md-sys-color-surface)',
                    iconColor: 'var(--md-sys-color-on-surface)',
                    iconBg: 'var(--md-sys-color-surface-variant)'
                };
        }
    };

    const colors = getVariantColors();

    return (
        <button
            onClick={onClick}
            title={tooltip}
            aria-label={ariaLabel || `${title}${subtitle ? ` - ${subtitle}` : ''}`}
            type="button"
            style={{
                backgroundColor: colors.background,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: 'var(--md-sys-spacing-8)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-4)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                boxShadow: 'var(--md-sys-elevation-level1)',
                minHeight: '80px',
                width: '100%',
                outline: 'none',
                transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
                e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
            }}
        >
            {/* Icon Container */}
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    backgroundColor: colors.iconBg,
                    color: colors.iconColor,
                    flexShrink: 0,
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    border: `1px solid var(--md-sys-color-outline-variant)`,
                    transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <span
                    // eslint-disable-next-line design-system/no-classname
                    className="material-symbols-outlined"
                    style={{ fontSize: '28px' }}
                >
                    {icon}
                </span>
            </div>

            {/* Content */}
            <div style={{
                flexGrow: 1,
                minWidth: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-1)'
            }}>
                <M3Typography
                    variant="title-medium"
                    style={{
                        color: 'var(--md-sys-color-on-surface)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: 0
                    }}
                >
                    {title}
                </M3Typography>
                {subtitle && (
                    <M3Typography
                        variant="label-medium"
                        style={{
                            color: 'var(--md-sys-color-on-surface-variant)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                        }}
                    >
                        {subtitle}
                    </M3Typography>
                )}
            </div>

            {/* Chevron */}
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--md-sys-color-surface-variant)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    flexShrink: 0,
                    transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <span
                    // eslint-disable-next-line design-system/no-classname
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '20px',
                        transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    chevron_right
                </span>
            </div>

            {/* Sweep effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, var(--md-sys-color-surface-disabled), transparent)',
                    transform: 'translateX(-100%)',
                    pointerEvents: 'none',
                    transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(100%)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(-100%)';
                }}
            />
        </button>
    );
};

export default ActionTile;


