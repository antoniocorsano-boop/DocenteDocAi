// MD3 Compliant
import React, { lazy } from 'react';
import { View } from '../types';

// Lazy loaded views
export const Home = lazy(() => import('./Home'));
export const Timetable = lazy(() => import('./Timetable'));
export const Calendar = lazy(() => import('./Calendar'));
export const Settings = lazy(() => import('./Settings'));
export const ClassSelection = lazy(() => import('./ClassSelection'));
export const ClassDashboard = lazy(() => import('./ClassDashboard'));
export const ClassroomView = lazy(() => import('./ClassroomView'));
export const StudentManager = lazy(() => import('./StudentManager'));
export const EvaluationModule = lazy(() => import('./EvaluationModule'));
export const RegisterView = lazy(() => import('./RegisterView'));
export const ClassCompetencyDashboard = lazy(() => import('./ClassCompetencyDashboard'));
export const ProgettazioneHub = lazy(() => import('./ProgettazioneHub'));
export const LessonsPage = lazy(() => import('./LessonsPage'));
export const UdaPlanner = lazy(() => import('./UdaPlanner'));
export const RubricheManager = lazy(() => import('./RubricheManager'));
export const ReportisticaHub = lazy(() => import('./ReportisticaHub'));
export const KnowledgeBase = lazy(() => import('./KnowledgeBase'));
export const AnalyticsHub = lazy(() => import('./AnalyticsHub'));
export const DidatticaInclusiva = lazy(() => import('./DidatticaInclusiva'));
export const StudentLoginScreen = lazy(() => import('./StudentLoginScreen'));
export const StudentClassroomView = lazy(() => import('./StudentClassroomView'));
export const TeacherInbox = lazy(() => import('./TeacherInbox'));
export const ImprovementGuide = lazy(() => import('./ImprovementGuide'));
export const ConsiglioClasse = lazy(() => import('./ConsiglioClasse'));
export const CompetencyLevelsView = lazy(() => import('./CompetencyLevelsView'));
export const CurriculumManager = lazy(() => import('./CurriculumManager'));
export const TeacherPresentationView = lazy(() => import('./TeacherPresentationView'));
export const Studio = lazy(() => import('./Studio'));
export const OrientamentoDashboard = lazy(() => import('./OrientamentoDashboard'));
export const LiveAssistant = lazy(() => import('./LiveAssistant'));
export const TeacherDashboard = lazy(() => import('./TeacherDashboard'));

export interface ViewConfig {
    id: View;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    fullWidth?: boolean;
    auraWrapper?: boolean;
}

export const VIEW_CONFIGS: Partial<Record<View, ViewConfig>> = {
    'home': { id: 'home', component: Home, auraWrapper: true },
    'timetable': { id: 'timetable', component: Timetable, auraWrapper: true },
    'calendario': { id: 'calendario', component: Calendar, auraWrapper: true },
    'settings': { id: 'settings', component: Settings, auraWrapper: true },
    'aula': { id: 'aula', component: ClassSelection, auraWrapper: true },
    'studenti': { id: 'studenti', component: StudentManager, auraWrapper: true },
    'progettazione-hub': { id: 'progettazione-hub', component: ProgettazioneHub, auraWrapper: true },
    'reportistica': { id: 'reportistica', component: ReportisticaHub, auraWrapper: true },
    'knowledge-base': { id: 'knowledge-base', component: KnowledgeBase, auraWrapper: true },
    'studio': { id: 'studio', component: Studio, auraWrapper: true, fullWidth: true },
    'lessons': { id: 'lessons', component: LessonsPage, auraWrapper: true },
    'uda': { id: 'uda', component: UdaPlanner, auraWrapper: true },
    'rubriche': { id: 'rubriche', component: RubricheManager, auraWrapper: true },
    'didattica-inclusiva': { id: 'didattica-inclusiva', component: DidatticaInclusiva, auraWrapper: true },
    'evaluations': { id: 'evaluations', component: EvaluationModule, auraWrapper: true },
    'register': { id: 'register', component: RegisterView, auraWrapper: true },
    'improvement-guide': { id: 'improvement-guide', component: ImprovementGuide, auraWrapper: true },
    'consiglio-di-classe': { id: 'consiglio-di-classe', component: ConsiglioClasse, auraWrapper: true },
    'class-competency-dashboard': { id: 'class-competency-dashboard', component: ClassCompetencyDashboard, auraWrapper: true },
    'analytics': { id: 'analytics', component: AnalyticsHub, auraWrapper: true },
    'student-dashboard': { id: 'student-dashboard', component: StudentLoginScreen, auraWrapper: true },
    'student-workspace': { id: 'student-workspace', component: StudentClassroomView, auraWrapper: true, fullWidth: true },
    'competency-levels': { id: 'competency-levels', component: CompetencyLevelsView, auraWrapper: true },
    'live-assistant': { id: 'live-assistant', component: LiveAssistant, auraWrapper: true, fullWidth: true },
    'curriculum-manager': { id: 'curriculum-manager', component: CurriculumManager, auraWrapper: true, fullWidth: true },
    'teacher-inbox': { id: 'teacher-inbox', component: TeacherInbox, auraWrapper: true },
    'teacher-presentation-view': { id: 'teacher-presentation-view', component: TeacherPresentationView, auraWrapper: true },
    'orientamento': { id: 'orientamento', component: OrientamentoDashboard, auraWrapper: true, fullWidth: true },
    'teacher-dashboard': { id: 'teacher-dashboard', component: TeacherDashboard, auraWrapper: true },
};

// ---------------------------------------------------------------------------
// VIEW_LABELS — label leggibile per ogni view (usato da Breadcrumb e <title>)
// ---------------------------------------------------------------------------
export const VIEW_LABELS: Record<View, string> = {
    'home':                         'Home',
    'timetable':                    'Orario',
    'calendario':                   'Agenda',
    'settings':                     'Impostazioni',
    'aula':                         'Classi',
    'studenti':                     'Studenti',
    'progettazione-hub':            'Progettazione',
    'reportistica':                 'Reportistica',
    'knowledge-base':               'Knowledge Base',
    'studio':                       'Studio AI',
    'lessons':                      'Lezioni',
    'uda':                          'UDA',
    'rubriche':                     'Rubriche',
    'didattica-inclusiva':          'Didattica Inclusiva',
    'feed-manager':                 'Feed',
    'evaluations':                  'Valutazioni',
    'register':                     'Registro',
    'improvement-guide':            'Piano di Miglioramento',
    'consiglio-di-classe':          'Consiglio di Classe',
    'class-competency-dashboard':   'Dashboard Competenze',
    'analytics':                    'Analisi Classe',
    'student-dashboard':            'Area Studenti',
    'student-workspace':            'Spazio Studente',
    'aula-session':                 'Sessione in Aula',
    'competency-levels':            'Livelli di Competenza',
    'live-assistant':               'Assistente Live',
    'welcome':                      'Benvenuto',
    'orientamento':                 'Orientamento',
    'curriculum-manager':           'Curriculum',
    'teacher-inbox':                'Inbox Docente',
    'video-analysis':               'Analisi Video',
    'teacher-presentation-view':    'Presentazione',
    'teacher-dashboard':             'Dashboard Docente',
    'copilot':                       'Copilot Docente',
};

// ---------------------------------------------------------------------------
// VIEW_PARENT — mappa ogni sub-view alla voce primaria di navigazione genitore
// ---------------------------------------------------------------------------
export const VIEW_PARENT: Partial<Record<View, View>> = {
    // Sotto Progettazione
    'knowledge-base':           'progettazione-hub',
    'studio':                   'progettazione-hub',
    'lessons':                  'progettazione-hub',
    'uda':                      'progettazione-hub',
    'rubriche':                 'progettazione-hub',
    'reportistica':             'progettazione-hub',
    'didattica-inclusiva':      'progettazione-hub',
    'curriculum-manager':       'progettazione-hub',
    'feed-manager':             'progettazione-hub',
    'competency-levels':        'progettazione-hub',
    // Sotto Classi
    'evaluations':              'aula',
    'register':                 'aula',
    'studenti':                 'aula',
    'improvement-guide':        'aula',
    'consiglio-di-classe':      'aula',
    'class-competency-dashboard': 'aula',
    'analytics':                'aula',
    'teacher-inbox':            'aula',
    'aula-session':             'aula',
    'live-assistant':           'aula',
    'teacher-presentation-view': 'aula',
    'student-dashboard':        'aula',
    'student-workspace':        'aula',
};

// ---------------------------------------------------------------------------
// PREFETCH_MAP — adjacent views to warm-load after the current view renders.
// Used by usePrefetch hook (Roadmap #21).
// ---------------------------------------------------------------------------
export const PREFETCH_MAP: Partial<Record<View, Array<() => Promise<unknown>>>> = {
    'home': [
        (): Promise<unknown> => import('./ProgettazioneHub'),
        (): Promise<unknown> => import('./ClassSelection'),
        (): Promise<unknown> => import('./Calendar'),
    ],
    'progettazione-hub': [
        (): Promise<unknown> => import('./UdaPlanner'),
        (): Promise<unknown> => import('./LessonsPage'),
        (): Promise<unknown> => import('./ReportisticaHub'),
        (): Promise<unknown> => import('./KnowledgeBase'),
    ],
    'aula': [
        (): Promise<unknown> => import('./ClassDashboard'),
        (): Promise<unknown> => import('./EvaluationModule'),
        (): Promise<unknown> => import('./ClassroomView'),
        (): Promise<unknown> => import('./StudentManager'),
    ],
    'uda': [
        (): Promise<unknown> => import('./LessonsPage'),
        (): Promise<unknown> => import('./ReportisticaHub'),
    ],
    'studenti': [
        (): Promise<unknown> => import('./EvaluationModule'),
        (): Promise<unknown> => import('./ClassCompetencyDashboard'),
        (): Promise<unknown> => import('./DidatticaInclusiva'),
    ],
    'studio': [
        (): Promise<unknown> => import('./KnowledgeBase'),
        (): Promise<unknown> => import('./AnalyticsHub'),
    ],
    'evaluations': [
        (): Promise<unknown> => import('./ClassCompetencyDashboard'),
        (): Promise<unknown> => import('./RegisterView'),
    ],
};
