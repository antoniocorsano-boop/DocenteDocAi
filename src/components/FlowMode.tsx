
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
        <div className="flex flex-col h-full bg-surface-container-low/30 relative aura-glass">
            
            {/* --- HEADER (Minimal) --- */}
            <div className="flex justify-between items-center p-6 bg-surface/40 backdrop-blur-xl z-10 border-b border-outline-variant/20">
                <div>
                    <h1 className="m3-headline-small font-black text-on-surface tracking-tight">Flow</h1>
                    <p className="m3-label-medium text-primary font-bold uppercase tracking-widest opacity-70">{todayName}, {now.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}</p>
                </div>
                <button onClick={onOpenOperations} className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 transition-all shadow-sm border border-primary/20">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                </button>
            </div>

            {/* --- TIMELINE STREAM --- */}
            <div className="flex-grow overflow-y-auto px-6 py-8 space-y-8 pb-40 custom-scrollbar">
                {timelineItems.length === 0 && (
                    <div 
                        className="text-center py-20 opacity-50 bg-surface-container-low/50 border border-dashed border-outline-variant/30"
                        style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                    >
                        <span className="material-symbols-outlined text-5xl mb-4 text-primary/40">event_busy</span>
                        <p className="m3-title-medium font-bold text-on-surface-variant">Nessun evento o lezione oggi.</p>
                        <button onClick={() => actions.handleNavigate('timetable')} className="mt-4 px-6 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">
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
                                <div className="absolute left-[11px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
                                <div className="absolute left-0 top-8 w-6 h-6 rounded-full border-4 border-surface-container-low bg-primary shadow-lg z-10 animate-pulse"></div>
                                
                                <div className="mb-3 m3-label-small font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    ADESSO • {item.time}
                                </div>
                                <div 
                                    className="card bg-primary text-on-primary shadow-2xl p-6 transform scale-[1.02] transition-all border border-white/10"
                                    style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="m3-headline-small font-black tracking-tight leading-tight">{item.title}</h2>
                                            <p className="m3-body-medium opacity-80 font-medium mt-1">{item.subtitle}</p>
                                        </div>
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                                            <span className="material-symbols-outlined text-3xl">
                                                {item.type === 'lesson' ? 'school' : 'event'}
                                            </span>
                                        </div>
                                    </div>
                                    {item.actionLabel && (
                                        <button onClick={item.onAction} className="w-full py-4 bg-white text-primary rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg hover:bg-opacity-90 transition-all">
                                            {item.actionLabel} <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // PAST ITEMS (Compact, Faded)
                    if (item.status === 'past') {
                        return (
                            <div key={item.id} className="relative pl-10 opacity-40 grayscale-[0.5]">
                                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-outline-variant/30"></div>
                                <div className="absolute left-[4px] top-2 w-4 h-4 rounded-full bg-outline-variant/50 border-2 border-surface-container-low"></div>
                                <div className="flex items-center gap-6 py-2">
                                    <span className="text-[10px] font-black text-on-surface-variant w-12 uppercase tracking-tighter">{item.time}</span>
                                    <div>
                                        <p className="m3-body-medium font-bold text-on-surface line-through decoration-outline-variant/50">{item.title}</p>
                                        <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // FUTURE ITEMS (Standard)
                    return (
                        <div key={item.id} className="relative pl-10">
                            {!isLast && <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-outline-variant/20"></div>}
                            <div className="absolute left-[4px] top-2 w-4 h-4 rounded-full border-2 border-primary/40 bg-surface-container-low"></div>
                            
                            <div 
                                className="card bg-surface-container-high/40 backdrop-blur-md p-5 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high/60 transition-all cursor-pointer group" 
                                onClick={item.onAction}
                                style={{ borderRadius: 'calc(var(--shape-l) * var(--sys-radius-multiplier))' }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="m3-label-small font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10 uppercase tracking-widest">{item.time}</span>
                                    {item.type === 'lesson' && <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50">Lezione</span>}
                                </div>
                                <h3 className="m3-title-medium font-black text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="m3-body-small text-on-surface-variant font-medium mt-1">{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MAGIC BOTTOM BAR (Floating) --- */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent pb-8 pt-16 pointer-events-none z-20">
                <div className="pointer-events-auto max-w-lg mx-auto bg-surface-container-highest/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-2.5 flex items-center gap-3">
                    
                    <button onClick={() => actions.handleNavigate('settings')} className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all">
                        <span className="material-symbols-outlined text-2xl">settings</span>
                    </button>

                    <div className="flex-grow bg-surface-container-low/50 rounded-full h-12 flex items-center px-6 text-on-surface-variant/60 text-sm font-bold cursor-text border border-outline-variant/10 hover:border-primary/30 transition-all" onClick={onOpenLiveAssistant}>
                        Chiedi all'assistente...
                    </div>

                    <VoiceNoteRecorder onTranscription={(text) => handleAddNote({ note: text })} compact />
                    
                    <button onClick={() => actions.handleNavigate('progettazione-hub')} className="w-12 h-12 rounded-full bg-primary text-on-primary shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default React.memo(FlowMode);
