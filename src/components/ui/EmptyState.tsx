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
    <div className="flex flex-col items-center justify-center p-16 text-center bg-surface-container-low/50 backdrop-blur-sm rounded-5xl border-2 border-dashed border-outline-variant/30">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-8 text-on-surface-variant/30 shadow-inner">
            <span className="material-symbols-outlined text-6xl font-light">{icon}</span>
        </div>
        <h3 className="m3-headline-small text-on-surface font-extrabold tracking-tight">{title}</h3>
        <p className="m3-body-large text-on-surface-variant max-w-sm mx-auto mt-4 font-bold opacity-60 italic">"{description}"</p>
    </div>
);

export default EmptyState;
