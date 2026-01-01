import React, { useState } from 'react';
import { Studente, Competenza, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
import { generateCompetencyNote } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

interface CompetencyEvaluationModalProps {
    student: Studente;
    competenza: Competenza;
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onClose: () => void;
    onSave: (evaluation: Omit<ValutazioneCompetenza, 'id'>) => void;
}

const CompetencyEvaluationModal: React.FC<CompetencyEvaluationModalProps> = ({ student, competenza, settings, aiSettings, onClose, onSave }) => {
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
            open={true}
            onClose={onClose}
            maxWidth="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <M3DialogContent className="space-y-4">
                    <p className="m3-body-medium text-on-surface-variant">{student.cognome} {student.nome} - {competenza.nome}</p>

                    <div>
                        <label className="form-label">Livello Raggiunto</label>
                        <div className="space-y-2">
                            {competenza.livelli.map(level => (
                                <div key={level.id} className={`p-3 rounded-lg border-2 ${selectedLevelId === level.id ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container'}`}>
                                    <label className="flex items-start cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="level" 
                                            value={level.id}
                                            checked={selectedLevelId === level.id}
                                            onChange={(e) => setSelectedLevelId(e.target.value)}
                                            className="mr-4 mt-1"
                                            required
                                        />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-baseline">
                                                <span className="m3-title-medium">{level.nome}</span>
                                                <span className="m3-label-large text-on-surface-variant">Voto: {level.voto}</span>
                                            </div>
                                            <p className={`m3-body-medium mt-1 ${selectedLevelId === level.id ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{level.descrizione}</p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="materia" className="form-label">Materia di Riferimento</label>
                        <select id="materia" value={selectedMateria} onChange={e => setSelectedMateria(e.target.value)} className="form-select w-full" required>
                            <option value="">Seleziona...</option>
                            {(settings.disciplines || []).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="note" className="form-label !mb-0">Note (Opzionale)</label>
                            <div className="flex items-center gap-2">
                                {!selectedLevelId && !isGeneratingNote && (
                                    <span className="m3-label-small text-on-surface-variant">(Seleziona un livello)</span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleGenerateNote}
                                    disabled={isGeneratingNote || !selectedLevelId}
                                    className="button button-text !py-1 !px-2 !h-auto flex items-center gap-1"
                                    title="Genera nota con AI"
                                >
                                    {isGeneratingNote ? (
                                        <span className="material-symbols-outlined m3-body-medium animate-spin">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined m3-body-medium">auto_awesome</span>
                                    )}
                                    <span className="m3-label-medium">{isGeneratingNote ? 'Generando...' : 'Suggerisci nota'}</span>
                                </button>
                            </div>
                        </div>
                        <textarea id="note" value={nota} onChange={e => setNota(e.target.value)} className="form-textarea w-full" rows={3} placeholder="Es. Dimostra autonomia nell'applicare il concetto..."></textarea>
                    </div>
                </M3DialogContent>

                <M3DialogActions className="gap-2">
                    <button type="button" onClick={onClose} className="button button-text">Annulla</button>
                    <button type="submit" className="button button-filled">Salva Valutazione</button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default CompetencyEvaluationModal;
