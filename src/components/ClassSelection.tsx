
import React, { useState, useMemo } from 'react';
import { Studente, View, Valutazione, ValutazioneCompetenza, TimetableSettings, PeriodoValutazione } from '../types';
import { generateHueFromString } from '../utils/colorUtils';
import { calculatePerformance } from '../utils/evaluationUtils';
import { generateCouncilDataPdf } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { TabGroup } from './M3Components';
import M3ClassCard from './M3ClassCard';
import { M3Dialog } from './M3Dialog';

interface ClassSelectionProps {
    userClasses: string[];
    onSelectClass: (className: string) => void;
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onNavigate: (view: View) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ userClasses, onSelectClass, students, evaluations, competencyEvaluations, settings, onNavigate }) => {
    const [isPrintCenterOpen, setIsPrintCenterOpen] = useState(false);

    // --- LOGIC: Upcoming Tests (Cross-Class) ---
    const upcomingTests = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return evaluations
            .filter(e => {
                const evalDate = new Date(e.data);
                return evalDate >= today;
            })
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .reduce((acc, curr) => {
                const key = `${String(curr.data)}-${String(curr.materia)}-${String(curr.tipo)}`;
                if (!acc.some(i => `${String(i.data)}-${String(i.materia)}-${String(i.tipo)}` === key)) {
                    const student = students.find(s => s.id === curr.studenteId);
                    if (student) {
                        acc.push({ ...curr, className: student.classe });
                    }
                }
                return acc;
            }, [] as (Valutazione & { className: string })[])
            .slice(0, 3); // Take top 3
    }, [evaluations, students]);

    return (
        <div className="page-layout pb-24">
             {/* Header Section */}
             <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-display-medium">Le Mie Classi</h1>
                    <p className="text-body-reading mt-1 opacity-80">Gestione studenti e analisi.</p>
                </div>
            </div>

            {/* --- GLOBAL AGENDA WIDGET --- */}
            {upcomingTests.length > 0 && (
                <section className="animate-in fade-in slide-in-from-top-4">
                    <h2 className="section-header-expressive text-sm !mb-2 text-on-surface-variant uppercase tracking-wider">
                        In Arrivo (Tutte le classi)
                    </h2>
                    <div className="global-agenda-grid">
                        {upcomingTests.map((test, idx) => (
                            <div key={idx} className="agenda-event-card">
                                <div>
                                    <span className="agenda-event-date">{new Date(test.data).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                    <h4 className="agenda-event-title">{test.materia}</h4>
                                    <p className="agenda-event-subtitle truncate max-w-[150px]">{test.argomento || test.tipo}</p>
                                </div>
                                <div className="agenda-event-class">{test.className}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Section 1: Classes Grid (New Widget Style) */}
            <section>
                 <h2 className="section-header-expressive">
                    <span className="material-symbols-outlined text-primary">school</span>
                    Classi Attive
                </h2>
                
                {userClasses.length > 0 ? (
                    <div className="expressive-grid">
                        {userClasses.map((className) => {
                            const classStudents = students.filter(s => s.classe === className);
                            const studentCount = classStudents.length;
                            let insufficientCount = 0;
                            const studentAverages = classStudents.map(s => {
                                const sEvals = evaluations.filter(e => e.studenteId === s.id);
                                const { grade } = calculatePerformance(s.id, 'Complessivo', sEvals);
                                const numGrade = grade ? parseFloat(grade) : null;
                                if (numGrade && numGrade < 6) insufficientCount++;
                                return numGrade;
                            }).filter((v): v is number => v !== null);
                            const classAverage = studentAverages.length > 0 
                                ? (studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(1)
                                : '-';
                            const hue = generateHueFromString(className);
                            const accentColor = `hsl(${hue}, 65%, 50%)`;
                            const dynamicBg = `hsl(${hue}, 60%, 50%, 0.08)`;
                            return (
                                <M3ClassCard
                                    key={className}
                                    className={className}
                                    studentCount={studentCount}
                                    classAverage={classAverage}
                                    accentColor={accentColor}
                                    dynamicBg={dynamicBg}
                                    insufficientCount={insufficientCount}
                                    onClick={() => onSelectClass(className)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">domain_disabled</span>
                        <p className="m3-headline-small text-on-surface-variant">Nessuna classe definita</p>
                        <p className="m3-body-medium text-on-surface-variant mt-2 mb-6">
                            Vai nelle impostazioni per configurare le tue classi e iniziare.
                        </p>
                        <button onClick={() => onNavigate('settings')} className="button button-filled">
                            Vai a Impostazioni
                        </button>
                    </div>
                )}
            </section>

            {/* Section 2: Global Tools */}
            <section>
                 <h2 className="section-header-expressive">
                    <span className="material-symbols-outlined text-secondary">settings_applications</span>
                    Gestione Rapida
                </h2>
                
                <div className="expressive-grid">
                    <button 
                        onClick={() => onNavigate('studenti')} 
                        className="expressive-tool-card variant-secondary"
                    >
                        <span className="material-symbols-outlined tool-icon">group_add</span>
                        <span className="tool-title">Importazione Massiva</span>
                        <span className="tool-subtitle">Carica studenti da CSV</span>
                    </button>

                    <button 
                        onClick={() => setIsPrintCenterOpen(true)} 
                        className="expressive-tool-card variant-primary"
                    >
                        <span className="material-symbols-outlined tool-icon">print</span>
                        <span className="tool-title">Centro Stampe</span>
                        <span className="tool-subtitle">Report PDF multi-classe</span>
                    </button>

                    <button 
                        onClick={() => onNavigate('analytics')} 
                        className="expressive-tool-card variant-tertiary"
                    >
                        <span className="material-symbols-outlined tool-icon">analytics</span>
                        <span className="tool-title">Analytics Hub</span>
                        <span className="tool-subtitle">Dashboard dati avanzata</span>
                    </button>

                    <button 
                        onClick={() => onNavigate('didattica-inclusiva')} 
                        className="expressive-tool-card variant-surface"
                    >
                        <span className="material-symbols-outlined tool-icon text-tertiary">accessibility_new</span>
                        <span className="tool-title">Didattica Inclusiva</span>
                        <span className="tool-subtitle">Gestione PEI/PDP globale</span>
                    </button>
                </div>
            </section>

            {/* INTERNAL MODAL: PRINT CENTER */}
            {isPrintCenterOpen && (
                <PrintCenterModal 
                    userClasses={userClasses}
                    onClose={() => setIsPrintCenterOpen(false)}
                    students={students}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvaluations}
                    settings={settings}
                />
            )}
        </div>
    );
};

// --- Sub-component: Print Center Modal ---
const PrintCenterModal: React.FC<{ 
    userClasses: string[]; 
    onClose: () => void;
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
}> = ({ userClasses, onClose, students, evaluations, competencyEvaluations, settings }) => {
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [periodo, setPeriodo] = useState<PeriodoValutazione>('primo-quadrimestre');
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleClass = (c: string) => {
        setSelectedClasses(prev => prev.includes(c) ? prev.filter(k => k !== c) : [...prev, c]);
    };

    const handlePrintAll = async () => {
        if (selectedClasses.length === 0) return;
        setIsProcessing(true);
        try {
            for (const className of selectedClasses) {
                const classStudents = students.filter(s => s.classe === className);
                const blob = await generateCouncilDataPdf(
                    className,
                    periodo,
                    classStudents,
                    evaluations,
                    competencyEvaluations,
                    settings
                );
                // FIX DEFINITIVO: String() per il periodo nel nome file
                saveAs(blob, `Report_Consiglio_${String(className)}_${String(periodo)}.pdf`);
                // Small delay to allow download initiation
                await new Promise(r => setTimeout(r, 800));
            }
            alert("Download completato.");
        } catch(e) {
            console.error(e);
            alert("Errore durante la stampa.");
        } finally {
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <M3Dialog
            title="Centro Stampe"
            onClose={onClose}
            maxWidth="md"
            buttons={
                <>
                    <button onClick={onClose} className="m3-button-text">Annulla</button>
                    <button onClick={handlePrintAll} disabled={selectedClasses.length === 0 || isProcessing} className="m3-button-filled">
                        {isProcessing ? 'Elaborazione...' : `Genera ${selectedClasses.length} PDF`}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                    <p className="m3-body-medium text-on-surface-variant">Seleziona le classi e il periodo per cui generare il prospetto voti (PDF).</p>
                    
                    <div>
                        <label className="form-label">Periodo</label>
                        <TabGroup
                            tabs={[
                                { id: 'primo-quadrimestre', label: '1Q' },
                                { id: 'secondo-quadrimestre', label: 'Finale' }
                            ]}
                            activeTab={periodo}
                            onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                            variant="secondary"
                        />
                    </div>

                    <div>
                        <label className="form-label">Classi</label>
                        <div className="selection-scroll-container small row-layout">
                            {userClasses.map(c => (
                                <div key={c} className="chip-checkbox">
                                    <input type="checkbox" id={`print-${String(c)}`} checked={selectedClasses.includes(c)} onChange={() => toggleClass(c)} />
                                    <label htmlFor={`print-${String(c)}`} className="chip w-full justify-start">
                                        {selectedClasses.includes(c) && <span className="material-symbols-outlined text-lg">check</span>}
                                        Classe {c}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
        </M3Dialog>
    )
}

export default ClassSelection;
