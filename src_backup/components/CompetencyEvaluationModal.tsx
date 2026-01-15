// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { Studente, Competenza, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
import { generateCompetencyNote } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
import { useTheme } from '../theme/theme';

interface CompetencyEvaluationModalProps {
    student: Studente;
    competenza: Competenza;
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onClose: () => void;
    onSave: (evaluation: Omit<ValutazioneCompetenza, 'id'>) => void;
}

const CompetencyEvaluationModal: React.FC<CompetencyEvaluationModalProps> = ({ student, competenza, settings, aiSettings, onClose, onSave }) => {
  const { layers } = useTheme();
    const [selectedMateria, setSelectedMateria] = useState<string>((settings.disciplines && settings.disciplines[0]) || '');
    const [selectedLevelId, setSelectedLevelId] = useState<string>('');
    const [nota, setNota] = useState<string>('');
    const [isGeneratingNote, setIsGeneratingNote] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLevelId || !selectedMateria) {
            alert("Seleziona un livello e una materia.");
            return;
        }
        onSave({
            studenteId: student.id,
            competenzaId: competenza.id,
            livelloId: selectedLevelId,
            materia: selectedMateria,
            data: new Date().toISOString(),
            nota,
        });
    };

    const handleGenerateNote = async () => {
        if (!selectedLevelId) {
            alert("Per favore, seleziona prima un livello di competenza.");
            return;
        }
        const selectedLevel = competenza.livelli.find(l => l.id === selectedLevelId);
        if (!selectedLevel) return;

        setIsGeneratingNote(true);
        try {
            const generatedNote = await generateCompetencyNote(aiSettings, student, competenza, selectedLevel);
            setNota(generatedNote);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Errore sconosciuto';
            console.error("Error generating competency note:", errorMsg);
            alert("Errore durante la generazione della nota. Riprova.");
        } finally {
            setIsGeneratingNote(false);
        }
    };


    return (
        <M3Dialog
            title="Valuta Competenza"
            onClose={onClose}
            maxWidth="md"
            level={1}
        >
            <form onSubmit={handleSubmit} >
                <M3DialogContent >
                    <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['8']}}>{student.cognome} {student.nome} - {competenza.nome}</p>

                    <div>
                        <label >Livello Raggiunto</label>
                        <div style={{marginTop: layers.ref.spacing['8']}}>
                            {competenza.livelli.map(level => (
                                <div key={level.id} className={`p-12 rounded-[var(--md-sys-shape-corner-large)] border-2 ${selectedLevelId === level.id ? 'border-primary bg-primary-container' : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container)]'}`}>
                                    <label style={{ display: "flex", alignItems: "flex-start", cursor: "pointer" }}>
                                        <input 
                                            type="radio" 
                                            name="level" 
                                            value={level.id}
                                            checked={selectedLevelId === level.id}
                                            onChange={(e) => setSelectedLevelId(e.target.value)}
                                            
                                            required
                                        />
                                        <div style={{ flexGrow: "1" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <span >{level.nome}</span>
                                                <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Voto: {level.voto}</span>
                                            </div>
                                            <p className={`text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] mt-8 ${selectedLevelId === level.id ? 'text-on-primary-container' : 'text-[var(--md-sys-color-on-surface)]-variant'}`}>{level.descrizione}</p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="materia" >Materia di Riferimento</label>
                        <select id="materia" value={selectedMateria} onChange={e => setSelectedMateria(e.target.value)}  style={{ width: "100%" }} required>
                            <option value="">Seleziona...</option>
                            {(settings.disciplines || []).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div>
                        <div  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label htmlFor="note" >Note (Opzionale)</label>
                            <div  style={{ display: "flex", alignItems: "center" }}>
                                {!selectedLevelId && !isGeneratingNote && (
                                    <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>(Seleziona un livello)</span>
                                )}
                                <M3Button
                                    type="button"
                                    onClick={handleGenerateNote}
                                    disabled={isGeneratingNote || !selectedLevelId}
                                    variant="text"
                                     style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}
                                    title="Genera nota con AI"
                                >
                                    {isGeneratingNote ? (
                                        <span style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }}>sync</span>
                                    ) : (
                                        <span style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }}>auto_awesome</span>
                                    )}
                                    <span >{isGeneratingNote ? 'Generando...' : 'Suggerisci nota'}</span>
                                </M3Button>
                            </div>
                        </div>
                        <textarea id="note" value={nota} onChange={e => setNota(e.target.value)}  style={{ width: "100%" }} rows={3} placeholder="Es. Dimostra autonomia nell'applicare il concetto..."></textarea>
                    </div>
                </M3DialogContent>

                <M3DialogActions  style={{ paddingTop: "0" }}>
                    <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                    <M3Button type="submit" variant="filled">Salva Valutazione</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default CompetencyEvaluationModal;



