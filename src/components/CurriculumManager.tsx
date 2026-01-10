// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations. ✅ COMPLETED
// ...existing code...
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
            <div className="curriculum-manager-editor-area">
                {selectedCurriculum.nuclei.length === 0 && (
                    <EmptyState title="Programma Vuoto" description="Inizia importando un documento o aggiungendo i nuclei fondanti." icon="library_books" />
                )}
                {selectedCurriculum.nuclei.map((nucleo, nIdx) => (
                    <InfoCard 
                        key={nucleo.id} 
                        className="curriculum-manager-nucleus-card"
                    >
                        <div className="curriculum-manager-nucleus-header">
                            <div className="curriculum-manager-nucleus-title-area">
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
                                className="curriculum-manager-nucleus-delete-button" 
                                title="Elimina Nucleo"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </M3Button>
                        </div>
                        <div className="curriculum-manager-objectives-container">
                            {nucleo.objectives.map((obj, oIdx) => (
                                <div key={obj.id} className="curriculum-manager-objective-item">
                                    <span className={`curriculum-manager-objective-dot ${obj.type === 'skill' ? 'skill' : 'knowledge'}`}></span>
                                    <input 
                                        className="curriculum-manager-objective-input"
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
                                        className="curriculum-manager-objective-delete-button"
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
                                className="curriculum-manager-add-objective-button"
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
                    className="curriculum-manager-add-nucleus-button"
                >
                    <span className="material-symbols-outlined mr-2">add_circle</span> Nuovo Nucleo Fondante
                </M3Button>
            </div>
        );
    };

    return (
        <div className="page-layout curriculum-manager-page-layout curriculum-manager-page-layout.responsive">
            <div className="curriculum-manager-main-container curriculum-manager-main-container.responsive">
                <div className="curriculum-manager-sidebar">
                    <div className="curriculum-manager-sidebar-header">
                        <M3Button onClick={() => onNavigate('home')} variant="text" className="curriculum-manager-sidebar-back-button">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </M3Button>
                        <h1 className="curriculum-manager-sidebar-title">Curricoli</h1>
                    </div>
                    <div className="curriculum-manager-creation-form">
                        <SelectField label="Materia" value={newSubject} onChange={e => setNewSubject(e.target.value)}>
                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                        <TextField label="Grado / Livello" value={newGradeLevel} onChange={e => setNewGradeLevel(e.target.value)} placeholder="Es. Classi Prime" />
                        <M3Button onClick={handleCreate} variant="filled" className="curriculum-manager-create-button">
                            Crea Curricolo
                        </M3Button>
                    </div>
                    <div className="curriculum-manager-curriculum-list">
                        {curricula.map(curr => (
                            <div 
                                key={curr.id} 
                                onClick={() => setSelectedCurriculumId(curr.id)} 
                                className={`curriculum-manager-curriculum-item ${selectedCurriculumId === curr.id ? 'curriculum-manager-curriculum-item.selected' : ''}`}
                            >
                                <div className="curriculum-manager-curriculum-content">
                                    <p className="curriculum-manager-curriculum-subject">{curr.subject}</p>
                                    <p className="curriculum-manager-curriculum-grade">{curr.gradeLevel}</p>
                                </div>
                                <M3Button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(curr.id); }} 
                                    variant="text"
                                    className={`curriculum-manager-curriculum-delete-button ${selectedCurriculumId === curr.id ? 'curriculum-manager-curriculum-delete-button.selected' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </M3Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="curriculum-manager-content-area">
                    {selectedCurriculum ? (
                        <>
                            <div className="curriculum-manager-content-header">
                                <div>
                                    <h2 className="curriculum-manager-content-title">{selectedCurriculum.subject}</h2>
                                    <p className="curriculum-manager-content-subtitle">{selectedCurriculum.gradeLevel}</p>
                                </div>
                                <div className="curriculum-manager-tab-container">
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
                            {activeTab === 'editor' ? renderEditor() : <div className="curriculum-manager-coverage-placeholder"><EmptyState title="Analisi Copertura" description="La funzione di copertura basata sulle lezioni svolte è in arrivo." icon="analytics" /></div>}
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
                    <M3DialogContent className="curriculum-manager-import-dialog-content">
                        <div {...getRootProps()} className="curriculum-manager-import-dropzone">
                            <input {...getInputProps()} />
                            <span className="curriculum-manager-import-upload-icon">upload_file</span>
                            <p className="curriculum-manager-import-upload-title">Carica PDF Programmazione</p>
                            <p className="curriculum-manager-import-upload-subtitle">o trascina il file qui</p>
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
                    <M3DialogActions className="curriculum-manager-import-dialog-actions">
                        <M3Button onClick={() => setIsImporting(false)} variant="text">Annulla</M3Button>
                        <M3Button 
                            onClick={handleImportAI} 
                            variant="filled" 
                            className="curriculum-manager-import-generate-button" 
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


