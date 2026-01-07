import React from 'react';

interface M3ExpressiveCardProps {
    icon: string;
    title: string;
    description: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' | string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: {
        bg: 'var(--sys-primary-container)',
        fg: 'var(--sys-on-primary-container)'
    },
    secondary: {
        bg: 'var(--sys-secondary-container)',
        fg: 'var(--sys-on-secondary-container)'
    },
    tertiary: {
        bg: 'var(--sys-tertiary-container)',
        fg: 'var(--sys-on-tertiary-container)'
    },
    surface: {
        bg: 'var(--sys-surface-container-high)',
        fg: 'var(--sys-on-surface)'
    },
    surfaceVariant: {
        bg: 'var(--sys-surface-container-low)',
        fg: 'var(--sys-on-surface-variant)'
    }
};

const M3ExpressiveCard: React.FC<M3ExpressiveCardProps> = ({
    icon,
    title,
    description,
    color = 'surface',
    onClick,
    className = '',
    children,
}) => {
    const palette = colorTokens[color] || { bg: color, fg: 'inherit' };
    const isClickable = Boolean(onClick);

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
            className={`
                relative overflow-hidden p-8 md:p-6 transition-all duration-300 flex flex-col min-h-[140px] md:min-h-[160px]
                ${isClickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]' : ''}
                aura-glass border border-white/10
                ${className}
            `}
            style={{
                backgroundColor: palette.bg,
                color: palette.fg,
                borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))'
            }}
        >
            {/* Decorative background element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/10">
                    <span className="material-symbols-outlined m3-icon-md-lg">{icon}</span>
                </div>
                {isClickable && (
                    <span className="material-symbols-outlined opacity-40 m3-icon-sm">arrow_forward</span>
                )}
            </div>
            
            <div className="flex-grow relative z-10">
                <h3 className="m3-title-large font-black mb-4 tracking-tight truncate">{title}</h3>
                <p className="m3-body-medium opacity-80 leading-snug font-medium line-clamp-2">{description}</p>
                {children && <div className="mt-4">{children}</div>}
            </div>
        </div>
    );
};

export default M3ExpressiveCard;
