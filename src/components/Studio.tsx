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
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, AiThinkingGem } from './ui';


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
                    <div className="flex justify-between items-start w-full mb-8">
                        <span className="material-symbols-outlined tool-icon group-hover:scale-110 transition-transform">{action.icon}</span>
                        {action.requiresContent && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${selectedFileIds.length > 0 ? 'border-current opacity-70' : 'border-[var(--md-sys-color-outline)] text-outline'}`}>
                                Input KB
                            </span>
                        )}
                    </div>
                    <span className="tool-title">{action.title}</span>
                    <span className="tool-subtitle mt-4 line-clamp-2">{action.description}</span>
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
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium">Studio AI</h1>
                    <p className="page-subtitle">Laboratorio per trasformare e generare contenuti con il tuo contesto.</p>
                </div>
            </div>
            
             <Guidance id="studio-ai-intro" icon="auto_fix_high" title="Il tuo Laboratorio Creativo" isGloballyEnabled={showGuidanceTips}>
                <p>
                    Usa lo Studio AI come un laboratorio per trasformare i tuoi materiali. Seleziona i documenti di partenza (il contesto), poi scegli un'azione. L'AI genererà nuovi contenuti (riassunti, presentazioni, verifiche) che potrai trasformare in lezioni o esportare.
                </p>
            </Guidance>
            
            {/* API Key Warning for Imagen models */}
            {isKeySelectionOpen && (
                <M3Dialog
                    title="API Key Richiesta"
                    onClose={() => setIsKeySelectionOpen(false)}
                    maxWidth="sm"
                    level={2}
                >
                    <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm space-y-4">
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">
                            Per utilizzare la generazione di immagini e video (modelli Imagen/Veo), è necessaria una API Key abilitata al billing.
                        </p>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="link-button flex items-center gap-8">
                            <span className="material-symbols-outlined text-sm">info</span>
                            Scopri di più sul billing
                        </a>
                    </M3DialogContent>
                    <M3DialogActions>
                        <M3Button onClick={() => setIsKeySelectionOpen(false)} variant="text">Annulla</M3Button>
                        {typeof (window as any).aistudio !== 'undefined' && (
                            <M3Button onClick={handleSelectKey} variant="filled">Seleziona API Key (Demo)</M3Button>
                        )}
                    </M3DialogActions>
                </M3Dialog>
            )}

            {/* Context Selection Card */}
            <div className="card card-accent-primary">
                <h2 className="m3-title-large mb-8 flex items-center gap-8">
                    <span className="material-symbols-outlined text-primary">folder_open</span>
                    1. Seleziona Contesto (Knowledge Base)
                </h2>
                <div className="flex flex-wrap gap-8 items-end mb-8">
                    <div className="flex-grow min-w-[250px]">
                        <SelectField 
                            label="Filtra per Set di Documenti"
                            value={selectedCorpusId} 
                            onChange={e => { setSelectedCorpusId(e.target.value); setSelectedFileIds([]); }} 
                            options={[
                                { value: '', label: `Tutti i Documenti (${knowledgeBase.length})` },
                                ...corpora.map(c => ({ value: c.id, label: c.displayName }))
                            ]}
                        />
                    </div>
                     <div className="flex items-center gap-8 pb-2">
                        <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">attachment</span>
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant font-bold">
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
                        <p className="text-sm text-[var(--md-sys-color-on-surface)]-variant italic p-8">Nessun file disponibile in questo set.</p>
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
                        <div className="mb-8">
                            <h2 className="m3-title-large flex items-center gap-8">
                                <span className="material-symbols-outlined text-tertiary">design_services</span>
                                Generazione & Creatività
                            </h2>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant mt-4">Crea nuovi contenuti didattici.</p>
                        </div>
                        {renderActionGrid(studioActions.filter(a => a.category === 'generation'))}
                    </div>

                    {/* Analysis Card */}
                    <div className="card h-full card-top-accent-secondary">
                        <div className="mb-8">
                            <h2 className="m3-title-large flex items-center gap-8">
                                <span className="material-symbols-outlined text-secondary">analytics</span>
                                Analisi & Sintesi
                            </h2>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant mt-4">Rielabora e comprendi i documenti.</p>
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

export default Studio;
