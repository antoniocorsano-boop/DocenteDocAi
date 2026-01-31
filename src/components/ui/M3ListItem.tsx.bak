// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React, { useState } from 'react';

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

    // MD3 CSS Variables - Direct token usage (no useTheme dependency)
    const surfaceContainerHigh = 'var(--md-sys-color-surface-container-high)';
    const primary = 'var(--app-color-primary)';
    const onSurface = 'var(--app-color-on-surface)';
    const onSurfaceVariant = 'var(--md-sys-color-on-surface-variant)';
    const spacing1 = 'var(--md-sys-spacing-1)';
    const spacing4 = 'var(--app-spacing-container)';
    const spacing8 = 'var(--md-sys-spacing-8)';
    const spacing12 = 'var(--md-sys-spacing-12)';
    const cornerMedium = 'var(--md-sys-shape-corner-medium)';
    const durationShort2 = 'var(--md-sys-motion-duration-short2)';
    const easingStandard = 'var(--app-easing-standard)';
    const bodyMediumFontSize = 'var(--app-text-body)';
    const bodyMediumFontWeight = 'var(--app-text-body-weight)';
    const bodyMediumLineHeight = 'var(--app-text-body-line-height)';
    const titleMediumFontSize = 'var(--app-text-title)';
    const titleMediumFontWeight = 'var(--app-text-title-weight)';
    const titleMediumLineHeight = 'var(--app-text-title-line-height)';
    const bodyLargeFontSize = 'var(--app-text-body)';
    const bodyLargeFontWeight = 'var(--app-text-body-weight)';
    const bodyLargeLineHeight = 'var(--app-text-body-line-height)';
    const bodySmallFontSize = 'var(--app-text-body)';
    const bodySmallFontWeight = 'var(--app-text-body-weight)';
    const bodySmallLineHeight = 'var(--app-text-body-line-height)';
    
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
                outline: focused && isClickable ? `var(--app-border-thick) solid ${primary}` : 'none',
                outlineOffset: focused ? 'var(--md-sys-spacing-8)' : 'var(--md-sys-spacing-0)',
                border: 'none',
                textAlign: 'left',
                width: 'var(--app-layout-full)'
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
                <div style={{
                    color: onSurface,
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ...(headlineSize === 'small' && {
                        fontSize: bodyMediumFontSize,
                        fontWeight: bodyMediumFontWeight,
                        lineHeight: bodyMediumLineHeight
                    }),
                    ...(headlineSize === 'large' && {
                        fontSize: titleMediumFontSize,
                        fontWeight: titleMediumFontWeight,
                        lineHeight: titleMediumLineHeight
                    }),
                    ...(headlineSize === 'medium' && {
                        fontSize: bodyLargeFontSize,
                        fontWeight: bodyLargeFontWeight,
                        lineHeight: bodyLargeLineHeight
                    })
                }}>
                    {headline}
                </div>
                {supportingText && (
                    <div style={{fontSize: bodySmallFontSize,
                        fontWeight: bodySmallFontWeight,
                        lineHeight: bodySmallLineHeight,
                        color: onSurfaceVariant}}>
                        {supportingText}
                    </div>
                )}
                {children}
            </div>
            {trailingElement && <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: spacing8, alignSelf: 'center'}}>{trailingElement}</div>}
        </div>
    );
};

export default M3ListItem;








