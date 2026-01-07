
import React, { useMemo } from 'react';
import { View, NavigationParams } from '../types';
import { ActionTile, M3ExpressiveCard, M3Button } from './ui';
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
    { label: 'Appello', icon: 'playlist_add_check', view: 'aula', helper: 'Presenze', tone: 'primary' },
    { label: 'Valutazioni', icon: 'scoreboard', view: 'evaluations', helper: 'Voti', tone: 'secondary' },
    { label: 'Registro', icon: 'sync', view: 'home', helper: 'Sync Drive', tone: 'tertiary' },
    { label: 'Progettazione', icon: 'description', view: 'progettazione-hub', helper: 'UDA & PDP', tone: 'surfaceVariant' },
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
        <div className="home-container md:pt-8 pb-12 px-6 md:px-8">
            {/* Saluto docente */}
            <section className="home-section">
                <header className="home-header">
                    <h1 className="m3-headline-medium font-black tracking-tight text-on-surface">Buongiorno Prof. {cognomeInsegnante || nomeInsegnante}!</h1>
                    <div className="flex items-center justify-between m3-label-tiny text-primary font-black uppercase tracking-[0.3em] opacity-70">
                        <span>{todayLabel}</span>
                        <span className="hidden md:inline tracking-[0.4em]">Dashboard Docente</span>
                    </div>
                </header>

                <div className="home-actions">
                    <p className="m3-label-small uppercase tracking-[0.3em] text-on-surface-variant font-black opacity-50">Azioni rapide</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 home-actions-grid">
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

            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--md-sys-spacing-6)' }}>
                    <M3ExpressiveCard icon="group" title="Studenti" description={`${metrics.studenti} iscritti`} color="primary" onClick={() => onNavigate('studenti' as View)} />
                    <M3ExpressiveCard icon="assignment" title="Verifiche oggi" description={`${metrics.verificheOggi} programmate`} color="secondary" onClick={() => onNavigate('evaluations' as View)} />
                    <M3ExpressiveCard icon="check_circle" title="Presenze" description={`${metrics.presenze} media`} color="tertiary" onClick={() => onNavigate('studenti' as View)} />
                </div>
                {nextLesson && (
                    <div className="hero-card group">
                        <div className="relative z-10">
                            <div className="hero-card-header">
                                <div className="hero-card-label">
                                    Prossima Lezione
                                </div>
                                <div className="hero-card-icon">
                                    <span className="material-symbols-outlined text-2xl">school</span>
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
                        
                        <div className="mt-10 flex relative z-10" style={{ gap: 'var(--md-sys-spacing-6)' }}>
                            <M3Button
                                variant="filled"
                                onClick={() => onNavigate('aula' as View, { classe: nextLesson.classe })}
                                aria-label="Vai alla classe"
                            >
                                <span className="material-symbols-outlined mr-2">school</span>
                                Vai alla classe
                            </M3Button>
                            <M3Button
                                variant="outlined"
                                onClick={() => onNavigate('lessons' as View)}
                                aria-label="Organizza contenuti"
                            >
                                <span className="material-symbols-outlined mr-2">edit_document</span>
                                Organizza contenuti
                            </M3Button>
                        </div>
                    </div>
                )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--md-sys-spacing-5)' }}>
                <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                        <M3ExpressiveCard
                            icon="history"
                            title="Attività Recenti"
                            description="Ultime azioni svolte"
                            color="surface"
                        >
                            <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                                {recentActivities.slice(0, 5).map((a) => (
                                    <div key={a.id} className="p-8 bg-surface-container-low/50 border border-outline-variant/10 flex items-center justify-between group/item hover:bg-surface-container-low transition-colors" style={{ borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
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

                    <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                        {showAiSuggestion ? (
                            <div style={{
                                backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-variant) 80%, transparent)',
                                padding: 'var(--md-sys-spacing-5)',
                                borderRadius: 'var(--md-corner-large)',
                                display: 'flex',
                                flexDirection: 'column',
                                borderLeft: '4px solid var(--md-sys-color-primary)',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '100%'
                            }} className="group">
                                <div style={{
                                    position: 'absolute',
                                    right: '-1rem',
                                    top: '-1rem',
                                    width: '6rem',
                                    height: '6rem',
                                    backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary) 5%, transparent)',
                                    borderRadius: 'var(--md-corner-full)',
                                    transition: 'transform var(--motion-duration-short3) var(--motion-easing-standard)'
                                }} className="group-hover:scale-150"></div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)',
                                    marginBottom: 'var(--md-sys-spacing-5)',
                                    position: 'relative',
                                    zIndex: 10
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)',
                                        borderRadius: 'var(--md-corner-medium)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--md-sys-color-primary)'
                                    }}>
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                    <span style={{
                                        fontSize: 'var(--md-sys-typescale-label-small-size)',
                                        fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3em',
                                        color: 'var(--md-sys-color-primary)'
                                    }}>Suggerimento AI</span>
                                </div>
                                <h3 className="m3-headline-small font-black text-on-surface leading-tight relative z-10" style={{ marginBottom: 'var(--md-sys-spacing-5)' }}>{activeSuggestion.message || 'Suggerimento'}</h3>
                                <p className="m3-body-medium text-on-surface-variant font-medium opacity-80 relative z-10" style={{ marginBottom: 'var(--md-sys-spacing-5)' }}>Scopri come ottimizzare il tuo workflow didattico.</p>
                                <div className="mt-auto flex flex-col relative z-10" style={{ gap: 'var(--md-sys-spacing-4)' }}>
                                    <M3Button
                                        variant="tonal"
                                        onClick={() => {
                                            if (activeSuggestion.action?.type === 'navigate' && activeSuggestion.action.payload) {
                                                const view = typeof activeSuggestion.action.payload === 'string' 
                                                    ? activeSuggestion.action.payload 
                                                    : 'home';
                                                onNavigate(view as View);
                                            }
                                        }}
                                        className="w-full"
                                        aria-label={activeSuggestion.actionLabel}
                                    >
                                        {activeSuggestion.actionLabel}
                                    </M3Button>
                                    <M3Button
                                        variant="text"
                                        onClick={() => dismissSuggestion(activeSuggestion.id)}
                                        className="w-full"
                                        aria-label="Ignora suggerimento"
                                    >
                                        Ignora per ora
                                    </M3Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-variant) 80%, transparent)',
                                padding: 'var(--md-sys-spacing-5)',
                                borderRadius: 'var(--md-corner-large)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                border: '1px dashed color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)',
                                minHeight: '100%'
                            }}>
                                <span className="material-symbols-outlined text-4xl" style={{
                                    color: 'color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent)',
                                    marginBottom: 'var(--md-sys-spacing-5)'
                                }}>auto_awesome</span>
                                <p className="m3-label-large font-black text-on-surface-variant uppercase" style={{ letterSpacing: '0.3em', opacity: 0.4 }}>Nessun suggerimento</p>
                                <p style={{
                                    fontSize: 'var(--md-sys-typescale-label-small-size)',
                                    fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    marginTop: 'var(--md-sys-spacing-3)',
                                    paddingLeft: 'var(--md-sys-spacing-4)',
                                    paddingRight: 'var(--md-sys-spacing-4)'
                                }}>L'assistente sta analizzando i tuoi dati per fornirti consigli personalizzati.</p>
                            </div>
                        )}

                        {suggestions.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                <p className="m3-label-small uppercase tracking-[0.3em] text-on-surface-variant font-black opacity-50">Altri consigli</p>
                                {suggestions.slice(0, 2).map((suggestion) => (
                                    <div key={suggestion.id} style={{
                                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-variant) 80%, transparent)',
                                        padding: 'var(--md-sys-spacing-4)',
                                        borderRadius: 'var(--md-corner-medium)',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        transition: 'border-color var(--motion-duration-short3) var(--motion-easing-standard)'
                                    }} className="hover:border-primary/30 group">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--md-sys-spacing-5)'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: 'var(--md-corner-medium)',
                                                backgroundColor: 'color-mix(in srgb, var(--md-sys-color-tertiary) 10%, transparent)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--md-sys-color-tertiary)',
                                                flexShrink: 0
                                            }}>
                                                <span className="material-symbols-outlined text-xl">{suggestion.icon}</span>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: 'var(--md-sys-typescale-body-small-size)',
                                                    fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                                    color: 'var(--md-sys-color-on-surface)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>{suggestion.title}</div>
                                                <div style={{
                                                    fontSize: 'var(--md-sys-typescale-label-small-size)',
                                                    color: 'var(--md-sys-color-on-surface-variant)',
                                                    marginTop: 'var(--md-sys-spacing-2)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>{suggestion.description}</div>
                                                <button
                                                    style={{
                                                        marginTop: 'var(--md-sys-spacing-3)',
                                                        fontSize: 'var(--md-sys-typescale-label-small-size)',
                                                        fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                                        color: 'var(--md-sys-color-primary)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.3em',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        textDecoration: 'none',
                                                        transition: 'text-decoration var(--motion-duration-short2) var(--motion-easing-standard)'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                                    onClick={() => {
                                                        if (suggestion.action?.type === 'navigate' && suggestion.action.payload) {
                                                            const payload = typeof suggestion.action.payload === 'string'
                                                                ? suggestion.action.payload
                                                                : (suggestion.action.payload as unknown as { view: string }).view || 'home';
                                                            onNavigate(payload as View);
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
