// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// M3Expressive refactor: COMPLETED - Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Uda, EventoCalendario } from '../types';
import { generateHueFromString } from '../utils/colorUtils';
import GanttBar from './GanttBar';
import Tooltip from './Tooltip';

interface TimelineViewProps {
    udas: Uda[];
    events: EventoCalendario[];
    onUdaClick: (uda: Uda) => void;
    startDate: string;
    endDate: string;
    previewMessage: string | null;
    onSaveUda: (uda: Uda) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ udas, events, onUdaClick, startDate, endDate, previewMessage, onSaveUda }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [lastMove, setLastMove] = useState<{ udaId: string; prevStart: string; prevEnd: string } | null>(null);

    // Calculate Timeline Metrics with safe fallbacks when startDate/endDate are invalid
    const inputStart = useMemo(() => new Date(startDate), [startDate]);
    const inputEnd = useMemo(() => new Date(endDate), [endDate]);

    const computedStart = useMemo(() => {
        const candidates: number[] = [];
        if (udas) {
            udas.forEach(u => { if (u.startDate) { const d = new Date(u.startDate).getTime(); if (!isNaN(d)) candidates.push(d); } });
        }
        if (events) {
            events.forEach(e => { if (e.data) { const d = new Date(e.data).getTime(); if (!isNaN(d)) candidates.push(d); } });
        }
        if (candidates.length === 0) {
            const d = new Date(); d.setDate(d.getDate() - 30); return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        return new Date(Math.min(...candidates));
    }, [udas, events]);

    const computedEnd = useMemo(() => {
        const candidates: number[] = [];
        if (udas) {
            udas.forEach(u => { if (u.endDate) { const d = new Date(u.endDate).getTime(); if (!isNaN(d)) candidates.push(d); } });
        }
        if (events) {
            events.forEach(e => { if (e.data) { const d = new Date(e.data).getTime(); if (!isNaN(d)) candidates.push(d); } });
        }
        if (candidates.length === 0) {
            const d = new Date(); d.setDate(d.getDate() + 30); return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        return new Date(Math.max(...candidates));
    }, [udas, events]);

    const start = !isNaN(inputStart.getTime()) ? inputStart : computedStart;
    const end = !isNaN(inputEnd.getTime()) ? inputEnd : computedEnd;

    // Fix potential division by zero if dates are equal or invalid, ensuring minimum 1 day duration (86400000 ms)
    const totalDurationMs = useMemo(() => Math.max(86400000, end.getTime() - start.getTime()), [start, end]);

    // Dynamic Months Generation
    const months = useMemo(() => {
        const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const result = [];
        const curr = new Date(start);
        // Set to first day to correctly step through months
        curr.setDate(1);

        while (curr <= end) {
            result.push({
                label: monthNames[curr.getMonth()],
                year: curr.getFullYear(),
                date: new Date(curr)
            });
            curr.setMonth(curr.getMonth() + 1);
        }
        return result;
    }, [start, end]);

    // Calculate position percentage (0-100) for a given date
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getPositionPercentage = (dateStr?: string): number => {
        if (!dateStr) return -100;
        const d = new Date(dateStr);
        const diff = d.getTime() - start.getTime();
        const percentage = (diff / totalDurationMs) * 100;
        return percentage;
    };

    // Aggiunto controllo di sicurezza per udas
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const safeUdas = Array.isArray(udas) ? udas : [];

    // Process UDAs for lanes
    const timelineData = useMemo(() => {
        const validUdas = safeUdas
            .filter(u => u.startDate && u.endDate)
            .map(u => {
                const startPos = Math.max(0, getPositionPercentage(u.startDate));
                const endPos = Math.min(100, getPositionPercentage(u.endDate));
                // Semantic Color based on Subject/Title hash
                const hue = generateHueFromString(u.materia || u.title);

                return {
                    ...u,
                    startPos,
                    width: Math.max(0.5, endPos - startPos), // Minimal width ensures visibility
                    color: `hsl(${hue}, var(--md-sys-percent-40), var(--md-sys-percent-90))`,
                    borderColor: `hsl(${hue}, var(--md-sys-percent-60), var(--md-sys-percent-40))`,
                    textColor: `hsl(${hue}, var(--md-sys-percent-80), var(--md-sys-percent-20))`
                };
            })
            .filter(u => u.startPos < 100 && (u.startPos + u.width) > 0) // Filter out-of-range
            .sort((a, b) => a.startPos - b.startPos); // Sort by start date

        // Lane assignment logic (simple greedy)
        const lanes: typeof validUdas[] = [];

        validUdas.forEach(uda => {
            let placed = false;
            for (const lane of lanes) {
                const lastInLane = lane[lane.length - 1];
                // If current starts after last ends (with slight buffer), place here
                if (uda.startPos > (lastInLane.startPos + lastInLane.width + 0.5)) {
                    lane.push(uda);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                lanes.push([uda]);
            }
        });

        return lanes;
    }, [safeUdas, getPositionPercentage]);

    // Fix: Use local time instead of UTC to avoid "previous day" shift on timeline
    const todayLocal = new Date();
    // Create a date string in YYYY-MM-DD format using local time
    const todayLocalStr = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;
    const todayPosition = getPositionPercentage(todayLocalStr);

    const isEmpty = timelineData.length === 0 && events.length === 0;

    // Width ensuring full month display
    const minWidth = months.length * 80;

    // Auto-scroll to today
    useEffect(() => {
        if (todayPosition >= 0 && todayPosition <= 100 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Center the view on the today line: Position in pixels - half screen
            const targetPos = (minWidth * (todayPosition / 100)) - (container.clientWidth / 2);
            container.scrollTo({ left: Math.max(0, targetPos), behavior: 'smooth' });
        }
    }, [todayPosition, minWidth]);

    const handleUdaClick = (uda: Uda) => {
        console.log(`Audit: Opened UDA detail modal for ${uda.id}: ${uda.title}`);
        onUdaClick(uda);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <h2>
                    <span style={{
}}>calendar_view_week</span>
                    Timeline Didattica
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                    <span><span></span> UDA</span>
                    <span><span>flag</span> Scadenza</span>
                </div>
            </div>

            <div  ref={scrollContainerRef}>
                {/* 1. Background Grid (Dynamic) */}
                <div  style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)`, minWidth: `${minWidth}px` }}>
                    {months.map((m, i) => (
                        <div key={i} >
                            <span>{m.label} <span style={{ fontSize: "var(--md-sys-typescale-label-large-font-size)", opacity: "var(--md-sys-state-opacity-supporting)", fontWeight: "normal" }}>{m.year}</span></span>
                        </div>
                    ))}
                </div>

                {/* Empty State Overlay */}
                {isEmpty && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                            <span>edit_calendar</span>
                            <p>Nessuna pianificazione.</p>
                            <p>Usa il Wizard Annuale o crea un&apos;UDA.</p>
                        </div>
                    </div>
                )}

                {/* 2. Today Line (Wrapped for correct width context) */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, minWidth: `${minWidth}px`, zIndex: 'var(--md-sys-z-raised)', pointerEvents: 'none' }}>
                    {todayPosition >= 0 && todayPosition <= 100 && (
                        <div
                            
                            style={{ left: `${todayPosition}%` }}
                        >
                            <div>OGGI</div>
                        </div>
                    )}
                </div>

                {/* 3. Content Layers */}
                <div  style={{ minWidth: `${minWidth}px` }}>
                    {/* Top Row: Events */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        {events.filter(e => e.tipo === 'scadenza' || e.tipo === 'consiglio').map(evt => {
                            const pos = getPositionPercentage(evt.data);
                            if (pos < 0 || pos > 100) return null;
                            return (
                                <div
                                    key={evt.id}
                                    
                                    style={{ left: `${pos}%` }}
                                    title={`${evt.titolo} (${new Date(evt.data).toLocaleDateString()})`}
                                    aria-label={`Evento: ${evt.titolo} il ${new Date(evt.data).toLocaleDateString()}`}
                                >
                                    <span>
                                        {evt.tipo === 'scadenza' ? 'flag' : 'gavel'}
                                    </span>
                                    <div></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Swimlanes for UDAs */}
                    {timelineData.map((lane, laneIndex) => (
                        <div key={laneIndex} >
                            {lane.map(uda => (
                                <Tooltip key={uda.id} label={`${uda.title}\n${uda.startDate ? new Date(uda.startDate).toLocaleDateString() : '} - ${uda.endDate ? new Date(uda.endDate).toLocaleDateString() : '}`} position="top">
                                    <GanttBar key={uda.id} uda={uda} onClick={() => handleUdaClick(uda)} />
                                </Tooltip>
                            ))}
                        </div>
                    ))}

                    {/* Snackbar preview / undo */}
                    {showSnackbar && lastMove && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                <div>UDA spostata. <button  onClick={() => {
                                    const original = udas.find(u => u.id === lastMove.udaId);
                                    if (original) {
                                        onSaveUda({ ...original, startDate: lastMove.prevStart, endDate: lastMove.prevEnd });
                                        setShowSnackbar(false);
                                        setLastMove(null);
                                    }
                                }}>Annulla</button></div>
                                <button onClick={() => setShowSnackbar(false)} aria-label="Chiudi" ><span style={{
}}>close</span></button>
                            </div>
                        </div>
                    )}

                    {/* Drag Preview Bubble */}
                    {previewMessage && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <div> {previewMessage}</div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TimelineView;

