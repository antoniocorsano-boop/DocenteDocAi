
import React from 'react';

interface AvatarProps {
    name: string;
    surname?: string;
    src?: string | null;
    size?: 'small' | 'medium' | 'large' | 'xl';
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const Avatar: React.FC<AvatarProps> = ({ name, surname, src, size = 'medium', className = '', onClick }) => {
    const fullName = surname ? `${surname} ${name}` : name;
    const safeName = name ? name.trim() : '?';
    const safeSurname = surname ? surname.trim() : '';

    let initials = '';
    if (safeSurname) {
        initials = `${safeSurname.charAt(0)}${safeName.charAt(0)}`;
    } else {
        const parts = safeName.split(' ');
        if (parts.length > 1) {
            initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
        } else {
            initials = safeName.charAt(0);
        }
    }

    initials = initials.toUpperCase();

    const sizeClasses = {
        small: 'w-8 h-8 m3-label-small',
        medium: 'w-10 h-10 m3-body-small',
        large: 'w-14 h-14 m3-label-large',
        xl: 'w-24 h-24 m3-headline-medium md:w-32 md:h-32 md:m3-display-small'
    };

    return (
        <div
            className={`relative rounded-full overflow-hidden flex items-center justify-center bg-surface-container-highest text-on-surface-variant font-black tracking-widest uppercase select-none transition-transform active:scale-95 ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            aria-label={`Avatar di ${fullName}`}
        >
            {src ? (
                <img src={src} alt={fullName} className="w-full h-full object-cover" />
            ) : (
                initials
            )}
        </div>
    );
};

export default Avatar;
