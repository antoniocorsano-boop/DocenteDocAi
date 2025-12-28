

import React, { useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import BarChart from './charts/BarChart';
// import Avatar from './Avatar';
import { M3Dialog, M3Card } from './M3Components';

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
            isOpen={true}
            onClose={onClose}
            title={`${student.cognome} ${student.nome}`}
            headline={`Modalità Colloquio - Classe ${student.classe}`}
            buttons={
                <button onClick={onClose} className="button button-text">Chiudi Vista</button>
            }
            fullscreen={true}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-visible pb-8">
                {/* Left Column: Performance */}
                <div className="space-y-6">
                    <M3Card className="h-auto">
                        <h2 className="m3-title-large mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">monitoring</span>
                            Andamento Didattico
                        </h2>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="bg-surface-container-high p-4 rounded-xl flex-1 border border-outline-variant">
                                <span className="block text-sm text-on-surface-variant uppercase tracking-wider font-bold">Media Generale</span>
                                <span className={`text-4xl font-bold ${parseFloat(performance.grade || '0') < 6 ? 'text-error' : 'text-primary'}`}>
                                    {performance.grade || '-'}
                                </span>
                            </div>
                            <div className="bg-surface-container-high p-4 rounded-xl flex-1 border border-outline-variant">
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
                    </M3Card>

                    <M3Card className="h-auto">
                        <h2 className="m3-title-large mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">history</span>
                            Ultime Valutazioni
                        </h2>
                        <div className="space-y-2">
                            {evaluations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map(ev => (
                                <div key={ev.id} className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                                    <div>
                                        <p className="font-bold text-on-surface">{ev.materia}</p>
                                        <p className="text-xs text-on-surface-variant">{new Date(ev.data).toLocaleDateString()} - {ev.tipo}</p>
                                    </div>
                                    <span className={`text-lg font-bold px-3 py-1 rounded-md ${parseFloat(ev.voto) < 6 ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                                        {ev.voto}
                                    </span>
                                </div>
                            ))}
                            {evaluations.length === 0 && <p className="text-on-surface-variant italic p-4 text-center">Nessuna valutazione registrata.</p>}
                        </div>
                    </M3Card>
                </div>

                {/* Right Column: Competencies & Notes */}
                <div className="space-y-6">
                    <M3Card className="bg-tertiary-container text-on-tertiary-container border-none h-auto">
                        <h2 className="m3-title-large mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">psychology</span>
                            Competenze Trasversali
                        </h2>
                        <p className="opacity-80 mb-4 text-sm">Livelli raggiunti nelle competenze chiave.</p>
                        <div className="space-y-3">
                            {recentCompetencies.length > 0 ? recentCompetencies.map((c, i) => (
                                <div key={i} className="bg-surface/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                                    <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">{c?.name}</p>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xl font-bold">{c?.level}</span>
                                        <span className="text-xs opacity-60 font-mono">{c?.date ? new Date(c.date).toLocaleDateString() : ''}</span>
                                    </div>
                                    <p className="text-sm mt-1 opacity-90 leading-snug">{c?.desc}</p>
                                </div>
                            )) : <div className="p-4 text-center opacity-70 italic border border-dashed border-white/30 rounded-xl">Nessuna competenza valutata recentemente.</div>}
                        </div>
                    </M3Card>

                    <M3Card className="bg-secondary-container text-on-secondary-container border-none h-auto">
                        <h2 className="m3-title-large mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">lightbulb</span>
                            Punti di Attenzione
                        </h2>
                        <p className="m3-body-medium leading-relaxed opacity-90">
                            {parseFloat(performance.grade || '0') >= 7
                                ? "Lo studente dimostra un buon impegno e partecipazione. Continuare a stimolare l'interesse."
                                : parseFloat(performance.grade || '0') >= 6
                                    ? "Rendimento sufficiente ma con margini di miglioramento. Necessario consolidare il metodo di studio."
                                    : "È necessario un intervento di recupero mirato per colmare le lacune evidenziate."}
                        </p>
                    </M3Card>
                </div>
            </div>
        </M3Dialog>
    );
};

export default StudentInterviewModal;
