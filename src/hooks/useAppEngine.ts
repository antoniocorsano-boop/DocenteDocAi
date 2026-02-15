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
import { usePersistence } from './usePersistence';
import { analyzeSystemState } from '../utils/suggestionUtils';
import { useUIStore } from '../stores/useUIStore';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import type { SyncConflictData } from '../types';
import { useSettingsStore } from '../stores/useSettingsStore';
import { errorLogger } from '../services/errorLogger';
import { messages } from '../messages';

// Import hooks per decomposizione useAppEngine
import { useDataLoader } from './useDataLoader';
import { useTestMode } from './useTestMode';
import { useAiSuggestions } from './useAiSuggestions';
import { useGoogleDriveSync } from './useGoogleDriveSync';
import { useDemoData } from './useDemoData';
import { useAppNavigation } from './useAppNavigation';
import { useLessonManagement } from './useLessonManagement';
import { useEvaluationManagement } from './useEvaluationManagement';
import { useUdaManagement } from './useUdaManagement';
import { useBackupManagement } from './useBackupManagement';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppEngine = () => {
    // --- CUSTOM HOOKS (Decomposizione useAppEngine) ---
    const { isDataLoaded, loadData } = useDataLoader();
    const { isTestMode, loadTestData, cleanTestData } = useTestMode();
    const {
        suggestions,
        activeSuggestion,
        dismissedSuggestions,
        dismissSuggestion,
        reactivateSuggestion,
        isGenerating: isAiGenerating
    } = useAiSuggestions(isDataLoaded, isTestMode);
    const {
        handleConnectDrive,
        handleDisconnectDrive,
        handleSyncToDrive,
        handleRestoreFromDrive,
        pickGoogleDriveFolder,
        createAppFolder,
        driveSyncState
    } = useGoogleDriveSync();
    const { handleLoadDemoData, handleCleanDemoData } = useDemoData();
    const { view, viewContext, handleNavigate, handleBack } = useAppNavigation();
    const {
        handleStartClassroom,
        handleEditSlot,
        handleShowSlotActions,
        handleAiSuggest
    } = useLessonManagement(handleNavigate);
    const {
        handleGradeSubmission,
        handleAddEvaluation,
        handleUpdateEvaluation,
        handleDeleteEvaluation
    } = useEvaluationManagement();
    const {
        handleCreateUda,
        onSaveUda,
        handleUpdateUda,
        handleDeleteUda
    } = useUdaManagement(handleNavigate);
    const { handleOpenBackupInfo, handleExportData, handleImportData } = useBackupManagement();

    // --- STORES (Accessed directly via Proxy lazy-init pattern) ---
    const { students, evaluations, competencyEvals, pianiInclusione, studentProfileContext, selectedClassForDashboard, orientamentoActivities, ePortfolioEntries, studentOrientamentoStates, actions: studentActions } = useStudentStore();
    const { lessons, slots, uda, eventi, rubriche, curricula, submissions, draftRegister, finalizedRegister, giudizi, reportistica, actions: academicActions } = useAcademicStore();
    const { user, knowledgeBase, corpora, notifiche, feedSources, analyticsEvents, analyticsMetrics, analyticsSettings, templates, actions: systemActions } = useSystemStore();

    const { modals, circularAnalysisModal, syncConflictModal, createLessonContext, editingSlotKey, activeSlotKey, lessonViewContext, loadingModalMessage, toast, installPrompt, canShowInstallPrompt, isGlobalAiLoading, navigationHistory, backupState, actions: uiActions } = useUIStore();
    const { settings, aiSettings, themeState, actions: settingsActions } = useSettingsStore();

    // --- DESTRUTTURE ACTIONS ---
    const { setStudents, setEvaluations, setCompetencyEvals, setPianiInclusione, setStudentProfileContext, setSelectedClassForDashboard, setOrientamentoActivities, setEPortfolioEntries, setStudentOrientamentoStates } = studentActions;
    const { setLessons, setSlots, setUda, setEventi, setRubriche, setCurricula, setSubmissions, setDraftRegister, setFinalizedRegister, setGiudizi, setReportistica } = academicActions;
    const { setUser, setKnowledgeBase, setCorpora, setNotifiche, setFeedSources, setSuggestions, setActiveSuggestion, trackAnalyticsEvent, setTemplates, dismissSuggestion: systemDismissSuggestion, reactivateSuggestion: systemReactivateSuggestion } = systemActions;

    // Persistence Hook: Now receives isDataLoaded to prevent saving during initial load
    usePersistence(isDataLoaded);

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
    }, [isDataLoaded, students, slots, uda, eventi, evaluations, systemActions]);

    // --- CORE ACTIONS (COORDINATION AND UI DISPATCH) ---
    // These actions are managed by AppEngine but dispatch to Zustand stores.

    // Centralized toast dispatcher using messages.ts
    const showToast = useCallback((messageKey: string, type: 'success' | 'error' | 'info' = 'info') => {
        // If messageKey is a known key in messages.toast, use it, else fallback to string
        const msg = (messages.toast as any)[messageKey] || messageKey;
        uiActions.showToast(msg, type);
    }, []);

    const handleConfigureDrive = useCallback((clientId: string, apiKey?: string) => {
        settingsActions.updateSettings({ googleClientId: clientId, googleApiKey: apiKey });
        showToast('driveConfigUpdated', 'success');
    }, [showToast, settingsActions]);

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

    // FIX: Add implementation for handleOpenOperations
    const handleOpenOperations = useCallback(() => {
        uiActions.toggleModal('isOperationsCenterOpen', true);
    }, [uiActions]);

    const handleAiSuggestionFromHome = useCallback((action: any) => {
        if (action.type === 'navigate') {
            handleNavigate(action.payload);
        }
    }, [handleNavigate]);

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
        dismissSuggestion(id);
        showToast('Suggestion dismissed', 'info');
    }, [dismissSuggestion, showToast]);

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
        reactivateSuggestion,
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
        setIsVideoAnalysisOpen: uiActions.setIsVideoAnalysisOpen,
        setIsRestoring: uiActions.setIsRestoring,
        showToast,
        clearToast: uiActions.clearToast,

        // Coordination Actions (delegati agli hooks specifici)
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
        handleUpdateEvaluation,
        handleDeleteEvaluation,
        handleUpdateUda,
        handleDeleteUda,
        handlePromoteStudents,
        handleResetYearData,
        importEvaluations: studentActions.importEvaluations,
        toggleModal: uiActions.toggleModal,
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
        onSaveUda, onSaveReport, onSaveEvent, handleGradeSubmission, handleUpdateEvaluation, handleDeleteEvaluation,
        handleUpdateUda, handleDeleteUda, handlePromoteStudents, handleResetYearData,
        dismissSuggestionWrapper, reactivateSuggestion, handlePromoteStudents]);

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
