
import React, { useRef, useState, useEffect } from 'react';
import { SettingsProps } from '../types';
import { THEME_CUSTOMIZATIONS, AI_PROFILES } from '../constants';
import { generateNextSchoolYear } from '../utils/schoolUtils';
// import AiThinkingGem from './AiThinkingGem';
import { TextField, SelectField, TabGroup } from './M3Components';
// import Avatar from './Avatar';
import ThemeBubble from './ThemeBubble';
import ChipInputList from './ChipInputList';
import ResetConfirmModal from './ResetConfirmModal';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { TeachingAssignmentMatrix } from './TeachingAssignmentMatrix';

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
        <details className={`settings-card variant-${variant} group`} open={isOpen}>
            <summary onClick={handleToggle} className="settings-summary">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="settings-icon-box"><span className="material-symbols-outlined">{icon}</span></div>
                    <div className="min-w-0">
                        <h3 className="settings-title">{title}</h3>
                        {subtitle && <p className="settings-subtitle">{subtitle}</p>}
                    </div>
                </div>
                <span className={`material-symbols-outlined settings-chevron transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </summary>
            <div className="settings-content animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>
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
    const [storageInfo, setStorageInfo] = useState<{ used: string, total: string, percent: number } | null>(null);

    useEffect(() => {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                const used = ((estimate.usage || 0) / 1024 / 1024).toFixed(1);
                const total = ((estimate.quota || 0) / 1024 / 1024).toFixed(1);
                const percent = Math.round(((estimate.usage || 0) / (estimate.quota || 1)) * 100);
                setStorageInfo({ used, total, percent });
            });
        }
    }, []);

    const {
        localSettings,
        localAiSettings,
        handleChange,
        handleAiProfileChange,
        themePrompt, setThemePrompt,
        isGeneratingTheme,
        handleGenerateThemeFromPrompt,
        isResetModalOpen,
        setIsResetModalOpen,
        performReset
    } = useSettingsLogic({
        settings, onSaveSettings, aiSettings, onSaveAiSettings, themeState, onSaveTheme, showToast, onCleanDemoData
    });

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
        } catch (e) { window.location.reload(); }
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
        <div className="flex flex-col h-full bg-surface-container-low">
            <div className="bg-surface p-4 border-b border-outline-variant sticky top-0 z-20 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="icon-button -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1 className="m3-headline-small font-bold">Impostazioni</h1>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 md:p-6 pb-32 max-w-3xl mx-auto w-full space-y-6">

                <SettingsGroup id="manutenzione" title="Manutenzione Brand" subtitle="Risolvi problemi di logo e testo" icon="refresh" variant="primary" defaultOpen={true}>
                    <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant">
                        <p className="m3-body-small text-on-surface-variant mb-4">Se visualizzi ancora il vecchio logo o nomi non corretti, usa questo tasto per forzare il ricaricamento del sistema.</p>
                        <button onClick={handleForceRefresh} className="button button-filled w-full !h-14 font-black rounded-lg hover:shadow-md transition-all">
                            AGGIORNA BRAND E CACHE
                        </button>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="profile" title="Profilo & Identità" subtitle="Dati docente e istituto" icon="badge" variant="surface">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                        <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField label="Nome Istituto" value={localSettings.nomeIstituto} onChange={e => handleChange('nomeIstituto', e.target.value)} />
                            <TextField label="Città" value={localSettings.cittaIstituto} onChange={e => handleChange('cittaIstituto', e.target.value)} />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="ai_didattica" title="AI & Didattica" subtitle="Cervello AI e cattedra" icon="psychology" variant="secondary">
                    <div className="mb-8">
                        <label className="text-[11px] font-black uppercase tracking-widest text-secondary mb-3 block">Modello Intelligenza</label>
                        <TabGroup
                            tabs={(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ id: key, label: AI_PROFILES[key].label, icon: AI_PROFILES[key].icon }))}
                            activeTab={currentAiProfile}
                            onTabChange={(id) => handleAiProfileChange(id as keyof typeof AI_PROFILES)}
                            variant="primary"
                            className="w-full"
                        />
                        <div className={`mt-3 p-3 rounded-lg border flex items-start gap-3 transition-colors duration-300 ${currentAiProfile === 'esperto' ? 'bg-primary-container/30 border-primary/20' : 'bg-tertiary-container/30 border-tertiary/20'}`}>
                            <span className={`material-symbols-outlined text-lg mt-0.5 ${currentAiProfile === 'esperto' ? 'text-primary' : 'text-tertiary'}`}>info</span>
                            <p className="text-xs leading-relaxed">{AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="m3-label-large font-bold text-on-surface">Anno Scolastico</h4>
                                <button onClick={handleAddNextYear} className="button button-text !h-auto !py-1 !px-2 text-primary rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined text-sm mr-1">add</span>Aggiungi</button>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex-grow">
                                    <SelectField label="Anno Corrente" value={localSettings.annoScolasticoCorrente} onChange={e => handleChange('annoScolasticoCorrente', e.target.value)} containerClassName="!mb-0">
                                        {localSettings.anniScolastici.map(year => <option key={year} value={year}>{year}</option>)}
                                    </SelectField>
                                </div>
                                <div className="flex-grow">
                                    <ChipInputList label="Storico" items={localSettings.anniScolastici} onAdd={(item) => handleChange('anniScolastici', [...localSettings.anniScolastici, item])} onRemove={(idx) => handleChange('anniScolastici', localSettings.anniScolastici.filter((_, i) => i !== idx))} placeholder="2025/2026" icon="calendar_today" />
                                </div>
                            </div>
                        </div>
                        <div className="card-inner space-y-6">
                            <ChipInputList label="Le tue Classi" items={localSettings.classi} onAdd={(item) => handleChange('classi', [...localSettings.classi, item])} onRemove={(idx) => handleChange('classi', localSettings.classi.filter((_, i) => i !== idx))} placeholder="1A..." icon="groups" variant="class" />
                            <ChipInputList label="Le tue Materie" items={localSettings.disciplines} onAdd={(item) => handleChange('disciplines', [...localSettings.disciplines, item])} onRemove={(idx) => handleChange('disciplines', localSettings.disciplines.filter((_, i) => i !== idx))} placeholder="Storia..." icon="menu_book" variant="subject" />
                            <div className="pt-2">
                                <label className="form-label mb-2 text-secondary flex items-center gap-2"><span className="material-symbols-outlined text-sm">grid_view</span>3. Matrice Cattedra</label>
                                <TeachingAssignmentMatrix classes={localSettings.classi} subjects={localSettings.disciplines} assignments={localSettings.teachingAssignments || []} onChange={(newAssignments) => handleChange('teachingAssignments', newAssignments)} />
                            </div>
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
                                    <div key={id} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between">
                                        <div>
                                            <div className="m3-label-medium font-semibold">Suggerimento {id}</div>
                                            <div className="text-sm text-on-surface-variant">Ignorato in precedenza</div>
                                        </div>
                                        <button
                                            onClick={() => onReactivateSuggestion(id)}
                                            className="px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary font-medium text-sm hover:shadow-md transition-all"
                                        >
                                            Riattiva
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="pt-4 border-t border-outline-variant">
                            <button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                }}
                                disabled={dismissedSuggestions.size === 0}
                                className="button button-outlined w-full justify-center !h-10 text-sm rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined mr-2 text-sm">refresh</span>
                                Riattiva Tutti
                            </button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="cloud" title="Dati & Cloud" subtitle="Backup e Storage" icon="cloud_sync" variant="surface">
                    {storageInfo && (
                        <div className="mb-4 p-4 bg-surface-container rounded-xl border border-outline-variant">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="m3-label-large font-bold">Storage Dispositivo</h4>
                                <span className="text-xs font-mono">{storageInfo.used}MB / {storageInfo.total}MB</span>
                            </div>
                            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${storageInfo.percent > 80 ? 'bg-error' : 'bg-primary'} transition-all`} style={{ width: `${storageInfo.percent}%` }}></div>
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-2">Dati salvati in IndexedDB (senza limiti LocalStorage).</p>
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
                                <div className="mb-4 p-3 rounded-lg border border-warning bg-warning-container text-on-warning-container flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <span className="material-symbols-outlined text-warning">warning</span>
                                    <div>
                                        <b>Backup cloud non aggiornato!</b><br />
                                        Esegui un backup cloud e verifica il ripristino periodicamente per la sicurezza dei tuoi dati.
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <div className={`p-4 rounded-xl border mb-4 flex items-center justify-between transition-colors ${driveState.isAuthenticated ? 'bg-primary-container border-primary text-on-primary-container' : 'bg-surface-container border-outline-variant text-on-surface'}`}>
                        <div>
                            <h4 className="font-bold m3-title-medium flex items-center gap-2"><span className="material-symbols-outlined">{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>{driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}</h4>
                            <p className="text-xs opacity-80 mt-1">{driveState.lastSyncTime ? (new Date(driveState.lastSyncTime)).toLocaleString() : 'Nessun backup cloud'}</p>
                        </div>
                        {driveState.isAuthenticated ? (
                            <button onClick={() => onSyncToDrive()} disabled={driveState.isSyncing} className="button button-filled bg-surface text-primary shadow-sm !h-8 !px-3 text-xs rounded-full">
                                {driveState.isSyncing ? 'Sincronizzazione...' : 'Salva Ora'}
                            </button>
                        ) : (
                            settings.googleClientId && <button onClick={onConnectDrive} className="button button-filled !h-8 !px-3 text-xs rounded-full">Connetti</button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onExportData} className="button button-outlined justify-center text-sm rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined mr-2 text-base">download</span> Backup Locale</button>
                        <button onClick={() => fileInputRef.current?.click()} className="button button-outlined justify-center text-sm rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined mr-2 text-base">upload</span> Ripristina File</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                    </div>
                </SettingsGroup>

                <SettingsGroup id="theme" title="Personalizzazione Tema" subtitle="Colori e stile dell'app" icon="palette" variant="tertiary">
                    <div className="mb-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary mb-3 block">Modalità Tema</label>
                        <TabGroup
                            tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                            activeTab={themeState.mode}
                            onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                            variant="primary"
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary mb-3 block">Colori AI Generati</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {THEME_CUSTOMIZATIONS.map(theme => (
                                <ThemeBubble
                                    key={theme.name}
                                    name={theme.name}
                                    colors={{
                                        primary: theme.colors.primary ?? '#000000',
                                        secondary: theme.colors.secondary ?? '#000000',
                                        tertiary: theme.colors.tertiary ?? '#000000'
                                    }}
                                    isSelected={themeState.customizationName === theme.name}
                                    onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })}
                                />
                            ))}
                        </div>
                        <div className="border-t border-outline-variant pt-4 mt-6">
                            <label className="text-[11px] font-black uppercase tracking-widest text-primary mb-3 block">Genera con AI</label>
                            <input
                                type="text"
                                value={themePrompt}
                                onChange={e => setThemePrompt(e.target.value)}
                                placeholder="Es. 'Colori tramonto', 'Tema cyberpunk'..."
                                className="form-input w-full mb-3"
                            />
                            <button onClick={handleGenerateThemeFromPrompt} disabled={isGeneratingTheme || !themePrompt.trim()} className="button button-tonal w-full rounded-lg hover:shadow-md transition-all">
                                {isGeneratingTheme ? 'Generazione...' : 'Genera Tema'}
                            </button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="advanced" title="Avanzate" subtitle="Configurazione tecnica" icon="build" variant="surface">
                    <div className="mb-6">
                        <h4 className="m3-label-small text-primary mb-2 font-bold uppercase tracking-wide">Google Cloud API</h4>
                        <div className="space-y-3">
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} containerClassName="!h-10 text-xs font-mono" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} containerClassName="!h-10 text-xs font-mono" />
                        </div>
                    </div>
                    <div>
                        <h4 className="m3-label-small text-error mb-2 font-bold uppercase tracking-wide">Zona Pericolo</h4>
                        <button onClick={() => setIsResetModalOpen(true)} className="button button-outlined-error w-full justify-center !h-10 text-xs rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined mr-2 text-sm">delete_forever</span> Reset Totale Dati</button>
                    </div>
                </SettingsGroup>

                <div className="text-center text-[10px] text-on-surface-variant opacity-50 pt-8 pb-2">
                    DocenteDoc AI v4.0.8 • Stable
                    <div className="pt-2">
                        <span className="font-semibold">Owner:</span> Antonio Corsano
                        <span className="block">antonio.corsano@gmail.com</span>
                    </div>
                    <button onClick={onLogout} className="button-drop danger mt-4 mx-auto !h-10 !text-xs !bg-surface-container-high border-none rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined text-sm">logout</span> Esci</button>
                </div>
            </div>
            {isResetModalOpen && <ResetConfirmModal onClose={() => setIsResetModalOpen(false)} onConfirm={performReset} />}
        </div>
    );
};

export default Settings;
