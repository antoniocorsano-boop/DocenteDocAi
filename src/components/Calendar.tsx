import React, { useState, useMemo, useEffect, useRef } from 'react';
import '../modules.css';
import { EventoCalendario, AiSettings } from '../types';
import EventModal from './EventModal';
import AiEventParserModal from './AiEventParserModal';
import EventActionPopover from './EventActionPopover';
import { TabGroup } from './M3Components';
import M3Button from './M3Button';

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if ((viewMode === 'week' || viewMode === 'day') && scrollContainerRef.current) {
            const now = new Date();
            const hour = now.getHours();
            const scrollPos = Math.max(0, (hour - 1) * 60);
            scrollContainerRef.current.scrollTop = scrollPos;
        }
    }, [viewMode]);

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
            <header className="calendar-header">
                <div className="calendar-header-left">
                    <div className="calendar-nav-group">
                        <M3Button variant="text" onClick={() => handleNavigate('prev')} title="Precedente" startIcon={<span className="material-symbols-outlined">chevron_left</span>}>
                            <span className="visually-hidden">Precedente</span>
                        </M3Button>
                        <M3Button variant="tonal" onClick={() => handleNavigate('today')} >Oggi</M3Button>
                        <M3Button variant="text" onClick={() => handleNavigate('next')} title="Successivo" endIcon={<span className="material-symbols-outlined">chevron_right</span>}>
                            <span className="visually-hidden">Successivo</span>
                        </M3Button>
                    </div>
                    <h2 className="calendar-title">{title}</h2>
                </div>

                <div className="calendar-header-right">
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
                        <M3Button variant="text" onClick={() => setIsAiParserOpen(true)} title="Analizza Circolare con AI" startIcon={<span className="material-symbols-outlined">auto_awesome</span>}>
                            <span className="visually-hidden">Analizza Circolare con AI</span>
                        </M3Button>
                        <M3Button variant="filled" onClick={() => setEditingEvent({})} startIcon={<span className="material-symbols-outlined">add</span>}>
                            Nuovo Evento
                        </M3Button>
                    </div>
                </div>
            </header>
        );
    };

    const renderMonthView = () => (
        <div className="calendar-month">
            <div className="calendar-weekdays">
                {DAYS_SHORT.map(d => (
                    <div key={d} className="calendar-weekday">{d}</div>
                ))}
            </div>
            <div className="calendar-days">
                {monthDates.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayEvents = eventi.filter(e => e.data === date.toISOString().split('T')[0]);
                    
                    return (
                        <div 
                            key={i} 
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => {
                                setCurrentDate(date);
                                setViewMode('day');
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
            <div className="calendar-day-header">
                <h3 className="calendar-day-title">
                    {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
            </div>
            <div className="calendar-day-body" ref={scrollContainerRef}>
                {dayEvents.length === 0 ? (
                    <div className="calendar-empty">
                        <span className="material-symbols-outlined">event_busy</span>
                        <p>Nessun evento per questo giorno</p>
                    </div>
                ) : (
                    <div className="calendar-day-events">
                        {dayEvents.map(ev => (
                            <div 
                                key={ev.id} 
                                className={`calendar-day-event agenda-event-${ev.tipo || 'default'}`}
                                onClick={() => setEditingEvent(ev)}
                            >
                                <div className="calendar-day-event-time">
                                    {ev.oraInizio || 'Tutto il giorno'}
                                </div>
                                <div className="calendar-day-event-content">
                                    <div className="calendar-day-event-title">{ev.titolo}</div>
                                    {ev.descrizione && <div className="calendar-day-event-desc">{ev.descrizione}</div>}
                                    {ev.location && <div className="calendar-day-event-location">📍 {ev.location}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderAgendaView = () => (
        <div className="calendar-agenda">
            {Object.keys(agendaGroups).length === 0 ? (
                <div className="calendar-empty">
                    <span className="material-symbols-outlined">event_busy</span>
                    <p>Nessun evento questo mese</p>
                </div>
            ) : (
                Object.entries(agendaGroups).map(([date, evts]) => (
                    <div key={date} className="agenda-group">
                        <div className="agenda-date">
                            {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                        <div className="agenda-events">
                            {evts.map(ev => (
                                <div 
                                    key={ev.id} 
                                    className={`agenda-event agenda-event-${ev.tipo || 'default'}`}
                                    onClick={() => setEditingEvent(ev)}
                                >
                                    <div className="agenda-event-time">
                                        {ev.oraInizio || 'Tutto il giorno'}
                                    </div>
                                    <div className="agenda-event-content">
                                        <div className="agenda-event-title">{ev.titolo}</div>
                                        {ev.descrizione && <div className="agenda-event-desc">{ev.descrizione}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="calendar-container">
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
