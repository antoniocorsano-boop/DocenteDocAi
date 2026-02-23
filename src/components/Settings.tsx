// MD3 Compliant - Migration completed with functional exceptions

// MD3 Pure: Complete migration to inline styles using MD3 tokens for all settings interface and interactions
// All legacy CSS classes removed in favor of token-based styling - MD3 compliant
// Migration completed: interface_experience, profile, ai_didattica, ai_suggestions, cloud, debug_logging, advanced sections
// Settings.tsx: Migrated with functional exceptions for layout percentages and specific dimensions
// All styles now use MD3 design tokens and semantic color/spacing/elevation system where exact matches exist
// Functional exceptions: width/height percentages (100%, 50%, 20%, 10%), grid minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)) for responsive layout
import React, { useRef, useState, useEffect } from 'react';
import { SettingsProps } from '../types';
import { THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS } from '../constants';
import { generateNextSchoolYear } from '../utils/schoolUtils';
import {
    TextField,
    SelectField,
    M3Typography,
    M3Button,
    SectionHeader,
    TabGroup,
    InfoCard
} from './ui';
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
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface';
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

    return (
        <details
            style={{backgroundColor: 'var(--md-sys-color-surface-container-low)',
                backdropFilter: 'blur(var(--md-sys-elevation-backdrop-blur))',
                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                overflow: 'hidden',
                transition: `all var(--md-sys-motion-duration-medium1) var(--app-easing-standard)`,
                boxShadow: isOpen ? 'var(--md-sys-elevation-level2)' : 'var(--md-sys-elevation-level1)'}}
            open={isOpen}
            role="region"
            aria-label={subtitle ? `${title}: ${subtitle}` : title}
        >
            <summary onClick={handleToggle} style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--app-spacing-touch)',
                cursor: 'pointer',
                listStyle: 'none',
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                transition: `background-color var(--md-sys-motion-duration-short1) var(--app-easing-standard)`}}>
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-container)',
                    minWidth: 0,
                    flex: 1}}>
                    <div style={{width: 'var(--md-sys-spacing-8)',
                        height: 'var(--md-sys-spacing-8)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: variant === 'primary' 
                            ? 'var(--app-color-primary-container)' 
                            : variant === 'secondary' 
                            ? 'var(--app-color-secondary-container)' 
                            : variant === 'tertiary' 
                            ? 'var(--md-sys-color-tertiary-container)' 
                            : 'var(--md-sys-color-surface-container-high)',
                        color: variant === 'primary' 
                            ? 'var(--app-color-on-primary-container)' 
                            : variant === 'secondary' 
                            ? 'var(--app-color-on-secondary-container)' 
                            : variant === 'tertiary' 
                            ? 'var(--md-sys-color-on-tertiary-container)' 
                            : 'var(--md-sys-color-on-surface-variant)',
                        boxShadow: 'var(--md-sys-elevation-level1)'}}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)'
                        }}>{icon}</span>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <M3Typography variant="title-large" style={{color: 'var(--app-color-on-surface)',
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: '-0.025em'}}>{title}</M3Typography>
                        {subtitle && <M3Typography variant="body-small" style={{color: 'var(--md-sys-color-on-surface-variant)',
                            margin: 0,
                            opacity: 0.7}}>{subtitle}</M3Typography>}
                    </div>
                </div>
                <span style={{fontFamily: 'Material Symbols Outlined',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 'var(--app-text-body)',
                    transition: `transform var(--md-sys-motion-duration-short1) var(--app-easing-standard)`,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>expand_more</span>
            </summary>
            <div 
                style={{padding: 'var(--app-spacing-section)',
                    paddingTop: 'var(--app-spacing-component)',
                    borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                    animation: `fadeInSlideDown var(--app-motion-standard) var(--app-easing-standard)`,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    opacity: isOpen ? 1 : 0,
                    maxHeight: isOpen ? 'none' : '0',
                    overflow: 'hidden',
                    transition: `all var(--md-sys-motion-duration-short1) var(--app-easing-standard)`}}
                aria-hidden={!isOpen}
            >
                {children}
            </div>
        </details>
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
        <><div style={{display: 'flex',
            flexDirection: 'column',
            height: 'var(--md-sys-viewport-height-100)',
            backgroundColor: 'var(--app-color-surface)',
            overflow: 'hidden'}}>
            <div style={{display: 'flex',
                alignItems: 'center',
                padding: `var(--app-spacing-container) var(--app-spacing-section)`,
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                backdropFilter: 'blur(var(--md-sys-elevation-backdrop-blur))'}}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-element)',
                    flex: 1
                }}>
                    <M3Button onClick={onClose} variant="text">
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                    </M3Button>
                    <SectionHeader
                        title="Impostazioni"
                        subtitle="Configura il tuo profilo, l'AI e le preferenze dell'app."
                        icon="settings" />
                </div>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--app-spacing-container)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-container)'
            }}>

                <SettingsGroup
                    id="interface_experience"
                    title="Interfaccia & Esperienza Visiva"
                    subtitle="Personalizza l'aspetto e il comportamento dell'app"
                    icon="palette"
                    variant="primary"
                    defaultOpen={true}
                >
                    <div
                        role="region"
                        aria-label="Interfaccia & Esperienza Visiva"
                        tabIndex={0}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)',
                            padding: 'var(--app-spacing-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            background: 'var(--md-sys-color-surface-container-low)',
                            boxShadow: 'var(--md-sys-elevation-level1)'
                        }}
                    >
                        <M3Typography variant="label-large" style={{
                            color: 'var(--app-color-on-surface)',
                            fontWeight: 900,
                            marginBottom: 'var(--app-spacing-element)'
                        }}>
                            Interfaccia & Esperienza Visiva
                        </M3Typography>
                        <M3Typography variant="body-small" style={{
                            color: 'var(--md-sys-color-on-surface-variant)',
                            marginBottom: 'var(--app-spacing-container)',
                            opacity: 0.8
                        }}>
                            Personalizza l'aspetto e il comportamento dell'app
                        </M3Typography>
                        {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-element)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-element)'
                            }}>
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-title)',
                                    color: 'var(--app-color-primary)'
                                }}>dashboard_customize</span>
                                <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Modalità Interfaccia</M3Typography>
                            </div>
                            <TabGroup
                                tabs={[
                                    { id: 'classic', label: 'Classica', icon: 'grid_view' },
                                    { id: 'flow', label: 'Dinamica (Flow)', icon: 'account_tree' }
                                ]}
                                activeTab={localSettings.uiMode || 'classic'}
                                onTabChange={(id) => handleChange('uiMode', id)}
                                variant="primary" />
                            <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>
                                {localSettings.uiMode === 'flow'
                                    ? 'Modalità Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.'
                                    : 'Modalità Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                            </M3Typography>
                        </div>

                        {/* SEZIONE 2: ECOISTEMA VISIVO */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>auto_awesome</span>
                                <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Ecosistema Visivo</M3Typography>
                            </div>
                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-large), var(--md-sys-grid-fr-1)))',
                                gap: 'var(--app-spacing-container)'}}>
                                {[
                                    { id: 'aura', label: 'Aura', icon: 'blur_on', desc: 'Glassmorphism' },
                                    { id: 'expressive', label: 'Google', icon: 'android', desc: 'Expressive' },
                                    { id: 'cupertino', label: 'Cupertino', icon: 'phone_iphone', desc: 'Apple Style' },
                                    { id: 'windows', label: 'Windows', icon: 'desktop_windows', desc: 'Fluent Design' },
                                    { id: 'flat', label: 'Flat', icon: 'layers', desc: 'Material 3' },
                                    { id: 'minimal', label: 'Minimal', icon: 'check_box_outline_blank', desc: 'Essenziale' }
                                ].map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => handleThemeChange('visualStyle', style.id)}
                                        style={{display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 'var(--app-spacing-container)',
                                            padding: 'var(--app-spacing-container)',
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            border: themeState.visualStyle === style.id
                                                ? 'var(--app-border-thick) solid var(--app-color-primary)'
                                                : 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                            backgroundColor: themeState.visualStyle === style.id
                                                ? 'var(--app-color-primary-container)'
                                                : 'var(--md-sys-color-surface-container-high)',
                                            cursor: 'pointer',
                                            transition: `all var(--md-sys-motion-duration-short1) var(--app-easing-standard)`,
                                            textAlign: 'center'}}
                                    >
                                        <span style={{fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--app-text-body)',
                                            color: themeState.visualStyle === style.id
                                                ? 'var(--app-color-on-primary-container)'
                                                : 'var(--md-sys-color-on-surface-variant)'}}>{style.icon}</span>
                                        <M3Typography variant="label-medium" style={{color: themeState.visualStyle === style.id
                                                ? 'var(--app-color-on-primary-container)'
                                                : 'var(--app-color-on-surface)',
                                            fontWeight: themeState.visualStyle === style.id ? 600 : 500,
                                            margin: 0}}>{style.label}</M3Typography>
                                        <M3Typography variant="body-small" style={{color: themeState.visualStyle === style.id
                                                ? 'var(--app-color-on-primary-container)'
                                                : 'var(--md-sys-color-on-surface-variant)',
                                            margin: 0,
                                            opacity: 0.8}}>{style.desc}</M3Typography>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SEZIONE 3: TEMA E COLORI */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>palette</span>
                                <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Tema & Colori</M3Typography>
                            </div>

                            <div style={{marginBottom: 'var(--app-spacing-container)'}}>
                                <TabGroup
                                    tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                                    activeTab={themeState.mode}
                                    onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                                    variant="primary" />
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-medium), var(--md-sys-grid-fr-1)))',
                                gap: 'var(--app-spacing-container)',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                {THEME_CUSTOMIZATIONS.map(theme => (
                                    <ThemeBubble
                                        key={theme.name}
                                        name={theme.name}
                                        colors={{
                                            primary: theme.colors.primary ?? 'var(--app-color-primary)',
                                            secondary: theme.colors.secondary ?? 'var(--app-color-secondary)',
                                            tertiary: theme.colors.tertiary ?? 'var(--md-sys-color-tertiary)'
                                        }}
                                        isSelected={themeState.customizationName === theme.name}
                                        onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })} />
                                ))}
                            </div>

                            <div style={{borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                paddingTop: 'var(--app-spacing-container)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--app-spacing-container)',
                                    marginBottom: 'var(--app-spacing-container)'}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        color: 'var(--app-color-primary)'}}>magic_button</span>
                                    <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em'}}>Generatore AI</M3Typography>
                                </div>
                                <div style={{display: 'flex',
                                    gap: 'var(--app-spacing-container)',
                                    alignItems: 'flex-end'}}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Descrivi il tuo stile"
                                            value={themePrompt}
                                            onChange={e => setThemePrompt(e.target.value)}
                                            placeholder="Es. 'Colori tramonto'..."
                                            leadingIcon="palette" />
                                    </div>
                                    <M3Button
                                        onClick={handleGenerateThemeFromPrompt}
                                        disabled={isGeneratingTheme || !themePrompt.trim()}
                                        variant="filled"
                                        style={{minWidth: '0',
                                            width: 'var(--app-spacing-container)',
                                            height: 'var(--app-spacing-container)',
                                            padding: '0',
                                            boxShadow: 'var(--md-sys-elevation-level2)',
                                            borderRadius: 'var(--md-sys-shape-corner-large)'}}
                                    >
                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                                    </M3Button>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 4: PARAMETRI AVANZATI */}
                        <div style={{marginTop: 'var(--app-spacing-container)',
                            padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)',
                                marginBottom: 'var(--app-spacing-container)',
                                paddingBottom: 'var(--app-spacing-container)',
                                borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>tune</span>
                                <M3Typography
                                    variant="label-small"
                                    style={{color: 'var(--app-color-primary)',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'}}
                                >
                                    Parametri Strutturali
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Intensità Blur Vetro
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 600}}
                                        >
                                            {themeState.glassBlur || 30}px
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        value={themeState.glassBlur || 30}
                                        onChange={e => handleThemeChange('glassBlur', parseInt(e.target.value))}
                                        style={{width: 'var(--app-layout-full)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Scala Font
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 600}}
                                        >
                                            {themeState.fontScale || 1}x
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="0.8" max="1.4" step="0.1"
                                        value={themeState.fontScale || 1}
                                        onChange={e => handleThemeChange('fontScale', parseFloat(e.target.value))}
                                        style={{width: 'var(--app-layout-full)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Livello Contrasto
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 600}}
                                        >
                                            {themeState.contrastLevel || 0}
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="-50" max="50" step="5"
                                        value={themeState.contrastLevel || 0}
                                        onChange={e => handleThemeChange('contrastLevel', parseInt(e.target.value))}
                                         style={{width: 'var(--app-layout-full)'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Arrotondamento Bordi
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: 600}}
                                        >
                                            x{themeState.radiusMultiplier || 1}
                                        </M3Typography>
                                    </div>
                                    <div style={{display: 'flex',
                                        gap: 'var(--app-spacing-container)',
                                        flexWrap: 'wrap'}}>
                                        {[0.5, 1, 1.5, 2].map(m => (
                                            <M3Button
                                                key={m}
                                                variant={themeState.radiusMultiplier === m ? 'filled' : 'outlined'}
                                                size="small"
                                                onClick={() => handleThemeChange('radiusMultiplier', m)}
                                                style={{
                                                    minWidth: 'var(--app-spacing-container)'
                                                }}
                                            >
                                                {m === 1 ? 'Standard' : `${m}x`}
                                            </M3Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 6: EXPORT/IMPORT TEMA */}
                        <div style={{marginTop: 'var(--app-spacing-container)',
                            padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>import_export</span>
                                <M3Typography
                                    variant="label-small"
                                    style={{color: 'var(--app-color-primary)',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'}}
                                >
                                    Backup Tema
                                </M3Typography>
                            </div>
                            <M3Typography
                                variant="body-medium"
                                style={{color: 'var(--md-sys-color-on-surface-variant)',
                                    marginBottom: 'var(--app-spacing-container)',
                                    lineHeight: 1.5}}
                            >
                                Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.
                            </M3Typography>
                            <div style={{display: 'flex',
                                gap: 'var(--app-spacing-container)',
                                alignItems: 'center'}}>
                                <M3Button
                                    onClick={handleExportTheme}
                                    variant="outlined"
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        marginRight: 'var(--app-spacing-container)',
                                        fontSize: 'var(--app-text-body)'}}>download</span>
                                    ESPORTA TEMA
                                </M3Button>
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
                                        <M3Button
                                            variant="outlined"
                                        >
                                            <span style={{fontFamily: 'Material Symbols Outlined',
                                                marginRight: 'var(--app-spacing-container)',
                                                fontSize: 'var(--app-text-body)'}}>upload</span>
                                            IMPORTA TEMA
                                        </M3Button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 5: MANUTENZIONE BRAND */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>refresh</span>
                                <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Manutenzione Brand</M3Typography>
                            </div>
                            <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</M3Typography>
                            <M3Button
                                onClick={handleForceRefresh}
                                variant="tonal"
                            >
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    marginRight: 'var(--app-spacing-container)'}}>cached</span>
                                AGGIORNA BRAND E CACHE
                            </M3Button>
                        </div>

                        {/* SEZIONE 7: M3 THEME SETTINGS PANEL */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>tune</span>
                                <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>M3 Theme Panel</M3Typography>
                            </div>
                            <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0}}>Personalizza i token M3 per colori, tipografia, spacing e motion con anteprima live.</M3Typography>
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
                            gap: 'var(--app-spacing-container)',
                            padding: 'var(--app-spacing-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            background: 'var(--md-sys-color-surface-container-low)',
                            boxShadow: 'var(--md-sys-elevation-level1)'}}
                    >
                        <M3Typography variant="label-large" style={{color: 'var(--app-color-on-surface)', fontWeight: 900, marginBottom: 'var(--app-spacing-container)'}}>
                            Profilo & Identità
                        </M3Typography>
                        <M3Typography variant="body-small" style={{color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--app-spacing-container)', opacity: 0.8}}>
                            Dati docente e istituto
                        </M3Typography>
                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--app-spacing-container)'}}>
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </div>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--app-spacing-container)'}}>
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
                    variant="secondary"
                    defaultOpen={false}
                >
                    {/* SEZIONE 1: MODELLO AI */}
                    <div style={{marginBottom: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container)',
                        backgroundColor: 'var(--app-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: 'var(--app-color-secondary)'}}>smart_toy</span>
                            <M3Typography
                                variant="label-small"
                                style={{color: 'var(--app-color-secondary)',
                                    fontWeight: 900,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'}}
                            >
                                Modello Intelligenza
                            </M3Typography>
                        </div>

                        <TabGroup
                            tabs={(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ id: key, label: AI_PROFILES[key].label, icon: AI_PROFILES[key].icon }))}
                            activeTab={currentAiProfile}
                            onTabChange={(id) => handleAiProfileChange(id as keyof typeof AI_PROFILES)}
                            variant="primary" />

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--app-spacing-element)',
                            padding: 'var(--app-spacing-section)',
                            backgroundColor: currentAiProfile === 'esperto'
                                ? 'var(--app-color-secondary-container)'
                                : 'var(--md-sys-color-primaryContainer)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            border: `var(--app-border-thin) solid ${currentAiProfile === 'esperto'
                                ? 'var(--app-color-secondary)'
                                : 'var(--app-color-primary)'}`
                        }}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: currentAiProfile === 'esperto'
                                    ? 'var(--app-color-on-secondary-container)'
                                    : 'var(--app-color-on-primary-container)',
                                marginTop: 'var(--app-spacing-container)'}}>info</span>
                            <M3Typography
                                variant="body-medium"
                                style={{color: currentAiProfile === 'esperto'
                                        ? 'var(--app-color-on-secondary-container)'
                                        : 'var(--app-color-on-primary-container)',
                                    lineHeight: 1.5,
                                    margin: 0}}
                            >
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </M3Typography>
                        </div>
                    </div>

                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-container)'}}>
                        {/* SEZIONE 2: ANNO SCOLASTICO */}
                        <div style={{padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        color: 'var(--app-color-primary)'}}>calendar_month</span>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'var(--app-color-on-surface)',
                                            fontWeight: 900,
                                            letterSpacing: '0.025em',
                                            textTransform: 'uppercase'}}
                                    >
                                        Anno Scolastico
                                    </M3Typography>
                                </div>
                                <M3Button
                                    onClick={handleAddNextYear}
                                    variant="tonal"
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        marginRight: 'var(--app-spacing-container)'}}>add_circle</span>
                                    Aggiungi
                                </M3Button>
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                gap: 'var(--app-spacing-container)'}}>
                                <SelectField
                                    label="Anno Corrente"
                                    value={localSettings.annoScolasticoCorrente}
                                    onChange={e => handleChange('annoScolasticoCorrente', e.target.value)}
                                >
                                    {localSettings.anniScolastici.map(year => <option key={year} value={year}>{year}</option>)}
                                </SelectField>

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
                        <div style={{padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        color: 'var(--app-color-secondary)'}}>school</span>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'var(--app-color-on-surface)',
                                            fontWeight: 900,
                                            letterSpacing: '0.025em',
                                            textTransform: 'uppercase'}}
                                    >
                                        Gestione Cattedra
                                    </M3Typography>
                                </div>
                                <M3Button
                                    onClick={() => {
                                        if (confirm("Sei sicuro di voler svuotare tutta la cattedra?")) {
                                            handleChange('teachingAssignments', []);
                                        }
                                    } }
                                    variant="outlined"
                                >
                                    Svuota Tutto
                                </M3Button>
                            </div>

                            {/* FORMAZIONE CLASSI STRUTTURATA (NORMATIVA ITALIANA) */}
                            <div style={{marginTop: 'var(--app-spacing-container)',
                                padding: 'var(--app-spacing-container)',
                                backgroundColor: 'var(--app-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--app-spacing-container)',
                                    marginBottom: 'var(--app-spacing-container)'}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        color: 'var(--app-color-primary)'}}>account_tree</span>
                                    <M3Typography
                                        variant="label-small"
                                        style={{color: 'var(--app-color-primary)',
                                            fontWeight: 900,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'}}
                                    >
                                        Formazione Classi Strutturata
                                    </M3Typography>
                                </div>

                                <div style={{display: 'grid',
                                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                    gap: 'var(--app-spacing-container)',
                                    marginBottom: 'var(--app-spacing-container)'}}>
                                    <SelectField
                                        label="Ordinamento Scolastico"
                                        value={selLevel}
                                        onChange={e => setSelLevel(e.target.value)}
                                    >
                                        {SCHOOL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </SelectField>
                                    <TextField
                                        label="Indirizzo / Specializzazione"
                                        value={selSpec}
                                        onChange={e => setSelSpec(e.target.value)}
                                        placeholder="Es: Scientifico, CAT, Musicale..." />
                                </div>

                                <div style={{display: 'grid',
                                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                                    gap: 'var(--app-spacing-container)',
                                    marginBottom: 'var(--app-spacing-container)'}}>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--app-spacing-container)'}}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Livelli / Anni
                                        </M3Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'var(--app-spacing-container)'}}>
                                            {['1', '2', '3', '4', '5'].map(y => (
                                                <M3Button
                                                    key={y}
                                                    variant={selYears.includes(y) ? 'filled' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                                    style={{
                                                        minWidth: 'var(--app-spacing-container)'
                                                    }}
                                                >
                                                    {y}° Anno
                                                </M3Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--app-spacing-container)'}}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'var(--app-color-on-surface)',
                                                fontWeight: 500}}
                                        >
                                            Sezioni
                                        </M3Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'var(--app-spacing-container)'}}>
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                                <M3Button
                                                    key={s}
                                                    variant={selSections.includes(s) ? 'filled' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelSections(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                                    style={{
                                                        minWidth: 'var(--app-spacing-container)'
                                                    }}
                                                >
                                                    {s}
                                                </M3Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <M3Button
                                    onClick={handleGenerateClasses}
                                    variant="filled"
                                    disabled={selYears.length === 0 || selSections.length === 0}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        marginRight: 'var(--app-spacing-container)',
                                        fontSize: 'var(--app-text-body)'}}>auto_awesome</span>
                                    Genera Combinazioni Classi
                                </M3Button>
                            </div>

                            {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                            <div style={{marginTop: 'var(--app-spacing-container)',
                                padding: 'var(--app-spacing-container)',
                                backgroundColor: 'var(--app-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                <div style={{display: 'flex',
                                    gap: 'var(--app-spacing-container)',
                                    alignItems: 'center'}}>
                                    <div style={{
                                        flex: 1
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Aggiungi Materia Singola (es: Italiano)"
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                                             style={{width: 'var(--app-layout-full)'}}
                                    />
                                    </div>
                                    <M3Button
                                        onClick={handleAddSubject}
                                        variant="filled"
                                    >
                                        <span style={{
                                            fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--app-text-body)'
                                        }}>add</span>
                                    </M3Button>
                                </div>
                            </div>

                            {/* MATRICE INTERATTIVA */}
                            <div style={{marginTop: 'var(--app-spacing-container)',
                                padding: 'var(--app-spacing-container)',
                                backgroundColor: 'var(--app-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                overflowX: 'auto'}}>
                                <table  style={{width: 'var(--app-layout-full)'}}>
                                    <thead>
                                        <tr style={{backgroundColor: 'var(--md-sys-color-surface-container-high)'}}>
                                            <th style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                                textAlign: 'left',
                                                fontWeight: 600,
                                                color: 'var(--app-color-on-surface)',
                                                borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                fontSize: 'var(--app-text-body)'}}>Materia / Classe</th>
                                            {localSettings.classi.map(cls => (
                                                <th key={cls} style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    color: 'var(--app-color-on-surface)',
                                                    borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                    borderLeft: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                    fontSize: 'var(--app-text-body)',
                                                    position: 'relative'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 'var(--app-spacing-container)'}}>
                                                        <span>{cls}</span>
                                                        <button
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            style={{background: 'none',
                                                                border: 'none',
                                                                color: 'var(--md-sys-color-error)',
                                                                cursor: 'pointer',
                                                                fontSize: 'var(--app-text-body)',
                                                                padding: 'var(--app-spacing-container)',
                                                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 'var(--app-spacing-container)',
                                                                height: 'var(--app-spacing-container)'}}
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
                                            <tr key={subj} style={{borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                <td style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                                    borderRight: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 'var(--app-spacing-container)'}}>
                                                        <div style={{display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--app-spacing-container)',
                                                            flex: 1}}>
                                                            <span style={{fontWeight: 500,
                                                                color: 'var(--app-color-on-surface)'}}>{subj}</span>
                                                            <M3Button
                                                                onClick={() => handleBulkAssign(subj)}
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                Associa a tutte
                                                            </M3Button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                            style={{background: 'none',
                                                                border: 'none',
                                                                color: 'var(--md-sys-color-error)',
                                                                cursor: 'pointer',
                                                                padding: 'var(--app-spacing-container)',
                                                                borderRadius: 'var(--md-sys-shape-corner-small)'}}
                                                        >
                                                            <span style={{
                                                                fontFamily: 'Material Symbols Outlined',
                                                                fontSize: 'var(--app-text-body)'
                                                            }}>delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <td key={`${subj}-${cls}`} style={{padding: 'var(--app-spacing-container)',
                                                            textAlign: 'center',
                                                            borderLeft: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                            cursor: 'pointer'}}>
                                                            <div
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    padding: 'var(--app-spacing-element)',
                                                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                    backgroundColor: assignment ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surfaceContainer)',
                                                                    border: `var(--app-border-thin) solid ${assignment ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                                    transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
                                                                    minHeight: 'var(--app-spacing-container)'
                                                                }}
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <span style={{fontFamily: 'Material Symbols Outlined',
                                                                            color: 'var(--app-color-primary)',
                                                                            fontSize: 'var(--app-text-body)',
                                                                            marginRight: 'var(--app-spacing-container)'}}>check_circle</span>
                                                                        <div style={{display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 'var(--app-spacing-container)'}} onClick={e => e.stopPropagation()}>
                                                                            <input
                                                                                type="number"
                                                                                value={assignment.hoursPerWeek}
                                                                                onChange={e => updateAssignmentHours(assignment.classId, subj, parseInt(e.target.value) || 1)}
                                                                                style={{width: 'var(--app-spacing-container)',
                                                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
                                                                                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                                                                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                                    backgroundColor: 'var(--app-color-surface)',
                                                                                    color: 'var(--app-color-on-surface)',
                                                                                    fontSize: 'var(--app-text-body)',
                                                                                    textAlign: 'center'}} />
                                                                            <span style={{fontSize: 'var(--app-text-body)',
                                                                                color: 'var(--md-sys-color-on-surface-variant)'}}>h</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                                                        color: 'var(--md-sys-color-outline-variant)',
                                                                        fontSize: 'var(--app-text-body)'}}>add</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        {localSettings.disciplines.length === 0 && (
                                            <tr>
                                                <td colSpan={localSettings.classi.length + 1} style={{padding: 'var(--app-spacing-container)',
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
                                variant="primary" />
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
                        gap: 'var(--app-spacing-container)'}}>
                        <M3Typography
                            variant="body-medium"
                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                lineHeight: 1.5}}
                        >
                            Qui puoi vedere i suggerimenti AI che hai ignorato e riattivarli se desideri.
                        </M3Typography>
                        {dismissedSuggestions.size === 0 ? (
                            <M3Typography
                                variant="body-medium"
                                style={{color: 'var(--md-sys-color-on-surface-variant)',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    padding: 'var(--app-spacing-container)',
                                    backgroundColor: 'var(--app-color-surface-container)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)'}}
                            >
                                Nessun suggerimento ignorato.
                            </M3Typography>
                        ) : (
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                {Array.from(dismissedSuggestions).map((id) => (
                                    <div key={id} style={{display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--app-spacing-container)',
                                        backgroundColor: 'var(--app-color-surface-container)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                        <div style={{display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--app-spacing-container)'}}>
                                            <M3Typography
                                                variant="body-medium"
                                                style={{color: 'var(--app-color-on-surface)',
                                                    fontWeight: 500}}
                                            >
                                                Suggerimento {id}
                                            </M3Typography>
                                            <M3Typography
                                                variant="body-small"
                                                style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                            >
                                                Ignorato in precedenza
                                            </M3Typography>
                                        </div>
                                        <M3Button
                                            onClick={() => onReactivateSuggestion(id)}
                                            variant="tonal"
                                        >
                                            <span style={{fontFamily: 'Material Symbols Outlined',
                                                fontSize: 'var(--app-text-body)',
                                                marginRight: 'var(--app-spacing-container)'}}>refresh</span>
                                            Riattiva
                                        </M3Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{display: 'flex',
                            justifyContent: 'center',
                            paddingTop: 'var(--app-spacing-container)',
                            borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <M3Button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                } }
                                disabled={dismissedSuggestions.size === 0}
                                variant="text"
                                 style={{width: 'var(--app-layout-full)'}}
                            >
                                Riattiva Tutti i Suggerimenti
                            </M3Button>
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
                        <div style={{marginBottom: 'var(--app-spacing-container)',
                            padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <M3Typography
                                    variant="label-large"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 600}}
                                >
                                    Storage Dispositivo
                                </M3Typography>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 500}}
                                >
                                    {storageInfo.used}MB / {storageInfo.total}MB
                                </M3Typography>
                            </div>
                            <div  style={{width: 'var(--app-layout-full)'}}>
                                <div style={{
                                    width: `${storageInfo.percent}%`,
                                    height: 'var(--app-layout-full)',
                                    backgroundColor: storageInfo.percent > 80 ? 'var(--md-sys-color-error)' : 'var(--app-color-primary)',
                                    borderRadius: 'var(--app-spacing-container)',
                                    transition: 'width var(--app-motion-standard) var(--app-easing-standard)'
                                }}></div>
                            </div>
                            <M3Typography
                                variant="body-small"
                                style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                            >
                                Dati salvati in IndexedDB (senza limiti LocalStorage).
                            </M3Typography>
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
                                    variant="secondary" />
                            );
                        }
                        return null;
                    })()}

                    <div style={{
                        padding: 'var(--app-spacing-element)',
                        backgroundColor: driveState.isAuthenticated ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surfaceContainer)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: `var(--app-border-thin) solid ${driveState.isAuthenticated ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--md-sys-spacing-1)'
                    }}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-1)'}}>
                            <div style={{width: 'var(--app-spacing-container)',
                                height: 'var(--app-spacing-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: driveState.isAuthenticated ? 'var(--app-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                                color: driveState.isAuthenticated ? 'var(--app-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)'}}>
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)'
                                }}>{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                <M3Typography
                                    variant="label-large"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 600}}
                                >
                                    {driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                >
                                    {driveState.lastSyncTime ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}` : 'Nessun backup cloud'}
                                </M3Typography>
                            </div>
                        </div>
                        {driveState.isAuthenticated ? (
                            <M3Button
                                onClick={() => onSyncToDrive()}
                                disabled={driveState.isSyncing}
                                variant="filled"
                            >
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    marginRight: 'var(--app-spacing-container)'}}>{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
                                {driveState.isSyncing ? '...' : 'Salva'}
                            </M3Button>
                        ) : (
                            settings.googleClientId && (
                                <M3Button
                                    onClick={onConnectDrive}
                                    variant="filled"
                                >
                                    Connetti
                                </M3Button>
                            )
                        )}
                    </div>
                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--app-spacing-container)',
                        marginTop: 'var(--app-spacing-container)'}}>
                        <M3Button onClick={onExportData} variant="tonal">
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'}}>download</span>
                            Backup Locale
                        </M3Button>
                        <M3Button onClick={() => fileInputRef.current?.click()} variant="tonal">
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'}}>upload</span>
                            Ripristina File
                        </M3Button>
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
                        gap: 'var(--app-spacing-container)'}}>
                        <div style={{padding: 'var(--app-spacing-container)',
                            backgroundColor: 'var(--app-color-surface-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--app-spacing-container)'}}>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'var(--app-color-on-surface)',
                                            fontWeight: 600}}
                                    >
                                        Log degli Errori
                                    </M3Typography>
                                    <M3Typography
                                        variant="body-medium"
                                        style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                    >
                                        Visualizza tutti gli errori registrati durante l'utilizzo dell'app
                                    </M3Typography>
                                </div>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: errorLogger.getErrorStats().total > 0 ? 'var(--md-sys-color-error)' : 'var(--app-color-primary)'}}>{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</span>
                            </div>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)',
                                padding: 'var(--app-spacing-container)',
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                marginBottom: 'var(--app-spacing-container)'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: 'var(--app-color-primary)'}}>info</span>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)'}}
                                >
                                    {errorLogger.getErrorStats().total} log registrati
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                <M3Button
                                    onClick={() => {
                                        showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                                    } }
                                    variant="tonal"
                                     style={{width: 'var(--app-layout-full)'}}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        marginRight: 'var(--app-spacing-container)'}}>terminal</span>
                                    Console Browser (F12)
                                </M3Button>
                                <M3Button
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
                                    variant="tonal"
                                     style={{width: 'var(--app-layout-full)'}}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        marginRight: 'var(--app-spacing-container)'}}>download</span>
                                    Esporta JSON
                                </M3Button>
                                <M3Button
                                    onClick={() => {
                                        if (confirm('Sei sicuro di voler eliminare tutti i log?')) {
                                            errorLogger.clearAllLogs();
                                            showToast('Tutti i log sono stati eliminati', 'success');
                                        }
                                    } }
                                    variant="text"
                                     style={{width: 'var(--app-layout-full)'}}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-body)',
                                        marginRight: 'var(--app-spacing-container)'}}>delete</span>
                                    Elimina Log
                                </M3Button>
                            </div>
                        </div>

                        <InfoCard
                            title="Come usare"
                            description="Premi F12 per aprire la console, digita window.__errorLogger.getRecentErrors(10) per visualizzare gli ultimi 10 errori."
                            icon="info"
                            variant="secondary" />
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
                    <div style={{padding: 'var(--app-spacing-container)',
                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid color-mix(in srgb, var(--md-sys-color-outline-variant) 20%, transparent)',
                        marginBottom: 'var(--app-spacing-container)',
                        boxShadow: 'var(--md-sys-elevation-level1)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                color: 'var(--app-color-primary)',
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>key</span>
                            <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Google Cloud API</M3Typography>
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} leadingIcon="badge" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} leadingIcon="lock" />
                        </div>
                    </div>
                    <div style={{padding: 'var(--app-spacing-container)',
                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-error)-container 10%, transparent)',
                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                        border: 'var(--app-border-thin) solid color-mix(in srgb, var(--md-sys-color-error) 20%, transparent)',
                        boxShadow: 'var(--md-sys-elevation-level1)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                color: 'var(--md-sys-color-error)',
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>warning</span>
                            <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-error)',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Zona Pericolo</M3Typography>
                        </div>
                        <M3Button
                            onClick={() => setIsResetModalOpen(true)}
                            variant="filled"
                             style={{width: 'var(--app-layout-full)'}}
                        >
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                marginRight: 'var(--app-spacing-container)',
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>delete_forever</span>
                            Reset Totale Dati
                        </M3Button>
                    </div>
                </SettingsGroup>

                <div style={{textAlign: 'center',
                    paddingTop: 'var(--app-spacing-container)',
                    paddingBottom: 'var(--app-spacing-container)'}}>
                    <M3Typography variant="body-small" style={{color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 50%, transparent)',
                        opacity: 0.5}}>
                        DocenteDoc AI v4.0.8 • Stable
                        <div style={{paddingTop: 'var(--app-spacing-container)'}}>
                            <span style={{fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Owner:</span> Antonio Corsano
                            <span style={{display: 'block',
                                marginTop: 'var(--app-spacing-container)'}}>antonio.corsano@gmail.com</span>
                        </div>
                    </M3Typography>
                    <M3Button
                        onClick={onLogout}
                        variant="text"
                        style={{marginTop: 'var(--app-spacing-container)',
                            marginLeft: 'var(--app-layout-auto)',
                            marginRight: 'var(--app-layout-auto)',
                            height: 'var(--app-spacing-container)',
                            fontSize: 'var(--md-sys-typescale-label-small-size)',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--md-sys-typescale-label-small-tracking)',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-easing-standard) var(--md-sys-motion-duration-short2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}
                    >
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-label-large-size)',
                            marginRight: 'var(--app-spacing-container)'}}>logout</span>
                        Esci dall'account
                    </M3Button>
                </div>
            </div>

            {isResetModalOpen && <ResetConfirmModal onClose={() => setIsResetModalOpen(false)} onConfirm={performReset} />}
        </div>
        </>
    );
};

export default Settings;










