// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React, { useState } from 'react';
import { M3Typography } from './M3Typography';

interface M3ListItemProps {
    headline: React.ReactNode;
    headlineSize?: 'small' | 'medium' | 'large';
    supportingText?: React.ReactNode;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
}

const M3ListItem: React.FC<M3ListItemProps> = ({ 
    headline, 
    headlineSize = 'medium', 
    supportingText, 
    leadingElement, 
    trailingElement, 
    onClick, 
    children 
}) => {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const isClickable = !!onClick;

    // MD3 CSS Variables — direct --md-sys-* tokens only
    const surfaceContainerHigh = 'var(--md-sys-color-surface-container-high)';
    const primary = 'var(--md-sys-color-primary)';
    const onSurface = 'var(--md-sys-color-on-surface)';
    const onSurfaceVariant = 'var(--md-sys-color-on-surface-variant)';
    const spacing1 = 'var(--md-sys-spacing-1)';
    const spacing4 = 'var(--md-sys-spacing-4)';
    const spacing8 = 'var(--md-sys-spacing-8)';
    const spacing12 = 'var(--md-sys-spacing-12)';
    const cornerMedium = 'var(--md-sys-shape-corner-medium)';
    const durationShort2 = 'var(--md-sys-motion-duration-short2)';
    const easingStandard = 'var(--md-sys-motion-easing-standard)';
    
    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing4,
                padding: spacing4,
                borderRadius: cornerMedium,
                transition: `all ${durationShort2} ${easingStandard}`,
                minHeight: spacing12,
                cursor: isClickable ? 'pointer' : 'default',
                backgroundColor: (hovered || focused) && isClickable ? surfaceContainerHigh : 'transparent',
                outline: focused && isClickable ? `var(--md-sys-border-width-thick) solid ${primary}` : 'none',
                outlineOffset: focused ? 'var(--md-sys-spacing-8)' : 'var(--md-sys-spacing-0)',
                border: 'none',
                textAlign: 'left',
                width: 'var(--md-sys-percent-100)'
            }}
            onMouseEnter={() => {
                if (isClickable) setHovered(true);
            }}
            onMouseLeave={() => {
                if (isClickable) setHovered(false);
            }}
            onFocus={() => {
                if (isClickable) setFocused(true);
            }}
            onBlur={() => {
                if (isClickable) setFocused(false);
            }}
        >
            {leadingElement && <div style={{flexShrink: 0, marginTop: spacing1}}>{leadingElement}</div>}
            <div style={{flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: spacing1}}>
                <M3Typography
                    variant={headlineSize === 'large' ? 'title-large' : 'body-large'}
                    as="div"
                    style={{
                        color: onSurface,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {headline}
                </M3Typography>
                {supportingText && (
                    <M3Typography
                        variant="body-small"
                        as="div"
                        style={{color: onSurfaceVariant}}
                    >
                        {supportingText}
                    </M3Typography>
                )}
                {children}
            </div>
            {trailingElement && <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: spacing8, alignSelf: 'center'}}>{trailingElement}</div>}
        </div>
    );
};

export default M3ListItem;
