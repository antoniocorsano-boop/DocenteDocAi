// LEGACY - MD3 Non-compliant

import React, { useMemo, useState, useEffect } from 'react';
import { Lezione, Slot, EventoCalendario, AppActions } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { useAcademicStore } from '../stores/useAcademicStore';

import VoiceNoteRecorder from './VoiceNoteRecorder';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
                
                let status: TimelineItem['status] = 'future';
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
            
            let status: TimelineItem['status] = 'future';
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
        <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/30 }} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* --- HEADER (Minimal) --- */}
            <div style={{ backgroundColor: sys.colors.surface/40 }} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: layers.ref.spacing['6'], borderBottom: "1px solid layers.sys.color.outline"}}>
                <div>
                    <h1 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)], color:  layers.sys.color.onPrimary }} style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Flow</h1>
                    <p  style={{color: "layers.sys.color.primary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7"}}>{todayName}, {now.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}</p>
                </div>
                <button onClick={onOpenOperations} style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: sys.colors.primary/10 }} style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", color: "layers.sys.color.primary", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", border: "1px solid layers.sys.color.outline"}}>
                    <span  style={{ fontSize: "1.5rem" }}>bolt</span>
                </button>
            </div>

            {/* --- TIMELINE STREAM --- */}
            <div  style={{flexGrow: "1", overflowY: "auto", gap: layers.ref.spacing['8']}}>
                {timelineItems.length === 0 && (
                    <div 
                        style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50 }} style={{textAlign: "center", opacity: "0.5", border: "1px solid layers.sys.color.outline"}}
                        style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                    >
                        <span style={{ color: sys.colors.5xl, color: sys.colors.primary/40 }} style={{marginBottom: layers.ref.spacing['8']}}>event_busy</span>
                        <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontWeight: "bold" }}>Nessun evento o lezione oggi.</p>
                        <button onClick={() => actions.handleNavigate('timetable')} style={{ backgroundColor: sys.colors.primary/10 }} style={{marginTop: layers.ref.spacing['4'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], color: "layers.sys.color.primary", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}}>
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
                                <div style={{ backgroundColor: sys.colors.gradient-to-b }} style={{ width: "0.25rem", borderRadius: layers.ref.spacing['4'] }}></div>
                                <div  style={{width: "1.5rem", height: "1.5rem", borderRadius: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.primary"}}></div>
                                
                                <div  style={{marginBottom: layers.ref.spacing['6'], fontWeight: "900", color: "layers.sys.color.primary", textTransform: "uppercase", display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                    <span  style={{ display: "flex", height: "0.5rem", width: "0.5rem" }}>
                                        <span  style={{display: "inline-flex", height: "100%", width: "100%", borderRadius: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.primary", opacity: "0.75"}}></span>
                                        <span  style={{display: "inline-flex", borderRadius: layers.ref.spacing['4'], height: "0.5rem", width: "0.5rem", backgroundColor: "layers.sys.color.primary"}}></span>
                                    </span>
                                    ADESSO • {item.time}
                                </div>
                                <div 
                                     style={{backgroundColor: "layers.sys.color.primary", color: "layers.sys.color.on-primary", padding: layers.ref.spacing['6'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", border: "1px solid layers.sys.color.outline"}}
                                    style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                                >
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: layers.ref.spacing['6']}}>
                                        <div>
                                            <h2 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)] }} style={{ fontWeight: "900", letterSpacing: "-0.005em", lineHeight: "1.25" }}>{item.title}</h2>
                                            <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }} style={{opacity: "0.8", fontWeight: "500", marginTop: layers.ref.spacing['4']}}>{item.subtitle}</p>
                                        </div>
                                        <div style={{ backgroundColor: sys.colors.white/20, borderRadius: layers.ref.shape.corner.large }} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ color: sys.colors.3xl }}>
                                                {item.type === 'lesson' ? 'school' : 'event'}
                                            </span>
                                        </div>
                                    </div>
                                    {item.actionLabel && (
                                        <button onClick={item.onAction} style={{ borderRadius: layers.ref.shape.corner.large }} style={{width: "100%", paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], backgroundColor: "white", color: "layers.sys.color.primary", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}}>
                                            {item.actionLabel} <span  style={{ marginLeft: "0.5rem", fontSize: "0.875rem" }}>arrow_forward</span>
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
                                <div style={{ backgroundColor: sys.colors.outline-variant/30 }}></div>
                                <div style={{ backgroundColor: sys.colors.outline-variant/50 }} style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'] }}></div>
                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>
                                    <span style={{ color: sys.colors.[10px], color:  layers.sys.color.onSurfaceVariant }} style={{ fontWeight: "900", width: layers.ref.spacing['4'], textTransform: "uppercase" }}>{item.time}</span>
                                    <div>
                                        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color:  layers.sys.color.onPrimary }} style={{ fontWeight: "bold" }}>{item.title}</p>
                                        <p style={{ color: sys.colors.[10px], color:  layers.sys.color.onSurfaceVariant }} style={{ fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // FUTURE ITEMS (Standard)
                    return (
                        <div key={item.id} >
                            {!isLast && <div style={{ backgroundColor: sys.colors.outline-variant/20 }}></div>}
                            <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow }} style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'] }}></div>
                            
                            <div 
                                style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/40 }} style={{padding: layers.ref.spacing['5'], border: "1px solid layers.sys.color.outline", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}} 
                                onClick={item.onAction}
                                style={{ borderRadius: 'calc(var(--shape-l) * var(--sys-radius-multiplier))' }}
                            >
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['6']}}>
                                    <span style={{ backgroundColor: sys.colors.primary/10 }} style={{fontWeight: "900", color: "layers.sys.color.primary", borderRadius: layers.ref.spacing['4'], border: "1px solid layers.sys.color.outline", textTransform: "uppercase", letterSpacing: "0.1em"}}>{item.time}</span>
                                    {item.type === 'lesson' && <span style={{ color: sys.colors.[9px], color:  layers.sys.color.onSurfaceVariant }} style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.5" }}>Lezione</span>}
                                </div>
                                <h3 style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "900", transition: "color 300ms" }}>{item.title}</h3>
                                <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{fontWeight: "500", marginTop: layers.ref.spacing['4']}}>{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MAGIC BOTTOM BAR (Floating) --- */}
            <div style={{ backgroundColor: sys.colors.gradient-to-t }} style={{padding: layers.ref.spacing['6']}}>
                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHighest/80, borderRadius: ref.shape[25], padding: layers.ref.spacing['4'] }} style={{marginLeft: "auto", marginRight: "auto", border: "1px solid layers.sys.color.outline", display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                    
                    <button onClick={() => actions.handleNavigate('settings')} style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                        <span  style={{ fontSize: "1.5rem" }}>settings</span>
                    </button>

                    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50, color:  layers.sys.color.onSurfaceVariant/60 }} style={{flexGrow: "1", borderRadius: layers.ref.spacing['4'], height: layers.ref.spacing['4'], display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: "bold", border: "1px solid layers.sys.color.outline", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}} onClick={onOpenLiveAssistant}>
                        Chiedi all'assistente...
                    </div>

                    <VoiceNoteRecorder onTranscription={(text) => handleAddNote({ note: text })} compact />
                    
                    <button onClick={() => actions.handleNavigate('progettazione-hub')}  style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.primary", color: "layers.sys.color.on-primary", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <span  style={{ fontSize: "1.5rem" }}>add</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default React.memo(FlowMode);







