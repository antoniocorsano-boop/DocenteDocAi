
import React, { useMemo } from 'react';
import { View, AppState, NavigationParams } from '../types';
import { InfoCard } from './M3Components';
import M3ExpressiveCard from './M3ExpressiveCard';
import { useSettingsStore } from '../stores/useSettingsStore';

interface HomeProps {
    onNavigate: (view: View, params?: NavigationParams) => void;
    appState: AppState;
    dismissSuggestion: (id: string) => void;
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
    { label: 'Unità didattica', icon: 'auto_stories', view: 'uda', helper: 'Pianifica UDA', tone: 'tertiary' },
    { label: 'Documenti', icon: 'description', view: 'progettazione-hub', helper: 'Modelli & report', tone: 'surfaceVariant' },
];

const Home: React.FC<HomeProps> = ({ onNavigate, appState, dismissSuggestion }) => {
    const activeSuggestion = appState.activeSuggestion;
    const dismissedSuggestions = appState.dismissedSuggestions;
    const suggestions = appState.suggestions || [];
    const showAiSuggestion = activeSuggestion && !dismissedSuggestions?.has(activeSuggestion.id);

    // Recupera nome docente dalle impostazioni
    const settings = useSettingsStore((state) => state.settings);
    const nomeInsegnante = settings.nomeInsegnante || 'Professore';
    const cognomeInsegnante = settings.cognomeInsegnante || '';

    interface RecentActivity { id: string; title: string; meta?: string; time?: string }
    interface BadgeType { id: string; name: string; description?: string; earned?: boolean }

    const _dashboardPartials = appState as unknown as {
        metrics?: { studenti: number; verificheOggi: number; presenze: string };
        badges?: BadgeType[];
        recentActivities?: RecentActivity[];
    };
    const metrics: { studenti: number; verificheOggi: number; presenze: string } = _dashboardPartials.metrics ?? { studenti: 24, verificheOggi: 2, presenze: '98%' };
    const badges: BadgeType[] = _dashboardPartials.badges ?? [
        { id: 'b1', name: 'Starter', description: 'Benvenuto nell’app', earned: true },
        { id: 'b2', name: 'Impegno', description: '10 lezioni completate', earned: false },
        { id: 'b3', name: 'Eccellenza', description: 'Media sopra 8', earned: false },
    ];
    const recentActivities: RecentActivity[] = _dashboardPartials.recentActivities ?? [];

    const nextLesson = useMemo(() => {
        const list = Object.values(appState.lessons || {});
        return list.length ? list[0] : null;
    }, [appState.lessons]);

    const lessonTagline = nextLesson ? `${nextLesson.classe} • ${nextLesson.tipoLezione ?? 'Lezione in classe'}` : 'Pianifica la prossima lezione';
    const lessonDetails = nextLesson?.obiettivi || nextLesson?.contenuto || 'Utilizza l’integrazione AI per costruire contenuti e obiettivi in pochi tap.';

    const toneStyles: Record<QuickAction['tone'], { bg: string; fg: string; border: string }> = {
        primary: { bg: 'var(--sys-primary-container, #EADDFF)', fg: 'var(--sys-on-primary-container, #21005D)', border: 'var(--sys-primary-container, #EADDFF)' },
        secondary: { bg: 'var(--sys-secondary-container, #E8DEF8)', fg: 'var(--sys-on-secondary-container, #1D192B)', border: 'var(--sys-secondary-container, #E8DEF8)' },
        tertiary: { bg: 'var(--sys-tertiary-container, #FFD8E4)', fg: 'var(--sys-on-tertiary-container, #31111D)', border: 'var(--sys-tertiary-container, #FFD8E4)' },
        surface: { bg: 'var(--sys-surface-container, #F3EDF7)', fg: 'var(--sys-on-surface, #1C1B1F)', border: 'var(--sys-outline-variant, #C4C7C5)' },
        surfaceVariant: { bg: 'var(--sys-surface-container-low, #F7F2FA)', fg: 'var(--sys-on-surface-variant, #49454F)', border: 'var(--sys-outline-variant, #C4C7C5)' }
    };

    const todayLabel = useMemo(() => new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }), []);

    return (
        <div
            className="pt-1 md:pt-2 pb-8 px-4 md:px-5 space-y-3"
            style={{
                background: 'radial-gradient(circle at 20% 12%, rgba(103,80,164,0.08), transparent 36%), radial-gradient(circle at 80% 0%, rgba(3,218,198,0.07), transparent 32%)'
            }}
        >
            {/* Saluto docente */}
            <section className="mb-3 space-y-2">
                <header className="space-y-1 max-w-3xl">
                    <h1 className="m3-headline-small font-extrabold tracking-tight text-on-surface">Buongiorno Prof. {cognomeInsegnante || nomeInsegnante}!</h1>
                </header>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase tracking-[0.25em]">
                    <span>{todayLabel}</span>
                    <span className="hidden md:inline text-[9px] tracking-[0.35em] text-on-surface-variant/70">Organizza la giornata</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="m3-label-small uppercase tracking-[0.3em] text-on-surface-variant">Azioni rapide</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.label}
                            className="w-full px-4 py-3 flex flex-col items-start gap-3 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5"
                            style={{
                                borderRadius: 28,
                                boxShadow: 'var(--md-elevation-1)',
                                backgroundColor: toneStyles[action.tone].bg,
                                color: toneStyles[action.tone].fg,
                                borderColor: toneStyles[action.tone].border,
                                borderWidth: 1,
                                borderStyle: 'solid'
                            }}
                            onClick={() => onNavigate(action.view, action.params)}
                        >
                            <span className="material-symbols-outlined text-lg" style={{ color: toneStyles[action.tone].fg }}>{action.icon}</span>
                            <div className="text-left">
                                <p className="font-semibold text-sm" style={{ color: toneStyles[action.tone].fg }}>{action.label}</p>
                                <p className="text-xs" style={{ color: toneStyles[action.tone].fg, opacity: 0.8 }}>{action.helper}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="space-y-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <M3ExpressiveCard icon="group" title="Studenti" description={`${metrics.studenti}`} color="primary" onClick={() => onNavigate('studenti' as View)} />
                    <M3ExpressiveCard icon="assignment" title="Verifiche oggi" description={`${metrics.verificheOggi}`} color="secondary" onClick={() => onNavigate('evaluations' as View)} />
                    <M3ExpressiveCard icon="check_circle" title="Presenze" description={`${metrics.presenze}`} color="tertiary" onClick={() => onNavigate('studenti' as View)} />
                </div>
                {nextLesson && (
                    <M3ExpressiveCard
                        icon="history_edu"
                        title="Prossima lezione"
                        description={lessonTagline}
                        color="surface"
                        className="border border-outline-variant"
                    >
                        <div className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                            {lessonDetails}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                className="px-4 py-2 rounded-full bg-primary/90 text-on-primary text-sm font-semibold"
                                onClick={() => onNavigate('aula' as View, { classe: nextLesson.classe })}
                            >
                                Vai alla classe
                            </button>
                            <button
                                className="px-4 py-2 rounded-full bg-outline-variant text-on-surface-variant text-sm font-semibold"
                                onClick={() => onNavigate('lessons' as View)}
                            >
                                Organizza contenuti
                            </button>
                        </div>
                    </M3ExpressiveCard>
                )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <M3ExpressiveCard
                        icon="history"
                        title="Attività Recenti"
                        description="Ultime azioni svolte"
                        className="mb-2"
                        color="surface"
                    >
                        <div className="mt-4">
                            <ul className="space-y-3">
                                {recentActivities.slice(0, 5).map((a) => (
                                    <li key={a.id} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                                        <div>
                                            <div className="m3-label-medium">{a.title}</div>
                                            <div className="text-sm text-on-surface-variant">{a.meta}</div>
                                        </div>
                                        <div className="text-sm text-on-surface-variant">{a.time}</div>
                                    </li>
                                ))}
                                {recentActivities.length === 0 && (
                                    <li className="text-sm text-on-surface-variant">Nessuna attività recente</li>
                                )}
                            </ul>
                        </div>
                    </M3ExpressiveCard>

                    {suggestions.length > 0 && (
                        <M3ExpressiveCard
                            icon="lightbulb"
                            title="Suggerimenti Personalizzati"
                            description="Consigli AI basati sulla tua attività didattica"
                            color="tertiary"
                        >
                            <div className="mt-4 space-y-3">
                                {suggestions.slice(0, 3).map((suggestion) => (
                                    <div key={suggestion.id} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-2xl text-tertiary mt-1">
                                                {suggestion.icon}
                                            </span>
                                            <div className="flex-1">
                                                <div className="m3-label-large font-semibold">{suggestion.title}</div>
                                                <div className="text-sm text-on-surface-variant mt-1">{suggestion.description}</div>
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        className="px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary font-medium text-sm"
                                                        onClick={() => {
                                                            if (suggestion.action?.type === 'navigate' && suggestion.action.payload) {
                                                                const payload = typeof suggestion.action.payload === 'string'
                                                                    ? suggestion.action.payload
                                                                    : (suggestion.action.payload as any).view || 'home';
                                                                onNavigate(payload as View, (suggestion.action.payload as any).context);
                                                            }
                                                        }}
                                                    >
                                                        Apri
                                                    </button>
                                                    <button
                                                        className="px-3 py-1.5 rounded-full bg-outline-variant text-on-surface-variant text-sm"
                                                        onClick={() => dismissSuggestion(suggestion.id)}
                                                    >
                                                        Ignora
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </M3ExpressiveCard>
                    )}

                    {showAiSuggestion && (
                        <InfoCard
                            title="Suggerimento AI"
                            description={activeSuggestion.message}
                            icon="psychology"
                            variant="tertiary"
                            action={
                                <div className="flex gap-3">
                                    {activeSuggestion.actionLabel && (
                                        <button
                                            className="px-4 py-2 rounded-full bg-primary text-on-primary font-bold"
                                            onClick={() => {
                                                if (activeSuggestion.action?.type === 'navigate' && activeSuggestion.targetView) {
                                                    onNavigate(activeSuggestion.targetView as View, activeSuggestion.action?.payload as NavigationParams);
                                                }
                                                dismissSuggestion(activeSuggestion.id);
                                            }}
                                        >
                                            {activeSuggestion.actionLabel}
                                        </button>
                                    )}
                                    <button className="px-4 py-2 rounded-full bg-outline-variant text-on-surface-variant" onClick={() => dismissSuggestion(activeSuggestion.id)}>Ignora</button>
                                </div>
                            }
                        />
                    )}
                </div>

                <aside className="space-y-4">
                    <M3ExpressiveCard
                        icon="military_tech"
                        title="Badge"
                        description="Obiettivi e traguardi"
                        color="secondary"
                    >
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            {badges.map((b) => (
                                <div key={b.id} className={`rounded-xl p-3 flex items-center gap-3 shadow-sm border ${b.earned ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-low text-on-surface-variant'}`} tabIndex={0}>
                                    <span className="material-symbols-outlined text-2xl">{b.earned ? 'emoji_events' : 'star_outline'}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold">{b.name}</div>
                                        {b.description && <div className="text-sm text-on-surface-variant">{b.description}</div>}
                                    </div>
                                    <div className="text-sm font-medium">{b.earned ? 'Ottenuto' : '—'}</div>
                                </div>
                            ))}
                        </div>
                    </M3ExpressiveCard>

                    <M3ExpressiveCard
                        icon="flash_on"
                        title="Focus rapido"
                        description="Promemoria e checklist importanti"
                        color="surface"
                    >
                        <div className="mt-3 space-y-3 text-sm text-on-surface-variant leading-relaxed">
                            <p className="font-semibold text-on-surface">Verifiche da correggere</p>
                            <p className="text-xs">{metrics.verificheOggi} attività da revisionare entro oggi.</p>
                            <p className="font-semibold text-on-surface">Presenze critiche</p>
                            <p className="text-xs">Presenze attuali {metrics.presenze}. Monitora le classi più fragili con il supporto AI.</p>
                        </div>
                    </M3ExpressiveCard>
                </aside>
            </section>

            {/* FAB Assistente AI rimosso: ora gestito globalmente da App.tsx/GlobalFab */}
        </div>
    );
};

export default Home;
