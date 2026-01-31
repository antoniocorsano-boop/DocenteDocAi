// MD3 Compliant - Migration completed
// StudentInterviewModal.tsx - All styling uses MD3 tokens via style props


import React, { useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import BarChart from './charts/BarChart';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
interface StudentInterviewModalProps {
    student: Studente;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onClose: () => void;
}

const StudentInterviewModal: React.FC<StudentInterviewModalProps> = ({ student, evaluations, competencyEvaluations, settings, onClose }) => {
  const performance = useMemo(() => calculatePerformance(student.id, 'Complessivo', evaluations), [student.id, evaluations]);

    // Group evaluations by subject
    const subjectAverages = useMemo(() => {
        const groups: Record<string, number[]> = {};
        evaluations.forEach(ev => {
            if (!groups[ev.materia]) groups[ev.materia] = [];
            const val = parseFloat(ev.voto);
            if (!isNaN(val)) groups[ev.materia].push(val);
        });

        return Object.entries(groups).map(([materia, voti]) => ({
            label: materia,
            value: parseFloat((voti.reduce((a, b) => a + b, 0) / voti.length).toFixed(1))
        }));
    }, [evaluations]);

    // Recent competencies
    const recentCompetencies = useMemo(() => {
        return settings.competenze.map(comp => {
            const latestEval = competencyEvaluations
                .filter(e => e.competenzaId === comp.id)
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

            if (!latestEval) return null;
            const level = comp.livelli.find(l => l.id === latestEval.livelloId);
            return { name: comp.nome, level: level?.nome, desc: level?.descrizione, date: latestEval.data };
        }).filter(Boolean);
    }, [competencyEvaluations, settings.competenze]);

    return (
        <M3Dialog
            onClose={onClose}
            title={`Modalità Colloquio - Classe ${student.classe}`}
            headline={`${student.cognome} ${student.nome}`}
            maxWidth="lg"
            level={1}
            mode="fullscreen"
        >
            <M3DialogContent style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 30%, transparent)' }}>
                <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-6)', height: "var(--md-sys-percent-100)"}}>
                    {/* Left Column: Performance */}
                    <div style={{gap: 'var(--md-sys-spacing-6)'}}>
                        <div data-testid="m3-card" style={{
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-6)',
                            border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"
                        }}>
                            <h2  style={{marginBottom: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                <span  style={{color: "var(--md-sys-color-primary)"}}>monitoring</span>
                                Andamento Didattico
                            </h2>
                            <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', marginBottom: 'var(--md-sys-spacing-6)'}}>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', flex: "1", border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  display: "block", fontSize: "var(--md-sys-typescale-body-large-size)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Media Generale</span>
                                    <span style={{
                                        fontSize: 'var(--md-sys-typescale-display-small-size)',
                                        fontWeight: 'bold',
                                        color: parseFloat(performance.grade || '0') < 6 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)'
                                    }}>
                                        {performance.grade || '-'}
                                    </span>
                                </div>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', flex: "1", border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  display: "block", fontSize: "var(--md-sys-typescale-body-large-size)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Trend</span>
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 'var(--md-sys-spacing-4)', marginTop: 'var(--md-sys-spacing-4)'}}>
                                        <span style={{
                                            fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--md-sys-typescale-display-small-size)',
                                            color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline-variant)'
                                        }}>
                                            {performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h3  style={{marginBottom: 'var(--md-sys-spacing-8)', fontWeight: "bold"}}>Media per Materia</h3>
                            <div >
                                <BarChart data={subjectAverages} color="var(--md-sys-color-primary)" horizontal />
                            </div>
                        </div>

                        <div data-testid="m3-card" style={{
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-6)',
                            border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"
                        }}>
                            <h2  style={{marginBottom: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                <span  style={{color: "var(--md-sys-color-secondary)"}}>history</span>
                                Ultime Valutazioni
                            </h2>
                            <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                                {evaluations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map(ev => (
                                    <div key={ev.id} style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , display: "flex", justifyContent: "space-between", alignItems: "center", padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", transition: "color var(--md-sys-motion-duration-medium)" }}>
                                        <div>
                                            <p style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "bold" }}>{ev.materia}</p>
                                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-small-size)" }}>{new Date(ev.data).toLocaleDateString()}</p>
                                        </div>
                                        <span style={{
                                            fontSize: 'var(--md-sys-typescale-headline-small-size)',
                                            fontWeight: 'bold',
                                            color: parseFloat(ev.voto) < 6 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)'
                                        }}>
                                            {ev.voto}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Competencies & Notes */}
                    <div style={{gap: 'var(--md-sys-spacing-6)'}}>
                        <div data-testid="m3-card" style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                            <h2  style={{marginBottom: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                <span  style={{color: "var(--md-sys-color-tertiary)"}}>verified</span>
                                Competenze Trasversali
                            </h2>
                            <div style={{gap: 'var(--md-sys-spacing-3)'}}>
                                {recentCompetencies.length > 0 ? (
                                    recentCompetencies.map((comp: ValutazioneCompetenza, idx) => (
                                        <div key={idx} style={{
                                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-tertiary-container) 10%, transparent)',
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            padding: 'var(--md-sys-spacing-8)',
                                            border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"
                                        }}>
                                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 'var(--md-sys-spacing-4)'}}>
                                                <h4 style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "bold" }}>{comp.name}</h4>
                                                <span style={{
                                                    color: 'var(--md-sys-color-on-tertiary-container)',
                                                    backgroundColor: "var(--md-sys-color-tertiary)",
                                                    border: "none"
                                                }}>{comp.level}</span>
                                            </div>
                                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-large-size)" }}>{comp.desc}</p>
                                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)'/60 , marginTop: 'var(--md-sys-spacing-4)', textTransform: "uppercase", letterSpacing: "var(--app-legacy-0_1em, 0.1em)"}}>Rilevato il {new Date(comp.date).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <InfoCard 
                                        type="info" 
                                        message="Nessuna competenza ancora valutata per questo studente." 
                                    />
                                )}
                            </div>
                        </div>

                        <div data-testid="m3-card" style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                            <h2  style={{marginBottom: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                <span  style={{color: "var(--md-sys-color-primary)"}}>info</span>
                                Informazioni Studente
                            </h2>
                            <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-6)'}}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-small-size)", textTransform: "uppercase", fontWeight: "bold" }}>Classe</span>
                                    <p style={{ fontSize: "var(--md-sys-typescale-headline-small-size)", fontWeight: "bold" }}>{student.classe}</p>
                                </div>
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-6)'}}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-small-size)", textTransform: "uppercase", fontWeight: "bold" }}>Bisogni</span>
                                    <div style={{display: "flex", gap: 'var(--md-sys-spacing-4)', marginTop: 'var(--md-sys-spacing-4)'}}>
                                        {student.hasBES && <span style={{
                                            backgroundColor: 'var(--md-sys-color-tertiary)',
                                            width: "var(--md-sys-spacing-3)",
                                            height: "var(--md-sys-spacing-3)",
                                            borderRadius: 'var(--md-sys-spacing-4)'
                                        }} title="BES"></span>}
                                        {student.hasDSA && <span style={{
                                            backgroundColor: 'var(--md-sys-color-error)',
                                            width: "var(--md-sys-spacing-3)",
                                            height: "var(--md-sys-spacing-3)",
                                            borderRadius: 'var(--md-sys-spacing-4)'
                                        }} title="DSA"></span>}
                                        {student.has104 && <span style={{width: "var(--md-sys-spacing-3)", height: "var(--md-sys-spacing-3)", borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)"}} title="L.104"></span>}
                                        {!student.hasBES && !student.hasDSA && !student.has104 && <span style={{ fontSize: "var(--md-sys-typescale-body-large-size)" }}>-</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Chiudi Vista</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default StudentInterviewModal;








