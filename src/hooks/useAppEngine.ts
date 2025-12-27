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
import { validateBackupData } from '../utils/dataValidator.ts';
import { useUIStore } from '../stores/useUIStore';
import { messages } from '../messages';
import { useDataStore } from '../stores/useDataStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export const useAppEngine = () => {
    // Test mode detection: when true, skip heavy restore and set a demo user
    const isTestMode = (typeof window !== 'undefined' && (window as any).__TEST_MODE === true) || ((import.meta as any).env && (import.meta as any).env.VITE_TEST_MODE === 'true');

    // --- STORES (Accessed directly via Proxy lazy-init pattern) ---
    const { user, students, lessons, slots, evaluations, competencyEvals, udas, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, curricula, submissions, suggestions, activeSuggestion, dismissedSuggestions, studentProfileContext, selectedClassForDashboard, actions: dataActions } = useDataStore();
    const { modals, circularAnalysisModal, syncConflictModal, createLessonContext, editingSlotKey, activeSlotKey, lessonViewContext, loadingModalMessage, toast, installPrompt, canShowInstallPrompt, isGlobalAiLoading, navigationHistory, backupState, driveSyncState, actions: uiActions } = useUIStore();
    const { settings, aiSettings, themeState, actions: settingsActions } = useSettingsStore();

    // --- DESTRUTTURE ACTIONS ---
    const { 
        setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes,
        setMemos, setCurricula, setSubmissions, setSuggestions, setActiveSuggestion, dismissSuggestion,
        setStudentProfileContext, setSelectedClassForDashboard, loadFromBackup, resetAll
    } = dataActions;

    // --- LOCAL STATE (NAVIGATION ONLY) ---
    const [view, setView] = useState<View>('home');
    const [viewContext, setViewContext] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

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

                // In test mode skip IndexedDB restore and set a lightweight demo user/state
                if (isTestMode) {
                    console.info('[useAppEngine] Test mode detected — skipping restore and injecting demo user');
                    setUser({ id: 'test-local', displayName: 'Test Teacher' } as any);
                    settingsActions.loadFromBackup({});
                    uiActions.setBackupState({ status: 'synced', lastBackup: null } as any);
                    uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined } as any);
                    uiActions.setNavigationHistory([] as any);
                    // attempt to load KB from IndexedDB but non-blocking
                    try { /* no-op for test */ } catch { }
                    setIsDataLoaded(true);
                    uiActions.setIsRestoring(false);
                    return;
                }

                const rawData = await loadBackup();
                const localData = rawData ? validateBackupData(rawData) : null;
                
                if (localData) {
                    console.log('[useAppEngine] Valid backup data found, restoring...');
                    // Dispatch to DataStore
                    loadFromBackup(localData as any);
                    // Dispatch to SettingsStore
                    settingsActions.loadFromBackup({
                        settings: (localData as any).settings,
                        aiSettings: (localData as any).aiSettings,
                        themeState: (localData as any).themeState
                    });
                    // Dispatch UI-related states to UIStore
                    uiActions.setBackupState(localData.backupState as BackupState || { status: 'synced', lastBackup: null });
                    uiActions.setDriveSyncState(localData.driveSyncState as DriveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                    uiActions.setNavigationHistory(localData.navigationHistory as any[] || []);
                    uiActions.setInstallPrompt(null); // Non-serializable, always start fresh
                    uiActions.setCanShowInstallPrompt(false);
                    uiActions.setIsGlobalAiLoading(false);

                    // Handle heavy KB content from IndexedDB separately
                    try {
                        const kbContentMap = await loadKbContentFromIndexedDB();
                        const fullKb = (localData.knowledgeBase || []).map((entry: any) => ({
                            ...entry,
                            ...(kbContentMap[entry.id] || {})
                        }));
                        setKnowledgeBase(fullKb);
                    } catch (kbError) {
                        console.warn('[useAppEngine] KB content load failed, using light data:', kbError);
                    }
                } else {
                    console.log('[useAppEngine] No valid backup, loading demo data...');
                    // AUTO LOAD DEMO DATA IF EMPTY (Only on first run)
                    setTimeout(() => {
                        handleLoadDemoData();
                    }, 500);
                }
            } catch (e) {
                console.error("[useAppEngine] Initial data load failed:", e);
                // In case of critical error, start fresh
                resetAll();
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
        if (navigationHistory.length > 0) {
            const last = navigationHistory[navigationHistory.length - 1];
            uiActions.popNavigationEntry();
            setView(last.view);
            setViewContext(last.context);
        } else if (view !== 'home' || force) {
            setView('home');
            setViewContext(null);
        }
    }, [navigationHistory, view]);

    // Centralized toast dispatcher using messages.ts
    const showToast = useCallback((messageKey: string, type: 'success' | 'error' | 'info' = 'info') => {
        // If the messageKey is a known key in messages.toast, use it, else fallback to the string
        const msg = (messages.toast as any)[messageKey] || messageKey;
        uiActions.showToast(msg, type);
    }, []);

    const handleConnectDrive = useCallback(() => {
        const initialized = initTokenClient((tokenResponse) => {
            uiActions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true }));
            showToast('driveConnected', 'success');
        }, settings.googleClientId);

        if (initialized) requestAccessToken();
        else showToast('driveInitError', 'error');
    }, [settings.googleClientId]);

    const handleDisconnectDrive = useCallback(() => {
        revokeAccessToken();
        uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
        showToast('driveDisconnected', 'info');
    }, []);

    const handleSyncToDrive = useCallback(async (folderId?: string) => {
        const driveState = driveSyncState;
        if (!driveState.isAuthenticated) return;

        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
        try {
            const remoteMeta = await getBackupMetadata(folderId || settings.backupFolderId || '') as any;
            if (remoteMeta && remoteMeta.modifiedTime && driveState.lastSyncTime && new Date(remoteMeta.modifiedTime) > new Date(driveState.lastSyncTime)) {
                uiActions.setSyncConflictModal({
                    isOpen: true,
                    data: {
                        remoteTime: new Date(remoteMeta.modifiedTime).getTime(),
                        localTime: new Date(driveState.lastSyncTime).getTime(),
                        isOpen: true
                    }
                });
                uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
                return;
            }

            // Create a serializable payload from all Zustand stores
            const payload = {
                user,
                students,
                lessons,
                slots,
                evaluations,
                competencyEvals,
                udas,
                eventi,
                knowledgeBase,
                corpora,
                notifiche,
                rubriche,
                pianiInclusione,
                giudizi,
                reports,
                feedSources,
                draftRegister,
                finalizedRegister,
                notebookNotes,
                memos,
                curricula,
                submissions,
                suggestions,
                activeSuggestion,
                studentProfileContext,
                selectedClassForDashboard,
                settings: settings,
                aiSettings: aiSettings,
                themeState: themeState,
                // Convert Set to Array for serialization
                dismissedSuggestions: Array.from(dismissedSuggestions),
                // Include current values from UI state
                backupState: backupState,
                driveSyncState: driveSyncState,
                navigationHistory: navigationHistory,
                installPrompt: installPrompt,
                canShowInstallPrompt: canShowInstallPrompt,
                isGlobalAiLoading: isGlobalAiLoading,
            };

            await uploadBackup(payload, folderId || settings.backupFolderId);
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false, lastSyncTime: new Date() }));
            showToast('success', 'success');
        } catch (e: any) {
            showToast('error', 'error');
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false, error: e.message }));
        }
    }, [user, students, lessons, slots, evaluations, competencyEvals, udas, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, curricula, submissions, suggestions, activeSuggestion, studentProfileContext, selectedClassForDashboard, settings, aiSettings, themeState, driveSyncState, navigationHistory, uiActions, showToast, installPrompt, canShowInstallPrompt, isGlobalAiLoading, dismissedSuggestions, backupState]);

    const handleRestoreFromDrive = useCallback(async (folderId?: string) => {
        if (!driveSyncState.isAuthenticated) return;

        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
        uiActions.setIsRestoring(true);

        try {
            const restoredData = await downloadBackup(folderId || settings.backupFolderId || '');
            if (restoredData) {
                // Dispatch to DataStore
                loadFromBackup(restoredData); // Use destructured action
                // Dispatch to SettingsStore
                settingsActions.loadFromBackup({
                    settings: (restoredData as any).settings,
                    aiSettings: (restoredData as any).aiSettings,
                    themeState: (restoredData as any).themeState
                });
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
                showToast('restoreSuccess', 'success');
            }
        } catch (e: any) {
            showToast('restoreError', 'error');
            uiActions.setDriveSyncState(prev => ({ ...prev, error: e.message }));
        } finally {
            uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
            uiActions.setIsRestoring(false);
        }
    }, [loadFromBackup, setKnowledgeBase, settingsActions, driveSyncState, uiActions, settings.backupFolderId, showToast]);

    const handleConfigureDrive = useCallback((clientId: string, apiKey?: string) => {
        settingsActions.updateSettings({ googleClientId: clientId, googleApiKey: apiKey });
        showToast('driveConfigUpdated', 'success');
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
            showToast('demoLoaded', 'success');
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
            showToast('delete', 'success');
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
        showToast('udaSaved', 'success');
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
            user,
            students,
            lessons,
            slots,
            evaluations,
            competencyEvals,
            udas,
            eventi,
            knowledgeBase,
            corpora,
            notifiche,
            rubriche,
            pianiInclusione,
            giudizi,
            reports,
            feedSources,
            draftRegister,
            finalizedRegister,
            notebookNotes,
            memos,
            curricula,
            submissions,
            suggestions,
            activeSuggestion,
            studentProfileContext,
            selectedClassForDashboard,
            settings: settings,
            aiSettings: aiSettings,
            themeState: themeState,
            dismissedSuggestions: Array.from(dismissedSuggestions),
            navigationHistory: navigationHistory,
            installPrompt: installPrompt,
            canShowInstallPrompt: canShowInstallPrompt,
            isGlobalAiLoading: isGlobalAiLoading,
            backupState: backupState,
            driveSyncState: driveSyncState,
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
    }, [user, students, lessons, slots, evaluations, competencyEvals, udas, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reports, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, curricula, submissions, settings, aiSettings, themeState, navigationHistory, backupState, driveSyncState, installPrompt, canShowInstallPrompt, isGlobalAiLoading, dismissedSuggestions]);

    const handleImportData = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                loadFromBackup(data); // Use destructured action
                settingsActions.loadFromBackup({
                    settings: data.settings,
                    aiSettings: data.aiSettings,
                    themeState: data.themeState
                });
                uiActions.setBackupState(data.backupState || { status: 'synced', lastBackup: null });
                uiActions.setDriveSyncState(data.driveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                uiActions.setNavigationHistory(data.navigationHistory || []);
                uiActions.setInstallPrompt(data.installPrompt || null);
                uiActions.setCanShowInstallPrompt(data.canShowCanShowInstallPrompt || false);
                uiActions.setIsGlobalAiLoading(data.isGlobalAiLoading || false);
                showToast('imported', 'success');
            } catch (err) {
                showToast('invalidFile', 'error');
            }
        };
        reader.readAsText(file);
    }, [showToast, loadFromBackup, settingsActions, uiActions]);

    const handleInstallApp = useCallback(() => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    uiActions.setInstallPrompt(null);
                    uiActions.setCanShowInstallPrompt(false);
                }
            });
        }
    }, [installPrompt, uiActions]);

    const handleEnterStudentMode = useCallback(() => {
        handleNavigate('student-dashboard');
    }, [handleNavigate]);

    const handleStartClassroom = useCallback((classe: string, materia: string, slotKey: string, lesson: Lezione) => {
        if (!draftRegister[slotKey]) {
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
    }, [draftRegister, handleNavigate, setDraftRegister]);

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
        showToast('aiSuggestionPrep', 'info');
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
        showToast('noteAdded', 'success');
    }, [setNotebookNotes, showToast, viewContext]);

    const onMarkAttendance = useCallback((data: { studentName: string, status: string }) => {
        const draftKey = viewContext?.draftKey;
        if (draftKey && draftRegister[draftKey]) {
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
            showToast('attendanceUpdated', 'success');
        } else {
            showToast('registerError', 'error');
        }
    }, [setDraftRegister, viewContext, draftRegister, showToast]);

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
        showToast('studentsPromoted', 'success');
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
        showToast('dbReset', 'info');
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
        setBackupState: (input: Partial<BackupState> | ((prev: BackupState) => Partial<BackupState>)) => {
            if (typeof input === 'function') {
                uiActions.setBackupState((prev: BackupState) => {
                    const partial = input(prev);
                    return { ...prev, ...partial } as BackupState;
                });
            } else {
                uiActions.setBackupState(prev => ({ ...prev, ...input } as BackupState));
            }
        },
        setDriveSyncState: (input: Partial<DriveSyncState> | ((prev: DriveSyncState) => Partial<DriveSyncState>)) => {
            if (typeof input === 'function') {
                uiActions.setDriveSyncState((prev: DriveSyncState) => {
                    const partial = input(prev);
                    return { ...prev, ...partial } as DriveSyncState;
                });
            } else {
                uiActions.setDriveSyncState(prev => ({ ...prev, ...input } as DriveSyncState));
            }
        },
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
        isOperationsCenterOpen: modals.isOperationsCenterOpen,
        setIsOperationsCenterOpen: uiActions.toggleModal.bind(null, 'isOperationsCenterOpen'),
        isImageAnalysisOpen: modals.isImageAnalysisOpen,
        setIsImageAnalysisOpen: uiActions.toggleModal.bind(null, 'isImageAnalysisOpen'),
        isLiveAssistantModalOpen: modals.isLiveAssistantModalOpen,
        setIsLiveAssistantModalOpen: uiActions.toggleModal.bind(null, 'isLiveAssistantModalOpen'),
        isHelpOpen: modals.isHelpOpen,
        setIsHelpOpen: uiActions.toggleModal.bind(null, 'isHelpOpen'),
        circularAnalysisModal: circularAnalysisModal,
        setCircularAnalysisModal: uiActions.setCircularAnalysisModal,
        isLoadingModalOpen: modals.isLoadingModalOpen,
        setIsLoadingModalOpen: uiActions.setLoading.bind(null, true),
        loadingModalMessage: loadingModalMessage,
        setLoadingModalMessage: (msg: string) => uiActions.setLoading(true, msg),
        editingSlotKey: editingSlotKey,
        setEditingSlotKey: uiActions.setEditingSlotKey,
        activeSlotKey: activeSlotKey,
        setActiveSlotKey: uiActions.setActiveSlotKey,
        lessonViewContext: lessonViewContext,
        setLessonViewContext: uiActions.setLessonViewContext,
        toast: toast,
        isBackupInfoModalOpen: modals.isBackupInfoModalOpen,
        setIsBackupInfoModalOpen: uiActions.toggleModal.bind(null, 'isBackupInfoModalOpen'),
        syncConflictModal: syncConflictModal,
        setSyncConflictModal: uiActions.setSyncConflictModal,
        createLessonContext: createLessonContext,
        setCreateLessonContext: uiActions.setCreateLessonContext,
        isYearTransitionOpen: modals.isYearTransitionOpen,
        setIsYearTransitionOpen: uiActions.toggleModal.bind(null, 'isYearTransitionOpen'),
        isVideoAnalysisOpen: modals.isVideoAnalysisOpen,
        setIsVideoAnalysisOpen: uiActions.setIsVideoAnalysisOpen,
        isRestoring: modals.isRestoring,
        setIsRestoring: uiActions.setIsRestoring,
        setNotifiche: setNotifiche,
    }), [modals, circularAnalysisModal, syncConflictModal, createLessonContext, editingSlotKey, activeSlotKey, lessonViewContext, loadingModalMessage, toast, uiActions, setNotifiche]);


    return {
        view,
        viewContext,
        appState: appStateObject,
        actions: actionsObject,
        modals: modalsProxy
    };
};
