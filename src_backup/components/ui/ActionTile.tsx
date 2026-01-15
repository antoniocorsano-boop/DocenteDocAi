// LEGACY - MD3 Non-compliant
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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { layers } = useTheme();
  const { sys, ref, elevation, motion } = layers;
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: sys.color.primaryContainer,
                    iconColor: sys.color.onPrimaryContainer,
                    iconBg: sys.color.primary
                };
            case 'secondary':
                return {
                    background: sys.color.secondaryContainer,
                    iconColor: sys.color.onSecondaryContainer,
                    iconBg: sys.color.secondary
                };
            case 'tertiary':
                return {
                    background: sys.color.tertiaryContainer,
                    iconColor: sys.color.onTertiaryContainer,
                    iconBg: sys.color.tertiary
                };
            case 'surface':
            default:
                return {
                    background: sys.color.surface,
                    iconColor: sys.color.onSurface,
                    iconBg: sys.color.surfaceVariant
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
                borderRadius: ref.shape.corner.large,
                padding: ref.spacing[8],
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: ref.spacing[4],
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                boxShadow: hovered ? elevation.level2 : elevation.level1,
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                minHeight: ref.spacing[80],
                width: '100%',
                outline: focused ? `2px solid ${sys.color.primary}` : 'none',
                outlineOffset: focused ? ref.spacing[2] : '0',
                transition: `box-shadow ${motion.duration.short2} ${motion.easing.standard}, transform ${motion.duration.short2} ${motion.easing.standard}`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            {/* Icon Container */}
            <div
                style={{
                    width: ref.spacing[56],
                    height: ref.spacing[56],
                    borderRadius: ref.shape.corner.large,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: ref.spacing[28],
                    backgroundColor: colors.iconBg,
                    color: colors.iconColor,
                    flexShrink: 0,
                    boxShadow: elevation.level1,
                    border: `1px solid ${sys.color.outlineVariant}`,
                    transition: `box-shadow ${motion.duration.short2} ${motion.easing.standard}`
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: ref.spacing[28]
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
                gap: ref.spacing[1]
            }}>
                <M3Typography
                    variant="title-medium"
                    style={{
                        color: sys.color.onSurface,
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
                            color: sys.color.onSurfaceVariant,
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
                    width: ref.spacing[40],
                    height: ref.spacing[40],
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: sys.color.surfaceVariant,
                    color: sys.color.onSurfaceVariant,
                    flexShrink: 0,
                    transition: `background-color ${motion.duration.short2} ${motion.easing.standard}`
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: ref.spacing[20],
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
                    background: `linear-gradient(90deg, transparent, ${sys.color.surfaceDisabled}, transparent)`,
                    transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
                    pointerEvents: 'none',
                    transition: `transform 600ms ${motion.easing.standard}`
                }}
            />
        </button>
    );
};

export default ActionTile;



