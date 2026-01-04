

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
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-visible pb-8">
                    {/* Left Column: Performance */}
                    <div className="space-y-6">
                        <div data-testid="m3-card" className="bg-surface-container-lowest/50 p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
                            <h2 className="m3-title-large mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">monitoring</span>
                                Andamento Didattico
                            </h2>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="bg-surface-container-high p-4 rounded-2xl flex-1 border border-outline-variant">
                                    <span className="block text-sm text-on-surface-variant uppercase tracking-wider font-bold">Media Generale</span>
                                    <span className={`text-4xl font-bold ${parseFloat(performance.grade || '0') < 6 ? 'text-error' : 'text-primary'}`}>
                                        {performance.grade || '-'}
                                    </span>
                                </div>
                                <div className="bg-surface-container-high p-4 rounded-2xl flex-1 border border-outline-variant">
                                    <span className="block text-sm text-on-surface-variant uppercase tracking-wider font-bold">Trend</span>
                                    <div className="flex items-center justify-start gap-1 mt-1">
                                        <span className={`material-symbols-outlined text-4xl ${performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-outline/50'}`}>
                                            {performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="m3-title-medium mb-2 font-bold">Media per Materia</h3>
                            <div className="md:h-64 h-48">
                                <BarChart data={subjectAverages} color="var(--sys-primary)" horizontal />
                            </div>
                        </div>

                        <div data-testid="m3-card" className="bg-surface-container-lowest/50 p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
                            <h2 className="m3-title-large mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">history</span>
                                Ultime Valutazioni
                            </h2>
                            <div className="space-y-2">
                                {evaluations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map(ev => (
                                    <div key={ev.id} className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                                        <div>
                                            <p className="font-bold text-on-surface">{ev.materia}</p>
                                            <p className="text-xs text-on-surface-variant">{new Date(ev.data).toLocaleDateString()}</p>
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
                    <div className="space-y-6">
                        <div data-testid="m3-card" className="bg-surface-container-lowest/50 p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
                            <h2 className="m3-title-large mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-tertiary">verified</span>
                                Competenze Trasversali
                            </h2>
                            <div className="space-y-3">
                                {recentCompetencies.length > 0 ? (
                                    recentCompetencies.map((comp: any, idx) => (
                                        <div key={idx} className="p-4 bg-tertiary-container/10 rounded-2xl border border-tertiary/20">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-on-surface">{comp.name}</h4>
                                                <span className="badge-chip bg-tertiary text-on-tertiary border-none">{comp.level}</span>
                                            </div>
                                            <p className="text-sm text-on-surface-variant italic">{comp.desc}</p>
                                            <p className="text-[10px] mt-2 text-on-surface-variant/60 uppercase tracking-widest">Rilevato il {new Date(comp.date).toLocaleDateString()}</p>
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

                        <div data-testid="m3-card" className="bg-surface-container-lowest/50 p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
                            <h2 className="m3-title-large mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Informazioni Studente
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-surface-container-high rounded-xl">
                                    <span className="text-xs text-on-surface-variant uppercase font-bold">Classe</span>
                                    <p className="text-lg font-bold">{student.classe}</p>
                                </div>
                                <div className="p-3 bg-surface-container-high rounded-xl">
                                    <span className="text-xs text-on-surface-variant uppercase font-bold">Bisogni</span>
                                    <div className="flex gap-1 mt-1">
                                        {student.hasBES && <span className="w-3 h-3 rounded-full bg-warning" title="BES"></span>}
                                        {student.hasDSA && <span className="w-3 h-3 rounded-full bg-error" title="DSA"></span>}
                                        {student.has104 && <span className="w-3 h-3 rounded-full bg-primary" title="L.104"></span>}
                                        {!student.hasBES && !student.hasDSA && !student.has104 && <span className="text-sm">-</span>}
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
