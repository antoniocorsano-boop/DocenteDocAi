// MD3 Compliant - Pure CSS tokens, no useTheme dependency
import React from 'react';

interface M3AnimatedIconProps {
    icon: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'onSurface';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeTokens: Record<string, string> = {
    sm: 'var(--md-sys-typescale-body-small-font-size)',
    md: 'var(--md-sys-typescale-body-large-font-size)',
    lg: 'var(--md-sys-typescale-headline-small-font-size)',
    xl: 'var(--md-sys-typescale-headline-medium-font-size)'
};

const colorTokens: Record<string, string> = {
    primary: 'var(--md-sys-color-primary)',
    secondary: 'var(--md-sys-color-secondary)',
    tertiary: 'var(--md-sys-color-tertiary)',
    surface: 'var(--md-sys-color-surface)',
    onSurface: 'var(--md-sys-color-on-surface)'
};

const M3AnimatedIcon: React.FC<M3AnimatedIconProps> = ({
    icon,
    color = 'onSurface',
    size = 'md'
}) => {
    return (
        <span style={{
            fontSize: sizeTokens[size],
            color: colorTokens[color],
            userSelect: 'none',
            fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        }}>
            {icon}
        </span>
    );
};

export default M3AnimatedIcon;

