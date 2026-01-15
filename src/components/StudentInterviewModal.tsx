// LEGACY - MD3 Non-compliant


import React, { useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import BarChart from './charts/BarChart';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { useTheme } from '../theme/theme';

interface StudentInterviewModalProps {
    student: Studente;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onClose: () => void;
}

const StudentInterviewModal: React.FC<StudentInterviewModalProps> = ({ student, evaluations, competencyEvaluations, settings, onClose }) => {
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/30 }}>
                <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6'], height: "100%"}}>
                    {/* Left Column: Performance */}
                    <div style={{gap: layers.ref.spacing['6']}}>
                        <div data-testid="m3-card" style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest/50, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline"}}>
                            <h2  style={{marginBottom: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                <span  style={{color: "layers.sys.color.primary"}}>monitoring</span>
                                Andamento Didattico
                            </h2>
                            <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], marginBottom: layers.ref.spacing['6']}}>
                                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], flex: "1", border: "1px solid layers.sys.color.outline"}}>
                                    <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ display: "block", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Media Generale</span>
                                    <span className={`text-4xl font-bold ${parseFloat(performance.grade || '0') < 6 ? 'text-error' : 'text-primary'}`}>
                                        {performance.grade || '-'}
                                    </span>
                                </div>
                                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], flex: "1", border: "1px solid layers.sys.color.outline"}}>
                                    <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ display: "block", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Trend</span>
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", gap: layers.ref.spacing['4'], marginTop: layers.ref.spacing['4']}}>
                                        <span className={`material-symbols-outlined text-4xl ${performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-outline/50'}`}>
                                            {performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h3  style={{marginBottom: layers.ref.spacing['8'], fontWeight: "bold"}}>Media per Materia</h3>
                            <div >
                                <BarChart data={subjectAverages} color="var(--md-sys-color-primary)" horizontal />
                            </div>
                        </div>

                        <div data-testid="m3-card" style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest/50, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline"}}>
                            <h2  style={{marginBottom: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                <span  style={{color: "layers.sys.color.secondary"}}>history</span>
                                Ultime Valutazioni
                            </h2>
                            <div style={{gap: layers.ref.spacing['2']}}>
                                {evaluations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map(ev => (
                                    <div key={ev.id} style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest, borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline", transition: "color 300ms"}}>
                                        <div>
                                            <p style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "bold" }}>{ev.materia}</p>
                                            <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem" }}>{new Date(ev.data).toLocaleDateString()}</p>
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
                    <div style={{gap: layers.ref.spacing['6']}}>
                        <div data-testid="m3-card" style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest/50, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline"}}>
                            <h2  style={{marginBottom: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                <span  style={{color: "layers.sys.color.tertiary"}}>verified</span>
                                Competenze Trasversali
                            </h2>
                            <div style={{gap: layers.ref.spacing['3']}}>
                                {recentCompetencies.length > 0 ? (
                                    recentCompetencies.map((comp: ValutazioneCompetenza, idx) => (
                                        <div key={idx} style={{ backgroundColor: sys.colors.tertiary-container/10, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
                                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: layers.ref.spacing['4']}}>
                                                <h4 style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "bold" }}>{comp.name}</h4>
                                                <span style={{ color: sys.colors.on-tertiary }} style={{backgroundColor: "layers.sys.color.tertiary", border: "none"}}>{comp.level}</span>
                                            </div>
                                            <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.875rem" }}>{comp.desc}</p>
                                            <p style={{ color: layers.sys.color.onSurfaceVariant/60 }} style={{marginTop: layers.ref.spacing['4'], textTransform: "uppercase", letterSpacing: "0.1em"}}>Rilevato il {new Date(comp.date).toLocaleDateString()}</p>
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

                        <div data-testid="m3-card" style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest/50, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline"}}>
                            <h2  style={{marginBottom: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                <span  style={{color: "layers.sys.color.primary"}}>info</span>
                                Informazioni Studente
                            </h2>
                            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
                                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6']}}>
                                    <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Classe</span>
                                    <p style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{student.classe}</p>
                                </div>
                                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6']}}>
                                    <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Bisogni</span>
                                    <div style={{display: "flex", gap: layers.ref.spacing['4'], marginTop: layers.ref.spacing['4']}}>
                                        {student.hasBES && <span style={{ backgroundColor: sys.colors.warning }} style={{ width: "0.75rem", height: "0.75rem", borderRadius: layers.ref.spacing['4'] }} title="BES"></span>}
                                        {student.hasDSA && <span style={{ backgroundColor: sys.colors.error }} style={{ width: "0.75rem", height: "0.75rem", borderRadius: layers.ref.spacing['4'] }} title="DSA"></span>}
                                        {student.has104 && <span style={{width: "0.75rem", height: "0.75rem", borderRadius: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.primary"}} title="L.104"></span>}
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







