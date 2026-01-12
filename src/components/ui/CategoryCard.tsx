/**
 * CategoryCard Component - MD3 Pure Migration
 *
 * Interactive category selection card with Material Design 3 token-based styling.
 * Supports selection states, hover effects, and accessibility features.
 *
 * @version 2.0.0 - MD3 Pure Migration
 * @since 2026-01-11
 */

import React from 'react';
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
}) => (
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
            gap: 'var(--md-sys-spacing-4)',
            padding: 'var(--md-sys-spacing-5)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: isSelected ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
            backgroundColor: isSelected
                ? 'var(--md-sys-color-primary-container)'
                : 'var(--md-sys-color-surface-container)',
            boxShadow: isSelected
                ? 'var(--md-sys-elevation-level3)'
                : 'var(--md-sys-elevation-level1)',
            cursor: 'pointer',
            transition: 'all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            outline: 'none'
        }}
        onMouseEnter={(e) => {
            if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)';
                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                e.currentTarget.style.transform = 'scale(1.01)';
            }
        }}
        onMouseLeave={(e) => {
            if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)';
                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container)';
                e.currentTarget.style.transform = 'scale(1)';
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
        <div
            style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected
                    ? 'var(--md-sys-color-primary)'
                    : `${color}20`,
                color: isSelected
                    ? 'var(--md-sys-color-on-primary)'
                    : color,
                transition: 'all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                transform: 'rotate(0deg) scale(1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(6deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
        >
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: '28px'
            }}>{icon}</span>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)'
        }}>
            <M3Typography
                variant="label-large"
                style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: 'var(--md-sys-color-on-surface)',
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
                        color: 'var(--md-sys-color-on-surface-variant)',
                        opacity: 0.7,
                        lineHeight: 1.3,
                        padding: '0 var(--md-sys-spacing-2)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0
                    }}
                >
                    {description}
                </M3Typography>
            )}
        </div>
    </div>
);

export default CategoryCard;


