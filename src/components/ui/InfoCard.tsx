import React from 'react';

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    icon?: string;
    variant?: 'primary' | 'tertiary' | 'error' | 'surface' | 'secondary' | 'elevated' | 'tonal';
    className?: string;
    action?: React.ReactNode;
    onClose?: () => void;
    children?: React.ReactNode;
    onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
    title, 
    description, 
    icon, 
    variant = 'surface', 
    className = '', 
    action, 
    onClose,
    children,
    onClick,
    ...props
}) => {
    const variantMap: Record<string, string> = {
        primary: 'bg-primary-container/80 text-on-primary-container border-primary/10',
        secondary: 'bg-secondary-container/80 text-on-secondary-container border-secondary/10',
        tertiary: 'bg-tertiary-container/80 text-on-tertiary-container border-tertiary/10',
        error: 'bg-error-container/80 text-on-error-container border-error/10',
        surface: 'bg-[var(--md-sys-color-surface-container)]/80 text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)]/10',
        elevated: 'bg-[var(--md-sys-color-surface-container-low)] shadow-[var(--md-sys-elevation-level2)] border-[var(--md-sys-color-outline-variant)]/10',
        tonal: 'bg-secondary-container/50 text-on-secondary-container border-secondary/10'
    };
    const variantClasses = variantMap[variant] || variantMap.surface;

    return (
        <div
            {...props}
            onClick={onClick}
            className={`m3-info-card p-6 md:p-10 shadow-[var(--md-sys-elevation-level3)] md:shadow-[var(--md-sys-elevation-level4)] backdrop-blur-2xl border border-white/10 dark:border-black/10 overflow-hidden relative group transition-all duration-500 hover:shadow-primary/10 ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${variantClasses} ${className}`}
            style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {icon && (
                    <div className="p-5 rounded-[var(--md-sys-shape-corner-large)] bg-white/30 dark:bg-black/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl">{icon}</span>
                    </div>
                )}
                <div className="flex-grow">
                    <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-extrabold mb-6 tracking-tight">{title}</h3>
                    {description && <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] opacity-90 leading-relaxed">{description}</p>}
                    {children && <div className="mt-4">{children}</div>}
                    {action && <div className="mt-8 flex justify-end">{action}</div>}
                </div>
                {onClose && (
                    <button onClick={onClose} className="icon-button !w-12 !h-12 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all" aria-label="Chiudi">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default InfoCard;
