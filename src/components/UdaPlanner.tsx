import React, { useState, useMemo, useEffect } from 'react';
import { Uda, AiSettings, KnowledgeBaseEntry, Lezione, Competenza, TimetableSettings, Report, UdaPlannerProps, EventoCalendario, CurriculumSubject } from '../types';
import { validateUdaVerticalCurriculum } from '../services/aiService';
import { UdaExportModal } from './UdaExportModal';
import Guidance from './Guidance';
import { parseClassString } from '../utils/schoolUtils';
import { InfoCard, TextField, TextArea, SelectField, EmptyState } from './M3Components';

const createNewUda = (): Uda => ({
    id: `uda-${Date.now()}`,
    title: '',
    classe: '',
    materia: '',
    introduction: '',
    finalProduct: '',
    competencyIds: [],
    phases: [{ id: `phase-${Date.now()}`, title: '', description: '', activities: '', duration: '' }],
    evaluation: '',
    tools: '',
    externalLink: ''
});

interface UdaEditorProps {
    udaProp: Uda | 'new';
    onSaveUda: (uda: Uda) => void;
    onDeleteUda: (id: string) => void;
    onClose: () => void;
    competenze: Competenza[];
    knowledgeBase: KnowledgeBaseEntry[];
    aiSettings: AiSettings;
    eventi: EventoCalendario[];
    curricula: CurriculumSubject[]; 
}

const UdaEditor: React.FC<UdaEditorProps> = ({ udaProp, onSaveUda, onDeleteUda, onClose, competenze, knowledgeBase, aiSettings, eventi, curricula }) => {
    const [currentUda, setCurrentUda] = useState<Uda>(udaProp === 'new' ? createNewUda() : { ...udaProp });
    const [isCompetencyPickerOpen, setIsCompetencyPickerOpen] = useState(false);

    const handleFieldChange = (field: keyof Uda, value: any) => setCurrentUda(prev => ({ ...prev, [field]: value }));
    
    const handleCompetencyToggle = (id: string) => setCurrentUda(prev => ({ 
        ...prev, 
        competencyIds: prev.competencyIds.includes(id) 
            ? prev.competencyIds.filter(c => c !== id) 
            : [...prev.competencyIds, id] 
    }));
    
    const handleSave = () => {
        if (!currentUda.title || !currentUda.classe) { alert("Titolo e Classe obbligatori."); return; }
        onSaveUda(currentUda);
        onClose();
    };

    return (
        <div className="card border-l-4 border-l-tertiary animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-6">
                <div>
                    <h2 className="m3-headline-medium font-black">{udaProp === 'new' ? 'Nuovo Progetto' : 'Modifica Progetto'}</h2>
                    <p className="m3-body-medium text-on-surface-variant font-bold opacity-60 uppercase tracking-widest text-[10px] mt-1">{currentUda.title || 'Senza titolo'}</p>
                </div>
                <button onClick={onClose} className="icon-button"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <TextField 
                            label="Titolo UDA" 
                            value={currentUda.title} 
                            onChange={e => handleFieldChange('title', e.target.value)} 
                            placeholder="Es. Il Rinascimento Scientifico" 
                            required
                        />
                    </div>
                    <TextField 
                        label="Classe" 
                        value={currentUda.classe} 
                        onChange={e => handleFieldChange('classe', e.target.value)} 
                        placeholder="Es. 3A" 
                        required
                    />
                    <TextField 
                        label="Materia" 
                        value={currentUda.materia} 
                        onChange={e => handleFieldChange('materia', e.target.value)} 
                        placeholder="Es. Storia" 
                        required
                    />
                </div>

                <div className="bg-secondary-container/10 p-5 rounded-[32px] border border-secondary/20">
                    <TextField 
                        label="Link Deliverable (NotebookLM)"
                        value={currentUda.externalLink || ''}
                        onChange={e => handleFieldChange('externalLink', e.target.value)}
                        placeholder="Incolla l'URL dell'analisi di NotebookLM..."
                        leadingIcon="auto_awesome"
                        containerClassName="!bg-surface shadow-sm"
                    />
                    <p className="text-[10px] text-secondary font-black uppercase mt-3 px-2 tracking-widest opacity-70">Bridge AI: Connetti il progetto al tuo spazio di lavoro esterno.</p>
                </div>
                
                <TextArea 
                    label="Introduzione / Contesto" 
                    value={currentUda.introduction} 
                    onChange={e => handleFieldChange('introduction', e.target.value)} 
                    rows={3} 
                    placeholder="Descrivi brevemente l'argomento e il contesto didattico..." 
                />
                
                <div>
                    <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2 mb-2 block">Competenze Target</label>
                    <div className="bg-surface-container p-5 rounded-[24px] border border-outline-variant cursor-pointer hover:bg-surface-container-high transition-all shadow-inner group" onClick={() => setIsCompetencyPickerOpen(true)}>
                        <div className="flex flex-wrap gap-2">
                            {currentUda.competencyIds.length > 0 ? (
                                currentUda.competencyIds.map(id => {
                                    const c = competenze.find(comp => comp.id === id);
                                    return <span key={id} className="chip text-[10px] font-black px-3 h-7 bg-primary text-on-primary border-none shadow-sm">{c?.codice}</span>
                                })
                            ) : <span className="text-sm italic opacity-40 font-bold uppercase tracking-widest">Tocca per selezionare competenze</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
                    {udaProp !== 'new' && (
                        <button onClick={() => { if(confirm('Eliminare questo progetto?')) { onDeleteUda(currentUda.id); onClose(); }}} className="button button-outlined !text-error !border-error mr-auto !rounded-2xl">
                            <span className="material-symbols-outlined mr-2">delete</span> Elimina
                        </button>
                    )}
                    <button onClick={onClose} className="button button-text">Annulla</button>
                    <button onClick={handleSave} className="button button-filled shadow-xl">Salva Progetto</button>
                </div>
            </div>

             {isCompetencyPickerOpen && (
                <div className="dialog-backdrop" onClick={() => setIsCompetencyPickerOpen(false)}>
                     <div className="dialog-container w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h2 className="m3-headline-medium font-black">Seleziona Competenze</h2>
                            <button onClick={() => setIsCompetencyPickerOpen(false)} className="icon-button"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="dialog-content overflow-y-auto">
                            <div className="m3-chip-grid p-2">
                                {competenze.map(comp => (
                                     <div key={comp.id} className="chip-checkbox w-full">
                                        <input type="checkbox" id={`comp-${comp.id}`} checked={currentUda.competencyIds.includes(comp.id)} onChange={() => handleCompetencyToggle(comp.id)}/>
                                        <label htmlFor={`comp-${comp.id}`} className={`chip w-full !justify-start !h-14 !px-4 ${currentUda.competencyIds.includes(comp.id) ? 'chip-selected' : ''}`}>
                                            {currentUda.competencyIds.includes(comp.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                            <div className="min-w-0">
                                                <p className="font-black text-xs truncate leading-none">{comp.codice}</p>
                                                <p className="truncate opacity-70 font-bold text-[10px]">{comp.nome}</p>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="dialog-footer border-t border-outline-variant"><button onClick={() => setIsCompetencyPickerOpen(false)} className="button button-filled w-full">Conferma Selezione</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UdaPlanner: React.FC<UdaPlannerProps> = (props) => {
    const { udas, onSaveUda, onDeleteUda, aiSettings, knowledgeBase, competenze, settings, onSaveReport, onNavigate, showGuidanceTips, eventi, curricula = [] } = props;
    const [editingUda, setEditingUda] = useState<Uda | 'new' | null>(null);
    const [exportingUda, setExportingUda] = useState<Uda | null>(null);

    return (
        <div className="page-container-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="m3-display-small font-black">Planner Progetti</h1>
                <button onClick={() => setEditingUda('new')} className="button button-filled shadow-xl">
                    <span className="material-symbols-outlined mr-2 font-black">add</span>Nuovo Progetto
                </button>
            </div>
            
            <Guidance id="uda-planner-intro" icon="assignment" title="Organizza i tuoi Progetti" isGloballyEnabled={showGuidanceTips}>
                <p>Crea le tue Unità di Apprendimento. Puoi collegare link esterni (es. NotebookLM) per accedere velocemente alle tue analisi AI.</p>
            </Guidance>
            
            {editingUda ? (
                <UdaEditor 
                    udaProp={editingUda} 
                    onSaveUda={onSaveUda} 
                    onDeleteUda={onDeleteUda} 
                    onClose={() => setEditingUda(null)} 
                    competenze={competenze}
                    knowledgeBase={knowledgeBase}
                    aiSettings={aiSettings}
                    eventi={eventi}
                    curricula={curricula}
                />
            ) : (
                <div className="card !p-0 overflow-hidden">
                    {udas.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead className="bg-surface-container-high">
                                    <tr>
                                        <th className="w-1/3">Titolo Progetto</th>
                                        <th>Classe</th>
                                        <th>Materia</th>
                                        <th className="text-center">AI Bridge</th>
                                        <th className="text-right px-6">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {udas.map(uda => (
                                    <tr key={uda.id} className="interactive-row hover:bg-surface-container-low" onClick={() => setEditingUda(uda)}>
                                        <td className="font-black text-primary">{uda.title}</td>
                                        <td className="font-bold">{uda.classe}</td>
                                        <td className="font-medium">{uda.materia}</td>
                                        <td className="text-center">
                                            {uda.externalLink && (
                                                <a 
                                                    href={uda.externalLink} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-secondary hover:scale-125 inline-block transition-transform"
                                                >
                                                    <span className="material-symbols-outlined filled-icon">auto_awesome</span>
                                                </a>
                                            )}
                                        </td>
                                        <td className="text-right px-4" onClick={e => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => setExportingUda(uda)} className="icon-button" title="Esporta"><span className="material-symbols-outlined">ios_share</span></button>
                                                <button onClick={() => setEditingUda(uda)} className="icon-button" title="Modifica"><span className="material-symbols-outlined">edit</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState title="Nessun progetto" description="Crea la tua prima UDA per iniziare a pianificare l'anno scolastico." icon="assignment" />
                    )}
                </div>
            )}
            
             {exportingUda && (
                <UdaExportModal 
                    uda={exportingUda} 
                    aiSettings={aiSettings} 
                    competenze={competenze} 
                    settings={settings} 
                    onClose={() => setExportingUda(null)} 
                    onSaveReport={onSaveReport} 
                />
            )}
        </div>
    );
};

export default UdaPlanner;
