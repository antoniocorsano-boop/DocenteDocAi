import React from 'react';
import { View, AppState, NavigationParams } from '../types';
import { M3IconButton } from './M3Components';

interface HomeProps {
    onNavigate: (view: View, params?: NavigationParams) => void;
    appState: AppState;
    dismissSuggestion: (id: string) => void;
}

const MetricCard: React.FC<{ title: string; value: string | number; delta?: string }> = ({ title, value, delta }) => (
    <div className="bg-surface-container rounded-2xl p-4 shadow-sm border border-outline-variant"> 
        <div className="text-sm text-on-surface-variant font-medium">{title}</div>
        <div className="text-2xl font-bold mt-1 text-on-surface">{value}</div>
        {delta && <div className="text-xs text-primary mt-1">{delta}</div>}
    </div>
);

const BadgeCard: React.FC<{ name: string; description?: string; earned?: boolean }> = ({ name, description, earned }) => (
    <div className={`rounded-2xl p-3 flex items-center gap-3 shadow-sm border ${earned ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-low text-on-surface-variant'}`}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant font-bold text-lg">
            {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
            <div className="font-semibold">{name}</div>
            {description && <div className="text-sm text-on-surface-variant">{description}</div>}
        </div>
        <div className="text-sm font-medium">{earned ? 'Ottenuto' : '—'}</div>
    </div>
);

const QuickAction: React.FC<{ label: string; icon?: string; onClick?: () => void }> = ({ label, icon, onClick }) => (
    <button onClick={onClick} className="rounded-xl px-4 py-3 bg-primary-container text-on-primary-container flex items-center gap-3 shadow hover:scale-102 transition-all">
        {icon && <span className="material-symbols-outlined">{icon}</span>}
        <span className="font-medium">{label}</span>
    </button>
);

const Home: React.FC<HomeProps> = ({ onNavigate, appState, dismissSuggestion }) => {
    const activeSuggestion = appState.activeSuggestion;
    const dismissedSuggestions = appState.dismissedSuggestions;
    const showAiSuggestion = activeSuggestion && !dismissedSuggestions?.has(activeSuggestion.id);

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
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-expressive-700">Cruscotto</h1>
                    <div className="text-sm text-on-surface-variant">Panoramica rapida della tua classe e attività</div>
                </div>
                <div className="flex items-center gap-3">
                    <QuickAction label="Nuova valutazione" icon="edit" onClick={() => onNavigate('evaluations' as View)} />
                    <M3IconButton icon="settings" ariaLabel="Impostazioni" onClick={() => onNavigate('settings')} />
                </div>
            </header>

            {/* Top metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard title="Studenti" value={metrics.studenti} />
                <MetricCard title="Verifiche oggi" value={metrics.verificheOggi} />
                <MetricCard title="Presenze" value={metrics.presenze} delta="+1.2%" />
            </section>

            {/* Main grid: badges + recent + suggestions */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl p-5 bg-surface-container border border-outline-variant shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg">Attività Recenti</h2>
                            <button className="text-sm text-primary" onClick={() => onNavigate('analytics' as View)}>Vedi tutte</button>
                        </div>
                        <ul className="space-y-3">
                            {recentActivities.slice(0, 5).map((a) => (
                                <li key={a.id} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{a.title}</div>
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

                    {showAiSuggestion && (
                        <div className="rounded-3xl p-4 bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                                <div className="flex-1">
                                    <div className="font-bold">Suggerimento AI</div>
                                    <div className="mt-2">{activeSuggestion.message}</div>
                                    <div className="mt-3 flex gap-3">
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
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="space-y-6">
                    <div className="rounded-2xl p-4 bg-surface-container border border-outline-variant">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold">Badge Gaming</div>
                            <button className="text-sm text-primary" onClick={() => onNavigate('badges' as View)}>Tutti</button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {badges.map((b) => (
                                <BadgeCard key={b.id} name={b.name} description={b.description} earned={b.earned} />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl p-4 bg-surface-container border border-outline-variant">
                        <div className="font-semibold mb-3">Azioni rapide</div>
                        <div className="grid grid-cols-1 gap-2">
                            <QuickAction label="Crea unità didattica" icon="description" onClick={() => onNavigate('uda' as View)} />
                            <QuickAction label="Backup" icon="cloud_upload" onClick={() => onNavigate('settings' as View)} />
                        </div>
                    </div>
                </aside>
            </section>

            <div className="fixed bottom-8 right-8 z-50">
                <M3IconButton
                    icon="psychology"
                    ariaLabel="Apri Assistente AI"
                    className="shadow-lg bg-primary text-on-primary rounded-full w-16 h-16 flex items-center justify-center hover:scale-110 transition-all"
                    onClick={() => onNavigate('live-assistant')}
                    title="Assistente AI"
                />
            </div>
        </div>
    );
};

export default Home;
