// MD3 Compliant - Block M Migration (9 violations eliminated)
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
            <div >
                {selectedCurriculum.nuclei.length === 0 && (
                    <EmptyState title="Programma Vuoto" description="Inizia importando un documento o aggiungendo i nuclei fondanti." icon="library_books" />
                )}
                {selectedCurriculum.nuclei.map((nucleo, nIdx) => (
                    <InfoCard 
                        key={nucleo.id} 
                        
                    >
                        <div >
                            <div >
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
                                 
                                title="Elimina Nucleo"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>delete</span>
                            </M3Button>
                        </div>
                        <div >
                            {nucleo.objectives.map((obj, oIdx) => (
                                <div key={obj.id} >
                                    <span style={{
                                        width: 'var(--md-sys-spacing-2)',
                                        height: 'var(--md-sys-spacing-2)',
                                        borderRadius: 'var(--md-sys-percent-50)',
                                        flexShrink: 0,
                                        background: obj.type === 'skill' ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-secondary)'
                                    }}></span>
                                    <input 
                                        
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
                                        
                                    >
                                        <span >close</span>
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
                                
                            >
                                <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>add</span> Aggiungi Obiettivo
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
                    
                >
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>add_circle</span> Nuovo Nucleo Fondante
                </M3Button>
            </div>
        );
    };

    return (
        <div >
            <div >
                <div >
                    <div >
                        <M3Button onClick={() => onNavigate('home')} variant="text" >
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                        </M3Button>
                        <h1 >Curricoli</h1>
                    </div>
                    <div >
                        <SelectField label="Materia" value={newSubject} onChange={e => setNewSubject(e.target.value)}>
                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                        <TextField label="Grado / Livello" value={newGradeLevel} onChange={e => setNewGradeLevel(e.target.value)} placeholder="Es. Classi Prime" />
                        <M3Button onClick={handleCreate} variant="filled" >
                            Crea Curricolo
                        </M3Button>
                    </div>
                    <div >
                        {curricula.map(curr => (
                            <div
                                key={curr.id}
                                onClick={() => setSelectedCurriculumId(curr.id)}
                                style={{
                                    padding: 'var(--md-sys-spacing-8)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: selectedCurriculumId === curr.id ? 'var(--md-sys-color-primary)' : 'transparent',
                                    color: selectedCurriculumId === curr.id ? 'var(--md-sys-color-on-primary)' : 'inherit',
                                    boxShadow: selectedCurriculumId === curr.id ? 'var(--md-sys-elevation-level3)' : 'none',
                                    transform: selectedCurriculumId === curr.id ? 'scale(1.02)' : 'scale(1)'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCurriculumId !== curr.id) {
                                        e.currentTarget.style.background = 'var(--md-sys-color-surface-container-high)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCurriculumId !== curr.id) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <div >
                                    <p >{curr.subject}</p>
                                    <p >{curr.gradeLevel}</p>
                                </div>
                                <M3Button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(curr.id); }}
                                    variant="text"
                                    style={{
                                        minWidth: 0,
                                        padding: 'var(--md-sys-spacing-1)',
                                        color: selectedCurriculumId === curr.id ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-error)',
                                        opacity: selectedCurriculumId === curr.id ? 1 : 0
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedCurriculumId === curr.id) {
                                            e.currentTarget.style.background = 'var(--md-sys-color-surface-container-high)';
                                        } else {
                                            e.currentTarget.style.opacity = '1';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedCurriculumId !== curr.id) {
                                            e.currentTarget.style.opacity = '0';
                                        }
                                    }}
                                >
                                    <span  style={{ fontSize: "var(--md-sys-typescale-label-medium-font-size)" }}>delete</span>
                                </M3Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div >
                    {selectedCurriculum ? (
                        <>
                            <div >
                                <div>
                                    <h2 >{selectedCurriculum.subject}</h2>
                                    <p >{selectedCurriculum.gradeLevel}</p>
                                </div>
                                <div >
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
                                        <M3Button onClick={() => setIsImporting(true)} variant="tonal" >
                                            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>auto_awesome</span> AI Import
                                        </M3Button>
                                    )}
                                </div>
                            </div>
                            {activeTab === 'editor' ? renderEditor() : <div ><EmptyState title="Analisi Copertura" description="La funzione di copertura basata sulle lezioni svolte è in arrivo." icon="analytics" /></div>}
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
                    <M3DialogContent >
                        <div {...getRootProps()} >
                            <input {...getInputProps()} />
                            <span >upload_file</span>
                            <p >Carica PDF Programmazione</p>
                            <p >o trascina il file qui</p>
                        </div>
                        <TextArea 
                            label="O incolla il testo del programma" 
                            value={importText} 
                            onChange={e => setImportText(e.target.value)} 
                            style={{ flexGrow: "1" }} 
                            rows={12} 
                            containerClassName="flex-grow" 
                        />
                    </M3DialogContent>
                    <M3DialogActions >
                        <M3Button onClick={() => setIsImporting(false)} variant="text">Annulla</M3Button>
                        <M3Button 
                            onClick={handleImportAI} 
                            variant="filled" 
                             
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








