import React from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: string;
    badge?: number | string;
}

interface TabGroupProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    variant?: string;
    className?: string;
    isIconOnly?: boolean;
}

const TabGroup: React.FC<TabGroupProps> = ({ 
    tabs, 
    activeTab, 
    onTabChange, 
    variant = 'primary', 
    className = '', 
    isIconOnly = false 
}) => {
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        let newIndex = -1;
        if (e.key === 'ArrowRight') {
            newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
            newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            newIndex = 0;
        } else if (e.key === 'End') {
            newIndex = tabs.length - 1;
        }

        if (newIndex !== -1) {
            e.preventDefault();
            onTabChange(tabs[newIndex].id);
            // Focus the new tab
            const nextTab = document.getElementById(`tab-${tabs[newIndex].id}`);
            nextTab?.focus();
        }
    };

    return (
        <div className={`tab-group ${variant} ${className}`} role="tablist" aria-label="Sezioni di navigazione">
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`tab ${isActive ? 'active' : ''}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        data-testid={`tab-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {tab.icon && <span className="material-symbols-outlined">{tab.icon}</span>}
                        {!isIconOnly && <span>{tab.label}</span>}
                        {tab.badge !== undefined && <span className="tab-badge">{tab.badge}</span>}
                    </button>
                )
            })}
        </div>
    );
};

export default TabGroup;
