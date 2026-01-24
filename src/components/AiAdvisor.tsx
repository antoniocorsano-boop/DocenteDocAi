// MD3 Compliant - Migration completed
// AiAdvisor.tsx - All styling uses MD3 tokens via style props

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-6)',
            padding: 'var(--md-sys-spacing-6)',
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'
        }}>
            <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                fontWeight: 'bold',
                color: 'var(--md-sys-color-on-surface)',
                margin: 0
            }}>
                <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                    color: 'var(--md-sys-color-primary)'
                }}>psychology</span>
                Consulente Didattico AI
            </h2>
            <p style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                lineHeight: 1.5,
                margin: 0
            }}>
                Seleziona uno studente (o l'intera classe) e un obiettivo. L'AI analizzerà i dati e proporrà attività personalizzate.
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-4)',
                padding: 'var(--md-sys-spacing-6)',
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-2)'
                }}>
                    <label htmlFor="student-select-advisor" style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: 'bold',
                        color: 'var(--md-sys-color-on-surface)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>Studente / Gruppo</label>
                    <select id="student-select-advisor" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} style={{
                        padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                        color: 'var(--md-sys-color-on-surface)',
                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        cursor: 'pointer'
                    }}>
                        <option value="all">Tutta la classe</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                    </select>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-2)'
                }}>
                    <label style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        backgroundColor: advisorStatus ? 'var(--md-sys-color-surface-container-high)' : 'var(--md-sys-color-primary)',
                        color: advisorStatus ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                        cursor: advisorStatus ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.05em'
                    }}>Tipo di Intervento</label>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--md-sys-spacing-2)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        overflow: 'hidden',
                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'
                    }}>
                        <button
                            type="button"
                            onClick={() => setRequestType('recupero')}
                            style={{
                                flex: 1,
                                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                                backgroundColor: requestType === 'recupero' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-highest)',
                                color: requestType === 'recupero' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                border: 'none',
                                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                fontWeight: requestType === 'recupero' ? 'bold' : 'normal',
                                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                borderRadius: 0
                            }}
                        >Recupero</button>
                        <button
                            type="button"
                            onClick={() => setRequestType('potenziamento')}
                            style={{
                                flex: 1,
                                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                                backgroundColor: requestType === 'potenziamento' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-highest)',
                                color: requestType === 'potenziamento' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                border: 'none',
                                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                fontWeight: requestType === 'potenziamento' ? 'bold' : 'normal',
                                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                borderRadius: 0
                            }}
                        >Potenziamento</button>
                    </div>
                </div>
                 <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <button onClick={handleGenerateAdvice} disabled={!!advisorStatus} style={{
                        padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)',
                        backgroundColor: advisorStatus ? 'var(--md-sys-color-surface-container-high)' : 'var(--md-sys-color-primary)',
                        color: advisorStatus ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                        fontWeight: 'bold',
                        cursor: advisorStatus ? 'not-allowed' : 'pointer',
                        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-2)'
                    }}>
                        {advisorStatus ? <AiThinkingGem size="small" inline text="" /> : 'Genera Consiglio'}
                    </button>
                </div>
            </div>

            {advisorStatus && (
                 <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 'var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'
                }}>
                    <AiThinkingGem size="medium" text={advisorStatus} />
                </div>
            )}
            {error && <p style={{
                color: 'var(--md-sys-color-error)',
                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                backgroundColor: 'color-mix(in srgb, var(--md-sys-color-error) 10%, transparent)',
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-error)',
                margin: 0
            }}>{error}</p>}
            {advice && (
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                    padding: 'var(--md-sys-spacing-6)'
                }}>
                    <h3 style={{
                        fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                        fontWeight: 'bold',
                        color: 'var(--md-sys-color-on-surface)',
                        margin: '0 0 var(--md-sys-spacing-4) 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-2)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                            color: 'var(--md-sys-color-primary)'
                        }}>lightbulb</span>
                        Suggerimenti dell'AI:
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-4)'
                    }}>
                        {advice.map((item, index) => (
                            <div key={index} style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                padding: 'var(--md-sys-spacing-4)',
                                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'
                            }}>
                                <h4 style={{
                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    fontWeight: 'bold',
                                    color: 'var(--md-sys-color-on-surface)',
                                    margin: '0 0 var(--md-sys-spacing-2) 0'
                                }}>{item.titolo}</h4>
                                <p style={{
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                    lineHeight: 1.5,
                                    margin: 0
                                }}>{item.descrizione}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiAdvisor;








