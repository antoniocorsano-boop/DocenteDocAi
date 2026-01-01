
import React, { useState, useMemo, useEffect } from 'react';
import { Studente, TimetableSettings, Valutazione, ValutazioneCompetenza, RegisterEntry, StudentHistoryRecord } from '../types';
import { getNextClass } from '../utils/schoolUtils';
import { calculatePerformance } from '../utils/evaluationUtils';
import { InfoCard } from './M3Components';
import { M3Dialog } from './M3Dialog';

interface PassaggioAnnoWizardProps {
    onClose: () => void;
    students: Studente[];
    settings: TimetableSettings;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    register: RegisterEntry[];
    onPromoteStudents: (promotedStudents: Studente[], archiveYear: string) => void;
    onBackupData: () => Promise<void>; 
    onResetData: () => void; 
}

type WizardStep = 'intro' | 'decisions' | 'confirm';
type OutcomeType = 'promote' | 'retain' | 'archive' | 'transfer';

interface StudentOutcome {
    studentId: string;
    action: OutcomeType;
    nextClass: string;
}

const PassaggioAnnoWizard: React.FC<PassaggioAnnoWizardProps> = ({ 
    onClose, students, settings, evaluations, competencyEvaluations, register, 
    onPromoteStudents, onBackupData, onResetData 
}) => {
    const [step, setStep] = useState<WizardStep>('intro');
    const [isProcessing, setIsProcessing] = useState(false);
    const [outcomes, setOutcomes] = useState<Record<string, StudentOutcome>>({});

    const activeStudents = useMemo(() => students.filter(s => !s.isArchived), [students]);

    // Initialize outcomes based on logic
    useEffect(() => {
        const initialOutcomes: Record<string, StudentOutcome> = {};
        activeStudents.forEach(s => {
            const { nextClass, isArchived } = getNextClass(s.classe, settings.schoolType);
            // Default logic: If isArchived (e.g. 5th year -> Diplomato), set archive. Else promote.
            const action = isArchived ? 'archive' : 'promote';
            initialOutcomes[s.id] = {
                studentId: s.id,
                action,
                nextClass: isArchived ? 'Archiviato' : nextClass
            };
        });
        setOutcomes(initialOutcomes);
    }, [activeStudents, settings.schoolType]);

    const nextYear = useMemo(() => {
        const currentSplit = settings.annoScolasticoCorrente.split('/');
        if (currentSplit.length === 2) {
            const start = parseInt(currentSplit[0]);
            return `${start + 1}/${start + 2}`;
        }
        return `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
    }, [settings.annoScolasticoCorrente]);

    const handleOutcomeChange = (studentId: string, action: OutcomeType) => {
        setOutcomes(prev => {
            const student = activeStudents.find(s => s.id === studentId);
            if (!student) return prev;

            let nextClass = '';
            if (action === 'promote') {
                const result = getNextClass(student.classe, settings.schoolType);
                nextClass = result.isArchived ? 'Diplomato' : result.nextClass;
            } else if (action === 'retain') {
                nextClass = student.classe; // Stays in same class
            } else if (action === 'transfer') {
                nextClass = 'Trasferito/Ritirato';
            } else {
                nextClass = 'Archiviato';
            }

            return {
                ...prev,
                [studentId]: { studentId, action, nextClass }
            };
        });
    };

    const stats = useMemo(() => {
        const vals: StudentOutcome[] = Object.values(outcomes);
        return {
            promote: vals.filter(o => o.action === 'promote').length,
            retain: vals.filter(o => o.action === 'retain').length,
            archive: vals.filter(o => o.action === 'archive' || o.action === 'transfer').length
        };
    }, [outcomes]);

    // Helper: Calculate History for a student
    const calculateHistoryForStudent = (student: Studente, outcome: StudentOutcome): StudentHistoryRecord => {
        const studentEvals = evaluations.filter(e => e.studenteId === student.id);
        const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);
        
        // Calculate Absences %
        const studentEntries = register.filter(r => r.classe === student.classe);
        const totalLessons = studentEntries.length;
        const absences = studentEntries.filter(r => r.studentAttendance[student.id] === 'assente').length;
        const absencesPercentage = totalLessons > 0 ? Math.round((absences / totalLessons) * 100) : 0;
        
        // Final outcome string for history
        let finalOutcome: 'Promosso' | 'Bocciato' | 'Sospeso' | 'Ritirato' | 'Trasferito' = 'Promosso';
        
        if (outcome.action === 'retain') finalOutcome = 'Bocciato';
        if (outcome.action === 'transfer') finalOutcome = 'Trasferito';
        if (outcome.action === 'archive' && !grade) finalOutcome = 'Sospeso'; 

        // Competency Summary
        const studentComps = competencyEvaluations.filter(e => e.studenteId === student.id);
        const compSummary = studentComps.length > 0 ? [{ name: 'Competenze Valutate', level: `${studentComps.length} rilevazioni` }] : [];

        return {
            year: settings.annoScolasticoCorrente,
            classe: student.classe,
            averageGrade: grade || '-',
            absencesPercentage,
            finalOutcome,
            competencySummary: compSummary
        };
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            // 1. Force Backup
            await onBackupData();
            
            // 2. Prepare new student objects
            const newStudents = students.map(s => {
                // If archived previously, keep as is
                if (s.isArchived) return s;

                const outcome = outcomes[s.id];
                // Should not happen, but safety check
                if (!outcome) return s; 

                const historyRecord = calculateHistoryForStudent(s, outcome);
                const previousHistory = s.history || [];
                
                const isNowArchived = outcome.action === 'archive' || outcome.action === 'transfer' || (outcome.action === 'promote' && outcome.nextClass === 'Diplomato');

                return {
                    ...s,
                    classe: outcome.nextClass === 'Archiviato' || outcome.nextClass === 'Diplomato' || outcome.nextClass === 'Trasferito/Ritirato' ? s.classe : outcome.nextClass, 
                    isArchived: isNowArchived,
                    archiveYear: isNowArchived ? settings.annoScolasticoCorrente : undefined,
                    history: [...previousHistory, historyRecord]
                };
            });

            // 3. Execute Actions
            onResetData();
            onPromoteStudents(newStudents, nextYear);
            
            alert(`Passaggio all'anno ${nextYear} completato!`);
            onClose();
        } catch (e) {
            console.error(e);
            alert("Errore durante il passaggio d'anno. Verifica il backup.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Passaggio Anno Scolastico"
            maxWidth="4xl"
        >
                    {step === 'intro' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <InfoCard 
                                title={`Chiusura Anno ${settings.annoScolasticoCorrente}`}
                                description="Procedura guidata per archiviare i dati, calcolare lo storico e preparare le classi per il nuovo anno."
                                icon="school"
                                variant="primary"
                            />
                            
                            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                                <h3 className="m3-title-medium mb-3">Checklist Automatica</h3>
                                <ul className="space-y-3 m3-body-medium text-on-surface-variant">
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <span>Backup completo dei dati su Drive/Locale.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">history_edu</span>
                                        <span>Salvataggio storico (media voti, assenze) nel profilo studente.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">delete_sweep</span>
                                        <span>Reset registro voti, lezioni e assenze giornaliere.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">trending_up</span>
                                        <span>Promozione classi (es. 1A → 2A) con gestione bocciature.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 'decisions' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="m3-title-large">Esiti Scrutinio</h3>
                                <div className="flex gap-2">
                                    <span className="chip bg-primary-container text-on-primary-container border-none">{stats.promote} Promossi</span>
                                    <span className="chip bg-error-container text-on-error-container border-none">{stats.retain} Bocciati</span>
                                    <span className="chip bg-surface-container-high border-none">{stats.archive} Archiviati</span>
                                </div>
                            </div>
                            
                            <div className="table-container shadow-sm border border-outline-variant rounded-xl overflow-hidden">
                                <table className="table w-full">
                                    <thead className="bg-surface-container-high">
                                        <tr>
                                            <th className="text-left p-3">Studente</th>
                                            <th className="text-left p-3">Classe Attuale</th>
                                            <th className="text-left p-3">Media</th>
                                            <th className="text-left p-3 w-48">Esito</th>
                                            <th className="text-left p-3">Classe Futura</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant bg-surface">
                                        {activeStudents.map((s) => {
                                            const outcome = outcomes[s.id];
                                            const { grade } = calculatePerformance(s.id, 'Complessivo', evaluations.filter(e => e.studenteId === s.id));
                                            const isInsufficient = grade && parseFloat(grade) < 6;

                                            return (
                                                <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                                                    <td className="p-3 font-medium">{s.cognome} {s.nome}</td>
                                                    <td className="p-3">{s.classe}</td>
                                                    <td className={`p-3 font-bold ${isInsufficient ? 'text-error' : 'text-primary'}`}>{grade || '-'}</td>
                                                    <td className="p-3">
                                                        <select 
                                                            value={outcome?.action || 'promote'} 
                                                            onChange={(e) => handleOutcomeChange(s.id, e.target.value as OutcomeType)}
                                                            className={`form-select text-sm py-1 pl-2 pr-8 rounded-lg border-none ring-1 ring-inset ring-outline-variant focus:ring-2 focus:ring-primary ${
                                                                outcome?.action === 'retain' ? 'bg-error-container text-on-error-container' : 
                                                                outcome?.action === 'archive' || outcome?.action === 'transfer' ? 'bg-surface-container-high text-on-surface-variant' : 
                                                                'bg-primary-container text-on-primary-container'
                                                            }`}
                                                        >
                                                            <option value="promote">Promosso</option>
                                                            <option value="retain">Bocciato (Ripetente)</option>
                                                            <option value="transfer">Trasferito/Ritirato</option>
                                                            <option value="archive">Diplomato/Archivia</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3 opacity-80 text-sm truncate max-w-[120px]">{outcome?.nextClass}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="text-center py-12 max-w-lg mx-auto">
                            <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl">warning</span>
                            </div>
                            <h3 className="m3-headline-medium text-on-surface mb-4">Sei sicuro di procedere?</h3>
                            <p className="m3-body-large text-on-surface-variant mb-8">
                                L'anno scolastico verrà impostato a <strong>{nextYear}</strong>.
                                <br/><br/>
                                ⚠️ I dati giornalieri (voti, lezioni, assenze) verranno <strong>resettati</strong> per iniziare il nuovo anno pulito. I dati storici saranno salvati nel profilo di ogni studente.
                            </p>
                            
                            <div className="p-4 bg-surface-container border border-outline-variant rounded-xl text-left text-sm mb-4">
                                <p className="font-bold mb-2">Riepilogo Azioni:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Reset Valutazioni e Competenze</li>
                                    <li>Reset Registro di Classe e Diario</li>
                                    <li>Reset Piani di Inclusione (vanno rifatti annualmente)</li>
                                    <li>Promozione studenti secondo schema definito</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="dialog-footer border-t border-outline-variant flex-shrink-0 bg-surface">
                    {step === 'intro' && (
                        <>
                            <button onClick={onClose} className="button button-text">Annulla</button>
                            <button onClick={() => setStep('decisions')} className="button button-filled">Inizia Scrutinio</button>
                        </>
                    )}
                    {step === 'decisions' && (
                        <>
                            <button onClick={() => setStep('intro')} className="button button-text">Indietro</button>
                            <button onClick={() => setStep('confirm')} className="button button-filled">Conferma Esiti</button>
                        </>
                    )}
                    {step === 'confirm' && (
                        <>
                            <button onClick={() => setStep('decisions')} className="button button-text" disabled={isProcessing}>Indietro</button>
                            <button onClick={handleConfirm} disabled={isProcessing} className="button button-filled bg-error text-on-error hover:shadow-md">
                                {isProcessing ? <span className="button-spinner mr-2"></span> : <span className="material-symbols-outlined mr-2">save_as</span>}
                                {isProcessing ? 'Elaborazione...' : 'Esegui Passaggio Anno'}
                            </button>
                        </>
                    )}
                </div>
        </M3Dialog>
    );
};

export default PassaggioAnnoWizard;
