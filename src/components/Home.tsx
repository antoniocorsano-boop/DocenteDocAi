
import React from 'react';
import { View, AppState, NavigationParams } from '../types';
import { InfoCard, ActionTile } from './M3Components';
import M3ExpressiveCard from './M3ExpressiveCard';

interface HomeProps {
    onNavigate: (view: View, params?: NavigationParams) => void;
    appState: AppState;
    dismissSuggestion: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, appState, dismissSuggestion }) => {
    const activeSuggestion = appState.activeSuggestion;
    const dismissedSuggestions = appState.dismissedSuggestions;
    const showAiSuggestion = activeSuggestion && !dismissedSuggestions?.has(activeSuggestion.id);

    // Demo: recupero nome docente (in reale da appState.user)
    const user = (typeof appState.user === 'object' && appState.user && 'nome' in appState.user && 'cognome' in appState.user)
        ? appState.user as { nome: string; cognome: string }
        : { nome: 'Mario', cognome: 'Rossi' };

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

    return (
        <div className="p-6">
            {/* Saluto docente */}
            <InfoCard
                title={`Buongiorno Prof. ${user.cognome}!`}
                description="Ecco il tuo cruscotto docente. L’AI ti suggerirà azioni e ti aiuterà nella gestione quotidiana."
                icon="waving_hand"
                variant="primary"
                className="mb-8"
            />

            {/* Metriche principali */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <M3ExpressiveCard icon="group" title="Studenti" description={`${metrics.studenti}`} color="primary" />
                <M3ExpressiveCard icon="assignment" title="Verifiche oggi" description={`${metrics.verificheOggi}`} color="secondary" />
                <M3ExpressiveCard icon="check_circle" title="Presenze" description={`${metrics.presenze}`} color="tertiary" />
            </section>

            {/* Main grid: attività, suggerimenti, badge, azioni */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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

                <aside className="space-y-8">
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
                        title="Azioni rapide"
                        description="Accesso veloce alle funzioni principali"
                        color="primary"
                    >
                        <div className="mt-4 grid grid-cols-1 gap-2">
                            <ActionTile title="Nuova valutazione" icon="edit" onClick={() => onNavigate('evaluations' as View)} />
                            <ActionTile title="Crea unità didattica" icon="description" onClick={() => onNavigate('uda' as View)} />
                            <ActionTile title="Backup" icon="cloud_upload" onClick={() => onNavigate('settings' as View)} />
                            <ActionTile title="Importa studenti" icon="group_add" onClick={() => onNavigate('studenti' as View)} />
                        </div>
                    </M3ExpressiveCard>
                </aside>
            </section>

            {/* FAB Assistente AI rimosso: ora gestito globalmente da App.tsx/GlobalFab */}
        </div>
    );
};

export default Home;
