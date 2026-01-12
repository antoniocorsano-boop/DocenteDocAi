

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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div className="md:grid-cols-2 overflow-y-visible pb-8" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)", height: "100%" }}>
                    {/* Left Column: Performance */}
                    <div style={{ gap: "var(--md-sys-spacing-6)" }}>
                        <div data-testid="m3-card" className="bg-[var(--md-sys-color-surface-container-low)]est/50 rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <h2 className="m3-title-large" style={{ marginBottom: "var(--md-sys-spacing-8)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>monitoring</span>
                                Andamento Didattico
                            </h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", marginBottom: "var(--md-sys-spacing-6)" }}>
                                <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", flex: "1", border: "1px solid var(--md-sys-color-outline)" }}>
                                    <span className="text-[var(--md-sys-color-on-surface)]-variant" style={{ display: "block", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Media Generale</span>
                                    <span className={`text-4xl font-bold ${parseFloat(performance.grade || '0') < 6 ? 'text-error' : 'text-primary'}`}>
                                        {performance.grade || '-'}
                                    </span>
                                </div>
                                <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", flex: "1", border: "1px solid var(--md-sys-color-outline)" }}>
                                    <span className="text-[var(--md-sys-color-on-surface)]-variant" style={{ display: "block", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Trend</span>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "var(--md-sys-spacing-4)", marginTop: "var(--md-sys-spacing-4)" }}>
                                        <span className={`material-symbols-outlined text-4xl ${performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-outline/50'}`}>
                                            {performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="m3-title-medium" style={{ marginBottom: "var(--md-sys-spacing-8)", fontWeight: "bold" }}>Media per Materia</h3>
                            <div className="md:h-64 h-48">
                                <BarChart data={subjectAverages} color="var(--md-sys-color-primary)" horizontal />
                            </div>
                        </div>

                        <div data-testid="m3-card" className="bg-[var(--md-sys-color-surface-container-low)]est/50 rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <h2 className="m3-title-large" style={{ marginBottom: "var(--md-sys-spacing-8)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-secondary)" }}>history</span>
                                Ultime Valutazioni
                            </h2>
                            <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                                {evaluations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map(ev => (
                                    <div key={ev.id} className="bg-[var(--md-sys-color-surface-container-low)]est rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)]/50 hover:bg-[var(--md-sys-color-surface-container-low)]" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", transition: "color 300ms" }}>
                                        <div>
                                            <p className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold" }}>{ev.materia}</p>
                                            <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.75rem" }}>{new Date(ev.data).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-lg font-bold ${parseFloat(ev.voto) < 6 ? 'text-error' : 'text-primary'}`}>
                                            {ev.voto}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Competencies & Notes */}
                    <div style={{ gap: "var(--md-sys-spacing-6)" }}>
                        <div data-testid="m3-card" className="bg-[var(--md-sys-color-surface-container-low)]est/50 rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <h2 className="m3-title-large" style={{ marginBottom: "var(--md-sys-spacing-8)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-tertiary)" }}>verified</span>
                                Competenze Trasversali
                            </h2>
                            <div style={{ gap: "var(--md-sys-spacing-3)" }}>
                                {recentCompetencies.length > 0 ? (
                                    recentCompetencies.map((comp: ValutazioneCompetenza, idx) => (
                                        <div key={idx} className="bg-tertiary-container/10 rounded-[var(--md-sys-shape-corner-large)] border-tertiary/20" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--md-sys-spacing-4)" }}>
                                                <h4 className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold" }}>{comp.name}</h4>
                                                <span className="badge-chip text-on-tertiary" style={{ backgroundColor: "var(--md-sys-color-tertiary)", border: "none" }}>{comp.level}</span>
                                            </div>
                                            <p className="text-[var(--md-sys-color-on-surface)]-variant italic" style={{ fontSize: "0.875rem" }}>{comp.desc}</p>
                                            <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant/60" style={{ marginTop: "var(--md-sys-spacing-4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rilevato il {new Date(comp.date).toLocaleDateString()}</p>
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

                        <div data-testid="m3-card" className="bg-[var(--md-sys-color-surface-container-low)]est/50 rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <h2 className="m3-title-large" style={{ marginBottom: "var(--md-sys-spacing-8)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>info</span>
                                Informazioni Studente
                            </h2>
                            <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
                                <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-6)" }}>
                                    <span className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Classe</span>
                                    <p style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{student.classe}</p>
                                </div>
                                <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-6)" }}>
                                    <span className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Bisogni</span>
                                    <div style={{ display: "flex", gap: "var(--md-sys-spacing-4)", marginTop: "var(--md-sys-spacing-4)" }}>
                                        {student.hasBES && <span className="bg-warning" style={{ width: "0.75rem", height: "0.75rem", borderRadius: "9999px" }} title="BES"></span>}
                                        {student.hasDSA && <span className="bg-error" style={{ width: "0.75rem", height: "0.75rem", borderRadius: "9999px" }} title="DSA"></span>}
                                        {student.has104 && <span style={{ width: "0.75rem", height: "0.75rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)" }} title="L.104"></span>}
                                        {!student.hasBES && !student.hasDSA && !student.has104 && <span style={{ fontSize: "0.875rem" }}>-</span>}
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


