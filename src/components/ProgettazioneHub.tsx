
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ProgettazioneHubProps, Uda, EventoCalendario, TimetableSettings, AiSettings, Report, Lezione, KnowledgeBaseEntry, Competenza } from '../types';
import AnnualPlanningWizard from './AnnualPlanningWizard';
import SmartImportModal from './SmartImportModal';
import { generateHueFromString } from '../utils/colorUtils';
import { TabGroup } from './M3Components'; // Import TabGroup
import CompetencyManager from './CompetencyManager'; // Import New Component
// Drag & Drop
import { DndContext, useDraggable, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import Tooltip from './Tooltip';


interface ProgettazioneHubExtendedProps extends ProgettazioneHubProps {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveUda: (uda: Uda) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveReport: (report: Report) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    initialAction?: string; 
    knowledgeBase: KnowledgeBaseEntry[];
    onUpdateCompetencies?: (competenze: Competenza[]) => void; // New prop for updating settings
}

// --- UDA DETAIL MODAL ---
const UdaDetailModal: React.FC<{ uda: Uda; onClose: () => void; onEdit: () => void }> = ({ uda, onClose, onEdit }) => {
    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-2xl">
                <div className="dialog-header border-b border-outline-variant">
                    <div>
                        <span className="m3-label-small uppercase tracking-wide text-primary">Dettaglio Progetto</span>
                        <h2 className="m3-headline-small">{uda.title}</h2>
                    </div>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="dialog-content space-y-6 pt-4">
                    {/* Metadata Chips */}
                    <div className="flex flex-wrap gap-2">
                        <span className="chip bg-surface-container-high border-none">
                            <span className="material-symbols-outlined text-primary text-base mr-1">school</span>
                            Classe {uda.classe}
                        </span>
                        <span className="chip bg-surface-container-high border-none">
                            <span className="material-symbols-outlined text-secondary text-base mr-1">menu_book</span>
                            {uda.materia}
                        </span>
                        <span className="chip bg-surface-container-high border-none">
                            <span className="material-symbols-outlined text-tertiary text-base mr-1">event</span>
                            {new Date(uda.startDate!).toLocaleDateString()} - {new Date(uda.endDate!).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="m3-title-medium mb-2">Introduzione</h3>
                        <p className="m3-body-medium text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                            {uda.introduction}
                        </p>
                    </div>

                    {/* Phases Timeline */}
                    <div>
                        <h3 className="m3-title-medium mb-2">Fasi di Lavoro</h3>
                        <div className="relative border-l-2 border-primary/30 ml-3 space-y-6 py-2">
                            {uda.phases.map((phase, idx) => (
                                <div key={phase.id} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface"></div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="m3-label-large text-primary">{phase.title}</h4>
                                        <span className="text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">{phase.duration}h</span>
                                    </div>
                                    <p className="m3-body-small text-on-surface mt-1 font-medium">{phase.description}</p>
                                    <p className="m3-body-small text-on-surface-variant mt-1 italic">{phase.activities}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-surface-container rounded-xl">
                            <h4 className="m3-label-large mb-1 flex items-center gap-1 text-secondary">
                                <span className="material-symbols-outlined text-base">inventory_2</span>
                                Prodotto Finale
                            </h4>
                            <p className="m3-body-small">{uda.finalProduct}</p>
                        </div>
                        <div className="p-3 bg-surface-container rounded-xl">
                            <h4 className="m3-label-large mb-1 flex items-center gap-1 text-secondary">
                                <span className="material-symbols-outlined text-base">fact_check</span>
                                Valutazione
                            </h4>
                            <p className="m3-body-small">{uda.evaluation}</p>
                        </div>
                    </div>
                </div>

                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-text">Chiudi</button>
                    <button onClick={onEdit} className="button button-filled">
                        <span className="material-symbols-outlined mr-2">edit</span>
                        Modifica nel Planner
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- NEW GANTT TIMELINE 2.0 (DYNAMIC REAL-TIME) ---
interface TimelineProps {
    udas: Uda[];
    events: EventoCalendario[];
    onUdaClick: (uda: Uda) => void;
    startDate: string;
    endDate: string;
}

const TimelineView: React.FC<TimelineProps> = ({ udas, events, onUdaClick, startDate, endDate }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Fix test ReferenceError: showSnackbar is not defined
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [lastMove, setLastMove] = useState<{ udaId: string; prevStart: string; prevEnd: string } | null>(null);

    // Calculate Timeline Metrics with safe fallbacks when startDate/endDate are invalid
    const inputStart = useMemo(() => new Date(startDate as string), [startDate]);
    const inputEnd = useMemo(() => new Date(endDate as string), [endDate]);

    const computedStart = useMemo(() => {
        const candidates: number[] = [];
        udas.forEach(u => { if (u.startDate) { const d = new Date(u.startDate).getTime(); if (!isNaN(d)) candidates.push(d); } });
        events.forEach(e => { if (e.data) { const d = new Date(e.data).getTime(); if (!isNaN(d)) candidates.push(d); } });
        if (candidates.length === 0) {
            const d = new Date(); d.setDate(d.getDate() - 30); return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        return new Date(Math.min(...candidates));
    }, [udas, events]);

    const computedEnd = useMemo(() => {
        const candidates: number[] = [];
        udas.forEach(u => { if (u.endDate) { const d = new Date(u.endDate).getTime(); if (!isNaN(d)) candidates.push(d); } });
        events.forEach(e => { if (e.data) { const d = new Date(e.data).getTime(); if (!isNaN(d)) candidates.push(d); } });
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
    const getPositionPercentage = (dateStr?: string): number => {
        if (!dateStr) return -100;
        const d = new Date(dateStr);
        const diff = d.getTime() - start.getTime();
        const percentage = (diff / totalDurationMs) * 100;
        return percentage;
    };

    // Process UDAs for lanes
    const timelineData = useMemo(() => {
        const validUdas = udas
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
                    color: `hsl(${hue}, 40%, 90%)`,
                    borderColor: `hsl(${hue}, 60%, 40%)`,
                    textColor: `hsl(${hue}, 80%, 20%)`
                };
            })
            .filter(u => u.startPos < 100 && (u.startPos + u.width) > 0) // Filter out-of-range
            .sort((a, b) => a.startPos - b.startPos); // Sort by start date

        // Lane assignment logic (simple greedy)
        const lanes: typeof validUdas[] = [];
        
        validUdas.forEach(uda => {
            let placed = false;
            for (let lane of lanes) {
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
    }, [udas, getPositionPercentage]);

    // Fix: Use local time instead of UTC to avoid "previous day" shift on timeline
    const todayLocal = new Date();
    // Create a date string in YYYY-MM-DD format using local time
    const todayLocalStr = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;
    const todayPosition = getPositionPercentage(todayLocalStr);

    const isEmpty = timelineData.length === 0 && events.length === 0;
    
    // Width ensuring full month display
    const minWidth = months.length * 80;

    // Draggable Bar component for Gantt (accessible + keyboard shortcuts)
    const GanttDraggableBar: React.FC<{ uda: any; minWidth: number; onClick: () => void }> = ({ uda, minWidth, onClick }) => {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: uda.id });

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const deltaDays = e.key === 'ArrowLeft' ? -1 : 1;
                const durationMs = new Date(uda.endDate).getTime() - new Date(uda.startDate).getTime();
                const newStartMs = new Date(uda.startDate).getTime() + (deltaDays * 86400000);
                const newStartDate = new Date(newStartMs);
                const newEndDate = new Date(newStartMs + durationMs);
                onSaveUda({ ...uda, startDate: newStartDate.toISOString().split('T')[0], endDate: newEndDate.toISOString().split('T')[0] });
            }
        };

        return (
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                role="button"
                tabIndex={0}
                aria-label={`Sposta UDA ${uda.title}`}
                onKeyDown={handleKeyDown}
                onClick={onClick}
                className={`gantt-bar ${isDragging ? 'dragging' : ''}`}
                style={{
                    left: `${uda.startPos}%`,
                    width: `${uda.width}%`,
                    backgroundColor: uda.color,
                    borderColor: uda.borderColor,
                    color: uda.textColor,
                    transform: transform ? `translateX(${transform.x}px)` : undefined,
                    transition: isDragging ? 'none' : 'transform 0.12s linear',
                    cursor: 'grab',
                }}
                title={`${uda.title} (${new Date(uda.startDate!).toLocaleDateString()} - ${new Date(uda.endDate!).toLocaleDateString()})`}
            >
                <div className="gantt-bar-inner truncate" style={{ padding: '6px 8px' }}>{uda.title}</div>
            </div>
        );
    };

    // Auto-scroll to today
    useEffect(() => {
        if (todayPosition >= 0 && todayPosition <= 100 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Center the view on the today line: Position in pixels - half screen
            const targetPos = (minWidth * (todayPosition / 100)) - (container.clientWidth / 2);
            container.scrollTo({ left: Math.max(0, targetPos), behavior: 'smooth' });
        }
    }, [todayPosition, minWidth]);

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                <h2 className="m3-title-medium flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">calendar_view_week</span>
                    Timeline Didattica
                </h2>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container border border-primary"></span> UDA</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-error">flag</span> Scadenza</span>
                </div>
            </div>

            <div className="gantt-body" ref={scrollContainerRef}>
                {/* 1. Background Grid (Dynamic) */}
                <div className="gantt-grid" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)`, minWidth: `${minWidth}px` }}>
                    {months.map((m, i) => (
                        <div key={i} className="gantt-month-col">
                            <span className="gantt-month-label">{m.label} <span className="text-[9px] opacity-70 font-normal">{m.year}</span></span>
                        </div>
                    ))}
                </div>

                {/* Empty State Overlay */}
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="text-center p-4 bg-surface/80 backdrop-blur-sm rounded-xl border border-dashed border-outline-variant">
                            <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">edit_calendar</span>
                            <p className="text-sm font-medium text-on-surface">Nessuna pianificazione.</p>
                            <p className="text-xs text-on-surface-variant">Usa il Wizard Annuale o crea un'UDA.</p>
                        </div>
                    </div>
                )}

                {/* 2. Today Line (Wrapped for correct width context) */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, minWidth: `${minWidth}px`, zIndex: 15, pointerEvents: 'none' }}>
                    {todayPosition >= 0 && todayPosition <= 100 && (
                        <div 
                            className="gantt-today-indicator" 
                            style={{ left: `${todayPosition}%` }}
                        >
                            <div className="gantt-today-label">OGGI</div>
                        </div>
                    )}
                </div>

                {/* 3. Content Layers */}
                <div className="gantt-tracks-layer" style={{ minWidth: `${minWidth}px` }}>
                    {/* Top Row: Events */}
                    <div className="gantt-events-row">
                        {events.filter(e => e.tipo === 'scadenza' || e.tipo === 'consiglio').map(evt => {
                            const pos = getPositionPercentage(evt.data);
                            if (pos < 0 || pos > 100) return null;
                            return (
                                <div 
                                    key={evt.id}
                                    className="gantt-event-marker group"
                                    style={{ left: `${pos}%` }}
                                    title={`${evt.titolo} (${new Date(evt.data).toLocaleDateString()})`}
                                >
                                    <span className="material-symbols-outlined gantt-event-icon">
                                        {evt.tipo === 'scadenza' ? 'flag' : 'gavel'}
                                    </span>
                                    <div className="gantt-event-line"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Swimlanes for UDAs */}
                    <DndContext
                        onDragStart={(e) => {
                            const id = String(e.active.id);
                            setDraggingUdaId(id);
                            setPreviewMessage(null);
                        }}
                        onDragMove={(e: DragMoveEvent) => {
                            const { active, delta } = e;
                            if (!active) return;
                            const udaId = String(active.id);
                            const original = udas.find(u => u.id === udaId);
                            if (!original || !original.startDate || !original.endDate) return;
                            const deltaX = delta ? delta.x : 0;
                            const percentShift = (deltaX / minWidth) * 100;
                            const origStartPos = Math.max(0, getPositionPercentage(original.startDate));
                            const newStartPos = Math.max(0, Math.min(100 - Math.max(0.5, (getPositionPercentage(original.endDate) - getPositionPercentage(original.startDate))), origStartPos + percentShift));
                            const durationMs = new Date(original.endDate).getTime() - new Date(original.startDate).getTime();
                            const newStartMs = start.getTime() + (newStartPos / 100) * totalDurationMs;
                            const newStartDate = new Date(newStartMs);
                            const newEndDate = new Date(newStartMs + durationMs);
                            setPreviewMessage(`${original.title}: ${newStartDate.toLocaleDateString()} → ${newEndDate.toLocaleDateString()}`);
                        }}
                        onDragEnd={(e: DragEndEvent) => {
                            const { active, delta } = e;
                            setDraggingUdaId(null);
                            setPreviewMessage(null);
                            if (!active) return;
                            const udaId = String(active.id);
                            const original = udas.find(u => u.id === udaId);
                            if (!original || !original.startDate || !original.endDate) return;
                            const deltaX = delta ? delta.x : 0;
                            const percentShift = (deltaX / minWidth) * 100;
                            const origStartPos = Math.max(0, getPositionPercentage(original.startDate));
                            const newStartPos = Math.max(0, Math.min(100 - Math.max(0.5, (getPositionPercentage(original.endDate) - getPositionPercentage(original.startDate))), origStartPos + percentShift));
                            const durationMs = new Date(original.endDate).getTime() - new Date(original.startDate).getTime();
                            const newStartMs = start.getTime() + (newStartPos / 100) * totalDurationMs;
                            const newStartDate = new Date(newStartMs);
                            const newEndDate = new Date(newStartMs + durationMs);
                            // Persist change and offer undo
                            onSaveUda({ ...original, startDate: newStartDate.toISOString().split('T')[0], endDate: newEndDate.toISOString().split('T')[0] });
                            setLastMove({ udaId: original.id, prevStart: original.startDate, prevEnd: original.endDate });
                            setShowSnackbar(true);
                            setTimeout(() => setShowSnackbar(false), 6000);
                        }}
                    >
                        {timelineData.map((lane, laneIndex) => (
                            <div key={laneIndex} className="gantt-lane">
                                {lane.map(uda => (
                                    <Tooltip key={uda.id} label={`${uda.title}\n${new Date(uda.startDate!).toLocaleDateString()} - ${new Date(uda.endDate!).toLocaleDateString()}`} position="top">
                                        <GanttDraggableBar key={uda.id} uda={uda} minWidth={minWidth} onClick={() => onUdaClick(uda)} />
                                    </Tooltip>
                                ))}
                            </div>
                        ))}
                    </DndContext>

                    {/* Snackbar preview / undo */}
                    {showSnackbar && lastMove && (
                        <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 3200 }}>
                            <div className="m3-card p-4 rounded-xl shadow-lg bg-surface-container-high border border-outline-variant flex items-center gap-4">
                                <div className="flex-1">UDA spostata. <button className="text-primary font-bold underline ml-2" onClick={() => {
                                    const original = udas.find(u => u.id === lastMove.udaId);
                                    if (original) {
                                        onSaveUda({ ...original, startDate: lastMove.prevStart, endDate: lastMove.prevEnd });
                                        setShowSnackbar(false);
                                        setLastMove(null);
                                    }
                                }}>Annulla</button></div>
                                <button onClick={() => setShowSnackbar(false)} aria-label="Chiudi" className="icon-button"><span className="material-symbols-outlined">close</span></button>
                            </div>
                        </div>
                    )}

                    {/* Drag Preview Bubble */}
                    {previewMessage && (
                        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 8, zIndex: 3200 }}>
                            <div className="px-3 py-1 rounded-lg bg-surface/92 text-on-surface border border-outline-variant text-sm shadow">{previewMessage}</div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const ProgettazioneHub: React.FC<ProgettazioneHubExtendedProps> = ({ onNavigate, udas, events, settings, aiSettings, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, initialAction, knowledgeBase, students, pianiInclusione, onUpdateCompetencies }) => {
    const [isPlanningWizardOpen, setIsPlanningWizardOpen] = useState(false);
    const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);
    const [selectedUda, setSelectedUda] = useState<Uda | null>(null);
    
    // State for Main Tabs
    const [activeTab, setActiveTab] = useState<'dashboard' | 'frameworks'>('dashboard');

    // Dragging / feedback state
    const [draggingUdaId, setDraggingUdaId] = useState<string | null>(null);
    const [previewMessage, setPreviewMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [lastMove, setLastMove] = useState<{ udaId: string; prevStart: string; prevEnd: string } | null>(null);


    useEffect(() => {
        if (initialAction === 'annual-planning') {
            setIsPlanningWizardOpen(true);
        }
    }, [initialAction]);
    
    const handleUpdateCompetencies = (newCompetenze: Competenza[]) => {
        if (onUpdateCompetencies) {
            onUpdateCompetencies(newCompetenze);
        } else {
            console.warn("onUpdateCompetencies not provided to ProgettazioneHub");
        }
    };

    return (
        <div className="page-layout pb-24 max-w-6xl mx-auto w-full px-4 md:px-0">
            
            {/* Header */}
            <div className="text-center py-4 md:py-8">
                <h1 className="m3-display-small font-bold text-primary mb-2">Progettazione</h1>
                <p className="m3-body-large text-on-surface-variant max-w-2xl mx-auto">
                    Dall'ispirazione alla pianificazione annuale. Gestisci i tuoi materiali, crea progetti e organizza le lezioni in un unico hub.
                </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="mb-6">
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as any)}
                    variant="primary"
                    tabs={[
                        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                        { id: 'frameworks', label: 'Frameworks & Competenze', icon: 'model_training' },
                    ]}
                />
            </div>

            {activeTab === 'dashboard' ? (
                <>
                    {/* 1. HERO ACTION: WIZARD */}
                    <div className="hero-card-interactive bg-primary-container text-on-primary-container mb-6" onClick={() => setIsPlanningWizardOpen(true)}>
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-on-primary-container/10 rounded-2xl">
                                <span className="material-symbols-outlined text-4xl">calendar_month</span>
                            </div>
                            <span className="material-symbols-outlined text-2xl opacity-50">arrow_outward</span>
                        </div>
                        <div className="mt-4">
                            <h2 className="m3-headline-small font-bold">Wizard Annuale</h2>
                            <p className="m3-body-medium opacity-90 mt-1 max-w-2xl">
                                Pianifica l'intero anno scolastico. Definisci UDA, scadenze e monte ore con il supporto dell'AI.
                            </p>
                        </div>
                    </div>

                    {/* 2. TIMELINE (GANTT 2.0 DYNAMIC) */}
                    <TimelineView 
                        udas={udas} 
                        events={events} 
                        onUdaClick={(uda) => setSelectedUda(uda)}
                        startDate={settings.activityStartDate}
                        endDate={settings.activityEndDate}
                    />

                    {/* 3. BENTO GRID */}
                    <div className="expressive-grid">
                        
                        {/* Planner UDA */}
                        <div 
                            onClick={() => onNavigate('uda')} 
                            className="expressive-card theme-secondary col-span-2 md:col-span-2 relative overflow-hidden group"
                        >
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="expressive-card-icon-container">
                                    <span className="material-symbols-outlined">assignment</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Planner UDA</h3>
                                    <p className="m3-body-medium opacity-90">
                                        Gestisci le Unità di Apprendimento, le fasi di lavoro e le competenze target.
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined expressive-card-arrow">arrow_forward</span>
                        </div>

                        {/* Studio AI */}
                        <div 
                            onClick={() => onNavigate('studio')} 
                            className="expressive-card theme-tertiary col-span-2 md:col-span-1 group"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="expressive-card-icon-container">
                                    <span className="material-symbols-outlined">auto_fix_high</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Studio AI</h3>
                                    <p className="m3-body-medium opacity-90">
                                        Genera quiz, riassunti e materiali dai tuoi documenti.
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined expressive-card-arrow">arrow_forward</span>
                        </div>

                        {/* Import & Refactor (NEW) */}
                        <div 
                            onClick={() => setIsSmartImportOpen(true)} 
                            className="expressive-card theme-surface col-span-1 group border-primary/50 border-dashed"
                        >
                            <div className="expressive-card-icon-container !bg-primary-container/50 !text-primary">
                                <span className="material-symbols-outlined">transform</span>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Importa & Ristruttura</h3>
                                <p className="m3-body-small text-on-surface-variant">
                                    Converti vecchi file in documenti standard.
                                </p>
                            </div>
                        </div>

                        {/* Knowledge Base */}
                        <div 
                            onClick={() => onNavigate('knowledge-base')} 
                            className="expressive-card theme-surface col-span-1 group"
                        >
                            <div className="expressive-card-icon-container">
                                <span className="material-symbols-outlined">folder_open</span>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Knowledge Base</h3>
                                <p className="m3-body-small text-on-surface-variant">
                                    Archivio documenti.
                                </p>
                            </div>
                        </div>

                        {/* Lezioni */}
                        <div 
                            onClick={() => onNavigate('lessons')} 
                            className="expressive-card theme-surface col-span-1 group"
                        >
                            <div className="expressive-card-icon-container">
                                <span className="material-symbols-outlined">history_edu</span>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Lezioni</h3>
                                <p className="m3-body-small text-on-surface-variant">
                                    Piani di lezione.
                                </p>
                            </div>
                        </div>

                        {/* Rubriche */}
                        <div onClick={() => onNavigate('rubriche')} className="expressive-card theme-surface col-span-1 group">
                            <div className="expressive-card-icon-container">
                                <span className="material-symbols-outlined">schema</span>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Rubriche</h3>
                                <p className="m3-body-small text-on-surface-variant">Griglie valutazione.</p>
                            </div>
                        </div>

                        {/* Report */}
                        <div onClick={() => onNavigate('reportistica')} className="expressive-card theme-surface col-span-1 group">
                            <div className="expressive-card-icon-container">
                                <span className="material-symbols-outlined">print</span>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Report</h3>
                                <p className="m3-body-small text-on-surface-variant">Stampe & PDF.</p>
                            </div>
                        </div>

                    </div>
                </>
            ) : (
                /* COMPETENCY MANAGER */
                <CompetencyManager 
                    competenze={settings.competenze} 
                    onUpdateCompetencies={handleUpdateCompetencies} 
                />
            )}

            {isPlanningWizardOpen && (
                <AnnualPlanningWizard 
                    onClose={() => setIsPlanningWizardOpen(false)}
                    userClasses={settings.classi}
                    settings={settings}
                    aiSettings={aiSettings}
                    udas={udas || []}
                    onSaveUda={onSaveUda}
                    onAddLessons={onAddLessons}
                    onSaveReport={onSaveReport}
                    onSaveEvent={onSaveEvent}
                    knowledgeBase={knowledgeBase || []}
                    students={students}
                    pianiInclusione={pianiInclusione}
                />
            )}

            {isSmartImportOpen && (
                <SmartImportModal
                    onClose={() => setIsSmartImportOpen(false)}
                    aiSettings={aiSettings}
                />
            )}

            {selectedUda && (
                <UdaDetailModal 
                    uda={selectedUda}
                    onClose={() => setSelectedUda(null)}
                    onEdit={() => {
                        setSelectedUda(null);
                        onNavigate('uda'); // Navigates to planner, user finds it there
                    }}
                />
            )}
        </div>
    );
};

export default ProgettazioneHub;
