import React from 'react';

interface ActionTileProps {
    title: string;
    subtitle?: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
    className?: string;
    tooltip?: string;
    ariaLabel?: string;
}

const ActionTile: React.FC<ActionTileProps> = ({
    title,
    subtitle,
    icon,
    onClick,
    variant = 'surface',
    className = '',
    tooltip,
    ariaLabel
}) => (
    <button
        onClick={onClick}
        className={`m3-interactive-card op-tile-variant-${variant} ${className}`}
        title={tooltip}
        aria-label={ariaLabel || `${title}${subtitle ? ` - ${subtitle}` : ''}`}
        type="button"
    >
        <div className="op-tile-icon-container">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="op-tile-content">
            <div className="op-tile-title">{title}</div>
            {subtitle && <div className="op-tile-subtitle">{subtitle}</div>}
        </div>
        <div className="op-tile-chevron-container">
            <span className="material-symbols-outlined op-tile-chevron">chevron_right</span>
        </div>

        {/* Enhanced sweep effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"></div>
    </button>
);

export default ActionTile;
