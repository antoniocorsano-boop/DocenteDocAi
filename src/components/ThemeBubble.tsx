
import React from 'react';

interface ThemeBubbleProps {
    name: string;
    colors: { primary: string; secondary: string; tertiary: string };
    isSelected: boolean;
    onClick: () => void;
}

const ThemeBubble: React.FC<ThemeBubbleProps> = ({ name, colors, isSelected, onClick }) => (
    <button 
        className={`m3-theme-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        title={name}
        aria-label={`Seleziona tema ${name}`}
    >
        <div className="m3-theme-preview">
            {/* Background (Primary) */}
            <div className="theme-preview-bg" style={{ backgroundColor: colors.primary }}></div>
            
            {/* Shapes */}
            <div className="theme-preview-circle" style={{ backgroundColor: colors.secondary }}></div>
            <div className="theme-preview-bar" style={{ backgroundColor: colors.tertiary }}></div>

            {/* Checkmark Overlay */}
            <div className="theme-check-icon">
                 <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
            </div>
        </div>
        
        <div className="m3-theme-label">
            {name}
        </div>
    </button>
);

export default ThemeBubble;
