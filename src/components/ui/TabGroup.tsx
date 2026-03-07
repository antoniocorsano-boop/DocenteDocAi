// Thin MUI wrapper — preserves TabGroup props API for backward compatibility
// @mui-migrated Fase 2
import React, { SyntheticEvent } from 'react';
import { Tabs, Tab, Badge, Box } from '@mui/material';

interface Tab {
    id: string;
    label: string;
    icon?: string;
    badge?: number | string;
}

interface TabGroupProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange?: (id: string) => void;
    onChange?: (id: string) => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'filled' | 'tonal' | 'contained' | 'outlined';
    className?: string;
    style?: React.CSSProperties;
    isIconOnly?: boolean;
}

const TabGroup: React.FC<TabGroupProps> = ({
    tabs,
    activeTab,
    onTabChange,
    onChange,
    variant = 'primary',
    isIconOnly = false,
    style,
}) => {
    const handleChange = (_: SyntheticEvent, newValue: string) => {
        onTabChange?.(newValue);
        onChange?.(newValue);
    };

    const effectiveVariant = variant === 'filled' || variant === 'tonal' ? 'secondary' : variant;
    const indicatorColor = effectiveVariant === 'secondary' ? 'secondary' : effectiveVariant === 'tertiary' ? undefined : 'primary';
    const tertiarySx = effectiveVariant === 'tertiary'
        ? { '& .MuiTabs-indicator': { bgcolor: 'var(--md-sys-color-tertiary)' }, '& .Mui-selected': { color: 'var(--md-sys-color-tertiary) !important' } }
        : {};

    return (
        <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor={indicatorColor as 'primary' | 'secondary'}
            textColor={indicatorColor as 'primary' | 'secondary'}
            aria-label="Sezioni di navigazione"
            sx={{
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                minHeight: 'auto',
                p: 0.5,
                ...tertiarySx,
                ...style,
            }}
        >
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    value={tab.id}
                    id={`tab-${tab.id}`}
                    aria-controls={`panel-${tab.id}`}
                    data-testid={`tab-${tab.id}`}
                    label={
                        <Badge badgeContent={tab.badge} color="error">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {tab.icon && (
                                    <Box
                                        component="span"
                                        className="material-symbols-outlined"
                                        aria-hidden="true"
                                        sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}
                                    >
                                        {tab.icon}
                                    </Box>
                                )}
                                {!isIconOnly && tab.label}
                            </Box>
                        </Badge>
                    }
                    sx={{
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        minHeight: 'auto',
                        py: 1,
                        px: 2,
                        textTransform: 'uppercase',
                        fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                    }}
                />
            ))}
        </Tabs>
    );
};

export default TabGroup;

