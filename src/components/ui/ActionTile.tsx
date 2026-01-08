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
import M3Typography from './M3Typography';

interface ActionTileProps {
    title: string;
    subtitle?: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
    className?: string;
    tooltip?: string;
    ariaLabel?: string;
}

const ActionTile: React.FC<ActionTileProps> = ({
    title,
    subtitle,
    icon,
    onClick,
    variant = 'surface',
    className = '',
    tooltip,
    ariaLabel
}) => {
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'var(--md-sys-color-primary-container)',
                    iconColor: 'var(--md-sys-color-on-primary-container)',
                    iconBg: 'var(--md-sys-color-primary-container)'
                };
            case 'secondary':
                return {
                    background: 'var(--md-sys-color-secondary-container)',
                    iconColor: 'var(--md-sys-color-on-secondary-container)',
                    iconBg: 'var(--md-sys-color-secondary-container)'
                };
            case 'tertiary':
                return {
                    background: 'var(--md-sys-color-tertiary-container)',
                    iconColor: 'var(--md-sys-color-on-tertiary-container)',
                    iconBg: 'var(--md-sys-color-tertiary-container)'
                };
            case 'surface':
            default:
                return {
                    background: 'var(--md-sys-color-surface-container)',
                    iconColor: 'var(--md-sys-color-on-surface)',
                    iconBg: 'var(--md-sys-color-surface-variant)'
                };
        }
    };

    const colors = getVariantColors();

    return (
        <button
            onClick={onClick}
            className={className}
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
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
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
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    border: `1px solid var(--md-sys-color-outline-variant)`
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
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
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '20px',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    chevron_right
                </span>
            </div>

            {/* Sweep effect */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none'
                }}
            />
        </button>
    );
};

export default ActionTile;
