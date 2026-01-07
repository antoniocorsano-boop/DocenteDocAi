import React from 'react';

interface M3CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'elevated' | 'outlined' | 'filled';
    ariaLabel?: string;
}

const M3Card: React.FC<M3CardProps> = ({
    children,
    className = '',
    onClick,
    variant = 'elevated',
    ariaLabel
}) => {
    const isClickable = Boolean(onClick);

    const variantClasses = {
        elevated: 'bg-surface-container-low shadow-elevation-1 border-white/10',
        outlined: 'bg-surface border-outline/30 shadow-none',
        filled: 'bg-surface-container-high shadow-elevation-1 border-white/5'
    };

    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={ariaLabel}
            className={`
                relative overflow-hidden p-6 transition-all duration-300
                ${variantClasses[variant]}
                backdrop-blur-sm border
                ${isClickable ? 'cursor-pointer hover:shadow-elevation-2 hover:border-white/20 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2' : ''}
                ${className}
            `}
            style={{
                borderRadius: 'calc(var(--shape-large) * var(--sys-radius-multiplier))'
            }}
        >
            {/* Subtle glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default M3Card;
