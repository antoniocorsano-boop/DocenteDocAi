
import React, { useMemo, useState, useEffect } from 'react';
import { Lezione, Slot, EventoCalendario, AppActions, AppState } from '../types';
import { DAYS_OF_WEEK } from '../constants';

import VoiceNoteRecorder from './VoiceNoteRecorder';

interface FlowModeProps {
    appState: AppState;
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

const FlowMode: React.FC<FlowModeProps> = ({ appState, actions, onOpenOperations, onOpenLiveAssistant }) => {
    const { slots, lessons, eventi } = appState;
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
        <div className="flex flex-col h-full bg-surface-container-low relative">
            
            {/* --- HEADER (Minimal) --- */}
            <div className="flex justify-between items-center p-4 bg-surface z-10 border-b border-outline-variant">
                <div>
                    <h1 className="m3-headline-small font-bold text-on-surface">Flow</h1>
                    <p className="m3-body-small text-on-surface-variant capitalize">{todayName}, {now.toLocaleDateString()}</p>
                </div>
                <button onClick={onOpenOperations} className="icon-button text-primary bg-primary-container">
                    <span className="material-symbols-outlined">bolt</span>
                </button>
            </div>

            {/* --- TIMELINE STREAM --- */}
            <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6 pb-32">
                {timelineItems.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                        <p className="m3-body-medium">Nessun evento o lezione oggi.</p>
                        <button onClick={() => actions.handleNavigate('timetable')} className="button button-text mt-2">Configura Orario</button>
                    </div>
                )}

                {timelineItems.map((item, index) => {
                    const isLast = index === timelineItems.length - 1;
                    
                    if (item.status === 'current') {
                        // HERO CARD FOR CURRENT EVENT
                        return (
                            <div key={item.id} className="relative pl-8">
                                <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-primary"></div>
                                <div className="absolute left-0 top-6 w-5 h-5 rounded-full border-4 border-surface bg-primary shadow-sm z-10"></div>
                                
                                <div className="mb-2 m3-label-small font-bold text-primary animate-pulse">ADESSO • {item.time}</div>
                                <div className="card bg-primary-container text-on-primary-container shadow-lg transform scale-105 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="m3-headline-small font-bold">{item.title}</h2>
                                            <p className="m3-body-medium opacity-90">{item.subtitle}</p>
                                        </div>
                                        <div className="p-2 bg-surface/20 rounded-xl">
                                            <span className="material-symbols-outlined text-2xl">
                                                {item.type === 'lesson' ? 'school' : 'event'}
                                            </span>
                                        </div>
                                    </div>
                                    {item.actionLabel && (
                                        <button onClick={item.onAction} className="button bg-surface text-primary w-full justify-center font-bold">
                                            {item.actionLabel} <span className="material-symbols-outlined ml-2">arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // PAST ITEMS (Compact, Faded)
                    if (item.status === 'past') {
                        return (
                            <div key={item.id} className="relative pl-8 opacity-60">
                                <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-outline-variant"></div>
                                <div className="absolute left-[2px] top-1 w-4 h-4 rounded-full bg-outline-variant border-2 border-surface"></div>
                                <div className="flex items-center gap-4 py-1">
                                    <span className="text-xs font-mono text-on-surface-variant w-10">{item.time}</span>
                                    <div>
                                        <p className="m3-body-medium font-bold line-through decoration-outline">{item.title}</p>
                                        <p className="m3-body-small text-on-surface-variant">{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // FUTURE ITEMS (Standard)
                    return (
                        <div key={item.id} className="relative pl-8">
                            {!isLast && <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-outline-variant"></div>}
                            <div className="absolute left-[2px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-surface"></div>
                            
                            <div className="card bg-surface p-4 border border-outline-variant hover:border-primary transition-colors cursor-pointer" onClick={item.onAction}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="m3-label-small font-bold text-primary bg-primary-container px-2 py-0.5 rounded">{item.time}</span>
                                    {item.type === 'lesson' && <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Lezione</span>}
                                </div>
                                <h3 className="m3-title-medium font-bold">{item.title}</h3>
                                <p className="m3-body-small text-on-surface-variant">{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MAGIC BOTTOM BAR (Floating) --- */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface to-transparent pb-6 pt-12 pointer-events-none">
                <div className="pointer-events-auto max-w-lg mx-auto bg-surface-container-high rounded-full shadow-xl border border-outline-variant p-2 flex items-center gap-2">
                    
                    <button onClick={() => actions.handleNavigate('settings')} className="icon-button !w-10 !h-10 text-on-surface-variant">
                        <span className="material-symbols-outlined">settings</span>
                    </button>

                    <div className="flex-grow bg-surface-container-highest rounded-full h-10 flex items-center px-4 text-on-surface-variant text-sm cursor-text opacity-70" onClick={onOpenLiveAssistant}>
                        Chiedi all'assistente...
                    </div>

                    <VoiceNoteRecorder onTranscription={(text) => handleAddNote({ note: text })} compact />
                    
                    <button onClick={() => actions.handleNavigate('progettazione-hub')} className="icon-button !w-10 !h-10 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default FlowMode;
