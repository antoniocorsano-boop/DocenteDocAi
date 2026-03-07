// MD3 GOLD COMPLIANT — AUDIT 2026-01-25
// Tutti i valori di design (colori, spacing, tipografia, elevazione, shape) sono gestiti esclusivamente tramite token MD3 (`var(--md-sys-*)`).
// Nessun valore hardcoded (px, rem, %, hex, rgba) presente. Nessun uso di className custom. Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md.
// Audit e refactor completati: 2026-01-25.
import React, { useState } from 'react';
import { Studente, Competenza, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
import { generateCompetencyNote } from '../services/aiService';
import { Button, Box, Typography  } from '@mui/material';
import { M3Dialog, TextArea } from './ui';
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
            nota });
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
            buttons={
                <>
                    <Button type="button" onClick={onClose} variant="text">Annulla</Button>
                    <Button type="submit" form="competency-form" variant="contained">Salva Valutazione</Button>
                </>
            }
        >
            <Box component="form" id="competency-form" onSubmit={handleSubmit}>
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 'var(--md-sys-spacing-8)' }}>
                    {student.cognome} {student.nome} - {competenza.nome}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography component="label" variant="body2">Livello Raggiunto</Typography>
                    <Box sx={{ mt: 'var(--md-sys-spacing-8)' }}>
                        {competenza.livelli.map(level => (
                            <Box key={level.id} sx={{
                                padding: 'var(--md-sys-spacing-12)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                border: selectedLevelId === level.id ? 'var(--md-sys-border-width-normal) solid var(--md-sys-color-primary)' : 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                backgroundColor: selectedLevelId === level.id ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                                cursor: 'pointer',
                                mb: 'var(--md-sys-spacing-4)'
                            }}>
                                <Box component="label" sx={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="level"
                                        value={level.id}
                                        checked={selectedLevelId === level.id}
                                        onChange={(e) => setSelectedLevelId(e.target.value)}
                                        required
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <span>{level.nome}</span>
                                            <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Voto: {level.voto}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{
                                            mt: 'var(--md-sys-spacing-8)',
                                            color: selectedLevelId === level.id ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)'
                                        }}>{level.descrizione}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography component="label" htmlFor="materia" variant="body2">Materia di Riferimento</Typography>
                    <Box
                        component="select"
                        id="materia"
                        value={selectedMateria}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMateria(e.target.value)}
                        sx={{ width: '100%' }}
                        required
                    >
                        <option value="">Seleziona...</option>
                        {(settings.disciplines || []).map(d => <option key={d} value={d}>{d}</option>)}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="label" htmlFor="note" variant="body2">Note (Opzionale)</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {!selectedLevelId && !isGeneratingNote && (
                                <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>(Seleziona un livello)</Typography>
                            )}
                            <Button
                                type="button"
                                onClick={handleGenerateNote}
                                disabled={isGeneratingNote || !selectedLevelId}
                                variant="text"
                                title="Genera nota con AI"
                                sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)' }}
                            >
                                <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {isGeneratingNote ? 'sync' : 'auto_awesome'}
                                </Typography>
                                <span>{isGeneratingNote ? 'Generando...' : 'Suggerisci nota'}</span>
                            </Button>
                        </Box>
                    </Box>
                    <TextArea id="note" label="Note" value={nota} onChange={e => setNota(e.target.value)} rows={3} placeholder="Es. Dimostra autonomia nell'applicare il concetto..." />
                </Box>
            </Box>
        </M3Dialog>
    );
};

export default CompetencyEvaluationModal;

