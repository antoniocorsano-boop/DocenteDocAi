// LEGACY - MD3 Non-compliant

import React, { useState, useMemo, useEffect } from 'react';
import { Studente, TimetableSettings, Valutazione, ValutazioneCompetenza, RegisterEntry, StudentHistoryRecord } from '../types';
import { getNextClass } from '../utils/schoolUtils';
import { calculatePerformance } from '../utils/evaluationUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor: layers.sys.color.surfaceContainerLow }}>
                    {step === "intro" && (
                        <div  style={{gap: layers.ref.spacing['8'], marginLeft: "auto", marginRight: "auto", paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>
                            <InfoCard 
                                title={`Chiusura Anno ${settings.annoScolasticoCorrente}`}
                                description="Procedura guidata per archiviare i dati, calcolare lo storico e preparare le classi per il nuovo anno."
                                icon="school"
                                variant="primary"
                                style={{ backgroundColor: sys.colors.primary-container/20 }}
                            />
                            
                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50, borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                                <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{fontWeight: "900", marginBottom: layers.ref.spacing['6']}}>Checklist Automatica</h3>
                                <ul style={{marginTop: layers.ref.spacing['4']}}>
                                    {[
                                        { icon: "check_circle", text: "Backup completo dei dati su Drive/Locale." },
                                        { icon: "history_edu", text: "Salvataggio storico (media voti, assenze) nel profilo studente." },
                                        { icon: "delete_sweep", text: "Reset registro voti, lezioni e assenze giornaliere." },
                                        { icon: "trending_up", text: "Promozione classi (es. 1A → 2A) con gestione bocciature." }
                                    ].map((item, i) => (
                                        <li key={i} style={{ color: sys.colors.[var(--md-sys-typescale-body-large)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                            <span  style={{color: "layers.sys.colors.primary", fontSize: "1.5rem"}}>{item.icon}</span>
                                            <span style={{ fontWeight: "500" }}>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === "decisions" && (
                        <div style={{gap: layers.ref.spacing['6'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['8']}}>
                                <h3 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)], color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "900" }}>Esiti Scrutinio</h3>
                                <div style={{display: "flex", gap: layers.ref.spacing['6']}}>
                                    <span style={{ backgroundColor: sys.colors.primary/10, color: sys.colors.[10px] }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999], color: "layers.sys.colors.primary", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid layers.sys.colors.outline"}}>{stats.promote} Promossi</span>
                                    <span style={{ backgroundColor: sys.colors.error/10, color: sys.colors.[10px] }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999], color: "layers.sys.colors.error", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid layers.sys.colors.outline"}}>{stats.retain} Bocciati</span>
                                    <span style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]est, color: sys.colors.[var(--md-sys-color-on-surface)]-variant, color: sys.colors.[10px] }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid layers.sys.colors.outline"}}>{stats.archive} Archiviati</span>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50, borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline"}}>
                                <table  style={{ width: "100%" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/50 }}>
                                            <th style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "left", padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em"}}>Studente</th>
                                            <th style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "left", padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em"}}>Classe</th>
                                            <th style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "left", padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em"}}>Media</th>
                                            <th style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "left", padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em"}}>Esito</th>
                                            <th style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "left", padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em"}}>Futuro</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {activeStudents.map((s) => {
                                            const outcome = outcomes[s.id];
                                            const { grade } = calculatePerformance(s.id, "Complessivo", evaluations.filter(e => e.studenteId === s.id));
                                            const isInsufficient = grade && parseFloat(grade) < 6;

                                            return (
                                                <tr key={s.id}  style={{ transition: "color 300ms" }}>
                                                    <td style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{padding: layers.ref.spacing['8'], fontWeight: "900"}}>{s.cognome} {s.nome}</td>
                                                    <td style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{padding: layers.ref.spacing['8'], fontWeight: "500"}}>{s.classe}</td>
                                                    <td className={`p-8 font-black ${isInsufficient ? "text-error" : "text-primary"}`}>{grade || "-"}</td>
                                                    <td style={{padding: layers.ref.spacing['6']}}>
                                                        <select 
                                                            value={outcome?.action || "promote"} 
                                                            onChange={(e) => handleOutcomeChange(s.id, e.target.value as OutcomeType)}
                                                            className={`w-full text-xs font-black uppercase tracking-widest py-4 pl-3 pr-8 rounded-[var(--md-sys-shape-corner-medium)] border-none ring-1 ring-inset ring-outline-variant/20 focus:ring-2 focus:ring-primary transition-all ${
                                                                outcome?.action === "retain" ? "bg-error/10 text-error" : 
                                                                outcome?.action === "archive" || outcome?.action === "transfer" ? "bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant" : 
                                                                "bg-primary/10 text-primary"
                                                            }`}
                                                        >
                                                            <option value="promote">Promosso</option>
                                                            <option value="retain">Bocciato</option>
                                                            <option value="transfer">Trasferito</option>
                                                            <option value="archive">Diplomato</option>
                                                        </select>
                                                    </td>
                                                    <td style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{padding: layers.ref.spacing['8'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6"}}>{outcome?.nextClass}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === "confirm" && (
                        <div  style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
                            <div style={{ backgroundColor: sys.colors.error/10, borderRadius: ref.shape[] }} style={{width: ref.spacing[96], height: ref.spacing[96], color: "layers.sys.colors.error", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: layers.ref.spacing['8']}}>
                                <span style={{ color: sys.colors.5xl }}>warning</span>
                            </div>
                            <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{fontWeight: "900", marginBottom: layers.ref.spacing['8']}}>Confermi l'operazione?</h3>
                            <p style={{ color: sys.colors.[var(--md-sys-typescale-body-large)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ lineHeight: "1.625" }}>
                                L'anno scolastico verr� impostato a <strong style={{color: 'layers.sys.colors.primary'}}>{nextYear}</strong>.
                                <br/><br/>
                                ?? I dati giornalieri verranno <strong style={{color: "layers.sys.colors.error"}}>resettati</strong>. I dati storici saranno salvati nel profilo di ogni studente.
                            </p>
                            
                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50, borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline", textAlign: "left"}}>
                                <p style={{ color: sys.colors.[10px] }} style={{fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.colors.primary", marginBottom: layers.ref.spacing['8']}}>Riepilogo Azioni:</p>
                                <ul style={{gap: layers.ref.spacing['3']}}>
                                    {[
                                        "Reset Valutazioni e Competenze",
                                        "Reset Registro di Classe e Diario",
                                        "Reset Piani di Inclusione",
                                        "Promozione studenti secondo schema"
                                    ].map((text, i) => (
                                        <li key={i} style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                                            <span  style={{borderRadius: ref.spacing[9999], backgroundColor: "layers.sys.colors.primary"}}></span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
            </M3DialogContent>

            <M3DialogActions style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30 }} style={{borderTop: "1px solid layers.sys.colors.outline", padding: layers.ref.spacing['6']}}>
                    {step === "intro" && (
                        <>
                            <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                            <M3Button onClick={() => setStep("decisions")} variant="filled"  style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Inizia Scrutinio</M3Button>
                        </>
                    )}
                    {step === "decisions" && (
                        <>
                            <M3Button onClick={() => setStep("intro")} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Indietro</M3Button>
                            <M3Button onClick={() => setStep("confirm")} variant="filled"  style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Conferma Esiti</M3Button>
                        </>
                    )}
                    {step === "confirm" && (
                        <>
                            <M3Button onClick={() => setStep("decisions")} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }} disabled={isProcessing}>Indietro</M3Button>
                            <M3Button onClick={handleConfirm} variant="filled" style={{ backgroundColor: sys.colors.error, color: sys.colors.on-error }} style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }} disabled={isProcessing}>
                                {isProcessing ? "Elaborazione..." : "Esegui Passaggio Anno"}
                            </M3Button>
                        </>
                    )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default PassaggioAnnoWizard;




