
import React, { useState, useCallback, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { useFileDrop } from '../hooks/useFileDrop';
import { KnowledgeBaseEntry, Corpus } from '../types';
import { extractTextFromFile, blobToBase64Parts } from '../utils/documentUtils';
import { KB_CATEGORIES } from '../constants';
import { CategoryCard, SelectField, TextField } from './M3Components'; 

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
    
    // Accessibility & UX
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({
        isOpen: true,
        onClose,
        overlayRef,
        containerRef,
        onOverlayClick: onClose
    });

    return (
        <div
            className="dialog-backdrop animate-fade-in"
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(0,0,0,0.32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={e => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-source-title"
                tabIndex={-1}
                className="dialog-container animate-scale-in"
                style={{
                    background: 'var(--sys-surface)',
                    borderRadius: 16,
                    width: '100vw',
                    maxWidth: 480,
                    maxHeight: '90vh',
                    padding: 24,
                    position: 'relative',
                    boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
                    outline: 'none',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="dialog-header border-b border-outline-variant p-6 bg-surface-container-high" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 id="add-source-title" className="m3-headline-small font-extrabold">Aggiungi Documenti</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi"
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            color: 'var(--sys-primary)',
                            cursor: 'pointer',
                        }}
                    >
                        ×
                    </button>
                </div>
                <div className="dialog-content overflow-y-auto p-8 space-y-12 bg-surface">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div><p className="m3-title-large mt-8 text-primary animate-pulse font-extrabold uppercase tracking-widest">{loadingMessage}</p></div>
                    ) : (
                        <>
                            <section>
                                <h3 className="m3-title-medium font-extrabold mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-extrabold">1</span> Seleziona Destinazione</h3>
                                <div className="category-selection-grid grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {KB_CATEGORIES.map(cat => <CategoryCard key={cat.id} id={cat.id} label={cat.label} icon={cat.icon} color={cat.color} isSelected={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} />)}
                                </div>
                            </section>

                            <section className={`transition-all duration-500 ${!selectedCategory ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                                <h3 className="m3-title-medium font-extrabold mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xs font-extrabold">2</span> Carica File</h3>
                                <div {...getRootProps()} className={`dropzone-area h-48 !rounded-[40px] border-2 border-dashed ${isDragActive ? 'border-primary bg-primary-container/10 scale-[1.02]' : 'border-outline-variant'} transition-all`}>
                                    <input {...getInputProps()} />
                                    <span className="material-symbols-outlined text-5xl text-primary mb-4">{isDragActive ? 'download' : 'upload_file'}</span>
                                    <p className="m3-body-large font-extrabold">Trascina i file qui o clicca per sfogliare</p>
                                    <p className="text-[10px] opacity-60 mt-2 font-bold uppercase tracking-widest">Supporto PDF, DOCX, TXT</p>
                                </div>
                            </section>

                            <section className="border-t border-outline-variant pt-10">
                                <h3 className="m3-title-medium font-black mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-xs font-black">3</span> Raccolta (Opzionale)</h3>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-grow">
                                        <SelectField id="corpus-select" label="Raccolta Target" value={selectedCorpusId} onChange={e => setSelectedCorpusId(e.target.value)}>
                                            <option value="">-- Nessuna Raccolta --</option>
                                            {corpora.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                                        </SelectField>
                                    </div>
                                    <button onClick={() => setIsCreating(p => !p)} className="button button-tonal !h-14 !px-6 !rounded-[24px]" title={isCreating ? "Annulla creazione" : "Crea nuova raccolta"}><span className="material-symbols-outlined">{isCreating ? 'remove' : 'add'}</span></button>
                                </div>
                                {isCreating && (
                                     <div className="mt-6 flex gap-3 animate-in slide-in-from-top-4">
                                        <TextField id="new-corpus-name-input" label="Nome Nuova Raccolta" value={newCorpusName} onChange={e => setNewCorpusName(e.target.value)} containerClassName="flex-grow !mb-0" placeholder="Es. Programmazioni 2024" />
                                        <button onClick={handleCreateCorpus} className="button button-filled mt-7 font-black !px-8 shadow-md">CREA</button>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSourceModal;
