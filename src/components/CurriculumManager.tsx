import React, { useState } from 'react';
import { CurriculumSubject, CurriculumNucleo, AiSettings, TimetableSettings, View } from '../types';
import { parseCurriculumFromText } from '../services/aiService';
import { extractTextFromFile } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import AiThinkingGem from './AiThinkingGem';
import { TabGroup, EmptyState, TextField, TextArea, SelectField } from './M3Components';
import { M3Dialog } from './M3Dialog';

interface CurriculumManagerProps {
    curricula: CurriculumSubject[];
    onUpdateCurricula: (curricula: CurriculumSubject[]) => void;
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onNavigate: (view: View) => void;
}

const CurriculumManager: React.FC<CurriculumManagerProps> = ({ curricula, onUpdateCurricula, settings, aiSettings, onNavigate }) => {
    const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importText, setImportText] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    
    const [newSubject, setNewSubject] = useState(settings.disciplines[0] || '');
    const [newGradeLevel, setNewGradeLevel] = useState('Classi Prime');
    const [activeTab, setActiveTab] = useState<'editor' | 'coverage'>('editor');

    const selectedCurriculum = curricula.find(c => c.id === selectedCurriculumId);

    const handleCreate = () => {
        const newCurr: CurriculumSubject = {
            id: `curr-${Date.now()}`,
            subject: newSubject,
            gradeLevel: newGradeLevel,
            nuclei: [],
            lastUpdated: new Date().toISOString()
        };
        onUpdateCurricula([...curricula, newCurr]);
        setSelectedCurriculumId(newCurr.id);
        setActiveTab('editor');
    };

    const handleDelete = (id: string) => {
        if (confirm("Sei sicuro?")) {
            onUpdateCurricula(curricula.filter(c => c.id !== id));
            if (selectedCurriculumId === id) setSelectedCurriculumId(null);
        }
    };

    const handleUpdate = (updatedCurr: CurriculumSubject) => {
        onUpdateCurricula(curricula.map(c => c.id === updatedCurr.id ? updatedCurr : c));
    };

    const handleImportAI = async () => {
        if (!importText.trim() || !selectedCurriculum) return;
        setIsProcessingAI(true);
        try {
            const parsed = await parseCurriculumFromText(aiSettings, importText, selectedCurriculum.subject, selectedCurriculum.gradeLevel);
            const updated: CurriculumSubject = {
                ...selectedCurriculum,
                nuclei: [...selectedCurriculum.nuclei, ...parsed.nuclei],
                lastUpdated: new Date().toISOString()
            };
            handleUpdate(updated);
            setIsImporting(false);
            setImportText('');
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Errore sconosciuto';
            alert("Errore AI: " + errorMsg);
        } finally {
            setIsProcessingAI(false);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const text = await extractTextFromFile(acceptedFiles[0]);
            setImportText(text);
        }
    };

    const { getRootProps, getInputProps } = useFileDrop({ onDrop, accept: 'application/pdf,text/plain', multiple: false });

    const renderEditor = () => {
        if (!selectedCurriculum) return null;
        return (
            <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-surface-container-lowest">
                {selectedCurriculum.nuclei.length === 0 && (
                    <EmptyState title="Programma Vuoto" description="Inizia importando un documento o aggiungendo i nuclei fondanti." icon="library_books" />
                )}
                {selectedCurriculum.nuclei.map((nucleo, nIdx) => (
                    <div key={nucleo.id} className="card border-l-4 border-l-primary !bg-surface-container-low shadow-md hover:shadow-lg transition-shadow !rounded-[32px]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-grow">
                                <TextField 
                                    label="Titolo Nucleo Fondante" 
                                    value={nucleo.title} 
                                    onChange={(e) => {
                                        const newNuclei = [...selectedCurriculum.nuclei];
                                        newNuclei[nIdx].title = e.target.value;
                                        handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                    }}
                                    containerClassName="!mb-0"
                                />
                            </div>
                            <button onClick={() => {
                                const newNuclei = selectedCurriculum.nuclei.filter(n => n.id !== nucleo.id);
                                handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                            }} className="icon-button text-error ml-2 mt-7" title="Elimina Nucleo"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                        <div className="space-y-3 pl-4 border-l-2 border-outline-variant/30">
                            {nucleo.objectives.map((obj, oIdx) => (
                                <div key={obj.id} className="flex gap-2 items-center group">
                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${obj.type === 'skill' ? 'bg-tertiary' : 'bg-secondary'}`}></span>
                                    <input 
                                        className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 font-bold text-on-surface border-b border-transparent hover:border-outline-variant focus:border-primary transition-all"
                                        value={obj.text}
                                        onChange={(e) => {
                                            const newNuclei = [...selectedCurriculum.nuclei];
                                            newNuclei[nIdx].objectives[oIdx].text = e.target.value;
                                            handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                        }}
                                        placeholder="Inserisci obiettivo..."
                                    />
                                    <button onClick={() => {
                                        const newNuclei = [...selectedCurriculum.nuclei];
                                        newNuclei[nIdx].objectives = newNuclei[nIdx].objectives.filter(o => o.id !== obj.id);
                                        handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                    }} className="opacity-0 group-hover:opacity-100 icon-button !w-8 !h-8 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><span className="material-symbols-outlined text-xs">close</span></button>
                                </div>
                            ))}
                            <button onClick={() => {
                                const newNuclei = [...selectedCurriculum.nuclei];
                                newNuclei[nIdx].objectives.push({ id: `obj-${Date.now()}`, text: '', type: 'knowledge' });
                                handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                            }} className="button button-text !h-9 !px-4 text-[11px] font-extrabold uppercase tracking-[0.2em] mt-2 bg-surface-container-high/50 rounded-full"><span className="material-symbols-outlined text-sm mr-2">add</span> Aggiungi Obiettivo</button>
                        </div>
                    </div>
                ))}
                <button onClick={() => {
                    const newNucleus: CurriculumNucleo = { id: `nuc-${Date.now()}`, title: 'Nuovo Nucleo', objectives: [] };
                    handleUpdate({...selectedCurriculum, nuclei: [...selectedCurriculum.nuclei, newNucleus]});
                }} className="button button-outlined w-full border-dashed !rounded-[32px] py-6 border-2 font-extrabold"><span className="material-symbols-outlined mr-2">add_circle</span> Nuovo Nucleo Fondante</button>
            </div>
        );
    };

    return (
        <div className="page-layout h-[calc(100vh-64px)] overflow-hidden !gap-0 !p-0 md:!p-4">
            <div className="flex h-full bg-surface-container-low md:rounded-[40px] overflow-hidden border border-outline-variant shadow-lg">
                <div className="w-80 border-r border-outline-variant flex flex-col bg-surface-container-low flex-shrink-0">
                    <div className="p-6 border-b border-outline-variant flex items-center gap-4">
                        <button onClick={() => onNavigate('home')} className="icon-button"><span className="material-symbols-outlined">arrow_back</span></button>
                        <h1 className="m3-title-large font-extrabold tracking-tight">Curricoli</h1>
                    </div>
                    <div className="p-6 border-b border-outline-variant bg-surface-container/30 space-y-5">
                        <SelectField label="Materia" value={newSubject} onChange={e => setNewSubject(e.target.value)}>
                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                        <TextField label="Grado / Livello" value={newGradeLevel} onChange={e => setNewGradeLevel(e.target.value)} placeholder="Es. Classi Prime" />
                        <button onClick={handleCreate} className="button button-filled w-full font-black shadow-md">Crea Curricolo</button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-3 space-y-2">
                        {curricula.map(curr => (
                            <div key={curr.id} onClick={() => setSelectedCurriculumId(curr.id)} className={`p-4 rounded-[24px] cursor-pointer transition-all flex justify-between items-center group ${selectedCurriculumId === curr.id ? 'bg-primary text-on-primary shadow-xl scale-[1.03]' : 'hover:bg-surface-container-high'}`}>
                                <div className="min-w-0">
                                    <p className="font-extrabold text-sm truncate leading-none mb-1">{curr.subject}</p>
                                    <p className="text-[10px] opacity-70 uppercase font-extrabold tracking-widest">{curr.gradeLevel}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(curr.id); }} className={`icon-button !w-8 !h-8 ${selectedCurriculumId === curr.id ? 'text-on-primary hover:bg-white/20' : 'text-error opacity-0 group-hover:opacity-100'}`}><span className="material-symbols-outlined text-sm">delete</span></button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-grow relative flex flex-col bg-surface">
                    {selectedCurriculum ? (
                        <>
                            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface shadow-sm z-10">
                                <div><h2 className="m3-headline-small font-extrabold">{selectedCurriculum.subject}</h2><p className="text-[10px] text-primary font-extrabold uppercase tracking-[0.3em] mt-1">{selectedCurriculum.gradeLevel}</p></div>
                                <div className="flex gap-2">
                                     <TabGroup
                                         activeTab={activeTab}
                                         onTabChange={(id: string) => {
                                             if (id === 'editor' || id === 'coverage') setActiveTab(id);
                                         }}
                                         variant="secondary"
                                         tabs={[
                                             { id: 'editor', label: 'Editor', icon: 'edit' },
                                             { id: 'coverage', label: 'Analisi', icon: 'analytics' }
                                         ]}
                                     />
                                    {activeTab === 'editor' && <button onClick={() => setIsImporting(true)} className="button button-tonal ml-2 !px-6 font-extrabold"><span className="material-symbols-outlined mr-2">auto_awesome</span> AI Import</button>}
                                </div>
                            </div>
                            {activeTab === 'editor' ? renderEditor() : <div className="p-12"><EmptyState title="Analisi Copertura" description="La funzione di copertura basata sulle lezioni svolte è in arrivo." icon="analytics" /></div>}
                        </>
                    ) : (
                        <EmptyState title="Seleziona un Curricolo" description="Scegli un programma dalla lista laterale per iniziare la progettazione per obiettivi." icon="menu_book" />
                    )}
                </div>
            </div>
            {isImporting && (
                <M3Dialog
                    onClose={() => setIsImporting(false)}
                    title="Import AI Curricolo"
                    maxWidth="2xl"
                    buttons={
                        <>
                            <button onClick={() => setIsImporting(false)} className="button button-text font-bold">Annulla</button>
                            <button onClick={handleImportAI} className="button button-filled font-black !px-8 shadow-lg" disabled={isProcessingAI || !importText}>
                                {isProcessingAI ? <AiThinkingGem size="small" inline /> : 'Genera Struttura'}
                            </button>
                        </>
                    }
                >
                    <div className="flex flex-col gap-6">
                        <div {...getRootProps()} className="dropzone-area h-40 !rounded-[32px]"><input {...getInputProps()} /><span className="material-symbols-outlined text-4xl text-primary mb-2">upload_file</span><p className="m3-body-large font-black text-on-surface">Carica PDF Programmazione</p><p className="m3-body-small opacity-60">o trascina il file qui</p></div>
                        <TextArea label="O incolla il testo del programma" value={importText} onChange={e => setImportText(e.target.value)} className="flex-grow" rows={12} containerClassName="flex-grow" />
                    </div>
                </M3Dialog>
            )}
        </div>
    );
};

export default CurriculumManager;
