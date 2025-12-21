import React, { useState, useMemo, useEffect, useRef } from 'react';
import { EventoCalendario, AiSettings, SystemSuggestion, View } from '../types';
import EventModal from './EventModal';
import AiEventParserModal from './AiEventParserModal';
import EventActionPopover from './EventActionPopover';
import { TabGroup } from './M3Components';

interface CalendarProps {
    eventi: EventoCalendario[];
    setEventi: React.Dispatch<React.SetStateAction<EventoCalendario[]>>;
    aiSettings: AiSettings;
    activeSuggestion?: SystemSuggestion | null;
    onNavigate?: (view: View, context?: any) => void;
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

const DAYS_SHORT = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
const MONTHS_LONG = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

const Calendar: React.FC<CalendarProps> = ({ eventi, setEventi, aiSettings, activeSuggestion, onNavigate }) => {
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
        const anchor = new Date(currentDate);
        const dayOfWeek = anchor.getDay();
        const distToMonday = (dayOfWeek + 6) % 7;
        const monday = new Date(anchor);
        monday.setDate(anchor.getDate() - distToMonday);
        monday.setHours(0, 0, 0, 0);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

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
            <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-surface z-20 flex-shrink-0 gap-4 border-b border-outline-variant shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant">
                        <button onClick={() => handleNavigate('prev')} className="icon-button !w-10 !h-10 hover:bg-surface-container-highest transition-colors rounded-full" title="Precedente">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button onClick={() => handleNavigate('today')} className="px-4 py-1 text-sm font-bold text-primary hover:bg-primary/10 rounded-full transition-colors">
                            Oggi
                        </button>
                        <button onClick={() => handleNavigate('next')} className="icon-button !w-10 !h-10 hover:bg-surface-container-highest transition-colors rounded-full" title="Successivo">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <h2 className="m3-headline-small capitalize text-on-surface font-bold truncate md:ml-4">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* M3 TabGroup for View Selection (Desktop) */}
                    <div className="hidden md:flex">
                        <TabGroup
                            tabs={[
                                { id: 'month', label: 'Mese' },
                                { id: 'week', label: 'Settimana' },
                                { id: 'day', label: 'Giorno' },
                                { id: 'agenda', label: 'Agenda' }
                            ]}
                            activeTab={viewMode}
                            onTabChange={(id) => setViewMode(id as CalendarView)}
                            variant="secondary"
                        />
                    </div>

                    <div className="md:hidden flex-grow">
                        <select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value as CalendarView)}
                            className="form-select !h-12 !py-2 !pl-4 !pr-10 text-sm rounded-2xl bg-surface-container-high w-full font-medium"
                        >
                            <option value="month">Mese</option>
                            <option value="week">Settimana</option>
                            <option value="day">Giorno</option>
                            <option value="agenda">Agenda</option>
                        </select>
                    </div>

                    <div className="flex gap-2 border-l border-outline-variant pl-3">
                        <button onClick={() => setIsAiParserOpen(true)} className="icon-button-tonal !w-10 !h-10" title="Analizza Circolare con AI">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </button>
                        <button onClick={() => setEditingEvent({})} className="button button-filled !rounded-xl !h-10 px-4 shadow-md font-bold text-sm">
                            <span className="material-symbols-outlined mr-2">add</span> Nuovo Evento
                        </button>
                    </div>
                </div>

                {/* Event Modals and Popovers placeholder - normally would be separate components */}
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
            </header>
        );
    };

    return (
        <div className="calendar-container flex flex-col h-full bg-surface-container-lowest overflow-hidden">
            {renderHeader()}
            <div className="flex-grow overflow-hidden p-6">
                {/* Simplified Calendar Body for Build Test */}
                <div className="grid grid-cols-7 gap-px bg-outline-variant rounded-3xl overflow-hidden border border-outline-variant">
                    {DAYS_SHORT.map(d => <div key={d} className="bg-surface-container-high p-4 text-center font-black text-xs opacity-50">{d}</div>)}
                    {monthDates.map((date, i) => (
                        <div key={i} className={`bg-surface min-h-[120px] p-2 hover:bg-surface-container-low transition-colors ${date.getMonth() !== currentDate.getMonth() ? 'opacity-30' : ''}`}>
                            <div className="text-sm font-bold opacity-40 mb-2">{date.getDate()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
