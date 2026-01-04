import React from 'react';

interface ActionTileProps {
    title: string;
    subtitle?: string;
    icon: string;
    onClick: () => void;
    variant?: string;
    className?: string;
    tooltip?: string;
}

const ActionTile: React.FC<ActionTileProps> = ({ 
    title, 
    subtitle, 
    icon, 
    onClick, 
    variant = 'surface', 
    className = '', 
    tooltip 
}) => (
    <button
        onClick={onClick}
        className={`op-tile op-tile-variant-${variant} ${className} group overflow-hidden`}
        title={tooltip}
        aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
        type="button"
    >
        <div className="op-tile-icon-container shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="op-tile-content">
            <div className="op-tile-title font-extrabold text-left group-hover:text-primary transition-colors">{title}</div>
            {subtitle && <div className="op-tile-subtitle text-[11px] font-extrabold text-left opacity-60 uppercase tracking-widest">{subtitle}</div>}
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            <span className="material-symbols-outlined op-tile-chevron opacity-30 group-hover:opacity-100">chevron_right</span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"></div>
    </button>
);

export default ActionTile;
