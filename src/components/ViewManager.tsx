import React, { useMemo } from 'react';
import Home from './Home';

import { Timetable } from './Timetable';
import Calendar from './Calendar';
import Settings from './Settings';


// import Settings from './Settings';
import ClassSelection from './ClassSelection';
import ClassDashboard from './ClassDashboard';
import ClassroomView from './ClassroomView';
import StudentManager from './StudentManager';
import EvaluationModule from './EvaluationModule';
import RegisterView from './RegisterView';
import ClassCompetencyDashboard from './ClassCompetencyDashboard';
import ProgettazioneHub from './ProgettazioneHub';
import LessonsPage from './LessonsPage';
import UdaPlanner from './UdaPlanner';
import RubricheManager from './RubricheManager';
import ReportisticaHub from './ReportisticaHub';
import KnowledgeBase from './KnowledgeBase';
// import FeedManager from './FeedManager';
import AnalyticsHub from './AnalyticsHub';
import DidatticaInclusiva from './DidatticaInclusiva';
import StudentLoginScreen from './StudentLoginScreen';
import StudentClassroomView from './StudentClassroomView';
import TeacherInbox from './TeacherInbox';
import ImprovementGuide from './ImprovementGuide';
import ConsiglioClasse from './ConsiglioClasse';
import CompetencyLevelsView from './CompetencyLevelsView';
import CurriculumManager from './CurriculumManager';
import TeacherPresentationView from './TeacherPresentationView';
import { Studio } from './Studio';
import { LiveAssistant } from './LiveAssistant';
import ErrorBoundary from './ErrorBoundary';
import { AppState, AppActions, View, EventoCalendario, Lezione, RegisterEntry, Studente, KnowledgeBaseEntry, Rubrica, PianoInclusione, GiudizioPeriodico, Competenza, LessonScheduleInput, EvaluationInput, UdaCreateInput, Uda, Report } from '../types';
// import { initPersistentStorage } from '../services/backupService';

import type { Modals } from '../types';

interface ViewManagerProps {
    view: View;
    viewContext: unknown;
    appState: AppState;
    actions: AppActions;
    modals: Partial<Modals>;
}

const AuraView: React.FC<{ children: React.ReactNode; fullWidth?: boolean }> = ({ children, fullWidth = false }) => {
    return (
        <div className={`aura-view-wrapper mx-auto w-full ${fullWidth ? '' : 'max-w-7xl md:px-6'}`}>
            {children}
        </div>
    );
};

/**
 * ViewManager - Cuore del Presentation Layer.
 * Implementa AuraView per transizioni fluide e layout Material 3 Hardened.
 */
const ViewManager: React.FC<ViewManagerProps> = ({ view, viewContext, appState, actions, modals }) => {

    // Destructure appState (now directly contains states from Zustand stores)
    const {
        user, students, slots, activeSuggestion, dismissedSuggestions, isGlobalAiLoading, installPrompt, notifiche, settings, navigationHistory,
        lessons, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, aiSettings, themeState, backupState, driveSyncState, suggestions, studentProfileContext, curricula, submissions
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
        setCircularAnalysisModal
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
        handleOpenOperations
    } = actions;

    const safeSubmissions = submissions || [];

    // useEffect(() => {
    //     // initPersistentStorage(); // FIX: Removed redundant call, it's handled in useAppEngine.ts
    // }, []);

    // Helper to ensure PIN is valid (fallback to 0000 if empty to prevent lockout)
    const safeSecurityPin = settings.securityPin && settings.securityPin.length === 4 ? settings.securityPin : '0000';

    const renderView = useMemo(() => {
        return (
            <>
                {view === 'home' && (
                    <AuraView>
                        <Home
                            onNavigate={handleNavigate}
                            appState={appState}
                            dismissSuggestion={dismissSuggestion}
                        />

                    </AuraView>
                )}
                {view === 'timetable' && (
                    <AuraView>
                        <Timetable
                            slots={slots}
                            lessons={lessons}
                            settings={settings}
                            onEditSlot={handleEditSlot}
                            onShowSlotActions={(slot, lesson) => { setActiveSlotKey?.(slot.giorno + '-' + slot.ora); setLessonViewContext?.(lesson); }}
                            showGuidanceTips={settings.showGuidanceTips}
                        />
                    </AuraView>
                )}
                {view === 'calendario' && (
                    <AuraView>
                        <ErrorBoundary>
                            <Calendar
                                eventi={eventi}
                                setEventi={setEventi}
                                aiSettings={aiSettings}
                            />
                        </ErrorBoundary>
                    </AuraView>
                )}
                {view === 'settings' && (
                    <AuraView>
                        <Settings
                            settings={settings}
                            themeState={themeState}
                            aiSettings={aiSettings}
                            onSaveSettings={(s) => actions.setSettings(s)}
                            onSaveTheme={(t) => actions.setThemeState(t)}
                            onSaveAiSettings={(s) => actions.setAiSettings(s)}
                            onExportData={() => actions.handleExportData?.()}
                            onImportData={(f: File) => actions.handleImportData?.(f)}
                            showToast={actions.showToast}
                            onDownloadDemoData={() => actions.handleLoadDemoData?.()}
                            onCleanDemoData={() => actions.handleCleanDemoData?.()}
                            backupState={backupState}
                            onRestoreFromBackup={() => actions.handleRestoreFromDrive?.()}
                            onLogout={() => actions.handleNavigate('student-dashboard')}
                            installPrompt={installPrompt}
                            onInstallApp={() => actions.handleInstallApp?.()}
                            onEnterStudentMode={() => actions.handleEnterStudentMode?.()}
                            driveState={driveSyncState}
                            onConnectDrive={() => actions.handleConnectDrive?.()}
                            onDisconnectDrive={() => actions.handleDisconnectDrive?.()}
                            onSyncToDrive={() => actions.handleSyncToDrive?.()}
                            onRestoreFromDrive={() => actions.handleRestoreFromDrive?.()}
                            onConfigureDrive={(clientId: string, apiKey?: string) => actions.handleConfigureDrive?.(clientId, apiKey)}
                            onSelectBackupFolder={(apiKey: string) => actions.pickGoogleDriveFolder?.(apiKey)}
                            onCreateAppFolder={() => actions.createAppFolder?.()}
                            onClose={() => actions.handleBack?.()}
                            onOpenBackupInfo={() => actions.handleOpenBackupInfo?.()}
                        />
                    </AuraView>
                )}
                {view === 'aula' && (viewContext ? <AuraView><ClassDashboard
                    selectedClass={typeof viewContext === 'string' ? viewContext : ''}
                    onNavigate={handleNavigate}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    slots={slots}
                    lessons={lessons}
                    onViewStudentProfile={setStudentProfileContext}
                    submissions={safeSubmissions}
                    onStartImpromptuSession={(classe) => {
                        // Start an impromptu lesson: create a new draft entry and navigate to aula-session
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
                        // Start a planned lesson: create a new draft entry and navigate to aula-session
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
                /></AuraView> : <AuraView><ClassSelection
                    userClasses={settings.classi}
                    onSelectClass={(className) => handleNavigate('aula', className)}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    onNavigate={handleNavigate}
                /></AuraView>)}
                {view === 'studenti' && <AuraView><StudentManager
                    students={students}
                    onSaveStudent={() => {}}
                    onDeleteStudent={() => {}}
                    onImportStudents={() => {}}
                    userClasses={settings.classi}
                    initialClass={typeof viewContext === 'string' ? viewContext : undefined}
                    knowledgeBase={knowledgeBase}
                /></AuraView>}
                {view === 'progettazione-hub' && <AuraView><ProgettazioneHub
                    onNavigate={handleNavigate}
                    uda={uda}
                    events={eventi}
                    settings={settings}
                    aiSettings={aiSettings}
                    onSaveUda={onSaveUda}
                    onAddLessons={onAddLessons}
                    onSaveReport={onSaveReport}
                    onSaveEvent={onSaveEvent}
                    initialAction={
                        typeof viewContext === 'object' && viewContext !== null && 'action' in viewContext
                            ? (viewContext as { action: string }).action
                            : undefined
                    }
                    knowledgeBase={knowledgeBase}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    setIsLoadingModalOpen={setIsLoadingModalOpen ?? (() => {})}
                    setLoadingModalMessage={setLoadingModalMessage ?? (() => {})}
                    students={students}
                    pianiInclusione={pianiInclusione}
                    onUpdateCompetencies={(comp: Competenza[]) => actions.setSettings(prev => ({ ...prev, competenze: comp }))} // FIX: Use actions.setSettings
                    curricula={curricula}
                /></AuraView>}
                {view === 'reportistica' && <AuraView><ReportisticaHub
                    reportistica={reportistica}
                    onDeleteReport={(id: string) => setReportistica((prev: Report[]) => prev.filter((r) => r.id !== id))}
                    userClasses={settings.classi}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    uda={uda}
                    lessons={lessons}
                    onSaveReport={onSaveReport}
                    aiSettings={aiSettings}
                    pianiInclusione={pianiInclusione}
                    knowledgeBase={knowledgeBase}
                    onAddKbEntry={(entry: KnowledgeBaseEntry) => setKnowledgeBase(prev => [...prev, entry])}
                    onSaveUda={onSaveUda}
                    onAddLessons={onAddLessons}
                    onSaveEvent={onSaveEvent}
                /></AuraView>}
                {view === 'knowledge-base' && <AuraView><KnowledgeBase
                    knowledgeBase={knowledgeBase}
                    setKnowledgeBase={setKnowledgeBase}
                    corpora={corpora}
                    setCorpora={setCorpora}
                    showToast={showToast}
                /></AuraView>}
                {view === 'studio' && <AuraView><Studio
                    corpora={corpora}
                    knowledgeBase={knowledgeBase}
                    setKnowledgeBase={setKnowledgeBase}
                    aiSettings={aiSettings}
                    onOpenCreateLesson={() => setCreateLessonContext?.({ isOpen: true, slotKey: null, lezione: null })}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    onAiProcessing={() => {}}
                /></AuraView>}
                {view === 'lessons' && <AuraView><LessonsPage
                    lessons={Object.values(lessons)}
                    uda={uda}
                    knowledgeBase={knowledgeBase}
                    userClasses={settings.classi}
                    onViewLesson={setLessonViewContext ?? (() => {})}
                    onAddLessons={onAddLessons}
                    onUpdateLesson={(lesson: Lezione) => setLessons(prev => ({ ...prev, [lesson.id]: lesson }))}
                    aiSettings={aiSettings}
                    setIsLoadingModalOpen={setIsLoadingModalOpen ?? (() => {})}
                    setLoadingModalMessage={setLoadingModalMessage ?? (() => {})}
                    slots={slots}
                    onScheduleLesson={onScheduleLesson}
                    curricula={curricula}
                    settings={settings}
                    onStartClassroom={() => {}}
                /></AuraView>}
                {view === 'uda' && <AuraView><UdaPlanner
                    uda={uda}
                    onSaveUda={onSaveUda}
                    onDeleteUda={(id: string) => setUda((prev) => prev.filter((u: Uda) => u.id !== id))}
                    lessons={lessons}
                    onUpdateUdaLessons={() => {}}
                    aiSettings={aiSettings}
                    knowledgeBase={knowledgeBase}
                    competenze={settings.competenze}
                    settings={settings}
                    onSaveReport={onSaveReport}
                    onNavigate={handleNavigate}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    setIsLoadingModalOpen={setIsLoadingModalOpen ?? (() => {})}
                    setLoadingModalMessage={setLoadingModalMessage ?? (() => {})}
                    eventi={eventi}
                    onAddLessons={onAddLessons}
                    onSaveEvent={onSaveEvent}
                    curricula={curricula}
                /></AuraView>}
                {view === 'rubriche' && <AuraView><RubricheManager
                    competenze={settings.competenze}
                    rubriche={rubriche}
                    onSaveRubrica={(r: Rubrica) => setRubriche(prev => { const newRubrics = prev.filter(ru => ru.id !== r.id); return [...newRubrics, r]; })}
                    onNavigate={handleNavigate}
                /></AuraView>}
                {view === 'didattica-inclusiva' && <AuraView><DidatticaInclusiva
                    students={students}
                    pianiInclusione={pianiInclusione}
                    onSavePiano={(p: PianoInclusione) => setPianiInclusione((prev: Record<string, PianoInclusione>) => ({ ...prev, [p.id]: p }))}
                    onDeletePiano={(id: string) => setPianiInclusione((prev: Record<string, PianoInclusione>) => { const newP = { ...prev }; delete newP[id]; return newP; })}
                    aiSettings={aiSettings}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    studentToEdit={
                        typeof viewContext === 'object' && viewContext !== null && 'student' in viewContext
                            ? (viewContext as { student: Studente }).student
                            : undefined
                    }
                    onClearStudentToEdit={() => setViewContext({ student: undefined })}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    onAiProcessing={() => {}}
                /></AuraView>}
                {view === 'evaluations' && <AuraView><EvaluationModule
                    students={students}
                    evaluations={evaluations}
                    setEvaluations={setEvaluations}
                    competencyEvaluations={competencyEvals}
                    setCompetencyEvaluations={setCompetencyEvals}
                    userClasses={settings.classi}
                    settings={settings}
                    aiSettings={aiSettings}
                    initialClass={typeof viewContext === 'string' ? viewContext : undefined}
                    onClearInitialStudent={() => setViewContext({ initialStudentId: undefined })}
                    onOpenInclusionPlanEditor={(student: Studente) => handleNavigate('didattica-inclusiva', { student })}
                    showGuidanceTips={settings.showGuidanceTips}
                    register={finalizedRegister}
                    lessons={lessons}
                /></AuraView>}
                {view === 'register' && <AuraView><RegisterView
                    entries={finalizedRegister}
                    lessons={lessons}
                    students={students}
                    initialClass={typeof viewContext === 'string' ? viewContext : undefined}
                /></AuraView>}
                {view === 'improvement-guide' && <AuraView><ImprovementGuide
                    selectedClass={typeof viewContext === 'string' ? viewContext : ''}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    lessons={lessons}
                    register={finalizedRegister}
                    settings={settings}
                    aiSettings={aiSettings}
                /></AuraView>}
                {view === 'consiglio-di-classe' && <AuraView><ConsiglioClasse
                    selectedClass={typeof viewContext === 'string' ? viewContext : ''}
                    students={students}
                    evaluations={evaluations}
                    giudizi={giudizi}
                    onSaveGiudizio={(g: GiudizioPeriodico) => setGiudizi(prev => ({ ...prev, [`${g.studenteId}-${g.periodo}-${g.annoScolastico}`]: g }))}
                    settings={settings}
                    aiSettings={aiSettings}
                    annoScolasticoCorrente={settings.annoScolasticoCorrente}
                    onViewStudentProfile={setStudentProfileContext}
                    competencyEvaluations={competencyEvals}
                /></AuraView>}
                {view === 'class-competency-dashboard' && <AuraView><ClassCompetencyDashboard
                    selectedClass={typeof viewContext === 'string' ? viewContext : ''}
                    students={students}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    onViewStudentProfile={setStudentProfileContext}
                /></AuraView>}
                {view === 'analytics' && <AuraView><AnalyticsHub
                    userClasses={settings.classi}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    aiSettings={aiSettings}
                /></AuraView>}
                {view === 'student-dashboard' && <StudentLoginScreen
                    students={students}
                    onLogin={(student: Studente) => handleNavigate('student-workspace', { studentId: student.id })}
                    onCancel={() => handleNavigate('home')}
                    securityPin={safeSecurityPin}
                />}
                {view === 'student-workspace' && (() => {
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
                                    Impossibile trovare il profilo studente selezionato. I dati potrebbero essere stati aggiornati.
                                </p>
                                <button onClick={() => handleNavigate('student-dashboard')} className="button button-filled rounded-lg hover:shadow-md transition-all mt-4">
                                    Torna al Login
                                </button>
                            </div>
                        );
                    }
                    const studentKb = knowledgeBase.filter(k => k.category === 'materiale_didattico' || k.fileName.includes(currentStudent.classe));
                    return <AuraView><StudentClassroomView
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
                    /></AuraView>;
                })()}
                {view === 'teacher-inbox' && <AuraView fullWidth><TeacherInbox
                    submissions={safeSubmissions}
                    students={students}
                    lessons={lessons}
                    onGradeSubmission={handleGradeSubmission}
                    onClose={() => handleBack(true)}
                /></AuraView>}
                {view === 'competency-levels' && <AuraView><CompetencyLevelsView
                    competenze={settings.competenze}
                /></AuraView>}
                {view === 'curriculum-manager' && <AuraView fullWidth><CurriculumManager
                    curricula={curricula || []}
                    onUpdateCurricula={setCurricula}
                    settings={settings}
                    aiSettings={aiSettings}
                    onNavigate={handleNavigate}
                /></AuraView>}
                {view === 'live-assistant' && <AuraView fullWidth><LiveAssistant
                    students={students}
                    evaluations={evaluations}
                    slots={slots}
                    lessons={lessons}
                    pianiInclusione={pianiInclusione}
                    knowledgeBase={knowledgeBase}
                    onNavigate={handleNavigate}
                    onCreateEvent={(eventWithoutId: Omit<EventoCalendario, 'id'>) => {
                        const newEvent: EventoCalendario = {
                            ...eventWithoutId,
                            id: `evt-${Date.now()}-${Math.random()}`
                        };
                        setEventi((prev: EventoCalendario[]) => [...prev, newEvent]);
                    }}
                    onScheduleLesson={(data: LessonScheduleInput) => { onScheduleLesson(data); modals.setIsLiveAssistantModalOpen?.(false); }}
                    onAddEvaluation={(data: EvaluationInput) => { handleAddEvaluation(data); modals.setIsLiveAssistantModalOpen?.(false); }}
                    onCreateUda={(data: UdaCreateInput) => { handleCreateUda(data); modals.setIsLiveAssistantModalOpen?.(false); }}
                    onAddNote={(data: { note: string; studentName?: string; }) => { handleAddNote(data); modals.setIsLiveAssistantModalOpen?.(false); }}
                    onMarkAttendance={(data: { studentName: string; status: string; }) => { onMarkAttendance(data); modals.setIsLiveAssistantModalOpen?.(false); }}
                    onLoadDemoData={() => { handleLoadDemoData(); modals.setIsLiveAssistantModalOpen?.(false); }}
                    userContext={user}
                /></AuraView>}
                {view === 'teacher-presentation-view' && <AuraView><TeacherPresentationView onNavigate={handleNavigate} /></AuraView>}

                {view === 'aula-session' && (() => {
                    let draftKey: string | undefined = undefined;
                    if (typeof viewContext === 'object' && viewContext !== null && 'draftKey' in viewContext) {
                        draftKey = (viewContext as { draftKey: string }).draftKey;
                    }
                    const currentDraftEntry = draftKey !== undefined ? draftRegister[draftKey] : undefined;
                    return currentDraftEntry ? (
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
                                onFinalizeRegister={(key: string) => { const entry = draftRegister[key]; setFinalizedRegister(prev => [...prev, { ...entry, status: 'finalized' }]); setDraftRegister(prev => { const newDrafts = { ...prev }; delete newDrafts[key]; return newDrafts; }); handleBack(true); }}
                                onReopenRegister={(key: string) => setDraftRegister(prev => ({ ...prev, [key]: { ...prev[key], status: 'draft' } }))}
                                onCloseView={() => handleBack(true)}
                                settings={settings}
                                onSaveOralEvaluation={handleAddEvaluation}
                                onOpenStudentActionMenu={() => { }}
                                onOpenAulaTool={() => { }}
                                onPromoteImpromptuLesson={(lesson: Lezione) => setLessons(prev => ({ ...prev, [lesson.id]: lesson }))}
                                onOpenLiveAssistant={() => { console.warn('[DEBUG] Trigger: ViewManager -> onOpenLiveAssistant'); setIsLiveAssistantModalOpen?.(true); }}
                                setStudentProfileContext={setStudentProfileContext}
                                onNavigate={handleNavigate}
                            />
                        </AuraView>
                    ) : (
                        <div className="p-4 text-error">Errore: Dati lezione in bozza non trovati.</div>
                    );
                })()}

                {view === 'welcome' && null}
                {view === 'video-analysis' && null}

                {![
                    'home', 'timetable', 'calendario', 'settings', 'aula', 'studenti', 'progettazione-hub',
                    'reportistica', 'knowledge-base', 'studio', 'lessons', 'uda', 'rubriche',
                    'didattica-inclusiva', 'feed-manager', 'evaluations', 'register',
                    'improvement-guide', 'consiglio-di-classe', 'class-competency-dashboard', 'analytics',
                    'student-dashboard', 'student-workspace', 'aula-session', 'competency-levels',
                    'live-assistant', 'welcome', 'curriculum-manager', 'teacher-inbox',
                    'video-analysis', 'teacher-presentation-view'
                ].includes(view) && (
                        <AuraView>
                            <div className="p-12 text-center opacity-50"><h2 className="m3-headline-medium">Vista "{view}" non trovata</h2><button onClick={() => actions.handleNavigate('home')} className="button button-filled rounded-lg hover:shadow-md transition-all mt-4">Torna alla Home</button></div>
                        </AuraView>
                    )}
            </>
        );
    }, [view, viewContext, appState, actions, modals, user, students, slots, activeSuggestion, dismissedSuggestions, isGlobalAiLoading, installPrompt, notifiche, settings, navigationHistory, lessons, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, aiSettings, themeState, backupState, driveSyncState, suggestions, studentProfileContext, curricula, submissions, dismissSuggestion, setStudentProfileContext, setCircularAnalysisModal, setIsLoadingModalOpen, setLoadingModalMessage, setEditingSlotKey, showToast, clearToast, handleNavigate, handleBack, handleLoadDemoData, handleCleanDemoData, handleEditSlot, handleShowSlotActions, handleAiSuggest, onScheduleLesson, handleAddEvaluation, handleCreateUda, handleAddNote, onMarkAttendance, setViewContext, onSaveUda, onSaveReport, onSaveEvent, onAddLessons, handleGradeSubmission, handleOpenOperations]);

    return renderView;
}

export default ViewManager;
