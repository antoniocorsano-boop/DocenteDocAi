
import React, { useState, useMemo, useEffect } from 'react';
import { Studente, TimetableSettings, Valutazione, ValutazioneCompetenza, RegisterEntry, StudentHistoryRecord } from '../types';
import { getNextClass } from '../utils/schoolUtils';
import { calculatePerformance } from '../utils/evaluationUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';

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
            maxWidth="2xl"
            level={1}
            hideBackdrop={true}
        >
            <M3DialogContent className="bg-surface-container-low/30 backdrop-blur-xl">
                    {step === "intro" && (
                        <div className="space-y-8 max-w-2xl mx-auto py-4">
                            <InfoCard 
                                title={`Chiusura Anno ${settings.annoScolasticoCorrente}`}
                                description="Procedura guidata per archiviare i dati, calcolare lo storico e preparare le classi per il nuovo anno."
                                icon="school"
                                variant="primary"
                                className="bg-primary-container/20 border-primary/20"
                            />
                            
                            <div className="p-8 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
                                <h3 className="m3-title-large font-black mb-6 text-on-surface">Checklist Automatica</h3>
                                <ul className="space-y-4">
                                    {[
                                        { icon: "check_circle", text: "Backup completo dei dati su Drive/Locale." },
                                        { icon: "history_edu", text: "Salvataggio storico (media voti, assenze) nel profilo studente." },
                                        { icon: "delete_sweep", text: "Reset registro voti, lezioni e assenze giornaliere." },
                                        { icon: "trending_up", text: "Promozione classi (es. 1A → 2A) con gestione bocciature." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-8 m3-body-large text-on-surface-variant">
                                            <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                                            <span className="font-medium">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === "decisions" && (
                        <div className="space-y-6 py-4">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="m3-headline-small font-black text-on-surface">Esiti Scrutinio</h3>
                                <div className="flex gap-6">
                                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{stats.promote} Promossi</span>
                                    <span className="px-4 py-1.5 rounded-full bg-error/10 text-error text-[10px] font-black uppercase tracking-widest border border-error/20">{stats.retain} Bocciati</span>
                                    <span className="px-4 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border border-outline-variant/20">{stats.archive} Archiviati</span>
                                </div>
                            </div>
                            
                            <div className="bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-high/50">
                                            <th className="text-left p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Studente</th>
                                            <th className="text-left p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Classe</th>
                                            <th className="text-left p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Media</th>
                                            <th className="text-left p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant w-56">Esito</th>
                                            <th className="text-left p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Futuro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {activeStudents.map((s) => {
                                            const outcome = outcomes[s.id];
                                            const { grade } = calculatePerformance(s.id, "Complessivo", evaluations.filter(e => e.studenteId === s.id));
                                            const isInsufficient = grade && parseFloat(grade) < 6;

                                            return (
                                                <tr key={s.id} className="hover:bg-surface-container-high/30 transition-colors">
                                                    <td className="p-8 font-black text-on-surface">{s.cognome} {s.nome}</td>
                                                    <td className="p-8 text-on-surface-variant font-medium">{s.classe}</td>
                                                    <td className={`p-8 font-black ${isInsufficient ? "text-error" : "text-primary"}`}>{grade || "-"}</td>
                                                    <td className="p-8">
                                                        <select 
                                                            value={outcome?.action || "promote"} 
                                                            onChange={(e) => handleOutcomeChange(s.id, e.target.value as OutcomeType)}
                                                            className={`w-full text-xs font-black uppercase tracking-widest py-4 pl-3 pr-8 rounded-xl border-none ring-1 ring-inset ring-outline-variant/20 focus:ring-2 focus:ring-primary transition-all ${
                                                                outcome?.action === "retain" ? "bg-error/10 text-error" : 
                                                                outcome?.action === "archive" || outcome?.action === "transfer" ? "bg-surface-container-highest text-on-surface-variant" : 
                                                                "bg-primary/10 text-primary"
                                                            }`}
                                                        >
                                                            <option value="promote">Promosso</option>
                                                            <option value="retain">Bocciato</option>
                                                            <option value="transfer">Trasferito</option>
                                                            <option value="archive">Diplomato</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{outcome?.nextClass}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === "confirm" && (
                        <div className="text-center py-12 max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <span className="material-symbols-outlined text-5xl">warning</span>
                            </div>
                            <h3 className="m3-headline-medium font-black text-on-surface mb-8">Confermi l'operazione?</h3>
                            <p className="m3-body-large text-on-surface-variant mb-10 leading-relaxed">
                                L'anno scolastico verrà impostato a <strong className="text-primary">{nextYear}</strong>.
                                <br/><br/>
                                ⚠️ I dati giornalieri verranno <strong className="text-error">resettati</strong>. I dati storici saranno salvati nel profilo di ogni studente.
                            </p>
                            
                            <div className="p-6 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Riepilogo Azioni:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Reset Valutazioni e Competenze",
                                        "Reset Registro di Classe e Diario",
                                        "Reset Piani di Inclusione",
                                        "Promozione studenti secondo schema"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-6 m3-body-medium text-on-surface-variant">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
            </M3DialogContent>

            <M3DialogActions className="bg-surface-container-low/30 backdrop-blur-xl border-t border-outline-variant/10 p-6">
                    {step === "intro" && (
                        <>
                            <M3Button onClick={onClose} variant="text" className="font-black text-xs uppercase tracking-widest">Annulla</M3Button>
                            <M3Button onClick={() => setStep("decisions")} variant="filled" className="font-black text-xs uppercase tracking-widest shadow-lg">Inizia Scrutinio</M3Button>
                        </>
                    )}
                    {step === "decisions" && (
                        <>
                            <M3Button onClick={() => setStep("intro")} variant="text" className="font-black text-xs uppercase tracking-widest">Indietro</M3Button>
                            <M3Button onClick={() => setStep("confirm")} variant="filled" className="font-black text-xs uppercase tracking-widest shadow-lg">Conferma Esiti</M3Button>
                        </>
                    )}
                    {step === "confirm" && (
                        <>
                            <M3Button onClick={() => setStep("decisions")} variant="text" className="font-black text-xs uppercase tracking-widest" disabled={isProcessing}>Indietro</M3Button>
                            <M3Button onClick={handleConfirm} variant="filled" className="bg-error text-on-error font-black text-xs uppercase tracking-widest shadow-lg" disabled={isProcessing}>
                                {isProcessing ? "Elaborazione..." : "Esegui Passaggio Anno"}
                            </M3Button>
                        </>
                    )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default PassaggioAnnoWizard;
