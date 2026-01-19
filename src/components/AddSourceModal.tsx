// MD3 Compliant - Block J Migration (3 violations eliminated)

import React, { useState, useCallback } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { KnowledgeBaseEntry, Corpus } from '../types';
import { extractTextFromFile, blobToBase64Parts } from '../utils/documentUtils';
import { KB_CATEGORIES } from '../constants';
import { CategoryCard, SelectField, TextField, M3Dialog, M3DialogContent, M3Button } from './ui';
interface AddSourceModalProps {
    corpora: Corpus[];
    setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
    onClose: () => void;
    onAddEntries: (entries: KnowledgeBaseEntry[]) => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({ corpora, setCorpora, onClose, onAddEntries }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCorpusId, setSelectedCorpusId] = useState<string>('');
    const [isCreating, setIsCreating] = useState(false);
    const [newCorpusName, setNewCorpusName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');

    const handleCreateCorpus = () => {
        if (!newCorpusName.trim()) return;
        const newCorpus: Corpus = { id: `corpus-${Date.now()}`, displayName: newCorpusName.trim(), chatHistory: [] };
        setCorpora(prev => [...prev, newCorpus]);
        setNewCorpusName('');
        setIsCreating(false);
        setSelectedCorpusId(newCorpus.id); 
    };

    const processFiles = async (files: File[]) => {
        if (!selectedCategory) { setError("Seleziona una cartella."); return; }
        setIsLoading(true);
        const newEntries: KnowledgeBaseEntry[] = [];
        for (const file of files) {
            try {
                setLoadingMessage(`Processo: ${file.name}`);
                const textContent = await extractTextFromFile(file);
                const fileData = await blobToBase64Parts(file);
                newEntries.push({ id: `kb-${Date.now()}-${file.name}`, fileName: file.name, content: textContent, fileContent: fileData, corpusId: selectedCorpusId || undefined, category: selectedCategory });
            } catch(e: unknown) {
                const errMsg = e instanceof Error ? e.message : String(e);
                setError(prev => `${prev}\n❌ ${file.name}: ${errMsg}`);
            }
        }
        if (newEntries.length > 0) onAddEntries(newEntries);
        setIsLoading(false);
        if (!error) onClose();
    };

    const onDrop = useCallback((acceptedFiles: File[]) => processFiles(acceptedFiles), [selectedCategory, selectedCorpusId, processFiles]);
    const { getRootProps, getInputProps, isDragActive } = useFileDrop({ onDrop, disabled: isLoading || !selectedCategory });

    return (
        <M3Dialog
            title="Aggiungi Documenti"
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <M3DialogContent style={{marginTop: 'var(--md-sys-spacing-8)'}}>
                {isLoading ? (
                    <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div  style={{borderRadius: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', width: 'var(--md-sys-spacing-4)', borderBottom: "4px solid var(--md-sys-color-outline)", borderColor: "var(--md-sys-color-primary)"}}></div>
                        <p  style={{color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em"}}>{loadingMessage}</p>
                    </div>
                ) : (
                    <>
                        <section>
                            <h3  style={{marginBottom: 'var(--md-sys-spacing-6)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                <span style={{ color: sys.colors.on-primaryContainer , width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", justifyContent: "center"}}>1</span> 
                                Seleziona Destinazione
                            </h3>
                            <div  style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 'var(--md-sys-spacing-6)'}}>
                                {KB_CATEGORIES.map(cat => (
                                    <CategoryCard 
                                        key={cat.id} 
                                        id={cat.id} 
                                        label={cat.label} 
                                        icon={cat.icon} 
                                        color={cat.color} 
                                        isSelected={selectedCategory === cat.id} 
                                        onClick={() => setSelectedCategory(cat.id)} 
                                    />
                                ))}
                            </div>
                        </section>

                        <section style={{
                            transition: 'all 500ms ease',
                            opacity: !selectedCategory ? 0.3 : 1,
                            filter: !selectedCategory ? 'grayscale(100%)' : 'none',
                            pointerEvents: !selectedCategory ? 'none' : 'auto'
                        }}>
                            <h3  style={{marginBottom: 'var(--md-sys-spacing-6)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                <span style={{ color: sys.colors.on-secondary-container , width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center"}}>2</span>
                                Carica File
                            </h3>
                            <div {...getRootProps()} style={{
                                height: '12rem',
                                border: `2px dashed ${isDragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                backgroundColor: isDragActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
                                opacity: isDragActive ? 0.1 : 1,
                                transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 300ms ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)'
                            }}>
                                <input {...getInputProps()} />
                                <span style={{color: "var(--md-sys-color-primary)", marginBottom: 'var(--md-sys-spacing-8)'}}>{isDragActive ? 'download' : 'upload_file'}</span>
                                <p style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Trascina i file qui o clicca per sfogliare</p>
                                <p style={{opacity: "0.6", marginTop: 'var(--md-sys-spacing-4)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-on-surface-variant)"}}>Supporto PDF, DOCX, TXT</p>
                            </div>
                        </section>

                        <section  style={{borderTop: "1px solid var(--md-sys-color-outline)"}}>
                            <h3  style={{fontWeight: "900", marginBottom: 'var(--md-sys-spacing-6)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                <span style={{ color: sys.colors.on-tertiary , width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900"}}>3</span> 
                                Raccolta (Opzionale)
                            </h3>
                            <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)', alignItems: "flex-end"}}>
                                <div style={{ flexGrow: "1" }}>
                                    <SelectField id="corpus-select" label="Raccolta Target" value={selectedCorpusId} onChange={e => setSelectedCorpusId(e.target.value)}>
                                        <option value="">-- Nessuna Raccolta --</option>
                                        {corpora.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                                    </SelectField>
                                </div>
                                <M3Button 
                                    onClick={() => setIsCreating(p => !p)} 
                                    variant="tonal"
                                     
                                    title={isCreating ? "Annulla creazione" : "Crea nuova raccolta"}
                                >
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{isCreating ? 'remove' : 'add'}</span>
                                </M3Button>
                            </div>
                            {isCreating && (
                                 <div  style={{marginTop: 'var(--md-sys-spacing-6)', display: "flex", gap: 'var(--md-sys-spacing-6)'}}>
                                    <TextField 
                                        id="new-corpus-name-input" 
                                        label="Nome Nuova Raccolta" 
                                        value={newCorpusName} 
                                        onChange={e => setNewCorpusName(e.target.value)} 
                                        placeholder="Es. Programmazioni 2024" 
                                    />
                                    <M3Button onClick={handleCreateCorpus} variant="primary"  style={{ fontWeight: "900" }}>CREA</M3Button>
                                </div>
                            )}
                        </section>
                    </>
                )}
                {error && <div style={{ color: sys.colors.on-error-container , marginTop: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-6)', backgroundColor: "var(--md-sys-color-error)", borderRadius: "0.375rem"}}>{error}</div>}
            </M3DialogContent>
        </M3Dialog>
    );
};

export default AddSourceModal;







