// MD3 Compliant - Pure CSS tokens, no useTheme dependency
import React from 'react';

interface M3BadgedIconProps {
    icon: string;
    badge?: number | string;
    badgeColor?: 'primary' | 'secondary' | 'error';
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'tertiary' | 'onSurface';
}

const sizeMap = {
    sm: {
        container: 'var(--md-sys-typescale-body-small-font-size)',
        badge: { fontSize: 'var(--md-sys-typescale-body-small-font-size)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)' }
    },
    md: {
        container: 'var(--md-sys-typescale-body-large-font-size)',
        badge: { fontSize: 'var(--md-sys-typescale-label-small-font-size)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)' }
    },
    lg: {
        container: 'var(--md-sys-typescale-headline-small-font-size)',
        badge: { fontSize: 'var(--md-sys-typescale-body-medium-font-size)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)' }
    }
};

const colorMap: Record<string, string> = {
    primary: 'var(--md-sys-color-primary)',
    secondary: 'var(--md-sys-color-secondary)',
    tertiary: 'var(--md-sys-color-tertiary)',
    onSurface: 'var(--md-sys-color-on-surface)'
};

const badgeColorMap = {
    primary: { bg: 'var(--md-sys-color-primary-container)', fg: 'var(--md-sys-color-on-primary-container)' },
    secondary: { bg: 'var(--md-sys-color-secondary-container)', fg: 'var(--md-sys-color-on-secondary-container)' },
    error: { bg: 'var(--md-sys-color-error-container)', fg: 'var(--md-sys-color-on-error-container)' }
};

const M3BadgedIcon: React.FC<M3BadgedIconProps> = ({
    icon,
    badge,
    badgeColor = 'error',
    size = 'md',
    color = 'onSurface'
}) => {
    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
                fontSize: sizeMap[size].container,
                color: colorMap[color],
                userSelect: 'none',
                fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
            }}>
                {icon}
            </span>
            {badge !== undefined && badge !== null && (
                <span style={{
                    position: 'absolute',
                    top: 'calc(-1 * var(--md-sys-spacing-2))',
                    right: 'calc(-1 * var(--md-sys-spacing-2))',
                    backgroundColor: badgeColorMap[badgeColor].bg,
                    color: badgeColorMap[badgeColor].fg,
                    borderRadius: 'var(--md-sys-spacing-4)',
                    fontWeight: 'var(--md-sys-typescale-weight-bold)',
                    ...sizeMap[size].badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 'var(--md-sys-spacing-8)'
                }}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

export default M3BadgedIcon;

