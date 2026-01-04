import React, { useMemo, Suspense } from 'react';
import { VIEW_CONFIGS, Home, FlowMode, ClassDashboard, ClassSelection, ClassroomView, StudentClassroomView } from './viewRegistry';
import RegisterImportDialog from './RegisterImportDialog';
import AuraView from './AuraView';
import ErrorBoundary from './ErrorBoundary';
import { AiThinkingGem } from './ui';
import { AppState, AppActions, View, EventoCalendario, Lezione, RegisterEntry, Studente, KnowledgeBaseEntry, Rubrica, PianoInclusione, GiudizioPeriodico, Competenza, LessonScheduleInput, EvaluationInput, UdaCreateInput, Uda, Report } from '../types';
import type { Modals } from '../types';

interface ViewManagerProps {
    view: View;
    viewContext: unknown;
    appState: AppState;
    actions: AppActions;
    modals: Partial<Modals>;
}

/**
 * ViewManager - Cuore del Presentation Layer.
 * Implementa AuraView per transizioni fluide e layout Material 3 Hardened.
 */
const ViewManager: React.FC<ViewManagerProps> = ({ view, viewContext, appState, actions, modals }) => {

    // Destructure appState (now directly contains states from Zustand stores)
    const {
        user, students, slots, activeSuggestion, dismissedSuggestions, isGlobalAiLoading, installPrompt, notifiche, settings,
        lessons, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, aiSettings, themeState, backupState, driveSyncState, studentProfileContext, curricula, submissions,
        orientamentoActivities, ePortfolioEntries, studentOrientamentoStates
    } = appState;

    // Prendi solo i setter dei modals da modals
    const {
        setCreateLessonContext,
        setLessonViewContext,
        setIsLiveAssistantModalOpen,
        setActiveSlotKey,
        setEditingSlotKey,
        setIsLoadingModalOpen,
        setLoadingModalMessage,
        setCircularAnalysisModal,
        setIsRegisterImportOpen
    } = modals;

    // Tutte le altre azioni da actions
    const {
        setLessons, setEvaluations, setCompetencyEvals, setUda,
        setEventi, setKnowledgeBase, setCorpora, setRubriche, setPianiInclusione,
        setGiudizi, setReportistica, setDraftRegister, setFinalizedRegister, setCurricula, setSubmissions, dismissSuggestion,
        setStudentProfileContext, showToast, clearToast,
        handleNavigate, handleBack, handleLoadDemoData, handleCleanDemoData,
        handleEditSlot, handleShowSlotActions,
        handleAiSuggest, onScheduleLesson, handleAddEvaluation,
        handleCreateUda, handleAddNote, onMarkAttendance,
        setViewContext,
        onSaveUda,
        onSaveReport,
        onSaveEvent,
        onAddLessons,
        handleGradeSubmission,
        handleOpenOperations,
        setOrientamentoActivities,
        setEPortfolioEntries,
        setStudentOrientamentoStates,
        importStudents,
        importEvaluations,
        toggleModal
    } = actions;

    const safeSubmissions = submissions || [];

    // Helper to ensure PIN is valid (fallback to 0000 if empty to prevent lockout)
    const safeSecurityPin = settings.securityPin && settings.securityPin.length === 4 ? settings.securityPin : '0000';

    // Accessibility: Scroll to top and manage focus on view change
    React.useEffect(() => {
        window.scrollTo(0, 0);
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
            // Optional: focus the main content for screen readers
            (mainContent as HTMLElement).focus?.();
        }
    }, [view]);

    const renderView = useMemo(() => {
        const config = VIEW_CONFIGS[view];

        return (
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <AiThinkingGem size="large" text="Caricamento..." />
                </div>
            }>
                {(() => {
                    // --- SPECIAL VIEWS LOGIC ---

                    // 1. HOME / FLOW MODE
                    if (view === 'home') {
                        return (
                            <AuraView>
                                {settings.uiMode === 'flow' ? (
                                    <FlowMode 
                                        actions={actions} 
                                        onOpenOperations={handleOpenOperations}
                                        onOpenLiveAssistant={() => setIsLiveAssistantModalOpen?.(true)}
                                    />
                                ) : (
                                    <Home
                                        onNavigate={handleNavigate}
                                        dismissSuggestion={dismissSuggestion}
                                        onOpenRegisterImport={() => setIsRegisterImportOpen?.(true)}
                                    />
                                )}
                            </AuraView>
                        );
                    }

                    // 2. AULA (Selection vs Dashboard)
                    if (view === 'aula') {
                        return viewContext ? (
                            <AuraView>
                                <ClassDashboard
                                    selectedClass={typeof viewContext === 'string' ? viewContext : ''}
                                    onNavigate={handleNavigate}
                                    onViewStudentProfile={setStudentProfileContext}
                                    onStartImpromptuSession={(classe) => {
                                        const draftKey = `impromptu-${classe}-${Date.now()}`;
                                        const newDraft: RegisterEntry = {
                                            id: draftKey,
                                            date: new Date().toISOString(),
                                            slotKey: '',
                                            lessonId: '',
                                            classe,
                                            materia: 'Lezione Improvvisata',
                                            studentAttendance: {},
                                            status: 'draft',
                                        };
                                        actions.setDraftRegister((prev) => ({ ...prev, [draftKey]: newDraft }));
                                        handleNavigate('aula-session', { draftKey });
                                    }}
                                    onStartPlannedLesson={(classe, materia, slotKey, lesson) => {
                                        const draftKey = `${classe}-${materia}-${slotKey}`;
                                        const newDraft: RegisterEntry = {
                                            id: draftKey,
                                            date: new Date().toISOString(),
                                            slotKey,
                                            lessonId: lesson.id,
                                            classe,
                                            materia,
                                            studentAttendance: {},
                                            status: 'draft',
                                        };
                                        actions.setDraftRegister((prev) => ({ ...prev, [draftKey]: newDraft }));
                                        handleNavigate('aula-session', { draftKey });
                                    }}
                                />
                            </AuraView>
                        ) : (
                            <AuraView>
                                <ClassSelection
                                    onSelectClass={(className) => handleNavigate('aula', className)}
                                    onNavigate={handleNavigate}
                                />
                            </AuraView>
                        );
                    }
                    // 3. AULA SESSION (ClassroomView)
                    if (view === 'aula-session') {
                        let draftKey: string | undefined = undefined;
                        if (typeof viewContext === 'object' && viewContext !== null && 'draftKey' in viewContext) {
                            draftKey = (viewContext as { draftKey: string }).draftKey;
                        }
                        const currentDraftEntry = draftKey !== undefined ? draftRegister[draftKey] : undefined;
                        
                        if (!currentDraftEntry) {
                            return <div className="p-4 text-error">Errore: Dati lezione in bozza non trovati.</div>;
                        }

                        return (
                            <AuraView fullWidth>
                                <ClassroomView
                                    draftKey={draftKey ?? ''}
                                    draftEntry={currentDraftEntry}
                                    students={students}
                                    lessons={lessons}
                                    knowledgeBase={knowledgeBase}
                                    evaluations={evaluations}
                                    competencyEvaluations={competencyEvals}
                                    onUpdateDraftEntry={(key: string, updates: Partial<RegisterEntry>) => setDraftRegister(prev => ({ ...prev, [key]: { ...prev[key], ...updates } }))}
                                    onFinalizeRegister={(key: string) => { 
                                        const entry = draftRegister[key]; 
                                        setFinalizedRegister(prev => [...prev, { ...entry, status: 'finalized' }]); 
                                        setDraftRegister(prev => { const newDrafts = { ...prev }; delete newDrafts[key]; return newDrafts; }); 
                                        handleBack(true); 
                                    }}
                                    onReopenRegister={(key: string) => setDraftRegister(prev => ({ ...prev, [key]: { ...prev[key], status: 'draft' } }))}
                                    onCloseView={() => handleBack(true)}
                                    settings={settings}
                                    onSaveOralEvaluation={handleAddEvaluation}
                                    onOpenStudentActionMenu={() => { }}
                                    onOpenAulaTool={() => { }}
                                    onPromoteImpromptuLesson={(lesson: Lezione) => setLessons(prev => ({ ...prev, [lesson.id]: lesson }))}
                                    onOpenLiveAssistant={() => setIsLiveAssistantModalOpen?.(true)}
                                    setStudentProfileContext={setStudentProfileContext}
                                    onNavigate={handleNavigate}
                                />
                            </AuraView>
                        );
                    }

                    // 4. STUDENT WORKSPACE
                    if (view === 'student-workspace') {
                        let studentId: string | undefined = undefined;
                        if (typeof viewContext === 'object' && viewContext !== null && 'studentId' in viewContext) {
                            studentId = (viewContext as { studentId: string }).studentId;
                        }
                        const currentStudent = students.find(s => s.id === studentId);
                        if (!currentStudent) {
                            return (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <h2 className="m3-headline-small text-error mb-2">Errore Accesso Studente</h2>
                                    <p className="m3-body-medium text-on-surface-variant mb-4">
                                        Impossibile trovare il profilo studente selezionato.
                                    </p>
                                    <button onClick={() => handleNavigate('student-dashboard')} className="button button-filled rounded-lg mt-4">
                                        Torna al Login
                                    </button>
                                </div>
                            );
                        }
                        const studentKb = knowledgeBase.filter(k => k.category === 'materiale_didattico' || k.fileName.includes(currentStudent.classe));
                        return (
                            <AuraView fullWidth>
                                <StudentClassroomView
                                    student={currentStudent}
                                    lessons={Object.values(lessons)}
                                    register={finalizedRegister}
                                    kb={studentKb}
                                    submissions={safeSubmissions}
                                    onUploadSubmission={(sub) => setSubmissions(prev => [...prev, sub])}
                                    onLogout={() => handleNavigate('student-dashboard')}
                                    onExitMode={() => handleNavigate('home')}
                                    securityPin={safeSecurityPin}
                                    settings={settings}
                                />
                            </AuraView>
                        );
                    }

                    // --- REGISTRY-BASED VIEWS ---
                    if (config) {
                        const Component = config.component;
                        const wrapperProps = { fullWidth: config.fullWidth };
                        
                        // Map props for standard views
                        let componentProps: any = {};
                        
                        switch (view) {
                            case 'timetable':
                                componentProps = { slots, lessons, settings, onEditSlot: handleEditSlot, onShowSlotActions: (slot: any, lesson: any) => { setActiveSlotKey?.(slot.giorno + '-' + slot.ora); setLessonViewContext?.(lesson); }, showGuidanceTips: settings.showGuidanceTips };
                                break;
                            case 'calendario':
                                return <AuraView {...wrapperProps}><ErrorBoundary><Component eventi={eventi} setEventi={setEventi} aiSettings={aiSettings} /></ErrorBoundary></AuraView>;
                            case 'settings':
                                componentProps = {
                                    settings, themeState, aiSettings, backupState, driveState: driveSyncState, installPrompt, dismissedSuggestions,
                                    onSaveSettings: actions.setSettings, onSaveTheme: actions.setThemeState, onSaveAiSettings: actions.setAiSettings,
                                    onExportData: actions.handleExportData, onImportData: actions.handleImportData, showToast,
                                    onDownloadDemoData: actions.handleLoadDemoData, onCleanDemoData: actions.handleCleanDemoData,
                                    onRestoreFromBackup: actions.handleRestoreFromDrive, onLogout: () => actions.handleNavigate('student-dashboard'),
                                    onInstallApp: actions.handleInstallApp, onEnterStudentMode: actions.handleEnterStudentMode,
                                    onConnectDrive: actions.handleConnectDrive, onDisconnectDrive: actions.handleDisconnectDrive,
                                    onSyncToDrive: actions.handleSyncToDrive, onRestoreFromDrive: actions.handleRestoreFromDrive,
                                    onConfigureDrive: actions.handleConfigureDrive, onSelectBackupFolder: actions.pickGoogleDriveFolder,
                                    onCreateAppFolder: actions.createAppFolder, onClose: actions.handleBack, onOpenBackupInfo: actions.handleOpenBackupInfo,
                                    onReactivateSuggestion: actions.reactivateSuggestion
                                };
                                break;
                            case 'studenti':
                                componentProps = { students, onSaveStudent: actions.saveStudent, onDeleteStudent: actions.deleteStudent, onImportStudents: actions.importStudents, userClasses: settings.classi, initialClass: typeof viewContext === 'string' ? viewContext : undefined, knowledgeBase };
                                break;
                            case 'progettazione-hub':
                                componentProps = { 
                                    onNavigate: handleNavigate, 
                                    uda, 
                                    events: eventi, 
                                    settings, 
                                    aiSettings, 
                                    onSaveUda, 
                                    onAddLessons, 
                                    onSaveReport, 
                                    onSaveEvent, 
                                    initialAction: typeof viewContext === 'object' && viewContext !== null && 'action' in viewContext ? (viewContext as any).action : undefined, 
                                    knowledgeBase, 
                                    showToast, 
                                    showGuidanceTips: settings.showGuidanceTips, 
                                    setIsLoadingModalOpen, 
                                    setLoadingModalMessage, 
                                    students, 
                                    pianiInclusione, 
                                    onUpdateCompetencies: (comp: Competenza[]) => actions.setSettings(prev => ({ ...prev, competenze: comp })), 
                                    curricula,
                                    onUpdateKnowledgeBase: setKnowledgeBase,
                                    driveSyncState,
                                    onConnectDrive: actions.handleConnectDrive
                                };
                                break;
                            case 'reportistica':
                                componentProps = { reportistica, onDeleteReport: (id: string) => setReportistica((prev: Report[]) => prev.filter((r) => r.id !== id)), userClasses: settings.classi, students, evaluations, competencyEvaluations: competencyEvals, settings, uda, lessons, onSaveReport, aiSettings, pianiInclusione, knowledgeBase, onAddKbEntry: (entry: KnowledgeBaseEntry) => setKnowledgeBase(prev => [...prev, entry]), onSaveUda, onAddLessons, onSaveEvent };
                                break;
                            case 'knowledge-base':
                                componentProps = { knowledgeBase, setKnowledgeBase, corpora, setCorpora, showToast };
                                break;
                            case 'studio':
                                componentProps = { corpora, knowledgeBase, setKnowledgeBase, aiSettings, onOpenCreateLesson: () => setCreateLessonContext?.({ isOpen: true, slotKey: null, lezione: null }), showToast, showGuidanceTips: settings.showGuidanceTips, onAiProcessing: () => {} };
                                break;
                            case 'orientamento':
                                componentProps = { students, activities: orientamentoActivities, ePortfolioEntries, studentStates: studentOrientamentoStates, userClasses: settings.classi, onSaveActivity: (a: any) => setOrientamentoActivities(prev => [...(Array.isArray(prev) ? prev.filter(act => act.id !== a.id) : []), a]), onSaveEPortfolio: (e: any) => setEPortfolioEntries(prev => [...(Array.isArray(prev) ? prev.filter(ent => ent.id !== e.id) : []), e]), onUpdateStudentState: (s: any) => setStudentOrientamentoStates(prev => ({ ...prev, [s.studenteId]: s })), showToast };
                                break;
                            case 'lessons':
                                componentProps = { lessons: Object.values(lessons), uda, knowledgeBase, userClasses: settings.classi, onViewLesson: setLessonViewContext ?? (() => {}), onAddLessons, onUpdateLesson: (lesson: Lezione) => setLessons(prev => ({ ...prev, [lesson.id]: lesson })), aiSettings, setIsLoadingModalOpen, setLoadingModalMessage, slots, onScheduleLesson, curricula, settings, onStartClassroom: () => {} };
                                break;
                            case 'uda':
                                componentProps = { uda, onSaveUda, onDeleteUda: (id: string) => setUda((prev) => prev.filter((u: Uda) => u.id !== id)), lessons, onUpdateUdaLessons: () => {}, aiSettings, knowledgeBase, competenze: settings.competenze, settings, onSaveReport, onNavigate: handleNavigate, showToast, showGuidanceTips: settings.showGuidanceTips, setIsLoadingModalOpen, setLoadingModalMessage, eventi, onAddLessons, onSaveEvent, curricula };
                                break;
                            case 'rubriche':
                                componentProps = { competenze: settings.competenze, rubriche, onSaveRubrica: actions.saveRubrica, onNavigate: handleNavigate };
                                break;
                            case 'didattica-inclusiva':
                                componentProps = { students, pianiInclusione, onSavePiano: actions.savePianoInclusione, onDeletePiano: actions.deletePianoInclusione, aiSettings, evaluations, competencyEvaluations: competencyEvals, settings, studentToEdit: typeof viewContext === 'object' && viewContext !== null && 'student' in viewContext ? (viewContext as any).student : undefined, onClearStudentToEdit: () => setViewContext({ student: undefined }), showToast, showGuidanceTips: settings.showGuidanceTips, onAiProcessing: () => {} };
                                break;
                            case 'evaluations':
                                componentProps = { students, evaluations, setEvaluations, competencyEvaluations: competencyEvals, setCompetencyEvaluations: setCompetencyEvals, userClasses: settings.classi, settings, aiSettings, initialClass: typeof viewContext === 'string' ? viewContext : undefined, onClearInitialStudent: () => setViewContext({ initialStudentId: undefined }), onOpenInclusionPlanEditor: (student: Studente) => handleNavigate('didattica-inclusiva', { student }), showGuidanceTips: settings.showGuidanceTips, register: finalizedRegister, lessons };
                                break;
                            case 'register':
                                componentProps = { entries: finalizedRegister, lessons, students, initialClass: typeof viewContext === 'string' ? viewContext : undefined };
                                break;
                            case 'improvement-guide':
                                componentProps = { selectedClass: typeof viewContext === 'string' ? viewContext : '', students, evaluations, competencyEvaluations: competencyEvals, lessons, register: finalizedRegister, settings, aiSettings };
                                break;
                            case 'consiglio-di-classe':
                                componentProps = { selectedClass: typeof viewContext === 'string' ? viewContext : '', students, evaluations, giudizi, onSaveGiudizio: actions.saveGiudizio, settings, aiSettings, annoScolasticoCorrente: settings.annoScolasticoCorrente, onViewStudentProfile: setStudentProfileContext, competencyEvaluations: competencyEvals };
                                break;
                            case 'class-competency-dashboard':
                                componentProps = { selectedClass: typeof viewContext === 'string' ? viewContext : '', students, competencyEvaluations: competencyEvals, settings, onViewStudentProfile: setStudentProfileContext };
                                break;
                            case 'analytics':
                                componentProps = { userClasses: settings.classi, students, evaluations, competencyEvaluations: competencyEvals, settings, aiSettings };
                                break;
                            case 'student-dashboard':
                                componentProps = { students, onLogin: (student: Studente) => handleNavigate('student-workspace', { studentId: student.id }), onCancel: () => handleNavigate('home'), securityPin: safeSecurityPin };
                                break;
                            case 'teacher-inbox':
                                componentProps = { submissions: safeSubmissions, students, lessons, onGradeSubmission: handleGradeSubmission, onClose: () => handleBack(true) };
                                break;
                            case 'competency-levels':
                                componentProps = { competenze: settings.competenze };
                                break;
                            case 'curriculum-manager':
                                componentProps = { curricula: curricula || [], onUpdateCurricula: setCurricula, settings, aiSettings, onNavigate: handleNavigate };
                                break;
                            case 'live-assistant':
                                componentProps = { students, evaluations, slots, lessons, pianiInclusione, knowledgeBase, onNavigate: handleNavigate, onCreateEvent: (eventWithoutId: any) => { const newEvent = { ...eventWithoutId, id: `evt-${Date.now()}-${Math.random()}` }; setEventi((prev: any) => [...prev, newEvent]); }, onScheduleLesson: (data: any) => { onScheduleLesson(data); modals.setIsLiveAssistantModalOpen?.(false); }, onAddEvaluation: (data: any) => { handleAddEvaluation(data); modals.setIsLiveAssistantModalOpen?.(false); }, onCreateUda: (data: any) => { handleCreateUda(data); modals.setIsLiveAssistantModalOpen?.(false); }, onAddNote: (data: any) => { handleAddNote(data); modals.setIsLiveAssistantModalOpen?.(false); }, onMarkAttendance: (data: any) => { onMarkAttendance(data); modals.setIsLiveAssistantModalOpen?.(false); }, onLoadDemoData: () => { handleLoadDemoData(); modals.setIsLiveAssistantModalOpen?.(false); }, userContext: user };
                                break;
                            case 'teacher-presentation-view':
                                componentProps = { onNavigate: handleNavigate };
                                break;
                        }

                        return (
                            <AuraView {...wrapperProps}>
                                <Component {...componentProps} />
                            </AuraView>
                        );
                    }

                    // 404 Fallback
                    return (
                        <AuraView>
                            <div className="p-12 text-center opacity-50">
                                <h2 className="m3-headline-medium">Vista "{view}" non trovata</h2>
                                <button onClick={() => actions.handleNavigate('home')} className="button button-filled rounded-lg hover:shadow-md transition-all mt-4">
                                    Torna alla Home
                                </button>
                            </div>
                        </AuraView>
                    );
                })()}
            </Suspense>
        );
    }, [view, viewContext, appState, actions, modals]);

    return (
        <>
            {renderView}
            {modals.isRegisterImportOpen && (
                <RegisterImportDialog 
                    onClose={() => setIsRegisterImportOpen?.(false)}
                    onImport={(result) => {
                        if (result.students.length > 0) {
                            importStudents(result.students);
                        }
                        if (result.evaluations.length > 0) {
                            importEvaluations(result.evaluations);
                        }
                        showToast('Dati importati con successo!', 'success');
                    }}
                />
            )}
        </>
    );
}

export default ViewManager;
