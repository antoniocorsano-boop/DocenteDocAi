// MD3 Compliant - Migration completed with functional exceptions

// MD3 Pure: Complete migration to inline styles using MD3 tokens for all settings interface and interactions
// All legacy CSS classes removed in favor of token-based styling - MD3 compliant
// Migration completed: interface_experience, profile, ai_didattica, ai_suggestions, cloud, debug_logging, advanced sections
// Settings.tsx: Migrated with functional exceptions for layout percentages and specific dimensions
// All styles now use MD3 design tokens and semantic color/spacing/elevation system where exact matches exist
// Functional exceptions: width/height percentages (100%, 50%, 20%, 10%), grid minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)) for responsive layout
import React, { useRef, useState, useEffect } from 'react';
import { SettingsProps, AppThemeState } from '../types';
import { THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS } from '../constants';
import { generateNextSchoolYear } from '../utils/schoolUtils';
import {
    TextField,
    SectionHeader,
    TabGroup,
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
import '../design-system/md3-utilities.css';
import ThemeBubble from './ThemeBubble';
import { ThemeSettingsPanel } from './settings/ThemeSettingsPanel';
import ChipInputList from './ChipInputList';
import ResetConfirmModal from './ResetConfirmModal';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { errorLogger } from '../services/errorLogger';

const SettingsGroup: React.FC<{
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'contained' | 'tonal' | 'elevated' | 'outlined';
    defaultOpen: boolean;
    children: React.ReactNode;
}> = ({ id, title, subtitle, icon, variant, defaultOpen, children }) => {
    const [isOpen, setIsOpen] = useState(() => {
        try {
            const savedState = localStorage.getItem(`settings_group_${id}`);
            return savedState !== null ? savedState === 'true' : defaultOpen;
        } catch {
            return defaultOpen;
        }
    });

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        const newState = !isOpen;
        setIsOpen(newState);
        try {
            localStorage.setItem(`settings_group_${id}`, String(newState));
        } catch (e) { console.error(e); }
    };

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
        <Paper
            elevation={isOpen ? 2 : 1}
            style={{
                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                overflow: 'hidden',
                transition: `box-shadow var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
            }}
            role="region"
            aria-label={subtitle ? `${title}: ${subtitle}` : title}
        >
            {/* Accordion header — MD3 list-item pattern */}
            <button
                id={`settings-group-btn-${id}`}
                aria-expanded={isOpen}
                aria-controls={`settings-group-panel-${id}`}
                onClick={handleToggle}
                style={{
                    width: 'var(--md-sys-percent-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--md-sys-spacing-5)',
                    cursor: 'pointer',
                    background: 'var(--md-sys-color-surface-container-high)',
                    border: 'none',
                    borderBottom: isOpen ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' : 'none',
                    textAlign: 'left',
                    transition: `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', minWidth: 0, flex: 1 }}>
                    <div style={{
                        width: 'var(--md-sys-spacing-8)',
                        height: 'var(--md-sys-spacing-8)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: iconBg,
                        color: iconColor,
                    }}>
                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>{icon}</span>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'var(--md-sys-color-on-surface)', margin: 0 }}>{title}</Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{subtitle}</Typography>
                        )}
                    </div>
                </div>
                <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={{
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        transition: `transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                    }}
                >expand_more</span>
            </button>

            {/* Accordion panel */}
            <div
                id={`settings-group-panel-${id}`}
                role="region"
                aria-labelledby={`settings-group-btn-${id}`}
                style={{
                    padding: isOpen ? `var(--md-sys-spacing-2) var(--md-sys-spacing-6) var(--md-sys-spacing-6)` : '0 var(--md-sys-spacing-6)',
                    maxHeight: isOpen ? '9999px' : '0',
                    overflow: 'hidden',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: `max-height var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard), opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), padding var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                }}
                aria-hidden={!isOpen}
            >
                {children}
            </div>
        </Paper>
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
        isResetModalOpen,
        setIsResetModalOpen,
        performReset,
        handleBulkAssign,
        toggleAssociation,
        updateAssignmentHours,
        handleThemeChange,
    } = settingsLogic;

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
            showToast(`Anno ${nextYear} gi� presente.`, 'info');
        }
    };

    // handleFileChange function definition moved inside the component
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onImportData(content);
            };
            reader.readAsText(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Paper
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'var(--md-sys-viewport-height-dvh)',
                overflow: 'hidden',
            }}
        >
            {/* Top app bar */}
            <Paper
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    padding: `var(--md-sys-spacing-4) var(--md-sys-spacing-6)`,
                    borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                    gap: 'var(--md-sys-spacing-3)',
                }}
            >
                <IconButton
                    aria-label="Chiudi impostazioni"
                    onClick={onClose}
                ><span className="material-symbols-outlined" aria-hidden="true">arrow_back</span></IconButton>
                <SectionHeader
                    title="Impostazioni"
                    subtitle="Configura il tuo profilo, l'AI e le preferenze dell'app."
                    icon="settings" />
            </Paper>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--md-sys-spacing-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-4)'
            }}>

                <SettingsGroup
                    id="interface_experience"
                    title="Interfaccia & Esperienza Visiva"
                    subtitle="Personalizza l'aspetto e il comportamento dell'app"
                    icon="palette"
                    variant="contained"
                    defaultOpen={true}
                >
                    <div
                        role="region"
                        aria-label="Interfaccia & Esperienza Visiva"
                        tabIndex={0}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)',
                            padding: 'var(--md-sys-spacing-4)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            background: 'var(--md-sys-color-surface-container-low)',
                            boxShadow: 'var(--md-sys-elevation-level1)'
                        }}
                    >
                        <Typography variant="overline" sx={{
                            color: 'var(--md-sys-color-on-surface)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            marginBottom: 'var(--md-sys-spacing-3)'
                        }}>
                            Interfaccia & Esperienza Visiva
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: 'var(--md-sys-color-on-surface-variant)',
                            marginBottom: 'var(--md-sys-spacing-4)',
                            opacity: 'var(--md-sys-state-opacity-caption)'
                        }}>
                            Personalizza l'aspetto e il comportamento dell'app
                        </Typography>
                        {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-3)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-3)'
                            }}>
                                <span style={{
                                    fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'
                                }}>dashboard_customize</span>
                                <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}>Modalità Interfaccia</Typography>
                            </div>
                            <TabGroup
                                tabs={[
                                    { id: 'classic', label: 'Classica', icon: 'grid_view' },
                                    { id: 'flow', label: 'Dinamica (Flow)', icon: 'account_tree' }
                                ]}
                                activeTab={localSettings.uiMode || 'classic'}
                                onTabChange={(id) => handleChange('uiMode', id)}
                                variant="contained" />
                            <Typography variant="body2" sx={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>
                                {localSettings.uiMode === 'flow'
                                    ? 'Modalità Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.'
                                    : 'Modalità Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                            </Typography>
                        </div>

                        {/* SEZIONE 2: ECOISTEMA VISIVO */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>auto_awesome</span>
                                <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}>Ecosistema Visivo</Typography>
                            </div>
                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-large), var(--md-sys-grid-fr-1)))',
                                gap: 'var(--md-sys-spacing-4)'}}>
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
                                            style={{
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
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                                style={{
                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                    color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                                }}
                                            >{vstyle.icon}</span>
                                            <Typography variant="caption" sx={{ color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)', margin: 0 }}>{vstyle.label}</Typography>
                                            <Typography variant="caption" sx={{ color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{vstyle.desc}</Typography>
                                        </Paper>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SEZIONE 3: TEMA E COLORI */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>palette</span>
                                <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}>Tema & Colori</Typography>
                            </div>

                            <div style={{marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <TabGroup
                                    tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                                    activeTab={themeState.mode}
                                    onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                                    variant="contained" />
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-medium), var(--md-sys-grid-fr-1)))',
                                gap: 'var(--md-sys-spacing-4)',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
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
                            </div>

                            <div style={{borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                paddingTop: 'var(--md-sys-spacing-4)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)',
                                    marginBottom: 'var(--md-sys-spacing-4)'}}>
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        color: 'var(--md-sys-color-primary)'}}>magic_button</span>
                                    <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                        fontWeight: 'var(--md-sys-typescale-weight-black)'}}>Generatore AI</Typography>
                                </div>
                                <div style={{display: 'flex',
                                    gap: 'var(--md-sys-spacing-4)',
                                    alignItems: 'flex-end'}}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Descrivi il tuo stile"
                                            value={themePrompt}
                                            onChange={e => setThemePrompt(e.target.value)}
                                            placeholder="Es. 'Colori tramonto'..."
                                            leadingIcon="palette" />
                                    </div>
                                    <Button
                                        onClick={handleGenerateThemeFromPrompt}
                                        disabled={isGeneratingTheme || !themePrompt.trim()}
                                        variant="contained"
                                        style={{minWidth: '0',
                                            width: 'var(--md-sys-spacing-4)',
                                            height: 'var(--md-sys-spacing-4)',
                                            padding: '0',
                                            boxShadow: 'var(--md-sys-elevation-level2)',
                                            borderRadius: 'var(--md-sys-shape-corner-large)'}}
                                    >
                                        <span style={{
}}>{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 4: PARAMETRI AVANZATI */}
                        <div style={{marginTop: 'var(--md-sys-spacing-4)',
                            padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)',
                                marginBottom: 'var(--md-sys-spacing-4)',
                                paddingBottom: 'var(--md-sys-spacing-4)',
                                borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>tune</span>
                                <Typography
                                    variant="caption"
                                    style={{color: 'var(--md-sys-color-primary)',
                                        fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                                >
                                    Parametri Strutturali
                                </Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Intensità Blur Vetro
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                        >
                                            {themeState.glassBlur || 30}px
                                        </Typography>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        value={themeState.glassBlur || 30}
                                        onChange={e => handleThemeChange({ glassBlur: parseInt(e.target.value) })}
                                        style={{width: 'var(--md-sys-percent-100)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Scala Font
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                        >
                                            {themeState.fontScale || 1}x
                                        </Typography>
                                    </div>
                                    <input
                                        type="range" min="0.8" max="1.4" step="0.1"
                                        value={themeState.fontScale || 1}
                                        onChange={e => handleThemeChange({ fontScale: parseFloat(e.target.value) })}
                                        style={{width: 'var(--md-sys-percent-100)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Livello Contrasto
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                        >
                                            {themeState.contrastLevel || 0}
                                        </Typography>
                                    </div>
                                    <input
                                        type="range" min="-50" max="50" step="5"
                                        value={themeState.contrastLevel || 0}
                                        onChange={e => handleThemeChange({ contrastLevel: parseInt(e.target.value) })}
                                         style={{width: 'var(--md-sys-percent-100)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Arrotondamento Bordi
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                        >
                                            x{themeState.radiusMultiplier || 1}
                                        </Typography>
                                    </div>
                                    <div style={{display: 'flex',
                                        gap: 'var(--md-sys-spacing-4)',
                                        flexWrap: 'wrap'}}>
                                        {[0.5, 1, 1.5, 2].map(m => (
                                            <Button
                                                key={m}
                                                variant={themeState.radiusMultiplier === m ? 'contained' : 'outlined'}
                                                size="small"
                                                onClick={() => handleThemeChange({ radiusMultiplier: m })}
                                                style={{
                                                    minWidth: 'var(--md-sys-spacing-4)'
                                                }}
                                            >
                                                {m === 1 ? 'Standard' : `${m}x`}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 6: EXPORT/IMPORT TEMA */}
                        <div style={{marginTop: 'var(--md-sys-spacing-4)',
                            padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>import_export</span>
                                <Typography
                                    variant="caption"
                                    style={{color: 'var(--md-sys-color-primary)',
                                        fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                                >
                                    Backup Tema
                                </Typography>
                            </div>
                            <Typography
                                variant="body2"
                                style={{color: 'var(--md-sys-color-on-surface-variant)',
                                    marginBottom: 'var(--md-sys-spacing-4)'}}
                            >
                                Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.
                            </Typography>
                            <div style={{display: 'flex',
                                gap: 'var(--md-sys-spacing-4)',
                                alignItems: 'center'}}>
                                <Button
                                    onClick={handleExportTheme}
                                    variant="outlined"
                                >
                                    <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>download</span>
                                    ESPORTA TEMA
                                </Button>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportTheme}
                                        style={{
                                            position: 'absolute',
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
                                            overflow: 'hidden'
                                        }}
                                        id="theme-import" />
                                    <label htmlFor="theme-import" style={{
                                        cursor: 'pointer'
                                    }}>
                                        <Button
                                            variant="outlined"
                                        >
                                            <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>upload</span>
                                            IMPORTA TEMA
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 5: MANUTENZIONE BRAND */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>refresh</span>
                                <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}>Manutenzione Brand</Typography>
                            </div>
                            <Typography variant="body2" sx={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</Typography>
                            <Button
                                onClick={handleForceRefresh}
                                variant="outlined"
                            >
                                <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)'}}>cached</span>
                                AGGIORNA BRAND E CACHE
                            </Button>
                        </div>

                        {/* SEZIONE 7: M3 THEME SETTINGS PANEL */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>tune</span>
                                <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}>M3 Theme Panel</Typography>
                            </div>
                            <Typography variant="body2" sx={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>Personalizza i token M3 per colori, tipografia, spacing e motion con anteprima live.</Typography>
                            <ThemeSettingsPanel />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="profile"
                    title="Profilo & Identità"
                    subtitle="Dati docente e istituto"
                    icon="badge"
                    variant="surface"
                    defaultOpen={false}
                >
                    <div
                        role="region"
                        aria-label="Profilo & Identità"
                        tabIndex={0}
                        style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)',
                            padding: 'var(--md-sys-spacing-4)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            background: 'var(--md-sys-color-surface-container-low)',
                            boxShadow: 'var(--md-sys-elevation-level1)'}}
                    >
                        <Typography variant="overline" sx={{color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-black)', marginBottom: 'var(--md-sys-spacing-4)'}}>
                            Profilo & Identità
                        </Typography>
                        <Typography variant="caption" sx={{color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-4)', opacity: 'var(--md-sys-state-opacity-caption)'}}>
                            Dati docente e istituto
                        </Typography>
                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </div>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <TextField label="Nome Istituto" value={localSettings.nomeIstituto} onChange={e => handleChange('nomeIstituto', e.target.value)} />
                            <TextField label="Città" value={localSettings.cittaIstituto} onChange={e => handleChange('cittaIstituto', e.target.value)} />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="ai_didattica"
                    title="AI & Didattica"
                    subtitle="Cervello AI e cattedra"
                    icon="psychology"
                    variant="outlined"
                    defaultOpen={false}
                >
                    {/* SEZIONE 1: MODELLO AI */}
                    <div style={{marginBottom: 'var(--md-sys-spacing-4)',
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: 'var(--md-sys-color-secondary)'}}>smart_toy</span>
                            <Typography
                                variant="caption"
                                style={{color: 'var(--md-sys-color-secondary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                            >
                                Modello Intelligenza
                            </Typography>
                        </div>

                        <TabGroup
                            tabs={(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ id: key, label: AI_PROFILES[key].label, icon: AI_PROFILES[key].icon }))}
                            activeTab={currentAiProfile}
                            onTabChange={(id) => handleAiProfileChange(id as keyof typeof AI_PROFILES)}
                            variant="contained" />

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--md-sys-spacing-3)',
                            padding: 'var(--md-sys-spacing-6)',
                            backgroundColor: currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary-container)'
                                : 'var(--md-sys-color-primaryContainer)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            border: `var(--md-sys-border-width-thin) solid ${currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary)'
                                : 'var(--md-sys-color-primary)'}`
                        }}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: currentAiProfile === 'esperto'
                                    ? 'var(--md-sys-color-on-secondary-container)'
                                    : 'var(--md-sys-color-on-primary-container)',
                                marginTop: 'var(--md-sys-spacing-4)'}}>info</span>
                            <Typography
                                variant="body2"
                                style={{color: currentAiProfile === 'esperto'
                                        ? 'var(--md-sys-color-on-secondary-container)'
                                        : 'var(--md-sys-color-on-primary-container)',
                                    margin: 0}}
                            >
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </Typography>
                        </div>
                    </div>

                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        {/* SEZIONE 2: ANNO SCOLASTICO */}
                        <div style={{padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        color: 'var(--md-sys-color-primary)'}}>calendar_month</span>
                                    <Typography
                                        variant="overline"
                                        style={{color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                                    >
                                        Anno Scolastico
                                    </Typography>
                                </div>
                                <Button
                                    onClick={handleAddNextYear}
                                    variant="outlined"
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        marginRight: 'var(--md-sys-spacing-4)'}}>add_circle</span>
                                    Aggiungi
                                </Button>
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                gap: 'var(--md-sys-spacing-4)'}}>
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

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <ChipInputList
                                        label="Storico Anni"
                                        items={localSettings.anniScolastici}
                                        onAdd={(item: string) => handleChange('anniScolastici', [...localSettings.anniScolastici, item])}
                                        onRemove={(idx: number) => handleChange('anniScolastici', localSettings.anniScolastici.filter((_, i: number) => i !== idx))}
                                        placeholder="Es: 2025/2026"
                                        icon="history" />
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 3: GESTIONE CATTEDRA UNIFICATA */}
                        <div style={{padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        color: 'var(--md-sys-color-secondary)'}}>school</span>
                                    <Typography
                                        variant="overline"
                                        style={{color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                                    >
                                        Gestione Cattedra
                                    </Typography>
                                </div>
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
                            </div>

                            {/* FORMAZIONE CLASSI STRUTTURATA (NORMATIVA ITALIANA) */}
                            <div style={{marginTop: 'var(--md-sys-spacing-4)',
                                padding: 'var(--md-sys-spacing-4)',
                                backgroundColor: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)',
                                    marginBottom: 'var(--md-sys-spacing-4)'}}>
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        color: 'var(--md-sys-color-primary)'}}>account_tree</span>
                                    <Typography
                                        variant="caption"
                                        style={{color: 'var(--md-sys-color-primary)',
                                            fontWeight: 'var(--md-sys-typescale-weight-black)'}}
                                    >
                                        Formazione Classi Strutturata
                                    </Typography>
                                </div>

                                <div style={{display: 'grid',
                                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                    gap: 'var(--md-sys-spacing-4)',
                                    marginBottom: 'var(--md-sys-spacing-4)'}}>
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
                                </div>

                                <div style={{display: 'grid',
                                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                    gap: 'var(--md-sys-spacing-4)',
                                    marginBottom: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--md-sys-spacing-4)'}}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Livelli / Anni
                                        </Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'var(--md-sys-spacing-4)'}}>
                                            {['1', '2', '3', '4', '5'].map(y => (
                                                <Button
                                                    key={y}
                                                    variant={selYears.includes(y) ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                                    style={{
                                                        minWidth: 'var(--md-sys-spacing-4)'
                                                    }}
                                                >
                                                    {y}° Anno
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--md-sys-spacing-4)'}}>
                                        <Typography
                                            variant="body2"
                                            style={{color: 'var(--md-sys-color-on-surface)',
                                                fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                        >
                                            Sezioni
                                        </Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'var(--md-sys-spacing-4)'}}>
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                                <Button
                                                    key={s}
                                                    variant={selSections.includes(s) ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelSections(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                                    style={{
                                                        minWidth: 'var(--md-sys-spacing-4)'
                                                    }}
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerateClasses}
                                    variant="contained"
                                    disabled={selYears.length === 0 || selSections.length === 0}
                                >
                                    <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>auto_awesome</span>
                                    Genera Combinazioni Classi
                                </Button>
                            </div>

                            {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                            <div style={{marginTop: 'var(--md-sys-spacing-4)',
                                padding: 'var(--md-sys-spacing-4)',
                                backgroundColor: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <div style={{display: 'flex',
                                    gap: 'var(--md-sys-spacing-4)',
                                    alignItems: 'flex-end'}}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Materia Singola"
                                            placeholder="Es: Italiano"
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddSubject()}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleAddSubject}
                                        variant="contained"
                                    >
                                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>add</span>
                                        Aggiungi
                                    </Button>
                                </div>
                            </div>

                            {/* MATRICE INTERATTIVA */}
                            <div style={{marginTop: 'var(--md-sys-spacing-4)',
                                padding: 'var(--md-sys-spacing-4)',
                                backgroundColor: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                overflowX: 'auto'}}>
                                <table  style={{width: 'var(--md-sys-percent-100)'}}>
                                    <thead>
                                        <tr style={{backgroundColor: 'var(--md-sys-color-surface-container-high)'}}>
                                            <th style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                textAlign: 'left',
                                                fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                                color: 'var(--md-sys-color-on-surface)',
                                                borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>Materia / Classe</th>
                                            {localSettings.classi.map(cls => (
                                                <th key={cls} style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                    textAlign: 'center',
                                                    fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                                    color: 'var(--md-sys-color-on-surface)',
                                                    borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                    borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                    position: 'relative'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 'var(--md-sys-spacing-4)'}}>
                                                        <span>{cls}</span>
                                                        <button
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            style={{background: 'none',
                                                                border: 'none',
                                                                color: 'var(--md-sys-color-error)',
                                                                cursor: 'pointer',
                                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                padding: 'var(--md-sys-spacing-4)',
                                                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 'var(--md-sys-spacing-4)',
                                                                height: 'var(--md-sys-spacing-4)'}}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localSettings.disciplines.map(subj => (
                                            <tr key={subj} style={{borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                <td style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                                    borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 'var(--md-sys-spacing-4)'}}>
                                                        <div style={{display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--md-sys-spacing-4)',
                                                            flex: 1}}>
                                                            <span style={{fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                                                color: 'var(--md-sys-color-on-surface)'}}>{subj}</span>
                                                            <Button
                                                                onClick={() => handleBulkAssign(localSettings.classi, [subj])}
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                Associa a tutte
                                                            </Button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                            style={{background: 'none',
                                                                border: 'none',
                                                                color: 'var(--md-sys-color-error)',
                                                                cursor: 'pointer',
                                                                padding: 'var(--md-sys-spacing-4)',
                                                                borderRadius: 'var(--md-sys-shape-corner-small)'}}
                                                        >
                                                            <span style={{
                                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'
                                                            }}>delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <td key={`${subj}-${cls}`} style={{padding: 'var(--md-sys-spacing-4)',
                                                            textAlign: 'center',
                                                            borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                            cursor: 'pointer'}}>
                                                            <div
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    padding: 'var(--md-sys-spacing-3)',
                                                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                    backgroundColor: assignment ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surface-container)',
                                                                    border: `var(--md-sys-border-width-thin) solid ${assignment ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                                    transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                                                    minHeight: 'var(--md-sys-spacing-4)'
                                                                }}
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-primary)',
                                                                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                            marginRight: 'var(--md-sys-spacing-4)'}}>check_circle</span>
                                                                        <div style={{display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 'var(--md-sys-spacing-4)'}} onClick={e => e.stopPropagation()}>
                                                                            <input
                                                                                type="number"
                                                                                value={assignment.hoursPerWeek}
                                                                                onChange={e => updateAssignmentHours(assignment.id ?? `${assignment.classId}-${subj}`, parseInt(e.target.value) || 1)}
                                                                                style={{width: 'var(--md-sys-spacing-4)',
                                                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
                                                                                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                                                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                                    backgroundColor: 'var(--md-sys-color-surface)',
                                                                                    color: 'var(--md-sys-color-on-surface)',
                                                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                                    textAlign: 'center'}} />
                                                                            <span style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                                color: 'var(--md-sys-color-on-surface-variant)'}}>h</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-outline-variant)',
                                                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>add</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        {localSettings.disciplines.length === 0 && (
                                            <tr>
                                                <td colSpan={localSettings.classi.length + 1} style={{padding: 'var(--md-sys-spacing-4)',
                                                    textAlign: 'center',
                                                    color: 'var(--md-sys-color-on-surface-variant)',
                                                    fontStyle: 'italic'}}>
                                                    Aggiungi una materia per iniziare la configurazione...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <InfoCard
                                title="Come funziona"
                                description="Questa matrice è il tuo centro di controllo. Clicca su una cella per associare una materia a una classe. Modifica il numero per impostare le ore settimanali."
                                icon="info"
                                variant="contained" />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="ai_suggestions"
                    title="Suggerimenti AI"
                    subtitle="Gestisci suggerimenti ignorati"
                    icon="lightbulb"
                    variant="tertiary"
                    defaultOpen={false}
                >
                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <Typography
                            variant="body2"
                            style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                        >
                            Qui puoi vedere i suggerimenti AI che hai ignorato e riattivarli se desideri.
                        </Typography>
                        {dismissedSuggestions.size === 0 ? (
                            <Typography
                                variant="body2"
                                style={{color: 'var(--md-sys-color-on-surface-variant)',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    padding: 'var(--md-sys-spacing-4)',
                                    backgroundColor: 'var(--md-sys-color-surface-container)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)'}}
                            >
                                Nessun suggerimento ignorato.
                            </Typography>
                        ) : (
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                {Array.from(dismissedSuggestions).map((id) => (
                                    <div key={id} style={{display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--md-sys-spacing-4)',
                                        backgroundColor: 'var(--md-sys-color-surface-container)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                        <div style={{display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--md-sys-spacing-4)'}}>
                                            <Typography
                                                variant="body2"
                                                style={{color: 'var(--md-sys-color-on-surface)',
                                                    fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                            >
                                                Suggerimento {id}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                            >
                                                Ignorato in precedenza
                                            </Typography>
                                        </div>
                                        <Button
                                            onClick={() => onReactivateSuggestion(id)}
                                            variant="outlined"
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                marginRight: 'var(--md-sys-spacing-4)'}}>refresh</span>
                                            Riattiva
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{display: 'flex',
                            justifyContent: 'center',
                            paddingTop: 'var(--md-sys-spacing-4)',
                            borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <Button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                } }
                                disabled={dismissedSuggestions.size === 0}
                                variant="text"
                                 style={{width: 'var(--md-sys-percent-100)'}}
                            >
                                Riattiva Tutti i Suggerimenti
                            </Button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="cloud"
                    title="Dati & Cloud"
                    subtitle="Backup e Storage"
                    icon="cloud_sync"
                    variant="surface"
                    defaultOpen={false}
                >
                    {/* Always render all children, do not hide section if storageInfo is missing */}
                    {storageInfo && (
                        <div style={{marginBottom: 'var(--md-sys-spacing-4)',
                            padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <Typography
                                    variant="overline"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    Storage Dispositivo
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    {storageInfo.used}MB / {storageInfo.total}MB
                                </Typography>
                            </div>
                            <div  style={{width: 'var(--md-sys-percent-100)'}}>
                                <div style={{
                                    width: `${storageInfo.percent}%`,
                                    height: 'var(--md-sys-percent-100)',
                                    backgroundColor: storageInfo.percent > 80 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)',
                                    borderRadius: 'var(--md-sys-spacing-4)',
                                    transition: 'width var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'
                                }}></div>
                            </div>
                            <Typography
                                variant="caption"
                                style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                            >
                                Dati salvati in IndexedDB (senza limiti LocalStorage).
                            </Typography>
                        </div>
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

                    <div style={{
                        padding: 'var(--md-sys-spacing-3)',
                        backgroundColor: driveState.isAuthenticated ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: `var(--md-sys-border-width-thin) solid ${driveState.isAuthenticated ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--md-sys-spacing-1)'
                    }}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-1)'}}>
                            <div style={{width: 'var(--md-sys-spacing-4)',
                                height: 'var(--md-sys-spacing-4)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: driveState.isAuthenticated ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                                color: driveState.isAuthenticated ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)'}}>
                                <span style={{
                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)'
                                }}>{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <Typography
                                    variant="overline"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    {driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                >
                                    {driveState.lastSyncTime ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}` : 'Nessun backup cloud'}
                                </Typography>
                            </div>
                        </div>
                        {driveState.isAuthenticated ? (
                            <Button
                                onClick={() => onSyncToDrive()}
                                disabled={driveState.isSyncing}
                                variant="contained"
                            >
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    marginRight: 'var(--md-sys-spacing-4)'}}>{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
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
                    </div>
                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--md-sys-spacing-4)',
                        marginTop: 'var(--md-sys-spacing-4)'}}>
                        <Button onClick={onExportData} variant="outlined">
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                marginRight: 'var(--md-sys-spacing-4)'}}>download</span>
                            Backup Locale
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} variant="outlined">
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                marginRight: 'var(--md-sys-spacing-4)'}}>upload</span>
                            Ripristina File
                        </Button>
                        <input type="file" ref={fileInputRef} style={{
                            position: 'absolute',
                            opacity: 0,
                            pointerEvents: 'none'
                        }} accept=".json,.csv,.xlsx,.xls" onChange={handleFileChange} />
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="debug_logging"
                    title="Debug & Logging"
                    subtitle="Visualizza e gestisci i log degli errori"
                    icon="bug_report"
                    variant="surface"
                    defaultOpen={false}
                >
                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <div style={{padding: 'var(--md-sys-spacing-4)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    <Typography
                                        variant="overline"
                                        style={{color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                    >
                                        Log degli Errori
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                    >
                                        Visualizza tutti gli errori registrati durante l'utilizzo dell'app
                                    </Typography>
                                </div>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: errorLogger.getErrorStats().total > 0 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)'}}>{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</span>
                            </div>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-4)',
                                padding: 'var(--md-sys-spacing-4)',
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                marginBottom: 'var(--md-sys-spacing-4)'}}>
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: 'var(--md-sys-color-primary)'}}>info</span>
                                <Typography
                                    variant="caption"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                >
                                    {errorLogger.getErrorStats().total} log registrati
                                </Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <Button
                                    onClick={() => {
                                        showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                                    } }
                                    variant="outlined"
                                     style={{width: 'var(--md-sys-percent-100)'}}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        marginRight: 'var(--md-sys-spacing-4)'}}>terminal</span>
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
                                     style={{width: 'var(--md-sys-percent-100)'}}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        marginRight: 'var(--md-sys-spacing-4)'}}>download</span>
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
                                     style={{width: 'var(--md-sys-percent-100)'}}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                        marginRight: 'var(--md-sys-spacing-4)'}}>delete</span>
                                    Elimina Log
                                </Button>
                            </div>
                        </div>

                        <InfoCard
                            title="Come usare"
                            description="Premi F12 per aprire la console, digita window.__errorLogger.getRecentErrors(10) per visualizzare gli ultimi 10 errori."
                            icon="info"
                            variant="outlined" />
                    </div>
                </SettingsGroup>

                <SettingsGroup
                    id="advanced"
                    title="Avanzate"
                    subtitle="Configurazione tecnica"
                    icon="build"
                    variant="surface"
                    defaultOpen={false}
                >
                    <div style={{padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid color-mix(in srgb, var(--md-sys-color-outline-variant) 20%, transparent)',
                        marginBottom: 'var(--md-sys-spacing-4)',
                        boxShadow: 'var(--md-sys-elevation-level1)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-primary)',
                                fontSize: 'var(--md-sys-typescale-label-large-font-size)'}}>key</span>
                            <Typography variant="caption" sx={{color: 'var(--md-sys-color-primary)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Google Cloud API</Typography>
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} leadingIcon="badge" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} leadingIcon="lock" />
                        </div>
                    </div>
                    <div style={{padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-error)-container 10%, transparent)',
                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                        border: 'var(--md-sys-border-width-thin) solid color-mix(in srgb, var(--md-sys-color-error) 20%, transparent)',
                        boxShadow: 'var(--md-sys-elevation-level1)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-error)',
                                fontSize: 'var(--md-sys-typescale-label-large-font-size)'}}>warning</span>
                            <Typography variant="caption" sx={{color: 'var(--md-sys-color-error)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Zona Pericolo</Typography>
                        </div>
                        <Button
                            onClick={() => setIsResetModalOpen(true)}
                            variant="contained"
                             style={{width: 'var(--md-sys-percent-100)'}}
                        >
                            <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                fontSize: 'var(--md-sys-typescale-label-large-font-size)'}}>delete_forever</span>
                            Reset Totale Dati
                        </Button>
                    </div>
                </SettingsGroup>

                <div style={{textAlign: 'center',
                    paddingTop: 'var(--md-sys-spacing-4)',
                    paddingBottom: 'var(--md-sys-spacing-4)'}}>
                    <Typography variant="caption" sx={{color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 50%, transparent)',
                        opacity: 'var(--md-sys-state-opacity-placeholder)'}}>
                        DocenteDoc AI v4.0.8 • Stable
                        <div style={{paddingTop: 'var(--md-sys-spacing-4)'}}>
                            <span style={{fontWeight: 'var(--md-sys-typescale-weight-black)',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Owner:</span> Antonio Corsano
                            <span style={{display: 'block',
                                marginTop: 'var(--md-sys-spacing-4)'}}>antonio.corsano@gmail.com</span>
                        </div>
                    </Typography>
                    <Button
                        onClick={onLogout}
                        variant="text"
                        style={{marginTop: 'var(--md-sys-spacing-4)',
                            marginLeft: 'var(--md-sys-margin-auto)',
                            marginRight: 'var(--md-sys-margin-auto)',
                            height: 'var(--md-sys-spacing-4)',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            letterSpacing: 'var(--md-sys-typescale-label-small-tracking)',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-short2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}
                    >
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                            marginRight: 'var(--md-sys-spacing-4)'}}>logout</span>
                        Esci dall'account
                    </Button>
                </div>
            </div>

            {isResetModalOpen && <ResetConfirmModal onClose={() => setIsResetModalOpen(false)} onConfirm={performReset} />}
        </Paper>
    );
};

export default Settings;

