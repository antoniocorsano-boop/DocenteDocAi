
import React from 'react';

interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, subtitle, icon, children, className = '', variant = 'surface' }) => {
    
    // Mappatura colori intestazione basata sulla variante
    let iconClass = 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)]-variant';
    let textClass = 'text-[var(--md-sys-color-on-surface)]';

    if (variant === 'primary') { iconClass = 'bg-primary-container text-on-primary-container'; textClass = 'text-primary'; }
    if (variant === 'secondary') { iconClass = 'bg-secondary-container text-on-secondary-container'; textClass = 'text-secondary'; }
    if (variant === 'tertiary') { iconClass = 'bg-tertiary-container text-on-tertiary-container'; textClass = 'text-tertiary'; }

    return (
        <section className={`bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)] overflow-hidden mb-6 shadow-[var(--md-sys-elevation-level1)] ${className}`}>
            <div className="flex items-center gap-8 p-5 border-b border-[var(--md-sys-color-outline-variant)]/50 bg-surface/50 backdrop-blur-sm">
                <div className={`w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className={`m3-title-medium font-bold truncate ${textClass}`}>{title}</h3>
                    {subtitle && <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant opacity-80 truncate">{subtitle}</p>}
                </div>
            </div>
            <div className="p-5 animate-in fade-in slide-in-from-top-1 duration-300">
                {children}
            </div>
        </section>
    );
};

export default SettingsSection;


