import React from 'react';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl'
    };

    return (
        <div className={`relative flex-shrink-0 rounded-[var(--md-sys-shape-corner-extra-large)] overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center font-black ${sizeClasses[size]} ${className}`}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

export default Avatar;
