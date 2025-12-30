import React, { useState, useMemo, useEffect, useRef } from 'react';
import { KnowledgeBaseEntry, AiSettings, Corpus, ChatMessage, NotebookNote } from '../types';
import { generateAnswerFromCorpus, generateStudioOutput } from '../services/aiService';
import AddSourceModal from './AddSourceModal';

interface NotebookViewProps {
  knowledgeBase: KnowledgeBaseEntry[];
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
  corpora: Corpus[];
  setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
  notebookNotes: Record<string, NotebookNote[]>;
  setNotebookNotes: React.Dispatch<React.SetStateAction<Record<string, NotebookNote[]>>>;
  aiSettings: AiSettings;
  onCreateLessonFromNote: (note: NotebookNote) => void;
  readOnly?: boolean;
}


type StudioTask = 'summary' | 'key_points' | 'qa' | 'flashcards' | 'presentation';
type WorkspaceTab = 'chat' | 'studio' | 'notes';

const studioActions = [
    { id: 'summary', icon: 'summarize', title: 'Crea Riassunto', description: 'Genera un riassunto conciso e strutturato.' },
    { id: 'key_points', icon: 'key', title: 'Estrai Punti Chiave', description: 'Identifica i concetti più importanti.' },
    { id: 'qa', icon: 'quiz', title: 'Genera Domande', description: 'Crea domande e risposte per la verifica.' },
    { id: 'flashcards', icon: 'style', title: 'Crea Flashcard', description: 'Produci flashcard per il ripasso.' },
    { id: 'presentation', icon: 'slideshow', title: 'Bozza Presentazione', description: 'Struttura una presentazione con slide.' },
];

const NotebookView: React.FC<NotebookViewProps> = (props) => {
    const { corpora, setCorpora, knowledgeBase, setKnowledgeBase, notebookNotes, setNotebookNotes, aiSettings, onCreateLessonFromNote, readOnly = false } = props;
    
    const [selectedCorpusId, setSelectedCorpusId] = useState<string | null>(null);
    const [isCreatingCorpus, setIsCreatingCorpus] = useState(false);
    const [newCorpusName, setNewCorpusName] = useState('');
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    
    const [activeTab, setActiveTab] = useState<WorkspaceTab>('chat');
    const [isMobileWorkspaceVisible, setIsMobileWorkspaceVisible] = useState(false);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Studio State
    const [isStudioLoading, setIsStudioLoading] = useState(false);
    const [studioResult, setStudioResult] = useState<{title: string, content: string} | null>(null);

    // Notes State
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteContent, setEditingNoteContent] = useState('');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedCorpus = useMemo(() => corpora.find(c => c.id === selectedCorpusId), [corpora, selectedCorpusId]);
    const corpusFiles = useMemo(() => knowledgeBase.filter(f => f.corpusId === selectedCorpusId), [knowledgeBase, selectedCorpusId]);
    const corpusNotes = useMemo(() => notebookNotes[selectedCorpusId || ''] || [], [notebookNotes, selectedCorpusId]);

    // FIX: Re-initialize messages when selectedCorpus or its chatHistory changes
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    useEffect(() => {
        setMessages(selectedCorpus?.chatHistory || []);
    }, [selectedCorpus]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messagesEndRef]); // Removed selectedCorpusId and corpora as messages state already depends on selectedCorpus


    const handleCreateCorpus = () => {
        if (!newCorpusName.trim()) return;
        const newCorpus: Corpus = {
            id: `corpus-client-${Date.now()}`,
            displayName: newCorpusName.trim(),
            chatHistory: [],
        };
        setCorpora(prev => [...prev, newCorpus]);
        setNewCorpusName('');
        setIsCreatingCorpus(false);
        handleSelectCorpus(newCorpus.id);
    };
    
    const handleSelectCorpus = (corpusId: string) => {
        setSelectedCorpusId(corpusId);
        setIsMobileWorkspaceVisible(true); // Show workspace on mobile after selection
    };

    const handleBackToProjects = () => {
        setSelectedCorpusId(null);
        setIsMobileWorkspaceVisible(false); // Go back to project list
    };

    const handleAddEntries = (newEntries: KnowledgeBaseEntry[]) => {
        setKnowledgeBase(prev => [...prev, ...newEntries]);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !selectedCorpus || isChatLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: chatInput };
        const updatedHistory = [...(selectedCorpus.chatHistory || []), userMessage];
        setCorpora(prev => prev.map(c => c.id === selectedCorpusId ? { ...c, chatHistory: updatedHistory } : c));
        setChatInput('');
        setIsChatLoading(true);

        try {
            if (corpusFiles.length === 0) throw new Error("Aggiungi fonti a questo progetto per iniziare a chattare.");
            const corpusContent = corpusFiles.map(e => `--- Contenuto da: ${e.fileName} ---\n${e.content}`).join('\n\n');
            const modelResponse = await generateAnswerFromCorpus(aiSettings, corpusContent, chatInput);
            setCorpora(prev => prev.map(c => c.id === selectedCorpusId ? { ...c, chatHistory: [...updatedHistory, modelResponse] } : c));
        } catch (error: unknown) {
            let message = 'Errore sconosciuto';
            if (error instanceof Error) message = error.message;
            const errorMessage: ChatMessage = { role: 'model', text: `Errore: ${message}` };
            setCorpora(prev => prev.map(c => c.id === selectedCorpusId ? { ...c, chatHistory: [...updatedHistory, errorMessage] } : c));
        } finally {
            setIsChatLoading(false);
        }
    };
    
    const handleStudioAction = async (task: string, title: string) => {
        if (!selectedCorpus || isStudioLoading) return;
        
        setIsStudioLoading(true);
        setStudioResult(null);
        try {
            if (corpusFiles.length === 0) throw new Error("Aggiungi fonti al progetto per usare lo Studio AI.");
            const corpusContent = corpusFiles.map(e => `--- Contenuto da: ${e.fileName} ---\n${e.content}`).join('\n\n');
            const output = await generateStudioOutput(aiSettings, corpusContent, task as StudioTask);
            setStudioResult({ title, content: output });
        } catch (error: unknown) {
            let message = 'Errore sconosciuto';
            if (error instanceof Error) message = error.message;
            alert(message);
        } finally {
            setIsStudioLoading(false);
        }
    };

    const handleSaveStudioResultToNotes = () => {
        if (!studioResult || !selectedCorpusId || readOnly) return;
        const newNote: NotebookNote = {
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            content: `## ${studioResult.title}\n\n${studioResult.content}`
        };
        setNotebookNotes(prev => ({ ...prev, [selectedCorpusId]: [...(prev[selectedCorpusId] || []), newNote]}));
        setStudioResult(null);
        setActiveTab('notes');
    };
    
    const handleSaveNote = () => {
        if (!editingNoteId || !selectedCorpusId || readOnly) return;
        setNotebookNotes(prev => ({
            ...prev,
            [selectedCorpusId]: prev[selectedCorpusId].map(n => n.id === editingNoteId ? { ...n, content: editingNoteContent } : n)
        }));
        setEditingNoteId(null);
    };

    const startEditingNote = (note: NotebookNote) => {
        setEditingNoteId(note.id);
        setEditingNoteContent(note.content);
    };

    const handleCreateNote = () => {
        if (!selectedCorpusId || readOnly) return;
        const newNote: NotebookNote = {
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            content: `# Nuova Nota\n\n`
        };
        setNotebookNotes(prev => ({ ...prev, [selectedCorpusId]: [...(prev[selectedCorpusId] || []), newNote]}));
        startEditingNote(newNote);
    };

    const handleDeleteNote = (noteId: string) => {
        if (!selectedCorpusId || !window.confirm("Sei sicuro di voler eliminare questa nota?") || readOnly) return;
        setNotebookNotes(prev => ({
            ...prev,
            [selectedCorpusId]: prev[selectedCorpusId].filter(n => n.id !== noteId)
        }));
    };


    return (
        <div className={`notebook-layout ${isMobileWorkspaceVisible ? 'mobile-workspace-visible' : ''}`}>
            <aside className="notebook-sidebar">
                <div className="notebook-sidebar-header">
                    <h2 className="m3-title-large">Progetti</h2>
                    {!readOnly && (
                        <button onClick={() => setIsCreatingCorpus(p => !p)} className="icon-button rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined">{isCreatingCorpus ? 'close' : 'add'}</span>
                        </button>
                    )}
                </div>
                {isCreatingCorpus && !readOnly && (
                    <div className="input-action-group p-2">
                        <input type="text" value={newCorpusName} onChange={e => setNewCorpusName(e.target.value)} placeholder="Nome progetto..." className="form-input flex-grow rounded-lg" autoFocus onKeyDown={e => e.key === 'Enter' && handleCreateCorpus()} />
                        <button onClick={handleCreateCorpus} className="button button-filled !h-10 !px-3 rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined">check</span></button>
                    </div>
                )}
                <div className="notebook-project-list">
                    {corpora.map(corpus => (
                        <div key={corpus.id} onClick={() => handleSelectCorpus(corpus.id)} className={`notebook-project-item ${selectedCorpusId === corpus.id ? 'active' : ''}`} style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}>
                            <span className="material-symbols-outlined">folder</span>
                            <span className="m3-label-large truncate">{corpus.displayName}</span>
                        </div>
                    ))}
                </div>
            </aside>
            <main className="notebook-main">
                 <div className="notebook-mobile-header">
                    <button onClick={handleBackToProjects} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="m3-title-medium truncate">{selectedCorpus?.displayName || 'Progetto'}</h2>
                </div>
                {!selectedCorpus ? (
                    <div className="notebook-placeholder">
                        <span className="material-symbols-outlined">source_environment</span>
                        <h3 className="m3-headline-small mt-4">Seleziona un progetto</h3>
                        <p className="m3-body-large">Scegli un progetto dalla barra laterale.</p>
                    </div>
                ) : (
                    <div className="notebook-workspace-layout">
                        <div className="notebook-sources-panel">
                            <h3 className="m3-title-medium px-2">Fonti ({corpusFiles.length})</h3>
                             <div className="notebook-sources-list">
                                {corpusFiles.map(file => (
                                    <div key={file.id} className="notebook-source-item" style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}>
                                        <span className="material-symbols-outlined text-primary">{file.isGenerated ? 'auto_awesome' : 'description'}</span>
                                        <span className="m3-body-medium truncate">{file.fileName}</span>
                                    </div>
                                ))}
                            </div>
                            {!readOnly && (
                                <button onClick={() => setIsAddSourceModalOpen(true)} className="button button-filled w-full mt-auto rounded-lg hover:shadow-md transition-all">
                                    <span className="material-symbols-outlined mr-2">add</span> Aggiungi Fonti
                                </button>
                            )}
                        </div>
                        <div className="notebook-workspace">
                            <div className="notebook-tabs">
                                <button onClick={() => setActiveTab('chat')} className={`notebook-tab ${activeTab === 'chat' ? 'active' : ''}`} style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}><span className="material-symbols-outlined">chat</span> Chat</button>
                                <button onClick={() => setActiveTab('studio')} className={`notebook-tab ${activeTab === 'studio' ? 'active' : ''}`} style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}><span className="material-symbols-outlined">auto_fix_high</span> Studio</button>
                                {!readOnly && <button onClick={() => setActiveTab('notes')} className={`notebook-tab ${activeTab === 'notes' ? 'active' : ''}`} style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}><span className="material-symbols-outlined">edit_note</span> Note</button>}
                            </div>
                            <div className="notebook-tab-content">
                                {activeTab === 'chat' && (
                                    <div className="corpus-chat-container">
                                        <div className="corpus-chat-messages">
                                            {(selectedCorpus?.chatHistory || []).map((msg, i) => (
                                                <div key={i} className={`chat-message-bubble ${msg.role}`}><div className="chat-message-content"><p className="whitespace-pre-wrap">{msg.text}</p></div></div>
                                            ))}
                                            {isChatLoading && <div className="chat-message-bubble model"><div className="chat-message-content"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div></div></div>}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <form onSubmit={e => {e.preventDefault(); handleSendMessage();}} className="corpus-chat-input-form">
                                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Fai una domanda..." className="form-input flex-grow rounded-full" disabled={isChatLoading} />
                                            <button type="submit" className="button button-filled rounded-lg hover:shadow-md transition-all" disabled={isChatLoading || !chatInput}><span className="material-symbols-outlined">send</span></button>
                                        </form>
                                    </div>
                                )}
                                {activeTab === 'studio' && (
                                    <div className="p-4 space-y-4">
                                        <div className="studio-action-grid">
                                            {studioActions.map(action => (
                                                <button key={action.id} onClick={() => handleStudioAction(action.id, action.title)} className="studio-action-card" disabled={isStudioLoading} style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}>
                                                    <div className="studio-action-card-icon"><span className="material-symbols-outlined">{action.icon}</span></div>
                                                    <div><p className="m3-title-medium">{action.title}</p><p className="m3-body-small text-on-surface-variant">{action.description}</p></div>
                                                </button>
                                            ))}
                                        </div>
                                        {isStudioLoading && <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}
                                        {studioResult && (
                                            <div className="studio-results-container">
                                                <h3 className="m3-title-large mb-2">{studioResult.title}</h3>
                                                <div className="prose max-w-none p-4 bg-surface-container-lowest rounded-lg h-full max-h-64 overflow-y-auto border border-outline-variant"><pre className="whitespace-pre-wrap">{studioResult.content}</pre></div>
                                                {!readOnly && <div className="flex justify-end mt-2"><button onClick={handleSaveStudioResultToNotes} className="button button-filled rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined mr-2">add_notes</span>Salva nelle Note</button></div>}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'notes' && !readOnly && (
                                    <div className="note-list">
                                        <button onClick={handleCreateNote} className="button button-filled rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined mr-2">add</span>Nuova Nota</button>
                                        {corpusNotes.map(note => (
                                            <div key={note.id} className="note-card" style={{ borderRadius: '8px', transition: 'var(--md-easing-standard)' }}>
                                                {editingNoteId === note.id ? (
                                                    <div className="space-y-2">
                                                        <textarea value={editingNoteContent} onChange={e => setEditingNoteContent(e.target.value)} className="form-textarea w-full rounded-lg" rows={8} />
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => setEditingNoteId(null)} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                                                            <button onClick={handleSaveNote} className="button button-filled rounded-lg hover:shadow-md transition-all">Salva</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="note-card-header">
                                                            <p className="m3-label-small text-on-surface-variant">Creato il: {new Date(note.createdAt).toLocaleDateString()}</p>
                                                            <div>
                                                                <button onClick={() => startEditingNote(note)} className="icon-button rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined">edit</span></button>
                                                                <button onClick={() => handleDeleteNote(note.id)} className="icon-button text-error rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined">delete</span></button>
                                                            </div>
                                                        </div>
                                                        <div className="note-card-content prose max-w-none"><pre className="whitespace-pre-wrap">{note.content}</pre></div>
                                                        <div className="note-card-actions">
                                                            <button onClick={() => onCreateLessonFromNote(note)} className="button button-tonal rounded-lg hover:shadow-md transition-all">
                                                                <span className="material-symbols-outlined mr-2">add_task</span>Crea Lezione da questa Nota
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {isAddSourceModalOpen && selectedCorpusId && (
                <AddSourceModal corpora={corpora} setCorpora={setCorpora} onClose={() => setIsAddSourceModalOpen(false)} onAddEntries={handleAddEntries} />
            )}
        </div>
    );
};

export default NotebookView;
