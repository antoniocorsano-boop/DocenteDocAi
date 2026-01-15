// LEGACY - MD3 Non-compliant

import React from 'react';
import { useTheme } from '../theme/theme';

interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, subtitle, icon, children, , variant = 'surface' }) => {
  const { layers } = useTheme();
    
    // Mappatura colori intestazione basata sulla variante
    let iconClass = 'bg-[var(--md-sys-color-surfaceContainerHigh)] text-[var(--md-sys-color-onSurface)]-variant';
    let textClass = 'text-[var(--md-sys-color-onSurface)]';

    if (variant === 'primary') { iconClass = 'bg-primaryContainer text-on-primaryContainer'; textClass = 'text-primary'; }
    if (variant === 'secondary') { iconClass = 'bg-secondary-container text-on-secondary-container'; textClass = 'text-secondary'; }
    if (variant === 'tertiary') { iconClass = 'bg-tertiary-container text-on-tertiary-container'; textClass = 'text-tertiary'; }

    return (
        <section className={`bg-[var(--md-sys-color-surfaceContainerLow)] rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)] overflow-hidden mb-6 shadow-[var(--md-sys-elevation-level1)] ${className}`}>
            <div style={{ backgroundColor: sys.colors.surface/50 }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], padding: layers.ref.spacing['5'], borderBottom: "1px solid layers.sys.color.outline"}}>
                <div className={`w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    <span  style={{ fontSize: "1.5rem" }}>{icon}</span>
                </div>
                <div style={{ flexGrow: "1", minWidth: "0" }}>
                    <h3 className={`m3-title-medium font-bold truncate ${textClass}`}>{title}</h3>
                    {subtitle && <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ opacity: "0.8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</p>}
                </div>
            </div>
            <div  style={{padding: layers.ref.spacing['5']}}>
                {children}
            </div>
        </section>
    );
};

export default SettingsSection;







