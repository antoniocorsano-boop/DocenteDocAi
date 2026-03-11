// MD3 Compliant - Migration completed with functional exceptions

// MD3 Pure: Complete migration to inline styles using MD3 tokens for all settings interface and interactions
// All legacy CSS classes removed in favor of token-based styling - MD3 compliant
// Migration completed: interface_experience, profile, ai_didattica, ai_suggestions, cloud, debug_logging, advanced sections
// Settings.tsx: Migrated with functional exceptions for layout percentages and specific dimensions
// All styles now use MD3 design tokens and semantic color/spacing/elevation system where exact matches exist
// Functional exceptions: width/height percentages (100%, 50%, 20%, 10%), grid minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)) for responsive layout
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import React, { useRef, useState, useEffect } from 'react';
import { SettingsProps, AppThemeState } from '../types';
import { THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS } from '../constants';
import { generateNextSchoolYear } from '../utils/schoolUtils';
import {
    TextField,
    SectionHeader,
    InfoCard
} from './ui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import '../design-system/md3-utilities.css';
import ThemeBubble from './ThemeBubble';

import ChipInputList from './ChipInputList';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { errorLogger } from '../services/errorLogger';

const SettingsGroup: React.FC<{
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'contained' | 'tonal' | 'elevated' | 'outlined';
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ id, title, subtitle, icon, variant, expanded, onToggle, children }) => {

    const iconBg = variant === 'primary'
        ? 'var(--md-sys-color-primary-container)'
        : variant === 'secondary'
        ? 'var(--md-sys-color-secondary-container)'
        : variant === 'tertiary'
        ? 'var(--md-sys-color-tertiary-container)'
        : 'var(--md-sys-color-surface-container-high)';
    const iconColor = variant === 'primary'
        ? 'var(--md-sys-color-on-primary-container)'
        : variant === 'secondary'
        ? 'var(--md-sys-color-on-secondary-container)'
        : variant === 'tertiary'
        ? 'var(--md-sys-color-on-tertiary-container)'
        : 'var(--md-sys-color-on-surface-variant)';

    return (
        <Accordion
            expanded={expanded}
            onChange={() => onToggle()}
            disableGutters
            elevation={expanded ? 2 : 0}
            sx={{
                border: '1px solid',
                borderColor: expanded ? iconBg : 'var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-medium) !important',
                '&:before': { display: 'none' },
                transition: 'box-shadow 200ms ease, border-color 200ms ease',
            }}
        >
            <AccordionSummary
                expandIcon={
                    <Box
                        component="span"
                        className="material-symbols-outlined"
                        aria-hidden="true"
                        sx={{ fontSize: 24, color: 'var(--md-sys-color-on-surface-variant)' }}
                    >expand_more</Box>
                }
                id={`settings-group-btn-${id}`}
                aria-controls={`settings-group-panel-${id}`}
                sx={{
                    bgcolor: 'var(--md-sys-color-surface-container-high)',
                    px: 2,
                    py: 1,
                    minHeight: 72,
                    '&.Mui-expanded': {
                        minHeight: 72,
                        borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
                    },
                    '& .MuiAccordionSummary-content': {
                        my: 0,
                        gap: 2,
                        alignItems: 'center',
                    },
                }}
            >
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: iconBg,
                    color: iconColor,
                }}>
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 24 }}>{icon}</Box>
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.3, margin: 0 }}>{title}</Typography>
                    {subtitle && <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.4, margin: 0 }}>{subtitle}</Typography>}
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};

const Settings: React.FC<SettingsProps> = (props) => {
    const {
        settings, themeState, aiSettings, onSaveSettings, onSaveTheme, onSaveAiSettings,
        onExportData, onImportData, showToast, onCleanDemoData,
        onLogout,
        driveState, onConnectDrive, onSyncToDrive,
        onClose,
        dismissedSuggestions, onReactivateSuggestion,
    } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [storageInfo, setStorageInfo] = useState<{ used: string; total: string; percent: number } | null>(null);

    useEffect(() => {
        if (!navigator?.storage?.estimate) return;
        navigator.storage.estimate().then((estimate) => {
            const used = ((estimate.usage || 0) / 1024 / 1024).toFixed(1);
            const total = ((estimate.quota || 0) / 1024 / 1024).toFixed(1);
            const percent = Math.round(((estimate.usage || 0) / (estimate.quota || 1)) * 100);
            setStorageInfo({ used, total, percent });
        }).catch((error) => console.error('Storage estimation failed:', error));
    }, []);

    const settingsLogic = useSettingsLogic({
        settings,
        onSaveSettings,
        aiSettings,
        onSaveAiSettings,
        themeState,
        onSaveTheme,
        showToast,
        onCleanDemoData
    });

    const {
        localSettings,
        localAiSettings,
        handleChange,
        handleAiProfileChange,
        themePrompt,
        setThemePrompt,
        isGeneratingTheme,
        handleGenerateThemeFromPrompt,
        setIsResetModalOpen,
        handleBulkAssign,
        toggleAssociation,
        updateAssignmentHours,
        handleThemeChange,
    } = settingsLogic;

    const [expandedId, setExpandedId] = useState<string | null>(() => {
        try { return localStorage.getItem('settings_expanded_id') ?? 'interface_experience'; }
        catch { return 'interface_experience'; }
    });
    const handleGroupToggle = (id: string) => {
        const next = expandedId === id ? null : id;
        setExpandedId(next);
        try { localStorage.setItem('settings_expanded_id', next ?? ''); } catch { /* noop */ }
    };

    const [newSubjectName, setNewSubjectName] = useState('');

    // Formazione Classi Strutturata
    const [selLevel, setSelLevel] = useState(SCHOOL_LEVELS[2]); // Default Secondaria I Grado
    const [selSpec, setSelSpec] = useState('');
    const [selYears, setSelYears] = useState<string[]>(['1', '2', '3']);
    const [selSections, setSelSections] = useState<string[]>(['A', 'B']);

    const handleGenerateClasses = () => {
        const newClasses: string[] = [];
        selYears.forEach(y => {
            selSections.forEach(s => {
                const name = `${y}${s}${selSpec ? ' ' + selSpec : ''}`;
                if (!localSettings.classi.includes(name)) {
                    newClasses.push(name);
                }
            });
        });

        if (newClasses.length > 0) {
            handleChange('classi', [...localSettings.classi, ...newClasses]);
            showToast(`${newClasses.length} classi generate con successo!`, 'success');
        } else {
            showToast("Nessuna nuova classe da generare.", "info");
        }
    };

    const handleAddSubject = () => {
        if (!newSubjectName.trim()) return;
        if (localSettings.disciplines.includes(newSubjectName.trim())) {
            showToast("Materia già presente", "info");
            return;
        }
        handleChange('disciplines', [...localSettings.disciplines, newSubjectName.trim()]);
        setNewSubjectName('');
    };

    const handleForceRefresh = async () => {
        if (!confirm("Forzare l'aggiornamento del brand? L'app verrà ricaricata per pulire i vecchi file temporanei. I tuoi dati sono al sicuro.")) return;
        try {
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const reg of regs) await reg.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                for (const key of keys) await caches.delete(key);
            }
            window.location.reload();
        } catch { window.location.reload(); }
    };

    const handleExportTheme = () => {
        try {
            const themeData = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                themeState: themeState,
                description: `Tema "${themeState.customizationName}" esportato da DocenteDoc AI`
            };
            
            const dataStr = JSON.stringify(themeData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `tema-${themeState.customizationName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Tema esportato con successo!', 'success');
        } catch (error) {
            console.error('Errore durante l\'esportazione del tema:', error);
            showToast('Errore durante l\'esportazione del tema', 'error');
        }
    };

    const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const themeData = JSON.parse(content);
                
                if (!themeData.themeState) {
                    throw new Error('File non valido: manca themeState');
                }
                
                // Validate theme structure
                const requiredFields = ['mode', 'visualStyle', 'customizationName'];
                const missingFields = requiredFields.filter(field => !(field in themeData.themeState));
                
                if (missingFields.length > 0) {
                    throw new Error(`File non valido: mancano i campi ${missingFields.join(', ')}`);
                }
                
                // Apply the imported theme
                onSaveTheme(themeData.themeState);
                showToast(`Tema "${themeData.themeState.customizationName}" importato con successo!`, 'success');
                
            } catch (error) {
                console.error('Errore durante l\'importazione del tema:', error);
                showToast(`Errore durante l'importazione: ${error instanceof Error ? error.message : 'File non valido'}`, 'error');
            }
        };
        
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const currentAiProfile = localAiSettings.model === AI_PROFILES.esperto.model ? 'esperto' : 'rapido';

    const handleAddNextYear = () => {
        const nextYear = generateNextSchoolYear(localSettings.annoScolasticoCorrente);
        if (!localSettings.anniScolastici.includes(nextYear)) {
            handleChange('anniScolastici', [...localSettings.anniScolastici, nextYear]);
            handleChange('annoScolasticoCorrente', nextYear);
            showToast(`Anno ${nextYear} aggiunto e selezionato.`, 'success');
        } else {
            showToast(`Anno ${nextYear} già presente.`, 'info');
        }
    };

    // handleFileChange function definition moved inside the component
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImportData(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100dvh',
                overflow: 'hidden',
            }}
        >
            {/* Top app bar */}
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'var(--md-sys-color-outline-variant)',
                    gap: 1.5,
                }}
            >
                <IconButton
                    aria-label="Chiudi impostazioni"
                    onClick={onClose}
                ><Box component="span" className="material-symbols-outlined" aria-hidden="true">arrow_back</Box></IconButton>
                <SectionHeader
                    title="Impostazioni"
                    subtitle="Configura il tuo profilo, l'AI e le preferenze dell'app."
                    icon="settings" />
            </Paper>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >

                <SettingsGroup
                    id="interface_experience"
                    title="Interfaccia & Esperienza Visiva"
                    subtitle="Personalizza l'aspetto e il comportamento dell'app"
                    icon="palette"
                    variant="primary"
                    expanded={expandedId === 'interface_experience'}
                    onToggle={() => handleGroupToggle('interface_experience')}
                >
                    <Stack spacing={2}>
                        {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack direction="column" spacing={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>dashboard_customize</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Modalità Interfaccia</Typography>
                            </Stack>
                                                        <Tabs
                              value={themeState.uiMode || 'classic'}
                              onChange={(_, v: string) => ((id) => handleThemeChange({ uiMode: id as 'classic' | 'flow' }))(v)}
                              indicatorColor="primary"
                              textColor="primary"
                              aria-label="Modalità interfaccia"
                              sx={{
                                bgcolor: 'var(--md-sys-color-surface-container-low)',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                border: '1px solid var(--md-sys-color-outline-variant)',
                                minHeight: 'auto',
                                p: 0.5,
                              }}
                            >
                              {([
                                    { id: 'classic', label: 'Classica', icon: 'grid_view' },
                                    { id: 'flow', label: 'Dinamica (Flow)', icon: 'account_tree' }
                                ]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                                <Tab
                                  key={tab.id}
                                  value={tab.id}
                                  id={`tab-${tab.id}`}
                                  aria-controls={`panel-${tab.id}`}
                                  data-testid={`tab-${tab.id}`}
                                  label={(
                                    <Badge badgeContent={tab.badge} color="error">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                        {tab.label}
                                      </Box>
                                    </Badge>
                                  )}
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
                            <Typography variant="body2" sx={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>
                                {themeState.uiMode === 'flow'
                                    ? 'Modalità Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.'
                                    : 'Modalità Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                            </Typography>
                        </Stack>
                        </Box>

                        {/* SEZIONE 2: ECOISTEMA VISIVO */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>auto_awesome</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Ecosistema Visivo</Typography>
                            </Stack>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 2 }}>
                                {[
                                    { id: 'aura', label: 'Aura', icon: 'blur_on', desc: 'Glassmorphism' },
                                    { id: 'expressive', label: 'Google', icon: 'android', desc: 'Expressive' },
                                    { id: 'cupertino', label: 'Cupertino', icon: 'phone_iphone', desc: 'Apple Style' },
                                    { id: 'windows', label: 'Windows', icon: 'desktop_windows', desc: 'Fluent Design' },
                                    { id: 'flat', label: 'Flat', icon: 'layers', desc: 'Material 3' },
                                    { id: 'minimal', label: 'Minimal', icon: 'check_box_outline_blank', desc: 'Essenziale' }
                                ].map(vstyle => {
                                    const isSelected = themeState.visualStyle === vstyle.id;
                                    return (
                                        <Paper
                                            key={vstyle.id}
                                            component="button"
                                            elevation={isSelected ? 2 : 1}
                                            onClick={() => handleThemeChange({ visualStyle: vstyle.id as AppThemeState['visualStyle'] })}
                                            aria-pressed={isSelected}
                                            aria-label={`Stile visivo: ${vstyle.label}`}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 'var(--md-sys-spacing-2)',
                                                padding: 'var(--md-sys-spacing-4)',
                                                border: isSelected
                                                    ? 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)'
                                                    : 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                backgroundColor: isSelected
                                                    ? 'var(--md-sys-color-primary-container)'
                                                    : 'var(--md-sys-color-surface-container-high)',
                                                cursor: 'pointer',
                                                transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                                                textAlign: 'center',
                                                width: 'var(--md-sys-percent-100)',
                                            }}
                                        >
                                            <Box
                                                component="span"
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                                sx={{
                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                    color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                                }}
                                            >{vstyle.icon}</Box>
                                            <Typography variant="caption" sx={{ color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)', margin: 0 }}>{vstyle.label}</Typography>
                                            <Typography variant="caption" sx={{ color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{vstyle.desc}</Typography>
                                        </Paper>
                                    );
                                })}
                            </Box>
                        </Stack>
                        </Box>

                        {/* SEZIONE 3: TEMA E COLORI */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>palette</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Tema & Colori</Typography>
                            </Stack>

                            <Box sx={{ mb: 2 }}>
                                                                <Tabs
                                  value={themeState.mode}
                                  onChange={(_, v: string) => ((id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode }))(v)}
                                  indicatorColor="primary"
                                  textColor="primary"
                                  aria-label="Tema colore"
                                  sx={{
                                    bgcolor: 'var(--md-sys-color-surface-container-low)',
                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    minHeight: 'auto',
                                    p: 0.5,
                                  }}
                                >
                                  {([{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                                    <Tab
                                      key={tab.id}
                                      value={tab.id}
                                      id={`tab-${tab.id}`}
                                      aria-controls={`panel-${tab.id}`}
                                      data-testid={`tab-${tab.id}`}
                                      label={(
                                        <Badge badgeContent={tab.badge} color="error">
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                            {tab.label}
                                          </Box>
                                        </Badge>
                                      )}
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
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2, mb: 2 }}>
                                {THEME_CUSTOMIZATIONS.map(theme => (
                                    <ThemeBubble
                                        key={theme.name}
                                        name={theme.name}
                                        colors={{
                                            primary: theme.colors.primary ?? 'var(--md-sys-color-primary)',
                                            secondary: theme.colors.secondary ?? 'var(--md-sys-color-secondary)',
                                            tertiary: theme.colors.tertiary ?? 'var(--md-sys-color-tertiary)'
                                        }}
                                        isSelected={themeState.customizationName === theme.name}
                                        onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })} />
                                ))}
                            </Box>

                            <Box sx={{ borderTop: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)', pt: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>magic_button</Box>
                                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Generatore AI</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="flex-end">
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            label="Descrivi il tuo stile"
                                            value={themePrompt}
                                            onChange={e => setThemePrompt(e.target.value)}
                                            placeholder="Es. 'Colori tramonto'..."
                                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">palette</Box></InputAdornment> } }} />
                                    </Box>
                                    <IconButton
                                        onClick={handleGenerateThemeFromPrompt}
                                        disabled={isGeneratingTheme || !themePrompt.trim()}
                                        aria-label="Genera tema AI"
                                        sx={{ bgcolor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', borderRadius: 2, '&:hover': { bgcolor: 'color-mix(in srgb, var(--md-sys-color-primary) 85%, black)' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
                                    >
                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true">{isGeneratingTheme ? 'sync' : 'auto_awesome'}</Box>
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Stack>
                        </Box>

                        {/* SEZIONE 4: PARAMETRI AVANZATI */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>tune</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Parametri Strutturali</Typography>
                            </Stack>
                            <Stack spacing={2}>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography id="label-glass-blur" variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Intensità Blur Vetro</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-semibold)' }}>{themeState.glassBlur || 30}px</Typography>
                                    </Stack>
                                    <Slider id="range-glass-blur" aria-labelledby="label-glass-blur" min={0} max={100} step={5} value={themeState.glassBlur || 30} onChange={(_e, v) => handleThemeChange({ glassBlur: v as number })} sx={{ width: '100%' }} />
                                </Stack>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography id="label-font-scale" variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Scala Font</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-semibold)' }}>{themeState.fontScale || 1}x</Typography>
                                    </Stack>
                                    <Slider id="range-font-scale" aria-labelledby="label-font-scale" min={0.8} max={1.4} step={0.1} value={themeState.fontScale || 1} onChange={(_e, v) => handleThemeChange({ fontScale: v as number })} sx={{ width: '100%' }} />
                                </Stack>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography id="label-contrast-level" variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Livello Contrasto</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-semibold)' }}>{themeState.contrastLevel || 0}</Typography>
                                    </Stack>
                                    <Slider id="range-contrast-level" aria-labelledby="label-contrast-level" min={-50} max={50} step={5} value={themeState.contrastLevel || 0} onChange={(_e, v) => handleThemeChange({ contrastLevel: v as number })} sx={{ width: '100%' }} />
                                </Stack>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Arrotondamento Bordi</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-semibold)' }}>x{themeState.radiusMultiplier || 1}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {[0.5, 1, 1.5, 2].map(m => (
                                            <Button
                                                key={m}
                                                variant={themeState.radiusMultiplier === m ? 'contained' : 'outlined'}
                                                size="small"
                                                onClick={() => handleThemeChange({ radiusMultiplier: m })}
                                            >
                                                {m === 1 ? 'Standard' : `${m}x`}
                                            </Button>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* SEZIONE 6: EXPORT/IMPORT TEMA */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>import_export</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Backup Tema</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 2 }}>Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button onClick={handleExportTheme} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">download</Box>}>ESPORTA TEMA</Button>
                                <Box sx={{ position: 'relative' }}>
                                    <input type="file" accept=".json" onChange={handleImportTheme} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }} id="theme-import" />
                                    <label htmlFor="theme-import" style={{ cursor: 'pointer' }}>
                                        <Button variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">upload</Box>} component="span">IMPORTA TEMA</Button>
                                    </label>
                                </Box>
                            </Stack>
                        </Box>

                        {/* SEZIONE 5: MANUTENZIONE BRAND */}
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>refresh</Box>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Manutenzione Brand</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</Typography>
                            <Button onClick={handleForceRefresh} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">cached</Box>}>AGGIORNA BRAND E CACHE</Button>
                        </Stack>
                        </Box>


                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="profile"
                    title="Profilo & Identità"
                    subtitle="Dati docente e istituto"
                    icon="badge"
                    variant="surface"
                    expanded={expandedId === 'profile'}
                    onToggle={() => handleGroupToggle('profile')}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </Box>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField label="Nome Istituto" value={localSettings.nomeIstituto} onChange={e => handleChange('nomeIstituto', e.target.value)} />
                            <TextField label="Città" value={localSettings.cittaIstituto} onChange={e => handleChange('cittaIstituto', e.target.value)} />
                        </Box>
                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="ai_didattica"
                    title="AI & Didattica"
                    subtitle="Cervello AI e cattedra"
                    icon="psychology"
                    variant="secondary"
                    expanded={expandedId === 'ai_didattica'}
                    onToggle={() => handleGroupToggle('ai_didattica')}
                >
                    <Stack spacing={2}>
                    {/* SEZIONE 1: MODELLO AI */}
                    <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>smart_toy</Box>
                            <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Modello Intelligenza</Typography>
                        </Stack>

                                                <Tabs
                          value={currentAiProfile}
                          onChange={(_, v: string) => ((id) => handleAiProfileChange(id as keyof typeof AI_PROFILES))(v)}
                          indicatorColor="primary"
                          textColor="primary"
                          aria-label="Profilo AI"
                          sx={{
                            bgcolor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                            minHeight: 'auto',
                            p: 0.5,
                          }}
                        >
                          {((Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ id: key, label: AI_PROFILES[key].label, icon: AI_PROFILES[key].icon }))).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                            <Tab
                              key={tab.id}
                              value={tab.id}
                              id={`tab-${tab.id}`}
                              aria-controls={`panel-${tab.id}`}
                              data-testid={`tab-${tab.id}`}
                              label={(
                                <Badge badgeContent={tab.badge} color="error">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                    {tab.label}
                                  </Box>
                                </Badge>
                              )}
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

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--md-sys-spacing-3)',
                            p: 'var(--md-sys-spacing-6)',
                            bgcolor: currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary-container)'
                                : 'var(--md-sys-color-primary-container)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            border: `var(--md-sys-border-width-thin) solid ${currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary)'
                                : 'var(--md-sys-color-primary)'}`
                        }}>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
                                fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: currentAiProfile === 'esperto'
                                    ? 'var(--md-sys-color-on-secondary-container)'
                                    : 'var(--md-sys-color-on-primary-container)',
                                marginTop: 'var(--md-sys-spacing-4)'
                            }}>info</Box>
                            <Typography
                                variant="body2"
                                sx={{ color: currentAiProfile === 'esperto'
                                        ? 'var(--md-sys-color-on-secondary-container)'
                                        : 'var(--md-sys-color-on-primary-container)',
                                    margin: 0 }}
                            >
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>calendar_month</Box>
                                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Anno Scolastico</Typography>
                                </Stack>
                                <Button onClick={handleAddNextYear} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">add_circle</Box>}>
                                    Aggiungi
                                </Button>
                            </Stack>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Anno Corrente</InputLabel>
                                    <Select
                                        label="Anno Corrente"
                                        value={localSettings.annoScolasticoCorrente}
                                        onChange={e => handleChange('annoScolasticoCorrente', e.target.value as string)}
                                    >
                                        {localSettings.anniScolastici.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Box>
                                    <ChipInputList
                                        label="Storico Anni"
                                        items={localSettings.anniScolastici}
                                        onAdd={(item: string) => handleChange('anniScolastici', [...localSettings.anniScolastici, item])}
                                        onRemove={(idx: number) => handleChange('anniScolastici', localSettings.anniScolastici.filter((_, i: number) => i !== idx))}
                                        placeholder="Es: 2025/2026"
                                        icon="history" />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-secondary)' }}>school</Box>
                                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Gestione Cattedra</Typography>
                                </Stack>
                                <Button
                                    onClick={() => {
                                        if (confirm("Sei sicuro di voler svuotare tutta la cattedra?")) {
                                            handleChange('teachingAssignments', []);
                                        }
                                    } }
                                    variant="outlined"
                                >
                                    Svuota Tutto
                                </Button>
                            </Stack>

                            {/* FORMAZIONE CLASSI STRUTTURATA (NORMATIVA ITALIANA) */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>account_tree</Box>
                                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}>Formazione Classi Strutturata</Typography>
                                </Stack>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Ordinamento Scolastico</InputLabel>
                                        <Select
                                            label="Ordinamento Scolastico"
                                            value={selLevel}
                                            onChange={e => setSelLevel(e.target.value as string)}
                                        >
                                            {SCHOOL_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Indirizzo / Specializzazione"
                                        value={selSpec}
                                        onChange={e => setSelSpec(e.target.value)}
                                        placeholder="Es: Scientifico, CAT, Musicale..." />
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Livelli / Anni</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {['1', '2', '3', '4', '5'].map(y => (
                                                <Button
                                                    key={y}
                                                    variant={selYears.includes(y) ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                                    sx={{ minWidth: 44 }}
                                                >
                                                    {y}° Anno
                                                </Button>
                                            ))}
                                        </Box>
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Sezioni</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                                <Button
                                                    key={s}
                                                    variant={selSections.includes(s) ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelSections(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                                    sx={{ minWidth: 44 }}
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Stack>
                                </Box>

                                <Button onClick={handleGenerateClasses} variant="contained" disabled={selYears.length === 0 || selSections.length === 0} startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">auto_awesome</Box>}>
                                    Genera Combinazioni Classi
                                </Button>
                            </Box>

                            {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                                <Stack direction="row" spacing={2} alignItems="flex-end">
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            label="Materia Singola"
                                            placeholder="Es: Italiano"
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddSubject()}
                                        />
                                    </Box>
                                    <Button onClick={handleAddSubject} variant="contained" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">add</Box>}>
                                        Aggiungi
                                    </Button>
                                </Stack>
                            </Box>

                            {/* MATRICE INTERATTIVA */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)', overflowX: 'auto' }}>
                                <TableContainer component={Box}>
                                <Table sx={{width: '100%'}}>
                                    <TableHead>
                                        <TableRow sx={{backgroundColor: 'var(--md-sys-color-surface-container-high)'}}>
                                            <TableCell component="th" scope="col" sx={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                textAlign: 'left',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                                color: 'var(--md-sys-color-on-surface)',
                                                borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>Materia / Classe</TableCell>
                                            {localSettings.classi.map(cls => (
                                                <TableCell component="th" scope="col" key={cls} sx={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                    textAlign: 'center',
                                                    fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                                    color: 'var(--md-sys-color-on-surface)',
                                                    borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                    borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                    position: 'relative'}}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                                        <span>{cls}</span>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            aria-label={`Rimuovi classe ${cls}`}
                                                            sx={{ color: 'var(--md-sys-color-error)', p: 'var(--md-sys-spacing-1)' }}
                                                        >
                                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>close</Box>
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {localSettings.disciplines.map(subj => (
                                            <TableRow key={subj} sx={{borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                <TableCell sx={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                                    borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--md-sys-spacing-4)' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', flex: 1 }}>
                                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'var(--md-sys-typescale-weight-medium)', color: 'var(--md-sys-color-on-surface)' }}>{subj}</Typography>
                                                            <Button
                                                                onClick={() => handleBulkAssign(localSettings.classi, [subj])}
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                Associa a tutte
                                                            </Button>
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                            aria-label={`Rimuovi materia ${subj}`}
                                                            sx={{ color: 'var(--md-sys-color-error)', p: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-small)' }}
                                                        >
                                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
                                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'
                                                            }}>delete</Box>
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <TableCell key={`${subj}-${cls}`} sx={{padding: 'var(--md-sys-spacing-4)',
                                                            textAlign: 'center',
                                                            borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                            cursor: 'pointer'}}>
                                                            <Box
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    p: 'var(--md-sys-spacing-3)',
                                                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                    bgcolor: assignment ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                                                                    border: `var(--md-sys-border-width-thin) solid ${assignment ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                                    transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                                                    minHeight: 'var(--md-sys-spacing-4)',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{color: 'var(--md-sys-color-primary)',
                                                                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                            marginRight: 'var(--md-sys-spacing-4)'}}>check_circle</Box>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }} onClick={e => e.stopPropagation()}>
                                                                            <input
                                                                                type="number"
                                                                                value={assignment.hoursPerWeek}
                                                                                onChange={e => updateAssignmentHours(assignment.id ?? `${assignment.classId}-${subj}`, parseInt(e.target.value) || 1)}
                                                                                style={{width: '44px',
                                                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
                                                                                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                                                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                                    backgroundColor: 'var(--md-sys-color-surface)',
                                                                                    color: 'var(--md-sys-color-on-surface)',
                                                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                                    textAlign: 'center'}} />
                                                                            <Box component="span" sx={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                                color: 'var(--md-sys-color-on-surface-variant)'}}>h</Box>
                                                                        </Box>
                                                                    </>
                                                                ) : (
                                                                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{color: 'var(--md-sys-color-outline-variant)',
                                                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>add</Box>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    );
                                                })}                                            </TableRow>
                                        ))}
                                        {localSettings.disciplines.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={localSettings.classi.length + 1} sx={{padding: 'var(--md-sys-spacing-4)',
                                                    textAlign: 'center',
                                                    color: 'var(--md-sys-color-on-surface-variant)',
                                                    fontStyle: 'italic'}}>
                                                    Aggiungi una materia per iniziare la configurazione...
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </Box>

                            <InfoCard
                                title="Come funziona"
                                description="Questa matrice è il tuo centro di controllo. Clicca su una cella per associare una materia a una classe. Modifica il numero per impostare le ore settimanali."
                                icon="info"
                                variant="contained" />
                        </Box>
                    </Stack>
                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="ai_suggestions"
                    title="Suggerimenti AI"
                    subtitle="Gestisci suggerimenti ignorati"
                    icon="lightbulb"
                    variant="tertiary"
                    expanded={expandedId === 'ai_suggestions'}
                    onToggle={() => handleGroupToggle('ai_suggestions')}
                >
                    <Stack spacing={2}>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Qui puoi vedere i suggerimenti AI che hai ignorato e riattivarli se desideri.
                        </Typography>
                        {dismissedSuggestions.size === 0 ? (
                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic', textAlign: 'center', p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                                Nessun suggerimento ignorato.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {Array.from(dismissedSuggestions).map((id) => (
                                    <Box key={id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>
                                                Suggerimento {id}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                Ignorato in precedenza
                                            </Typography>
                                        </Stack>
                                        <Button onClick={() => onReactivateSuggestion(id)} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">refresh</Box>}>
                                            Riattiva
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, borderTop: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Button
                                onClick={() => {
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                }}
                                disabled={dismissedSuggestions.size === 0}
                                variant="text"
                                fullWidth
                            >
                                Riattiva Tutti i Suggerimenti
                            </Button>
                        </Box>
                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="cloud"
                    title="Dati & Cloud"
                    subtitle="Backup e Storage"
                    icon="cloud_sync"
                    variant="primary"
                    expanded={expandedId === 'cloud'}
                    onToggle={() => handleGroupToggle('cloud')}
                >
                    <Stack spacing={2}>
                    {/* Always render all children, do not hide section if storageInfo is missing */}
                    {storageInfo && (
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>Storage Dispositivo</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>{storageInfo.used}MB / {storageInfo.total}MB</Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={storageInfo.percent}
                                color={storageInfo.percent > 80 ? 'error' : 'primary'}
                                sx={{ borderRadius: 1, height: 6, bgcolor: 'action.hover' }}
                            />
                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                Dati salvati in IndexedDB (senza limiti LocalStorage).
                            </Typography>
                        </Box>
                    )}

                    {/* Reminder banner se backup cloud troppo vecchio */}
                    {(() => {
                        const DAYS_LIMIT = 30;
                        let showReminder = false;
                        let lastSyncDate: Date | null = null;
                        if (driveState.lastSyncTime) {
                            lastSyncDate = new Date(driveState.lastSyncTime);
                            const now = new Date();
                            const diffDays = Math.floor((now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60 * 24));
                            showReminder = diffDays >= DAYS_LIMIT;
                        } else {
                            showReminder = true;
                        }
                        if (showReminder) {
                            return (
                                <InfoCard
                                    title="Backup cloud non aggiornato!"
                                    description="Esegui un backup cloud e verifica il ripristino periodicamente per la sicurezza dei tuoi dati."
                                    icon="warning"
                                    variant="outlined" />
                            );
                        }
                        return null;
                    })()}

                    <Box sx={{ p: 2, bgcolor: driveState.isAuthenticated ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: driveState.isAuthenticated ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 36, height: 36, borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: driveState.isAuthenticated ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)', color: driveState.isAuthenticated ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)' }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</Box>
                            </Box>
                            <Stack spacing={0.25}>
                                <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                                    {driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {driveState.lastSyncTime ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}` : 'Nessun backup cloud'}
                                </Typography>
                            </Stack>
                        </Stack>
                        {driveState.isAuthenticated ? (
                            <Button onClick={() => onSyncToDrive()} disabled={driveState.isSyncing} variant="contained" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">{driveState.isSyncing ? 'sync' : 'cloud_upload'}</Box>}>
                                {driveState.isSyncing ? '...' : 'Salva'}
                            </Button>
                        ) : (
                            settings.googleClientId && (
                                <Button
                                    onClick={onConnectDrive}
                                    variant="contained"
                                >
                                    Connetti
                                </Button>
                            )
                        )}
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                        <Button onClick={onExportData} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">download</Box>}>
                            Backup Locale
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} variant="outlined" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">upload</Box>}>
                            Ripristina File
                        </Button>
                        <input type="file" ref={fileInputRef} style={{
                            position: 'absolute',
                            opacity: 0,
                            pointerEvents: 'none'
                        }} accept=".json,.csv,.xlsx,.xls" onChange={handleFileChange} />
                    </Box>
                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="debug_logging"
                    title="Debug & Logging"
                    subtitle="Visualizza e gestisci i log degli errori"
                    icon="bug_report"
                    variant="surface"
                    expanded={expandedId === 'debug_logging'}
                    onToggle={() => handleGroupToggle('debug_logging')}
                >
                    <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="overline"
                                        sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: 1.5 }}
                                    >
                                        Log degli Errori
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        Visualizza tutti gli errori registrati durante l'utilizzo dell'app
                                    </Typography>
                                </Stack>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: errorLogger.getErrorStats().total > 0 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)' }}>{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1.5, bgcolor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-medium)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)', mb: 2 }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)' }}>info</Box>
                                <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{errorLogger.getErrorStats().total} log registrati</Typography>
                            </Stack>
                            <Stack spacing={1}>
                                <Button onClick={() => { showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info'); }} variant="outlined" fullWidth startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">terminal</Box>}>
                                    Console Browser (F12)
                                </Button>
                                <Button
                                    onClick={() => {
                                        const json = errorLogger.exportLogsAsJson();
                                        const blob = new Blob([json], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `error-logs-${new Date().toISOString().slice(0, 10)}.json`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                        showToast('Log esportati in JSON', 'success');
                                    } }
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">download</Box>}
                                >
                                    Esporta JSON
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (confirm('Sei sicuro di voler eliminare tutti i log?')) {
                                            errorLogger.clearAllLogs();
                                            showToast('Tutti i log sono stati eliminati', 'success');
                                        }
                                    } }
                                    variant="text"
                                fullWidth
                                    startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">delete</Box>}
                                >
                                    Elimina Log
                                </Button>
                            </Stack>
                        </Box>

                        <InfoCard
                            title="Come usare"
                            description="Premi F12 per aprire la console, digita window.__errorLogger.getRecentErrors(10) per visualizzare gli ultimi 10 errori."
                            icon="info"
                            variant="outlined" />
                    </Stack>
                </SettingsGroup>

                <SettingsGroup
                    id="advanced"
                    title="Avanzate"
                    subtitle="Configurazione tecnica"
                    icon="build"
                    variant="surface"
                    expanded={expandedId === 'advanced'}
                    onToggle={() => handleGroupToggle('advanced')}
                >
                    <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>key</Box>
                            <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>Google Cloud API</Typography>
                        </Stack>
                        <Stack spacing={2}>
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">badge</Box></InputAdornment> } }} />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">lock</Box></InputAdornment> } }} />
                        </Stack>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--md-sys-color-error-container) 10%, transparent)', borderRadius: 'var(--md-sys-shape-corner-extra-large)', border: '1px solid', borderColor: 'error.light' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-error)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>warning</Box>
                            <Typography variant="overline" sx={{ color: 'error.main', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>Zona Pericolo</Typography>
                        </Stack>
                        <Button onClick={() => setIsResetModalOpen(true)} variant="contained" color="error" fullWidth startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">delete_forever</Box>}>
                            Reset Totale Dati
                        </Button>
                    </Box>
                    </Stack>
                </SettingsGroup>

                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="caption" component="div" sx={{ color: 'text.disabled' }}>
                        DocenteDoc AI v4.0.8 • Stable
                        <Box sx={{ pt: 1 }}>
                            <Typography component="span" variant="caption" sx={{ fontWeight: 'var(--md-sys-typescale-weight-black)', color: 'text.disabled' }}>Owner:</Typography> Antonio Corsano
                            <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.disabled' }}>antonio.corsano@gmail.com</Typography>
                        </Box>
                    </Typography>
                    <Button
                        onClick={onLogout}
                        variant="text"
                        color="error"
                        startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">logout</Box>}
                        sx={{ mt: 1, mx: 'auto', display: 'flex' }}
                    >
                        Esci dall'account
                    </Button>
                </Box>
            </Box>

        </Paper>
    );
};

export default Settings;

