import React from 'react';

interface M3AnimatedIconProps {
    icon: string;
    animation?: 'spin' | 'pulse' | 'bounce' | 'fade';
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const M3AnimatedIcon: React.FC<M3AnimatedIconProps> = ({ 
    icon, 
    animation = 'spin', 
    color = 'text-primary', 
    size = 'md' 
}) => {
    const sizeMap = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl'
    };
    const animationMap = {
        spin: 'animate-spin',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        fade: 'animate-fade'
    };
    return (
        <span className={`material-symbols-outlined ${sizeMap[size]} ${color} ${animationMap[animation]}`}>
            {icon}
        </span>
    );
};

export default M3AnimatedIcon;


