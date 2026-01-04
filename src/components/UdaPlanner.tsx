import React, { useState } from 'react';
import { Uda, Competenza, UdaPlannerProps } from '../types';
import { UdaExportModal } from './UdaExportModal';
import Guidance from './Guidance';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TextArea, EmptyState } from './ui';

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
}

const UdaEditor: React.FC<UdaEditorProps> = ({ udaProp, onSaveUda, onDeleteUda, onClose, competenze }) => {
    const [currentUda, setCurrentUda] = useState<Uda>(udaProp === 'new' ? createNewUda() : { ...udaProp });
    const [isCompetencyPickerOpen, setIsCompetencyPickerOpen] = useState(false);

    const handleFieldChange = (field: keyof Uda, value: unknown) => setCurrentUda(prev => ({ ...prev, [field]: value }));
    
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
        <div className="bg-surface-container-low/30 backdrop-blur-xl rounded-5xl border border-outline-variant/20 p-8 shadow-2xl animate-in slide-in-from-right-4 duration-500 relative overflow-hidden">
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-10 border-b border-outline-variant/10 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-lg rotate-3">
                            <span className="material-symbols-outlined text-3xl">{udaProp === 'new' ? 'add_task' : 'edit_document'}</span>
                        </div>
                        <div>
                            <h2 className="m3-headline-medium font-black tracking-tight">{udaProp === 'new' ? 'Nuovo Progetto' : 'Modifica Progetto'}</h2>
                            <p className="m3-body-small text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-60 mt-1">{currentUda.title || 'Senza titolo'}</p>
                        </div>
                    </div>
                    <M3Button onClick={onClose} variant="text" className="!w-12 !h-12 !p-0 !min-w-0 !rounded-full hover:bg-surface-container-high">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </M3Button>
                </div>
                
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                    <div className="bg-surface-container-lowest/40 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 shadow-inner group transition-all hover:bg-surface-container-lowest/60">
                        <TextField 
                            label="Link Deliverable (NotebookLM)"
                            value={currentUda.externalLink || ''}
                            onChange={e => handleFieldChange('externalLink', e.target.value)}
                            placeholder="Incolla l'URL dell'analisi di NotebookLM..."
                            leadingIcon="auto_awesome"
                            className="!bg-surface/50 shadow-sm"
                        />
                        <div className="flex items-center gap-2 mt-4 px-2">
                            <span className="material-symbols-outlined text-secondary text-sm animate-pulse">auto_awesome</span>
                            <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] opacity-70">Bridge AI: Connetti il progetto al tuo spazio di lavoro esterno.</p>
                        </div>
                    </div>
                    
                    <TextArea 
                        label="Introduzione / Contesto" 
                        value={currentUda.introduction} 
                        onChange={e => handleFieldChange('introduction', e.target.value)} 
                        rows={4} 
                        placeholder="Descrivi brevemente l'argomento e il contesto didattico..." 
                    />
                    
                    <div>
                        <label className="text-[11px] text-primary font-black uppercase tracking-[0.3em] px-4 mb-3 block opacity-60">Competenze Target</label>
                        <div 
                            className="bg-surface-container-lowest/30 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/20 cursor-pointer hover:bg-surface-container-high/40 transition-all shadow-inner group flex flex-wrap gap-3 min-h-[80px] items-center" 
                            onClick={() => setIsCompetencyPickerOpen(true)}
                        >
                            {currentUda.competencyIds.length > 0 ? (
                                currentUda.competencyIds.map(id => {
                                    const c = competenze.find(comp => comp.id === id);
                                    return (
                                        <span key={id} className="bg-primary text-on-primary text-[10px] font-black px-4 py-2 rounded-full shadow-md animate-in zoom-in-95">
                                            {c?.codice}
                                        </span>
                                    );
                                })
                            ) : (
                                <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity w-full justify-center">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="text-sm font-black uppercase tracking-widest">Tocca per selezionare competenze</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-outline-variant/10">
                        {udaProp !== 'new' && (
                            <M3Button 
                                onClick={() => { if(confirm('Eliminare questo progetto?')) { onDeleteUda(currentUda.id); onClose(); }}} 
                                variant="text" 
                                className="!text-error mr-auto"
                                icon="delete"
                            >
                                Elimina
                            </M3Button>
                        )}
                        <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                        <M3Button onClick={handleSave} variant="primary" icon="save" className="shadow-xl">Salva Progetto</M3Button>
                    </div>
                </div>

                 {isCompetencyPickerOpen && (
                    <M3Dialog
                        onClose={() => setIsCompetencyPickerOpen(false)}
                        title="Seleziona Competenze"
                        maxWidth="2xl"
                        level={2}
                    >
                        <M3DialogContent className="bg-surface-container-low/30 backdrop-blur-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
                                {competenze.map(comp => {
                                    const isSelected = currentUda.competencyIds.includes(comp.id);
                                    return (
                                        <div 
                                            key={comp.id} 
                                            onClick={() => handleCompetencyToggle(comp.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected ? 'bg-primary-container text-on-primary-container border-primary/30 shadow-md' : 'bg-surface-container-lowest/50 border-transparent hover:bg-surface-container-high/50'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                                                {isSelected && <span className="material-symbols-outlined text-on-primary text-sm">check</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-xs truncate leading-none mb-1">{comp.codice}</p>
                                                <p className="truncate opacity-70 font-bold text-[10px] uppercase tracking-tighter">{comp.nome}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </M3DialogContent>
                        <M3DialogActions className="bg-surface-container-low/50 backdrop-blur-xl border-t border-outline-variant/10">
                            <M3Button onClick={() => setIsCompetencyPickerOpen(false)} variant="primary" className="w-full">Conferma Selezione</M3Button>
                        </M3DialogActions>
                    </M3Dialog>
                )}
            </div>
        </div>
    );
};

const UdaPlanner: React.FC<UdaPlannerProps & { udas?: Uda[] }> = (props) => {
    // Accept both 'uda' and 'udas' for backward compatibility
    const udas: Uda[] = Array.isArray((props as any).udas)
        ? (props as any).udas
        : Array.isArray(props.uda)
            ? props.uda
            : [];
    const { onSaveUda, onDeleteUda, aiSettings, competenze, settings, onSaveReport, showGuidanceTips } = props;
    const [editingUda, setEditingUda] = useState<Uda | 'new' | null>(null);
    const [exportingUda, setExportingUda] = useState<Uda | null>(null);

    return (
        <div className="page-layout pb-16 relative overflow-hidden animate-in fade-in duration-700">
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-0">
                    <div className="flex items-center gap-5 self-start md:self-auto">
                        <div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="material-symbols-outlined text-3xl">assignment</span>
                        </div>
                        <div>
                            <h1 className="m3-headline-medium font-black text-on-surface tracking-tight">Planner Progetti</h1>
                            <p className="m3-body-small text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-60">Organizza le tue UDA</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={() => setEditingUda('new')} 
                        variant="primary" 
                        icon="add"
                        className="shadow-xl"
                    >
                        Nuovo Progetto
                    </M3Button>
                </div>
                
                <div className="px-4 md:px-0">
                    <Guidance id="uda-planner-intro" icon="auto_awesome" title="Organizza i tuoi Progetti" isGloballyEnabled={showGuidanceTips}>
                        <p>Crea le tue Unità di Apprendimento. Puoi collegare link esterni (es. NotebookLM) per accedere velocemente alle tue analisi AI.</p>
                    </Guidance>
                </div>
                
                {editingUda ? (
                    <UdaEditor 
                        udaProp={editingUda} 
                        onSaveUda={onSaveUda} 
                        onDeleteUda={onDeleteUda} 
                        onClose={() => setEditingUda(null)} 
                        competenze={competenze}
                    />
                ) : (
                    <div className="px-4 md:px-0">
                        <div className="bg-surface-container-low/30 backdrop-blur-xl rounded-5xl border border-outline-variant/20 overflow-hidden shadow-2xl">
                            {udas.length > 0 ? (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-high/50 backdrop-blur-md">
                                                <th className="text-left p-6 m3-label-large uppercase tracking-[0.2em] opacity-60">Titolo Progetto</th>
                                                <th className="text-left p-6 m3-label-large uppercase tracking-[0.2em] opacity-60">Classe</th>
                                                <th className="text-left p-6 m3-label-large uppercase tracking-[0.2em] opacity-60">Materia</th>
                                                <th className="text-center p-6 m3-label-large uppercase tracking-[0.2em] opacity-60">AI Bridge</th>
                                                <th className="text-right p-6 m3-label-large uppercase tracking-[0.2em] opacity-60">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/10">
                                            {udas.map((uda, idx) => (
                                                <tr 
                                                    key={uda.id} 
                                                    className="group hover:bg-surface-container-high/40 transition-all cursor-pointer animate-in slide-in-from-bottom-4"
                                                    style={{ animationDelay: `${idx * 50}ms` }}
                                                    onClick={() => setEditingUda(uda)}
                                                >
                                                    <td className="p-6">
                                                        <span className="font-black text-primary group-hover:text-primary-container transition-colors">{uda.title}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="font-bold text-on-surface/70">{uda.classe}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="font-medium text-on-surface/60">{uda.materia}</span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {uda.externalLink && (
                                                            <a 
                                                                href={uda.externalLink} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                onClick={e => e.stopPropagation()}
                                                                className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:scale-125 transition-transform mx-auto"
                                                            >
                                                                <span className="material-symbols-outlined text-xl filled-icon">auto_awesome</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="p-6 text-right" onClick={e => e.stopPropagation()}>
                                                        <div className="flex justify-end gap-2">
                                                            <M3Button 
                                                                onClick={() => setExportingUda(uda)} 
                                                                variant="text" 
                                                                className="!p-2 !min-w-0 !rounded-full"
                                                            >
                                                                <span className="material-symbols-outlined">ios_share</span>
                                                            </M3Button>
                                                            <M3Button 
                                                                onClick={() => setEditingUda(uda)} 
                                                                variant="text" 
                                                                className="!p-2 !min-w-0 !rounded-full"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </M3Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20">
                                    <EmptyState 
                                        title="Nessun progetto" 
                                        description="Crea la tua prima UDA per iniziare a pianificare l'anno scolastico." 
                                        icon="assignment" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
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
