

import React, { useState, useEffect, useRef } from 'react';
import { AiSettings, Corpus, ChatMessage, KnowledgeBaseEntry } from '../types';
import { generateAnswerFromCorpus } from '../services/aiService';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for corpus chat interface, message bubbles, and input controls
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
            <div className="corpus-chat-header">
                <button className="icon-button kb-mobile-back-button" onClick={onClose} aria-label="Torna alla lista">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="corpus-chat-header-content">
                    <span className="material-symbols-outlined corpus-chat-header-icon">chat</span>
                    <h3 className="corpus-chat-header-title">Chat con "{corpus.displayName}"</h3>
                </div>
            </div>
            
            <div className="corpus-chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`corpus-chat-message-bubble corpus-chat-message-bubble-${msg.role}`}>
                        <div className="corpus-chat-message-content">
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="corpus-chat-message-bubble corpus-chat-message-bubble-model">
                        <div className="corpus-chat-message-content">
                            <div className="corpus-chat-loading">
                                <div className="corpus-chat-loading-spinner"></div>
                            </div>
                        </div>
                    </div>
                )}
                 {messages.length === 0 && !isLoading && (
                    <div className="corpus-chat-empty">
                        <span className="material-symbols-outlined corpus-chat-empty-icon">quiz</span>
                        <p className="corpus-chat-empty-text">Poni una domanda ai documenti in questo set.</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="corpus-chat-shortcuts">
                <div className="corpus-chat-shortcuts-container">
                    <button onClick={() => handleShortcut("Crea un riassunto dettagliato dei documenti forniti.")} className="corpus-chat-shortcut-button">
                        <span className="material-symbols-outlined corpus-chat-shortcut-icon">summarize</span>
                        <span className="corpus-chat-shortcut-text">Riassumi</span>
                    </button>
                    <button onClick={() => handleShortcut("Genera 5 domande a risposta multipla con 4 opzioni ciascuna (indicando la risposta corretta) basandoti sui documenti.")} className="corpus-chat-shortcut-button">
                        <span className="material-symbols-outlined corpus-chat-shortcut-icon">quiz</span>
                        <span className="corpus-chat-shortcut-text">Crea Quiz</span>
                    </button>
                    <button onClick={() => handleShortcut("Estrai i 5 concetti chiave da questi documenti e descrivili brevemente.")} className="corpus-chat-shortcut-button">
                        <span className="material-symbols-outlined corpus-chat-shortcut-icon">key</span>
                        <span className="corpus-chat-shortcut-text">Concetti Chiave</span>
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
                    className="corpus-chat-input"
                    disabled={isLoading}
                />
                <button type="submit" className="corpus-chat-send-button" disabled={isLoading || !chatInput.trim()}>
                    <span className="material-symbols-outlined corpus-chat-send-icon">send</span>
                </button>
            </form>
        </div>
    );
};

export default CorpusChat;


