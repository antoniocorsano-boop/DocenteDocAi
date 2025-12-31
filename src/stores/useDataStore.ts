import { create } from 'zustand';
import type { DataState, DataActions } from '../types';
import { INITIAL_KB_GUIDE } from '../constants.ts';

export const useDataStore = create<DataState & { actions: DataActions }>((set) => ({
    user: null,
    students: [],
    lessons: {},
    slots: {},
    evaluations: [],
    competencyEvals: [],
    uda: [],
    templates: [],
    analyticsEvents: [],
    analyticsMetrics: {
        totalDocumentsGenerated: 0,
        documentsByType: {},
        featuresUsage: {},
        templatesCreated: 0,
        exportBatchesCount: 0,
        aiInteractionsCount: 0,
        averageSessionDuration: 0,
        lastUpdated: new Date().toISOString()
    },
    analyticsSettings: {
        enabled: true,
        collectFeatureUsage: true,
        collectDocumentMetrics: true,
        collectPerformanceMetrics: false,
        retentionDays: 90,
        lastReset: null
    },
    eventi: [],
    knowledgeBase: [INITIAL_KB_GUIDE],
    corpora: [],
    notifiche: [],
    rubriche: [],
    pianiInclusione: {},
    giudizi: {},
    reports: [],
    feedSources: [],
    draftRegister: {},
    reportistica: [],
    finalizedRegister: [],
    notebookNotes: {},
    memos: [],
    curricula: [],
    submissions: [],
    suggestions: [],
    activeSuggestion: null,
    dismissedSuggestions: new Set<string>(),
    studentProfileContext: null,
    selectedClassForDashboard: null,
    actions: {
        setUser: (user: DataState['user']) => set({ user }),
        setStudents: (input: DataState['students'] | ((prev: DataState['students']) => DataState['students'])) => set((state) => ({ students: typeof input === 'function' ? input(state.students) : input })),
        setLessons: (input: DataState['lessons'] | ((prev: DataState['lessons']) => DataState['lessons'])) => set((state) => ({ lessons: typeof input === 'function' ? input(state.lessons) : input })),
        setSlots: (input: DataState['slots'] | ((prev: DataState['slots']) => DataState['slots'])) => set((state) => ({ slots: typeof input === 'function' ? input(state.slots) : input })),
        setEvaluations: (input: DataState['evaluations'] | ((prev: DataState['evaluations']) => DataState['evaluations'])) => set((state) => ({ evaluations: typeof input === 'function' ? input(state.evaluations) : input })),
        setCompetencyEvals: (input: DataState['competencyEvals'] | ((prev: DataState['competencyEvals']) => DataState['competencyEvals'])) => set((state) => ({ competencyEvals: typeof input === 'function' ? input(state.competencyEvals) : input })),
        // setUdas rimosso, ora solo setUda
        setUda: (input: DataState['uda'] | ((prev: DataState['uda']) => DataState['uda'])) => set((state) => ({ uda: typeof input === 'function' ? input(state.uda) : input })),
        setTemplates: (input: DataState['templates'] | ((prev: DataState['templates']) => DataState['templates'])) => set((state) => ({ templates: typeof input === 'function' ? input(state.templates) : input })),
        setAnalyticsEvents: (input: DataState['analyticsEvents'] | ((prev: DataState['analyticsEvents']) => DataState['analyticsEvents'])) => set((state) => ({ analyticsEvents: typeof input === 'function' ? input(state.analyticsEvents) : input })),
        setAnalyticsMetrics: (input: DataState['analyticsMetrics'] | ((prev: DataState['analyticsMetrics']) => DataState['analyticsMetrics'])) => set((state) => ({ analyticsMetrics: typeof input === 'function' ? input(state.analyticsMetrics) : input })),
        setAnalyticsSettings: (input: DataState['analyticsSettings'] | ((prev: DataState['analyticsSettings']) => DataState['analyticsSettings'])) => set((state) => ({ analyticsSettings: typeof input === 'function' ? input(state.analyticsSettings) : input })),
        trackAnalyticsEvent: (eventType: DataState['analyticsEvents'][0]['eventType'], featureName: string, metadata?: Record<string, string | number | boolean>) => set((state) => {
            if (!state.analyticsSettings.enabled) return state;

            const sessionId = `session_${Date.now()}`;
            const event: DataState['analyticsEvents'][0] = {
                id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                eventType,
                featureName,
                metadata: metadata || {},
                sessionId
            };

            const newEvents = [...state.analyticsEvents, event];

            // Aggiorna metriche automaticamente
            const newMetrics = { ...state.analyticsMetrics };
            newMetrics.lastUpdated = new Date().toISOString();

            switch (eventType) {
                case 'document_generated':
                    newMetrics.totalDocumentsGenerated++;
                    newMetrics.documentsByType[featureName] = (newMetrics.documentsByType[featureName] || 0) + 1;
                    break;
                case 'feature_usage':
                    newMetrics.featuresUsage[featureName] = (newMetrics.featuresUsage[featureName] || 0) + 1;
                    break;
                case 'template_created':
                    newMetrics.templatesCreated++;
                    break;
                case 'export_batch':
                    newMetrics.exportBatchesCount++;
                    break;
                case 'ai_interaction':
                    newMetrics.aiInteractionsCount++;
                    break;
            }

            return {
                analyticsEvents: newEvents,
                analyticsMetrics: newMetrics
            };
        }),
        setEventi: (input: DataState['eventi'] | ((prev: DataState['eventi']) => DataState['eventi'])) => set((state) => ({ eventi: typeof input === 'function' ? input(state.eventi) : input })),
        setKnowledgeBase: (input: DataState['knowledgeBase'] | ((prev: DataState['knowledgeBase']) => DataState['knowledgeBase'])) => set((state) => ({ knowledgeBase: typeof input === 'function' ? input(state.knowledgeBase) : input })),
        setCorpora: (input: DataState['corpora'] | ((prev: DataState['corpora']) => DataState['corpora'])) => set((state) => ({ corpora: typeof input === 'function' ? input(state.corpora) : input })),
        setNotifiche: (input: DataState['notifiche'] | ((prev: DataState['notifiche']) => DataState['notifiche'])) => set((state) => ({ notifiche: typeof input === 'function' ? input(state.notifiche) : input })),
        setRubriche: (input: DataState['rubriche'] | ((prev: DataState['rubriche']) => DataState['rubriche'])) => set((state) => ({ rubriche: typeof input === 'function' ? input(state.rubriche) : input })),
        setPianiInclusione: (input: DataState['pianiInclusione'] | ((prev: DataState['pianiInclusione']) => DataState['pianiInclusione'])) => set((state) => ({ pianiInclusione: typeof input === 'function' ? input(state.pianiInclusione) : input })),
        setGiudizi: (input: DataState['giudizi'] | ((prev: DataState['giudizi']) => DataState['giudizi'])) => set((state) => ({ giudizi: typeof input === 'function' ? input(state.giudizi) : input })),
        // setReports rimosso, ora solo setReportistica
        setReportistica: (input: DataState['reportistica'] | ((prev: DataState['reportistica']) => DataState['reportistica'])) => set((state) => ({ reportistica: typeof input === 'function' ? input(state.reportistica) : input })),
        setFeedSources: (input: DataState['feedSources'] | ((prev: DataState['feedSources']) => DataState['feedSources'])) => set((state) => ({ feedSources: typeof input === 'function' ? input(state.feedSources) : input })),
        setDraftRegister: (input: DataState['draftRegister'] | ((prev: DataState['draftRegister']) => DataState['draftRegister'])) => set((state) => ({ draftRegister: typeof input === 'function' ? input(state.draftRegister) : input })),
        setFinalizedRegister: (input: DataState['finalizedRegister'] | ((prev: DataState['finalizedRegister']) => DataState['finalizedRegister'])) => set((state) => ({ finalizedRegister: typeof input === 'function' ? input(state.finalizedRegister) : input })),
        setNotebookNotes: (input: DataState['notebookNotes'] | ((prev: DataState['notebookNotes']) => DataState['notebookNotes'])) => set((state) => ({ notebookNotes: typeof input === 'function' ? input(state.notebookNotes) : input })),
        setMemos: (input: DataState['memos'] | ((prev: DataState['memos']) => DataState['memos'])) => set((state) => ({ memos: typeof input === 'function' ? input(state.memos) : input })),
        setCurricula: (input: DataState['curricula'] | ((prev: DataState['curricula']) => DataState['curricula'])) => set((state) => ({ curricula: typeof input === 'function' ? input(state.curricula) : input })),
        setSubmissions: (input: DataState['submissions'] | ((prev: DataState['submissions']) => DataState['submissions'])) => set((state) => ({ submissions: typeof input === 'function' ? input(state.submissions) : input })),
        setSuggestions: (suggestions: DataState['suggestions']) => set({ suggestions }),
        setActiveSuggestion: (activeSuggestion: DataState['activeSuggestion']) => set({ activeSuggestion }),
        dismissSuggestion: (id: string) => set((state) => {
            const newDismissed = new Set(state.dismissedSuggestions);
            newDismissed.add(id);
            return { dismissedSuggestions: newDismissed };
        }),
        reactivateSuggestion: (id: string) => set((state) => {
            const newDismissed = new Set(state.dismissedSuggestions);
            newDismissed.delete(id);
            return { dismissedSuggestions: newDismissed };
        }),
        setStudentProfileContext: (student: DataState['studentProfileContext']) => set({ studentProfileContext: student }),
        setSelectedClassForDashboard: (className: DataState['selectedClassForDashboard']) => set({ selectedClassForDashboard: className }),
        loadFromBackup: (data: Partial<DataState>) => set((state) => ({
            ...state,
            ...data,
            dismissedSuggestions: data.dismissedSuggestions 
                ? new Set(Array.from(data.dismissedSuggestions))
                : new Set<string>(),
        })),
        resetAll: () => set({
            user: null,
            students: [], lessons: {}, slots: {}, evaluations: [], competencyEvals: [],
            uda: [], templates: [], analyticsEvents: [], analyticsMetrics: {
                totalDocumentsGenerated: 0,
                documentsByType: {},
                featuresUsage: {},
                templatesCreated: 0,
                exportBatchesCount: 0,
                aiInteractionsCount: 0,
                averageSessionDuration: 0,
                lastUpdated: new Date().toISOString()
            }, analyticsSettings: {
                enabled: true,
                collectFeatureUsage: true,
                collectDocumentMetrics: true,
                collectPerformanceMetrics: false,
                retentionDays: 90,
                lastReset: new Date().toISOString()
            }, eventi: [], knowledgeBase: [INITIAL_KB_GUIDE], corpora: [],
            notifiche: [], rubriche: [], pianiInclusione: {}, giudizi: {}, reportistica: [],
            feedSources: [], draftRegister: {}, finalizedRegister: [], notebookNotes: {},
            memos: [], curricula: [], submissions: []
        })
    }
}));
