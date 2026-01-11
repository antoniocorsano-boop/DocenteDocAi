import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

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
                gap: 'var(--md-sys-spacing-4)',
                padding: 'var(--md-sys-spacing-4)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                minHeight: 'var(--md-sys-spacing-14)',
                cursor: isClickable ? 'pointer' : 'default',
                backgroundColor: 'transparent',
                outline: 'none',
                border: 'none',
                textAlign: 'left',
                width: '100%'
            }}
            onMouseEnter={(e) => {
                if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                }
            }}
            onMouseLeave={(e) => {
                if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
            onFocus={(e) => {
                if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                    e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
                    e.currentTarget.style.outlineOffset = '2px';
                }
            }}
            onBlur={(e) => {
                if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.outlineOffset = '0';
                }
            }}
        >
            {leadingElement && <div style={{ flexShrink: 0, marginTop: 'var(--md-sys-spacing-1)' }}>{leadingElement}</div>}
            <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
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
                    <div style={{
                        fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        opacity: 0.8
                    }}>
                        {supportingText}
                    </div>
                )}
                {children}
            </div>
            {trailingElement && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)', alignSelf: 'center' }}>{trailingElement}</div>}
        </div>
    );
};

export default M3ListItem;


