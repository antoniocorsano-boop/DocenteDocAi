import React from 'react';
import M3Typography from './M3Typography';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

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
    className = '',
    isIconOnly = false
}) => {
    const getVariantColors = () => {
        switch (variant) {
            case 'secondary':
                return {
                    activeBg: 'var(--md-sys-color-secondary)',
                    activeText: 'var(--md-sys-color-on-secondary)'
                };
            case 'tertiary':
                return {
                    activeBg: 'var(--md-sys-color-tertiary)',
                    activeText: 'var(--md-sys-color-on-tertiary)'
                };
            default:
                return {
                    activeBg: 'var(--md-sys-color-primary)',
                    activeText: 'var(--md-sys-color-on-primary)'
                };
        }
    };

    const variantColors = getVariantColors();

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
                border: '1px solid var(--md-sys-color-outline-variant)',
                gap: 'var(--md-sys-spacing-1)'
            }}
        >
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
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
                            padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            border: 'none',
                            backgroundColor: isActive
                                ? variantColors.activeBg
                                : 'transparent',
                            color: isActive
                                ? variantColors.activeText
                                : 'var(--md-sys-color-on-surface-variant)',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                            fontWeight: 'var(--md-sys-typescale-label-small-font-weight)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)',
                            boxShadow: isActive ? 'var(--md-sys-elevation-level1)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-2)',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
                            e.currentTarget.style.outlineOffset = '2px';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                            e.currentTarget.style.outlineOffset = '0';
                        }}
                    >
                        {tab.icon && (
                            <span
                                style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--md-sys-typescale-label-small-font-size)'
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
                                    letterSpacing: '0.5px'
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
                                    padding: '0 var(--md-sys-spacing-1)',
                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                    backgroundColor: 'var(--md-sys-color-error)',
                                    color: 'var(--md-sys-color-on-error)',
                                    fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-label-small-font-weight)',
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
                                    bottom: '-1px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: '3px',
                                    backgroundColor: variantColors.activeBg,
                                    borderRadius: '2px'
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


