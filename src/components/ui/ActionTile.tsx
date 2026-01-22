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
  const { layers: { sys: { colors }, ref: { spacing, shape }, elevation, motion } } = useTheme();
    // MD3 color mapping for variants
    const getVariantColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: colors.primaryContainer,
                    iconColor: colors.onPrimaryContainer,
                    iconBg: colors.primary
                };
            case 'secondary':
                return {
                    background: colors.secondaryContainer,
                    iconColor: colors.onSecondaryContainer,
                    iconBg: colors.secondary
                };
            case 'tertiary':
                return {
                    background: colors.tertiaryContainer,
                    iconColor: colors.onTertiaryContainer,
                    iconBg: colors.tertiary
                };
            case 'surface':
            default:
                return {
                    background: colors.surface,
                    iconColor: colors.onSurface,
                    iconBg: colors.surfaceVariant
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
                borderRadius: shape.corner.large,
                padding: spacing[4],
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[4],
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                boxShadow: hovered ? elevation.level2 : elevation.level1,
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                minHeight: spacing[12],
                width: '100%',
                outline: focused ? `2px solid ${colors.primary}` : 'none',
                outlineOffset: focused ? spacing[2] : '0',
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
                    width: spacing[8],
                    height: spacing[8],
                    borderRadius: shape.corner.large,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: spacing[6],
                    backgroundColor: variantColors.iconBg,
                    color: variantColors.iconColor,
                    flexShrink: 0,
                    boxShadow: elevation.level1,
                    border: `1px solid ${colors.outlineVariant}`,
                    transition: `box-shadow ${motion.duration.short2} ${motion.easing.standard}`
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: spacing[6]
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
                gap: layers.ref.spacing['2']
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
                    width: layers.ref.spacing['8'],
                    height: layers.ref.spacing['8'],
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
                        fontSize: layers.ref.spacing['6'],
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







