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
        className={`flex flex-col items-center justify-center p-8 rounded-4xl border-2 transition-all gap-4 min-w-[140px] group ${selected ? 'border-primary bg-primary-container text-on-primary-container shadow-2xl scale-[1.05]' : 'border-outline-variant/30 bg-surface-container/50 hover:border-outline hover:bg-surface-container-high'} ${className}`}
    >
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${selected ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface text-primary group-hover:scale-110'}`}>
            <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">{label}</span>
    </button>
);

export default M3ChoiceCard;
