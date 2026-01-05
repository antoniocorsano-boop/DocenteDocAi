
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
        <div className="space-y-6 animate-in fade-in">
            <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider mb-6 block px-1">Tipo Prova</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                    {EVALUATION_TYPES.map(t => (
                        <M3ChoiceCard
                            key={t}
                            icon={getTestTypeIcon(t)}
                            label={t}
                            onClick={() => setTipo(t)}
                            selected={tipo === t}
                            className="!min-h-[70px] !p-8"
                        />
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
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
        <div className="space-y-6 animate-in fade-in">
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
                    <label className="text-xs font-bold text-primary uppercase tracking-wider mb-6 block px-1">Livello Raggiunto</label>
                    <div className="space-y-2 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
                        {selectedCompetenza.livelli.map(level => (
                            <label key={level.id} className={`flex items-center p-6 rounded-xl transition-all cursor-pointer border ${selectedLevelId === level.id ? 'bg-primary-container/30 border-primary' : 'hover:bg-surface-container-high border-transparent'}`}>
                                <input type="radio" name="level" value={level.id} checked={selectedLevelId === level.id} onChange={e => setSelectedLevelId(e.target.value)} className="mr-3 accent-primary" required />
                                <span className={`text-sm ${selectedLevelId === level.id ? 'font-bold text-on-primary-container' : 'text-on-surface'}`}>{level.descrizione}</span>
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
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <div className="mb-6 px-4">
                    <h3 className="text-xl font-bold text-on-surface">{student.cognome} {student.nome}</h3>
                    <p className="text-sm text-on-surface-variant">{lesson.materia} - {new Date().toLocaleDateString('it-IT')}</p>
                </div>

                <TabGroup
                    tabs={[
                        { id: 'voto', label: 'Voto Disciplinare' },
                        { id: 'competenza', label: 'Competenza' }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'voto' | 'competenza')}
                    className="mb-6"
                />

                {activeTab === 'voto' ? renderVotoTab() : renderCompetenzaTab()}
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button
                    onClick={activeTab === 'voto' ? handleSaveVoto : handleSaveCompetenza}
                    variant="filled"
                    className="shadow-xl !px-8"
                >
                    Registra {activeTab === 'voto' ? 'Voto' : 'Competenza'}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default QuickEvaluationModal;
