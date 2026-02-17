// Common/shared types

export type EmotionalPreset =
    | 'calm'
    | 'energetic'
    | 'creative'
    | 'focused'
    | 'relaxed'
    | 'professional'
    | 'playful'
    | 'minimal';

export interface KnowledgeBaseEntry {
    id: string;
    fileName: string;
    content: string;
    category?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    id: string;
    email: string;
    nome: string;
    cognome: string;
    role: 'teacher' | 'admin';
    avatar?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    nome: string;
    cognome: string;
    school?: string;
    city?: string;
    avatar?: string;
}

export interface Notifica {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    action?: {
        label: string;
        view: string;
    };
}

export interface AnalyticsEvent {
    id: string;
    type: string;
    timestamp: number;
    data: Record<string, unknown>;
}

export interface AnalyticsMetrics {
    totalStudents: number;
    totalLessons: number;
    averageEvaluation: number;
    completionRate: number;
}

export interface AnalyticsSettings {
    enabled: boolean;
    trackPageViews: boolean;
    trackInteractions: boolean;
    retentionDays: number;
}

export interface DocumentTemplate {
    id: string;
    name: string;
    type: 'student_profile' | 'lesson_plan' | 'uda';
    description?: string;
    createdAt: string;
    updatedAt: string;
    config: {
        includeEvaluations?: boolean;
        includeCompetencyEvaluations?: boolean;
        customSections?: string[];
        includeObjectives?: boolean;
        includeMaterials?: boolean;
        customFields?: string[];
    };
}

export interface GenAIBlob {
    id: string;
    type: 'image' | 'document' | 'audio';
    content: string;
    mimeType: string;
    createdAt: string;
}

export interface TranscriptEntry {
    id: string;
    text: string;
    speaker: string;
    timestamp: number;
}

export interface LessonScheduleInput {
    classId: string;
    subjectId: string;
    day: string;
    hour: string;
    duration?: number;
}

export interface EvaluationInput {
    studentId: string;
    subjectId: string;
    type: 'orale' | 'scritto' | 'pratico' | 'grafico';
    value: number;
    date: string;
}

export interface UdaCreateInput {
    title: string;
    classe: string;
    materia: string;
    introduction: string;
    finalProduct: string;
    competencyIds: string[];
    phases: { title: string; description: string; activities: string; duration: string }[];
    evaluation: string;
    tools: string;
    startDate?: string;
    endDate?: string;
}
