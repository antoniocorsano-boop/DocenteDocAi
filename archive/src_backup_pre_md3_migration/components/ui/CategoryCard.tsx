// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

/**
 * CategoryCard Component - MD3 Pure Migration
 *
 * Interactive category selection card with Material Design 3 token-based styling.
 * Supports selection states, hover effects, and accessibility features.
 *
 * @version 2.0.0 - MD3 Pure Migration
 * @since 2026-01-11
 */

import React, { useState } from 'react';
import M3Typography from './M3Typography';
import { useTheme } from '../../theme/theme';

interface CategoryCardProps {
    id: string;
    label: string;
    icon: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
    description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    label,
    icon,
    color,
    isSelected,
    onClick,
    description
}) => {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const { layers } = useTheme();
    const { sys, ref, motion, elevation } = layers;

    return (
    <div
        onClick={onClick}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: ref.spacing[4],
            padding: ref.spacing[5],
            borderRadius: ref.shape.corner.large,
            border: isSelected ? `2px solid ${sys.color.primary}` : `1px solid ${sys.color.outlineVariant}`,
            backgroundColor: isSelected
                ? sys.color.primaryContainer
                : (hovered && !isSelected ? sys.color.surfaceContainerHigh : sys.color.surfaceContainer),
            boxShadow: isSelected
                ? elevation.level3
                : elevation.level1,
            cursor: 'pointer',
            transition: `all ${motion.duration.medium} ${motion.easing.standard}`,
            transform: isSelected ? 'scale(1.02)' : (hovered && !isSelected ? 'scale(1.01)' : 'scale(1)'),
            outline: focused ? `2px solid ${sys.color.primary}` : 'none',
            outlineOffset: focused ? ref.spacing[2] : '0'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
    >
        <div
            style={{
                width: ref.spacing[64],
                height: ref.spacing[64],
                borderRadius: ref.shape.corner.medium,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected
                    ? sys.color.primary
                    : `${color}20`,
                color: isSelected
                    ? sys.color.onPrimary
                    : color,
                transition: `all ${motion.duration.medium} ${motion.easing.standard}`,
                transform: hovered && !isSelected ? 'rotate(6deg) scale(1.1)' : 'rotate(0deg) scale(1)'
            }}
        >
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: ref.spacing[28]
            }}>{icon}</span>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: ref.spacing[2]
        }}>
            <M3Typography
                variant="label-large"
                style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: sys.color.onSurface,
                    margin: 0
                }}
            >
                {label}
            </M3Typography>
            {description && (
                <M3Typography
                    variant="body-small"
                    style={{
                        textAlign: 'center',
                        color: sys.color.onSurfaceVariant,
                        opacity: 0.7,
                        lineHeight: 1.3,
                        padding: `0 ${ref.spacing[2]}`,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0}}
                >
                    {description}
                </M3Typography>
            )}
        </div>
    </div>
    );
};

export default CategoryCard;



