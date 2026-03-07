// MD3 Compliant

import React, { useState, useMemo } from 'react';
import { View, Valutazione, Studente, ValutazioneCompetenza, TimetableSettings, PeriodoValutazione } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { generateCouncilDataPdf } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, SectionHeader, TabGroup, EmptyState, M3ExpressiveCard as Card } from './ui';
import {DialogContent, DialogActions, Button } from '@mui/material';
import { useStudentStore } from '../stores/useStudentStore';
import { useSettingsStore } from '../stores/useSettingsStore';
interface ClassSelectionProps {
    onSelectClass: (className: string) => void;
    onNavigate: (view: View) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ onSelectClass, onNavigate }) => {
  const students = useStudentStore(state => state.students);
    const evaluations = useStudentStore(state => state.evaluations);
    const competencyEvaluations = useStudentStore(state => state.competencyEvals);
    const settings = useSettingsStore(state => state.settings);
    const userClasses = settings.classi || [];

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
             {/* Header Section */}
            <div style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
                <h1 style={{ 
                    color: 'var(--md-sys-color-on-surface)',
                    fontWeight: 'var(--md-sys-typescale-weight-bold)',
                    fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
                    marginBottom: 'var(--md-sys-spacing-2)'
                }}>
                    Le Mie Classi
                </h1>
                <p style={{ 
                    color: 'var(--md-sys-color-on-surface)',
                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                    lineHeight: '1.5'
                }}>
                    Gestione studenti e analisi.
                </p>
            </div>

            {/* --- GLOBAL AGENDA WIDGET --- */}
            {upcomingTests.length > 0 && (
                <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
                    <h2 style={{ 
                        color: 'var(--md-sys-color-on-surface)',
                        fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                        fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--md-sys-typescale-title-medium-tracking)',
                        marginBottom: 'var(--md-sys-spacing-4)'
                    }}>
                        In Arrivo (Tutte le classi)
                    </h2>
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-3)'
                    }}>
                        {upcomingTests.map((test, idx) => (
                            <div 
                                key={idx}
                                style={{
                                    padding: 'var(--md-sys-spacing-4)',
                                    borderRadius: 'var(--md-sys-spacing-3)',
                                    background: 'var(--md-sys-color-surface-container)',
                                    borderLeft: 'var(--md-sys-spacing-1) solid var(--md-sys-color-tertiary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <span style={{
                                        color: 'var(--md-sys-color-tertiary)',
                                        fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                        textTransform: 'uppercase',
                                        letterSpacing: 'var(--md-sys-typescale-label-small-tracking)'
                                    }}>
                                        {new Date(test.data).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                    <h4 style={{
                                        color: 'var(--md-sys-color-on-surface)',
                                        fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                        marginTop: 'var(--md-sys-spacing-1)',
                                        marginBottom: 'var(--md-sys-spacing-1)'
                                    }}>
                                        {test.materia}
                                    </h4>
                                    <p style={{
                                        color: 'var(--md-sys-color-on-surface-variant)',
                                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {test.argomento || test.tipo}
                                    </p>
                                </div>
                                <div style={{
                                    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                    borderRadius: 'var(--md-sys-spacing-2)',
                                    background: 'var(--md-sys-color-primary-container)',
                                    color: 'var(--md-sys-color-on-primary-container)',
                                    fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-weight-semibold)'
                                }}>
                                    {test.className}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Section 1: Classes Grid (New Widget Style) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                 <SectionHeader 
                    title="Classi Attive" 
                    icon="school"
                />
                
                {userClasses.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        {userClasses.map((className) => {
                            const classStudents = students.filter(s => s.classe === className);
                            const studentCount = classStudents.length;
                            const studentAverages = classStudents.map(s => {
                                const sEvals = evaluations.filter(e => e.studenteId === s.id);
                                const { grade } = calculatePerformance(s.id, 'Complessivo', sEvals);
                                const numGrade = grade ? parseFloat(grade) : null;
                                return numGrade;
                            }).filter((v): v is number => v !== null);
                            const classAverage = studentAverages.length > 0 
                                ? (studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(1)
                                : '-';
                            return (
                                <Card
                                    key={className}
                                    icon="groups"
                                    title={className}
                                    description={`${studentCount} studenti | Media: ${classAverage}`}
                                    color="primary"
                                    onClick={() => onSelectClass(className)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon="school"
                        title="Nessuna classe configurata"
                        description="Configura le tue classi nelle impostazioni per iniziare a gestire studenti e valutazioni."
                        actionLabel="Vai a Impostazioni"
                        onAction={() => onNavigate('settings')}
                    />
                )}
            </section>

            {/* Section 2: Global Tools */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                 <SectionHeader 
                    title="Gestione Rapida" 
                    icon="settings_applications"
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <button 
                        onClick={() => onNavigate('studenti')} 
                        
                    >
                        <span>group_add</span>
                        <span>Importazione Massiva</span>
                        <span>Carica studenti da CSV</span>
                    </button>

                    <button 
                        onClick={() => setIsPrintCenterOpen(true)} 
                        
                    >
                        <span>print</span>
                        <span>Centro Stampe</span>
                        <span>Report PDF multi-classe</span>
                    </button>

                    <button 
                        onClick={() => onNavigate('analytics')} 
                        
                    >
                        <span>analytics</span>
                        <span>Analytics Hub</span>
                        <span>Dashboard dati avanzata</span>
                    </button>

                    <button 
                        onClick={() => onNavigate('didattica-inclusiva')} 
                        
                    >
                        <span  style={{color: "var(--md-sys-color-tertiary)"}}>accessibility_new</span>
                        <span>Didattica Inclusiva</span>
                        <span>Gestione PEI/PDP globale</span>
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
        } catch(e) {
            console.error(e);
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
        >
            <DialogContent style={{gap: 'var(--md-sys-spacing-6)'}}>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Seleziona le classi e il periodo per cui generare il prospetto voti (PDF).</p>
                    
                    <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                        <label style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-medium-font-size)", fontWeight: "var(--md-sys-typescale-weight-medium)" }}>Periodo</label>
                        <TabGroup
                            tabs={[
                                { id: 'primo-quadrimestre', label: '1Q' },
                                { id: 'secondo-quadrimestre', label: 'Finale' }
                            ]}
                            activeTab={periodo}
                            onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        />
                    </div>

                    <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                        <label style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-medium-font-size)", fontWeight: "var(--md-sys-typescale-weight-medium)" }}>Classi</label>
                        <div style={{display: "flex", flexWrap: "wrap", gap: 'var(--md-sys-spacing-8)'}}>
                            {userClasses.map(c => (
                                <div 
                                    key={c} 
                                    onClick={() => toggleClass(c)}
                                    style={{
                                        padding: 'var(--md-sys-spacing-4)',
                                        borderRadius: 'var(--md-sys-shape-corner-full)',
                                        border: 'var(--md-sys-border-width-thin) solid',
                                        cursor: 'pointer',
                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--md-sys-spacing-8)',
                                        backgroundColor: selectedClasses.includes(c) 
                                            ? 'var(--md-sys-color-primary)' 
                                            : 'var(--md-sys-color-surface-container-low)',
                                        color: selectedClasses.includes(c) 
                                            ? 'var(--md-sys-color-on-primary)' 
                                            : 'var(--md-sys-color-on-surface-variant)',
                                        borderColor: selectedClasses.includes(c) 
                                            ? 'var(--md-sys-color-primary)' 
                                            : 'var(--md-sys-color-outline-variant)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!selectedClasses.includes(c)) {
                                            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!selectedClasses.includes(c)) {
                                            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)';
                                        }
                                    }}
                                >
                                    {selectedClasses.includes(c) && <span  style={{ fontSize: "var(--md-sys-typescale-headline-small-font-size)" }}>check</span>}
                                    Classe {c}
                                </div>
                            ))}
                        </div>
                    </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">Annulla</Button>
                <Button onClick={handlePrintAll} disabled={selectedClasses.length === 0 || isProcessing} variant="contained">
                    {isProcessing ? 'Elaborazione...' : `Genera ${selectedClasses.length} PDF`}
                </Button>
            </DialogActions>
        </M3Dialog>
    )
}

export default React.memo(ClassSelection);

