
// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.


import React, { useState, useEffect, useRef } from 'react';
import { AiSettings, Corpus, ChatMessage, KnowledgeBaseEntry } from '../types';
import { generateAnswerFromCorpus } from '../services/aiService';
import { M3IconButton, M3Typography } from './ui';
// MD3 Pure: Migrated to inline styles using MD3 tokens for chat interface, message bubbles, and input controls
// All corpus-chat-* classes removed in favor of token-based styling

// Add this CSS animation to your global styles or component:
// @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
        <div style={{ height: 'var(--md-sys-viewport-height-full)', display: 'flex', flexDirection: 'column' }}>
            <div style={{display: 'flex'}}>
                <M3IconButton 
                    icon="arrow_back" 
                    onClick={onClose} 
                    ariaLabel="Torna alla lista"
                />
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-element)',
                        minWidth: 0,
                        flex: 1}}>
                        <div style={{borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--app-color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--app-color-on-primary)'}}>chat</span>
                        </div>
                        <M3Typography variant="title-large" style={{color: 'var(--app-color-on-surface)',
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'}}>Chat con "{corpus.displayName}"</M3Typography>
                    </div>
                </div>
                
                <div style={{flex: 1,
                    overflowY: 'auto',
                    padding: 'var(--app-spacing-container)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-element)'}}>
                {messages.map((msg, index) => (
                    <div key={index} style={{display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: 'var(--app-spacing-component)'}}>
                        <div style={{maxWidth: 'var(--md-sys-percent-70)',
                            padding: 'var(--app-spacing-element)',
                            borderRadius: msg.role === 'user' 
                                ? `var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large)`
                                : `var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small)`,
                            backgroundColor: msg.role === 'user' 
                                ? 'var(--app-color-primary)'
                                : 'var(--md-sys-color-surface-container-high)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <M3Typography variant="body-large" style={{color: msg.role === 'user' 
                                    ? 'var(--app-color-on-primary)'
                                    : 'var(--app-color-on-surface)',
                                margin: 0}}>{msg.text}</M3Typography>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div style={{display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: 'var(--app-spacing-component)'}}>
                        <div style={{maxWidth: 'var(--md-sys-percent-70)',
                            padding: 'var(--app-spacing-element)',
                            borderRadius: `var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small)`,
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-component)'}}>
                                <div style={{borderRadius: 'var(--app-layout-half)'}} />
                                <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                                    margin: 0}}>Sto pensando...</M3Typography>
                            </div>
                        </div>
                    </div>
                )}
                 {messages.length === 0 && !isLoading && (
                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: 'var(--md-sys-spacing-8)',
                        textAlign: 'center',
                        gap: 'var(--app-spacing-container)'}}>
                        <div style={{borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--app-color-secondary-container)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--app-color-on-secondary-container)'}}>quiz</span>
                        </div>
                        <M3Typography variant="body-large" style={{color: 'var(--md-sys-color-on-surface-variant)',
                            margin: 0}}>Poni una domanda ai documenti in questo set.</M3Typography>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{padding: 'var(--app-spacing-container)',
                borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                backgroundColor: 'var(--md-sys-color-surface-container-low)'}}>
                <div style={{display: 'flex',
                    gap: 'var(--app-spacing-component)',
                    flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => handleShortcut("Crea un riassunto dettagliato dei documenti forniti.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            padding: 'var(--app-spacing-element)',
                            backgroundColor: 'var(--app-color-secondary-container)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            cursor: 'pointer',
                            transition: `all var(--app-motion-quick) var(--app-easing-standard)`,
                            textDecoration: 'none'}}
                        onMouseEnter={() => {
                            // removed runtime mutation
                            // removed runtime mutation
                        }}
                        onMouseLeave={() => {
                            // removed runtime mutation
                            // removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--app-color-on-secondary-container)'}}>summarize</span>
                        <M3Typography variant="label-large" style={{color: 'var(--app-color-on-secondary-container)',
                            margin: 0}}>Riassumi</M3Typography>
                    </button>
                    <button 
                        onClick={() => handleShortcut("Genera 5 domande a risposta multipla con 4 opzioni ciascuna (indicando la risposta corretta) basandoti sui documenti.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            padding: 'var(--app-spacing-element)',
                            backgroundColor: 'var(--md-sys-color-tertiary-container)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            cursor: 'pointer',
                            transition: `all var(--app-motion-quick) var(--app-easing-standard)`,
                            textDecoration: 'none'}}
                        onMouseEnter={() => {
                            // removed runtime mutation
                        }}
                        onMouseLeave={() => {
                            // removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--md-sys-color-on-tertiary-container)'}}>quiz</span>
                        <M3Typography variant="label-large" style={{color: 'var(--md-sys-color-on-tertiary-container)',
                            margin: 0}}>Crea Quiz</M3Typography>
                    </button>
                    <button 
                        onClick={() => handleShortcut("Estrai i 5 concetti chiave da questi documenti e descrivili brevemente.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            padding: 'var(--app-spacing-element)',
                            backgroundColor: 'var(--app-color-primary-container)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            cursor: 'pointer',
                            transition: `all var(--app-motion-quick) var(--app-easing-standard)`,
                            textDecoration: 'none'}}
                        onMouseEnter={() => {
                            // removed runtime mutation
                            // removed runtime mutation
                        }}
                        onMouseLeave={() => {
                            // removed runtime mutation
                            // removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--app-color-on-primary-container)'}}>key</span>
                        <M3Typography variant="label-large" style={{color: 'var(--app-color-on-primary-container)',
                            margin: 0}}>Concetti Chiave</M3Typography>
                    </button>
                </div>
            </div>

            <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }}
                style={{display: 'flex',
                    padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                    gap: 'var(--app-spacing-component)'}}
            >
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fai una domanda..."
                    style={{flex: 1,
                        padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        color: 'var(--app-color-on-surface)',
                        outline: 'none',
                        transition: `border-color var(--app-motion-quick) var(--app-easing-standard)`}}
                    onFocus={() => {
                        // removed runtime mutation
                    }}
                    onBlur={() => {
                        // removed runtime mutation
                    }}
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !chatInput.trim()}
                    style={{borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'none',
                        backgroundColor: (isLoading || !chatInput.trim()) 
                            ? 'var(--md-sys-color-surface-container-high)' 
                            : 'var(--app-color-primary)',
                        color: (isLoading || !chatInput.trim()) 
                            ? 'var(--md-sys-color-on-surface-variant)' 
                            : 'var(--app-color-on-primary)',
                        cursor: (isLoading || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: `all var(--app-motion-quick) var(--app-easing-standard)`}}
                >
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>send</span>
                </button>
            </form>
        </div>
    );
};

export default CorpusChat;








