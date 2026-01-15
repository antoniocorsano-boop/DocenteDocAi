// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Avatar - User avatar component with initials fallback.
 */

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const { layers } = useTheme();
  const { sys, ref } = layers;

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const sizeStyles = {
        sm: { width: layers.ref.spacing['8'], height: layers.ref.spacing['8'], fontSize: ref.typography.bodySmall.fontSize },
        md: { width: layers.ref.spacing['10'], height: layers.ref.spacing['10'], fontSize: ref.typography.bodySmall.fontSize },
        lg: { width: layers.ref.spacing['12'], height: layers.ref.spacing['12'], fontSize: ref.typography.bodyLarge.fontSize },
        xl: { width: layers.ref.spacing['16'], height: layers.ref.spacing['16'], fontSize: ref.typography.displaySmall.fontSize }
    };

    return (
    <div style={{
        position: 'relative',
        flexShrink: 0,
        borderRadius: ref.shape.corner.extraLarge,
        overflow: 'hidden',
        backgroundColor: sys.color.primaryContainer,
        color: sys.color.onPrimaryContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        ...sizeStyles[size]
    }}>
        {src ? (
            <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
            <span>{initials}</span>
        )}
    </div>
    );
};

export default Avatar;







