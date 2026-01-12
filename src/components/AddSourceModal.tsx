
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
            <M3DialogContent style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                {isLoading ? (
                    <div className="h-64" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div className="animate-spin" style={{ borderRadius: "9999px", height: "4rem", width: "4rem", borderBottom: "4px solid var(--md-sys-color-outline)", borderColor: "var(--md-sys-color-primary)" }}></div>
                        <p className="m3-title-large mt-8 animate-pulse font-extrabold" style={{ color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{loadingMessage}</p>
                    </div>
                ) : (
                    <>
                        <section>
                            <h3 className="m3-title-medium font-extrabold" style={{ marginBottom: "var(--md-sys-spacing-6)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                <span className="text-on-primary-container m3-label-small font-extrabold" style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span> 
                                Seleziona Destinazione
                            </h3>
                            <div className="category-selection-grid md:grid-cols-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-6)" }}>
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

                        <section className={`transition-all duration-500 ${!selectedCategory ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                            <h3 className="m3-title-medium font-extrabold" style={{ marginBottom: "var(--md-sys-spacing-6)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                <span className="text-on-secondary-container m3-label-small font-extrabold" style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-secondary-container)", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span> 
                                Carica File
                            </h3>
                            <div {...getRootProps()} className={`dropzone-area h-48 border-2 border-dashed ${isDragActive ? 'border-primary bg-primary-container/10 scale-[1.02]' : 'border-[var(--md-sys-color-outline-variant)]'} transition-all flex flex-col items-center justify-center cursor-pointer`} style={{ borderRadius: 'var(--md-sys-shape-corner-extra-large)' }}>
                                <input {...getInputProps()} />
                                <span className="material-symbols-outlined text-5xl" style={{ color: "var(--md-sys-color-primary)", marginBottom: "var(--md-sys-spacing-8)" }}>{isDragActive ? 'download' : 'upload_file'}</span>
                                <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] font-extrabold">Trascina i file qui o clicca per sfogliare</p>
                                <p className="text-[10px]" style={{ opacity: "0.6", marginTop: "var(--md-sys-spacing-4)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Supporto PDF, DOCX, TXT</p>
                            </div>
                        </section>

                        <section className="border-[var(--md-sys-color-outline-variant)] pt-10" style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}>
                            <h3 className="m3-title-medium" style={{ fontWeight: "900", marginBottom: "var(--md-sys-spacing-6)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                <span className="text-on-tertiary m3-label-small" style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>3</span> 
                                Raccolta (Opzionale)
                            </h3>
                            <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)", alignItems: "flex-end" }}>
                                <div style={{ flexGrow: "1" }}>
                                    <SelectField id="corpus-select" label="Raccolta Target" value={selectedCorpusId} onChange={e => setSelectedCorpusId(e.target.value)}>
                                        <option value="">-- Nessuna Raccolta --</option>
                                        {corpora.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                                    </SelectField>
                                </div>
                                <M3Button 
                                    onClick={() => setIsCreating(p => !p)} 
                                    variant="tonal"
                                    className="!h-14 !px-6 !rounded-[var(--md-sys-shape-corner-medium)]" 
                                    title={isCreating ? "Annulla creazione" : "Crea nuova raccolta"}
                                >
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{isCreating ? 'remove' : 'add'}</span>
                                </M3Button>
                            </div>
                            {isCreating && (
                                 <div className="animate-in slide-in-from-top-4" style={{ marginTop: "var(--md-sys-spacing-6)", display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                                    <TextField 
                                        id="new-corpus-name-input" 
                                        label="Nome Nuova Raccolta" 
                                        value={newCorpusName} 
                                        onChange={e => setNewCorpusName(e.target.value)} 
                                        containerClassName="flex-grow !mb-0" 
                                        placeholder="Es. Programmazioni 2024" 
                                    />
                                    <M3Button onClick={handleCreateCorpus} variant="primary" className="mt-7 !px-8 shadow-[var(--md-sys-elevation-level1)]" style={{ fontWeight: "900" }}>CREA</M3Button>
                                </div>
                            )}
                        </section>
                    </>
                )}
                {error && <div className="text-on-error-container m3-body-small" style={{ marginTop: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-6)", backgroundColor: "var(--md-sys-color-error-container)", borderRadius: "0.375rem" }}>{error}</div>}
            </M3DialogContent>
        </M3Dialog>
    );
};

export default AddSourceModal;


