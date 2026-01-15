// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React, { useState } from 'react';
import M3Typography from './M3Typography';
import { useTheme } from '../../theme/theme';

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
    const { layers } = useTheme();
    const {
        sys: { color: { primary, onPrimary, secondary, onSecondary, tertiary, onTertiary, surfaceContainerLow, surfaceContainerHigh, onSurfaceVariant, error, onError, outlineVariant } },
        ref: { spacing, shape: { corner: { full } }, typescale: { labelSmall } },
        motion: { duration: { short4 }, easing: { standard } },
        elevation: { level1 }
    } = layers;
    const [hoveredTabs, setHoveredTabs] = useState<Record<string, boolean>>({});
    const [focusedTabs, setFocusedTabs] = useState<Record<string, boolean>>({});

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
            style={{display: 'flex',
                backgroundColor: surfaceContainerLow,
                padding: spacing['1'],
                borderRadius: full,
                border: `1px solid ${outlineVariant}`,
                gap: spacing['1']}}
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
                            padding: `${spacing['2']} ${spacing['4']}`,
                            borderRadius: full,
                            border: 'none',
                            backgroundColor: isActive
                                ? variantColors.activeBg
                                : (isHovered && !isActive ? surfaceContainerHigh : 'transparent'),
                            color: isActive
                                ? variantColors.activeText
                                : onSurfaceVariant,
                            fontSize: labelSmall.fontSize,
                            fontWeight: labelSmall.fontWeight,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: `all ${short4} ${standard}`,
                            boxShadow: isActive ? level1 : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing['2'],
                            outline: isFocused ? `2px solid ${primary}` : 'none',
                            outlineOffset: isFocused ? ref.spacing[2] : '0'}}
                        onMouseEnter={() => setHoveredTabs(prev => ({ ...prev, [tab.id]: true }))}
                        onMouseLeave={() => setHoveredTabs(prev => ({ ...prev, [tab.id]: false }))}
                        onFocus={() => setFocusedTabs(prev => ({ ...prev, [tab.id]: true }))}
                        onBlur={() => setFocusedTabs(prev => ({ ...prev, [tab.id]: false }))}
                    >
                        {tab.icon && (
                            <span
                                style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: labelSmall.fontSize}}
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
                                    minWidth: spacing['4'],
                                    height: spacing['4'],
                                    padding: `0 ${spacing['1']}`,
                                    borderRadius: full,
                                    backgroundColor: error,
                                    color: onError,
                                    fontSize: labelSmall.fontSize,
                                    fontWeight: labelSmall.fontWeight,
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
                                    height: ref.spacing[3],
                                    backgroundColor: variantColors.activeBg,
                                    borderRadius: ref.spacing[2]
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



