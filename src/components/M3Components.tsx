export { default as M3Button } from './M3Button';
import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// --- INPUTS M3 EXPRESSIVE (AURA) ---

export const TextField: React.FC<InputHTMLAttributes<HTMLInputElement> & { label: string; error?: boolean; errorMessage?: string; leadingIcon?: string; containerClassName?: string }> = ({ label, error, errorMessage, leadingIcon, containerClassName = '', ...props }) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    return (
        <div className={`m3-field-container ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper ${error ? 'error' : ''} group`}>
                {leadingIcon && <span className="material-symbols-outlined opacity-60 group-focus-within:opacity-100 group-focus-within:text-primary transition-all">{leadingIcon}</span>}
                <input
                    {...props}
                    className="m3-field-input"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                />
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2" aria-hidden="true">error</span>
                )}
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-error text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export const SelectField: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: boolean; errorMessage?: string; containerClassName?: string }> = ({ label, error, errorMessage, containerClassName = '', children, ...props }) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    return (
        <div className={`m3-field-container ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper relative group${error ? ' error' : ''}`}>
                <select
                    {...props}
                    className="m3-field-select"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                >
                    {children}
                </select>
                <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all">expand_more</span>
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2 absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true">error</span>
                )}
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-error text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export const TextArea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: boolean; errorMessage?: string; containerClassName?: string }> = ({ label, error, errorMessage, containerClassName = '', ...props }) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    return (
        <div className={`m3-field-container ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper group${error ? ' error' : ''}`}>
                <textarea
                    {...props}
                    className="m3-field-input resize-none"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    rows={props.rows || 3}
                />
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2 absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true">error</span>
                )}
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-error text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

// --- AI MEMORY CHIP ---
export const AiMemoryChip: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-1.5 mt-2 opacity-60 hover:opacity-100 transition-opacity select-none cursor-help bg-tertiary-container/20 px-3 py-1 rounded-full border border-tertiary/10" title="Contesto utilizzato dall'AI">
        <span className="material-symbols-outlined text-[14px] text-tertiary font-bold animate-pulse">psychology</span>
        <span className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest">{label}</span>
    </div>
);

// --- ACTION TILE (Bento Style Expressive) ---
export const ActionTile: React.FC<{ title: string; subtitle?: string; icon: string; onClick: () => void; variant?: string; className?: string; tooltip?: string }> = ({ title, subtitle, icon, onClick, variant = 'surface', className = '', tooltip }) => (
    <button
        onClick={onClick}
        className={`op-tile op-tile-variant-${variant} ${className} group overflow-hidden`}
        title={tooltip}
    >
        <div className="op-tile-icon-container shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="op-tile-content">
            <div className="op-tile-title font-extrabold text-left group-hover:text-primary transition-colors">{title}</div>
            {subtitle && <div className="op-tile-subtitle text-[11px] font-extrabold text-left opacity-60 uppercase tracking-widest">{subtitle}</div>}
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            <span className="material-symbols-outlined op-tile-chevron opacity-30 group-hover:opacity-100">chevron_right</span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"></div>
    </button>
);

// --- INFO CARD (Expressive Glass) ---
export const InfoCard: React.FC<{ title: string; description: string; icon?: string; variant?: string; className?: string; action?: React.ReactNode; onClose?: () => void }> = ({ title, description, icon, variant = 'surface', className = '', action, onClose }) => {
    const variantMap: Record<string, string> = {
        primary: 'bg-primary-container/80 text-on-primary-container border-primary/10',
        tertiary: 'bg-tertiary-container/80 text-on-tertiary-container border-tertiary/10',
        error: 'bg-error-container/80 text-on-error-container border-error/10',
        surface: 'bg-surface-container/80 text-on-surface border-outline-variant/10'
    };
    const variantClasses = variantMap[variant] || variantMap.surface;

    return (
        <div
            className={`p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl md:shadow-2xl backdrop-blur-2xl border border-white/10 dark:border-black/10 overflow-hidden relative group transition-all duration-500 hover:shadow-primary/10 ${variantClasses} ${className}`}
            style={{
                boxShadow: '0 6px 32px 0 rgba(60, 30, 90, 0.10), 0 1.5px 6px 0 rgba(60,30,90,0.08)',
                border: '1.5px solid rgba(80,80,120,0.10)',
                backgroundClip: 'padding-box',
            }}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {icon && (
                    <div className="p-5 rounded-2xl bg-white/30 dark:bg-black/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl">{icon}</span>
                    </div>
                )}
                <div className="flex-grow">
                    <h3 className="m3-headline-small font-extrabold mb-3 tracking-tight">{title}</h3>
                    <p className="m3-body-large opacity-90 leading-relaxed">{description}</p>
                    {action && <div className="mt-8 flex justify-end">{action}</div>}
                </div>
                {onClose && (
                    <button onClick={onClose} className="icon-button !w-12 !h-12 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>
        </div>
    );
};

// --- SECTION HEADER ---
export const SectionHeader: React.FC<{ title: string; icon?: string; colorClass?: string }> = ({ title, icon, colorClass = 'text-on-surface' }) => (
    <div className={`flex items-center gap-4 mb-6 mt-10 px-4 ${colorClass}`}>
        {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
            </div>
        )}
        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.5em] opacity-40">{title}</h3>
        <div className="flex-grow h-px bg-gradient-to-r from-outline-variant/50 to-transparent ml-4"></div>
    </div>
);

// --- TAB GROUP ---
export const TabGroup: React.FC<{ tabs: { id: string, label: string, icon?: string, badge?: number | string }[]; activeTab: string; onTabChange: (id: string) => void; variant?: string; className?: string; isIconOnly?: boolean }> = ({ tabs, activeTab, onTabChange, variant = 'primary', className = '', isIconOnly = false }) => (
    <div className={`tab-group ${variant} ${className}`}>
        {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`tab ${isActive ? 'active' : ''}`}
                >
                    {tab.icon && <span className="material-symbols-outlined">{tab.icon}</span>}
                    {!isIconOnly && <span>{tab.label}</span>}
                    {tab.badge !== undefined && <span className="tab-badge">{tab.badge}</span>}
                </button>
            )
        })}
    </div>
);

// --- PIN PAD ---
export const PinPad: React.FC<{ onInput: (digit: string) => void; onDelete: () => void }> = ({ onInput, onDelete }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];
    return (
        <div className="grid grid-cols-3 gap-6 max-w-[340px] mx-auto mt-10">
            {keys.map((key, i) => {
                if (key === '') return <div key={i}></div>;
                if (key === 'back') return <button key={i} onClick={onDelete} className="w-20 h-20 rounded-[32px] flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90"><span className="material-symbols-outlined text-3xl font-light">backspace</span></button>;
                return <button key={i} onClick={() => onInput(key)} className="w-20 h-20 rounded-[32px] bg-surface-container text-3xl font-extrabold border-2 border-outline-variant/30 hover:border-primary hover:bg-surface hover:shadow-xl active:scale-90 transition-all">{key}</button>; 
            })}
        </div>
    );
};

export const M3ChoiceCard: React.FC<{ icon: string; label: string; onClick: () => void; selected: boolean; className?: string }> = ({ icon, label, onClick, selected, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-8 rounded-[40px] border-2 transition-all gap-4 min-w-[140px] group ${selected ? 'border-primary bg-primary-container text-on-primary-container shadow-2xl scale-[1.05]' : 'border-outline-variant/30 bg-surface-container/50 hover:border-outline hover:bg-surface-container-high'} ${className}`}
    >
        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${selected ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface text-primary group-hover:scale-110'}`}>
            <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">{label}</span>
    </button>
);

// --- CATEGORY CARD (Expressive) ---
export const CategoryCard: React.FC<{ id: string; label: string; icon: string; color: string; isSelected: boolean; onClick: () => void; description?: string }> = ({ label, icon, color, isSelected, onClick, description }) => (
    <div
        onClick={onClick}
        className={`flex flex-col items-center gap-4 p-5 rounded-[32px] border-2 transition-all cursor-pointer group ${isSelected ? 'border-primary bg-primary-container shadow-xl scale-[1.02]' : 'border-outline-variant/20 bg-surface-container/30 hover:border-outline-variant/60 hover:bg-surface-container/50'}`}
    >
        <div
            className="w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
            style={{ backgroundColor: isSelected ? 'var(--sys-primary)' : color + '20', color: isSelected ? 'var(--sys-on-primary)' : color }}
        >
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-black text-center tracking-tight">{label}</span>
            {description && <p className="text-[10px] text-on-surface-variant text-center opacity-60 leading-tight font-medium line-clamp-2 px-2">{description}</p>}
        </div>
    </div>
);

export const EmptyState: React.FC<{ title: string; description: string; icon?: string }> = ({ title, description, icon = 'inbox' }) => (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-surface-container-low/50 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-outline-variant/30">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-8 text-on-surface-variant/30 shadow-inner">
            <span className="material-symbols-outlined text-6xl font-light">{icon}</span>
        </div>
        <h3 className="m3-headline-small text-on-surface font-extrabold tracking-tight">{title}</h3>
        <p className="m3-body-large text-on-surface-variant max-w-sm mx-auto mt-4 font-bold opacity-60 italic">"{description}"</p>
    </div>
);

// --- MANUAL & USE CASE ---
export const ManualSection: React.FC<{ title: string; icon: string; colorClass?: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, colorClass = '', children, defaultOpen = false }) => (
    <details className="m3-expansion-panel group border-none bg-surface-container-low/50 backdrop-blur-sm rounded-[32px] mb-4 overflow-hidden" open={defaultOpen} style={{ transition: 'all var(--motion-duration-medium2) var(--motion-easing-standard)' }}>
        <summary className="m3-expansion-summary !px-6 !py-5 hover:bg-surface-container-high/80 cursor-pointer list-none flex justify-between items-center" style={{ transition: 'background-color var(--motion-duration-short3) var(--motion-easing-standard)' }}>
            <div className={`flex items-center gap-5 ${colorClass}`}>
                <div className="p-3 rounded-2xl bg-surface-container-highest shadow-sm group-hover:scale-110" style={{ transition: 'transform var(--motion-duration-short3) var(--motion-easing-standard)' }}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <h3 className="m3-title-large font-black tracking-tight">{title}</h3>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-outline-variant/20 group-open:rotate-180" style={{ transition: 'transform var(--motion-duration-medium2) var(--motion-easing-emphasized)' }}>
                <span className="material-symbols-outlined">expand_more</span>
            </div>
        </summary>
        <div className="m3-expansion-content !px-8 !pb-8 space-y-6 pt-2">{children}</div>
    </details>
);

export const UseCaseCard: React.FC<{ scenario: string; steps: string[]; tip?: string }> = ({ scenario, steps, tip }) => (
    <div className="bg-surface/80 backdrop-blur-md p-6 rounded-[28px] border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
            </div>
            <p className="m3-label-small text-primary uppercase font-black tracking-[0.2em] opacity-70">Scenario</p>
        </div>
        <p className="m3-title-large font-extrabold mb-5 leading-tight italic">"{scenario}"</p>
        <ol className="space-y-4">
            {steps.map((step, i) => (
                <li key={i} className="flex gap-4 items-start group">
                    <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-on-primary transition-colors">{i + 1}</span>
                    <p className="m3-body-medium text-on-surface-variant font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: step }}></p>
                </li>
            ))}
        </ol>
        {tip && (
            <div className="mt-8 flex gap-4 p-4 bg-secondary-container/30 rounded-[20px] text-sm border border-secondary/10">
                <span className="material-symbols-outlined text-secondary font-black">tips_and_updates</span>
                <span className="font-bold italic text-on-secondary-container opacity-80">{tip}</span>
            </div>
        )}
    </div>
);

// --- GENERIC M3 COMPONENTS ---

// M3 Card (Generic Container)
export const M3Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`bg-surface-container rounded-[24px] p-6 shadow-sm border border-outline-variant/20 ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-[0.98]' : ''} ${className}`}
    >
        {children}
    </div>
);

// M3 Dialog (Modal Wrapper)
// M3 Dialog (Modal Wrapper)
// M3 Dialog (Modal Wrapper)
export const M3Dialog: React.FC<{ isOpen: boolean; onClose: () => void; title: string; headline?: string; children: React.ReactNode; buttons?: React.ReactNode; fullscreen?: boolean }> = ({ isOpen, onClose, title, headline, children, buttons, fullscreen = false }) => {
    if (!isOpen) return null;
    return (
        <div className={`fixed inset-0 z-[3000] flex items-center justify-center p-4 ${fullscreen ? '!p-0 md:!p-4' : ''}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            {/* Dialog Panel */}
            <div className={`relative bg-surface-container-high w-full ${fullscreen ? 'h-full md:max-w-5xl md:h-[90vh] rounded-none md:rounded-[28px]' : 'max-w-lg rounded-[28px] max-h-[90vh]'} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-outline-variant/20 flex flex-col`}>
                <div className="px-6 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="m3-headline-small font-black text-on-surface line-clamp-1">{title}</h2>
                        {headline && <p className="m3-body-medium text-on-surface-variant opacity-80 line-clamp-2 mt-1">{headline}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {buttons && fullscreen && <div className="flex gap-2 mr-2">{buttons}</div>}
                        <button onClick={onClose} className="icon-button !w-10 !h-10 hover:bg-surface-container-highest transition-colors rounded-full">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className={`px-4 md:px-6 py-4 md:py-6 overflow-y-auto custom-scrollbar flex-grow ${fullscreen ? 'bg-surface-container-low' : ''}`}>
                    {children}
                </div>

                {!fullscreen && buttons && (
                    <div className="px-6 py-4 bg-surface-container-highest/30 border-t border-outline-variant/10 flex justify-end gap-3 shrink-0">
                        {buttons}
                    </div>
                )}
            </div>
        </div>
    );
};

// M3 List Item
export const M3ListItem: React.FC<{
    headline: React.ReactNode;
    headlineSize?: 'small' | 'medium' | 'large';
    supportingText?: React.ReactNode;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}> = ({ headline, headlineSize = 'medium', supportingText, leadingElement, trailingElement, onClick, className = '', children }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-4 rounded-xl transition-all ${onClick ? 'cursor-pointer hover:bg-surface-container-highest/50 active:bg-surface-container-highest' : ''} ${className}`}
    >
        {leadingElement && <div className="flex-shrink-0 mt-0.5">{leadingElement}</div>}
        <div className="flex-grow min-w-0 flex flex-col gap-0.5">
            <div className={`text-on-surface font-bold truncate ${headlineSize === 'small' ? 'm3-body-medium' : headlineSize === 'large' ? 'm3-title-medium' : 'm3-body-large'}`}>
                {headline}
            </div>
            {supportingText && (
                <div className="m3-body-small text-on-surface-variant opacity-80">
                    {supportingText}
                </div>
            )}
            {children}
        </div>
        {trailingElement && <div className="flex-shrink-0 flex items-center gap-2 self-center">{trailingElement}</div>}
    </div>
);

// --- M3 ICON BUTTON (Accessible wrapper) ---
export const M3IconButton: React.FC<{ 
    icon: string; 
    onClick?: () => void;
    ariaLabel: string;
    disabled?: boolean;
    className?: string;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
}> = ({ icon, onClick, ariaLabel, disabled = false, className = '', title, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        title={title || ariaLabel}
        className={`icon-button ${className}`}
    >
        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
    </button>
);

// --- M3 ANIMATED ICON (Spin, Pulse, Bounce) ---
export const M3AnimatedIcon: React.FC<{
    icon: string;
    animation?: 'spin' | 'pulse' | 'bounce' | 'fade';
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ icon, animation = 'spin', color = 'text-primary', size = 'md' }) => {
    const sizeMap = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl'
    };
    const animationMap = {
        spin: 'animate-spin',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        fade: 'animate-fade'
    };
    return (
        <span className={`material-symbols-outlined ${sizeMap[size]} ${color} ${animationMap[animation]}`}>
            {icon}
        </span>
    );
};

// --- M3 BADGED ICON (For notifications) ---
export const M3BadgedIcon: React.FC<{
    icon: string;
    badge?: number | string;
    badgeColor?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}> = ({ icon, badge, badgeColor = 'bg-error text-on-error', size = 'md', color = 'text-on-surface' }) => {
    const sizeMap = {
        sm: { container: 'text-lg', badge: 'text-xs px-1.5 py-0.5' },
        md: { container: 'text-2xl', badge: 'text-sm px-2 py-1' },
        lg: { container: 'text-4xl', badge: 'text-base px-2.5 py-1' }
    };
    return (
        <div className="relative inline-flex items-center justify-center">
            <span className={`material-symbols-outlined ${sizeMap[size].container} ${color}`}>
                {icon}
            </span>
            {badge !== undefined && badge !== null && (
                <span className={`absolute -top-1 -right-1 ${badgeColor} rounded-full font-bold ${sizeMap[size].badge} flex items-center justify-center min-w-6`}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
};

// --- M3 STATUS ICON (For status indicators) ---
export const M3StatusIcon: React.FC<{
    status: 'pending' | 'success' | 'error' | 'warning' | 'info' | 'loading';
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}> = ({ status, size = 'md', label }) => {
    const statusConfig = {
        pending: { icon: 'pending', color: 'text-warning', label: 'In attesa' },
        success: { icon: 'check_circle', color: 'text-success', label: 'Completato' },
        error: { icon: 'error', color: 'text-error', label: 'Errore' },
        warning: { icon: 'warning', color: 'text-warning', label: 'Attenzione' },
        info: { icon: 'info', color: 'text-secondary', label: 'Informazione' },
        loading: { icon: 'pending', color: 'text-primary animate-spin', label: 'Caricamento' }
    };
    
    const config = statusConfig[status];
    const sizeMap = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
    
    return (
        <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${sizeMap[size]} ${config.color}`} style={status === 'loading' ? { animation: 'spin 1s linear infinite' } : {}}>
                {config.icon}
            </span>
            {label && <span className="text-sm font-semibold">{label}</span>}
        </div>
    );
};

