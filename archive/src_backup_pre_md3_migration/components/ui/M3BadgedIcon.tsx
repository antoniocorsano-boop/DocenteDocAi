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
        sm: { container: ref.typography.bodySmall.fontSize, badge: { fontSize: ref.typography.bodySmall.fontSize, padding: `${ref.spacing[1]} ${ref.spacing[3]}` } },
        md: { container: ref.typography.bodyLarge.fontSize, badge: { fontSize: ref.typography.labelSmall.fontSize, padding: `${ref.spacing[2]} ${ref.spacing[4]}` } },
        lg: { container: ref.typography.headlineSmall.fontSize, badge: { fontSize: ref.typography.bodyMedium.fontSize, padding: `${ref.spacing[2]} ${ref.spacing[5]}` } }
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
                    top: `-${ref.spacing[1]}`,
                    right: `-${ref.spacing[1]}`,
                    backgroundColor: badgeColorMap[badgeColor].bg,
                    color: badgeColorMap[badgeColor].fg,
                    borderRadius: ref.spacing[9999],
                    fontWeight: 'bold',
                    ...sizeMap[size].badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: ref.spacing[6]
                }}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

export default M3BadgedIcon;



