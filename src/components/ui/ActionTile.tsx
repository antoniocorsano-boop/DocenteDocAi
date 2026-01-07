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
        className={`m3-interactive-card op-tile-variant-${variant} ${className}`}
        title={tooltip}
        aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
        type="button"
    >
        <div className="op-tile-icon-container">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="op-tile-content">
            <div className="op-tile-title">{title}</div>
            {subtitle && <div className="op-tile-subtitle">{subtitle}</div>}
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
            <span className="material-symbols-outlined op-tile-chevron">chevron_right</span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine pointer-events-none"></div>
    </button>
);

export default ActionTile;
