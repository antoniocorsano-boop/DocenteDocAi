import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    AppState, AppActions, UserProfile, TimetableSettings, AiSettings, AppThemeState,
    Studente, Lezione, Slot, Valutazione, ValutazioneCompetenza, Uda, EventoCalendario,
    KnowledgeBaseEntry, Corpus, Notifica, Rubrica, PianoInclusione, GiudizioPeriodico,
    Report, FeedSource, RegisterEntry, NotebookNote, ToDoItem, AiSuggestion, SystemSuggestion,
    BackupState, DriveSyncState, View, CurriculumSubject, HomeworkSubmission,
    LessonScheduleInput, EvaluationInput, UdaCreateInput, BeforeInstallPromptEvent
} from '../types.ts';
import { loadBackup, deleteBackup } from '../services/backupService.ts';
import { loadKbContentFromIndexedDB, saveKbContentToIndexedDB, clearIndexedDB } from '../services/indexedDbService.ts';
import { initTokenClient, requestAccessToken, revokeAccessToken, uploadBackup, downloadBackup, getBackupMetadata, pickGoogleDriveFolder, createAppFolder } from '../services/googleDriveService.ts';
import { usePersistence } from './usePersistence.ts';
import { analyzeSystemState } from '../utils/suggestionUtils.ts';

// Lazy import of stores to defer their initialization until React is ready
// This prevents zustand's internal React.useState from running too early
let storeCache: { useUIStore: any; useSettingsStore: any; useDataStore: any } | null = null;

async function getStores() {
    if (!storeCache) {
        const [ui, settings, data] = await Promise.all([
            import('../stores/useUIStore.ts'),
            import('../stores/useSettingsStore.ts'),
            import('../stores/useDataStore.ts')
        ]);
        storeCache = {
            useUIStore: ui.useUIStore,
            useSettingsStore: settings.useSettingsStore,
            useDataStore: data.useDataStore
        };
    }
    return storeCache;
}

export const useAppEngine = () => {
    // --- LOCAL STATE (NAVIGATION ONLY) ---
    const [view, setView] = useState<View>('home');
    const [viewContext, setViewContext] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [storesReady, setStoresReady] = useState(false);
    const [stores, setStores] = useState<{ useUIStore: any; useSettingsStore: any; useDataStore: any } | null>(null);

    // Eagerly load stores on first render (inside React context)
    useEffect(() => {
        getStores().then(s => {
            setStores(s);
            setStoresReady(true);
        });
    }, []);

    if (!storesReady || !stores) {
        // Return a stub while stores are loading
        return {
            view, setView,
            viewContext, setViewContext,
            user: null,
            students: [],
            lessons: {},
            slots: {},
            evaluations: [],
            competencyEvals: [],
            udas: [],
            eventi: [],
            knowledgeBase: [],
            corpora: [],
            notifiche: [],
            rubriche: [],
            pianiInclusione: {},
            giudizi: {},
            reports: [],
            feedSources: [],
            draftRegister: {},
            finalizedRegister: [],
            notebookNotes: {},
            memos: [],
            curricula: [],
            submissions: [],
            suggestions: [],
            activeSuggestion: null,
            dismissedSuggestions: new Set(),
            studentProfileContext: null,
            selectedClassForDashboard: null,
            // Settings & Theme
            settings: {},
            aiSettings: { model: 'gemini-3-flash-preview' },
            themeState: { mode: 'light' as const, customizationName: 'M3 Default' },
            // UI & System State
            installPrompt: null,
            canShowInstallPrompt: false,
            isGlobalAiLoading: false,
            navigationHistory: [],
            backupState: { status: 'synced' as const, lastBackup: null },
            driveSyncState: { isAuthenticated: false, isSyncing: false, lastSyncTime: null },
            isDataLoaded: false
        };
    }

    const { useUIStore, useSettingsStore, useDataStore } = stores;

    // --- ZUSTAND STORE HOOKS ---
    const uiState = useUIStore();
    const uiActions = useUIStore(state => state.actions);

    const settingsState = useSettingsStore();
    const settingsActions = useSettingsStore(state => state.actions);

    const dataState = useDataStore();
    const {
        setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes,
        setMemos, setCurricula, setSubmissions, setSuggestions, setActiveSuggestion, dismissSuggestion,
        setStudentProfileContext, setSelectedClassForDashboard, loadFromBackup, resetAll
    } = useDataStore(state => state.actions);
    
    const { user, students, lessons, slots, evaluations, competencyEvals, udas, eventi,
        knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports,
        feedSources, draftRegister, finalizedRegister, notebookNotes, memos,
        curricula, submissions, suggestions, activeSuggestion, dismissedSuggestions,
        studentProfileContext, selectedClassForDashboard } = dataState;

    // UI-related states directly from UIStore
    const { installPrompt, canShowInstallPrompt, isGlobalAiLoading, navigationHistory,
        backupState, driveSyncState, lessonViewContext, editingSlotKey, activeSlotKey
    } = uiState;

    const { settings, aiSettings, themeState } = settingsState;


    // Persistence Hook: Now receives isDataLoaded to prevent saving during initial load
    usePersistence(isDataLoaded);

    // --- INITIAL DATA LOAD EFFECT ---
    // This effect handles the initial loading and restoration of data from various sources
    // and dispatches it to the appropriate Zustand stores.
    useEffect(() => {
        const load = async () => {
            try {
                setIsDataLoaded(false);
                uiActions.setIsRestoring(true);
                const localData = await loadBackup();
                if (localData) {
                    // Dispatch to DataStore
                    loadFromBackup(localData); // Use destructured action
                    // Dispatch to SettingsStore
                    settingsActions.loadFromBackup(localData);
                    // Dispatch UI-related states to UIStore
                    uiActions.setBackupState(localData.backupState || { status: 'synced', lastBackup: null });
                    uiActions.setDriveSyncState(localData.driveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                    uiActions.setNavigationHistory(localData.navigationHistory || []);
                    uiActions.setInstallPrompt(localData.installPrompt || null);
                    uiActions.setCanShowInstallPrompt(localData.canShowInstallPrompt || false);
                    uiActions.setIsGlobalAiLoading(localData.isGlobalAiLoading || false);

                    // Handle heavy KB content from IndexedDB separately
                    const kbContentMap = await loadKbContentFromIndexedDB();
                    const fullKb = (localData.knowledgeBase || []).map((entry: KnowledgeBaseEntry) => ({
                        ...entry,
                        ...(kbContentMap[entry.id] || {})
                    }));
                    setKnowledgeBase(fullKb); // Use destructured action
                } else {
                    // AUTO LOAD DEMO DATA IF EMPTY (Only on first run)
                    setTimeout(() => {
                        handleLoadDemoData();
                    }, 500);
                }
            } catch (e) {
                console.error("Initial data load failed (Race Condition protection active):", e);
                // In case of critical error, clear all data stores to start fresh (optional, for robustness)
                resetAll(); // Use destructured action
                settingsActions.reset();
                uiActions.clearNavigationHistory();
                uiActions.setBackupState({ status: 'error', lastBackup: null });
                uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: 'Initial load failed' });
            } finally {
                setIsDataLoaded(true);
                uiActions.setIsRestoring(false);
            }
        };
        load();
    }, []); // Empty deps: Only run once on mount

    // --- PWA INSTALL PROMPT HANDLER (Interacts with global window object) ---
    useEffect(() => {
        const handler = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            uiActions.setInstallPrompt(e);
            uiActions.setCanShowInstallPrompt(true);
        };
        window.addEventListener('beforeinstallprompt', handler as EventListener);
        return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
    }, []); // Only setup once on mount

    // --- SYSTEM SUGGESTION ENGINE (Coordinates data to produce UI suggestion) ---
    useEffect(() => {
        // Only run once data is loaded and stable
        if (!isDataLoaded) return;
        const suggestion = analyzeSystemState(
            students,
            slots,
            udas,
            eventi,
            evaluations
        );
        setActiveSuggestion(suggestion); // Use destructured action
    }, [isDataLoaded, students, slots, udas, eventi, evaluations]);

    // --- CORE ACTIONS (COORDINATION AND UI DISPATCH) ---
    // These actions are managed by AppEngine but dispatch to Zustand stores.

    const handleNavigate = useCallback((newView: View, context: any = null) => {
        uiActions.addNavigationEntry({ view, context: viewContext }); // Save current view to history
        setView(newView);
        setViewContext(context);
        window.scrollTo(0, 0);
    }, [view, viewContext]); // Remove uiActions from deps - it's stable from zustand

    const handleBack = useCallback((force = false) => {
        if (uiState.navigationHistory.length > 0) {
            const last = uiState.navigationHistory[uiState.navigationHistory.length - 1];
            uiActions.popNavigationEntry();
            setView(last.view);
            setViewContext(last.context);
        } else if (view !== 'home' || force) {
            setView('home');
            setViewContext(null);
        }
    }, [uiState.navigationHistory, view]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        uiActions.showToast(message, type);
    }, []);

    const handleConnectDrive = useCallback(() => {
        const initialized = initTokenClient((tokenResponse) => {
            uiActions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true }));
            showToast('Connesso a Google Drive!', 'success');
        }, settings.googleClientId);

        if (initialized) requestAccessToken();
        else showToast('Errore inizializzazione Google Client.', 'error');
    }, [settings.googleClientId]);

    const handleDisconnectDrive = useCallback(() => {
        revokeAccessToken();
        uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
        showToast('Disconnesso da Drive.', 'info');
    }, []);

    const handleSyncToDrive = useCallback(async (folderId?: string) => {
        const driveState = uiState.driveSyncState;
        if (!driveState.isAuthenticated) return;

        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
        try {
            const remoteMeta = await getBackupMetadata(folderId || settings.backupFolderId || '') as any;
            if (remoteMeta && remoteMeta.modifiedTime && driveState.lastSyncTime && new Date(remoteMeta.modifiedTime) > new Date(driveState.lastSyncTime)) {
                uiActions.setSyncConflictModal({
                    remoteTime: new Date(remoteMeta.modifiedTime).getTime(),
                    localTime: new Date(driveState.lastSyncTime).getTime(),
                    isOpen: true
                });
                uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
                return;
            }

            // Create a serializable payload from all Zustand stores
            const payload = {
                ...dataState,
                settings: settingsState.settings,
                aiSettings: settingsState.aiSettings,
                themeState: settingsState.themeState,
                // Convert Set to Array for serialization
                dismissedSuggestions: Array.from(dismissedSuggestions),
                // These are now handled in uiState, but for the full payload, we include their current values
                // as `usePersistence` needs to capture them correctly.
                backupState: uiState.backupState,
                driveSyncState: uiState.driveSyncState,
                navigationHistory: uiState.navigationHistory,
                installPrompt: uiState.installPrompt,
                canShowInstallPrompt: uiState.canShowInstallPrompt,
                isGlobalAiLoading: uiState.isGlobalAiLoading,
            };

            await uploadBackup(payload, folderId || settings.backupFolderId);
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false, lastSyncTime: new Date() }));
            showToast('Backup completato!', 'success');
        } catch (e: any) {
            showToast('Errore backup Drive: ' + e.message, 'error');
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false, error: e.message }));
        }
    }, [dataState, settingsState, uiState.driveSyncState, uiState.navigationHistory, uiActions, settings.backupFolderId, showToast, uiState.installPrompt, uiState.canShowInstallPrompt, uiState.isGlobalAiLoading, dismissedSuggestions]);

    const handleRestoreFromDrive = useCallback(async (folderId?: string) => {
        if (!uiState.driveSyncState.isAuthenticated) return;

        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
        uiActions.setIsRestoring(true);

        try {
            const restoredData = await downloadBackup(folderId || settings.backupFolderId || '');
            if (restoredData) {
                // Dispatch to DataStore
                loadFromBackup(restoredData); // Use destructured action
                // Dispatch to SettingsStore
                settingsActions.loadFromBackup(restoredData);
                // Dispatch UI-related states to UIStore
                uiActions.setBackupState(restoredData.backupState || { status: 'synced', lastBackup: new Date() });
                uiActions.setDriveSyncState(restoredData.driveSyncState || { isAuthenticated: true, isSyncing: false, lastSyncTime: new Date() });
                uiActions.setNavigationHistory(restoredData.navigationHistory || []);
                uiActions.setInstallPrompt(restoredData.installPrompt || null);
                uiActions.setCanShowInstallPrompt(restoredData.canShowCanShowInstallPrompt || false);
                uiActions.setIsGlobalAiLoading(restoredData.isGlobalAiLoading || false);

                if (restoredData.knowledgeBase) {
                    await saveKbContentToIndexedDB(restoredData.knowledgeBase);
                    setKnowledgeBase(restoredData.knowledgeBase); // Use destructured action
                }
                showToast('Dati ripristinati da Drive!', 'success');
            }
        } catch (e: any) {
            showToast('Errore ripristino: ' + e.message, 'error');
            uiActions.setDriveSyncState(prev => ({ ...prev, error: e.message }));
        } finally {
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
            uiActions.setIsRestoring(false);
        }
    }, [loadFromBackup, setKnowledgeBase, settingsActions, uiState.driveSyncState, uiActions, settings.backupFolderId, showToast]);

    const handleConfigureDrive = useCallback((clientId: string, apiKey?: string) => {
        settingsActions.updateSettings({ googleClientId: clientId, googleApiKey: apiKey });
        showToast('Configurazione Drive aggiornata.', 'success');
    }, [showToast, settingsActions]);

    const handleLoadDemoData = useCallback(() => {
        import('../services/demoData.ts').then(module => {
            loadFromBackup(module.DEMO_DATA as any); // Use destructured action
            // module.DEMO_DATA does not contain settings, so we skip settingsActions.loadFromBackup or pass empty obj
            settingsActions.loadFromBackup({});
            uiActions.setBackupState({ status: 'synced', lastBackup: new Date() }); // Reset backup status
            uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined }); // Reset drive state
            setNotifiche([]); // Use destructured action
            uiActions.setInstallPrompt(null); // Reset PWA state for demo
            uiActions.setCanShowInstallPrompt(false);
            uiActions.setIsGlobalAiLoading(false);
            uiActions.clearNavigationHistory();
            showToast('Dati demo caricati!', 'success');
        });
    }, [showToast, loadFromBackup, setNotifiche, settingsActions, uiActions]);

    const handleCleanDemoData = useCallback(async () => {
        if (confirm("Sei sicuro di voler cancellare TUTTI i dati?")) {
            await deleteBackup();
            await clearIndexedDB();
            resetAll(); // Use destructured action
            settingsActions.reset();
            uiActions.setBackupState({ status: 'synced', lastBackup: null });
            uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
            uiActions.clearNavigationHistory();
            setNotifiche([]); // Use destructured action
            uiActions.setInstallPrompt(null); // Reset PWA state on clear
            uiActions.setCanShowInstallPrompt(false);
            uiActions.setIsGlobalAiLoading(false);
            showToast('Dati eliminati.', 'success');
        }
    }, [showToast, resetAll, setNotifiche, settingsActions, uiActions]);

    const onScheduleLesson = useCallback((data: LessonScheduleInput) => {
        const newLesson: Lezione = {
            id: `les-${Date.now()}`,
            ...data,
            svolta: false,
            tipoLezione: data.tipoLezione || 'Teoria',
            contenuto: data.contenuto || 'Lezione',
        };
        setLessons(prev => ({ ...prev, [newLesson.id]: newLesson })); // Use destructured action
        if (data.slotKey) {
            setSlots(prev => ({
                ...prev,
                [data.slotKey!]: { ...prev[data.slotKey!], lezioneId: newLesson.id, materia: newLesson.materia, classe: newLesson.classe }
            })); // Use destructured action
        }
    }, [setLessons, setSlots]);

    const onSaveUda = useCallback((uda: Uda) => {
        setUdas((prev: Uda[]) => {
            const index = prev.findIndex(u => u.id === uda.id);
            if (index !== -1) {
                const newUdas = [...prev];
                newUdas[index] = uda;
                return newUdas;
            }
            return [...prev, uda];
        });
        showToast('UDA salvata con successo', 'success');
    }, [setUdas, showToast]);

    const onSaveReport = useCallback((report: Report) => {
        setReports((prev: Report[]) => [...prev, report]);
    }, [setReports]);

    const onSaveEvent = useCallback((event: EventoCalendario) => {
        setEventi((prev: EventoCalendario[]) => {
            const index = prev.findIndex(e => e.id === event.id);
            if (index !== -1) {
                const newEventi = [...prev];
                newEventi[index] = event;
                return newEventi;
            }
            return [...prev, event];
        });
    }, [setEventi]);

    const handleGradeSubmission = useCallback((submissionId: string, grade: string, feedback: string) => {
        setSubmissions((prev: HomeworkSubmission[]) => prev.map(s => s.id === submissionId ? { ...s, status: 'graded', teacherFeedback: grade } : s));

        // Find submission to create evaluation
        const sub = submissions?.find(s => s.id === submissionId);
        if (sub) {
            const lesson = lessons[sub.lessonId];
            const newEval: Valutazione = {
                id: `eval-sub-${Date.now()}`,
                studenteId: sub.studentId,
                materia: lesson?.materia || 'Generale',
                data: new Date().toISOString().split('T')[0],
                tipo: 'Pratico',
                voto: grade,
                argomento: lesson?.contenuto || 'Compito',
                note: feedback
            };
            setEvaluations((prev: Valutazione[]) => [...prev, newEval]);
        }
    }, [setSubmissions, submissions, lessons, setEvaluations]);

    const handleAddEvaluation = useCallback((data: EvaluationInput) => {
        const newEval = { ...data, id: `eval-${Date.now()}` };
        setEvaluations(prev => [...prev, newEval]); // Use destructured action
    }, [setEvaluations]);

    const handleCreateUda = useCallback((data: UdaCreateInput) => {
        const newUda = { ...data, id: `uda-${Date.now()}` };
        setUdas(prev => [...prev, newUda]); // Use destructured action
    }, [setUdas]);

    const handleExportData = useCallback(async () => {
        const snapshot = {
            ...dataState,
            settings: settingsState.settings,
            aiSettings: settingsState.aiSettings,
            themeState: settingsState.themeState,
            dismissedSuggestions: Array.from(dismissedSuggestions),
            navigationHistory: uiState.navigationHistory,
            installPrompt: uiState.installPrompt,
            canShowInstallPrompt: uiState.canShowInstallPrompt,
            isGlobalAiLoading: uiState.isGlobalAiLoading,
            backupState: uiState.backupState,
            driveSyncState: uiState.driveSyncState,
        };
        const dataStr = JSON.stringify(snapshot);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `OrarioDoc_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [dataState, settingsState, uiState.navigationHistory, uiState.backupState, uiState.driveSyncState, uiState.installPrompt, uiState.canShowInstallPrompt, uiState.isGlobalAiLoading, dismissedSuggestions]);

    const handleImportData = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                loadFromBackup(data); // Use destructured action
                settingsActions.loadFromBackup(data);
                uiActions.setBackupState(data.backupState || { status: 'synced', lastBackup: null });
                uiActions.setDriveSyncState(data.driveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                uiActions.setNavigationHistory(data.navigationHistory || []);
                uiActions.setInstallPrompt(data.installPrompt || null);
                uiActions.setCanShowInstallPrompt(data.canShowCanShowInstallPrompt || false);
                uiActions.setIsGlobalAiLoading(data.isGlobalAiLoading || false);
                showToast('Dati importati!', 'success');
            } catch (err) {
                showToast('File non valido.', 'error');
            }
        };
        reader.readAsText(file);
    }, [showToast, loadFromBackup, settingsActions, uiActions]);

    const handleInstallApp = useCallback(() => {
        if (uiState.installPrompt) {
            uiState.installPrompt.prompt();
            uiState.installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    uiActions.setInstallPrompt(null);
                    uiActions.setCanShowInstallPrompt(false);
                }
            });
        }
    }, [uiState.installPrompt, uiActions]);

    const handleEnterStudentMode = useCallback(() => {
        handleNavigate('student-dashboard');
    }, [handleNavigate]);

    const handleStartClassroom = useCallback((classe: string, materia: string, slotKey: string, lesson: Lezione) => {
        if (!dataState.draftRegister[slotKey]) {
            const newEntry: RegisterEntry = {
                id: `reg-${Date.now()}`,
                date: new Date().toISOString(),
                slotKey,
                lessonId: lesson.id,
                classe,
                materia,
                studentAttendance: {},
                status: 'draft'
            };
            setDraftRegister(prev => ({ ...prev, [slotKey]: newEntry })); // Use destructured action
        }
        handleNavigate('aula-session', { draftKey: slotKey });
    }, [dataState.draftRegister, handleNavigate, setDraftRegister]);

    const handleEditSlot = useCallback((giorno: string, ora: string) => {
        uiActions.setEditingSlotKey(`${giorno}-${ora}`);
    }, [uiActions]);

    const handleShowSlotActions = useCallback((slot: Slot, lesson: Lezione) => {
        uiActions.setActiveSlotKey(`${slot.giorno}-${slot.ora}`);
        uiActions.setLessonViewContext(lesson);
    }, [uiActions]);

    const handleAiSuggest = useCallback((slot: Slot) => {
        handleNavigate('studio', {
            prompt: `Suggerisci un'attività didattica creativa per la prossima lezione di ${slot.materia} nella classe ${slot.classe}.`,
            targetSlot: slot
        });
        showToast("Preparazione suggerimento AI nello Studio...", "info");
    }, [handleNavigate, showToast]);

    const handleAddNote = useCallback((data: { note: string, studentName?: string }) => {
        const newNote: NotebookNote = {
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            content: data.note,
        };
        const category = data.studentName || viewContext?.classe || 'Generale';
        setNotebookNotes((prev: Record<string, NotebookNote[]>) => ({
            ...prev,
            [category]: [newNote, ...(prev[category] || [])]
        }));
        showToast('Nota aggiunta al notebook', 'success');
    }, [setNotebookNotes, showToast, viewContext]);

    const onMarkAttendance = useCallback((data: { studentName: string, status: string }) => {
        const draftKey = viewContext?.draftKey;
        if (draftKey && dataState.draftRegister[draftKey]) {
            setDraftRegister(prev => ({
                ...prev,
                [draftKey]: {
                    ...prev[draftKey],
                    studentAttendance: {
                        ...prev[draftKey].studentAttendance,
                        [data.studentName]: data.status
                    }
                }
            }));
            showToast(`Presenza di ${data.studentName} aggiornata`, 'success');
        } else {
            showToast('Errore: Registrazione non attiva', 'error');
        }
    }, [setDraftRegister, viewContext, dataState.draftRegister, showToast]);

    const handleOpenBackupInfo = useCallback(() => {
        uiActions.toggleModal('isBackupInfoModalOpen', true);
    }, [uiActions]);

    // FIX: Add implementation for handleOpenOperations
    const handleOpenOperations = useCallback(() => {
        uiActions.toggleModal('isOperationsCenterOpen', true);
    }, [uiActions]);

    const handleAiSuggestionFromHome = useCallback((action: any) => {
        if (action.type === 'navigate') {
            handleNavigate(action.payload);
        }
    }, [handleNavigate]);

    const onAddLessonsWrapper = useCallback((newLessons: Lezione[]) => {
        setLessons(prev => { // Use destructured action
            const updated = { ...prev };
            newLessons.forEach(l => updated[l.id] = l);
            return updated;
        });
    }, [setLessons]);

    const handlePromoteStudents = useCallback((promotedStudents: Studente[], archiveYear: string) => {
        setStudents(promotedStudents); // Use destructured action
        settingsActions.updateSettings({ annoScolasticoCorrente: archiveYear });
        showToast("Studenti promossi.", "success");
    }, [setStudents, settingsActions, showToast]);

    const handleResetYearData = useCallback(async () => {
        setEvaluations([]); // Use destructured action
        setCompetencyEvals([]); // Use destructured action
        setDraftRegister({}); // Use destructured action
        setFinalizedRegister([]); // Use destructured action
        setEventi([]); // Use destructured action
        setReports([]); // Use destructured action
        setUdas([]); // Use destructured action
        setMemos([]); // Use destructured action
        setSubmissions([]); // Use destructured action
        setPianiInclusione({}); // Use destructured action
        setGiudizi({}); // Use destructured action
        showToast("Database operativo resettato.", "info");
    }, [setEvaluations, setCompetencyEvals, setDraftRegister, setFinalizedRegister, setEventi, setReports, setUdas, setMemos, setSubmissions, setPianiInclusione, setGiudizi, showToast]);

    const dismissSuggestionWrapper = useCallback((id: string) => {
        dismissSuggestion(id); // Use destructured action
    }, [dismissSuggestion]);

    // --- AGGREGATE APPSTATE OBJECT ---
    // This object bundles relevant state from all stores for easy access in consuming components.
    // It's a derived state, recreated only when its dependencies change.
    const appStateObject: AppState = useMemo(() => ({
        user, students, lessons, slots, evaluations, competencyEvals, udas, eventi,
        knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports,
        feedSources, draftRegister, finalizedRegister, notebookNotes, memos,
        settings, aiSettings, themeState,
        backupState, driveSyncState,
        installPrompt, canShowInstallPrompt,
        suggestions, studentProfileContext, selectedClassForDashboard,
        activeSuggestion, dismissedSuggestions,
        isGlobalAiLoading, navigationHistory,
        curricula, submissions
    }), [user, students, lessons, slots, evaluations, competencyEvals, udas, eventi,
        knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports,
        feedSources, draftRegister, finalizedRegister, notebookNotes, memos,
        settings, aiSettings, themeState, backupState, driveSyncState, installPrompt,
        canShowInstallPrompt, suggestions, studentProfileContext, selectedClassForDashboard,
        activeSuggestion, dismissedSuggestions, isGlobalAiLoading, navigationHistory,
        curricula, submissions]);

    // --- AGGREGATE ACTIONS OBJECT ---
    // This object bundles actions from all stores and local coordination functions.
    // It's also memoized to prevent unnecessary re-renders of consuming components.
    const actionsObject: AppActions = useMemo(() => ({
        // DataStore Actions
        setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes,
        setMemos, setCurricula, setSubmissions, setSuggestions, setActiveSuggestion,
        dismissSuggestion: dismissSuggestionWrapper,
        setStudentProfileContext, setSelectedClassForDashboard,

        // SettingsStore Actions
        setSettings: settingsActions.setSettings,
        setThemeState: settingsActions.setThemeState,
        setAiSettings: settingsActions.setAiSettings,

        // UIStore Actions (some directly exposed, some wrapped for convenience/history)
        setInstallPrompt: uiActions.setInstallPrompt,
        setCanShowInstallPrompt: uiActions.setCanShowInstallPrompt,
        setIsGlobalAiLoading: uiActions.setIsGlobalAiLoading,
        setNavigationHistory: uiActions.setNavigationHistory,
        addNavigationEntry: uiActions.addNavigationEntry,
        popNavigationEntry: uiActions.popNavigationEntry,
        clearNavigationHistory: uiActions.clearNavigationHistory,
        setBackupState: uiActions.setBackupState,
        setDriveSyncState: uiActions.setDriveSyncState,
        setCircularAnalysisModal: uiActions.setCircularAnalysisModal,
        setIsLoadingModalOpen: (val: boolean) => uiActions.setLoading(val),
        setLoadingModalMessage: (m: string) => uiActions.setLoading(true, m),
        setActiveSlotKey: uiActions.setActiveSlotKey,
        setEditingSlotKey: uiActions.setEditingSlotKey,
        setViewContext: setViewContext,
        setIsVideoAnalysisOpen: uiActions.setIsVideoAnalysisOpen,
        setIsRestoring: uiActions.setIsRestoring,
        showToast,
        clearToast: uiActions.clearToast,

        // Coordination Actions (remaining in AppEngine)
        handleNavigate, handleBack, handleLoadDemoData, handleCleanDemoData,
        handleConfigureDrive, handleConnectDrive, handleDisconnectDrive, handleSyncToDrive,
        handleRestoreFromDrive, pickGoogleDriveFolder, createAppFolder, handleInstallApp,
        handleEnterStudentMode, handleStartClassroom, handleEditSlot, handleShowSlotActions,
        handleAiSuggest, onScheduleLesson, handleAddEvaluation,
        handleCreateUda, handleAddNote, onMarkAttendance,
        handleOpenBackupInfo, handleExportData, handleImportData,
        handleAiSuggestionFromHome,
        handleOpenOperations,
        onAddLessons: onAddLessonsWrapper,
        onSaveUda,
        onSaveReport,
        onSaveEvent,
        handleGradeSubmission,
        handlePromoteStudents,
        handleResetYearData,
    }), [setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes,
        setMemos, setCurricula, setSubmissions, setSuggestions, setActiveSuggestion, dismissSuggestionWrapper,
        setStudentProfileContext, setSelectedClassForDashboard, settingsActions.setSettings, settingsActions.setThemeState,
        settingsActions.setAiSettings, uiActions, showToast, handleNavigate, handleBack, handleLoadDemoData,
        handleCleanDemoData, handleConfigureDrive, handleConnectDrive, handleDisconnectDrive, handleSyncToDrive,
        handleRestoreFromDrive, pickGoogleDriveFolder, createAppFolder, handleInstallApp, handleEnterStudentMode,
        handleStartClassroom, handleEditSlot, handleShowSlotActions, handleAiSuggest, onScheduleLesson,
        handleAddEvaluation, handleCreateUda, handleAddNote, onMarkAttendance, handleOpenBackupInfo,
        handleExportData, handleImportData, handleAiSuggestionFromHome, handleOpenOperations, onAddLessonsWrapper, handlePromoteStudents,
        handleResetYearData, uiActions.setLessonViewContext
    ]);

    // --- PROXY FOR MODALS (FORWARDING ZUSTAND UI ACTIONS) ---
    // This memoized object provides a clean interface for modal visibility and data.
    const modalsProxy = useMemo(() => ({
        isOperationsCenterOpen: uiState.modals.isOperationsCenterOpen,
        setIsOperationsCenterOpen: uiActions.toggleModal.bind(null, 'isOperationsCenterOpen'),
        isImageAnalysisOpen: uiState.modals.isImageAnalysisOpen,
        setIsImageAnalysisOpen: uiActions.toggleModal.bind(null, 'isImageAnalysisOpen'),
        isLiveAssistantModalOpen: uiState.modals.isLiveAssistantModalOpen,
        setIsLiveAssistantModalOpen: uiActions.toggleModal.bind(null, 'isLiveAssistantModalOpen'),
        isHelpOpen: uiState.modals.isHelpOpen,
        setIsHelpOpen: uiActions.toggleModal.bind(null, 'isHelpOpen'),
        circularAnalysisModal: uiState.circularAnalysisModal,
        setCircularAnalysisModal: uiActions.setCircularAnalysisModal,
        isLoadingModalOpen: uiState.modals.isLoadingModalOpen,
        setIsLoadingModalOpen: uiActions.setLoading.bind(null, true),
        loadingModalMessage: uiState.loadingModalMessage,
        setLoadingModalMessage: (msg: string) => uiActions.setLoading(true, msg),
        editingSlotKey: uiState.editingSlotKey,
        setEditingSlotKey: uiActions.setEditingSlotKey,
        activeSlotKey: uiState.activeSlotKey,
        setActiveSlotKey: uiActions.setActiveSlotKey,
        lessonViewContext: uiState.lessonViewContext,
        setLessonViewContext: uiActions.setLessonViewContext,
        toast: uiState.toast,
        isBackupInfoModalOpen: uiState.modals.isBackupInfoModalOpen,
        setIsBackupInfoModalOpen: uiActions.toggleModal.bind(null, 'isBackupInfoModalOpen'),
        syncConflictModal: uiState.syncConflictModal,
        setSyncConflictModal: uiActions.setSyncConflictModal,
        createLessonContext: uiState.createLessonContext,
        setCreateLessonContext: uiActions.setCreateLessonContext,
        isYearTransitionOpen: uiState.modals.isYearTransitionOpen,
        setIsYearTransitionOpen: uiActions.toggleModal.bind(null, 'isYearTransitionOpen'),
        setIsVideoAnalysisOpen: uiActions.setIsVideoAnalysisOpen,
        setIsRestoring: uiActions.setIsRestoring,
        setNotifiche: setNotifiche,
    }), [uiState, uiActions, setNotifiche]);


    return {
        view,
        viewContext,
        appState: appStateObject,
        actions: actionsObject,
        modals: modalsProxy
    };
};
