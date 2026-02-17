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
import { ProfileSettings } from './settings/ProfileSettings';
import { CloudSettings } from './settings/CloudSettings';
import { DebugSettings } from './settings/DebugSettings';
import { InterfaceSettings } from './settings/InterfaceSettings';
import { AiDidatticaSettings } from './settings/AiDidatticaSettings';
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

                <InterfaceSettings
                    localSettings={localSettings}
                    themeState={themeState}
                    themePrompt={themePrompt}
                    isGeneratingTheme={isGeneratingTheme}
                    onSettingChange={handleChange}
                    onThemeChange={handleThemeChange}
                    onSaveTheme={onSaveTheme}
                    onGenerateTheme={handleGenerateThemeFromPrompt}
                    onExportTheme={handleExportTheme}
                    onImportTheme={handleImportTheme}
                    onForceRefresh={handleForceRefresh}
                    setThemePrompt={setThemePrompt}
                />

                <ProfileSettings localSettings={localSettings} onSettingChange={handleChange} />

                <AiDidatticaSettings
                    localSettings={localSettings}
                    currentAiProfile={currentAiProfile}
                    selLevel={selLevel}
                    selSpec={selSpec}
                    selYears={selYears}
                    selSections={selSections}
                    newSubjectName={newSubjectName}
                    onSettingChange={handleChange}
                    onAiProfileChange={handleAiProfileChange}
                    onAddNextYear={handleAddNextYear}
                    onGenerateClasses={handleGenerateClasses}
                    onAddSubject={handleAddSubject}
                    setSelLevel={setSelLevel}
                    setSelSpec={setSelSpec}
                    setSelYears={setSelYears}
                    setSelSections={setSelSections}
                    setNewSubjectName={setNewSubjectName}
                    toggleAssociation={toggleAssociation}
                    updateAssignmentHours={updateAssignmentHours}
                    handleBulkAssign={handleBulkAssign}
                />

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

                <CloudSettings
                    localSettings={localSettings}
                    driveState={driveState}
                    storageInfo={storageInfo}
                    onConnectDrive={onConnectDrive}
                    onSyncToDrive={onSyncToDrive}
                    onExportData={onExportData}
                    onImportData={onImportData}
                />

                <DebugSettings showToast={showToast} />

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










