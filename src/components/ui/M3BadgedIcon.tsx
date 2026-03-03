// MD3 Compliant - M3BadgedIcon component with layered theme destructuring
import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3BadgedIconProps {
    icon: string;
    badge?: number | string;
    badgeColor?: 'primary' | 'secondary' | 'error';
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'tertiary' | 'onSurface';
}

const M3BadgedIcon: React.FC<M3BadgedIconProps> = ({ 
    icon, 
    badge, 
    badgeColor = 'error', 
    size = 'md', 
    color = 'onSurface' 
}) => {
    const { layers: { sys: { color: themeColor }, ref: { spacing, typography } } } = useTheme();

    const sizeMap = {
        sm: { container: typography.bodySmall.fontSize, badge: { fontSize: typography.bodySmall.fontSize, padding: `${spacing[1]} ${spacing[1]}` } },
        md: { container: typography.bodyLarge.fontSize, badge: { fontSize: typography.labelSmall.fontSize, padding: `${spacing[1]} ${spacing[1]}` } },
        lg: { container: typography.headlineSmall.fontSize, badge: { fontSize: typography.bodyMedium.fontSize, padding: `${spacing[1]} ${spacing[1]}` } }
    };

    const colorMap = {
        primary: themeColor.primary,
        secondary: themeColor.secondary,
        tertiary: themeColor.tertiary,
        onSurface: themeColor.onSurface
    };

    const badgeColorMap = {
        primary: { bg: themeColor.primaryContainer, fg: themeColor.onPrimaryContainer },
        secondary: { bg: themeColor.secondaryContainer, fg: themeColor.onSecondaryContainer },
        error: { bg: themeColor.errorContainer, fg: themeColor.onErrorContainer }
    };

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
                    top: `-${spacing[2]}`,
                    right: `-${spacing[2]}`,
                    backgroundColor: badgeColorMap[badgeColor].bg,
                    color: badgeColorMap[badgeColor].fg,
                    borderRadius: spacing[4],
                    fontWeight: 'bold',
                    ...sizeMap[size].badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: spacing[8]
                }}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

export default M3BadgedIcon;

