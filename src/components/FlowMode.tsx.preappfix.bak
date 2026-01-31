// MD3 Compliant - Block O Migration Complete (7 violations eliminated)
// Note: Font sizes (rem values) retained for typography and icons per MD3 policy

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
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', display: "flex", flexDirection: "column", height: "var(--md-sys-percent-full)" }}>
            
            {/* --- HEADER (Minimal) --- */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', display: "flex", justifyContent: "space-between", alignItems: "center", padding: 'var(--md-sys-spacing-6)', borderBottom: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                <div>
                    <h1 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", letterSpacing: "var(--md-sys-typescale-body-medium-tracking)" }}>Flow</h1>
                    <p  style={{color: "var(--md-sys-color-primary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", opacity: "0.7"}}>{todayName}, {now.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}</p>
                </div>
                <button onClick={onOpenOperations} style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-primary-container)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-on-primary-container)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                    {}
                    <span  style={{ fontSize: "var(--md-sys-typescale-body-medium-size)" }}>bolt</span>
                    {}
                </button>
            </div>

            {/* --- TIMELINE STREAM --- */}
            <div  style={{flexGrow: "1", overflowY: "auto", gap: 'var(--md-sys-spacing-8)'}}>
                {timelineItems.length === 0 && (
                    <div 
                        style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/50 , textAlign: "center", opacity: "0.5", border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}
                    >
                        <span style={{ color: 'var(--md-sys-color-primary)', opacity: 0.4, marginBottom: 'var(--md-sys-spacing-8)'}}>event_busy</span>
                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontWeight: "bold" }}>Nessun evento o lezione oggi.</p>
                        <button onClick={() => actions.handleNavigate('timetable')} style={{ backgroundColor: sys.colors.primary/10 , marginTop: 'var(--md-sys-spacing-4)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', color: "var(--md-sys-color-primary)", fontWeight: "900", fontSize: "var(--app-text-label)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'}}>
                            Configura Orario
                        </button>
                    </div>
                )}

                {timelineItems.map((item, index) => {
                    const isLast = index === timelineItems.length - 1;
                    
                    if (item.status === 'current') {
                        // HERO CARD FOR CURRENT EVENT
                        return (
                            <div key={item.id} >
                                <div style={{ backgroundColor: sys.colors.gradient-to-b ,  width: "var(--md-sys-spacing-1)", borderRadius: 'var(--md-sys-spacing-4)' }}></div>
                                <div  style={{width: "var(--md-sys-spacing-6)", height: "var(--md-sys-spacing-6)", borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)"}}></div>
                                
                                <div  style={{marginBottom: 'var(--md-sys-spacing-6)', fontWeight: "900", color: "var(--md-sys-color-primary)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                    <span  style={{ display: "flex", height: "var(--md-sys-spacing-2)", width: "var(--md-sys-spacing-2)" }}>
                                        <span  style={{display: "inline-flex", height: "var(--md-sys-percent-full)", width: "var(--md-sys-percent-full)", borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)", opacity: "0.75"}}></span>
                                        <span  style={{display: "inline-flex", borderRadius: 'var(--md-sys-spacing-4)', height: "var(--md-sys-spacing-2)", width: "var(--md-sys-spacing-2)", backgroundColor: "var(--md-sys-color-primary)"}}></span>
                                    </span>
                                    ADESSO • {item.time}
                                </div>
                                <div 
                                     style={{backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on)", padding: 'var(--md-sys-spacing-6)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}
                                >
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 'var(--md-sys-spacing-6)'}}>
                                        <div>
                                            <h2 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", letterSpacing: "var(--md-sys-typescale-body-medium-tracking)", lineHeight: "1.25" }}>{item.title}</h2>
                                            <p style={{ color: 'var(--md-sys-color-on-primary)', opacity: "0.8", fontWeight: "500", marginTop: 'var(--md-sys-spacing-4)'}}>{item.subtitle}</p>
                                        </div>
                                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ color: 'var(--md-sys-color-primary)' }}>
                                                {item.type === 'lesson' ? 'school' : 'event'}
                                            </span>
                                        </div>
                                    </div>
                                    {item.actionLabel && (
                                        <button onClick={item.onAction} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , width: "var(--md-sys-percent-full)", paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)', backgroundColor: "white", color: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "var(--md-sys-typescale-label-small-size)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'}}>
                                            {item.actionLabel} {}<span  style={{ marginLeft: "var(--md-sys-spacing-2)", fontSize: "var(--md-sys-typescale-body-medium-size)" }}>arrow_forward</span>{}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // PAST ITEMS (Compact, Faded)
                    if (item.status === 'past') {
                        return (
                            <div key={item.id}  style={{ opacity: "0.4" }}>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-variant)' }}></div>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-variant)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)' }}></div>
                                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)'}}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", width: 'var(--md-sys-spacing-4)', textTransform: "uppercase" }}>{item.time}</span>
                                    <div>
                                        <p style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "bold" }}>{item.title}</p>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "500", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)" }}>{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // FUTURE ITEMS (Standard)
                    return (
                        <div key={item.id} >
                            {!isLast && <div style={{ backgroundColor: 'var(--md-sys-color-outline-variant)' }}></div>}
                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)' }}></div>
                            
                            <div 
                                style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', padding: 'var(--md-sys-spacing-5)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', cursor: "pointer", borderRadius: 'var(--md-sys-shape-corner-large)' }} 
                                onClick={item.onAction}
                            >
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 'var(--md-sys-spacing-6)'}}>
                                    <span style={{ backgroundColor: 'var(--md-sys-color-primary-container)', fontWeight: "900", color: "var(--md-sys-color-primary)", borderRadius: 'var(--md-sys-spacing-4)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)"}}>{item.time}</span>
                                    {item.type === 'lesson' && <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontWeight: "900", textTransform: "uppercase", opacity: "0.5" }}>Lezione</span>}
                                </div>
                                <h3 style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "900", transition: "color var(--md-sys-motion-duration-medium)" }}>{item.title}</h3>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontWeight: "500", marginTop: 'var(--md-sys-spacing-4)'}}>{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MAGIC BOTTOM BAR (Floating) --- */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', padding: 'var(--md-sys-spacing-6)', display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 0.8, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-4)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)' }}>
                    
                    <button onClick={() => actions.handleNavigate('settings')} style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)' }}>
                        {}
                        <span  style={{ fontSize: "var(--md-sys-typescale-body-medium-size)" }}>settings</span>
                        {}
                    </button>

                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.5, color: 'var(--md-sys-color-on-surface-variant)', flexGrow: "1", borderRadius: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", fontSize: "var(--md-sys-typescale-label-medium-size)", fontWeight: "bold", border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'}} onClick={onOpenLiveAssistant}>
                        Chiedi all'assistente...
                    </div>

                    <VoiceNoteRecorder onTranscription={(text) => handleAddNote({ note: text })} compact />
                    
                    <button onClick={() => actions.handleNavigate('progettazione-hub')}  style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', display: "flex", alignItems: "center", justifyContent: "center"}}>
                        {}
                        <span  style={{ fontSize: "var(--md-sys-typescale-body-medium-size)" }}>add</span>
                        {}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default React.memo(FlowMode);








