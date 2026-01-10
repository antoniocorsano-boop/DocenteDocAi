
import React, { useState } from 'react';
import { AiSettings, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { getAIPedagogicalAdvice } from '../services/aiService';
import { AiThinkingGem } from './ui';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for AI advisor interface, form controls, and advice display
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
        <div className="ai-advisor-card">
            <h2 className="ai-advisor-header">
                <span className="material-symbols-outlined ai-advisor-icon">psychology</span>
                Consulente Didattico AI
            </h2>
            <p className="ai-advisor-description">
                Seleziona uno studente (o l'intera classe) e un obiettivo. L'AI analizzerà i dati e proporrà attività personalizzate.
            </p>

            <div className="ai-advisor-form">
                <div className="ai-advisor-form-group">
                    <label htmlFor="student-select-advisor" className="ai-advisor-label">Studente / Gruppo</label>
                    <select id="student-select-advisor" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="ai-advisor-select">
                        <option value="all">Tutta la classe</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                    </select>
                </div>
                <div className="ai-advisor-form-group">
                    <label className="ai-advisor-label">Tipo di Intervento</label>
                    <div className="ai-advisor-segmented-group">
                        <button type="button" onClick={() => setRequestType('recupero')} className={`ai-advisor-segmented-button ${requestType === 'recupero' ? 'active' : ''}`}>Recupero</button>
                        <button type="button" onClick={() => setRequestType('potenziamento')} className={`ai-advisor-segmented-button ${requestType === 'potenziamento' ? 'active' : ''}`}>Potenziamento</button>
                    </div>
                </div>
                 <div className="ai-advisor-form-span-full">
                    <button onClick={handleGenerateAdvice} disabled={!!advisorStatus} className="ai-advisor-generate-button">
                        {advisorStatus ? <AiThinkingGem size="small" inline text="" /> : 'Genera Consiglio'}
                    </button>
                </div>
            </div>

            {advisorStatus && (
                 <div className="ai-advisor-status">
                    <AiThinkingGem size="medium" text={advisorStatus} />
                </div>
            )}
            {error && <p className="ai-advisor-error">{error}</p>}
            {advice && (
                <div className="ai-advisor-advice-section">
                    <h3 className="ai-advisor-advice-title">Suggerimenti dell'AI:</h3>
                    {advice.map((item, index) => (
                        <div key={index} className="ai-advisor-advice-item">
                            <h4 className="ai-advisor-advice-item-title">{item.titolo}</h4>
                            <p className="ai-advisor-advice-item-description">{item.descrizione}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiAdvisor;


