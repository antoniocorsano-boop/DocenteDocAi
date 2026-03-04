/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    AppState, AppActions, UserProfile, TimetableSettings, AiSettings, AppThemeState,
    Studente, Lezione, Slot, Valutazione, ValutazioneCompetenza, Uda, EventoCalendario,
    KnowledgeBaseEntry, Corpus, Notifica, Rubrica, PianoInclusione, GiudizioPeriodico,
    Report, FeedSource, RegisterEntry, NotebookNote, ToDoItem, AiSuggestion, SystemSuggestion,
    BackupState, DriveSyncState, View, CurriculumSubject, HomeworkSubmission,
    LessonScheduleInput, EvaluationInput, UdaCreateInput, BeforeInstallPromptEvent,
    BackupPayload
} from '../types.ts';
import { loadBackup, deleteBackup } from '../services/backupService';
import { loadKbContentFromIndexedDB, saveKbContentToIndexedDB, clearIndexedDB } from '../services/indexedDbService';
import { initTokenClient, requestAccessToken, revokeAccessToken, uploadBackup, downloadBackup, getBackupMetadata, pickGoogleDriveFolder, createAppFolder } from '../services/googleDriveService';
import { usePersistence } from './usePersistence';
import { analyzeSystemState } from '../utils/suggestionUtils';
import { validateBackupData } from '../utils/dataValidator';
import { ImportService } from '../services/importService';
import { useUIStore } from '../stores/useUIStore';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import type { SyncConflictData } from '../types';
import { messages } from '../messages';
import { useSettingsStore } from '../stores/useSettingsStore';
import { errorLogger } from '../services/errorLogger';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppEngine = () => {
    // Test mode detection: when true, skip heavy restore and set a demo user
    const isTestMode = (typeof window !== 'undefined' && (window as { __TEST_MODE?: boolean }).__TEST_MODE === true) || ((import.meta as ImportMeta).env?.VITE_TEST_MODE === 'true');

    // --- STORES (Accessed directly via Proxy lazy-init pattern) ---
    const { students, evaluations, competencyEvals, pianiInclusione, studentProfileContext, selectedClassForDashboard, orientamentoActivities, ePortfolioEntries, studentOrientamentoStates, actions: studentActions } = useStudentStore();
    const { lessons, slots, uda, eventi, rubriche, curricula, submissions, draftRegister, finalizedRegister, giudizi, reportistica, actions: academicActions } = useAcademicStore();
    const { user, knowledgeBase, corpora, notifiche, feedSources, suggestions, activeSuggestion, dismissedSuggestions, analyticsEvents, analyticsMetrics, analyticsSettings, templates, actions: systemActions } = useSystemStore();
    
    const { modals, circularAnalysisModal, syncConflictModal, createLessonContext, editingSlotKey, activeSlotKey, lessonViewContext, loadingModalMessage, toast, installPrompt, canShowInstallPrompt, isGlobalAiLoading, navigationHistory, backupState, driveSyncState, actions: uiActions } = useUIStore();
    const { settings, aiSettings, themeState, actions: settingsActions } = useSettingsStore();

    // --- DESTRUTTURE ACTIONS ---
    const { setStudents, setEvaluations, setCompetencyEvals, setPianiInclusione, setStudentProfileContext, setSelectedClassForDashboard, setOrientamentoActivities, setEPortfolioEntries, setStudentOrientamentoStates } = studentActions;
    const { setLessons, setSlots, setUda, setEventi, setRubriche, setCurricula, setSubmissions, setDraftRegister, setFinalizedRegister, setGiudizi, setReportistica } = academicActions;
    const { setUser, setKnowledgeBase, setCorpora, setNotifiche, setFeedSources, setSuggestions, setActiveSuggestion, trackAnalyticsEvent, setTemplates, dismissSuggestion, reactivateSuggestion } = systemActions;

    // --- LOCAL STATE (NAVIGATION ONLY) ---
    const [view, setView] = useState<View>('home');
    const [viewContext, setViewContext] = useState<Record<string, unknown> | null>(null);
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

                // In test mode: try to restore test-injected backup if present, otherwise fall back to lightweight demo user/state
                if (isTestMode) {
                    console.info('[useAppEngine] Test mode detected — attempting test backup restore or injecting demo user');
                    // Basic test user so traces and instrumentation have a user immediately
                    setUser({ id: 'test-local', displayName: 'Test Teacher' } as { id: string; displayName: string });
                    settingsActions.loadFromBackup({});
                    uiActions.setBackupState({ status: 'synced', lastBackup: null } as BackupState);
                    uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined } as any);
                    uiActions.setNavigationHistory([] as { view: View; context: unknown }[]);
                    // Impedisci apertura automatica modale Assistant in test
                    if (uiActions.toggleModal) uiActions.toggleModal('isLiveAssistantModalOpen', false);

                    // If test harness injected a backup into IndexedDB (used by E2E), try to load it.
                    try {
                        const raw = await loadBackup();
                        const localData = raw ? validateBackupData(raw) : null;
                        if (localData) {
                            console.info('[useAppEngine] Test backup found — restoring test data');
                            studentActions.loadFromBackup(localData);
                            academicActions.loadFromBackup(localData);
                            systemActions.loadFromBackup(localData);
                            settingsActions.loadFromBackup({
                                settings: localData.settings,
                                aiSettings: localData.aiSettings,
                                themeState: localData.themeState
                            });
                            uiActions.setBackupState(localData.backupState || { status: 'synced', lastBackup: null });
                            uiActions.setDriveSyncState(localData.driveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                            uiActions.setNavigationHistory(localData.navigationHistory || []);
                            try {
                                const kbContentMap = await loadKbContentFromIndexedDB();
                                const fullKb = (localData.knowledgeBase || []).map((entry: any) => ({
                                    ...entry,
                                    ...(kbContentMap[entry.id] || {})
                                }));
                                setKnowledgeBase(fullKb);
                            } catch (kbError) {
                                console.warn('[useAppEngine] KB content load failed during test restore, using light data:', kbError);
                            }
                        } else {
                            console.info('[useAppEngine] No test backup injected, using demo-light state');
                            // Load demo data so tests have predictable UDA content for Gantt
                            try {
                                setTimeout(() => {
                                    handleLoadDemoData();
                                }, 200);
                            } catch (e) {
                                console.warn('[useAppEngine] Failed to trigger demo load in test mode:', e);
                            }
                        }
                    } catch (e) {
                        console.warn('[useAppEngine] Test backup restore attempt failed:', e);
                    }

                    setIsDataLoaded(true);
                    uiActions.setIsRestoring(false);
                    return;
                }

                const rawData = await loadBackup();
                const localData = rawData ? validateBackupData(rawData) : null;
                
                if (localData) {
                    console.log('[useAppEngine] Valid backup data found, restoring...');
                    // Dispatch to Domain Stores
                    studentActions.loadFromBackup(localData);
                    academicActions.loadFromBackup(localData);
                    systemActions.loadFromBackup(localData);
                    
                    // Dispatch to SettingsStore
                    settingsActions.loadFromBackup({
                        settings: localData.settings,
                        aiSettings: localData.aiSettings,
                        themeState: localData.themeState
                    });
                    // Dispatch UI-related states to UIStore
                    uiActions.setBackupState(localData.backupState || { status: 'synced', lastBackup: null });
                    uiActions.setDriveSyncState(localData.driveSyncState || { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                    uiActions.setNavigationHistory(localData.navigationHistory || []);
                    uiActions.setInstallPrompt(null); // Non-serializzabile, sempre inizia da zero
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
                studentActions.resetStudentData();
                academicActions.resetAcademicData();
                systemActions.resetSystemData();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only setup once on mount

    // --- SYSTEM SUGGESTION ENGINE (Coordinates data to produce UI suggestion) ---
    useEffect(() => {
        // Only run once data is loaded and stable
        if (!isDataLoaded) return;
        
        const timer = setTimeout(() => {
            const suggestion = analyzeSystemState(
                students,
                slots,
                uda,
                eventi,
                evaluations
            );
            systemActions.setActiveSuggestion(suggestion);
        }, 5000);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataLoaded, students, slots, uda, eventi, evaluations]);

    // --- AI SUGGESTIONS GENERATOR (Personalized suggestions with caching and scoring) ---
    useEffect(() => {
        // Only run once data is loaded and stable, and not in test mode to avoid AI calls
        if (!isDataLoaded || isTestMode) return;

        const generateSuggestions = async () => {
            try {
                const { generateAiSuggestions } = await import('../utils/aiSuggestionGenerator');
                const aiSuggestions = await generateAiSuggestions({
                    user,
                    students,
                    lessons,
                    slots,
                    evaluations,
                    competencyEvals,
                    uda,
                    eventi,
                    knowledgeBase,
                    corpora,
                    rubriche,
                    pianiInclusione,
                    giudizi,
                    reportistica,
                    feedSources,
                    draftRegister,
                    finalizedRegister,
                    curricula,
                    submissions,
                    notifiche,
                    suggestions,
                    activeSuggestion,
                    dismissedSuggestions,
                    studentProfileContext,
                    selectedClassForDashboard,
                    actions: { ...studentActions, ...academicActions, ...systemActions }
                } as any);
                systemActions.setSuggestions(aiSuggestions);
            } catch (error) {
                console.error('[useAppEngine] AI suggestions generation failed:', error);
                // Fallback is handled in aiSuggestionGenerator
            }
        };

        generateSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataLoaded, isTestMode]); // Re-run if data changes significantly

    // --- CORE ACTIONS (COORDINATION AND UI DISPATCH) ---
    // These actions are managed by AppEngine but dispatch to Zustand stores.

    // Centralized toast dispatcher using messages.ts
    const showToast = useCallback((messageKey: string, type: 'success' | 'error' | 'info' = 'info') => {
        // If the messageKey is a known key in messages.toast, use it, else fallback to the string
        const msg = (messages.toast as any)[messageKey] || messageKey;
        uiActions.showToast(msg, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNavigate = useCallback((newView: View, context: any = null) => {
        try {
            uiActions.addNavigationEntry({ view, context: viewContext }); // Save current view to history
            setView(newView);
            setViewContext(context);
            window.scrollTo(0, 0);
            
            // Log successful navigation
            errorLogger.logInfo(
                `Navigated to ${newView}`,
                'navigation',
                { fromView: view, toView: newView, hasContext: !!context }
            );
        } catch (error) {
            errorLogger.logNavigationError(newView, error as Error, view);
            showToast('Errore durante la navigazione', 'error');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, viewContext, showToast]); // Remove uiActions from deps - it's stable from zustand

    const handleBack = useCallback((force = false) => {
        if (navigationHistory.length > 0) {
            const last = navigationHistory[navigationHistory.length - 1];
            uiActions.popNavigationEntry();
            setView(last.view);
            setViewContext(last.context as Record<string, unknown> | null);
        } else if (view !== 'home' || force) {
            setView('home');
            setViewContext(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigationHistory, view]);

    const handleConnectDrive = useCallback(() => {
        const initialized = initTokenClient((tokenResponse) => {
            uiActions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true }));
            showToast('driveConnected', 'success');
        }, settings.googleClientId);

        if (initialized) requestAccessToken();
        else showToast('driveInitError', 'error');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.googleClientId]);

    const handleDisconnectDrive = useCallback(() => {
        revokeAccessToken();
        uiActions.setDriveSyncState({ isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
        showToast('driveDisconnected', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    } as any
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
                uda,
                eventi,
                knowledgeBase,
                corpora,
                notifiche,
                rubriche,
                pianiInclusione,
                giudizi,
                reportistica,
                feedSources,
                draftRegister,
                finalizedRegister,
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
    }, [user, students, lessons, slots, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, curricula, submissions, suggestions, activeSuggestion, studentProfileContext, selectedClassForDashboard, settings, aiSettings, themeState, driveSyncState, navigationHistory, uiActions, showToast, installPrompt, canShowInstallPrompt, isGlobalAiLoading, dismissedSuggestions, backupState]);

    // --- AUTO-SYNC EFFECT ---
    useEffect(() => {
        if (!isDataLoaded || !settings.autoSyncEnabled || !driveSyncState.isAuthenticated) return;

        const interval = setInterval(() => {
            handleSyncToDrive();
        }, (settings.autoSyncInterval || 30) * 60 * 1000);

        return () => clearInterval(interval);
    }, [isDataLoaded, settings.autoSyncEnabled, settings.autoSyncInterval, driveSyncState.isAuthenticated, handleSyncToDrive]);

    const handleRestoreFromDrive = useCallback(async (folderId?: string) => {
        if (!driveSyncState.isAuthenticated) return;

        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
        uiActions.setIsRestoring(true);

        try {
            const restoredData = await downloadBackup(folderId || settings.backupFolderId || '') as any;
            if (restoredData) {
                // Dispatch to Domain Stores
                studentActions.loadFromBackup(restoredData);
                academicActions.loadFromBackup(restoredData);
                systemActions.loadFromBackup(restoredData);

                // Dispatch to SettingsStore
                settingsActions.loadFromBackup({
                    settings: restoredData.settings,
                    aiSettings: restoredData.aiSettings,
                    themeState: restoredData.themeState
                });
                // Dispatch UI-related states to UIStore
                uiActions.setBackupState(restoredData.backupState ?? { status: 'synced', lastBackup: new Date() });
                uiActions.setDriveSyncState(restoredData.driveSyncState ?? { isAuthenticated: true, isSyncing: false, lastSyncTime: new Date() });
                uiActions.setNavigationHistory(restoredData.navigationHistory ?? []);
                uiActions.setInstallPrompt(restoredData.installPrompt ?? null);
                uiActions.setCanShowInstallPrompt(restoredData.canShowInstallPrompt ?? false);
                uiActions.setIsGlobalAiLoading(restoredData.isGlobalAiLoading ?? false);

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
    }, [studentActions, academicActions, systemActions, setKnowledgeBase, settingsActions, driveSyncState, uiActions, settings.backupFolderId, showToast]);

    const handleConfigureDrive = useCallback((clientId: string, apiKey?: string) => {
        settingsActions.updateSettings({ googleClientId: clientId, googleApiKey: apiKey });
        showToast('driveConfigUpdated', 'success');
    }, [showToast, settingsActions]);

    const handleLoadDemoData = useCallback(() => {
        import('../services/demoData.ts').then(module => {
            studentActions.loadFromBackup(module.DEMO_DATA as any);
            academicActions.loadFromBackup(module.DEMO_DATA as any);
            systemActions.loadFromBackup(module.DEMO_DATA as any);
            
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
    }, [showToast, studentActions, academicActions, systemActions, setNotifiche, settingsActions, uiActions]);

    const handleCleanDemoData = useCallback(async () => {
        if (confirm("Sei sicuro di voler cancellare TUTTI i dati?")) {
            await deleteBackup();
            await clearIndexedDB();
            studentActions.resetStudentData();
            academicActions.resetAcademicData();
            systemActions.resetSystemData();
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
    }, [showToast, studentActions, academicActions, systemActions, setNotifiche, settingsActions, uiActions]);

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
        setUda((prev: Uda[]) => {
            const index = prev.findIndex(u => u.id === uda.id);
            if (index !== -1) {
                const newUdaArr = [...prev];
                newUdaArr[index] = uda;
                return newUdaArr;
            }
            return [...prev, uda];
        });
        showToast('udaSaved', 'success');
    }, [setUda, showToast]);

    const onSaveReport = useCallback((report: Report) => {
        setReportistica((prev: Report[]) => [...prev, report]);
    }, [setReportistica]);

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
        const newUda: Uda = {
            id: `uda-${Date.now()}`,
            title: 'New UDA',
            classe: 'Default Class',
            materia: 'Default Subject',
            introduction: 'Introduction text',
            finalProduct: 'Final product description',
            competencyIds: [],
            phases: [],
            evaluation: 'Evaluation text',
            tools: 'Tools description',
            startPos: 0,
            width: 100,
            color: 'var(--md-sys-color-primary)',
            borderColor: 'var(--md-sys-color-outline)',
            textColor: 'var(--md-sys-color-on-primary)',
        };
        setUda(prev => [...prev, newUda]); // Use destructured action
    }, [setUda]);

    const handleExportData = useCallback(async () => {
        const snapshot = {
            user,
            students,
            lessons,
            slots,
            evaluations,
            competencyEvals,
            uda,
            eventi,
            knowledgeBase,
            corpora,
            notifiche,
            rubriche,
            pianiInclusione,
            giudizi,
            reportistica,
            feedSources,
            draftRegister,
            finalizedRegister,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, students, lessons, slots, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, curricula, submissions, settings, aiSettings, themeState, navigationHistory, backupState, driveSyncState, installPrompt, canShowInstallPrompt, isGlobalAiLoading, dismissedSuggestions]);

    const handleImportData = useCallback(async (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        // Case 1: Standard JSON Backup
        if (extension === 'json') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    
                    // Check if it's a full backup (has settings or multiple stores)
                    if (data.settings || data.students || data.lessons) {
                        studentActions.loadFromBackup(data);
                        academicActions.loadFromBackup(data);
                        systemActions.loadFromBackup(data);

                        settingsActions.loadFromBackup({
                            settings: data.settings,
                            aiSettings: data.aiSettings,
                            themeState: data.themeState
                        });
                        uiActions.setBackupState(data.backupState ?? { status: 'synced', lastBackup: null });
                        uiActions.setDriveSyncState(data.driveSyncState ?? { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined });
                        showToast('imported', 'success');
                        return;
                    }
                    
                    // Otherwise treat as generic import
                    const result = await ImportService.parseFile(file);
                    if (result.students.length > 0) {
                        studentActions.importStudents(result.students);
                        if (result.evaluations.length > 0) {
                            studentActions.importEvaluations(result.evaluations);
                        }
                        showToast('imported', 'success');
                    } else {
                        showToast('invalidFile', 'error');
                    }
                } catch (err) {
                    showToast('invalidFile', 'error');
                }
            };
            reader.readAsText(file);
        } 
        // Case 2: External Register Files (CSV, Excel)
        else {
            try {
                const result = await ImportService.parseFile(file);
                if (result.students.length > 0) {
                    studentActions.importStudents(result.students);
                    if (result.evaluations.length > 0) {
                        studentActions.importEvaluations(result.evaluations);
                    }
                    showToast('imported', 'success');
                } else if (result.errors.length > 0) {
                    console.error('Import errors:', result.errors);
                    showToast('invalidFile', 'error');
                } else {
                    showToast('invalidFile', 'error');
                }
            } catch (err) {
                showToast('invalidFile', 'error');
            }
        }
    }, [showToast, studentActions, academicActions, systemActions, settingsActions, uiActions]);

    const handleInstallApp = useCallback(() => {
        if (installPrompt && typeof (installPrompt as any).prompt === 'function') {
            (installPrompt as any).prompt();
            (installPrompt as any).userChoice?.then((choiceResult: any) => {
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

    const onMarkAttendance = useCallback((data: { studentName: string, status: "presente" | "assente" | "ritardo" }) => {
        const { studentName, status } = data;
        const draftKey = viewContext?.draftKey;
        if (draftKey && draftRegister[draftKey as string]) {
            setDraftRegister(prev => ({
                ...prev,
                [draftKey as string]: {
                    ...prev[draftKey as string],
                    studentAttendance: {
                        ...prev[draftKey as string].studentAttendance,
                        [studentName]: status,
                    },
                },
            }));
            showToast('attendanceMarked', 'success');
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
        setReportistica([]); // Use destructured action
        setUda([]); // Use destructured action
        setSubmissions([]); // Use destructured action
        setPianiInclusione({}); // Use destructured action
        setGiudizi({}); // Use destructured action
        showToast('dbReset', 'info');
    }, [setEvaluations, setCompetencyEvals, setDraftRegister, setFinalizedRegister, setEventi, setReportistica, setUda, setSubmissions, setPianiInclusione, setGiudizi, showToast]);

    const dismissSuggestionWrapper = useCallback((id: string) => {
        const updatedSuggestions = suggestions.filter((suggestion: AiSuggestion) => suggestion.id !== id);

        systemActions.setSuggestions(updatedSuggestions);
        systemActions.dismissSuggestion(id);
        showToast('Suggestion dismissed', 'info');
    }, [suggestions, showToast, systemActions]);

    const handleAddNote = useCallback((data: { note: string, studentName?: string }) => {
        showToast(`Nota aggiunta${data.studentName ? ` per ${data.studentName}` : ''}: ${data.note.substring(0, 20)}...`, 'success');
    }, [showToast]);

    // --- AGGREGATE APPSTATE OBJECT ---
    // This object bundles relevant state from all stores for easy access in consuming components.
    // It's a derived state, recreated only when its dependencies change.
    const appStateObject: AppState = useMemo(() => ({
        user, students, lessons, slots, evaluations, competencyEvals, uda, eventi,
        knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica,
        feedSources, draftRegister, finalizedRegister,
        settings, aiSettings, themeState,
        backupState, driveSyncState,
        installPrompt: installPrompt as import('../types').BeforeInstallPromptEvent | null,
        canShowInstallPrompt,
        suggestions, studentProfileContext, selectedClassForDashboard,
        activeSuggestion, dismissedSuggestions,
        isGlobalAiLoading,
        navigationHistory: navigationHistory.map(entry => ({
            ...entry,
            context: entry.context as import('../types').NavigationParams | null
        })),
        curricula, submissions,
        selectedDocuments: [],
        orientamentoActivities, ePortfolioEntries, studentOrientamentoStates
    }), [user, students, lessons, slots, evaluations, competencyEvals, uda, eventi,
        knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica,
        feedSources, draftRegister, finalizedRegister,
        settings, aiSettings, themeState, backupState, driveSyncState, installPrompt,
        canShowInstallPrompt, suggestions, studentProfileContext, selectedClassForDashboard,
        activeSuggestion, dismissedSuggestions, isGlobalAiLoading, navigationHistory,
        curricula, submissions, orientamentoActivities, ePortfolioEntries, studentOrientamentoStates]);

    // --- AGGREGATE ACTIONS OBJECT ---
    // This object bundles actions from all stores and local coordination functions.
    // It's also memoized to prevent unnecessary re-renders of consuming components.
    const actionsObject: AppActions = useMemo(() => ({
        // Domain Store Actions
        setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUda,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReportistica, setFeedSources, setDraftRegister, setFinalizedRegister,
        setCurricula, setSubmissions,
        setOrientamentoActivities, setEPortfolioEntries, setStudentOrientamentoStates,
        addEvaluation: studentActions.addEvaluation,
        updateEvaluation: studentActions.updateEvaluation,
        deleteEvaluation: studentActions.deleteEvaluation,
        saveStudent: studentActions.saveStudent,
        deleteStudent: studentActions.deleteStudent,
        importStudents: studentActions.importStudents,
        savePianoInclusione: studentActions.savePianoInclusione,
        deletePianoInclusione: studentActions.deletePianoInclusione,
        saveRubrica: academicActions.saveRubrica,
        saveGiudizio: academicActions.saveGiudizio,
        setSuggestions: systemActions.setSuggestions,
        setActiveSuggestion: systemActions.setActiveSuggestion,
        dismissSuggestion: dismissSuggestionWrapper,
        setStudentProfileContext: studentActions.setStudentProfileContext,
        setSelectedClassForDashboard: studentActions.setSelectedClassForDashboard,
        loadFromBackup: (data: any) => {
            studentActions.loadFromBackup(data);
            academicActions.loadFromBackup(data);
            systemActions.loadFromBackup(data);
        },
        resetAll: () => {
            studentActions.resetStudentData();
            academicActions.resetAcademicData();
            systemActions.resetSystemData();
        },
        handleAddNote,

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
        handleCreateUda, onMarkAttendance,
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
        importEvaluations: studentActions.importEvaluations,
        toggleModal: uiActions.toggleModal,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUda,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReportistica, setFeedSources, setDraftRegister, setFinalizedRegister,
        setCurricula, setSubmissions, setOrientamentoActivities, setEPortfolioEntries, setStudentOrientamentoStates, 
        studentActions.addEvaluation, studentActions.updateEvaluation, studentActions.deleteEvaluation,
        studentActions.saveStudent, studentActions.deleteStudent, studentActions.importStudents,
        studentActions.savePianoInclusione, studentActions.deletePianoInclusione,
        academicActions.saveRubrica, academicActions.saveGiudizio,
        studentActions, academicActions, systemActions, settingsActions.setSettings, settingsActions.setThemeState,
        settingsActions.setAiSettings, uiActions, showToast, handleNavigate, handleBack, handleLoadDemoData,
        handleCleanDemoData, handleConfigureDrive, handleConnectDrive, handleDisconnectDrive, handleSyncToDrive,
        handleRestoreFromDrive, pickGoogleDriveFolder, createAppFolder, handleInstallApp, handleEnterStudentMode,
        handleStartClassroom, handleEditSlot, handleShowSlotActions, handleAiSuggest, onScheduleLesson,
        handleAddEvaluation, handleCreateUda, onMarkAttendance, handleOpenBackupInfo,
        handleExportData, handleImportData, handleAiSuggestionFromHome, handleOpenOperations, onAddLessonsWrapper, 
        onSaveUda, onSaveReport, onSaveEvent, handleGradeSubmission, handlePromoteStudents,
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
        setIsLoadingModalOpen: (value?: boolean) => uiActions.setLoading(!!value),
        loadingModalMessage: loadingModalMessage,
        setLoadingModalMessage: (msg?: string) => uiActions.setLoading(true, msg ?? ''),
        editingSlotKey: editingSlotKey,
        setEditingSlotKey: uiActions.setEditingSlotKey,
        activeSlotKey: activeSlotKey,
        setActiveSlotKey: uiActions.setActiveSlotKey,
        lessonViewContext: lessonViewContext,
        setLessonViewContext: uiActions.setLessonViewContext,
        toast: toast,
        isBackupInfoModalOpen: modals.isBackupInfoModalOpen,
        setIsBackupInfoModalOpen: uiActions.toggleModal.bind(null, 'isBackupInfoModalOpen'),
        isRegisterImportOpen: modals.isRegisterImportOpen,
        setIsRegisterImportOpen: uiActions.toggleModal.bind(null, 'isRegisterImportOpen'),
        syncConflictModal: syncConflictModal,
        setSyncConflictModal: (modal: { isOpen: boolean; data: SyncConflictData | null } | null) => uiActions.setSyncConflictModal(modal as any),
        createLessonContext: createLessonContext,
        setCreateLessonContext: uiActions.setCreateLessonContext,
        isYearTransitionOpen: modals.isYearTransitionOpen,
        setIsYearTransitionOpen: uiActions.toggleModal.bind(null, 'isYearTransitionOpen'),
        isVideoAnalysisOpen: modals.isVideoAnalysisOpen,
        setIsVideoAnalysisOpen: (value?: boolean) => uiActions.setIsVideoAnalysisOpen(typeof value === 'boolean' ? value : false),
        isNkaMapOpen: modals.isNkaMapOpen,
        setIsNkaMapOpen: uiActions.toggleModal.bind(null, 'isNkaMapOpen'),
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

