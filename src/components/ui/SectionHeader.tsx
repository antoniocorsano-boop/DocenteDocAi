import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    colorClass?: string;
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
    title, 
    subtitle,
    icon, 
    colorClass = 'text-[var(--md-sys-color-on-surface)]',
    className = ''
}) => (
    <div className={`flex items-center gap-8 mb-6 mt-10 px-4 ${colorClass} ${className}`}>
        {icon && (
            <div className="w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
            </div>
        )}
        <div className="flex flex-col">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.5em] opacity-40">{title}</h3>
            {subtitle && <p className="text-xs opacity-60 mt-4">{subtitle}</p>}
        </div>
        <div className="flex-grow h-px bg-gradient-to-r from-outline-variant/50 to-transparent ml-4"></div>
    </div>
);

export default SectionHeader;
