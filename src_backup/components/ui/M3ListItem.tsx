// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

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
    const { layers } = useTheme();
    const { sys, ref, motion } = layers;
    const isClickable = Boolean(onClick);
    
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
                gap: ref.spacing[4],
                padding: ref.spacing[4],
                borderRadius: ref.shape.corner.medium,
                transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
                minHeight: ref.spacing[14],
                cursor: isClickable ? 'pointer' : 'default',
                backgroundColor: (hovered || focused) && isClickable ? sys.color.surfaceContainerHigh : 'transparent',
                outline: focused && isClickable ? `2px solid ${sys.color.primary}` : 'none',
                outlineOffset: focused ? ref.spacing[2] : '0',
                border: 'none',
                textAlign: 'left',
                width: '100%'
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
            {leadingElement && <div style={{flexShrink: 0, marginTop: layers.ref.spacing['1']}}>{leadingElement}</div>}
            <div style={{flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: layers.ref.spacing['1']}}>
                <div style={{
                    color: 'var(--md-sys-color-on-surface)',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ...(headlineSize === 'small' && {
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-medium-line-height)'
                    }),
                    ...(headlineSize === 'large' && {
                        fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                        fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-title-medium-line-height)'
                    }),
                    ...(headlineSize === 'medium' && {
                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-large-line-height)'
                    })
                }}>
                    {headline}
                </div>
                {supportingText && (
                    <div style={{fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
                        color: 'layers.sys.color.on-surface-variant',
                        opacity: 0.8}}>
                        {supportingText}
                    </div>
                )}
                {children}
            </div>
            {trailingElement && <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: layers.ref.spacing['8'], alignSelf: 'center'}}>{trailingElement}</div>}
        </div>
    );
};

export default M3ListItem;



