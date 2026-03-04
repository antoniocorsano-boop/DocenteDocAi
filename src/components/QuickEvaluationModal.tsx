// MD3 Compliant - Block M Migration (2 violations eliminated)

// M3Expressive: QuickEvaluationModal - Quick student evaluation modal with M3 tokens
import React, { useState } from 'react';
import { Studente, Lezione, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, M3ChoiceCard, TextField, TextArea, SelectField } from './ui';

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
        <div >
            <div>
                <label >Tipo Prova</label>
                <div >
                    {EVALUATION_TYPES.map(t => (
                        <M3ChoiceCard
                            key={t}
                            icon={getTestTypeIcon(t)}
                            label={t}
                            onClick={() => setTipo(t)}
                            selected={tipo === t}
                            
                        />
                    ))}
                </div>
            </div>
            
            <div >
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
            </div>
        </div>
    );
    
    const renderCompetenzaTab = () => (
        <div >
            <SelectField
                id="competenza"
                label="Competenza"
                value={selectedCompetenzaId}
                onChange={e => {setSelectedCompetenzaId(e.target.value); setSelectedLevelId('');}}
            >
                {settings.competenze.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </SelectField>

            {selectedCompetenza && (
                <div>
                    <label >Livello Raggiunto</label>
                    <div >
                        {selectedCompetenza.livelli.map(level => (
                            <label key={level.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 'var(--md-sys-spacing-6)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                                cursor: 'pointer',
                                border: 'var(--md-sys-border-width-thin) solid transparent',
                                backgroundColor: selectedLevelId === level.id ? 'var(--md-sys-color-primary-container)' : 'transparent',
                                borderColor: selectedLevelId === level.id ? 'var(--md-sys-color-primary)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedLevelId !== level.id) {
                                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedLevelId !== level.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}>
                                <input type="radio" name="level" value={level.id} checked={selectedLevelId === level.id} onChange={e => setSelectedLevelId(e.target.value)}  required />
                                <span style={{
                                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                    color: selectedLevelId === level.id ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                                    fontWeight: selectedLevelId === level.id ? 700 : 'normal'
                                }}>{level.descrizione}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <TextArea
                id="note-competenza"
                label="Note"
                value={noteCompetenza}
                onChange={e => setNoteCompetenza(e.target.value)}
                rows={2}
            />
        </div>
    );

    return (
        <M3Dialog
            title="Valutazione Rapida"
            onClose={onClose}
            maxWidth="md"
            level={1}
        >
            <M3DialogContent >
                <div >
                    <h3 >{student.cognome} {student.nome}</h3>
                    <p >{lesson.materia} - {new Date().toLocaleDateString('it-IT')}</p>
                </div>

                <TabGroup
                    tabs={[
                        { id: 'voto', label: 'Voto Disciplinare' },
                        { id: 'competenza', label: 'Competenza' }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'voto' | 'competenza')}
                    
                />

                {activeTab === 'voto' ? renderVotoTab() : renderCompetenzaTab()}
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button
                    onClick={activeTab === 'voto' ? handleSaveVoto : handleSaveCompetenza}
                    variant="filled"
                    
                >
                    Registra {activeTab === 'voto' ? 'Voto' : 'Competenza'}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default QuickEvaluationModal;

