
import React, { useRef, useState, useEffect } from 'react';
import { SettingsProps } from '../types';
import { THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS } from '../constants';
import { generateNextSchoolYear } from '../utils/schoolUtils';
import { 
    TextField, 
    SelectField, 
    TabGroup, 
    SectionHeader, 
    M3Button, 
    InfoCard 
} from './ui';
import ThemeBubble from './ThemeBubble';
import ChipInputList from './ChipInputList';
import ResetConfirmModal from './ResetConfirmModal';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { errorLogger } from '../services/errorLogger';

interface SettingsGroupProps {
    id: string;
    title: string;
    icon: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({
    id, title, icon, subtitle, children, defaultOpen = false,
    variant = 'surface'
}) => {
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
        <details className={`settings-card bg-surface-container-low/40 backdrop-blur-md border border-outline-variant/20 rounded-3xl overflow-hidden group transition-all duration-300 ${isOpen ? 'shadow-lg' : 'shadow-sm'}`} open={isOpen}>
            <summary onClick={handleToggle} className="settings-summary flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-high/40 transition-colors list-none">
                <div className="flex items-center gap-8 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${variant === 'primary' ? 'bg-primary/10 text-primary' : variant === 'secondary' ? 'bg-secondary/10 text-secondary' : variant === 'tertiary' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-black text-on-surface tracking-tight">{title}</h3>
                        {subtitle && <p className="text-xs text-on-surface-variant opacity-70">{subtitle}</p>}
                    </div>
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </summary>
            <div 
                className="settings-content p-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-outline-variant/10"
                inert={!isOpen ? true : undefined}
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
        }).catch(errorLogger);
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
            showToast("Materia giÃ  presente", "info");
            return;
        }
        handleChange('disciplines', [...localSettings.disciplines, newSubjectName.trim()]);
        setNewSubjectName('');
    };

    const handleForceRefresh = async () => {
        if (!confirm("Forzare l'aggiornamento del brand? L'app verrÃ  ricaricata per pulire i vecchi file temporanei. I tuoi dati sono al sicuro.")) return;
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
        if (file) onImportData(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="page-layout max-w-full mx-auto w-full px-4 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8">
                    <M3Button onClick={onClose} variant="text" className="!min-w-0 !p-8">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </M3Button>
                    <SectionHeader 
                        title="Impostazioni" 
                        subtitle="Configura il tuo profilo, l'AI e le preferenze dell'app."
                        icon="settings"
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto w-full space-y-6">

                <SettingsGroup id="interface_experience" title="Interfaccia & Esperienza Visiva" subtitle="Personalizza l'aspetto e il comportamento dell'app" icon="palette" variant="primary" defaultOpen={true}>
                    <div className="space-y-8">
                        {/* SEZIONE 1: MODALITÃ€ INTERFACCIA */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-center gap-8 mb-5">
                                <span className="material-symbols-outlined text-primary">dashboard_customize</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Modalità Interfaccia</h4>
                            </div>
                            <TabGroup
                                tabs={[
                                    { id: 'classic', label: 'Classica', icon: 'grid_view' },
                                    { id: 'flow', label: 'Dinamica (Flow)', icon: 'account_tree' }
                                ]}
                                activeTab={localSettings.uiMode || 'classic'}
                                onTabChange={(id) => handleChange('uiMode', id)}
                                variant="primary"
                                className="w-full"
                            />
                            <p className="m3-label-tiny text-on-surface-variant mt-3 opacity-70 px-4">
                                {localSettings.uiMode === 'flow' 
                                    ? 'ModalitÃ  Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.' 
                                    : 'ModalitÃ  Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                            </p>
                        </div>

                        {/* SEZIONE 2: ECOISTEMA VISIVO */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-center gap-8 mb-5">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Ecosistema Visivo</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                                        onClick={() => handleThemeChange({ visualStyle: style.id })}
                                        className={`flex flex-col items-center p-8 rounded-2xl border transition-all ${themeState.visualStyle === style.id ? 'bg-primary-container/40 border-primary shadow-sm' : 'bg-surface-container-highest/30 border-outline-variant/20 hover:bg-surface-container-highest/50'}`}
                                    >
                                        <span className={`material-symbols-outlined mb-8 ${themeState.visualStyle === style.id ? 'text-primary' : 'text-on-surface-variant'}`}>{style.icon}</span>
                                        <span className={`m3-label-tiny font-black uppercase tracking-wider ${themeState.visualStyle === style.id ? 'text-primary' : 'text-on-surface-variant'}`}>{style.label}</span>
                                        <span className="text-[8px] opacity-60 mt-4 text-center">{style.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SEZIONE 3: TEMA E COLORI */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-center gap-8 mb-5">
                                <span className="material-symbols-outlined text-primary">palette</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Tema & Colori</h4>
                            </div>
                            
                            <div className="mb-8">
                                <TabGroup
                                    tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                                    activeTab={themeState.mode}
                                    onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                                    variant="primary"
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                                {THEME_CUSTOMIZATIONS.map(theme => (
                                    <ThemeBubble
                                        key={theme.name}
                                        name={theme.name}
                                        colors={{
                                            primary: theme.colors.primary ?? 'var(--sys-primary)',
                                            secondary: theme.colors.secondary ?? 'var(--sys-secondary)',
                                            tertiary: theme.colors.tertiary ?? 'var(--sys-tertiary)'
                                        }}
                                        isSelected={themeState.customizationName === theme.name}
                                        onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })}
                                    />
                                ))}
                            </div>

                            <div className="border-t border-outline-variant/10 pt-6">
                                <div className="flex items-center gap-8 mb-8">
                                    <span className="material-symbols-outlined text-primary text-sm">magic_button</span>
                                    <label className="m3-label-tiny font-black uppercase tracking-widest text-primary block">Generatore AI</label>
                                </div>
                                <div className="flex gap-8">
                                    <div className="flex-grow">
                                        <TextField
                                            label="Descrivi il tuo stile"
                                            value={themePrompt}
                                            onChange={e => setThemePrompt(e.target.value)}
                                            placeholder="Es. 'Colori tramonto'..."
                                            containerClassName="!mb-0"
                                            leadingIcon="palette"
                                        />
                                    </div>
                                    <M3Button 
                                        onClick={handleGenerateThemeFromPrompt} 
                                        disabled={isGeneratingTheme || !themePrompt.trim()} 
                                        variant="filled"
                                        className="!min-w-0 !w-14 !h-14 !p-0 shadow-lg"
                                    >
                                        <span className="material-symbols-outlined">{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                                    </M3Button>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 4: PARAMETRI AVANZATI */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-center gap-8 mb-5">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Parametri Strutturali</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-on-surface">Intensità Blur Vetro</label>
                                        <span className="m3-label-tiny font-black text-primary">{themeState.glassBlur || 30}px</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" step="5" 
                                        value={themeState.glassBlur || 30} 
                                        onChange={e => handleThemeChange({ glassBlur: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-on-surface">Scala Font</label>
                                        <span className="m3-label-tiny font-black text-primary">{themeState.fontScale || 1}x</span>
                                    </div>
                                    <input 
                                        type="range" min="0.8" max="1.4" step="0.1" 
                                        value={themeState.fontScale || 1} 
                                        onChange={e => handleThemeChange({ fontScale: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-on-surface">Livello Contrasto</label>
                                        <span className="m3-label-tiny font-black text-primary">{themeState.contrastLevel || 0}</span>
                                    </div>
                                    <input 
                                        type="range" min="-50" max="50" step="5" 
                                        value={themeState.contrastLevel || 0} 
                                        onChange={e => handleThemeChange({ contrastLevel: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-on-surface">Arrotondamento Bordi</label>
                                        <span className="m3-label-tiny font-black text-primary">x{themeState.radiusMultiplier || 1}</span>
                                    </div>
                                    <div className="flex gap-8">
                                        {[0.5, 1, 1.5, 2].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => handleThemeChange({ radiusMultiplier: m })}
                                                className={`flex-1 py-4 rounded-xl m3-label-tiny font-black transition-all border ${themeState.radiusMultiplier === m ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-highest/50 text-on-surface-variant border-outline-variant/30'}`}
                                            >
                                                {m === 1 ? 'Standard' : `${m}x`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 6: EXPORT/IMPORT TEMA */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-center gap-8 mb-5">
                                <span className="material-symbols-outlined text-primary">import_export</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Backup Tema</h4>
                            </div>
                            <p className="m3-label-tiny text-on-surface-variant mb-6 opacity-70">Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.</p>
                            <div className="flex gap-4">
                                <M3Button 
                                    onClick={handleExportTheme} 
                                    variant="outlined"
                                    className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined mr-2">download</span>
                                    ESPORTA TEMA
                                </M3Button>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportTheme}
                                        className="hidden"
                                        id="theme-import"
                                    />
                                    <label htmlFor="theme-import">
                                        <M3Button 
                                            component="span"
                                            variant="outlined"
                                            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined mr-2">upload</span>
                                            IMPORTA TEMA
                                        </M3Button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 5: MANUTENZIONE BRAND */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
                            <div className="flex items-center gap-8 mb-8">
                                <span className="material-symbols-outlined text-primary">refresh</span>
                                <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Manutenzione Brand</h4>
                            </div>
                            <p className="m3-label-tiny text-on-surface-variant mb-8 opacity-70">Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</p>
                            <M3Button 
                                onClick={handleForceRefresh} 
                                variant="tonal"
                                className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                            >
                                <span className="material-symbols-outlined mr-2">cached</span>
                                AGGIORNA BRAND E CACHE
                            </M3Button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="profile" title="Profilo & IdentitÃ " subtitle="Dati docente e istituto" icon="badge" variant="surface">
                    <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </div>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TextField label="Nome Istituto" value={localSettings.nomeIstituto} onChange={e => handleChange('nomeIstituto', e.target.value)} />
                            <TextField label="CittÃ " value={localSettings.cittaIstituto} onChange={e => handleChange('cittaIstituto', e.target.value)} />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="ai_didattica" title="AI & Didattica" subtitle="Cervello AI e cattedra" icon="psychology" variant="secondary">
                    {/* SEZIONE 1: MODELLO AI */}
                    <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 mb-6">
                        <div className="flex items-center gap-8 mb-8">
                            <span className="material-symbols-outlined text-secondary">smart_toy</span>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-secondary">Modello Intelligenza</h4>
                        </div>
                        
                        <TabGroup
                            tabs={(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ id: key, label: AI_PROFILES[key].label, icon: AI_PROFILES[key].icon }))}
                            activeTab={currentAiProfile}
                            onTabChange={(id) => handleAiProfileChange(id as keyof typeof AI_PROFILES)}
                            variant="primary"
                            className="w-full"
                        />
                        
                        <div className={`mt-4 p-8 rounded-xl border flex items-start gap-6 transition-all duration-300 ${currentAiProfile === 'esperto' ? 'bg-primary-container/20 border-primary/30' : 'bg-tertiary-container/20 border-tertiary/30'}`}>
                            <span className={`material-symbols-outlined text-xl mt-0.5 ${currentAiProfile === 'esperto' ? 'text-primary' : 'text-tertiary'}`}>info</span>
                            <p className="m3-body-small leading-relaxed text-on-surface">
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* SEZIONE 2: ANNO SCOLASTICO */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-8">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    <h4 className="m3-label-large font-black uppercase tracking-wide text-on-surface">Anno Scolastico</h4>
                                </div>
                                <M3Button 
                                    onClick={handleAddNextYear} 
                                    variant="tonal"
                                    className="!px-4 !py-4 !h-auto text-xs font-black uppercase tracking-widest shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">add_circle</span>
                                    Aggiungi
                                </M3Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <SelectField 
                                    label="Anno Corrente" 
                                    value={localSettings.annoScolasticoCorrente} 
                                    onChange={e => handleChange('annoScolasticoCorrente', e.target.value)} 
                                    containerClassName="!mb-0"
                                >
                                    {localSettings.anniScolastici.map(year => <option key={year} value={year}>{year}</option>)}
                                </SelectField>
                                
                                <div className="pt-1">
                                    <ChipInputList 
                                        label="Storico Anni" 
                                        items={localSettings.anniScolastici} 
                                        onAdd={(item) => handleChange('anniScolastici', [...localSettings.anniScolastici, item])} 
                                        onRemove={(idx) => handleChange('anniScolastici', localSettings.anniScolastici.filter((_, i) => i !== idx))} 
                                        placeholder="Es: 2025/2026" 
                                        icon="history" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE 3: GESTIONE CATTEDRA UNIFICATA */}
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-8">
                                    <span className="material-symbols-outlined text-secondary">school</span>
                                    <h4 className="m3-label-large font-black uppercase tracking-wide text-on-surface">Gestione Cattedra</h4>
                                </div>
                                <div className="flex gap-8">
                                    <button 
                                        onClick={() => {
                                            if(confirm("Sei sicuro di voler svuotare tutta la cattedra?")) {
                                                handleChange('teachingAssignments', []);
                                            }
                                        }}
                                        className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline"
                                    >
                                        Svuota Tutto
                                    </button>
                                </div>
                            </div>

                            {/* FORMAZIONE CLASSI STRUTTURATA (NORMATIVA ITALIANA) */}
                            <div className="p-5 bg-primary-container/10 rounded-2xl border border-primary/20 mb-8 space-y-6">
                                <div className="flex items-center gap-8 mb-8">
                                    <span className="material-symbols-outlined text-primary">account_tree</span>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">Formazione Classi Strutturata</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                        placeholder="Es: Scientifico, CAT, Musicale..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Livelli / Anni</p>
                                        <div className="flex flex-wrap gap-8">
                                            {['1', '2', '3', '4', '5'].map(y => (
                                                <button
                                                    key={y}
                                                    onClick={() => setSelYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                                    className={`px-4 py-4 rounded-xl text-xs font-black transition-all border ${selYears.includes(y) ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-container-highest/50 text-on-surface-variant border-outline-variant/30'}`}
                                                >
                                                    {y}Â° Anno
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Sezioni</p>
                                        <div className="flex flex-wrap gap-8">
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelSections(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${selSections.includes(s) ? 'bg-secondary text-on-secondary border-secondary shadow-md' : 'bg-surface-container-highest/50 text-on-surface-variant border-outline-variant/30'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <M3Button 
                                    onClick={handleGenerateClasses}
                                    variant="filled"
                                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg"
                                    disabled={selYears.length === 0 || selSections.length === 0}
                                >
                                    <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                    Genera Combinazioni Classi
                                </M3Button>
                            </div>

                            {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                            <div className="grid grid-cols-1 gap-8 mb-8">
                                <div className="flex gap-8">
                                    <div className="flex-grow relative">
                                        <input 
                                            type="text" 
                                            placeholder="Aggiungi Materia Singola (es: Italiano)" 
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                                            className="w-full h-12 px-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 text-sm font-bold focus:ring-2 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <M3Button 
                                        onClick={handleAddSubject}
                                        variant="filled"
                                        className="!min-w-0 !w-12 !h-12 !p-0 shadow-sm !bg-secondary !text-on-secondary"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </M3Button>
                                </div>
                            </div>

                            {/* MATRICE INTERATTIVA */}
                            <div className="overflow-x-auto -mx-5 px-5 pb-4 custom-scrollbar">
                                <table className="w-full border-separate border-spacing-1">
                                    <thead>
                                        <tr>
                                            <th className="p-8 text-left text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Materia / Classe</th>
                                            {localSettings.classi.map(cls => (
                                                <th key={cls} className="p-8 min-w-[60px] text-center">
                                                    <div className="relative group">
                                                        <div className="text-xs font-black text-on-surface">{cls}</div>
                                                        <button 
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-error text-on-error text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        >
                                                            Ã—
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localSettings.disciplines.map(subj => (
                                            <tr key={subj}>
                                                <td style={{ padding: 'var(--md-sys-spacing-6)' }}>
                                                    <div className="flex items-center justify-between group">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{subj}</span>
                                                            <button 
                                                                onClick={() => handleBulkAssign(localSettings.classi, [subj])}
                                                                className="text-[8px] font-black text-primary uppercase tracking-tighter opacity-0 group-hover:opacity-100 hover:underline text-left"
                                                            >
                                                                Associa a tutte
                                                            </button>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                            className="w-6 h-6 rounded-lg bg-surface-container-highest/50 text-on-surface-variant text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-container hover:text-error"
                                                        >
                                                            <span className="material-symbols-outlined m3-icon-xs">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <td key={`${subj}-${cls}`} className="p-1">
                                                            <div 
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                className={`h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${assignment ? 'bg-primary-container/40 border-primary shadow-sm' : 'bg-surface-container-low/30 border-transparent hover:border-outline-variant/30'}`}
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                                                        <div className="flex items-center gap-4 mt-0.5" onClick={e => e.stopPropagation()}>
                                                                            <input 
                                                                                type="number" 
                                                                                value={assignment.hoursPerWeek}
                                                                                onChange={e => updateAssignmentHours(assignment.id, parseInt(e.target.value) || 1)}
                                                                                className="w-6 bg-transparent text-[10px] font-black text-primary text-center outline-none"
                                                                            />
                                                                            <span className="text-[8px] font-bold text-primary/60">h</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-on-surface-variant/20 text-sm">add</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        {localSettings.disciplines.length === 0 && (
                                            <tr>
                                                <td colSpan={localSettings.classi.length + 1} className="p-8 text-center italic text-on-surface-variant opacity-50 text-sm">
                                                    Aggiungi una materia per iniziare la configurazione...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <InfoCard 
                                title="Come funziona"
                                description="Questa matrice Ã¨ il tuo centro di controllo. Clicca su una cella per associare una materia a una classe. Modifica il numero per impostare le ore settimanali."
                                icon="info"
                                variant="primary"
                                className="mt-6 bg-primary-container/10 border-primary/20"
                            />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="ai_suggestions" title="Suggerimenti AI" subtitle="Gestisci suggerimenti ignorati" icon="lightbulb" variant="tertiary">
                    <div className="space-y-4">
                        <p className="text-sm text-on-surface-variant">
                            Qui puoi vedere i suggerimenti AI che hai ignorato e riattivarli se desideri.
                        </p>
                        {dismissedSuggestions.size === 0 ? (
                            <p className="text-sm text-on-surface-variant italic">
                                Nessun suggerimento ignorato.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {Array.from(dismissedSuggestions).map((id) => (
                                    <div key={id} className="p-8 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="m3-label-medium font-black text-on-surface">Suggerimento {id}</div>
                                            <div className="text-xs text-on-surface-variant">Ignorato in precedenza</div>
                                        </div>
                                        <M3Button
                                            onClick={() => onReactivateSuggestion(id)}
                                            variant="tonal"
                                            className="!px-4 !py-4 !h-auto text-xs font-black flex items-center gap-8"
                                        >
                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                            Riattiva
                                        </M3Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="pt-4 border-t border-outline-variant/10">
                            <M3Button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                }}
                                disabled={dismissedSuggestions.size === 0}
                                variant="text"
                                className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">history</span>
                                Riattiva Tutti i Suggerimenti
                            </M3Button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="cloud" title="Dati & Cloud" subtitle="Backup e Storage" icon="cloud_sync" variant="surface">
                    {storageInfo && (
                        <div className="mb-6 p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="m3-label-large font-black text-on-surface">Storage Dispositivo</h4>
                                <span className="text-xs font-mono font-bold text-primary">{storageInfo.used}MB / {storageInfo.total}MB</span>
                            </div>
                            <div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full ${storageInfo.percent > 80 ? 'bg-error' : 'bg-primary'} transition-all duration-1000`} style={{ width: `${storageInfo.percent}%` }}></div>
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-3 opacity-70">Dati salvati in IndexedDB (senza limiti LocalStorage).</p>
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
                                    variant="secondary"
                                    className="mb-6 bg-warning-container/20 border-warning/30"
                                />
                            );
                        }
                        return null;
                    })()}

                    <div className={`p-6 rounded-3xl border mb-6 flex items-center justify-between transition-all duration-500 ${driveState.isAuthenticated ? 'bg-primary-container/20 border-primary/30 shadow-md' : 'bg-surface-container-low/50 border-outline-variant/20 text-on-surface'}`}>
                        <div className="flex items-center gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${driveState.isAuthenticated ? 'bg-primary text-on-primary' : 'bg-surface-container-highest/50 text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined text-3xl">{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                            </div>
                            <div>
                                <h4 className="font-black m3-label-large uppercase tracking-widest">{driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}</h4>
                                <p className="text-[10px] font-bold opacity-60 mt-4 uppercase tracking-tighter">{driveState.lastSyncTime ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}` : 'Nessun backup cloud'}</p>
                            </div>
                        </div>
                        {driveState.isAuthenticated ? (
                            <M3Button 
                                onClick={() => onSyncToDrive()} 
                                disabled={driveState.isSyncing} 
                                variant="filled"
                                className="!px-6 !py-3 !h-auto font-black text-xs shadow-lg flex items-center gap-8"
                            >
                                <span className="material-symbols-outlined text-sm">{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
                                {driveState.isSyncing ? '...' : 'Salva'}
                            </M3Button>
                        ) : (
                            settings.googleClientId && (
                                <M3Button 
                                    onClick={onConnectDrive} 
                                    variant="filled"
                                    className="!px-6 !py-3 !h-auto font-black text-xs shadow-lg"
                                >
                                    Connetti
                                </M3Button>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <M3Button onClick={onExportData} variant="tonal" className="flex items-center justify-center gap-8 py-4 rounded-2xl font-black text-xs shadow-sm">
                            <span className="material-symbols-outlined text-base">download</span> 
                            Backup Locale
                        </M3Button>
                        <M3Button onClick={() => fileInputRef.current?.click()} variant="tonal" className="flex items-center justify-center gap-8 py-4 rounded-2xl font-black text-xs shadow-sm">
                            <span className="material-symbols-outlined text-base">upload</span> 
                            Ripristina File
                        </M3Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json,.csv,.xlsx,.xls" onChange={handleFileChange} />
                    </div>
                </SettingsGroup>

                <SettingsGroup id="debug_logging" title="Debug & Logging" subtitle="Visualizza e gestisci i log degli errori" icon="bug_report" variant="surface">
                    <div className="space-y-6">
                        <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 shadow-sm">
                            <div className="flex items-start justify-between gap-8 mb-8">
                                <div>
                                    <h4 className="m3-label-large font-black text-on-surface">Log degli Errori</h4>
                                    <p className="text-xs text-on-surface-variant mt-4">Visualizza tutti gli errori registrati durante l'utilizzo dell'app</p>
                                </div>
                                <span className={`material-symbols-outlined text-2xl ${errorLogger.getErrorStats().total > 0 ? 'text-error' : 'text-success'}`}>{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</span>
                            </div>
                            <div className="text-xs text-on-surface-variant mb-6 p-6 bg-surface-container-low/50 rounded-xl flex items-center gap-8 border border-outline-variant/10">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <span>{errorLogger.getErrorStats().total} log registrati</span>
                            </div>
                            <M3Button 
                                onClick={() => {
                                    showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                                }}
                                variant="tonal"
                                className="w-full py-4 rounded-xl font-black text-xs mb-6"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">terminal</span> Console Browser (F12)
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
                                }}
                                variant="tonal"
                                className="w-full py-4 rounded-xl font-black text-xs mb-6"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">download</span> Esporta JSON
                            </M3Button>
                            <M3Button 
                                onClick={() => {
                                    if (confirm('Sei sicuro di voler eliminare tutti i log?')) {
                                        errorLogger.clearAllLogs();
                                        showToast('Tutti i log sono stati eliminati', 'success');
                                    }
                                }}
                                variant="text"
                                className="w-full py-4 rounded-xl font-black text-xs text-error hover:bg-error-container/30"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">delete</span> Elimina Log
                            </M3Button>
                        </div>

                        <InfoCard 
                            title="Come usare"
                            description="Premi F12 per aprire la console, digita window.__errorLogger.getRecentErrors(10) per visualizzare gli ultimi 10 errori."
                            icon="info"
                            variant="secondary"
                            className="bg-surface-container-low/50 border-outline-variant/20"
                        />
                    </div>
                </SettingsGroup>

                <SettingsGroup id="advanced" title="Avanzate" subtitle="Configurazione tecnica" icon="build" variant="surface">
                    <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 mb-6 shadow-sm">
                        <div className="flex items-center gap-8 mb-5">
                            <span className="material-symbols-outlined text-primary">key</span>
                            <h4 className="m3-label-small text-primary font-black uppercase tracking-widest">Google Cloud API</h4>
                        </div>
                        <div className="space-y-5">
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} leadingIcon="badge" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} leadingIcon="lock" />
                        </div>
                    </div>
                    <div className="p-6 bg-error-container/10 rounded-3xl border border-error/20 shadow-sm">
                        <div className="flex items-center gap-8 mb-8">
                            <span className="material-symbols-outlined text-error">warning</span>
                            <h4 className="m3-label-small text-error font-black uppercase tracking-widest">Zona Pericolo</h4>
                        </div>
                        <M3Button 
                            onClick={() => setIsResetModalOpen(true)} 
                            variant="filled"
                            className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg !bg-error !text-on-error"
                        >
                            <span className="material-symbols-outlined mr-2">delete_forever</span> 
                            Reset Totale Dati
                        </M3Button>
                    </div>
                </SettingsGroup>

                <div className="text-center m3-label-tiny text-on-surface-variant opacity-50 pt-12 pb-4">
                    DocenteDoc AI v4.0.8 â€¢ Stable
                    <div className="pt-3">
                        <span className="font-black uppercase tracking-widest">Owner:</span> Antonio Corsano
                        <span className="block mt-4">antonio.corsano@gmail.com</span>
                    </div>
                    <M3Button onClick={onLogout} variant="text" className="mt-6 mx-auto !h-10 !text-xs font-black uppercase tracking-widest hover:bg-error-container/30 hover:text-error transition-all">
                        <span className="material-symbols-outlined text-sm mr-2">logout</span> 
                        Esci dall'account
                    </M3Button>
                </div>
            </div>
            {isResetModalOpen && <ResetConfirmModal onClose={() => setIsResetModalOpen(false)} onConfirm={performReset} />}
        </div>
    );
};

export default Settings;

