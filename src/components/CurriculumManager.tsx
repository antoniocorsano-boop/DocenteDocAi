import React, { useState } from 'react';
import { CurriculumSubject, CurriculumNucleo, AiSettings, TimetableSettings, View } from '../types';
import { parseCurriculumFromText } from '../services/aiService';
import { extractTextFromFile } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import { 
    M3Button, 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    InfoCard, 
    EmptyState, 
    TextField, 
    TextArea, 
    SelectField,
    TabGroup,
    AiThinkingGem 
} from './ui';

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
            <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-[var(--md-sys-color-surface-container-low)]est/50 backdrop-blur-sm custom-scrollbar">
                {selectedCurriculum.nuclei.length === 0 && (
                    <EmptyState title="Programma Vuoto" description="Inizia importando un documento o aggiungendo i nuclei fondanti." icon="library_books" />
                )}
                {selectedCurriculum.nuclei.map((nucleo, nIdx) => (
                    <InfoCard 
                        key={nucleo.id} 
                        className="border-l-4 border-l-primary bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-md shadow-sm hover:shadow-[var(--md-sys-elevation-level1)] transition-shadow"
                    >
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
                            <M3Button 
                                onClick={() => {
                                    const newNuclei = selectedCurriculum.nuclei.filter(n => n.id !== nucleo.id);
                                    handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                }} 
                                variant="text"
                                className="text-error ml-2 mt-7 !min-w-0 !p-8" 
                                title="Elimina Nucleo"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </M3Button>
                        </div>
                        <div className="space-y-3 pl-4 border-l-2 border-[var(--md-sys-color-outline-variant)]/30">
                            {nucleo.objectives.map((obj, oIdx) => (
                                <div key={obj.id} className="flex gap-8 items-center group">
                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${obj.type === 'skill' ? 'bg-tertiary' : 'bg-secondary'}`}></span>
                                    <input 
                                        className="flex-grow bg-transparent border-none focus:ring-0 m3-body-small py-4 font-bold text-[var(--md-sys-color-on-surface)] border-b border-transparent hover:border-[var(--md-sys-color-outline-variant)] focus:border-primary transition-all"
                                        value={obj.text}
                                        onChange={(e) => {
                                            const newNuclei = [...selectedCurriculum.nuclei];
                                            newNuclei[nIdx].objectives[oIdx].text = e.target.value;
                                            handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                        }}
                                        placeholder="Inserisci obiettivo..."
                                    />
                                    <M3Button 
                                        onClick={() => {
                                            const newNuclei = [...selectedCurriculum.nuclei];
                                            newNuclei[nIdx].objectives = newNuclei[nIdx].objectives.filter(o => o.id !== obj.id);
                                            handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                        }} 
                                        variant="text"
                                        className="opacity-0 group-hover:opacity-100 !w-8 !h-8 text-[var(--md-sys-color-on-surface)]-variant hover:bg-error-container hover:text-on-error-container !min-w-0 !p-0"
                                    >
                                        <span className="material-symbols-outlined m3-label-small">close</span>
                                    </M3Button>
                                </div>
                            ))}
                            <M3Button 
                                onClick={() => {
                                    const newNuclei = [...selectedCurriculum.nuclei];
                                    newNuclei[nIdx].objectives.push({ id: `obj-${Date.now()}`, text: '', type: 'knowledge' });
                                    handleUpdate({...selectedCurriculum, nuclei: newNuclei});
                                }} 
                                variant="tonal"
                                className="!h-9 !px-4 m3-label-small font-extrabold uppercase tracking-[0.2em] mt-4 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-full"
                            >
                                <span className="material-symbols-outlined m3-body-small mr-2">add</span> Aggiungi Obiettivo
                            </M3Button>
                        </div>
                    </InfoCard>
                ))}
                <M3Button 
                    onClick={() => {
                        const newNucleus: CurriculumNucleo = { id: `nuc-${Date.now()}`, title: 'Nuovo Nucleo', objectives: [] };
                        handleUpdate({...selectedCurriculum, nuclei: [...selectedCurriculum.nuclei, newNucleus]});
                    }} 
                    variant="outlined"
                    className="w-full border-dashed !rounded-[var(--md-sys-shape-corner-large)] py-8 border-2 font-extrabold hover:bg-primary/5 transition-colors"
                >
                    <span className="material-symbols-outlined mr-2">add_circle</span> Nuovo Nucleo Fondante
                </M3Button>
            </div>
        );
    };

    return (
        <div className="page-layout h-[calc(100vh-var(--header-height,64px))] overflow-hidden !gap-0 !p-0 md:!p-8">
            <div className="flex h-full bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl md:rounded-4xl overflow-hidden border border-[var(--md-sys-color-outline-variant)]/30 shadow-[var(--md-sys-elevation-level4)]">
                <div className="w-80 border-r border-[var(--md-sys-color-outline-variant)]/30 flex flex-col bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-md flex-shrink-0">
                    <div className="p-6 border-b border-[var(--md-sys-color-outline-variant)]/30 flex items-center gap-8">
                        <M3Button onClick={() => onNavigate('home')} variant="text" className="!min-w-0 !p-8">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </M3Button>
                        <h1 className="text-xl font-black tracking-tight text-[var(--md-sys-color-on-surface)]">Curricoli</h1>
                    </div>
                    <div className="p-6 border-b border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container-high)]/20 space-y-5">
                        <SelectField label="Materia" value={newSubject} onChange={e => setNewSubject(e.target.value)}>
                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                        <TextField label="Grado / Livello" value={newGradeLevel} onChange={e => setNewGradeLevel(e.target.value)} placeholder="Es. Classi Prime" />
                        <M3Button onClick={handleCreate} variant="filled" className="w-full font-black shadow-[var(--md-sys-elevation-level2)] py-4">
                            Crea Curricolo
                        </M3Button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6 space-y-2 custom-scrollbar">
                        {curricula.map(curr => (
                            <div 
                                key={curr.id} 
                                onClick={() => setSelectedCurriculumId(curr.id)} 
                                className={`p-8 rounded-[var(--md-sys-shape-corner-medium)] cursor-pointer transition-all flex justify-between items-center group ${selectedCurriculumId === curr.id ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level3)] scale-[1.02]' : 'hover:bg-[var(--md-sys-color-surface-container-high)]/50'}`}
                            >
                                <div className="min-w-0">
                                    <p className="font-extrabold text-sm truncate leading-none mb-4">{curr.subject}</p>
                                    <p className="m3-label-tiny opacity-70 uppercase font-extrabold tracking-widest">{curr.gradeLevel}</p>
                                </div>
                                <M3Button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(curr.id); }} 
                                    variant="text"
                                    className={`!min-w-0 !p-1 ${selectedCurriculumId === curr.id ? 'text-on-primary hover:bg-white/20' : 'text-error opacity-0 group-hover:opacity-100'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </M3Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-grow relative flex flex-col bg-surface/40 backdrop-blur-sm">
                    {selectedCurriculum ? (
                        <>
                            <div className="px-8 py-6 border-b border-[var(--md-sys-color-outline-variant)]/30 flex justify-between items-center bg-[var(--md-sys-color-surface-container-high)]/20 backdrop-blur-md shadow-sm z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--md-sys-color-on-surface)]">{selectedCurriculum.subject}</h2>
                                    <p className="m3-label-tiny text-primary font-extrabold uppercase tracking-[0.3em] mt-4">{selectedCurriculum.gradeLevel}</p>
                                </div>
                                <div className="flex gap-8 items-center">
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
                                    {activeTab === 'editor' && (
                                        <M3Button onClick={() => setIsImporting(true)} variant="tonal" className="!px-6 font-extrabold shadow-sm">
                                            <span className="material-symbols-outlined mr-2">auto_awesome</span> AI Import
                                        </M3Button>
                                    )}
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
                >
                    <M3DialogContent className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl space-y-6">
                        <div {...getRootProps()} className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors h-48 rounded-[var(--md-sys-shape-corner-large)] cursor-pointer">
                            <input {...getInputProps()} />
                            <span className="material-symbols-outlined text-5xl text-primary mb-8">upload_file</span>
                            <p className="text-lg font-black text-[var(--md-sys-color-on-surface)]">Carica PDF Programmazione</p>
                            <p className="text-sm opacity-60">o trascina il file qui</p>
                        </div>
                        <TextArea 
                            label="O incolla il testo del programma" 
                            value={importText} 
                            onChange={e => setImportText(e.target.value)} 
                            className="flex-grow" 
                            rows={12} 
                            containerClassName="flex-grow" 
                        />
                    </M3DialogContent>
                    <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]/80 backdrop-blur-md border-t border-[var(--md-sys-color-outline-variant)]/30">
                        <M3Button onClick={() => setIsImporting(false)} variant="text">Annulla</M3Button>
                        <M3Button 
                            onClick={handleImportAI} 
                            variant="filled" 
                            className="!px-8 shadow-[var(--md-sys-elevation-level2)]" 
                            disabled={isProcessingAI || !importText}
                        >
                            {isProcessingAI ? <AiThinkingGem size="small" inline /> : 'Genera Struttura'}
                        </M3Button>
                    </M3DialogActions>
                </M3Dialog>
            )}
        </div>
    );
};

export default CurriculumManager;


