import React from 'react';

interface ManualSectionProps {
    title: string;
    icon: string;
    colorClass?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const ManualSection: React.FC<ManualSectionProps> = ({ 
    title, 
    icon, 
    colorClass = '', 
    children, 
    defaultOpen = false 
}) => (
    <details 
        className="m3-expansion-panel group border-none bg-surface-container-low/50 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden" 
        open={defaultOpen} 
        style={{ transition: 'all var(--motion-duration-medium2) var(--motion-easing-standard)' }}
    >
        <summary 
            className="m3-expansion-summary !px-6 !py-5 hover:bg-surface-container-high/80 cursor-pointer list-none flex justify-between items-center" 
            style={{ transition: 'background-color var(--motion-duration-short3) var(--motion-easing-standard)' }}
        >
            <div className={`flex items-center gap-5 ${colorClass}`}>
                <div 
                    className="p-3 rounded-2xl bg-surface-container-highest shadow-sm group-hover:scale-110" 
                    style={{ transition: 'transform var(--motion-duration-short3) var(--motion-easing-standard)' }}
                >
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <h3 className="m3-title-large font-black tracking-tight">{title}</h3>
            </div>
            <div 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-outline-variant/20 group-open:rotate-180" 
                style={{ transition: 'transform var(--motion-duration-medium2) var(--motion-easing-emphasized)' }}
            >
                <span className="material-symbols-outlined">expand_more</span>
            </div>
        </summary>
        <div className="m3-expansion-content !px-8 !pb-8 space-y-6 pt-2">{children}</div>
    </details>
);

export default ManualSection;
