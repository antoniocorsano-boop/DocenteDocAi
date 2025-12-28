import React, { useEffect, useCallback, useMemo } from 'react';
import Home from './Home';
import DemoExpressiveCard from './DemoExpressiveCard';
import { Timetable } from './Timetable';
import Calendar from './Calendar';
import Settings from './Settings';
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
import FeedManager from './FeedManager';
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
import { AppState, AppActions, View, EventoCalendario, Lezione, Valutazione, RegisterEntry, Studente, KnowledgeBaseEntry, Notifica, Rubrica, PianoInclusione, GiudizioPeriodico, Report, FeedSource, NotebookNote, ToDoItem, AiSuggestion, SystemSuggestion, BackupState, DriveSyncState, SyncConflictData, Competenza, Uda, HomeworkSubmission, LessonScheduleInput, EvaluationInput, UdaCreateInput } from '../types';
import { initPersistentStorage } from '../services/backupService';

interface ViewManagerProps {
    view: View;
    viewContext: any;
    appState: AppState;
    actions: AppActions;
    modals: any;
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
        lessons, evaluations, competencyEvals, udas, eventi, knowledgeBase, corpora, rubriche, pianiInclusione, giudizi, reports, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, aiSettings, themeState, backupState, driveSyncState, suggestions, studentProfileContext, selectedClassForDashboard,
        curricula, submissions
    } = appState;

    // Destructure actions (now directly contains actions from Zustand stores or wrapped coordination logic)
    const {
        setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas,
        setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione,
        setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes,
        setMemos, setCurricula, setSubmissions, setSuggestions, setActiveSuggestion, dismissSuggestion,
        setStudentProfileContext, setSelectedClassForDashboard,
        setInstallPrompt, setCanShowInstallPrompt, setIsGlobalAiLoading, setNavigationHistory, addNavigationEntry, popNavigationEntry, clearNavigationHistory, setCircularAnalysisModal, setIsLoadingModalOpen, setLoadingModalMessage, setActiveSlotKey, setEditingSlotKey, setIsVideoAnalysisOpen, setIsRestoring, showToast, clearToast,
        handleNavigate, handleBack, handleLoadDemoData, handleCleanDemoData,
        handleConfigureDrive, handleConnectDrive, handleDisconnectDrive, handleSyncToDrive,
        handleRestoreFromDrive, pickGoogleDriveFolder, createAppFolder, handleInstallApp,
        handleEnterStudentMode, handleStartClassroom, handleEditSlot, handleShowSlotActions,
        handleAiSuggest, onScheduleLesson, handleAddEvaluation,
        handleCreateUda, handleAddNote, onMarkAttendance,
        handleOpenBackupInfo, handleExportData, handleImportData,
        handleAiSuggestionFromHome,
        handleOpenOperations,
        setViewContext,
        handlePromoteStudents,
        handleResetYearData,
        onSaveUda,
        onSaveReport,
        onSaveEvent,
        onAddLessons,
        handleGradeSubmission
    } = actions;

    const safeSubmissions = submissions || [];

    useEffect(() => {
        // initPersistentStorage(); // FIX: Removed redundant call, it's handled in useAppEngine.ts
    }, []);

    // Helper to ensure PIN is valid (fallback to 0000 if empty to prevent lockout)
    const safeSecurityPin = settings.securityPin && settings.securityPin.length === 4 ? settings.securityPin : '0000';

    const renderView = useMemo(() => {
        return (
            <>
                                {view === 'home' && (
                                    <AuraView>
                                        <Home
                                            slots={slots}
                                            lessons={lessons}
                                            onNavigate={handleNavigate}
                                            appState={appState}
                                            onSuggestionAction={handleAiSuggestionFromHome}
                                            onStartClassroom={handleStartClassroom}
                                            finalizedRegister={finalizedRegister}
                                            draftRegister={draftRegister}
                                            showGuidanceTips={settings.showGuidanceTips}
                                            suggestions={suggestions}
                                            dismissSuggestion={dismissSuggestion}
                                            onAiProcessing={setIsGlobalAiLoading}
                                            user={user}
                                            onUpdateMemos={setMemos}
                                            onConnectDrive={handleConnectDrive}
                                            aiSettings={aiSettings}
                                            settings={settings}
                                            handleOpenOperations={handleOpenOperations}
                                        />
                                        {/* DEMO: Card expressive MUI */}
                                        <DemoExpressiveCard />
                                    </AuraView>
                                )}
                {view === 'timetable' && <AuraView><Timetable
                    slots={slots}
                    lessons={lessons}
                    settings={settings}
                    onEditSlot={handleEditSlot}
                    onShowSlotActions={handleShowSlotActions}
                    onAiSuggest={handleAiSuggest}
                    activeSlotKey={modals.activeSlotKey}
                    showGuidanceTips={settings.showGuidanceTips}
                /></AuraView>}
                {view === 'calendario' && <AuraView fullWidth><Calendar
                    eventi={eventi}
                    setEventi={setEventi}
                    aiSettings={aiSettings}
                    activeSuggestion={activeSuggestion}
                    onNavigate={handleNavigate}
                /></AuraView>}
                {view === 'settings' && <AuraView><Settings
                    settings={settings}
                    themeState={themeState}
                    aiSettings={aiSettings}
                    onSaveSettings={actions.setSettings}
                    onSaveTheme={actions.setThemeState}
                    onSaveAiSettings={actions.setAiSettings}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                    showToast={showToast}
                    onDownloadDemoData={handleLoadDemoData}
                    onCleanDemoData={handleCleanDemoData}
                    backupState={backupState}
                    onRestoreFromBackup={handleRestoreFromDrive}
                    onLogout={() => setUser(null)}
                    installPrompt={installPrompt}
                    onInstallApp={handleInstallApp}
                    onEnterStudentMode={handleEnterStudentMode}
                    driveState={driveSyncState}
                    onConnectDrive={handleConnectDrive}
                    onDisconnectDrive={handleDisconnectDrive}
                    onSyncToDrive={handleSyncToDrive}
                    onRestoreFromDrive={handleRestoreFromDrive}
                    onConfigureDrive={handleConfigureDrive}
                    onSelectBackupFolder={pickGoogleDriveFolder}
                    onCreateAppFolder={createAppFolder}
                    onClose={handleBack}
                    onOpenBackupInfo={handleOpenBackupInfo}
                /></AuraView>}
                {view === 'aula' && (viewContext ? <AuraView><ClassDashboard
                    selectedClass={viewContext}
                    onNavigate={handleNavigate}
                    onStartImpromptuSession={(classe) => handleStartClassroom(classe, 'Disposizione', `impromptu-${Date.now()}`, {
                        id: `adhoc-${Date.now()}`,
                        classe,
                        materia: 'Disposizione',
                        contenuto: 'Lezione Improvvisata',
                        svolta: false,
                        tipoLezione: 'Disposizione'
                    })}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    slots={slots}
                    lessons={lessons}
                    onStartPlannedLesson={handleStartClassroom}
                    onViewStudentProfile={setStudentProfileContext}
                    submissions={safeSubmissions}
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
                    onSaveStudent={(s: Studente) => setStudents((prev: Studente[]) => { const newStudents = prev.filter(st => st.id !== s.id); return [...newStudents, s]; })}
                    onDeleteStudent={(id: string) => setStudents((prev: Studente[]) => prev.filter(s => s.id !== id))}
                    onImportStudents={(newStudents: Studente[]) => setStudents((prev: Studente[]) => [...prev, ...newStudents])}
                    userClasses={settings.classi}
                    initialClass={viewContext}
                    knowledgeBase={knowledgeBase}
                /></AuraView>}
                {view === 'progettazione-hub' && <AuraView><ProgettazioneHub
                    onNavigate={handleNavigate}
                    udas={udas}
                    events={eventi}
                    settings={settings}
                    aiSettings={aiSettings}
                    onSaveUda={onSaveUda}
                    onAddLessons={onAddLessons}
                    onSaveReport={onSaveReport}
                    onSaveEvent={onSaveEvent}
                    initialAction={viewContext?.action}
                    knowledgeBase={knowledgeBase}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    setIsLoadingModalOpen={setIsLoadingModalOpen}
                    setLoadingModalMessage={setLoadingModalMessage}
                    students={students}
                    pianiInclusione={pianiInclusione}
                    onUpdateCompetencies={(comp: Competenza[]) => actions.setSettings(prev => ({ ...prev, competenze: comp }))} // FIX: Use actions.setSettings
                    curricula={curricula}
                /></AuraView>}
                {view === 'reportistica' && <AuraView><ReportisticaHub
                    reports={reports}
                    onDeleteReport={(id: string) => setReports(prev => prev.filter(r => r.id !== id))}
                    userClasses={settings.classi}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    settings={settings}
                    udas={udas}
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
                    aiSettings={aiSettings}
                    showToast={showToast}
                    settings={settings}
                    showGuidanceTips={settings.showGuidanceTips}
                /></AuraView>}
                {view === 'studio' && <AuraView><Studio
                    corpora={corpora}
                    knowledgeBase={knowledgeBase}
                    setKnowledgeBase={setKnowledgeBase}
                    aiSettings={aiSettings}
                    onOpenCreateLesson={(content) => modals.setCreateLessonContext(content)}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    onAiProcessing={setIsGlobalAiLoading}
                /></AuraView>}
                {view === 'lessons' && <AuraView><LessonsPage
                    lessons={Object.values(lessons)}
                    udas={udas}
                    knowledgeBase={knowledgeBase}
                    userClasses={settings.classi}
                    onViewLesson={modals.setLessonViewContext}
                    onAddLessons={onAddLessons}
                    onUpdateLesson={(lesson: Lezione) => setLessons(prev => ({ ...prev, [lesson.id]: lesson }))}
                    onStartClassroom={handleStartClassroom}
                    aiSettings={aiSettings}
                    setIsLoadingModalOpen={setIsLoadingModalOpen}
                    setLoadingModalMessage={setLoadingModalMessage}
                    slots={slots}
                    onScheduleLesson={onScheduleLesson} // FIX: Use onScheduleLesson from actions
                    curricula={curricula}
                    settings={settings}
                /></AuraView>}
                {view === 'uda' && <AuraView><UdaPlanner
                    udas={udas}
                    onSaveUda={onSaveUda}
                    onDeleteUda={(id: string) => setUdas(prev => prev.filter(u => u.id !== id))}
                    lessons={lessons}
                    onUpdateUdaLessons={(udaId, newLessons: Lezione[]) => { }}
                    aiSettings={aiSettings}
                    knowledgeBase={knowledgeBase}
                    competenze={settings.competenze}
                    settings={settings}
                    onSaveReport={onSaveReport}
                    onNavigate={handleNavigate}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    setIsLoadingModalOpen={setIsLoadingModalOpen}
                    setLoadingModalMessage={setLoadingModalMessage}
                    eventi={eventi}
                    onAddLessons={onAddLessons}
                    onSaveEvent={onSaveEvent}
                    curricula={curricula}
                /></AuraView>}
                {view === 'rubriche' && <AuraView><RubricheManager
                    competenze={settings.competenze}
                    rubriche={rubriche}
                    onSaveRubrica={(r: Rubrica) => setRubriche(prev => { const newRubrics = prev.filter(ru => ru.id !== r.id); return [...newRubrics, r]; })}
                    onDeleteRubrica={(id: string) => setRubriche(prev => prev.filter(r => r.id !== id))}
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
                    studentToEdit={viewContext?.student}
                    onClearStudentToEdit={() => setViewContext((prev: any) => ({ ...prev, student: undefined }))}
                    showToast={showToast}
                    showGuidanceTips={settings.showGuidanceTips}
                    onAiProcessing={setIsGlobalAiLoading}
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
                    initialClass={viewContext}
                    onClearInitialStudent={() => setViewContext((prev: any) => ({ ...prev, initialStudentId: undefined }))}
                    onOpenInclusionPlanEditor={(student: Studente) => handleNavigate('didattica-inclusiva', { student })}
                    showGuidanceTips={settings.showGuidanceTips}
                    register={finalizedRegister}
                    lessons={lessons}
                /></AuraView>}
                {view === 'register' && <AuraView><RegisterView
                    entries={finalizedRegister}
                    lessons={lessons}
                    students={students}
                    initialClass={viewContext}
                /></AuraView>}
                {view === 'improvement-guide' && <AuraView><ImprovementGuide
                    selectedClass={viewContext}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    lessons={lessons}
                    register={finalizedRegister}
                    settings={settings}
                    aiSettings={aiSettings}
                /></AuraView>}
                {view === 'consiglio-di-classe' && <AuraView><ConsiglioClasse
                    selectedClass={viewContext}
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
                    selectedClass={viewContext}
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
                    const currentStudent = students.find(s => s.id === viewContext.studentId);
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
                    lessons={Object.values(lessons)}
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
                    onScheduleLesson={(data: LessonScheduleInput) => { onScheduleLesson(data); modals.setIsLiveAssistantModalOpen(false); }}
                    onAddEvaluation={(data: EvaluationInput) => { handleAddEvaluation(data); modals.setIsLiveAssistantModalOpen(false); }}
                    onCreateUda={(data: UdaCreateInput) => { handleCreateUda(data); modals.setIsLiveAssistantModalOpen(false); }}
                    onAddNote={(data: { note: string; studentName?: string; }) => { handleAddNote(data); modals.setIsLiveAssistantModalOpen(false); }}
                    onMarkAttendance={(data: { studentName: string; status: string; }) => { onMarkAttendance(data); modals.setIsLiveAssistantModalOpen(false); }}
                    onLoadDemoData={() => { handleLoadDemoData(); modals.setIsLiveAssistantModalOpen(false); }}
                    userContext={user}
                /></AuraView>}
                {view === 'teacher-presentation-view' && <AuraView><TeacherPresentationView onNavigate={handleNavigate} /></AuraView>}

                {view === 'aula-session' && (() => {
                    const currentDraftEntry = draftRegister[viewContext?.draftKey];
                    return currentDraftEntry ? (
                        <AuraView fullWidth>
                            <ClassroomView
                                draftKey={viewContext?.draftKey}
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
                                onOpenLiveAssistant={() => modals.setIsLiveAssistantModalOpen(true)}
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
    }, [view, viewContext, appState, actions, modals, user, students, slots, activeSuggestion, dismissedSuggestions, isGlobalAiLoading, installPrompt, notifiche, settings, navigationHistory, lessons, evaluations, competencyEvals, udas, eventi, knowledgeBase, corpora, rubriche, pianiInclusione, giudizi, reports, feedSources, draftRegister, finalizedRegister, notebookNotes, memos, aiSettings, themeState, backupState, driveSyncState, suggestions, studentProfileContext, selectedClassForDashboard, handleNavigate, handleBack, showToast, handleLoadDemoData, handleCleanDemoData, handleConfigureDrive, handleConnectDrive, handleDisconnectDrive, handleSyncToDrive, handleRestoreFromDrive, pickGoogleDriveFolder, createAppFolder, handleInstallApp, handleEnterStudentMode, handleStartClassroom, handleEditSlot, handleShowSlotActions, handleAiSuggest, modals.setLessonViewContext, setStudentProfileContext, setCircularAnalysisModal, setIsLoadingModalOpen, setLoadingModalMessage, modals.activeSlotKey, setEditingSlotKey, setIsVideoAnalysisOpen, setIsRestoring, clearToast, setViewContext, setUser, setStudents, setLessons, setSlots, setEvaluations, setCompetencyEvals, setUdas, setEventi, setKnowledgeBase, setCorpora, setNotifiche, setRubriche, setPianiInclusione, setGiudizi, setReports, setFeedSources, setDraftRegister, setFinalizedRegister, setNotebookNotes, setMemos, setCurricula, setSubmissions, handleAiSuggestionFromHome, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, curricula, safeSubmissions, onMarkAttendance, safeSecurityPin, handleOpenOperations]);

    return renderView;
};

export default ViewManager;
