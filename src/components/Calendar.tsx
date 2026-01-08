import React, { useState, useMemo, useEffect, useRef } from 'react';
import '../modules.css';
import { EventoCalendario, AiSettings } from '../types';
import EventModal from './EventModal';
import AiEventParserModal from './AiEventParserModal';
import EventActionPopover from './EventActionPopover';
import { 
    M3Button, 
    TabGroup 
} from './ui';

interface CalendarProps {
    eventi: EventoCalendario[];
    setEventi: React.Dispatch<React.SetStateAction<EventoCalendario[]>>;
    aiSettings: AiSettings;
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

const DAYS_SHORT = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'];
const MONTHS_LONG = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

const Calendar: React.FC<CalendarProps> = ({ eventi, setEventi, aiSettings }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<CalendarView>('month');
    const [editingEvent, setEditingEvent] = useState<Partial<EventoCalendario> | null>(null);
    const [isAiParserOpen, setIsAiParserOpen] = useState(false);
    const [popoverState, setPopoverState] = useState<{ event: EventoCalendario; anchorEl: HTMLElement } | null>(null);
    const [focusedDateIndex, setFocusedDateIndex] = useState<number>(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const calendarGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if ((viewMode === 'week' || viewMode === 'day') && scrollContainerRef.current) {
            const now = new Date();
            const hour = now.getHours();
            const scrollPos = Math.max(0, (hour - 1) * 60);
            scrollContainerRef.current.scrollTop = scrollPos;
        }
        // Reset focus when view changes
        setFocusedDateIndex(0);
    }, [viewMode]);

    const handleCalendarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Arrow key navigation for calendar grid (month view)
        if (viewMode !== 'month') return;

        const keysToHandle = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (!keysToHandle.includes(e.key)) return;

        e.preventDefault();
        const totalDays = monthDates.length;
        const daysPerWeek = 7;
        let newIndex = focusedDateIndex;

        switch (e.key) {
            case 'ArrowLeft':
                newIndex = focusedDateIndex > 0 ? focusedDateIndex - 1 : 0;
                break;
            case 'ArrowRight':
                newIndex = focusedDateIndex < totalDays - 1 ? focusedDateIndex + 1 : totalDays - 1;
                break;
            case 'ArrowUp':
                newIndex = Math.max(0, focusedDateIndex - daysPerWeek);
                break;
            case 'ArrowDown':
                newIndex = Math.min(totalDays - 1, focusedDateIndex + daysPerWeek);
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = totalDays - 1;
                break;
        }

        setFocusedDateIndex(newIndex);
    };

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        const newDate = new Date(currentDate);
        if (direction === 'today') {
            setCurrentDate(new Date());
            return;
        }

        const modifier = direction === 'next' ? 1 : -1;

        switch (viewMode) {
            case 'month':
                newDate.setMonth(currentDate.getMonth() + modifier);
                break;
            case 'week':
                newDate.setDate(currentDate.getDate() + (modifier * 7));
                break;
            case 'day':
                newDate.setDate(currentDate.getDate() + modifier);
                break;
            case 'agenda':
                newDate.setMonth(currentDate.getMonth() + modifier);
                break;
        }
        setCurrentDate(newDate);
    };

    const monthDates = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay();
        const daysFromPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - daysFromPrevMonth);
        const dates: Date[] = [];
        for (let i = 0; i < 42; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

    const dayEvents = useMemo(() => {
        return eventi.filter(e => e.data === currentDate.toISOString().split('T')[0]);
    }, [eventi, currentDate]);

    const agendaGroups = useMemo(() => {
        const sorted = [...eventi].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        const groups: Record<string, EventoCalendario[]> = {};
        sorted.forEach(ev => {
            const evDate = new Date(ev.data);
            if (viewMode === 'agenda') {
                const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                if (evDate >= start && evDate <= end) {
                    const key = ev.data;
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(ev);
                }
            }
        });
        return groups;
    }, [eventi, currentDate, viewMode]);


    const renderHeader = () => {
        const title = viewMode === 'day'
            ? currentDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
            : `${MONTHS_LONG[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        return (
            <header className="calendar-header bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-md border-b border-[var(--md-sys-color-outline-variant)]/30 p-8 rounded-t-3xl">
                <div className="calendar-header-left">
                    <div className="calendar-nav-group bg-[var(--md-sys-color-surface-container-low)]/50 p-1 rounded-full border border-[var(--md-sys-color-outline-variant)]/20">
                        <M3Button variant="text" onClick={() => handleNavigate('prev')} title="Mese precedente" aria-label="Vai al mese precedente" className="!min-w-0 !p-8">
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                        </M3Button>
                        <M3Button variant="tonal" onClick={() => handleNavigate('today')} className="!px-4 !py-1 !h-auto" title="Torna a oggi">Oggi</M3Button>
                        <M3Button variant="text" onClick={() => handleNavigate('next')} title="Mese successivo" aria-label="Vai al mese successivo" className="!min-w-0 !p-8">
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                        </M3Button>
                    </div>
                    <h2 className="calendar-title text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] ml-4">{title}</h2>
                </div>

                <div className="calendar-header-right gap-8">
                    <TabGroup
                        tabs={[
                            { id: 'month', label: 'Mese' },
                            { id: 'week', label: 'Settimana' },
                            { id: 'day', label: 'Giorno' },
                            { id: 'agenda', label: 'Agenda' }
                        ]}
                        activeTab={viewMode}
                        onTabChange={(id) => setViewMode(id as CalendarView)}
                        variant="primary"
                    />

                    <div className="calendar-actions">
                        <M3Button variant="text" onClick={() => setIsAiParserOpen(true)} title="Analizza circolare con AI" aria-label="Apri analizzatore AI per circolari" className="!min-w-0 !p-8">
                            <span className="material-symbols-outlined text-primary" aria-hidden="true">auto_awesome</span>
                        </M3Button>
                        <M3Button variant="filled" onClick={() => setEditingEvent({})} className="flex items-center gap-8" title="Crea nuovo evento">
                            <span className="material-symbols-outlined" aria-hidden="true">add</span>
                            Nuovo Evento
                        </M3Button>
                    </div>
                </div>
            </header>
        );
    };

    const renderMonthView = () => (
        <div className="calendar-month" role="grid" aria-label="Calendario mensile" ref={calendarGridRef} onKeyDown={handleCalendarKeyDown}>
            <div className="calendar-weekdays" role="row">
                {DAYS_SHORT.map(d => (
                    <div key={d} className="calendar-weekday" role="columnheader" aria-label={d}>{d}</div>
                ))}
            </div>
            <div className="calendar-days" role="rowgroup">
                {monthDates.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayEvents = eventi.filter(e => e.data === date.toISOString().split('T')[0]);
                    const isFocused = i === focusedDateIndex && viewMode === 'month';
                    
                    return (
                        <div 
                            key={i} 
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isFocused ? 'focus-visible:ring-2 focus-visible:ring-primary ring-2 ring-primary' : ''}`}
                            role="gridcell"
                            tabIndex={isFocused ? 0 : -1}
                            aria-label={`${date.toLocaleDateString('it-IT')}${dayEvents.length > 0 ? `, ${dayEvents.length} eventi` : ''}`}
                            onFocus={() => setFocusedDateIndex(i)}
                            onClick={() => {
                                setCurrentDate(date);
                                setViewMode('day');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setCurrentDate(date);
                                    setViewMode('day');
                                }
                            }}
                        >
                            <span className={`calendar-day-number ${isToday ? 'today' : ''}`}>
                                {date.getDate()}
                            </span>
                            <div className="calendar-day-events">
                                {dayEvents.slice(0, 3).map((ev, idx) => (
                                    <div 
                                        key={ev.id || idx} 
                                        className={`calendar-event calendar-event-${ev.tipo || 'default'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingEvent(ev);
                                        }}
                                    >
                                        {ev.titolo}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="calendar-more">+{dayEvents.length - 3} altri</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderWeekView = () => (
        <div className="calendar-week">
            <div className="calendar-week-header">
                {weekDates.map((date, i) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                        <div key={i} className={`calendar-week-day-header ${isToday ? 'today' : ''}`}>
                            <div className="calendar-week-day-name">
                                {DAYS_SHORT[i]}
                            </div>
                            <div className={`calendar-week-day-number ${isToday ? 'today' : ''}`}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="calendar-week-body" ref={scrollContainerRef}>
                {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="calendar-week-hour">
                        <div className="calendar-week-hour-label">
                            {hour.toString().padStart(2, '0')}:00
                        </div>
                        <div className="calendar-week-hour-slots">
                            {weekDates.map((date, dayIndex) => {
                                const dayEvents = eventi.filter(e => {
                                    const eventDate = new Date(e.data);
                                    return eventDate.toDateString() === date.toDateString() &&
                                           e.oraInizio &&
                                           parseInt(e.oraInizio.split(':')[0]) === hour;
                                });
                                
                                return (
                                    <div key={dayIndex} className="calendar-week-slot">
                                        {dayEvents.map((ev, idx) => (
                                            <div 
                                                key={ev.id || idx} 
                                                className={`calendar-week-event calendar-event-${ev.tipo || 'default'}`}
                                                onClick={() => setEditingEvent(ev)}
                                            >
                                                <div className="calendar-week-event-title">{ev.titolo}</div>
                                                <div className="calendar-week-event-time">{ev.oraInizio} - {ev.oraFine || 'N/A'}</div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDayView = () => (
        <div className="calendar-day">
            <div className="calendar-day-header p-8">
                <h3 className="m3-title-large text-primary">
                    {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
            </div>
            <div className="calendar-day-body" ref={scrollContainerRef}>
                {dayEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
                        <span className="material-symbols-outlined text-6xl mb-8" aria-hidden="true">event_busy</span>
                        <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]">Nessun evento per questo giorno</p>
                        <M3Button variant="text" onClick={() => setEditingEvent({})} className="mt-4">Aggiungi Evento</M3Button>
                    </div>
                ) : (
                    <div className="calendar-day-events p-8 space-y-4">
                        {dayEvents.map(ev => (
                            <div 
                                key={ev.id} 
                                className={`calendar-day-event agenda-event-${ev.tipo || 'default'} hover:scale-[1.01] transition-transform cursor-pointer`}
                                onClick={() => setEditingEvent(ev)}
                            >
                                <div className="calendar-day-event-time font-bold">
                                    {ev.oraInizio || 'Tutto il giorno'}
                                </div>
                                <div className="calendar-day-event-content">
                                    <div className="calendar-day-event-title font-bold">{ev.titolo}</div>
                                    {ev.descrizione && <div className="calendar-day-event-desc opacity-80">{ev.descrizione}</div>}
                                    {ev.location && <div className="calendar-day-event-location mt-4">📍 {ev.location}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderAgendaView = () => (
        <div className="calendar-agenda p-8">
            {Object.keys(agendaGroups).length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
                    <span className="material-symbols-outlined text-6xl mb-8" aria-hidden="true">event_busy</span>
                    <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]">Nessun evento questo mese</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(agendaGroups).map(([date, evts]) => (
                        <div key={date} className="agenda-group bg-[var(--md-sys-color-surface-container-high)]/20 rounded-[var(--md-sys-shape-corner-large)] p-8 border border-[var(--md-sys-color-outline-variant)]/20">
                            <div className="agenda-date m3-title-medium text-primary mb-6 border-b border-[var(--md-sys-color-outline-variant)]/30 pb-2">
                                {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <div className="agenda-events space-y-3">
                                {evts.map(ev => (
                                    <div 
                                        key={ev.id} 
                                        className={`agenda-event agenda-event-${ev.tipo || 'default'} hover:bg-[var(--md-sys-color-surface-container-high)]/40 transition-colors cursor-pointer`}
                                        onClick={() => setEditingEvent(ev)}
                                    >
                                        <div className="agenda-event-time font-bold">
                                            {ev.oraInizio || 'Tutto il giorno'}
                                        </div>
                                        <div className="agenda-event-content">
                                            <div className="agenda-event-title font-bold">{ev.titolo}</div>
                                            {ev.descrizione && <div className="agenda-event-desc opacity-80">{ev.descrizione}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div 
            className="calendar-container bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 shadow-[var(--md-sys-elevation-level3)] overflow-hidden"
            ref={calendarGridRef}
            onKeyDown={handleCalendarKeyDown}
        >
            {renderHeader()}
            
            <div className="calendar-body">
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
                {viewMode === 'agenda' && renderAgendaView()}
            </div>

            {editingEvent && (
                <EventModal
                    eventToEdit={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={(ev) => {
                        if (ev.id) {
                            setEventi(prev => prev.map(e => e.id === ev.id ? ev : e));
                        } else {
                            setEventi(prev => [...prev, { ...ev, id: `evt-${Date.now()}` }]);
                        }
                        setEditingEvent(null);
                    }}
                    onDelete={(id) => {
                        setEventi(prev => prev.filter(e => e.id !== id));
                        setEditingEvent(null);
                    }}
                />
            )}

            {isAiParserOpen && (
                <AiEventParserModal
                    aiSettings={aiSettings}
                    onClose={() => setIsAiParserOpen(false)}
                    onEventParsed={(eventData: Partial<EventoCalendario>) => {
                        setEventi(prev => [...prev, { ...eventData, id: `evt-${Date.now()}` } as EventoCalendario]);
                        setIsAiParserOpen(false);
                    }}
                />
            )}

            {popoverState && (
                <EventActionPopover
                    event={popoverState.event}
                    anchorEl={popoverState.anchorEl}
                    onClose={() => setPopoverState(null)}
                    onEdit={() => {
                        setEditingEvent(popoverState.event);
                        setPopoverState(null);
                    }}
                    onDelete={() => {
                        setEventi(prev => prev.filter(e => e.id !== popoverState.event.id));
                        setPopoverState(null);
                    }}
                />
            )}
        </div>
    );
};

export default Calendar;


