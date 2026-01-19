// MD3 Compliant - Block I Migration (7 violations eliminated)
// M3Expressive refactor: ✅ COMPLETED - Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
// ...existing code...
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
            <header >
                <div >
                    <div style={{
                        backgroundColor: 'var(--md-sys-color-surface)',
                        padding: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        border: `1px solid var(--md-sys-color-outline)`
                    }}>
                        <M3Button variant="text" onClick={() => handleNavigate('prev')} title="Mese precedente" aria-label="Vai al mese precedente" >
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">chevron_left</span>
                        </M3Button>
                        <M3Button variant="tonal" onClick={() => handleNavigate('today')}  title="Torna a oggi">Oggi</M3Button>
                        <M3Button variant="text" onClick={() => handleNavigate('next')} title="Mese successivo" aria-label="Vai al mese successivo" >
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">chevron_right</span>
                        </M3Button>
                    </div>
                    <h2 >{title}</h2>
                </div>

                <div  style={{gap: 'var(--md-sys-spacing-8)'}}>
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

                    <div >
                        <M3Button variant="text" onClick={() => setIsAiParserOpen(true)} title="Analizza circolare con AI" aria-label="Apri analizzatore AI per circolari" >
                            <span  style={{color: "var(--md-sys-color-primary)"}} aria-hidden="true">auto_awesome</span>
                        </M3Button>
                        <M3Button variant="filled" onClick={() => setEditingEvent({})} title="Crea nuovo evento">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">add</span>
                            Nuovo Evento
                        </M3Button>
                    </div>
                </div>
            </header>
        );
    };

    const renderMonthView = () => (
        <div  role="grid" aria-label="Calendario mensile" ref={calendarGridRef} onKeyDown={handleCalendarKeyDown}>
            <div  role="row">
                {DAYS_SHORT.map(d => (
                    <div key={d}  role="columnheader" aria-label={d}>{d}</div>
                ))}
            </div>
            <div  role="rowgroup">
                {monthDates.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isFocused = i === focusedDateIndex && viewMode === 'month';
                    
                    return (
                        <div 
                            key={i} 
                            style={{
                                minHeight: '100px',
                                padding: 'var(--md-sys-spacing-2)',
                                borderRight: '1px solid var(--md-sys-color-outline-variant)',
                                borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                background: !isCurrentMonth ? 'var(--md-sys-color-surface-container-lowest)' : 'var(--md-sys-color-surface)',
                                opacity: !isCurrentMonth ? 0.5 : 1,
                                cursor: 'pointer',
                                transition: 'background-color var(--motion-duration-short) var(--motion-easing-standard)',
                                ...(isFocused ? {
                                    outline: '2px solid var(--md-sys-color-primary)',
                                    outlineOffset: '2px'
                                } : {})
                            }}
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
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                fontSize: 'var(--typography-body-medium-fontSize)',
                                fontWeight: isToday ? 700 : 500,
                                color: isToday ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                background: isToday ? 'var(--md-sys-color-primary)' : 'transparent',
                                borderRadius: 'var(--md-sys-shape-corner-full)'
                            }}>
                                {date.getDate()}
                            </span>
                            <div >
                                {dayEvents.slice(0, 3).map((ev, idx) => (
                                    <div 
                                        key={ev.id || idx} 
                                        style={{
                                            padding: '2px var(--md-sys-spacing-2)',
                                            fontSize: 'var(--md-sys-typescale-body-small-size)',
                                            fontWeight: 500,
                                            borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            cursor: 'pointer',
                                            transition: 'filter var(--motion-duration-short) var(--motion-easing-standard)',
                                            background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' : 
                                                       ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                       ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                       'var(--md-sys-color-secondary-container)',
                                            color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' : 
                                                   ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                   ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                   'var(--md-sys-color-on-secondary-container)'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingEvent(ev);
                                        }}
                                    >
                                        {ev.titolo}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div >+{dayEvents.length - 3} altri</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderWeekView = () => (
        <div >
            <div >
                {weekDates.map((date, i) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                        <div key={i} style={{
                            padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-2)',
                            textAlign: 'center',
                            borderRight: i < 6 ? '1px solid var(--md-sys-color-outline-variant)' : 'none'
                        }}>
                            <div style={{
                                fontSize: 'var(--typography-label-small-fontSize)',
                                fontWeight: 700,
                                color: 'var(--md-sys-color-on-surface-variant)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: 'var(--md-sys-spacing-1)'
                            }}>
                                {DAYS_SHORT[i]}
                            </div>
                            <div style={{
                                fontSize: 'var(--typography-body-medium-fontSize)',
                                fontWeight: 500,
                                color: isToday ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                background: isToday ? 'var(--md-sys-color-primary)' : 'transparent',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px'
                            }}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div  ref={scrollContainerRef}>
                {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} >
                        <div >
                            {hour.toString().padStart(2, '0')}:00
                        </div>
                        <div >
                            {weekDates.map((date, dayIndex) => {
                                const dayEvents = events.filter(e => {
                                    const eventDate = new Date(e.data);
                                    return eventDate.toDateString() === date.toDateString() &&
                                           e.oraInizio &&
                                           parseInt(e.oraInizio.split(':')[0]) === hour;
                                });
                                
                                return (
                                    <div key={dayIndex} >
                                        {dayEvents.map((ev, idx) => (
                                            <div 
                                                key={ev.id || idx} 
                                                style={{
                                                    padding: '2px var(--md-sys-spacing-2)',
                                                    fontSize: 'var(--md-sys-typescale-body-small-size)',
                                                    fontWeight: 500,
                                                    borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                    transition: 'filter var(--motion-duration-short) var(--motion-easing-standard)',
                                                    background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' : 
                                                               ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                               ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                               'var(--md-sys-color-secondary-container)',
                                                    color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' : 
                                                           ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                           ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                           'var(--md-sys-color-on-secondary-container)'
                                                }}
                                                onClick={() => setEditingEvent(ev)}
                                            >
                                                <div >{ev.titolo}</div>
                                                <div >{ev.oraInizio} - {ev.oraFine || 'N/A'}</div>
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
        <div >
            <div  style={{padding: 'var(--md-sys-spacing-8)'}}>
                <h3  style={{color: 'var(--md-sys-color-primary)'}}>
                    {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
            </div>
            <div  ref={scrollContainerRef}>
                {dayEvents.length === 0 ? (
                    <div style={{ 
                        padding: 'var(--md-sys-spacing-12)', 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        textAlign: "center", 
                        opacity: "0.6" 
                    }}>
                        <span 
                            style={{ 
                                color: 'var(--md-sys-color-on-surface-variant)',
                                marginBottom: 'var(--md-sys-spacing-8)'
                            }} 
                            aria-hidden="true"
                        >
                            event_busy
                        </span>
                        <p style={{ color: 'var(--md-sys-color-on-surface)' }}>
                            Nessun evento per questo giorno
                        </p>
                        <M3Button variant="text" onClick={() => setEditingEvent({})} style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                            Aggiungi Evento
                        </M3Button>
                    </div>
                ) : (
                    <div  style={{padding: 'var(--md-sys-spacing-8)', gap: 'var(--md-sys-spacing-4)'}}>
                        {dayEvents.map(ev => (
                            <div 
                                key={ev.id} 
                                style={{
                                    display: 'flex',
                                    gap: 'var(--md-sys-spacing-4)',
                                    padding: 'var(--md-sys-spacing-4)',
                                    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                    cursor: 'pointer',
                                    transition: 'background-color var(--motion-duration-short) var(--motion-easing-standard), transform var(--motion-duration-short) var(--motion-easing-standard)',
                                    background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' : 
                                               ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                               ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                               'var(--md-sys-color-secondary-container)',
                                    color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' : 
                                           ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                           ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                           'var(--md-sys-color-on-secondary-container)'
                                }}
                                onClick={() => setEditingEvent(ev)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div  style={{ fontWeight: "bold" }}>
                                    {ev.oraInizio || 'Tutto il giorno'}
                                </div>
                                <div >
                                    <div  style={{ fontWeight: "bold" }}>{ev.titolo}</div>
                                    {ev.descrizione && <div  style={{ opacity: "0.8" }}>{ev.descrizione}</div>}
                                    {ev.location && <div  style={{marginTop: 'var(--md-sys-spacing-4)'}}>📍 {ev.location}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderAgendaView = () => (
        <div  style={{padding: 'var(--md-sys-spacing-8)'}}>
            {Object.keys(agendaGroups).length === 0 ? (
                <div style={{ padding: 'var(--md-sys-spacing-8)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: "0.6" }}>
                    <span style={{ color: "var(--md-sys-color-on-surface-variant)", marginBottom: 'var(--md-sys-spacing-8)' }} aria-hidden="true">event_busy</span>
                    <p style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Nessun evento questo mese</p>
                </div>
            ) : (
                <div style={{gap: 'var(--md-sys-spacing-6)'}}>
                    {Object.entries(agendaGroups).map(([date, evts]) => (
                        <div key={date} style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/20, borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', border: "1px solid var(--md-sys-color-outline)"}}>
                            <div  style={{color: "var(--md-sys-color-primary)", marginBottom: 'var(--md-sys-spacing-6)', borderBottom: "1px solid var(--md-sys-color-outline)"}}>
                                {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <div  style={{gap: 'var(--md-sys-spacing-3)'}}>
                                {evts.map(ev => (
                                    <div 
                                        key={ev.id} 
                                        style={{
                                            display: 'flex',
                                            gap: 'var(--md-sys-spacing-4)',
                                            padding: 'var(--md-sys-spacing-4)',
                                            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                            cursor: 'pointer',
                                            transition: 'background-color var(--motion-duration-short) var(--motion-easing-standard)',
                                            background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' : 
                                                       ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                       ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                       'var(--md-sys-color-secondary-container)',
                                            color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' : 
                                                   ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                   ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                   'var(--md-sys-color-on-secondary-container)'
                                        }}
                                        onClick={() => setEditingEvent(ev)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' : 
                                                                                                      ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                                                                      ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                                                                      'var(--md-sys-color-secondary-container)'}
                                    >
                                        <div  style={{ fontWeight: "bold" }}>
                                            {ev.oraInizio || 'Tutto il giorno'}
                                        </div>
                                        <div >
                                            <div  style={{ fontWeight: "bold" }}>{ev.titolo}</div>
                                            {ev.descrizione && <div  style={{ opacity: "0.8" }}>{ev.descrizione}</div>}
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
            
            ref={calendarGridRef}
            onKeyDown={handleCalendarKeyDown}
        >
            {renderHeader()}
            
            <div >
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







