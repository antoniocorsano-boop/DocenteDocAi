import React from 'react';
import M3SurfaceCard from './M3SurfaceCard';

const isValidColor = (color: string): color is 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' => {
  const validColors: ('primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant')[] = ['primary', 'secondary', 'tertiary', 'surface', 'surfaceVariant'];
  return validColors.includes(color as 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant');
};

interface M3ExpressiveCardProps {
    icon: string;
    title: string;
    description: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' | string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    ariaLabel?: string;
}

/**
 * M3ExpressiveCard - Expressive card component built on M3SurfaceCard base.
 * Provides enhanced visual styling with glass effects and decorative elements.
 */
const M3ExpressiveCard: React.FC<M3ExpressiveCardProps> = ({
    icon,
    title,
    description,
    color = 'surface',
    onClick,
    className = '',
    children,
    ariaLabel,
}) => {
    const palette = {
        primary: { bg: 'var(--md-sys-color-primary-container)', fg: 'var(--md-sys-color-on-primary-container)', accent: 'var(--md-sys-color-primary)' },
        secondary: { bg: 'var(--md-sys-color-secondary-container)', fg: 'var(--sys-on-secondary-container)', accent: 'var(--md-sys-color-secondary)' },
        tertiary: { bg: 'var(--sys-tertiary-container)', fg: 'var(--sys-on-tertiary-container)', accent: 'var(--sys-tertiary)' },
        surface: { bg: 'var(--md-sys-color-surface-container-high)', fg: 'var(--md-sys-color-on-surface)', accent: 'var(--md-sys-color-primary)' },
        surfaceVariant: { bg: 'var(--md-sys-color-surface-container-low)', fg: 'var(--md-sys-color-on-surface-variant)', accent: 'var(--md-sys-color-secondary)' }
    }[color] || { bg: color, fg: 'inherit', accent: 'var(--md-sys-color-primary)' };

    const isClickable = Boolean(onClick);

    return (
        <M3SurfaceCard
            glass
            expressive
            color={isValidColor(color) ? color : undefined}
            className={`p-8 md:p-12 transition-all duration-300 flex flex-col min-h-[160px] md:min-h-[180px] ${isClickable ? 'cursor-pointer hover:shadow-[var(--md-sys-elevation-level3)] hover:shadow-black/10 hover:border-white/30 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2' : ''} ${className}`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={ariaLabel || (isClickable ? `${title}: ${description}` : undefined)}
        >
            {/* Enhanced decorative background with gradient */}
            <div
                className="absolute -top-16 -right-16 w-40 h-40 opacity-20 blur-3xl rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${palette.accent}20 0%, transparent 70%)` }}
            ></div>

            {/* Subtle accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-60"
                style={{ backgroundColor: palette.accent }}
            ></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 rounded-[var(--md-sys-shape-corner-large)] bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md flex items-center justify-center shadow-[var(--md-sys-elevation-level2)] border border-white/20 flex-shrink-0">
                    <span className="material-symbols-outlined m3-icon-lg opacity-90">{icon}</span>
                </div>
                {isClickable && (
                    <span className="material-symbols-outlined opacity-50 m3-icon-md transition-opacity group-hover:opacity-70">arrow_forward</span>
                )}
            </div>

            <div className="flex-grow relative z-10 space-y-3">
                <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-bold tracking-tight leading-tight">{title}</h3>
                <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] opacity-80 leading-relaxed font-medium line-clamp-3">{description}</p>
                {children && <div className="mt-4 pt-3 border-t border-white/10">{children}</div>}
            </div>
        </M3SurfaceCard>
    );
};

export default M3ExpressiveCard;


