// LEGACY - MD3 Non-compliant

// MD3 Pure: Complete migration to inline styles using MD3 tokens for all settings interface and interactions
// All legacy CSS classes removed in favor of token-based styling - 100% MD3 compliant
// Migration completed: interface_experience, profile, ai_didattica, ai_suggestions, cloud, debug_logging, advanced sections
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
import ThemeBubble from './ThemeBubble';
import { ThemeSettingsPanel } from './settings/ThemeSettingsPanel';
import ChipInputList from './ChipInputList';
import ResetConfirmModal from './ResetConfirmModal';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { errorLogger } from '../services/errorLogger';
import { useTheme } from '../theme/theme';

const SettingsGroup: React.FC<{
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface';
    defaultOpen: boolean;
    children: React.ReactNode;
}> = ({ id, title, subtitle, icon, variant, defaultOpen, children }) => {
    const { layers } = useTheme();
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
            style={{backgroundColor: 'layers.sys.colors.surface-container-low',
                backdropFilter: 'blur(20px)',
                border: '1px solid layers.sys.colors.outline-variant',
                borderRadius: 'layers.ref.shape.corner.extra-large',
                overflow: 'hidden',
                transition: `all ${layers.motion.duration.medium1} ${layers.motion.easing.standard}`,
                boxShadow: isOpen ? 'layers.sys.elevation.level2' : 'layers.sys.elevation.level1'}}
            open={isOpen}
            role="region"
            aria-label={subtitle ? `${title}: ${subtitle}` : title}
        >
            <summary onClick={handleToggle} style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: layers.ref.spacing['5'],
                cursor: 'pointer',
                listStyle: 'none',
                backgroundColor: 'layers.sys.colors.surface-container-high',
                borderBottom: '1px solid layers.sys.colors.outline-variant',
                transition: `background-color ${layers.motion.duration.short1} ${layers.motion.easing.standard}`}}>
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: layers.ref.spacing['4'],
                    minWidth: 0,
                    flex: 1}}>
                    <div style={{width: ref.spacing[48],
                        height: ref.spacing[48],
                        borderRadius: 'layers.ref.shape.corner.large',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: variant === 'primary' 
                            ? 'layers.sys.colors.primary-container' 
                            : variant === 'secondary' 
                            ? 'layers.sys.colors.secondary-container' 
                            : variant === 'tertiary' 
                            ? 'layers.sys.colors.tertiary-container' 
                            : 'layers.sys.colors.surface-container-high',
                        color: variant === 'primary' 
                            ? 'layers.sys.colors.on-primary-container' 
                            : variant === 'secondary' 
                            ? 'layers.sys.colors.on-secondary-container' 
                            : variant === 'tertiary' 
                            ? 'layers.sys.colors.on-tertiary-container' 
                            : 'layers.sys.colors.on-surface-variant',
                        boxShadow: 'layers.sys.elevation.level1'}}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: ref.spacing[24]
                        }}>{icon}</span>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <M3Typography variant="title-large" style={{color: 'layers.sys.colors.on-surface',
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: '-0.025em'}}>{title}</M3Typography>
                        {subtitle && <M3Typography variant="body-small" style={{color: 'layers.sys.colors.on-surface-variant',
                            margin: 0,
                            opacity: 0.7}}>{subtitle}</M3Typography>}
                    </div>
                </div>
                <span style={{fontFamily: 'Material Symbols Outlined',
                    color: 'layers.sys.colors.on-surface-variant',
                    fontSize: ref.spacing[20],
                    transition: `transform ${layers.motion.duration.short1} ${layers.motion.easing.standard}`,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>expand_more</span>
            </summary>
            <div 
                style={{padding: layers.ref.spacing['6'],
                    paddingTop: layers.ref.spacing['2'],
                    borderTop: '1px solid layers.sys.colors.outline-variant',
                    animation: 'fadeInSlideDown 0.3s ease-out',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    opacity: isOpen ? 1 : 0,
                    maxHeight: isOpen ? 'none' : '0',
                    overflow: 'hidden',
                    transition: `all ${layers.motion.duration.short1} ${layers.motion.easing.standard}`}}
                aria-hidden={!isOpen}
            >
                {children}
            </div>
        </details>
    );
};

const Settings: React.FC<SettingsProps> = (props) => {
        const { layers } = useTheme();
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
            height: '100vh',
            backgroundColor: 'layers.sys.colors.surface',
            overflow: 'hidden'}}>
            <div style={{display: 'flex',
                alignItems: 'center',
                padding: `${layers.ref.spacing['4']} ${layers.ref.spacing['6']}`,
                backgroundColor: 'layers.sys.colors.surface-container-low',
                borderBottom: '1px solid layers.sys.colors.outline-variant',
                backdropFilter: 'blur(20px)'}}>
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: layers.ref.spacing['4'],
                    flex: 1}}>
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

            <div style={{flex: 1,
                overflowY: 'auto',
                padding: layers.ref.spacing['6'],
                display: 'flex',
                flexDirection: 'column',
                gap: layers.ref.spacing['6']}}>

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
                        style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['6'],
                            padding: layers.ref.spacing['6'],
                            borderRadius: 'layers.ref.shape.corner.large',
                            background: 'layers.sys.colors.surface-container-low',
                            boxShadow: 'layers.sys.elevation.level1'}}
                    >
                        <M3Typography variant="label-large" style={{color: 'layers.sys.colors.on-surface', fontWeight: 900, marginBottom: layers.ref.spacing['2']}}>
                            Interfaccia & Esperienza Visiva
                        </M3Typography>
                        <M3Typography variant="body-small" style={{color: 'layers.sys.colors.on-surface-variant', marginBottom: layers.ref.spacing['4'], opacity: 0.8}}>
                            Personalizza l'aspetto e il comportamento dell'app
                        </M3Typography>
                        {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['4']}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[20],
                                    color: 'layers.sys.colors.primary'}}>dashboard_customize</span>
                                <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
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
                            <M3Typography variant="body-medium" style={{color: 'layers.sys.colors.on-surface-variant',
                                margin: 0}}>
                                {localSettings.uiMode === 'flow'
                                    ? 'Modalità Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.'
                                    : 'Modalità Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                            </M3Typography>
                        </div>

                        {/* SEZIONE 2: ECOISTEMA VISIVO */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['4']}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[20],
                                    color: 'layers.sys.colors.primary'}}>auto_awesome</span>
                                <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Ecosistema Visivo</M3Typography>
                            </div>
                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: layers.ref.spacing['3']}}>
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
                                            gap: layers.ref.spacing['2'],
                                            padding: layers.ref.spacing['4'],
                                            borderRadius: 'layers.ref.shape.corner.large',
                                            border: themeState.visualStyle === style.id
                                                ? '2px solid layers.sys.colors.primary'
                                                : '1px solid layers.sys.colors.outline-variant',
                                            backgroundColor: themeState.visualStyle === style.id
                                                ? 'layers.sys.colors.primary-container'
                                                : 'layers.sys.colors.surface-container-high',
                                            cursor: 'pointer',
                                            transition: `all ${layers.motion.duration.short1} ${layers.motion.easing.standard}`,
                                            textAlign: 'center'}}
                                        onMouseEnter={(e) => {
                                            if (themeState.visualStyle !== style.id) {
                                                e.currentTarget// removed runtime mutation
                                                e.currentTarget// removed runtime mutation
                                            }
                                        } }
                                        onMouseLeave={(e) => {
                                            if (themeState.visualStyle !== style.id) {
                                                e.currentTarget// removed runtime mutation
                                                e.currentTarget// removed runtime mutation
                                            }
                                        } }
                                    >
                                        <span style={{fontFamily: 'Material Symbols Outlined',
                                            fontSize: ref.spacing[24],
                                            color: themeState.visualStyle === style.id
                                                ? 'layers.sys.colors.on-primary-container'
                                                : 'layers.sys.colors.on-surface-variant'}}>{style.icon}</span>
                                        <M3Typography variant="label-medium" style={{color: themeState.visualStyle === style.id
                                                ? 'layers.sys.colors.on-primary-container'
                                                : 'layers.sys.colors.on-surface',
                                            fontWeight: themeState.visualStyle === style.id ? 600 : 500,
                                            margin: 0}}>{style.label}</M3Typography>
                                        <M3Typography variant="body-small" style={{color: themeState.visualStyle === style.id
                                                ? 'layers.sys.colors.on-primary-container'
                                                : 'layers.sys.colors.on-surface-variant',
                                            margin: 0,
                                            opacity: 0.8}}>{style.desc}</M3Typography>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SEZIONE 3: TEMA E COLORI */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['4']}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[20],
                                    color: 'layers.sys.colors.primary'}}>palette</span>
                                <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Tema & Colori</M3Typography>
                            </div>

                            <div style={{marginBottom: layers.ref.spacing['4']}}>
                                <TabGroup
                                    tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                                    activeTab={themeState.mode}
                                    onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                                    variant="primary" />
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: layers.ref.spacing['3'],
                                marginBottom: layers.ref.spacing['6']}}>
                                {THEME_CUSTOMIZATIONS.map(theme => (
                                    <ThemeBubble
                                        key={theme.name}
                                        name={theme.name}
                                        colors={{
                                            primary: theme.colors.primary ?? 'var(--md-sys-color-primary)',
                                            secondary: theme.colors.secondary ?? 'var(--md-sys-color-secondary)',
                                            tertiary: theme.colors.tertiary ?? 'var(--sys-tertiary)'
                                        }}
                                        isSelected={themeState.customizationName === theme.name}
                                        onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })} />
                                ))}
                            </div>

                            <div style={{borderTop: '1px solid layers.sys.colors.outline-variant',
                                paddingTop: layers.ref.spacing['6']}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: layers.ref.spacing['4'],
                                    marginBottom: layers.ref.spacing['4']}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[16],
                                        color: 'layers.sys.colors.primary'}}>magic_button</span>
                                    <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em'}}>Generatore AI</M3Typography>
                                </div>
                                <div style={{display: 'flex',
                                    gap: layers.ref.spacing['4'],
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
                                            width: layers.ref.spacing['12'],
                                            height: layers.ref.spacing['12'],
                                            padding: '0',
                                            boxShadow: 'layers.sys.elevation.level2',
                                            borderRadius: 'layers.ref.shape.corner.large'}}
                                    >
                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                                    </M3Button>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 4: PARAMETRI AVANZATI */}
                        <div style={{marginTop: layers.ref.spacing['6'],
                            padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3'],
                                marginBottom: layers.ref.spacing['4'],
                                paddingBottom: layers.ref.spacing['3'],
                                borderBottom: '1px solid layers.sys.colors.outline-variant'}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[24],
                                    color: 'layers.sys.colors.primary'}}>tune</span>
                                <M3Typography
                                    variant="label-small"
                                    style={{color: 'layers.sys.colors.primary',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'}}
                                >
                                    Parametri Strutturali
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: layers.ref.spacing['4']}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: layers.ref.spacing['2']}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Intensità Blur Vetro
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'layers.sys.colors.on-surface-variant',
                                                fontWeight: 600}}
                                        >
                                            {themeState.glassBlur || 30}px
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        value={themeState.glassBlur || 30}
                                        onChange={e => handleThemeChange('glassBlur', parseInt(e.target.value))}
                                        style={{width: '100%',
                                            height: ref.spacing[4],
                                            borderRadius: ref.spacing[2],
                                            backgroundColor: 'layers.sys.colors.outline-variant',
                                            outline: 'none',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: layers.ref.spacing['2']}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Scala Font
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'layers.sys.colors.on-surface-variant',
                                                fontWeight: 600}}
                                        >
                                            {themeState.fontScale || 1}x
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="0.8" max="1.4" step="0.1"
                                        value={themeState.fontScale || 1}
                                        onChange={e => handleThemeChange('fontScale', parseFloat(e.target.value))}
                                        style={{width: '100%',
                                            height: ref.spacing[4],
                                            borderRadius: ref.spacing[2],
                                            backgroundColor: 'layers.sys.colors.outline-variant',
                                            outline: 'none',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: layers.ref.spacing['2']}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Livello Contrasto
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'layers.sys.colors.on-surface-variant',
                                                fontWeight: 600}}
                                        >
                                            {themeState.contrastLevel || 0}
                                        </M3Typography>
                                    </div>
                                    <input
                                        type="range" min="-50" max="50" step="5"
                                        value={themeState.contrastLevel || 0}
                                        onChange={e => handleThemeChange('contrastLevel', parseInt(e.target.value))}
                                        style={{width: '100%',
                                            height: ref.spacing[4],
                                            borderRadius: ref.spacing[2],
                                            backgroundColor: 'layers.sys.colors.outline-variant',
                                            outline: 'none',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'}} />
                                </div>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: layers.ref.spacing['2']}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Arrotondamento Bordi
                                        </M3Typography>
                                        <M3Typography
                                            variant="body-small"
                                            style={{color: 'layers.sys.colors.on-surface-variant',
                                                fontWeight: 600}}
                                        >
                                            x{themeState.radiusMultiplier || 1}
                                        </M3Typography>
                                    </div>
                                    <div style={{display: 'flex',
                                        gap: layers.ref.spacing['2'],
                                        flexWrap: 'wrap'}}>
                                        {[0.5, 1, 1.5, 2].map(m => (
                                            <M3Button
                                                key={m}
                                                variant={themeState.radiusMultiplier === m ? 'filled' : 'outlined'}
                                                size="small"
                                                onClick={() => handleThemeChange('radiusMultiplier', m)}
                                                style={{
                                                    minWidth: ref.spacing[80]
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
                        <div style={{marginTop: layers.ref.spacing['6'],
                            padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3'],
                                marginBottom: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[24],
                                    color: 'layers.sys.colors.primary'}}>import_export</span>
                                <M3Typography
                                    variant="label-small"
                                    style={{color: 'layers.sys.colors.primary',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'}}
                                >
                                    Backup Tema
                                </M3Typography>
                            </div>
                            <M3Typography
                                variant="body-medium"
                                style={{color: 'layers.sys.colors.on-surface-variant',
                                    marginBottom: layers.ref.spacing['4'],
                                    lineHeight: 1.5}}
                            >
                                Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.
                            </M3Typography>
                            <div style={{display: 'flex',
                                gap: layers.ref.spacing['3'],
                                alignItems: 'center'}}>
                                <M3Button
                                    onClick={handleExportTheme}
                                    variant="outlined"
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        marginRight: layers.ref.spacing['2'],
                                        fontSize: ref.spacing[18]}}>download</span>
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
                                                marginRight: layers.ref.spacing['2'],
                                                fontSize: ref.spacing[18]}}>upload</span>
                                            IMPORTA TEMA
                                        </M3Button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 5: MANUTENZIONE BRAND */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['3']}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[20],
                                    color: 'layers.sys.colors.primary'}}>refresh</span>
                                <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>Manutenzione Brand</M3Typography>
                            </div>
                            <M3Typography variant="body-medium" style={{color: 'layers.sys.colors.on-surface-variant',
                                margin: 0}}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</M3Typography>
                            <M3Button
                                onClick={handleForceRefresh}
                                variant="tonal"
                            >
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    marginRight: layers.ref.spacing['2']}}>cached</span>
                                AGGIORNA BRAND E CACHE
                            </M3Button>
                        </div>

                        {/* SEZIONE 7: M3 THEME SETTINGS PANEL */}
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['3']}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[20],
                                    color: 'layers.sys.colors.primary'}}>tune</span>
                                <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'}}>M3 Theme Panel</M3Typography>
                            </div>
                            <M3Typography variant="body-medium" style={{color: 'layers.sys.colors.on-surface-variant',
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
                            gap: layers.ref.spacing['4'],
                            padding: layers.ref.spacing['6'],
                            borderRadius: 'layers.ref.shape.corner.large',
                            background: 'layers.sys.colors.surface-container-low',
                            boxShadow: 'layers.sys.elevation.level1'}}
                    >
                        <M3Typography variant="label-large" style={{color: 'layers.sys.colors.on-surface', fontWeight: 900, marginBottom: layers.ref.spacing['2']}}>
                            Profilo & Identità
                        </M3Typography>
                        <M3Typography variant="body-small" style={{color: 'layers.sys.colors.on-surface-variant', marginBottom: layers.ref.spacing['4'], opacity: 0.8}}>
                            Dati docente e istituto
                        </M3Typography>
                        <div style={{display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: layers.ref.spacing['4']}}>
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </div>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div style={{display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: layers.ref.spacing['4']}}>
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
                    <div style={{marginBottom: layers.ref.spacing['6'],
                        padding: layers.ref.spacing['4'],
                        backgroundColor: 'layers.sys.colors.surface-container',
                        borderRadius: 'layers.ref.shape.corner.large',
                        border: '1px solid layers.sys.colors.outline-variant'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['3'],
                            marginBottom: layers.ref.spacing['4']}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.spacing[24],
                                color: 'layers.sys.colors.secondary'}}>smart_toy</span>
                            <M3Typography
                                variant="label-small"
                                style={{color: 'layers.sys.colors.secondary',
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
                            gap: 'var(--md-sys-spacing-3)',
                            padding: 'var(--md-sys-spacing-3)',
                            backgroundColor: currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary-container)'
                                : 'var(--md-sys-color-primary-container)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            border: `1px solid ${currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-secondary)'
                                : 'var(--md-sys-color-primary)'}`
                        }}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.spacing[20],
                                color: currentAiProfile === 'esperto'
                                    ? 'layers.sys.colors.on-secondary-container'
                                    : 'layers.sys.colors.on-primary-container',
                                marginTop: ref.spacing[2]}}>info</span>
                            <M3Typography
                                variant="body-medium"
                                style={{color: currentAiProfile === 'esperto'
                                        ? 'layers.sys.colors.on-secondary-container'
                                        : 'layers.sys.colors.on-primary-container',
                                    lineHeight: 1.5,
                                    margin: 0}}
                            >
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </M3Typography>
                        </div>
                    </div>

                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: layers.ref.spacing['4']}}>
                        {/* SEZIONE 2: ANNO SCOLASTICO */}
                        <div style={{padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: layers.ref.spacing['4']}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: layers.ref.spacing['3']}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[24],
                                        color: 'layers.sys.colors.primary'}}>calendar_month</span>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'layers.sys.colors.on-surface',
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
                                        fontSize: ref.spacing[18],
                                        marginRight: layers.ref.spacing['2']}}>add_circle</span>
                                    Aggiungi
                                </M3Button>
                            </div>

                            <div style={{display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: layers.ref.spacing['4']}}>
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
                        <div style={{padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: layers.ref.spacing['4']}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: layers.ref.spacing['3']}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[24],
                                        color: 'layers.sys.colors.secondary'}}>school</span>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'layers.sys.colors.on-surface',
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
                            <div style={{marginTop: layers.ref.spacing['6'],
                                padding: layers.ref.spacing['4'],
                                backgroundColor: 'layers.sys.colors.surface-container',
                                borderRadius: 'layers.ref.shape.corner.large',
                                border: '1px solid layers.sys.colors.outline-variant'}}>
                                <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: layers.ref.spacing['3'],
                                    marginBottom: layers.ref.spacing['4']}}>
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[24],
                                        color: 'layers.sys.colors.primary'}}>account_tree</span>
                                    <M3Typography
                                        variant="label-small"
                                        style={{color: 'layers.sys.colors.primary',
                                            fontWeight: 900,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'}}
                                    >
                                        Formazione Classi Strutturata
                                    </M3Typography>
                                </div>

                                <div style={{display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: layers.ref.spacing['4'],
                                    marginBottom: layers.ref.spacing['4']}}>
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
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: layers.ref.spacing['4'],
                                    marginBottom: layers.ref.spacing['4']}}>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: layers.ref.spacing['2']}}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Livelli / Anni
                                        </M3Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: layers.ref.spacing['2']}}>
                                            {['1', '2', '3', '4', '5'].map(y => (
                                                <M3Button
                                                    key={y}
                                                    variant={selYears.includes(y) ? 'filled' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                                    style={{
                                                        minWidth: ref.spacing[60]
                                                    }}
                                                >
                                                    {y}° Anno
                                                </M3Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{display: 'flex',
                                        flexDirection: 'column',
                                        gap: layers.ref.spacing['2']}}>
                                        <M3Typography
                                            variant="body-medium"
                                            style={{color: 'layers.sys.colors.on-surface',
                                                fontWeight: 500}}
                                        >
                                            Sezioni
                                        </M3Typography>
                                        <div style={{display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: layers.ref.spacing['2']}}>
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                                <M3Button
                                                    key={s}
                                                    variant={selSections.includes(s) ? 'filled' : 'outlined'}
                                                    size="small"
                                                    onClick={() => setSelSections(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                                    style={{
                                                        minWidth: ref.spacing[50]
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
                                        marginRight: layers.ref.spacing['2'],
                                        fontSize: ref.spacing[18]}}>auto_awesome</span>
                                    Genera Combinazioni Classi
                                </M3Button>
                            </div>

                            {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                            <div style={{marginTop: layers.ref.spacing['6'],
                                padding: layers.ref.spacing['4'],
                                backgroundColor: 'layers.sys.colors.surface-container',
                                borderRadius: 'layers.ref.shape.corner.large',
                                border: '1px solid layers.sys.colors.outline-variant'}}>
                                <div style={{display: 'flex',
                                    gap: layers.ref.spacing['3'],
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
                                            style={{width: '100%',
                                                padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                                                borderRadius: 'layers.ref.shape.corner.medium',
                                                border: '1px solid layers.sys.colors.outline',
                                                backgroundColor: 'layers.sys.colors.surface-container-high',
                                                color: 'layers.sys.colors.on-surface',
                                                fontSize: ref.spacing[14],
                                                outline: 'none',
                                                transition: `border-color ${layers.motion.duration.short1} ${layers.motion.easing.standard}`}}
                                            onFocus={(e) => {
                                                e.target// removed runtime mutation
                                            } }
                                            onBlur={(e) => {
                                                e.target// removed runtime mutation
                                            } } />
                                    </div>
                                    <M3Button
                                        onClick={handleAddSubject}
                                        variant="filled"
                                    >
                                        <span style={{
                                            fontFamily: 'Material Symbols Outlined',
                                            fontSize: ref.spacing[18]
                                        }}>add</span>
                                    </M3Button>
                                </div>
                            </div>

                            {/* MATRICE INTERATTIVA */}
                            <div style={{marginTop: layers.ref.spacing['6'],
                                padding: layers.ref.spacing['4'],
                                backgroundColor: 'layers.sys.colors.surface-container',
                                borderRadius: 'layers.ref.shape.corner.large',
                                border: '1px solid layers.sys.colors.outline-variant',
                                overflowX: 'auto'}}>
                                <table style={{width: '100%',
                                    borderCollapse: 'collapse',
                                    backgroundColor: 'layers.sys.colors.surface',
                                    borderRadius: 'layers.ref.shape.corner.medium',
                                    overflow: 'hidden'}}>
                                    <thead>
                                        <tr style={{backgroundColor: 'layers.sys.colors.surface-container-high'}}>
                                            <th style={{padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                                                textAlign: 'left',
                                                fontWeight: 600,
                                                color: 'layers.sys.colors.on-surface',
                                                borderBottom: '1px solid layers.sys.colors.outline-variant',
                                                fontSize: ref.spacing[14]}}>Materia / Classe</th>
                                            {localSettings.classi.map(cls => (
                                                <th key={cls} style={{padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    color: 'layers.sys.colors.on-surface',
                                                    borderBottom: '1px solid layers.sys.colors.outline-variant',
                                                    borderLeft: '1px solid layers.sys.colors.outline-variant',
                                                    fontSize: ref.spacing[14],
                                                    position: 'relative'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: layers.ref.spacing['2']}}>
                                                        <span>{cls}</span>
                                                        <button
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            style={{background: 'none',
                                                                border: 'none',
                                                                color: 'layers.sys.colors.error',
                                                                cursor: 'pointer',
                                                                fontSize: ref.spacing[16],
                                                                padding: layers.ref.spacing['1'],
                                                                borderRadius: 'layers.ref.shape.corner.small',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: ref.spacing[20],
                                                                height: ref.spacing[20]}}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget// removed runtime mutation
                                                            } }
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget// removed runtime mutation
                                                            } }
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
                                            <tr key={subj} style={{borderBottom: '1px solid layers.sys.colors.outline-variant'}}>
                                                <td style={{padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                                                    backgroundColor: 'layers.sys.colors.surface-container-high',
                                                    borderRight: '1px solid layers.sys.colors.outline-variant'}}>
                                                    <div style={{display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: layers.ref.spacing['2']}}>
                                                        <div style={{display: 'flex',
                                                            alignItems: 'center',
                                                            gap: layers.ref.spacing['2'],
                                                            flex: 1}}>
                                                            <span style={{fontWeight: 500,
                                                                color: 'layers.sys.colors.on-surface'}}>{subj}</span>
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
                                                                color: 'layers.sys.colors.error',
                                                                cursor: 'pointer',
                                                                padding: layers.ref.spacing['2'],
                                                                borderRadius: 'layers.ref.shape.corner.small'}}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget// removed runtime mutation
                                                            } }
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget// removed runtime mutation
                                                            } }
                                                        >
                                                            <span style={{
                                                                fontFamily: 'Material Symbols Outlined',
                                                                fontSize: ref.spacing[16]
                                                            }}>delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <td key={`${subj}-${cls}`} style={{padding: layers.ref.spacing['2'],
                                                            textAlign: 'center',
                                                            borderLeft: '1px solid layers.sys.colors.outline-variant',
                                                            cursor: 'pointer'}}>
                                                            <div
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    padding: 'var(--md-sys-spacing-2)',
                                                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                    backgroundColor: assignment ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                                                                    border: `1px solid ${assignment ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                                    transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                                                    minHeight: ref.spacing[40]
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (!assignment) {
                                                                        e.currentTarget// removed runtime mutation
                                                                    }
                                                                } }
                                                                onMouseLeave={(e) => {
                                                                    if (!assignment) {
                                                                        e.currentTarget// removed runtime mutation
                                                                    }
                                                                } }
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <span style={{fontFamily: 'Material Symbols Outlined',
                                                                            color: 'layers.sys.colors.primary',
                                                                            fontSize: ref.spacing[18],
                                                                            marginRight: layers.ref.spacing['2']}}>check_circle</span>
                                                                        <div style={{display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: layers.ref.spacing['1']}} onClick={e => e.stopPropagation()}>
                                                                            <input
                                                                                type="number"
                                                                                value={assignment.hoursPerWeek}
                                                                                onChange={e => updateAssignmentHours(assignment.classId, subj, parseInt(e.target.value) || 1)}
                                                                                style={{width: ref.spacing[50],
                                                                                    padding: '2px 4px',
                                                                                    border: '1px solid layers.sys.colors.outline',
                                                                                    borderRadius: 'layers.ref.shape.corner.small',
                                                                                    backgroundColor: 'layers.sys.colors.surface',
                                                                                    color: 'layers.sys.colors.on-surface',
                                                                                    fontSize: ref.spacing[12],
                                                                                    textAlign: 'center'}} />
                                                                            <span style={{fontSize: ref.spacing[12],
                                                                                color: 'layers.sys.colors.on-surface-variant'}}>h</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                                                        color: 'layers.sys.colors.outline-variant',
                                                                        fontSize: ref.spacing[18]}}>add</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        {localSettings.disciplines.length === 0 && (
                                            <tr>
                                                <td colSpan={localSettings.classi.length + 1} style={{padding: layers.ref.spacing['6'],
                                                    textAlign: 'center',
                                                    color: 'layers.sys.colors.on-surface-variant',
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
                        gap: layers.ref.spacing['4']}}>
                        <M3Typography
                            variant="body-medium"
                            style={{color: 'layers.sys.colors.on-surface-variant',
                                lineHeight: 1.5}}
                        >
                            Qui puoi vedere i suggerimenti AI che hai ignorato e riattivarli se desideri.
                        </M3Typography>
                        {dismissedSuggestions.size === 0 ? (
                            <M3Typography
                                variant="body-medium"
                                style={{color: 'layers.sys.colors.on-surface-variant',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    padding: layers.ref.spacing['4'],
                                    backgroundColor: 'layers.sys.colors.surface-container',
                                    borderRadius: 'layers.ref.shape.corner.medium'}}
                            >
                                Nessun suggerimento ignorato.
                            </M3Typography>
                        ) : (
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: layers.ref.spacing['3']}}>
                                {Array.from(dismissedSuggestions).map((id) => (
                                    <div key={id} style={{display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: layers.ref.spacing['4'],
                                        backgroundColor: 'layers.sys.colors.surface-container',
                                        borderRadius: 'layers.ref.shape.corner.large',
                                        border: '1px solid layers.sys.colors.outline-variant'}}>
                                        <div style={{display: 'flex',
                                            flexDirection: 'column',
                                            gap: layers.ref.spacing['1']}}>
                                            <M3Typography
                                                variant="body-medium"
                                                style={{color: 'layers.sys.colors.on-surface',
                                                    fontWeight: 500}}
                                            >
                                                Suggerimento {id}
                                            </M3Typography>
                                            <M3Typography
                                                variant="body-small"
                                                style={{color: 'layers.sys.colors.on-surface-variant'}}
                                            >
                                                Ignorato in precedenza
                                            </M3Typography>
                                        </div>
                                        <M3Button
                                            onClick={() => onReactivateSuggestion(id)}
                                            variant="tonal"
                                        >
                                            <span style={{fontFamily: 'Material Symbols Outlined',
                                                fontSize: ref.spacing[18],
                                                marginRight: layers.ref.spacing['2']}}>refresh</span>
                                            Riattiva
                                        </M3Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{display: 'flex',
                            justifyContent: 'center',
                            paddingTop: layers.ref.spacing['4'],
                            borderTop: '1px solid layers.sys.colors.outline-variant'}}>
                            <M3Button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                } }
                                disabled={dismissedSuggestions.size === 0}
                                variant="text"
                                style={{width: '100%',
                                    padding: layers.ref.spacing['4'],
                                    borderRadius: 'layers.ref.shape.corner.medium',
                                    color: 'layers.sys.colors.primary',
                                    backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => {
                                    e.currentTarget// removed runtime mutation
                                } }
                                onMouseLeave={(e) => {
                                    e.currentTarget// removed runtime mutation
                                } }
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
                        <div style={{marginBottom: layers.ref.spacing['6'],
                            padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: layers.ref.spacing['3']}}>
                                <M3Typography
                                    variant="label-large"
                                    style={{color: 'layers.sys.colors.on-surface',
                                        fontWeight: 600}}
                                >
                                    Storage Dispositivo
                                </M3Typography>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'layers.sys.colors.on-surface-variant',
                                        fontWeight: 500}}
                                >
                                    {storageInfo.used}MB / {storageInfo.total}MB
                                </M3Typography>
                            </div>
                            <div style={{width: '100%',
                                height: ref.spacing[8],
                                backgroundColor: 'layers.sys.colors.surface-container-high',
                                borderRadius: ref.spacing[4],
                                overflow: 'hidden',
                                marginBottom: layers.ref.spacing['2']}}>
                                <div style={{
                                    width: `${storageInfo.percent}%`,
                                    height: '100%',
                                    backgroundColor: storageInfo.percent > 80 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)',
                                    borderRadius: ref.spacing[4],
                                    transition: 'width var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'
                                }}></div>
                            </div>
                            <M3Typography
                                variant="body-small"
                                style={{color: 'layers.sys.colors.on-surface-variant'}}
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
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: driveState.isAuthenticated ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: `1px solid ${driveState.isAuthenticated ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--md-sys-spacing-4)'
                    }}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['4']}}>
                            <div style={{width: ref.spacing[48],
                                height: ref.spacing[48],
                                borderRadius: 'layers.ref.shape.corner.large',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: driveState.isAuthenticated ? 'layers.sys.colors.primary' : 'layers.sys.colors.surface-container-high',
                                color: driveState.isAuthenticated ? 'layers.sys.colors.on-primary' : 'layers.sys.colors.on-surface-variant'}}>
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[24]
                                }}>{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: layers.ref.spacing['1']}}>
                                <M3Typography
                                    variant="label-large"
                                    style={{color: 'layers.sys.colors.on-surface',
                                        fontWeight: 600}}
                                >
                                    {driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'layers.sys.colors.on-surface-variant'}}
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
                                    fontSize: ref.spacing[18],
                                    marginRight: layers.ref.spacing['2']}}>{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: layers.ref.spacing['3'],
                        marginTop: layers.ref.spacing['4']}}>
                        <M3Button onClick={onExportData} variant="tonal">
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.spacing[18],
                                marginRight: layers.ref.spacing['2']}}>download</span>
                            Backup Locale
                        </M3Button>
                        <M3Button onClick={() => fileInputRef.current?.click()} variant="tonal">
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.spacing[18],
                                marginRight: layers.ref.spacing['2']}}>upload</span>
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
                        gap: layers.ref.spacing['4']}}>
                        <div style={{padding: layers.ref.spacing['4'],
                            backgroundColor: 'layers.sys.colors.surface-container',
                            borderRadius: 'layers.ref.shape.corner.large',
                            border: '1px solid layers.sys.colors.outline-variant'}}>
                            <div style={{display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: layers.ref.spacing['4']}}>
                                <div style={{display: 'flex',
                                    flexDirection: 'column',
                                    gap: layers.ref.spacing['1']}}>
                                    <M3Typography
                                        variant="label-large"
                                        style={{color: 'layers.sys.colors.on-surface',
                                            fontWeight: 600}}
                                    >
                                        Log degli Errori
                                    </M3Typography>
                                    <M3Typography
                                        variant="body-medium"
                                        style={{color: 'layers.sys.colors.on-surface-variant'}}
                                    >
                                        Visualizza tutti gli errori registrati durante l'utilizzo dell'app
                                    </M3Typography>
                                </div>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.spacing[24],
                                color: errorLogger.getErrorStats().total > 0 ? 'layers.sys.colors.error' : 'layers.sys.colors.primary'}}>{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</span>
                            </div>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['3'],
                                padding: layers.ref.spacing['4'],
                                backgroundColor: 'layers.sys.colors.surface-container-low',
                                borderRadius: 'layers.ref.shape.corner.medium',
                                border: '1px solid layers.sys.colors.outline-variant',
                                marginBottom: layers.ref.spacing['4']}}>
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: ref.spacing[18],
                                    color: 'layers.sys.colors.primary'}}>info</span>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'layers.sys.colors.on-surface-variant'}}
                                >
                                    {errorLogger.getErrorStats().total} log registrati
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: layers.ref.spacing['3']}}>
                                <M3Button
                                    onClick={() => {
                                        showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                                    } }
                                    variant="tonal"
                                    style={{width: '100%',
                                        padding: layers.ref.spacing['4'],
                                        borderRadius: 'layers.ref.shape.corner.medium'}}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[18],
                                        marginRight: layers.ref.spacing['2']}}>terminal</span>
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
                                    style={{width: '100%',
                                        padding: layers.ref.spacing['4'],
                                        borderRadius: 'layers.ref.shape.corner.medium'}}
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[18],
                                        marginRight: layers.ref.spacing['2']}}>download</span>
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
                                    style={{width: '100%',
                                        padding: layers.ref.spacing['4'],
                                        borderRadius: 'layers.ref.shape.corner.medium',
                                        color: 'layers.sys.colors.error',
                                        backgroundColor: 'transparent'}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget// removed runtime mutation
                                    } }
                                    onMouseLeave={(e) => {
                                        e.currentTarget// removed runtime mutation
                                    } }
                                >
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        fontSize: ref.spacing[18],
                                        marginRight: layers.ref.spacing['2']}}>delete</span>
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
                    <div style={{padding: layers.ref.spacing['5'],
                        backgroundColor: 'color-mix(in srgb, layers.sys.colors.surface-container-low 50%, transparent)',
                        borderRadius: 'layers.ref.shape.corner.large',
                        border: '1px solid color-mix(in srgb, layers.sys.colors.outline-variant 20%, transparent)',
                        marginBottom: layers.ref.spacing['6'],
                        boxShadow: 'layers.sys.elevation.level1'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['8'],
                            marginBottom: layers.ref.spacing['5']}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                color: 'layers.sys.colors.primary',
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>key</span>
                            <M3Typography variant="label-small" style={{color: 'layers.sys.colors.primary',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Google Cloud API</M3Typography>
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: layers.ref.spacing['5']}}>
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} leadingIcon="badge" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} leadingIcon="lock" />
                        </div>
                    </div>
                    <div style={{padding: layers.ref.spacing['6'],
                        backgroundColor: 'color-mix(in srgb, layers.sys.colors.error-container 10%, transparent)',
                        borderRadius: 'layers.ref.shape.corner.extra-large',
                        border: '1px solid color-mix(in srgb, layers.sys.colors.error 20%, transparent)',
                        boxShadow: 'layers.sys.elevation.level1'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['8'],
                            marginBottom: layers.ref.spacing['8']}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                color: 'layers.sys.colors.error',
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>warning</span>
                            <M3Typography variant="label-small" style={{color: 'layers.sys.colors.error',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Zona Pericolo</M3Typography>
                        </div>
                        <M3Button
                            onClick={() => setIsResetModalOpen(true)}
                            variant="filled"
                            style={{width: '100%',
                                padding: layers.ref.spacing['6'],
                                borderRadius: 'layers.ref.shape.corner.large',
                                fontWeight: '900',
                                fontSize: 'var(--md-sys-typescale-label-small-size)',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)',
                                boxShadow: 'layers.sys.elevation.level2',
                                backgroundColor: 'layers.sys.colors.error',
                                color: 'layers.sys.colors.on-error'}}
                        >
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                marginRight: layers.ref.spacing['2'],
                                fontSize: 'var(--md-sys-typescale-label-large-size)'}}>delete_forever</span>
                            Reset Totale Dati
                        </M3Button>
                    </div>
                </SettingsGroup>

                <div style={{textAlign: 'center',
                    paddingTop: layers.ref.spacing['12'],
                    paddingBottom: layers.ref.spacing['4']}}>
                    <M3Typography variant="body-small" style={{color: 'color-mix(in srgb, layers.sys.colors.on-surface-variant 50%, transparent)',
                        opacity: 0.5}}>
                        DocenteDoc AI v4.0.8 • Stable
                        <div style={{paddingTop: layers.ref.spacing['3']}}>
                            <span style={{fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'}}>Owner:</span> Antonio Corsano
                            <span style={{display: 'block',
                                marginTop: layers.ref.spacing['4']}}>antonio.corsano@gmail.com</span>
                        </div>
                    </M3Typography>
                    <M3Button
                        onClick={onLogout}
                        variant="text"
                        style={{marginTop: layers.ref.spacing['6'],
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            height: layers.ref.spacing['10'],
                            fontSize: 'var(--md-sys-typescale-label-small-size)',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--md-sys-typescale-label-small-tracking)',
                            transition: 'all layers.motion.easing.standard layers.motion.duration.short2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}
                        onMouseEnter={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                    >
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-label-large-size)',
                            marginRight: layers.ref.spacing['2']}}>logout</span>
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


