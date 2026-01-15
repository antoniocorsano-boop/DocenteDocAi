// LEGACY - MD3 Non-compliant
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
    const { layers } = useTheme();
    const { sys, ref } = layers;

    const sizeMap = {
        sm: { container: ref.typography.bodySmall.fontSize, badge: { fontSize: ref.typography.bodySmall.fontSize, padding: `${layers.ref.spacing['1']} ${layers.ref.spacing['1']}` } },
        md: { container: ref.typography.bodyLarge.fontSize, badge: { fontSize: ref.typography.labelSmall.fontSize, padding: `${layers.ref.spacing['1']} ${layers.ref.spacing['1']}` } },
        lg: { container: ref.typography.headlineSmall.fontSize, badge: { fontSize: ref.typography.bodyMedium.fontSize, padding: `${layers.ref.spacing['1']} ${layers.ref.spacing['1']}` } }
    };

    const colorMap = {
        primary: sys.color.primary,
        secondary: sys.color.secondary,
        tertiary: sys.color.tertiary,
        onSurface: sys.color.onSurface
    };

    const badgeColorMap = {
        primary: { bg: sys.color.primaryContainer, fg: sys.color.onPrimaryContainer },
        secondary: { bg: sys.color.secondaryContainer, fg: sys.color.onSecondaryContainer },
        error: { bg: sys.color.errorContainer, fg: sys.color.onErrorContainer }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
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
                    top: `-${layers.ref.spacing['2']}`,
                    right: `-${layers.ref.spacing['2']}`,
                    backgroundColor: badgeColorMap[badgeColor].bg,
                    color: badgeColorMap[badgeColor].fg,
                    borderRadius: layers.ref.spacing['4'],
                    fontWeight: 'bold',
                    ...sizeMap[size].badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: layers.ref.spacing['8']
                }}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

export default M3BadgedIcon;







