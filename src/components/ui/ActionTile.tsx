// MD3 Compliant - Updated for layered theme access
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

import React, { useState } from 'react';
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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'var(--md-sys-color-primary-container)',
                    iconColor: 'var(--md-sys-color-on-primary-container)',
                    iconBg: 'var(--md-sys-color-primary)'
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

    const variantColors = getVariantColors();

    return (
        <button
            onClick={onClick}
            title={tooltip}
            aria-label={ariaLabel || `${title}${subtitle ? ` - ${subtitle}` : ''}`}
            type="button"
            style={{
                backgroundColor: variantColors.background,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: 'var(--md-sys-spacing-4)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-4)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                boxShadow: hovered ? 'var(--md-sys-elevation-level2)' : 'var(--md-sys-elevation-level1)',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                minHeight: 'var(--md-sys-spacing-12)',
                width: '100%',
                outline: focused ? `2px solid var(--md-sys-color-primary)` : 'none',
                outlineOffset: focused ? 'var(--md-sys-spacing-2)' : '0',
                transition: `box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), transform var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            {/* Icon Container */}
            <div
                style={{
                    width: 'var(--md-sys-spacing-8)',
                    height: 'var(--md-sys-spacing-8)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--md-sys-spacing-6)',
                    backgroundColor: variantColors.iconBg,
                    color: variantColors.iconColor,
                    flexShrink: 0,
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    border: `1px solid var(--md-sys-color-outline-variant)`,
                    transition: `box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--md-sys-spacing-6)'
                    }}
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
                gap: 'var(--md-sys-spacing-2)'
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
                            letterSpacing: '0.08em'}}
                    >
                        {subtitle}
                    </M3Typography>
                )}
            </div>

            {/* Chevron */}
            <div
                style={{
                    width: 'var(--md-sys-spacing-8)',
                    height: 'var(--md-sys-spacing-8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--md-sys-color-surface-variant)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    flexShrink: 0,
                    transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--md-sys-spacing-6)',
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
                    background: `linear-gradient(90deg, transparent, var(--md-sys-color-surface-disabled), transparent)`,
                    transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
                    pointerEvents: 'none',
                    transition: `transform 600ms var(--md-sys-motion-easing-standard)`
                }}
            />
        </button>
    );
};

export default ActionTile;







