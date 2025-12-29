/* eslint-disable @typescript-eslint/no-explicit-any */
// ...vite-env.d.ts should not be imported directly...
import React, { useState, useEffect } from 'react';
import { KnowledgeBaseEntry, StudioProps, GeneratedQuiz } from '../types'; 
import { generateStudioOutput, generateFormattedDocument, generateImageFromPrompt, generateQuiz } from '../services/aiService';
import DocumentGeneratorModal from './DocumentGeneratorModal';
import ImageGeneratorModal from './ImageGeneratorModal';
import TestGeneratorModal from './TestGeneratorModal';
import TestPreviewModal from './TestPreviewModal';
import Guidance from './Guidance';
import AiThinkingGem from './AiThinkingGem';


type StudioTask = 'summary' | 'key_points' | 'qa' | 'flashcards' | 'presentation' | 'document' | 'image' | 'quiz';

interface StudioAction {
  id: StudioTask;
  icon: string;
  title: string;
  description: string;
  requiresContent: boolean;
  category: 'generation' | 'analysis';
  variant: 'variant-primary' | 'variant-secondary' | 'variant-tertiary' | 'variant-surface';
}

const studioActions: StudioAction[] = [
    // Generazione
    { id: 'image', icon: 'add_photo_alternate', title: 'Genera Immagine', description: 'Crea un\'immagine da una descrizione testuale.', requiresContent: false, category: 'generation', variant: 'variant-primary' },
    { id: 'document', icon: 'article', title: 'Crea Documento', description: 'Genera un documento formattato (es. relazione) da un prompt.', requiresContent: true, category: 'generation', variant: 'variant-tertiary' },
    { id: 'quiz', icon: 'assignment_add', title: 'Genera Verifica', description: 'Crea un test pronto per la stampa con griglia di correzione.', requiresContent: true, category: 'generation', variant: 'variant-primary' },
    { id: 'presentation', icon: 'slideshow', title: 'Bozza Presentazione', description: 'Struttura una presentazione con slide.', requiresContent: true, category: 'generation', variant: 'variant-tertiary' },
    { id: 'flashcards', icon: 'style', title: 'Crea Flashcard', description: 'Produci flashcard per il ripasso.', requiresContent: true, category: 'generation', variant: 'variant-surface' },
    
    // Analisi
    { id: 'summary', icon: 'summarize', title: 'Crea Riassunto', description: 'Genera un riassunto conciso e strutturato.', requiresContent: true, category: 'analysis', variant: 'variant-secondary' },
    { id: 'key_points', icon: 'key', title: 'Estrai Punti Chiave', description: 'Identifica i concetti più importanti.', requiresContent: true, category: 'analysis', variant: 'variant-secondary' },
    { id: 'qa', icon: 'quiz', title: 'Genera Domande', description: 'Crea domande e risposte per la verifica.', requiresContent: true, category: 'analysis', variant: 'variant-surface' },
];


export const Studio: React.FC<StudioProps> = ({ corpora, knowledgeBase, setKnowledgeBase, aiSettings, onOpenCreateLesson, showToast, showGuidanceTips, onAiProcessing }) => {
    const [selectedCorpusId, setSelectedCorpusId] = useState<string>('');
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTaskName, setLoadingTaskName] = useState('');
    
    // States for modal dialogs
    const [isDocumentGeneratorOpen, setIsDocumentGeneratorOpen] = useState(false);
    const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false);
    const [isTestGeneratorOpen, setIsTestGeneratorOpen] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);

    // API Key states for Imagen model
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
    const [isKeySelectionOpen, setIsKeySelectionOpen] = useState(false);

    useEffect(() => {
        // Check for API key status for Imagen models
        const localKey = localStorage.getItem('gemini_api_key');
        if (localKey) {
            setHasApiKey(true);
        } else if ((window as any).aistudio) {
            (window as any).aistudio.hasSelectedApiKey().then(setHasApiKey);
        } else {
            setHasApiKey(false);
        }
    }, []);
    
    const availableFiles = knowledgeBase.filter(entry => 
        !selectedCorpusId || entry.corpusId === selectedCorpusId
    );

    const handleFileToggle = (fileId: string) => {
        setSelectedFileIds(prev => 
            prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
        );
    };

    const runTask = async (task: StudioTask, prompt?: string, extraConfig?: unknown) => {
        const action = studioActions.find(a => a.id === task);
        if (action?.requiresContent && selectedFileIds.length === 0) {
            showToast('Seleziona almeno un documento dalla Knowledge Base per eseguire questa azione.', 'error');
            return;
        }

        if (task === 'image' && !hasApiKey) {
            setIsKeySelectionOpen(true);
            return;
        }

        setIsLoading(true);
        setLoadingTaskName(action?.title || 'Elaborazione...');
        if (onAiProcessing) onAiProcessing(true); // Start Animation

        try {
            const contextContent = knowledgeBase
                .filter(entry => selectedFileIds.includes(entry.id))
                .map(entry => `--- Contenuto da: ${entry.fileName} ---\n${entry.content}`)
                .join('\n\n');

            let title: string = '';
            let htmlContent: string = '';

            if (task === 'image') {
                if (!prompt) {
                     showToast('Il prompt per l\'immagine non può essere vuoto.', 'error');
                     return;
                }
                const { data, mimeType } = await generateImageFromPrompt(aiSettings, prompt);
                
                // Check for duplicates created in the last 2 seconds to prevent double-save in StrictMode
                const isDuplicate = knowledgeBase.some(entry => 
                    entry.content === prompt && 
                    entry.isGenerated && 
                    entry.fileContent?.mimeType === mimeType &&
                    (Date.now() - parseInt(entry.id.split('-')[2] || '0')) < 2000
                );

                if (!isDuplicate) {
                    const newEntry: KnowledgeBaseEntry = {
                        id: `kb-img-${Date.now()}`,
                        fileName: `${prompt.substring(0, 30)}.jpg`,
                        content: prompt, // Store prompt in content
                        isGenerated: true,
                        fileContent: { mimeType, data },
                        corpusId: selectedCorpusId || undefined,
                    };
                    setKnowledgeBase(prev => [...prev, newEntry]);
                    showToast('Immagine generata e salvata nella Knowledge Base!', 'success');
                }
                
                setIsLoading(false);
                if (onAiProcessing) onAiProcessing(false);
                setIsImageGeneratorOpen(false);
                return;

            } else if (task === 'quiz') {
                const quiz = await generateQuiz(aiSettings, contextContent, extraConfig);
                setGeneratedQuiz(quiz);
                setIsLoading(false);
                if (onAiProcessing) onAiProcessing(false);
                setIsTestGeneratorOpen(false);
                return;

            } else if (task === 'document') {
                if (!prompt) {
                    showToast('Il prompt per il documento non può essere vuoto.', 'error');
                    return;
                }
                title = prompt;
                htmlContent = await generateFormattedDocument(aiSettings, contextContent, prompt);
                setIsDocumentGeneratorOpen(false);
            } else {
                if (!action) throw new Error("Azione non valida");
                title = action.title;
                htmlContent = await generateStudioOutput(aiSettings, contextContent, task);
            }
            onOpenCreateLesson({ title, htmlContent });
        } catch (error: unknown) {
            let message = 'Si è verificato un errore.';
            if (error instanceof Error) {
                message = error.message;
                if (error.message.includes("Requested entity was not found.") || error.message.includes("API Key")) {
                    setHasApiKey(false); // Assume API key issue
                    setIsKeySelectionOpen(true);
                }
            }
            showToast(message, 'error');
        } finally {
            setIsLoading(false);
            setLoadingTaskName('');
            if (onAiProcessing) onAiProcessing(false); // Stop Animation
        }
    };

    const renderActionGrid = (actions: StudioAction[]) => (
        <div className="expressive-grid">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => {
                        if (action.id === 'document') setIsDocumentGeneratorOpen(true);
                        else if (action.id === 'image') setIsImageGeneratorOpen(true);
                        else if (action.id === 'quiz') setIsTestGeneratorOpen(true);
                        else runTask(action.id);
                    }}
                    className={`expressive-tool-card ${action.variant} relative overflow-hidden group`}
                    disabled={isLoading || (action.requiresContent && selectedFileIds.length === 0) || (action.id === 'image' && hasApiKey === false)}
                    title={(action.id === 'image' && hasApiKey === false) ? "API Key richiesta per la generazione di immagini." : (action.requiresContent && selectedFileIds.length === 0 ? "Seleziona almeno un documento per abilitare questa azione" : action.description)}
                >
                    <div className="flex justify-between items-start w-full mb-2">
                        <span className="material-symbols-outlined tool-icon group-hover:scale-110 transition-transform">{action.icon}</span>
                        {action.requiresContent && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${selectedFileIds.length > 0 ? 'border-current opacity-70' : 'border-outline text-outline'}`}>
                                Input KB
                            </span>
                        )}
                    </div>
                    <span className="tool-title">{action.title}</span>
                    <span className="tool-subtitle mt-1 line-clamp-2">{action.description}</span>
                </button>
            ))}
        </div>
    );

    const handleSelectKey = async () => {
        if ((window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
            setHasApiKey(true);
        } else {
            showToast("Per favore configura l'API Key nelle Impostazioni.", "error");
        }
        setIsKeySelectionOpen(false);
    };

    return (
        <div className="page-layout pb-24">
            <div className="flex justify-between items-center">
                <h1 className="m3-display-medium">Studio AI</h1>
            </div>
            
             <Guidance id="studio-ai-intro" icon="auto_fix_high" title="Il tuo Laboratorio Creativo" isGloballyEnabled={showGuidanceTips}>
                <p>
                    Usa lo Studio AI come un laboratorio per trasformare i tuoi materiali. Seleziona i documenti di partenza (il contesto), poi scegli un'azione. L'AI genererà nuovi contenuti (riassunti, presentazioni, verifiche) che potrai trasformare in lezioni o esportare.
                </p>
            </Guidance>
            
            {/* API Key Warning for Imagen models */}
            {isKeySelectionOpen && (
                <div className="dialog-backdrop" onClick={() => setIsKeySelectionOpen(false)}>
                    <div className="dialog-container max-w-sm" onClick={e => e.stopPropagation()}>
                        <div className="dialog-header pb-2">
                            <h3 className="m3-headline-small text-error">API Key Richiesta</h3>
                            <button onClick={() => setIsKeySelectionOpen(false)} className="icon-button"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="dialog-content space-y-4">
                            <p className="m3-body-medium text-on-surface-variant">
                                Per utilizzare la generazione di immagini e video (modelli Imagen/Veo), è necessaria una API Key abilitata al billing.
                            </p>
                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="link-button flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Scopri di più sul billing
                            </a>
                        </div>
                        <div className="dialog-footer">
                            <button onClick={() => setIsKeySelectionOpen(false)} className="button button-text">Annulla</button>
                            {typeof (window as any).aistudio !== 'undefined' && (
                                <button onClick={handleSelectKey} className="button button-filled">Seleziona API Key (Demo)</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Context Selection Card */}
            <div className="card card-accent-primary">
                <h2 className="m3-title-large mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">folder_open</span>
                    1. Seleziona Contesto (Knowledge Base)
                </h2>
                <div className="flex flex-wrap gap-4 items-end mb-4">
                    <div className="flex-grow min-w-[250px]">
                        <label className="form-label">Filtra per Set di Documenti</label>
                         <select 
                            value={selectedCorpusId} 
                            onChange={e => { setSelectedCorpusId(e.target.value); setSelectedFileIds([]); }} 
                            className="form-select w-full"
                        >
                            <option value="">Tutti i Documenti ({knowledgeBase.length})</option>
                            {corpora.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2 pb-2">
                        <span className="material-symbols-outlined text-on-surface-variant">attachment</span>
                        <p className="m3-body-medium text-on-surface-variant font-bold">
                            {selectedFileIds.length} file selezionati
                        </p>
                    </div>
                </div>

                {/* Centralized Selection Container */}
                <div className="selection-container selection-scroll-container small row-layout">
                    {availableFiles.map(entry => (
                        <div key={entry.id} className="chip-checkbox">
                            <input type="checkbox" id={`studio-file-${entry.id}`} checked={selectedFileIds.includes(entry.id)} onChange={() => handleFileToggle(entry.id)} />
                            <label htmlFor={`studio-file-${entry.id}`} className="chip">
                                {selectedFileIds.includes(entry.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                <span className="material-symbols-outlined text-primary mr-1 text-base">{entry.isGenerated ? 'auto_awesome' : 'description'}</span>
                                <span className="truncate">{entry.fileName}</span>
                            </label>
                        </div>
                    ))}
                    {availableFiles.length === 0 && (
                        <p className="text-sm text-on-surface-variant italic p-2">Nessun file disponibile in questo set.</p>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="card flex flex-col items-center justify-center p-12">
                    <AiThinkingGem size="large" text={loadingTaskName || "L'AI sta lavorando..."} />
                </div>
            )}

            {/* Actions Cards - Visible only when not loading */}
            {!isLoading && (
                <div className="studio-grid">
                    {/* Generation Card */}
                    <div className="card h-full card-top-accent-tertiary">
                        <div className="mb-4">
                            <h2 className="m3-title-large flex items-center gap-2">
                                <span className="material-symbols-outlined text-tertiary">design_services</span>
                                Generazione & Creatività
                            </h2>
                            <p className="m3-body-small text-on-surface-variant mt-1">Crea nuovi contenuti didattici.</p>
                        </div>
                        {renderActionGrid(studioActions.filter(a => a.category === 'generation'))}
                    </div>

                    {/* Analysis Card */}
                    <div className="card h-full card-top-accent-secondary">
                        <div className="mb-4">
                            <h2 className="m3-title-large flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">analytics</span>
                                Analisi & Sintesi
                            </h2>
                            <p className="m3-body-small text-on-surface-variant mt-1">Rielabora e comprendi i documenti.</p>
                        </div>
                        {renderActionGrid(studioActions.filter(a => a.category === 'analysis'))}
                    </div>
                </div>
            )}
            
            {/* Modals */}
            {isDocumentGeneratorOpen && (
                <DocumentGeneratorModal 
                    onClose={() => setIsDocumentGeneratorOpen(false)}
                    onGenerate={(prompt) => runTask('document', prompt)}
                />
            )}

            {isImageGeneratorOpen && (
                <ImageGeneratorModal
                    onClose={() => setIsImageGeneratorOpen(false)}
                    onGenerate={(prompt) => runTask('image', prompt)}
                />
            )}

            {isTestGeneratorOpen && (
                <TestGeneratorModal
                    onClose={() => setIsTestGeneratorOpen(false)}
                    onGenerate={(config) => runTask('quiz', '', config)}
                />
            )}

            {generatedQuiz && (
                <TestPreviewModal
                    quiz={generatedQuiz}
                    onClose={() => setGeneratedQuiz(null)}
                />
            )}
        </div>
    );
};
