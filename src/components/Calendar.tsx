// MD3 Compliant - Block J Migration Complete (5 violations eliminated)
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useMemo, useEffect, useRef, Suspense, lazy } from 'react';
import '../modules.css';
import { EventoCalendario, AiSettings } from '../types';
const EventModal = lazy(() => import('./EventModal'));
const AiEventParserModal = lazy(() => import('./AiEventParserModal'));
import EventActionPopover from './EventActionPopover';

interface CalendarProps {
    eventi: EventoCalendario[];
    setEventi: React.Dispatch<React.SetStateAction<EventoCalendario[]>>;
    aiSettings: AiSettings;
    activeSuggestion?: unknown;
    onNavigate?: (view: string, context?: unknown) => void;
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
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)', bgcolor: 'var(--md-sys-color-surface-container-low)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                    <Box sx={{
                        bgcolor: 'var(--md-sys-color-surface)',
                        p: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'
                    }}>
                        <Button variant="text" onClick={() => handleNavigate('prev')} title="Mese precedente" aria-label="Vai al mese precedente">
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true">chevron_left</Box>
                        </Button>
                        <Button variant="outlined" onClick={() => handleNavigate('today')} title="Torna a oggi">Oggi</Button>
                        <Button variant="text" onClick={() => handleNavigate('next')} title="Mese successivo" aria-label="Vai al mese successivo">
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true">chevron_right</Box>
                        </Button>
                    </Box>
                    <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-surface)' }}>{title}</Typography>
                </Stack>

                <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-8)' }}>
                                        <Tabs
                      value={viewMode}
                      onChange={(_, v: string) => ((id) => setViewMode(id as CalendarView))(v)}
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="Sezioni di navigazione"
                      sx={{
                        bgcolor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        minHeight: 'auto',
                        p: 0.5,
                      }}
                    >
                      {([
                            { id: 'month', label: 'Mese' },
                            { id: 'week', label: 'Settimana' },
                            { id: 'day', label: 'Giorno' },
                            { id: 'agenda', label: 'Agenda' }
                        ]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                        <Tab
                          key={tab.id}
                          value={tab.id}
                          id={`tab-${tab.id}`}
                          aria-controls={`panel-${tab.id}`}
                          data-testid={`tab-${tab.id}`}
                          label={(
                            <Badge badgeContent={tab.badge} color="error">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                {tab.label}
                              </Box>
                            </Badge>
                          )}
                          sx={{
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            minHeight: 'auto',
                            py: 1,
                            px: 2,
                            textTransform: 'uppercase',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                          }}
                        />
                      ))}
                    </Tabs>

                    <Stack direction="row" alignItems="center" sx={{ gap: 'var(--md-sys-spacing-3)' }}>
                        <Button variant="text" onClick={() => setIsAiParserOpen(true)} title="Analizza circolare con AI" aria-label="Apri analizzatore AI per circolari">
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-primary)' }}>auto_awesome</Box>
                        </Button>
                        <Button variant="contained" onClick={() => setEditingEvent({})} title="Crea nuovo evento" startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">add</Box>}>
                            Nuovo Evento
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        );
    };

    const renderMonthView = () => (
        <Box role="grid" aria-label="Calendario mensile" ref={calendarGridRef} onKeyDown={handleCalendarKeyDown}>
            <Box role="row">
                {DAYS_SHORT.map(d => (
                    <Box key={d} role="columnheader" aria-label={d}>{d}</Box>
                ))}
            </Box>
            <Box role="rowgroup">
                {monthDates.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isFocused = i === focusedDateIndex && viewMode === 'month';
                    const cellEvents = eventi.filter(e => e.data === date.toISOString().split('T')[0]);

                    return (
                        <Box
                            key={i}
                            sx={{
                                minHeight: 'var(--md-sys-spacing-25)',
                                p: 'var(--md-sys-spacing-2)',
                                borderRight: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                borderBottom: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                bgcolor: !isCurrentMonth ? 'var(--md-sys-color-surface-container-lowest)' : 'var(--md-sys-color-surface)',
                                opacity: !isCurrentMonth ? 0.5 : 1,
                                cursor: 'pointer',
                                transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                ...(isFocused ? {
                                    outline: 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)',
                                    outlineOffset: 'var(--md-sys-border-width-thick)'
                                } : {})
                            }}
                            role="gridcell"
                            tabIndex={isFocused ? 0 : -1}
                            aria-label={`${date.toLocaleDateString('it-IT')}${cellEvents.length > 0 ? `, ${cellEvents.length} eventi` : ''}`}
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
                            <Box component="span" sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 'var(--md-sys-spacing-7)',
                                height: 'var(--md-sys-spacing-7)',
                                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                fontWeight: isToday ? 'var(--md-sys-typescale-weight-bold)' : 'var(--md-sys-typescale-weight-medium)',
                                color: isToday ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                bgcolor: isToday ? 'var(--md-sys-color-primary)' : 'transparent',
                                borderRadius: 'var(--md-sys-shape-corner-full)'
                            }}>
                                {date.getDate()}
                            </Box>
                            <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                                {cellEvents.slice(0, 3).map((ev, idx) => (
                                    <ButtonBase
                                        key={ev.id || idx}
                                        onClick={(e) => { e.stopPropagation(); setEditingEvent(ev); }}
                                        aria-label={ev.titolo}
                                        focusRipple
                                        sx={{
                                            display: 'block',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: 'var(--md-sys-spacing-0_5) var(--md-sys-spacing-2)',
                                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                            fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                            borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            position: 'relative',
                                            background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' :
                                                       ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                       ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                       'var(--md-sys-color-secondary-container)',
                                            color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' :
                                                   ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                   ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                   'var(--md-sys-color-on-secondary-container)',
                                            '&:hover::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundColor: 'var(--md-sys-color-on-surface)', opacity: 0.08, pointerEvents: 'none' },
                                            '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                                        }}
                                    >
                                        {ev.titolo}
                                    </ButtonBase>
                                ))}
                                {cellEvents.length > 3 && (
                                    <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>+{cellEvents.length - 3} altri</Box>
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );

    const renderWeekView = () => (
        <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
            <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                {weekDates.map((date, i) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                        <Box key={i} sx={{
                            p: 'var(--md-sys-spacing-3) var(--md-sys-spacing-2)',
                            textAlign: 'center',
                            borderRight: i < 6 ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' : 'none'
                        }}>
                            <Box sx={{
                                fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                                fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--md-sys-typescale-label-large-tracking)',
                                mb: 'var(--md-sys-spacing-1)'
                            }}>
                                {DAYS_SHORT[i]}
                            </Box>
                            <Box sx={{
                                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                color: isToday ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                bgcolor: isToday ? 'var(--md-sys-color-primary)' : 'transparent',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 'var(--md-sys-spacing-7)',
                                height: 'var(--md-sys-spacing-7)'
                            }}>
                                {date.getDate()}
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
            <Box ref={scrollContainerRef}>
                {Array.from({ length: 24 }, (_, hour) => (
                    <Box key={hour}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            {hour.toString().padStart(2, '0')}:00
                        </Box>
                        <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                            {weekDates.map((date, dayIndex) => {
                                const dayEvents = eventi.filter(e => {
                                    const eventDate = new Date(e.data);
                                    return eventDate.toDateString() === date.toDateString() &&
                                           e.oraInizio &&
                                           parseInt(e.oraInizio.split(':')[0]) === hour;
                                });
                                
                                return (
                                    <Box key={dayIndex}>
                                        {dayEvents.map((ev, idx) => (
                                            <ButtonBase
                                                key={ev.id || idx}
                                                onClick={() => setEditingEvent(ev)}
                                                aria-label={ev.titolo}
                                                focusRipple
                                                sx={{
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: 'var(--md-sys-spacing-0_5) var(--md-sys-spacing-2)',
                                                    fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                                    fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                                    borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    position: 'relative',
                                                    background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' :
                                                               ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                               ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                               'var(--md-sys-color-secondary-container)',
                                                    color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' :
                                                           ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                           ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                           'var(--md-sys-color-on-secondary-container)',
                                                    '&:hover::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundColor: 'var(--md-sys-color-on-surface)', opacity: 0.08, pointerEvents: 'none' },
                                                    '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                                                }}
                                            >
                                                <Box>{ev.titolo}</Box>
                                                <Box>{ev.oraInizio} - {ev.oraFine || 'N/A'}</Box>
                                            </ButtonBase>
                                        ))}
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                ))}
            </Box>
        </Stack>
    );

    const renderDayView = () => (
        <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
            <Box sx={{ p: 'var(--md-sys-spacing-8)' }}>
                <Typography variant="h6" sx={{ color: 'var(--md-sys-color-primary)' }}>
                    {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
            </Box>
            <Box ref={scrollContainerRef}>
                {dayEvents.length === 0 ? (
                    <Stack direction="column" alignItems="center" justifyContent="center" sx={{
                        p: 'var(--md-sys-spacing-12)',
                        textAlign: 'center',
                        opacity: 'var(--md-sys-state-opacity-secondary)'
                    }}>
                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
                            color: 'var(--md-sys-color-on-surface-variant)',
                            mb: 'var(--md-sys-spacing-8)'
                        }}>event_busy</Box>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                            Nessun evento per questo giorno
                        </Typography>
                        <Button variant="text" onClick={() => setEditingEvent({})} sx={{ mt: 'var(--md-sys-spacing-4)' }}>
                            Aggiungi Evento
                        </Button>
                    </Stack>
                ) : (
                    <Stack direction="column" sx={{ p: 'var(--md-sys-spacing-8)', gap: 'var(--md-sys-spacing-4)' }}>
                        {dayEvents.map(ev => (
                            <ButtonBase
                                key={ev.id}
                                onClick={() => setEditingEvent(ev)}
                                aria-label={ev.titolo}
                                focusRipple
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    textAlign: 'left',
                                    gap: 'var(--md-sys-spacing-4)',
                                    padding: 'var(--md-sys-spacing-4)',
                                    borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' :
                                               ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                               ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                               'var(--md-sys-color-secondary-container)',
                                    color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' :
                                           ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                           ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                           'var(--md-sys-color-on-secondary-container)',
                                    '&:hover::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundColor: 'var(--md-sys-color-on-surface)', opacity: 0.08, pointerEvents: 'none' },
                                    '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                                }}
                            >
                                <Box sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                                    {ev.oraInizio || 'Tutto il giorno'}
                                </Box>
                                <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                                    <Box sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{ev.titolo}</Box>
                                    {ev.descrizione && <Box sx={{ opacity: 'var(--md-sys-state-opacity-caption)' }}>{ev.descrizione}</Box>}
                                    {ev.location && <Box sx={{ mt: 'var(--md-sys-spacing-4)' }}>📍 {ev.location}</Box>}
                                </Stack>
                            </ButtonBase>
                        ))}
                    </Stack>
                )}
            </Box>
        </Stack>
    );

    const renderAgendaView = () => (
        <Box sx={{ p: 'var(--md-sys-spacing-8)' }}>
            {Object.keys(agendaGroups).length === 0 ? (
                <Stack direction="column" alignItems="center" justifyContent="center" sx={{ p: 'var(--md-sys-spacing-8)', textAlign: 'center', opacity: 'var(--md-sys-state-opacity-secondary)' }}>
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 'var(--md-sys-spacing-8)' }}>event_busy</Box>
                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Nessun evento questo mese</Typography>
                </Stack>
            ) : (
                <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-6)' }}>
                    {Object.entries(agendaGroups).map(([date, evts]) => (
                        <Box key={date} sx={{ bgcolor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 20%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)', p: 'var(--md-sys-spacing-8)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}>
                            <Box sx={{ color: 'var(--md-sys-color-primary)', mb: 'var(--md-sys-spacing-6)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}>
                                {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Box>
                            <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-3)' }}>
                                {evts.map(ev => (
                                    <ButtonBase
                                        key={ev.id}
                                        onClick={() => setEditingEvent(ev)}
                                        aria-label={ev.titolo}
                                        focusRipple
                                        sx={{
                                            display: 'flex',
                                            width: '100%',
                                            textAlign: 'left',
                                            gap: 'var(--md-sys-spacing-4)',
                                            padding: 'var(--md-sys-spacing-4)',
                                            borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: ev.tipo === 'urgente' ? 'var(--md-sys-color-error-container)' :
                                                       ev.tipo === 'scadenza' ? 'var(--md-sys-color-tertiary-container)' :
                                                       ev.tipo === 'riunione' ? 'var(--md-sys-color-primary-container)' :
                                                       'var(--md-sys-color-secondary-container)',
                                            color: ev.tipo === 'urgente' ? 'var(--md-sys-color-on-error-container)' :
                                                   ev.tipo === 'scadenza' ? 'var(--md-sys-color-on-tertiary-container)' :
                                                   ev.tipo === 'riunione' ? 'var(--md-sys-color-on-primary-container)' :
                                                   'var(--md-sys-color-on-secondary-container)',
                                            '&:hover::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundColor: 'var(--md-sys-color-on-surface)', opacity: 0.08, pointerEvents: 'none' },
                                            '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                                        }}
                                    >
                                        <Box sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                                            {ev.oraInizio || 'Tutto il giorno'}
                                        </Box>
                                        <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                                            <Box sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{ev.titolo}</Box>
                                            {ev.descrizione && <Box sx={{ opacity: 'var(--md-sys-state-opacity-caption)' }}>{ev.descrizione}</Box>}
                                        </Stack>
                                    </ButtonBase>
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );

    return (
        <Box
            ref={calendarGridRef}
            onKeyDown={handleCalendarKeyDown}
        >
            {renderHeader()}

            <Stack direction="column" sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
                {viewMode === 'agenda' && renderAgendaView()}
            </Stack>

            {editingEvent && (
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={20} /></Box>}>
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
                </Suspense>
            )}

            {isAiParserOpen && (
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={20} /></Box>}>
                    <AiEventParserModal
                        aiSettings={aiSettings}
                        onClose={() => setIsAiParserOpen(false)}
                        onEventParsed={(eventData: Partial<EventoCalendario>) => {
                            setEventi(prev => [...prev, { ...eventData, id: `evt-${Date.now()}` } as EventoCalendario]);
                            setIsAiParserOpen(false);
                        }}
                    />
                </Suspense>
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
        </Box>
    );
};

export default Calendar;

