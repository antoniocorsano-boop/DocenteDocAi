import React from 'react';

interface M3BadgedIconProps {
    icon: string;
    badge?: number | string;
    badgeColor?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

const M3BadgedIcon: React.FC<M3BadgedIconProps> = ({ 
    icon, 
    badge, 
    badgeColor = 'bg-error text-on-error', 
    size = 'md', 
    color = 'text-on-surface' 
}) => {
    const sizeMap = {
        sm: { container: 'text-lg', badge: 'text-xs px-1.5 py-0.5' },
        md: { container: 'text-2xl', badge: 'text-sm px-4 py-1' },
        lg: { container: 'text-4xl', badge: 'text-base px-2.5 py-1' }
    };
    return (
        <div className="relative inline-flex items-center justify-center">
            <span className={`material-symbols-outlined ${sizeMap[size].container} ${color}`}>
                {icon}
            </span>
            {badge !== undefined && badge !== null && (
                <span className={`absolute -top-1 -right-1 ${badgeColor} rounded-full font-bold ${sizeMap[size].badge} flex items-center justify-center min-w-6`}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

export default M3BadgedIcon;
