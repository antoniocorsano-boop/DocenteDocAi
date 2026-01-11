
import React, { useMemo, useState, useEffect } from 'react';
import { Lezione, Slot, EventoCalendario, AppActions } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { useAcademicStore } from '../stores/useAcademicStore';

import VoiceNoteRecorder from './VoiceNoteRecorder';

interface FlowModeProps {
    actions: AppActions;
    onOpenOperations: () => void;
    onOpenLiveAssistant: () => void;
}

interface BaseTimelineItem {
    id: string;
    type: 'lesson' | 'event' | 'gap';
    time: string; // HH:MM
    endTime?: string;
    title: string;
    subtitle?: string;
    status: 'past' | 'current' | 'future';
    actionLabel?: string;
    onAction?: () => void;
}

interface LessonTimelineItem extends BaseTimelineItem {
    type: 'lesson';
    data: { slot: Slot; lesson: Lezione | null };
}

interface EventTimelineItem extends BaseTimelineItem {
    type: 'event';
    data: EventoCalendario;
}

interface GapTimelineItem extends BaseTimelineItem {
    type: 'gap';
    data?: undefined;
}

type TimelineItem = LessonTimelineItem | EventTimelineItem | GapTimelineItem;

const FlowMode: React.FC<FlowModeProps> = ({ actions, onOpenOperations, onOpenLiveAssistant }) => {
    const slots = useAcademicStore(state => state.slots);
    const lessons = useAcademicStore(state => state.lessons);
    const eventi = useAcademicStore(state => state.eventi);
    
    const { handleStartClassroom, handleNavigate, handleAddNote } = actions;
    
    // --- TIME LOGIC ---
    const [now, setNow] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const todayName = DAYS_OF_WEEK[now.getDay() - 1] || DAYS_OF_WEEK[6];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // --- TIMELINE GENERATION ---
    const timelineItems = useMemo(() => {
        const items: TimelineItem[] = [];
        
        // FIX: Use local time for comparison instead of UTC to avoid date shifting
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayDateStr = `${year}-${month}-${day}`;

        // 1. Slots (Today's Lessons)
        Object.values(slots).forEach((slot: Slot) => {
            if (slot.giorno === todayName) {
                const [h, m] = slot.ora.split(':').map(Number);
                const slotStartMinutes = h * 60 + m;
                const slotEndMinutes = slotStartMinutes + 60; // Assume 1h duration
                
                let status: TimelineItem['status'] = 'future';
                if (currentMinutes >= slotEndMinutes) status = 'past';
                else if (currentMinutes >= slotStartMinutes) status = 'current';

                const lesson = slot.lezioneId ? lessons[slot.lezioneId] : null;
                const title = lesson ? lesson.materia : (slot.materia || 'Ora buca');
                const subtitle = lesson ? lesson.contenuto : (slot.classe || 'Nessuna classe');

                items.push({
                    id: `slot-${slot.giorno}-${slot.ora}`,
                    type: 'lesson',
                    time: slot.ora,
                    endTime: `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
                    title,
                    subtitle,
                    status,
                    data: { slot, lesson },
                    actionLabel: status === 'current' ? 'Avvia Lezione' : (status === 'past' ? 'Vedi Registro' : 'Pianifica'),
                    onAction: () => {
                        if (lesson) {
                            handleStartClassroom(slot.classe!, slot.materia!, `${slot.giorno}-${slot.ora}`, lesson);
                        } else if (slot.classe && slot.materia) {
                            // Empty slot but assigned
                            actions.setEditingSlotKey(`${slot.giorno}-${slot.ora}`);
                        } else {
                            // Empty unassigned
                            actions.handleEditSlot(slot.giorno, slot.ora);
                        }
                    }
                } as LessonTimelineItem);
            }
        });

        // 2. Events (Today)
        eventi.filter(e => e.data === todayDateStr).forEach(evt => {
            const time = evt.oraInizio || '00:00';
            const [h, m] = time.split(':').map(Number);
            const evtMinutes = h * 60 + m;
            
            let status: TimelineItem['status'] = 'future';
            if (currentMinutes > evtMinutes + 60) status = 'past'; // Rough estimate
            else if (currentMinutes >= evtMinutes && currentMinutes <= evtMinutes + 60) status = 'current';

            items.push({
                id: evt.id,
                type: 'event',
                time,
                title: evt.titolo,
                subtitle: evt.tipo,
                status,
                data: evt,
                actionLabel: 'Dettagli',
                onAction: () => handleNavigate('calendario')
            } as EventTimelineItem);
        });

        // Sort by time
        return items.sort((a, b) => a.time.localeCompare(b.time));
    }, [slots, lessons, eventi, now, todayName, currentMinutes, handleStartClassroom, handleNavigate]);

    // Find current active item


    return (
        <div className="bg-[var(--md-sys-color-surface-container-low)]/30 relative aura-glass" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* --- HEADER (Minimal) --- */}
            <div className="bg-surface/40 backdrop-blur-xl z-10 border-[var(--md-sys-color-outline-variant)]/20" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--md-sys-spacing-6)", borderBottom: "1px solid var(--md-sys-color-outline)" }}>
                <div>
                    <h1 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Flow</h1>
                    <p className="m3-label-medium" style={{ color: "var(--md-sys-color-primary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7" }}>{todayName}, {now.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}</p>
                </div>
                <button onClick={onOpenOperations} className="rounded-[var(--md-sys-shape-corner-large)] bg-primary/10 hover:bg-primary/20 shadow-sm border-primary/20" style={{ width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-primary)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", border: "1px solid var(--md-sys-color-outline)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>bolt</span>
                </button>
            </div>

            {/* --- TIMELINE STREAM --- */}
            <div className="px-6 py-8 pb-40 custom-scrollbar" style={{ flexGrow: "1", overflowY: "auto", gap: "var(--md-sys-spacing-8)" }}>
                {timelineItems.length === 0 && (
                    <div 
                        className="py-20 bg-[var(--md-sys-color-surface-container-low)]/50 border-dashed border-[var(--md-sys-color-outline-variant)]/30" style={{ textAlign: "center", opacity: "0.5", border: "1px solid var(--md-sys-color-outline)" }}
                        style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                    >
                        <span className="material-symbols-outlined text-5xl text-primary/40" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>event_busy</span>
                        <p className="m3-title-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "bold" }}>Nessun evento o lezione oggi.</p>
                        <button onClick={() => actions.handleNavigate('timetable')} className="px-6 bg-primary/10 hover:bg-primary/20" style={{ marginTop: "var(--md-sys-spacing-4)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", borderRadius: "9999px", color: "var(--md-sys-color-primary)", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                            Configura Orario
                        </button>
                    </div>
                )}

                {timelineItems.map((item, index) => {
                    const isLast = index === timelineItems.length - 1;
                    
                    if (item.status === 'current') {
                        // HERO CARD FOR CURRENT EVENT
                        return (
                            <div key={item.id} className="relative pl-10">
                                <div className="absolute left-[11px] top-0 bottom-0 bg-gradient-to-b from-primary via-primary/50 to-transparent" style={{ width: "0.25rem", borderRadius: "9999px" }}></div>
                                <div className="absolute left-0 top-8 border-4 border-surface-container-low shadow-[var(--md-sys-elevation-level2)] z-10 animate-pulse" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)" }}></div>
                                
                                <div className="m3-label-small tracking-[0.2em]" style={{ marginBottom: "var(--md-sys-spacing-6)", fontWeight: "900", color: "var(--md-sys-color-primary)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                    <span className="relative" style={{ display: "flex", height: "0.5rem", width: "0.5rem" }}>
                                        <span className="animate-ping absolute" style={{ display: "inline-flex", height: "100%", width: "100%", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)", opacity: "0.75" }}></span>
                                        <span className="relative" style={{ display: "inline-flex", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", backgroundColor: "var(--md-sys-color-primary)" }}></span>
                                    </span>
                                    ADESSO • {item.time}
                                </div>
                                <div 
                                    className="card shadow-[var(--md-sys-elevation-level4)] transform scale-[1.02] border-white/10" style={{ backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", padding: "var(--md-sys-spacing-6)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", border: "1px solid var(--md-sys-color-outline)" }}
                                    style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--md-sys-spacing-6)" }}>
                                        <div>
                                            <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ fontWeight: "900", letterSpacing: "-0.005em", lineHeight: "1.25" }}>{item.title}</h2>
                                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ opacity: "0.8", fontWeight: "500", marginTop: "var(--md-sys-spacing-4)" }}>{item.subtitle}</p>
                                        </div>
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[var(--md-sys-shape-corner-large)] shadow-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span className="material-symbols-outlined text-3xl">
                                                {item.type === 'lesson' ? 'school' : 'event'}
                                            </span>
                                        </div>
                                    </div>
                                    {item.actionLabel && (
                                        <button onClick={item.onAction} className="rounded-[var(--md-sys-shape-corner-large)] shadow-[var(--md-sys-elevation-level2)] hover:bg-opacity-90" style={{ width: "100%", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", backgroundColor: "white", color: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                                            {item.actionLabel} <span className="material-symbols-outlined" style={{ marginLeft: "0.5rem", fontSize: "0.875rem" }}>arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // PAST ITEMS (Compact, Faded)
                    if (item.status === 'past') {
                        return (
                            <div key={item.id} className="relative pl-10 grayscale-[0.5]" style={{ opacity: "0.4" }}>
                                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-outline-variant/30"></div>
                                <div className="absolute left-[var(--md-sys-spacing-1)] top-2 bg-outline-variant/50 border-2 border-surface-container-low" style={{ width: "1rem", height: "1rem", borderRadius: "9999px" }}></div>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>
                                    <span className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant tracking-tighter" style={{ fontWeight: "900", width: "3rem", textTransform: "uppercase" }}>{item.time}</span>
                                    <div>
                                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)] line-through decoration-outline-variant/50" style={{ fontWeight: "bold" }}>{item.title}</p>
                                        <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // FUTURE ITEMS (Standard)
                    return (
                        <div key={item.id} className="relative pl-10">
                            {!isLast && <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-outline-variant/20"></div>}
                            <div className="absolute left-[var(--md-sys-spacing-1)] top-2 border-2 border-primary/40 bg-[var(--md-sys-color-surface-container-low)]" style={{ width: "1rem", height: "1rem", borderRadius: "9999px" }}></div>
                            
                            <div 
                                className="card bg-[var(--md-sys-color-surface-container-high)]/40 backdrop-blur-md border-[var(--md-sys-color-outline-variant)]/20 hover:border-primary/40 hover:bg-[var(--md-sys-color-surface-container-high)]/60 group" style={{ padding: "var(--md-sys-spacing-5)", border: "1px solid var(--md-sys-color-outline)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }} 
                                onClick={item.onAction}
                                style={{ borderRadius: 'calc(var(--shape-l) * var(--sys-radius-multiplier))' }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--md-sys-spacing-6)" }}>
                                    <span className="m3-label-small bg-primary/10 px-3 py-1 border-primary/10" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)", borderRadius: "9999px", border: "1px solid var(--md-sys-color-outline)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.time}</span>
                                    {item.type === 'lesson' && <span className="text-[9px] tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.5" }}>Lezione</span>}
                                </div>
                                <h3 className="m3-title-medium text-[var(--md-sys-color-on-surface)] group-hover:text-primary" style={{ fontWeight: "900", transition: "color 300ms" }}>{item.title}</h3>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "500", marginTop: "var(--md-sys-spacing-4)" }}>{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MAGIC BOTTOM BAR (Floating) --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent pb-8 pt-16 pointer-events-none z-20" style={{ padding: "var(--md-sys-spacing-6)" }}>
                <div className="pointer-events-auto max-w-lg bg-[var(--md-sys-color-surface-container-high)]est/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[var(--md-sys-elevation-level4)] border-white/10 p-4.5" style={{ marginLeft: "auto", marginRight: "auto", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                    
                    <button onClick={() => actions.handleNavigate('settings')} className="text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]" style={{ width: "3rem", height: "3rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>settings</span>
                    </button>

                    <div className="bg-[var(--md-sys-color-surface-container-low)]/50 px-6 text-[var(--md-sys-color-on-surface)]-variant/60 cursor-text border-[var(--md-sys-color-outline-variant)]/10 hover:border-primary/30" style={{ flexGrow: "1", borderRadius: "9999px", height: "3rem", display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: "bold", border: "1px solid var(--md-sys-color-outline)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }} onClick={onOpenLiveAssistant}>
                        Chiedi all'assistente...
                    </div>

                    <VoiceNoteRecorder onTranscription={(text) => handleAddNote({ note: text })} compact />
                    
                    <button onClick={() => actions.handleNavigate('progettazione-hub')} className="shadow-[var(--md-sys-elevation-level2)] hover:shadow-primary/20 hover:scale-105" style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>add</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default React.memo(FlowMode);


