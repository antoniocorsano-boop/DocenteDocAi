
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
    } = settingsLogic;

    const [newClassName, setNewClassName] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');

    const handleAddClass = () => {
        if (!newClassName.trim()) return;
        if (localSettings.classi.includes(newClassName.trim())) {
            showToast("Classe già presente", "info");
            return;
        }
        handleChange('classi', [...localSettings.classi, newClassName.trim()]);
        setNewClassName('');
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
            <div className="bg-surface p-4 border-b border-outline-variant flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="icon-button -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1 className="m3-headline-small font-bold">Impostazioni</h1>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pt-3 px-4 md:px-6 pb-32 max-w-3xl mx-auto w-full space-y-6">

                <SettingsGroup id="manutenzione" title="Manutenzione Brand" subtitle="Risolvi problemi di logo e testo" icon="refresh" variant="primary" defaultOpen={true}>
                    <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant">
                        <p className="m3-body-small text-on-surface-variant mb-5">Se visualizzi ancora il vecchio logo o nomi non corretti, usa questo tasto per forzare il ricaricamento del sistema.</p>
                        <button 
                            onClick={handleForceRefresh} 
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-on-primary font-black text-sm uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">cached</span>
                            AGGIORNA BRAND E CACHE
                        </button>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="profile" title="Profilo & Identità" subtitle="Dati docente e istituto" icon="badge" variant="surface">
                    <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField label="Nome" value={localSettings.nomeInsegnante} onChange={e => handleChange('nomeInsegnante', e.target.value)} />
                            <TextField label="Cognome" value={localSettings.cognomeInsegnante || ''} onChange={e => handleChange('cognomeInsegnante', e.target.value)} />
                        </div>
                        <TextField label="Email Istituzionale" type="email" value={localSettings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="nome.cognome@scuola.edu.it" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField label="Nome Istituto" value={localSettings.nomeIstituto} onChange={e => handleChange('nomeIstituto', e.target.value)} />
                            <TextField label="Città" value={localSettings.cittaIstituto} onChange={e => handleChange('cittaIstituto', e.target.value)} />
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="ai_didattica" title="AI & Didattica" subtitle="Cervello AI e cattedra" icon="psychology" variant="secondary">
                    {/* SEZIONE 1: MODELLO AI */}
                    <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant mb-6">
                        <div className="flex items-center gap-2 mb-4">
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
                        
                        <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${currentAiProfile === 'esperto' ? 'bg-primary-container/20 border-primary/30' : 'bg-tertiary-container/20 border-tertiary/30'}`}>
                            <span className={`material-symbols-outlined text-xl mt-0.5 ${currentAiProfile === 'esperto' ? 'text-primary' : 'text-tertiary'}`}>info</span>
                            <p className="m3-body-small leading-relaxed text-on-surface">
                                {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* SEZIONE 2: ANNO SCOLASTICO */}
                        <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    <h4 className="m3-label-large font-black uppercase tracking-wide text-on-surface">Anno Scolastico</h4>
                                </div>
                                <button 
                                    onClick={handleAddNextYear} 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 border border-primary/20"
                                >
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Aggiungi
                                </button>
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
                        <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-secondary">school</span>
                                    <h4 className="m3-label-large font-black uppercase tracking-wide text-on-surface">Gestione Cattedra</h4>
                                </div>
                                <div className="flex gap-2">
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

                            {/* INPUT RAPIDI PER AGGIUNGERE CLASSI/MATERIE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="flex gap-2">
                                    <div className="flex-grow relative">
                                        <input 
                                            type="text" 
                                            placeholder="Aggiungi Classe (es: 1A)" 
                                            value={newClassName}
                                            onChange={e => setNewClassName(e.target.value.toUpperCase())}
                                            onKeyDown={e => e.key === 'Enter' && handleAddClass()}
                                            className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border border-outline-variant text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAddClass}
                                        className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-grow relative">
                                        <input 
                                            type="text" 
                                            placeholder="Aggiungi Materia (es: Italiano)" 
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                                            className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border border-outline-variant text-sm font-bold focus:ring-2 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAddSubject}
                                        className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-sm active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* MATRICE INTERATTIVA */}
                            <div className="overflow-x-auto -mx-5 px-5 pb-4">
                                <table className="w-full border-separate border-spacing-1">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Materia / Classe</th>
                                            {localSettings.classi.map(cls => (
                                                <th key={cls} className="p-2 min-w-[60px] text-center">
                                                    <div className="relative group">
                                                        <div className="text-xs font-black text-on-surface">{cls}</div>
                                                        <button 
                                                            onClick={() => handleChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-error text-on-error text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                                            <tr key={subj}>
                                                <td className="p-2">
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
                                                            className="w-5 h-5 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-container hover:text-error"
                                                        >
                                                            <span className="material-symbols-outlined text-[12px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {localSettings.classi.map(cls => {
                                                    const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <td key={`${subj}-${cls}`} className="p-1">
                                                            <div 
                                                                onClick={() => toggleAssociation(cls, subj)}
                                                                className={`h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${assignment ? 'bg-primary-container border-primary shadow-sm' : 'bg-surface-container-low border-transparent hover:border-outline-variant'}`}
                                                            >
                                                                {assignment ? (
                                                                    <>
                                                                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                                                        <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
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

                            <div className="mt-6 p-4 bg-primary-container/10 rounded-2xl border border-primary/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Come funziona</h5>
                                </div>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Questa matrice è il tuo centro di controllo. 
                                    <strong> Clicca su una cella</strong> per associare una materia a una classe. 
                                    <strong> Modifica il numero</strong> per impostare le ore settimanali. 
                                    Tutte le modifiche sono salvate automaticamente.
                                </p>
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
                                            className="px-4 py-2 rounded-xl bg-tertiary-container text-on-tertiary-container font-bold text-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                            Riattiva
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="pt-4 border-t border-outline-variant/30">
                            <button
                                onClick={() => {
                                    // Clear all dismissed suggestions
                                    Array.from(dismissedSuggestions).forEach(id => onReactivateSuggestion(id));
                                    showToast('Tutti i suggerimenti riattivati', 'success');
                                }}
                                disabled={dismissedSuggestions.size === 0}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary transition-all disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <span className="material-symbols-outlined text-sm">history</span>
                                Riattiva Tutti i Suggerimenti
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

                    <div className={`p-5 rounded-2xl border mb-6 flex items-center justify-between transition-all duration-500 ${driveState.isAuthenticated ? 'bg-primary-container/30 border-primary/50 shadow-md' : 'bg-surface-container-low border-outline-variant text-on-surface'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${driveState.isAuthenticated ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined text-2xl">{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                            </div>
                            <div>
                                <h4 className="font-black m3-label-large uppercase tracking-widest">{driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}</h4>
                                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tighter">{driveState.lastSyncTime ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}` : 'Nessun backup cloud'}</p>
                            </div>
                        </div>
                        {driveState.isAuthenticated ? (
                            <button 
                                onClick={() => onSyncToDrive()} 
                                disabled={driveState.isSyncing} 
                                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
                                {driveState.isSyncing ? '...' : 'Salva'}
                            </button>
                        ) : (
                            settings.googleClientId && (
                                <button 
                                    onClick={onConnectDrive} 
                                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:shadow-lg transition-all active:scale-95"
                                >
                                    Connetti
                                </button>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onExportData} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-primary hover:text-on-primary transition-all">
                            <span className="material-symbols-outlined text-base">download</span> 
                            Backup Locale
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-primary hover:text-on-primary transition-all">
                            <span className="material-symbols-outlined text-base">upload</span> 
                            Ripristina File
                        </button>
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
                        <div className="border-t border-outline-variant pt-6 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                <label className="text-[11px] font-black uppercase tracking-widest text-primary block">Genera con AI</label>
                            </div>
                            <TextField
                                label="Descrivi il tuo stile"
                                value={themePrompt}
                                onChange={e => setThemePrompt(e.target.value)}
                                placeholder="Es. 'Colori tramonto', 'Tema cyberpunk'..."
                                containerClassName="mb-4"
                                leadingIcon="palette"
                            />
                            <button 
                                onClick={handleGenerateThemeFromPrompt} 
                                disabled={isGeneratingTheme || !themePrompt.trim()} 
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">{isGeneratingTheme ? 'sync' : 'magic_button'}</span>
                                {isGeneratingTheme ? 'Generazione...' : 'Genera Tema'}
                            </button>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="debug_logging" title="Debug & Logging" subtitle="Visualizza e gestisci i log degli errori" icon="bug_report" variant="surface">
                    <div className="space-y-4">
                        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h4 className="m3-label-large font-bold text-on-surface">Log degli Errori</h4>
                                    <p className="text-xs text-on-surface-variant mt-1">Visualizza tutti gli errori registrati durante l'utilizzo dell'app</p>
                                </div>
                                <span className="material-symbols-outlined text-error text-lg">{errorLogger.getErrorStats().total > 0 ? 'error' : 'check_circle'}</span>
                            </div>
                            <div className="text-xs text-on-surface-variant mb-4 p-2 bg-surface-container-low rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <span>{errorLogger.getErrorStats().total} log registrati</span>
                            </div>
                            <button 
                                onClick={() => {
                                    showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                                }}
                                className="button button-filled w-full !h-10 rounded-lg hover:shadow-md transition-all mb-2"
                            >
                                <span className="material-symbols-outlined text-sm mr-1">terminal</span> Console Browser (F12)
                            </button>
                            <button 
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
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-primary hover:text-on-primary transition-all mb-2"
                            >
                                <span className="material-symbols-outlined text-sm">download</span> Esporta JSON
                            </button>
                            <button 
                                onClick={() => {
                                    if (confirm('Sei sicuro di voler eliminare tutti i log?')) {
                                        errorLogger.clearAllLogs();
                                        showToast('Tutti i log sono stati eliminati', 'success');
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-error-container text-on-error-container font-bold text-xs hover:bg-error hover:text-on-error transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span> Elimina Log
                            </button>
                        </div>

                        <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-on-surface-variant">
                            <div className="flex gap-2 items-start">
                                <span className="material-symbols-outlined text-error text-sm flex-shrink-0 mt-0.5">info</span>
                                <div>
                                    <strong>Come usare:</strong><br/>
                                    1. Premi <kbd className="bg-surface px-1 py-0.5 rounded text-xs font-mono">F12</kbd> per aprire la console<br/>
                                    2. Digita: <code className="bg-surface px-1 py-0.5 rounded text-xs font-mono">window.__errorLogger.getRecentErrors(10)</code><br/>
                                    3. Visualizza gli ultimi 10 errori
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsGroup>

                <SettingsGroup id="advanced" title="Avanzate" subtitle="Configurazione tecnica" icon="build" variant="surface">
                    <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">key</span>
                            <h4 className="m3-label-small text-primary font-bold uppercase tracking-wide">Google Cloud API</h4>
                        </div>
                        <div className="space-y-4">
                            <TextField label="Client ID (OAuth)" value={localSettings.googleClientId || ''} onChange={e => handleChange('googleClientId', e.target.value)} leadingIcon="badge" />
                            <TextField label="API Key (Picker)" type="password" value={localSettings.googleApiKey || ''} onChange={e => handleChange('googleApiKey', e.target.value)} leadingIcon="lock" />
                        </div>
                    </div>
                    <div className="p-5 bg-error-container/10 rounded-2xl border border-error/20">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-error">warning</span>
                            <h4 className="m3-label-small text-error font-bold uppercase tracking-wide">Zona Pericolo</h4>
                        </div>
                        <button 
                            onClick={() => setIsResetModalOpen(true)} 
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-error-container text-on-error-container font-black text-xs uppercase tracking-widest hover:bg-error hover:text-on-error transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">delete_forever</span> 
                            Reset Totale Dati
                        </button>
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
