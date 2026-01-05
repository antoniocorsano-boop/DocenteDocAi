
import React, { useMemo } from 'react';
import { View, NavigationParams } from '../types';
import { ActionTile, M3ExpressiveCard } from './ui';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useStudentStore } from '../stores/useStudentStore';

interface HomeProps {
    onNavigate: (view: View, params?: NavigationParams) => void;
    dismissSuggestion: (id: string) => void;
    onOpenRegisterImport?: () => void;
}

interface QuickAction {
    label: string;
    icon: string;
    view: View;
    helper: string;
    tone: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant';
    params?: NavigationParams;
}

const QUICK_ACTIONS: QuickAction[] = [
    { label: 'Appello', icon: 'playlist_add_check', view: 'aula', helper: 'Registra presenze', tone: 'primary' },
    { label: 'Valutazioni', icon: 'scoreboard', view: 'evaluations', helper: 'Inserisci voti', tone: 'secondary' },
    { label: 'Registro', icon: 'sync', view: 'home', helper: 'Sincronizza dati', tone: 'tertiary' },
    { label: 'Documenti', icon: 'description', view: 'progettazione-hub', helper: 'Modelli & report', tone: 'surfaceVariant' },
];

const Home: React.FC<HomeProps> = ({ onNavigate, dismissSuggestion, onOpenRegisterImport }) => {
    // Granular store access for performance
    const activeSuggestion = useSystemStore(state => state.activeSuggestion);
    const dismissedSuggestions = useSystemStore(state => state.dismissedSuggestions);
    const suggestions = useSystemStore(state => state.suggestions) || [];
    const lessons = useAcademicStore(state => state.lessons);
    const students = useStudentStore(state => state.students);
    
    const showAiSuggestion = activeSuggestion && !dismissedSuggestions?.has(activeSuggestion.id);

    // Recupera nome docente dalle impostazioni
    const settings = useSettingsStore((state) => state.settings);
    const nomeInsegnante = settings.nomeInsegnante || 'Professore';
    const cognomeInsegnante = settings.cognomeInsegnante || '';

    interface RecentActivity { id: string; title: string; meta?: string; time?: string }
    
    // Metrics derived from stores
    const metrics = useMemo(() => ({
        studenti: students.length || 24,
        verificheOggi: 2, // Placeholder or derive from events
        presenze: '98%' // Placeholder
    }), [students.length]);

    const recentActivities: RecentActivity[] = []; // Placeholder

    const nextLesson = useMemo(() => {
        const list = Object.values(lessons || {});
        return list.length ? list[0] : null;
    }, [lessons]);

    const lessonTagline = nextLesson ? `${nextLesson.classe} • ${nextLesson.tipoLezione ?? 'Lezione in classe'}` : 'Pianifica la prossima lezione';
    const lessonDetails = nextLesson?.obiettivi || nextLesson?.contenuto || 'Utilizza l’integrazione AI per costruire contenuti e obiettivi in pochi tap.';

    const todayLabel = useMemo(() => new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }), []);

    return (
        <div className="home-container pt-4 md:pt-8 pb-12 px-6 md:px-8 space-y-8 max-w-7xl mx-auto">
            {/* Saluto docente */}
            <section className="space-y-6">
                <header className="space-y-2">
                    <h1 className="m3-headline-medium font-black tracking-tight text-on-surface">Buongiorno Prof. {cognomeInsegnante || nomeInsegnante}!</h1>
                    <div className="flex items-center justify-between m3-label-tiny text-primary font-black uppercase tracking-[0.3em] opacity-70">
                        <span>{todayLabel}</span>
                        <span className="hidden md:inline tracking-[0.4em]">Dashboard Docente</span>
                    </div>
                </header>

                <div className="space-y-4">
                    <p className="m3-label-small uppercase tracking-[0.3em] text-on-surface-variant font-black opacity-50">Azioni rapide</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {QUICK_ACTIONS.map((action) => (
                            <ActionTile
                                key={action.label}
                                title={action.label}
                                subtitle={action.helper}
                                icon={action.icon}
                                variant={action.tone}
                                onClick={() => {
                                    if (action.label === 'Registro' && onOpenRegisterImport) {
                                        onOpenRegisterImport();
                                    } else {
                                        onNavigate(action.view, action.params);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <M3ExpressiveCard icon="group" title="Studenti" description={`${metrics.studenti} iscritti`} color="primary" onClick={() => onNavigate('studenti' as View)} />
                    <M3ExpressiveCard icon="assignment" title="Verifiche oggi" description={`${metrics.verificheOggi} programmate`} color="secondary" onClick={() => onNavigate('evaluations' as View)} />
                    <M3ExpressiveCard icon="check_circle" title="Presenze" description={`${metrics.presenze} media`} color="tertiary" onClick={() => onNavigate('studenti' as View)} />
                </div>
                {nextLesson && (
                    <div className="hero-card group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    Prossima Lezione
                                </div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-2xl text-primary">school</span>
                                </div>
                            </div>
                            <h2 className="m3-headline-small font-black text-on-surface tracking-tight leading-tight mb-8">
                                {nextLesson.materia}
                            </h2>
                            <p className="m3-title-medium text-primary font-bold mb-6">{lessonTagline}</p>
                            <p className="m3-body-large text-on-surface-variant font-medium leading-relaxed opacity-80 line-clamp-3">
                                {lessonDetails}
                            </p>
                        </div>
                        
                        <div className="mt-10 flex gap-8 relative z-10">
                            <button 
                                onClick={() => onNavigate('aula' as View, { classe: nextLesson.classe })}
                                className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Vai alla classe
                            </button>
                            <button 
                                onClick={() => onNavigate('lessons' as View)}
                                className="px-8 py-4 bg-white/50 backdrop-blur-md text-on-surface rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/80 transition-all"
                            >
                                Organizza contenuti
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                        <M3ExpressiveCard
                            icon="history"
                            title="Attività Recenti"
                            description="Ultime azioni svolte"
                            color="surface"
                        >
                            <div className="mt-4 space-y-3">
                                {recentActivities.slice(0, 5).map((a) => (
                                    <div key={a.id} className="p-8 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 flex items-center justify-between group/item hover:bg-surface-container-low transition-colors">
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-widest text-on-surface">{a.title}</div>
                                            <div className="text-[10px] font-medium text-on-surface-variant mt-4">{a.meta}</div>
                                        </div>
                                        <div className="text-[10px] font-black text-on-surface-variant opacity-40">{a.time}</div>
                                    </div>
                                ))}
                                {recentActivities.length === 0 && (
                                    <div className="text-center py-8 opacity-40 italic text-sm">Nessuna attività recente</div>
                                )}
                            </div>
                        </M3ExpressiveCard>

                    <div className="lg:col-span-1 space-y-6">
                        {showAiSuggestion ? (
                            <div className="aura-glass p-8 md:p-8 h-full flex flex-col border-l-4 border-primary relative overflow-hidden group rounded-3xl">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="flex items-center gap-6 mb-8 md:mb-6 relative z-10">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Suggerimento AI</span>
                                </div>
                                <h3 className="text-xl md:m3-title-large font-black text-on-surface mb-8 leading-tight relative z-10">{activeSuggestion.title}</h3>
                                <p className="text-sm md:m3-body-medium text-on-surface-variant font-medium mb-6 md:mb-8 opacity-80 relative z-10">{activeSuggestion.description}</p>
                                <div className="mt-auto flex flex-col gap-6 relative z-10">
                                    <button 
                                        onClick={() => onNavigate(activeSuggestion.actionView as View)}
                                        className="w-full py-3 md:py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all"
                                    >
                                        {activeSuggestion.actionLabel}
                                    </button>
                                    <button 
                                        onClick={() => dismissSuggestion(activeSuggestion.id)}
                                        className="w-full py-4 md:py-3 text-on-surface-variant font-black text-[9px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-all"
                                    >
                                        Ignora per ora
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="aura-glass p-8 md:p-8 h-full flex flex-col items-center justify-center text-center border border-dashed border-outline-variant/30 rounded-3xl">
                                <span className="material-symbols-outlined text-4xl text-primary/30 mb-8">auto_awesome</span>
                                <p className="m3-label-large font-black text-on-surface-variant uppercase tracking-widest opacity-40">Nessun suggerimento</p>
                                <p className="text-[10px] font-medium text-on-surface-variant mt-4 px-4">L'assistente sta analizzando i tuoi dati per fornirti consigli personalizzati.</p>
                            </div>
                        )}

                        {suggestions.length > 0 && (
                            <div className="space-y-4">
                                <p className="m3-label-small uppercase tracking-[0.3em] text-on-surface-variant font-black opacity-50">Altri consigli</p>
                                {suggestions.slice(0, 2).map((suggestion) => (
                                    <div key={suggestion.id} className="aura-glass p-5 border border-outline-variant/10 hover:border-primary/30 transition-all group">
                                        <div className="flex items-start gap-8">
                                            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                                                <span className="material-symbols-outlined text-xl">{suggestion.icon}</span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-on-surface uppercase tracking-tight">{suggestion.title}</div>
                                                <div className="text-[10px] text-on-surface-variant mt-4 line-clamp-2">{suggestion.description}</div>
                                                <button
                                                    className="mt-3 text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                                    onClick={() => {
                                                        if (suggestion.action?.type === 'navigate' && suggestion.action.payload) {
                                                            const payload = typeof suggestion.action.payload === 'string'
                                                                ? suggestion.action.payload
                                                                : (suggestion.action.payload as unknown as { view: string }).view || 'home';
                                                            onNavigate(payload as View, typeof suggestion.action.payload === 'object' ? (suggestion.action.payload as unknown as { context?: string }).context : undefined);
                                                        }
                                                    }}
                                                >
                                                    Scopri di più
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAB Assistente AI rimosso: ora gestito globalmente da App.tsx/GlobalFab */}
        </div>
    );
};

export default React.memo(Home);
