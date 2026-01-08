

import React, { useState, useEffect, useRef } from 'react';
import { AiSettings, Corpus, ChatMessage, KnowledgeBaseEntry } from '../types';
import { generateAnswerFromCorpus } from '../services/aiService';

interface CorpusChatProps {
    corpus: Corpus;
    aiSettings: AiSettings;
    onClose: () => void;
    knowledgeBase: KnowledgeBaseEntry[];
    setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
}

const CorpusChat: React.FC<CorpusChatProps> = ({ corpus, aiSettings, onClose, knowledgeBase, setCorpora }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(corpus.chatHistory || []);
    const [chatInput, setChatInput] = useState(''); // FIX: Define chatInput
    const [isLoading, setIsLoading] = useState(false); // FIX: Consistent naming with isLoading
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync local state back to the main state whenever messages change
    useEffect(() => {
        // Only update if the local state is different from the prop to avoid loops
        if (messages !== corpus.chatHistory) {
            setCorpora(prevCorpora => 
                prevCorpora.map(c => 
                    c.id === corpus.id ? { ...c, chatHistory: messages } : c
                )
            );
        }
    }, [messages, corpus.id, corpus.chatHistory, setCorpora]);

    // FIX: Re-initialize messages when selectedCorpus or its chatHistory changes
    useEffect(() => {
        setMessages(corpus.chatHistory || []);
    }, [corpus]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messagesEndRef]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !corpus || isLoading) return; // FIX: Use 'corpus' prop directly and 'isLoading'
        
        const userMessage: ChatMessage = { role: 'user', text };
        const updatedHistory = [...messages, userMessage]; // FIX: Define updatedHistory
        setMessages(updatedHistory);
        setChatInput('');
        setIsLoading(true);

        try {
            const corpusFiles = knowledgeBase.filter(e => e.corpusId === corpus.id);
            if (corpusFiles.length === 0) {
                 throw new Error("Questo set di documenti è vuoto. Aggiungi dei file per poter chattare.");
            }
            const corpusContent = corpusFiles.map(e => `--- Contenuto da: ${e.fileName} ---\n${e.content}`).join('\n\n');
            const modelResponse = await generateAnswerFromCorpus(aiSettings, corpusContent, text); // FIX: Use 'text' parameter here
            setMessages(prev => [...prev, modelResponse]); // Update local state directly

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Riprova.';
            console.error("Error generating answer from corpus:", errorMsg);
            const errorMessage: ChatMessage = {
                role: 'model',
                text: `Si è verificato un errore: ${errorMsg}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleShortcut = (prompt: string) => {
        handleSendMessage(prompt);
    }

    return (
        <div className="corpus-chat-container">
            <div className="kb-preview-header">
                <button className="icon-button kb-mobile-back-button" onClick={onClose} aria-label="Torna alla lista">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex items-center gap-8 truncate">
                    <span className="material-symbols-outlined text-secondary">chat</span>
                    <h3 className="m3-title-medium truncate">Chat con "{corpus.displayName}"</h3>
                </div>
            </div>
            
            <div className="corpus-chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message-bubble ${msg.role}`}>
                        <div className="chat-message-content">
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="chat-message-bubble model">
                        <div className="chat-message-content">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        </div>
                    </div>
                )}
                 {messages.length === 0 && !isLoading && (
                    <div className="text-center p-8 text-[var(--md-sys-color-on-surface)]-variant">
                        <span className="material-symbols-outlined text-5xl">quiz</span>
                        <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] mt-4">Poni una domanda ai documenti in questo set.</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="corpus-chat-shortcuts">
                <div className="flex gap-8 p-8 justify-center">
                    <button onClick={() => handleShortcut("Crea un riassunto dettagliato dei documenti forniti.")} className="button button-tonal !h-auto !py-1 !px-3 m3-label-small">
                        <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] mr-1">summarize</span> Riassumi
                    </button>
                    <button onClick={() => handleShortcut("Genera 5 domande a risposta multipla con 4 opzioni ciascuna (indicando la risposta corretta) basandoti sui documenti.")} className="button button-tonal !h-auto !py-1 !px-3 m3-label-small">
                        <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] mr-1">quiz</span> Crea Quiz
                    </button>
                    <button onClick={() => handleShortcut("Estrai i 5 concetti chiave da questi documenti e descrivili brevemente.")} className="button button-tonal !h-auto !py-1 !px-3 m3-label-small">
                        <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] mr-1">key</span> Concetti Chiave
                    </button>
                </div>
            </div>

            <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }}
                className="corpus-chat-input-form"
            >
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fai una domanda..."
                    className="form-input flex-grow"
                    disabled={isLoading}
                />
                <button type="submit" className="button button-filled" disabled={isLoading || !chatInput.trim()}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    );
};

export default CorpusChat;


