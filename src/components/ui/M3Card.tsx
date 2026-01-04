import React from 'react';

interface M3CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const M3Card: React.FC<M3CardProps> = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        onKeyDown={(e) => {
            if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onClick();
            }
        }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={`bg-surface-container rounded-xl p-6 shadow-sm border border-outline-variant/20 ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-[0.98]' : ''} ${className}`}
    >
        {children}
    </div>
);

export default M3Card;
