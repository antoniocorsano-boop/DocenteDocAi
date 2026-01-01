
import React, { useState } from 'react';
import { Studente, Lezione, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { TabGroup, M3ChoiceCard } from './M3Components';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

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
            alert("Per favor, inserisci un voto.");
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
        <div className="space-y-4 animate-in fade-in">
            <div>
                <label className="form-label">Tipo Prova</label>
                <div className="flex gap-2">
                    {EVALUATION_TYPES.map(t => (
                        <M3ChoiceCard
                            key={t}
                            icon={getTestTypeIcon(t)}
                            label={t}
                            onClick={() => setTipo(t)}
                            selected={tipo === t}
                            className="!min-h-[70px] !p-2"
                        />
                    ))}
                </div>
            </div>
            
            <div className="form-grid-2">
                <div className="col-span-2">
                    <label htmlFor="voto" className="form-label">Voto / Giudizio</label>
                    <select id="voto" value={voto} onChange={e => setVoto(e.target.value)} className="form-select w-full" required>
                        <option value="">Seleziona...</option>
                        {RATING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="argomento" className="form-label">Argomento</label>
                <input type="text" id="argomento" value={argomento} onChange={e => setArgomento(e.target.value)} className="form-input w-full"/>
            </div>
            <div>
                <label htmlFor="note-voto" className="form-label">Note</label>
                <textarea id="note-voto" value={noteVoto} onChange={e => setNoteVoto(e.target.value)} className="form-textarea w-full" rows={2}></textarea>
            </div>
        </div>
    );
    
    const renderCompetenzaTab = () => (
        <div className="space-y-4 animate-in fade-in">
            <div>
                <label htmlFor="competenza" className="form-label">Competenza</label>
                <select id="competenza" value={selectedCompetenzaId} onChange={e => {setSelectedCompetenzaId(e.target.value); setSelectedLevelId('');}} className="form-select w-full">
                    {settings.competenze.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
            </div>
            {selectedCompetenza && (
                <div>
                    <label className="form-label">Livello Raggiunto</label>
                    <div className="selection-container">
                        {selectedCompetenza.livelli.map(level => (
                            <label key={level.id} className="flex items-center p-3 rounded-md hover:bg-surface-container-high cursor-pointer border border-transparent hover:border-outline-variant">
                                <input type="radio" name="level" value={level.id} checked={selectedLevelId === level.id} onChange={e => setSelectedLevelId(e.target.value)} className="mr-3 accent-primary" required />
                                <span>{level.descrizione}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <label htmlFor="note-competenza" className="form-label">Note</label>
                <textarea id="note-competenza" value={noteCompetenza} onChange={e => setNoteCompetenza(e.target.value)} className="form-textarea w-full" rows={2}></textarea>
            </div>
        </div>
    );

    return (
        <M3Dialog
            title="Valutazione Rapida"
            headline={`${student.cognome} ${student.nome}`}
            onClose={onClose}
            maxWidth="md"
        >
            <M3DialogContent>
                <div className="pt-2 pb-4">
                    {/* Using TabGroup instead of m3-option-group for better semantics here */}
                    <TabGroup 
                        tabs={[
                            { id: 'voto', label: 'Voto Numerico', icon: 'looks_one' },
                            { id: 'competenza', label: 'Competenza', icon: 'psychology' }
                        ]}
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as 'voto' | 'competenza')}
                        variant="secondary"
                    />
                </div>
                
                <div>
                    {activeTab === 'voto' ? renderVotoTab() : renderCompetenzaTab()}
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <button type="button" onClick={onClose} className="button button-text">Annulla</button>
                <button type="button" onClick={activeTab === 'voto' ? handleSaveVoto : handleSaveCompetenza} className="button button-filled">
                    Salva Valutazione
                </button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default QuickEvaluationModal;
