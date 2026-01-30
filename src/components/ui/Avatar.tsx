// MD3 Compliant - Updated for layered theme access
import React from 'react';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Avatar - User avatar component with initials fallback.
 */

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const sizeStyles = {
        sm: { width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', fontSize: 'var(--app-text-body)' },
        md: { width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', fontSize: 'var(--app-text-body)' },
        lg: { width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', fontSize: 'var(--app-text-body)' },
        xl: { width: 'var(--md-sys-spacing-16)', height: 'var(--md-sys-spacing-16)', fontSize: 'var(--app-text-display)' }
    };

    return (
    <div style={{
        position: 'relative',
        flexShrink: 0,
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        overflow: 'hidden',
        backgroundColor: 'var(--app-color-primary-container)',
        color: 'var(--app-color-on-primary-container)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        ...sizeStyles[size]
    }}>
        {src ? (
            <img src={src} alt={name} style={{ width: 'var(--app-layout-full)', height: 'var(--app-layout-full)', objectFit: 'cover' }} />
        ) : (
            <span>{initials}</span>
        )}
    </div>
    );
};

export default Avatar;








