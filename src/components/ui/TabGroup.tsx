// MD3 Compliant

import React, { useState } from 'react';
import M3Typography from './M3Typography';

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
    variant?: 'primary' | 'secondary' | 'tertiary';
    className?: string;
    isIconOnly?: boolean;
}

/**
 * MD3-compliant TabGroup component
 * Migrated from legacy CSS classes to pure MD3 tokens and M3Typography
 * Features: proper ARIA tab pattern, keyboard navigation, variants, icons, badges
 */
const TabGroup: React.FC<TabGroupProps> = ({
    tabs,
    activeTab,
    onTabChange,
    variant = 'primary',
    isIconOnly = false
}) => {
    const [hoveredTabs, setHoveredTabs] = useState<Record<string, boolean>>({});
    const [focusedTabs, setFocusedTabs] = useState<Record<string, boolean>>({});

    // Define variant colors based on the variant prop - MD3 tokens
    const variantColors = {
        primary: {
            activeBg: 'var(--md-sys-color-primary)',
            activeText: 'var(--md-sys-color-on-primary)'
        },
        secondary: {
            activeBg: 'var(--md-sys-color-secondary)',
            activeText: 'var(--md-sys-color-on-secondary)'
        },
        tertiary: {
            activeBg: 'var(--md-sys-color-tertiary)',
            activeText: 'var(--md-sys-color-on-tertiary)'
        }
    }[variant];

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
        <div
            role="tablist"
            aria-label="Sezioni di navigazione"
            style={{
                display: 'flex',
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                padding: 'var(--md-sys-spacing-1)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)`,
                gap: 'var(--md-sys-spacing-1)'
            }}
        >
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                const isHovered = hoveredTabs[tab.id] || false;
                const isFocused = focusedTabs[tab.id] || false;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        data-testid={`tab-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        style={{
                            position: 'relative',
                            flex: 1,
                            padding: `var(--md-sys-spacing-2) var(--md-sys-spacing-4)`,
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            border: 'none',
                            backgroundColor: isActive
                                ? variantColors.activeBg
                                : (isHovered && !isActive ? 'var(--md-sys-color-surface-container-high)' : 'transparent'),
                            color: isActive
                                ? variantColors.activeText
                                : 'var(--md-sys-color-on-surface-variant)',
                            fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                            fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--md-sys-typescale-label-small-letter-spacing)',
                            cursor: 'pointer',
                            transition: `all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)`,
                            boxShadow: isActive ? 'var(--md-sys-elevation-level1)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--md-sys-spacing-2)',
                            outline: isFocused ? `var(--md-sys-border-width-medium) solid var(--md-sys-color-primary)` : 'none',
                            outlineOffset: isFocused ? 'var(--md-sys-spacing-1)' : '0'
                        }}
                        onMouseEnter={() => setHoveredTabs(prev => ({ ...prev, [tab.id]: true }))}
                        onMouseLeave={() => setHoveredTabs(prev => ({ ...prev, [tab.id]: false }))}
                        onFocus={() => setFocusedTabs(prev => ({ ...prev, [tab.id]: true }))}
                        onBlur={() => setFocusedTabs(prev => ({ ...prev, [tab.id]: false }))}
                    >
                        {tab.icon && (
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: 'var(--md-sys-typescale-label-large-font-size)'
                                }}
                                aria-hidden="true"
                            >
                                {tab.icon}
                            </span>
                        )}
                        {!isIconOnly && (
                            <M3Typography
                                variant="label-small"
                                style={{
                                    textTransform: 'uppercase',
                                    letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'
                                }}
                            >
                                {tab.label}
                            </M3Typography>
                        )}
                        {tab.badge !== undefined && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 'var(--md-sys-spacing-4)',
                                    height: 'var(--md-sys-spacing-4)',
                                    padding: `0 ${'var(--md-sys-spacing-1)'}`,
                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                    backgroundColor: 'var(--md-sys-color-error)',
                                    color: 'var(--md-sys-color-on-error)',
                                    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
                                    lineHeight: 1
                                }}
                                aria-label={`${tab.badge} elementi`}
                            >
                                {tab.badge}
                            </span>
                        )}
                        {isActive && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 'calc(var(--md-sys-spacing-1) * -1)',
                                    left: 'var(--md-sys-percent-50)',
                                    transform: 'translateX(-50%)',
                                    width: 'var(--md-sys-percent-60)',
                                    height: 'var(--md-sys-spacing-2)',
                                    backgroundColor: variantColors.activeBg,
                                    borderRadius: 'var(--md-sys-spacing-2)'
                                }}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default TabGroup;

