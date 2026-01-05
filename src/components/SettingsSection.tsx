
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
    let iconClass = 'bg-surface-container-high text-on-surface-variant';
    let textClass = 'text-on-surface';

    if (variant === 'primary') { iconClass = 'bg-primary-container text-on-primary-container'; textClass = 'text-primary'; }
    if (variant === 'secondary') { iconClass = 'bg-secondary-container text-on-secondary-container'; textClass = 'text-secondary'; }
    if (variant === 'tertiary') { iconClass = 'bg-tertiary-container text-on-tertiary-container'; textClass = 'text-tertiary'; }

    return (
        <section className={`bg-surface-container-low rounded-3xl border border-outline-variant overflow-hidden mb-6 shadow-sm ${className}`}>
            <div className="flex items-center gap-8 p-5 border-b border-outline-variant/50 bg-surface/50 backdrop-blur-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className={`m3-title-medium font-bold truncate ${textClass}`}>{title}</h3>
                    {subtitle && <p className="m3-body-small text-on-surface-variant opacity-80 truncate">{subtitle}</p>}
                </div>
            </div>
            <div className="p-5 animate-in fade-in slide-in-from-top-1 duration-300">
                {children}
            </div>
        </section>
    );
};

export default SettingsSection;
