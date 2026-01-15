// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3AnimatedIconProps {
    icon: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'onSurface';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const M3AnimatedIcon: React.FC<M3AnimatedIconProps> = ({ 
    icon, 
    color = 'onSurface', 
    size = 'md' 
}) => {
    const { layers } = useTheme();
    const { sys, ref } = layers;

    const sizeMap = {
        sm: ref.typography.bodySmall.fontSize,
        md: ref.typography.bodyLarge.fontSize,
        lg: ref.typography.headlineSmall.fontSize,
        xl: ref.typography.headlineMedium.fontSize
    };

    const colorMap = {
        primary: sys.color.primary,
        secondary: sys.color.secondary,
        tertiary: sys.color.tertiary,
        surface: sys.color.surface,
        onSurface: sys.color.onSurface
    };

    return (
        <span style={{
            fontFamily: 'Material Symbols Outlined',
            fontSize: sizeMap[size],
            color: colorMap[color],
            userSelect: 'none',
            fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        }}>
            {icon}
        </span>
    );
};

export default M3AnimatedIcon;



