/**
 * actionRouter.ts — Maps ParsedIntent to DocenteDoc AI store actions.
 *
 * CLIENT-SIDE ONLY: imports Zustand stores that use localStorage.
 * DO NOT import this module in api/ Edge Functions.
 *
 * Architecture:
 *   Chat → Edge Function → parseIntent → confirmText → reply to user
 *   App  → IntegrationEvent → actionRouter.routeIntent() → store mutations
 *
 * The edge functions parse intent and send confirmations immediately.
 * When the teacher opens the app, pending IntegrationEvents become
 * executable actions via this router (called from event subscribers).
 *
 * Connections to real stores:
 *   useStudentStore    → add_student, add_evaluation, show_students, show_class
 *   useAcademicStore   → schedule_event, mark_attendance
 *   useSystemStore     → trackAnalyticsEvent (all actions)
 *   useTeacherModelStore → getNextActionSuggestion() reads capabilityLevel
 *   useIntegrationStore  → drive status check; publishActionEvent()
 */

import type { ParsedIntent, IntegrationEventType } from '../../types/integration.types';
import type { Studente, Valutazione } from '../../types';
import { useStudentStore }       from '../../stores/useStudentStore';
import { useAcademicStore }      from '../../stores/useAcademicStore';
import { useSystemStore }        from '../../stores/useSystemStore';
import { useTeacherModelStore }  from '../../stores/useTeacherModelStore';
import { useIntegrationStore }   from '../../stores/useIntegrationStore';
import { getNextAction }         from '../../cognition/decisionEngine/getNextAction';
import type { NextActionContext } from '../../cognition/decisionEngine/types';

// ─── Result type ──────────────────────────────────────────────────────────────

export interface ActionResult {
    ok: boolean;
    /** Italian message for chat reply */
    message: string;
    /** Event emitted on success — consumed by publishActionEvent() */
    eventType?: IntegrationEventType;
    /** Whether the teacher must open the app to complete the action */
    requiresApp: boolean;
    /** Serialisable data for the cross-surface event payload */
    data?: Record<string, unknown>;
}

// ─── Main router ──────────────────────────────────────────────────────────────

export async function routeIntent(intent: ParsedIntent): Promise<ActionResult> {
    const { action, params } = intent;

    switch (action) {
        case 'create_class':       return handleCreateClass(params);
        case 'add_student':        return handleAddStudent(params);
        case 'import_students':    return handleImportStudents(params);
        case 'classroom_import':   return handleClassroomImport();
        case 'drive_sync':         return handleDriveSync();
        case 'create_uda':         return handleCreateUda(params);
        case 'schedule_event':     return handleScheduleEvent(params);
        case 'mark_attendance':    return handleMarkAttendance(params);
        case 'add_evaluation':     return handleAddEvaluation(params);
        case 'show_students':      return handleShowStudents(params);
        case 'show_class':         return handleShowClass();
        case 'generate_content':   return handleGenerateContent(params);
        case 'show_next_step':
            return {
                ok: true,
                message: getNextActionSuggestion(),
                requiresApp: false,
            };
        default:
            return {
                ok: false,
                message: getNextActionSuggestion(),
                requiresApp: false,
            };
    }
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

function handleCreateClass(params: Record<string, string>): ActionResult {
    const className = params.className ?? '';
    if (!className) {
        return {
            ok: false,
            message: 'Specifica il nome della classe. Es: "crea classe 2B"',
            requiresApp: false,
        };
    }

    const { students } = useStudentStore.getState();
    const classStudents = students.filter(
        (s) => s.classe.toUpperCase() === className.toUpperCase() && !s.isArchived
    );
    if (classStudents.length > 0) {
        return {
            ok: true,
            message: `La classe ${className} esiste già con ${classStudents.length} studenti. Scrivi "mostra studenti classe ${className}" per vederli.`,
            requiresApp: false,
        };
    }

    useSystemStore.getState().actions.trackAnalyticsEvent('feature_usage', 'chat_create_class', { className });

    return {
        ok: true,
        message: `Classe ${className} registrata ✓\nApri l'app per aggiungere studenti.`,
        eventType: 'class_created',
        requiresApp: true,
        data: { className },
    };
}

function handleAddStudent(params: Record<string, string>): ActionResult {
    const { studentName, className } = params;
    if (!studentName) {
        return {
            ok: false,
            message: 'Specifica il nome. Es: "aggiungi studente Mario Bianchi in classe 2B"',
            requiresApp: false,
        };
    }

    const parts = studentName.trim().split(' ');
    const nome = parts[0] ?? '';
    const cognome = parts.slice(1).join(' ');

    const newStudent: Studente = {
        id: `temp-${Date.now()}`,
        nome,
        cognome,
        classe: className ?? '',
    };

    useStudentStore.getState().actions.saveStudent(newStudent);
    useSystemStore.getState().actions.trackAnalyticsEvent('feature_usage', 'chat_add_student', { studentName });

    return {
        ok: true,
        message: `${nome} ${cognome} aggiunto${className ? ` alla classe ${className}` : ''} ✓`,
        eventType: 'student_added',
        requiresApp: false,
        data: { studentId: newStudent.id, studentName, className: className ?? '' },
    };
}

function handleImportStudents(params: Record<string, string>): ActionResult {
    return {
        ok: true,
        message:
            'Per importare studenti:\n' +
            '1. Apri DocenteDoc AI\n' +
            '2. Impostazioni → Dati & Cloud → Importa dati\n' +
            '3. Carica il file CSV/Excel\n\n' +
            'Oppure inviami direttamente il file CSV.',
        requiresApp: true,
        data: { className: params.className ?? '' },
    };
}

function handleClassroomImport(): ActionResult {
    return {
        ok: true,
        message:
            'Per collegare Google Classroom:\n' +
            '1. Apri DocenteDoc AI\n' +
            '2. Impostazioni → Integrazioni → Google Classroom\n' +
            '3. Premi "Collega"\n\n' +
            'Dopo la connessione le classi si aggiornano automaticamente.',
        requiresApp: true,
    };
}

function handleDriveSync(): ActionResult {
    const driveIntegration = useIntegrationStore
        .getState()
        .integrations.find((i) => i.id === 'google_drive');

    if (driveIntegration?.status !== 'connected') {
        return {
            ok: false,
            message:
                'Google Drive non è collegato.\n' +
                'Apri DocenteDoc AI → Impostazioni → Integrazioni → Google Drive.',
            requiresApp: true,
        };
    }

    return {
        ok: true,
        message: 'Backup Drive avviato ✓\nApri l\'app per monitorare il progresso.',
        eventType: 'drive_synced',
        requiresApp: true,
    };
}

function handleCreateUda(params: Record<string, string>): ActionResult {
    const subject = params.subject ?? '';
    return {
        ok: true,
        message:
            `Creo una UDA${subject ? ` su "${subject}"` : ''} ✓\n` +
            'Apri l\'app per completare il piano didattico: obiettivi, fasi e valutazione.',
        eventType: 'uda_created',
        requiresApp: true,
        data: { subject },
    };
}

function handleScheduleEvent(params: Record<string, string>): ActionResult {
    const { title, date } = params;
    if (!title && !date) {
        return {
            ok: false,
            message: 'Specifica l\'evento. Es: "segna riunione di dipartimento il 20/03"',
            requiresApp: false,
        };
    }

    const newEvent = {
        id: `chat-${Date.now()}`,
        titolo: title || 'Evento da chat',
        data: date || new Date().toISOString().split('T')[0],
        tipo: 'impegno' as const,
    };

    useAcademicStore.getState().actions.setEventi((prev) => [...prev, newEvent]);
    useSystemStore.getState().actions.trackAnalyticsEvent('feature_usage', 'chat_schedule_event', { title: title ?? '' });

    return {
        ok: true,
        message: `Evento "${newEvent.titolo}"${date ? ` per il ${date}` : ''} aggiunto al calendario ✓`,
        eventType: 'event_scheduled',
        requiresApp: false,
        data: { eventId: newEvent.id, title: newEvent.titolo, date: newEvent.data },
    };
}

function handleMarkAttendance(params: Record<string, string>): ActionResult {
    const { className } = params;
    if (!className) {
        return {
            ok: true,
            message: 'Per registrare le presenze apri DocenteDoc AI → Registri → Presenze.',
            requiresApp: true,
        };
    }

    return {
        ok: true,
        message: `Registro presenze classe ${className}: apri DocenteDoc AI per completare l'appello.`,
        eventType: 'attendance_marked',
        requiresApp: true,
        data: { className },
    };
}

function handleAddEvaluation(params: Record<string, string>): ActionResult {
    const { studentName, grade } = params;
    if (!studentName || !grade) {
        return {
            ok: false,
            message: 'Specifica studente e voto. Es: "aggiungi voto 8 a Mario Bianchi"',
            requiresApp: false,
        };
    }

    const { students } = useStudentStore.getState();
    const found = students.find((s) =>
        `${s.nome} ${s.cognome}`.toLowerCase().includes(studentName.toLowerCase())
    );

    if (!found) {
        return {
            ok: false,
            message: `Studente "${studentName}" non trovato. Verifica il nome nell'app.`,
            requiresApp: true,
        };
    }

    const newEval: Omit<Valutazione, 'id'> = {
        studenteId: found.id,
        materia: '',
        data: new Date().toISOString().split('T')[0],
        tipo: 'Orale',
        voto: grade,
    };

    useStudentStore.getState().actions.addEvaluation(newEval);
    useSystemStore.getState().actions.trackAnalyticsEvent('feature_usage', 'chat_add_evaluation', { studentName, grade });

    return {
        ok: true,
        message: `Voto ${grade} aggiunto a ${found.nome} ${found.cognome} ✓`,
        eventType: 'evaluation_added',
        requiresApp: false,
        data: { studentId: found.id, grade },
    };
}

function handleShowStudents(params: Record<string, string>): ActionResult {
    const className = params.className ?? '';
    const { students } = useStudentStore.getState();
    const active = students.filter((s) => !s.isArchived);
    const filtered = className
        ? active.filter((s) => s.classe.toUpperCase() === className.toUpperCase())
        : active;

    if (filtered.length === 0) {
        return {
            ok: true,
            message: className
                ? `Nessuno studente trovato nella classe ${className}.`
                : 'Nessuno studente registrato. Usa "importa studenti" per iniziare.',
            requiresApp: false,
        };
    }

    const rows = filtered
        .slice(0, 10)
        .map((s) => `• ${s.nome} ${s.cognome} (${s.classe})`)
        .join('\n');
    const more = filtered.length > 10 ? `\n...e altri ${filtered.length - 10}` : '';

    return {
        ok: true,
        message: `${className ? `Classe ${className}` : 'Studenti'} — ${filtered.length} totali:\n${rows}${more}`,
        requiresApp: false,
    };
}

function handleShowClass(): ActionResult {
    const { students } = useStudentStore.getState();
    const active = students.filter((s) => !s.isArchived);
    const classes = [...new Set(active.map((s) => s.classe))].sort();

    if (classes.length === 0) {
        return {
            ok: true,
            message: 'Nessuna classe registrata. Inizia con "crea classe 2B".',
            requiresApp: false,
        };
    }

    const rows = classes
        .map((c) => {
            const count = active.filter((s) => s.classe === c).length;
            return `• ${c} — ${count} studenti`;
        })
        .join('\n');

    return {
        ok: true,
        message: `Le tue classi (${classes.length}):\n${rows}`,
        requiresApp: false,
    };
}

function handleGenerateContent(params: Record<string, string>): ActionResult {
    return {
        ok: true,
        message: 'Apri il Copilot nell\'app per generare e personalizzare il contenuto.',
        requiresApp: true,
        data: params,
    };
}

// ─── Decision engine ──────────────────────────────────────────────────────────

/**
 * Returns the most relevant next-action suggestion for the chat surface.
 *
 * Delegates to the REAL decision engine (getNextAction) — same brain
 * used by the UI (FloatingSatelliteCopilot, NextStepBanner).
 * No more duplicated / diverging heuristics.
 */
export function getNextActionSuggestion(): string {
    const { capabilityLevel, usageProfile } = useTeacherModelStore.getState();
    const { students } = useStudentStore.getState();

    const ctx: NextActionContext = {
        // eventNames is empty in the server/store context (no EventLogger session here)
        eventNames: new Set<string>(),
        capabilityLevel,
        usage: {
            lessonsCreated:      usageProfile.lessonsCreated,
            udaCreated:          usageProfile.udaCreated,
            copilotRequests:     usageProfile.copilotRequests,
            driveConnected:      usageProfile.driveConnected,
            bookServicesLinked:  usageProfile.bookServicesLinked,
            analyticsViews:      usageProfile.analyticsViews,
            workspaceConfigured: usageProfile.workspaceConfigured,
        },
        hasStudents: students.filter((s) => !s.isArchived).length > 0,
    };

    const action = getNextAction(ctx);
    return `${action.label}: ${action.description}\n\n👉 "${action.cta}" → apri l'app.`;
}

// ─── Cross-surface event publisher ───────────────────────────────────────────

/**
 * Pushes a cross-surface IntegrationEvent after a successful action.
 * Call this immediately after routeIntent() resolves with ok: true.
 */
export function publishActionEvent(intent: ParsedIntent, result: ActionResult): void {
    if (!result.ok || !result.eventType) return;

    useIntegrationStore.getState().actions.pushEvent({
        id: `${intent.source}-${result.eventType}-${Date.now()}`,
        type: result.eventType,
        source: intent.source,
        timestamp: new Date().toISOString(),
        payload: result.data ?? {},
    });
}
