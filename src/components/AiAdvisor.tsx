
import React, { useState } from 'react';
import { AiSettings, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { getAIPedagogicalAdvice } from '../services/aiService';
import AiThinkingGem from './AiThinkingGem';

interface AiAdvisorProps {
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvals: ValutazioneCompetenza[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
}

interface Advice {
    titolo: string;
    descrizione: string;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ students, evaluations, competencyEvals, settings, aiSettings }) => {
    const [advisorStatus, setAdvisorStatus] = useState<string | null>(null);
    const [advice, setAdvice] = useState<Advice[] | null>(null);
    const [error, setError] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
    const [requestType, setRequestType] = useState<'recupero' | 'potenziamento'>('recupero');

    const handleGenerateAdvice = async () => {
        setAdvisorStatus("Analisi dei dati in corso...");
        setAdvice(null);
        setError('');

        try {
            let studentData: unknown;
            if (selectedStudentId === 'all') {
                studentData = {
                    nome: "Tutta la classe",
                    valutazioni: evaluations.slice(-30), // last 30 evals for the class
                    competenze: competencyEvals.slice(-30)
                };
            } else {
                const student = students.find(s => s.id === selectedStudentId);
                if (!student) throw new Error("Studente non trovato.");
                studentData = {
                    nome: `${student.cognome} ${student.nome}`,
                    valutazioni: evaluations.filter(e => e.studenteId === student.id),
                    competenze: competencyEvals.filter(e => e.studenteId === student.id)
                };
            }
            
            setAdvisorStatus(requestType === 'recupero' ? "Elaborazione strategie di recupero..." : "Elaborazione strategie di potenziamento...");
            await new Promise(r => setTimeout(r, 500)); // UX delay

            const result = await getAIPedagogicalAdvice(aiSettings, studentData, requestType, settings.competenze);
            setAdvice(result.suggerimenti);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Si è verificato un errore durante la generazione del consiglio.";
            console.error(err);
            setError(errorMsg);
        } finally {
            setAdvisorStatus(null);
        }
    };

    return (
        <div className="card">
            <h2 className="m3-title-large flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Consulente Didattico AI
            </h2>
            <p className="m3-body-medium text-on-surface-variant mt-2 mb-4">
                Seleziona uno studente (o l'intera classe) e un obiettivo. L'AI analizzerà i dati e proporrà attività personalizzate.
            </p>

            <div className="responsive-grid items-end gap-4 p-4 border rounded-lg bg-surface-container">
                <div>
                    <label htmlFor="student-select-advisor" className="form-label">Studente / Gruppo</label>
                    <select id="student-select-advisor" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="form-select w-full">
                        <option value="all">Tutta la classe</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Tipo di Intervento</label>
                    <div className="segmented-button-group">
                        <button type="button" onClick={() => setRequestType('recupero')} className={`segmented-button ${requestType === 'recupero' ? 'active' : ''}`}>Recupero</button>
                        <button type="button" onClick={() => setRequestType('potenziamento')} className={`segmented-button ${requestType === 'potenziamento' ? 'active' : ''}`}>Potenziamento</button>
                    </div>
                </div>
                 <div className="md:col-span-2">
                    <button onClick={handleGenerateAdvice} disabled={!!advisorStatus} className="button button-filled w-full">
                        {advisorStatus ? <AiThinkingGem size="small" inline text="" /> : 'Genera Consiglio'}
                    </button>
                </div>
            </div>

            {advisorStatus && (
                 <div className="flex justify-center items-center p-8">
                    <AiThinkingGem size="medium" text={advisorStatus} />
                </div>
            )}
            {error && <p className="text-error mt-4 text-center">{error}</p>}
            {advice && (
                <div className="mt-6 space-y-4">
                    <h3 className="m3-title-medium">Suggerimenti dell'AI:</h3>
                    {advice.map((item, index) => (
                        <div key={index} className="p-4 rounded-lg bg-surface-container-high">
                            <h4 className="m3-title-small font-bold">{item.titolo}</h4>
                            <p className="m3-body-medium mt-1 whitespace-pre-wrap">{item.descrizione}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiAdvisor;
