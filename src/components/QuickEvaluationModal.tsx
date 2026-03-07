// MD3 Compliant - Block M Migration (2 violations eliminated)

// M3Expressive: QuickEvaluationModal - Quick student evaluation modal with M3 tokens
import React, { useState } from 'react';
import { Studente, Lezione, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { Button, Box, Typography, Card } from '@mui/material';
import { M3Dialog, TabGroup, TextField, TextArea, SelectField } from './ui';

interface QuickEvaluationModalProps {
    student: Studente;
    lesson: Lezione;
    settings: TimetableSettings;
    onClose: () => void;
    onSaveEvaluation: (evaluation: Omit<Valutazione, 'id'>) => void;
    onSaveCompetencyEvaluation: (evaluation: Omit<ValutazioneCompetenza, 'id'>) => void;
}

const getTestTypeIcon = (tipo: string) => {
    switch(tipo) {
        case 'Scritto': return 'edit_note';
        case 'Orale': return 'record_voice_over';
        case 'Pratico': return 'build';
        case 'Test': return 'quiz';
        case 'Verifica': return 'assignment_late';
        default: return 'assignment';
    }
};

const ChoiceCard: React.FC<{ icon: string; label: string; onClick: () => void; selected: boolean }> = ({ icon, label, onClick, selected }) => (
  <Card
    component="button"
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      p: 4, borderRadius: 'var(--md-sys-shape-corner-extra-large)',
      border: `2px solid ${selected ? 'var(--md-sys-color-primary)' : 'color-mix(in srgb, var(--md-sys-color-outline-variant) 19%, transparent)'}`,
      bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'color-mix(in srgb, var(--md-sys-color-surface-container) 50%, transparent)',
      color: selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
      boxShadow: selected ? 'var(--md-sys-elevation-level4)' : 'none',
      transform: selected ? 'scale(1.05)' : 'scale(1)',
      transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      gap: 2, minWidth: 'var(--md-sys-spacing-16)', cursor: 'pointer',
      '&:hover': { border: `2px solid var(--md-sys-color-outline)`, bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)' },
    }}
  >
    <Box sx={{ width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)', color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)', boxShadow: selected ? 'var(--md-sys-elevation-level2)' : 'none', transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)' }}>
      <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', userSelect: 'none', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{icon}</Box>
    </Box>
    <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'var(--md-sys-typescale-body-small-font-family)' }}>{label}</Box>
  </Card>
);

const QuickEvaluationModal: React.FC<QuickEvaluationModalProps> = ({ student, lesson, settings, onClose, onSaveEvaluation, onSaveCompetencyEvaluation }) => {
    const [activeTab, setActiveTab] = useState<'voto' | 'competenza'>('voto');

    // State for 'voto' tab
    const [tipo, setTipo] = useState<Valutazione['tipo']>('Orale');
    const [voto, setVoto] = useState<string>('');
    const [argomento, setArgomento] = useState<string>(lesson.contenuto);
    const [noteVoto, setNoteVoto] = useState<string>('');

    // State for 'competenza' tab
    const [selectedCompetenzaId, setSelectedCompetenzaId] = useState<string>(settings.competenze[0]?.id || '');
    const [selectedLevelId, setSelectedLevelId] = useState<string>('');
    const [noteCompetenza, setNoteCompetenza] = useState<string>('');

    const handleSaveVoto = () => {
        if (!voto) {
            alert("Per favore, inserisci un voto.");
            return;
        }
        onSaveEvaluation({
            studenteId: student.id,
            materia: lesson.materia,
            data: new Date().toISOString(),
            tipo,
            voto,
            argomento,
            note: noteVoto
        });
        onClose();
    };

    const handleSaveCompetenza = () => {
        if (!selectedLevelId) {
            alert("Per favore, seleziona un livello di competenza.");
            return;
        }
        onSaveCompetencyEvaluation({
            studenteId: student.id,
            competenzaId: selectedCompetenzaId,
            livelloId: selectedLevelId,
            materia: lesson.materia,
            data: new Date().toISOString(),
            nota: noteCompetenza,
            lezioneId: lesson.id
        });
        onClose();
    };

    const selectedCompetenza = settings.competenze.find(c => c.id === selectedCompetenzaId);

    const renderVotoTab = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <Typography variant="caption" component="span">Tipo Prova</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {EVALUATION_TYPES.map(t => (
                        <ChoiceCard
                            key={t}
                            icon={getTestTypeIcon(t)}
                            label={t}
                            onClick={() => setTipo(t)}
                            selected={tipo === t}
                        />
                    ))}
                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <SelectField
                    id="voto"
                    label="Voto / Giudizio"
                    value={voto}
                    onChange={e => setVoto(e.target.value)}
                    required
                >
                    <option value="">Seleziona...</option>
                    {RATING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </SelectField>

                <TextField
                    id="argomento"
                    label="Argomento"
                    value={argomento}
                    onChange={e => setArgomento(e.target.value)}
                />

                <TextArea
                    id="note-voto"
                    label="Note"
                    value={noteVoto}
                    onChange={e => setNoteVoto(e.target.value)}
                    rows={2}
                />
            </Box>
        </Box>
    );
    
    const renderCompetenzaTab = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <SelectField
                id="competenza"
                label="Competenza"
                value={selectedCompetenzaId}
                onChange={e => {setSelectedCompetenzaId(e.target.value); setSelectedLevelId('');}}
            >
                {settings.competenze.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </SelectField>

            {selectedCompetenza && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography variant="caption" component="span">Livello Raggiunto</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        {selectedCompetenza.livelli.map(level => (
                            <Box
                                key={level.id}
                                component="label"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 'var(--md-sys-spacing-6)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                    transition: 'background-color var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                                    cursor: 'pointer',
                                    border: 'var(--md-sys-border-width-thin) solid transparent',
                                    backgroundColor: selectedLevelId === level.id ? 'var(--md-sys-color-primary-container)' : 'transparent',
                                    borderColor: selectedLevelId === level.id ? 'var(--md-sys-color-primary)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selectedLevelId === level.id
                                            ? 'var(--md-sys-color-primary-container)'
                                            : 'var(--md-sys-color-surface-container-high)' } }}
                            >
                                <input type="radio" name="level" value={level.id} checked={selectedLevelId === level.id} onChange={e => setSelectedLevelId(e.target.value)} required />
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                        color: selectedLevelId === level.id ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                                        fontWeight: selectedLevelId === level.id ? 700 : 'normal' }}
                                >{level.descrizione}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            <TextArea
                id="note-competenza"
                label="Note"
                value={noteCompetenza}
                onChange={e => setNoteCompetenza(e.target.value)}
                rows={2}
            />
        </Box>
    );

    return (
        <M3Dialog
            title="Valutazione Rapida"
            onClose={onClose}
            maxWidth="md"
            buttons={<>
                <Button onClick={onClose} variant="text">Annulla</Button>
                <Button
                    onClick={activeTab === 'voto' ? handleSaveVoto : handleSaveCompetenza}
                    variant="contained"
                >
                    Registra {activeTab === 'voto' ? 'Voto' : 'Competenza'}
                </Button>
            </>}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <Typography variant="h6">{student.cognome} {student.nome}</Typography>
                <Typography variant="body2">{lesson.materia} - {new Date().toLocaleDateString('it-IT')}</Typography>
            </Box>

            <TabGroup
                tabs={[
                    { id: 'voto', label: 'Voto Disciplinare' },
                    { id: 'competenza', label: 'Competenza' }
                ]}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'voto' | 'competenza')}
            />

            {activeTab === 'voto' ? renderVotoTab() : renderCompetenzaTab()}
        </M3Dialog>
    );
};

export default QuickEvaluationModal;

