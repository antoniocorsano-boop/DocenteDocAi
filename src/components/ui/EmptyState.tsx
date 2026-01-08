import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    title, 
    description, 
    icon = 'inbox' 
}) => (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-sm rounded-5xl border-2 border-dashed border-[var(--md-sys-color-outline-variant)]/30">
        <div className="w-24 h-24 rounded-full bg-[var(--md-sys-color-surface-container-high)] flex items-center justify-center mb-8 text-[var(--md-sys-color-on-surface)]-variant/30 shadow-inner">
            <span className="material-symbols-outlined text-6xl font-light">{icon}</span>
        </div>
        <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)] font-extrabold tracking-tight">{title}</h3>
        <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] text-[var(--md-sys-color-on-surface)]-variant max-w-sm mx-auto mt-4 font-bold opacity-60 italic">"{description}"</p>
    </div>
);

export default EmptyState;


