import React from 'react';
import { View, Lezione, Slot, AppState, UserProfile, AiSuggestion, RegisterEntry, TimetableSettings } from '../types';
import { ActionTile, SectionHeader, InfoCard } from './M3Components';
import ContextualStrip from './ContextualStrip';

interface HomeProps {
    slots: Record<string, Slot>;
    lessons: Record<string, Lezione>;
    onNavigate: (view: View, context?: any) => void;
    appState: AppState; // Full app state
    onSuggestionAction: (action: AiSuggestion['action']) => void;
    onStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    finalizedRegister: RegisterEntry[];
    draftRegister: Record<string, RegisterEntry>;
    showGuidanceTips: boolean;
    suggestions: AiSuggestion[];
    onAiProcessing: (processing: boolean) => void;
    user: UserProfile | null;
    onUpdateMemos: (memos: any) => void;
    onConnectDrive: () => void;
    aiSettings: AppState['aiSettings'];
    settings: TimetableSettings;
    dismissSuggestion: (id: string) => void; // FIX: Added missing prop
    handleOpenOperations: () => void; // FIX: Added missing prop
}

const Home: React.FC<HomeProps> = ({ slots, lessons, onNavigate, appState, onSuggestionAction, onStartClassroom, finalizedRegister, draftRegister, showGuidanceTips, suggestions, onAiProcessing, user, onUpdateMemos, onConnectDrive, aiSettings, settings, dismissSuggestion, handleOpenOperations }) => {
    // Determine current lesson for the hero card
    const now = new Date();
    const currentDayRaw = now.toLocaleDateString('it-IT', { weekday: 'long' });
    const currentDay = currentDayRaw.charAt(0).toUpperCase() + currentDayRaw.slice(1).toLowerCase();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const todaysSlots = Object.values(slots).filter((s: Slot) => s.giorno === currentDay);
    const upcomingLessons = todaysSlots
        .map((slot: Slot) => ({
            slot,
            lesson: slot.lezioneId ? lessons[slot.lezioneId] : null
        }))
        .filter(item => item.lesson && !item.lesson.svolta)
        .sort((a, b) => {
            const [h1, m1] = a.slot.ora.split(':').map(Number);
            const [h2, m2] = b.slot.ora.split(':').map(Number);
            if (h1 !== h2) return h1 - h2;
            return m1 - m2;
        });

    // Find a lesson that is current or immediately next
    const activeLessonForHero = upcomingLessons.find(item => {
        const [h, m] = (item.slot as Slot).ora.split(':').map(Number);
        const lessonStartMinutes = h * 60 + m;
        const lessonEndMinutes = lessonStartMinutes + 60; // Assume 1 hour
        const nowInMinutes = currentHour * 60 + currentMinute;
        return nowInMinutes >= lessonStartMinutes && nowInMinutes < lessonEndMinutes;
    }) || upcomingLessons[0]; // If no current, take the very next one


    const handleHeroClick = () => {
        if (activeLessonForHero?.lesson) {
            onStartClassroom(
                (activeLessonForHero.lesson as Lezione).classe,
                (activeLessonForHero.lesson as Lezione).materia,
                `${(activeLessonForHero.slot as Slot).giorno}-${(activeLessonForHero.slot as Slot).ora}`,
                activeLessonForHero.lesson as Lezione
            );
        } else {
            handleOpenOperations(); // Fallback to operations center if no specific lesson
        }
    };

    const activeSuggestion = appState.activeSuggestion;
    const dismissedSuggestions = appState.dismissedSuggestions;


    return (
        <div className="page-layout p-6 md:p-12 space-y-16 max-w-7xl mx-auto overflow-x-hidden">

            {activeSuggestion && !dismissedSuggestions.has(activeSuggestion.id) && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <ContextualStrip
                        message={activeSuggestion.message}
                        actionLabel={activeSuggestion.actionLabel}
                        onAction={() => onSuggestionAction(activeSuggestion.action)}
                        onDismiss={() => dismissSuggestion(activeSuggestion.id)}
                        visible={true}
                    />
                </div>
            )}

            {/* --- COMMAND CENTER HERO (Expressive Aura) --- */}
            <section className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[64px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                {activeLessonForHero?.lesson ? (
                    <div className="hero-card aura-view-entrance relative">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
                            <div className="space-y-6 text-center lg:text-left flex-grow">
                                <div className="inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-extrabold tracking-[0.2em] uppercase text-[10px] shadow-lg" aria-hidden="true">
                                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                                    </span>
                                    Sessione Corrente
                                </div>
                                <h1 className="m3-display-medium md:m3-display-large font-extrabold text-on-primary-container leading-[1.1] tracking-tighter">
                                    {activeLessonForHero.lesson.materia} <span className="opacity-30">•</span> {activeLessonForHero.lesson.classe}
                                </h1>
                                <p className="m3-headline-small text-on-primary-container opacity-80 font-bold italic drop-shadow-sm">
                                    "{activeLessonForHero.lesson.contenuto}"
                                </p>
                            </div>
                            <div className="w-40 h-40 rounded-[48px] bg-white/30 backdrop-blur-2xl border border-white/40 flex items-center justify-center text-on-primary-container shadow-xl transform hover:rotate-6 hover:scale-110 transition-all duration-700 group/icon" aria-hidden="true">
                                <span className="material-symbols-outlined text-8xl font-light group-hover/icon:animate-float" aria-hidden="true">school</span>
                            </div>
                        </div>

                        {/* I bottoni legacy per l'assistente live sono stati rimossi. Il FAB flottante è ora l'unico accesso all'assistente live. */}
                    </div>
                ) : (
                    <div className="hero-card aura-view-entrance bg-surface-variant/40 backdrop-blur-3xl text-on-surface-variant border-outline-variant/30">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
                            <div className="space-y-6 text-center lg:text-left flex-grow">
                                <h1 className="m3-display-medium md:m3-display-large font-extrabold leading-[1.1] tracking-tighter">
                                    Pianifica il Futuro, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Docente'}</span>
                                </h1>
                                <p className="m3-headline-small opacity-70 font-bold italic">
                                    Utilizza l'AI per generare Unità di Apprendimento innovative in pochi istanti.
                                </p>
                            </div>
                            <div className="w-40 h-40 rounded-[48px] bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center text-primary shadow-lg transition-all duration-700 animate-float" aria-hidden="true">
                                <span className="material-symbols-outlined text-8xl font-extralight" aria-hidden="true">auto_fix_high</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate('progettazione-hub', { action: 'annual-planning' })}
                            aria-label="Inizia a Progettare"
                            className="button button-filled bg-secondary-container text-on-secondary-container mt-16 w-full !h-20 !rounded-[40px] font-extrabold text-xl shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        >
                            <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform" aria-hidden="true">calendar_month</span> Inizia a Progettare
                        </button>
                    </div>
                )}
            </section>

            {/* --- CORE OPERATIONS BENTO GRID --- */}
            <section className="animate-in fade-in slide-in-from-bottom-10 delay-150 duration-700">
                <SectionHeader title="Centro Operativo Intelligente" icon="electric_bolt" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionTile
                        title="Registro Classe"
                        subtitle="Presenze e Valutazioni"
                        icon="auto_stories"
                        variant="primary"
                        onClick={() => onNavigate('aula')}
                        className="lg:col-span-2 !p-12"
                    />
                    <ActionTile
                        title="Progettazione"
                        subtitle="UDA e Lezioni"
                        icon="account_tree"
                        variant="secondary"
                        onClick={() => onNavigate('progettazione-hub')}
                        className="!p-10"
                    />
                    <ActionTile
                        title="AI Lab"
                        subtitle="Studio e Materiali"
                        icon="auto_fix_high"
                        variant="tertiary"
                        onClick={() => onNavigate('studio')}
                        className="!p-10"
                    />
                </div>
            </section>

            {/* --- SMART INSIGHTS --- */}
            <section className="animate-in fade-in slide-in-from-bottom-12 delay-300 duration-700">
                <SectionHeader title="Deep Insights Didattici" icon="analytics" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoCard
                        title="Analisi Didattica Inclusiva"
                        description="Strategie personalizzate AI per supportare ogni studente nel proprio percorso di apprendimento unico."
                        icon="diversity_3"
                        variant="tertiary"
                        className="hover:scale-[1.02] transition-transform duration-500"
                        action={<button onClick={() => onNavigate('didattica-inclusiva')} aria-label="Gestisci PDP" className="button button-filled bg-tertiary-container text-on-tertiary-container !px-10 !h-12 rounded-full font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary">Gestisci PDP</button>}
                    />
                    <InfoCard
                        title="Statistiche Rendimento"
                        description="Monitora l'efficacia del tuo metodo con analisi predittive e trend di apprendimento per ogni gruppo classe."
                        icon="query_stats"
                        variant="secondary"
                        className="hover:scale-[1.02] transition-transform duration-500"
                        action={<button onClick={() => onNavigate('analytics')} aria-label="Apri Analytics" className="button button-filled bg-secondary-container text-on-secondary-container !px-10 !h-12 rounded-full font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">Apri Analytics</button>}
                    />
                </div>
            </section>
        </div>
    );
};
export default Home;
