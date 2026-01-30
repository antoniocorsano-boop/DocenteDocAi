// MD3 Compliant - M3AnimatedIcon component with layered theme destructuring
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
    const { layers: { sys: { color: themeColor }, ref: { typography } } } = useTheme();

    const sizeMap = {
        sm: typography.bodySmall.fontSize,
        md: typography.bodyLarge.fontSize,
        lg: typography.headlineSmall.fontSize,
        xl: typography.headlineMedium.fontSize
    };

    const colorMap = {
        primary: themeColor.primary,
        secondary: themeColor.secondary,
        tertiary: themeColor.tertiary,
        surface: themeColor.surface,
        onSurface: themeColor.onSurface
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








