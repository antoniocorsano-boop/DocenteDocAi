// MD3 Compliant - CategoryCard component migrated to CSS variables
// @md3-compliant
// @ready-for-extension

/**
 * CategoryCard Component - MD3 Pure Migration
 *
 * Interactive category selection card with Material Design 3 token-based styling.
 * Supports selection states, hover effects, and accessibility features.
 *
 * @version 2.2.0 - CSS Variables Migration
 * @since 2026-01-22
 */

import React, { useState } from 'react';
import M3Typography from './M3Typography';

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
            gap: 'var(--app-spacing-container)',
            padding: 'var(--app-spacing-section)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: isSelected ? 'var(--app-border-thick) solid var(--app-color-primary)' : 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)',
            backgroundColor: isSelected
                ? 'var(--app-color-primary-container)'
                : (hovered && !isSelected ? 'var(--md-sys-color-surface-container-high)' : 'var(--app-color-surface-container)'),
            boxShadow: isSelected
                ? 'var(--md-sys-elevation-level3)'
                : 'var(--md-sys-elevation-level1)',
            cursor: 'pointer',
            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
            transform: isSelected ? 'scale(1.02)' : (hovered && !isSelected ? 'scale(1.01)' : 'scale(1)'),
            outline: focused ? 'var(--app-border-normal) solid var(--app-color-primary)' : 'none',
            outlineOffset: focused ? 'var(--app-spacing-component)' : '0'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
    >
        <div
            style={{
                width: 'var(--md-sys-spacing-8)',
                height: 'var(--md-sys-spacing-8)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected
                    ? 'var(--app-color-primary)'
                    : `${color}20`,
                color: isSelected
                    ? 'var(--app-color-on-primary)'
                    : color,
                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                transform: hovered && !isSelected ? 'rotate(6deg) scale(1.1)' : 'rotate(0deg) scale(1)'
            }}
        >
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: 'var(--app-spacing-section)'
            }}>{icon}</span>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--app-spacing-container)'
        }}>
            <M3Typography
                variant="label-large"
                style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: 'var(--app-color-on-surface)',
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
                        color: 'var(--app-color-on-surface-variant)',
                        opacity: 0.7,
                        lineHeight: 1.3,
                        padding: '0 var(--app-spacing-container)',
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








