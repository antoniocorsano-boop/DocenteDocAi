import React from 'react';

interface M3ChoiceCardProps {
    icon: string;
    label: string;
    onClick: () => void;
    selected: boolean;
    className?: string;
}

const M3ChoiceCard: React.FC<M3ChoiceCardProps> = ({ 
    icon, 
    label, 
    onClick, 
    selected, 
    className = '' 
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`flex flex-col items-center justify-center p-8 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] md:rounded-4xl border-2 transition-all gap-8 md:gap-8 min-w-[100px] md:min-w-[140px] group ${selected ? 'border-primary bg-primary-container text-on-primary-container shadow-[var(--md-sys-elevation-level4)] scale-[1.05]' : 'border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container)]/50 hover:border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-surface-container-high)]'} ${className}`}
    >
        <div className={`w-10 h-10 md:w-16 md:h-16 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center transition-all ${selected ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level2)]' : 'bg-surface text-primary group-hover:scale-110'}`}>
            <span className="material-symbols-outlined md:text-4xl" style={{ fontSize: "1.5rem" }}>{icon}</span>
        </div>
        <span className="text-[10px] md:text-[11px] font-extrabold tracking-[0.1em] md:tracking-[0.2em]" style={{ textTransform: "uppercase" }}>{label}</span>
    </button>
);

export default M3ChoiceCard;


