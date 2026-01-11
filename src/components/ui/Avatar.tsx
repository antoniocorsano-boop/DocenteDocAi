import React from 'react';
import { useTheme } from '../../theme/theme';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Avatar - User avatar component with initials fallback.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();
    
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const sizeStyles = {
        sm: { width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', fontSize: 'var(--md-sys-typescale-body-small-size)' },
        md: { width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', fontSize: 'var(--md-sys-typescale-body-small-size)' },
        lg: { width: 'var(--md-sys-spacing-16)', height: 'var(--md-sys-spacing-16)', fontSize: 'var(--md-sys-typescale-body-large-size)' },
        xl: { width: 'var(--md-sys-spacing-24)', height: 'var(--md-sys-spacing-24)', fontSize: 'var(--md-sys-typescale-display-small-size)' }
    };

    return (
    <div style={{
        position: 'relative',
        flexShrink: 0,
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        overflow: 'hidden',
        backgroundColor: 'var(--md-sys-color-primary-container)',
        color: 'var(--md-sys-color-on-primary-container)',
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


