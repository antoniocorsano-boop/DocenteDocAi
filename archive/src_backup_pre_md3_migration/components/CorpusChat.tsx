// LEGACY - MD3 Non-compliant


import React, { useState, useEffect, useRef } from 'react';
import { AiSettings, Corpus, ChatMessage, KnowledgeBaseEntry } from '../types';
import { generateAnswerFromCorpus } from '../services/aiService';
import { M3IconButton, M3Typography } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
        <div style={{display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: layers.sys.colors.surface,
            margin: '0 auto'}}>
            <div style={{display: 'flex',
                alignItems: 'center',
                padding: layers.ref.spacing['4'],
                backgroundColor: layers.sys.colors.surfaceContainerLow,
                borderBottom: `1px solid ${layers.sys.colors.outlineVariant}`,
                gap: layers.ref.spacing['3']}}>
                <M3IconButton 
                    icon="arrow_back" 
                    onClick={onClose} 
                    ariaLabel="Torna alla lista"
                />
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: layers.ref.spacing['3'],
                    minWidth: 0,
                    flex: 1}}>
                    <div style={{borderRadius: layers.ref.shape.corner.large,
                        backgroundColor: layers.sys.colors.primaryContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: layers.sys.colors.onPrimaryContainer}}>chat</span>
                    </div>
                    <M3Typography variant="title-large" style={{color: layers.sys.colors.onSurface,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'}}>Chat con "{corpus.displayName}"</M3Typography>
                </div>
            </div>
            
            <div style={{flex: 1,
                overflowY: 'auto',
                padding: layers.ref.spacing['4'],
                display: 'flex',
                flexDirection: 'column',
                gap: layers.ref.spacing['3']}}>
                {messages.map((msg, index) => (
                    <div key={index} style={{display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: layers.ref.spacing['2']}}>
                        <div style={{maxWidth: '70%',
                            padding: layers.ref.spacing['3'],
                            borderRadius: msg.role === 'user' 
                                ? `${layers.ref.shape.corner.large} ${layers.ref.shape.corner.large} ${layers.ref.shape.corner.small} ${layers.ref.shape.corner.large}`
                                : `${layers.ref.shape.corner.large} ${layers.ref.shape.corner.large} ${layers.ref.shape.corner.large} ${layers.ref.shape.corner.small}`,
                            backgroundColor: msg.role === 'user' 
                                ? layers.sys.colors.primaryContainer 
                                : layers.sys.colors.surfaceContainerHigh,
                            border: `1px solid ${layers.sys.colors.outlineVariant}`}}>
                            <M3Typography variant="body-large" style={{color: msg.role === 'user' 
                                    ? layers.sys.colors.onPrimaryContainer 
                                    : layers.sys.colors.onSurface,
                                margin: 0}}>{msg.text}</M3Typography>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div style={{display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: layers.ref.spacing['2']}}>
                        <div style={{maxWidth: '70%',
                            padding: layers.ref.spacing['3'],
                            borderRadius: `${layers.ref.shape.corner.large} ${layers.ref.shape.corner.large} ${layers.ref.shape.corner.large} ${layers.ref.shape.corner.small}`,
                            backgroundColor: layers.sys.colors.surfaceContainerHigh,
                            border: `1px solid ${layers.sys.colors.outlineVariant}`}}>
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['2']}}>
                                <div style={{borderRadius: '50%'}} />
                                <M3Typography variant="body-medium" style={{color: layers.sys.colors.onSurfaceVariant,
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
                        padding: layers.ref.spacing['8'],
                        textAlign: 'center',
                        gap: layers.ref.spacing['4']}}>
                        <div style={{borderRadius: layers.ref.shape.corner.large,
                            backgroundColor: layers.sys.colors.secondaryContainer,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: layers.sys.colors.onSecondaryContainer}}>quiz</span>
                        </div>
                        <M3Typography variant="body-large" style={{color: layers.sys.colors.onSurfaceVariant,
                            margin: 0}}>Poni una domanda ai documenti in questo set.</M3Typography>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{padding: layers.ref.spacing['4'],
                borderTop: `1px solid ${layers.sys.colors.outlineVariant}`,
                backgroundColor: layers.sys.colors.surfaceContainerLow}}>
                <div style={{display: 'flex',
                    gap: layers.ref.spacing['2'],
                    flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => handleShortcut("Crea un riassunto dettagliato dei documenti forniti.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['2'],
                            padding: layers.ref.spacing['3'],
                            backgroundColor: layers.sys.colors.secondaryContainer,
                            border: `1px solid ${layers.sys.colors.outlineVariant}`,
                            borderRadius: layers.ref.shape.corner.large,
                            cursor: 'pointer',
                            transition: `all ${layers.motion.duration.short} ${layers.motion.easing.standard}`,
                            textDecoration: 'none'}}
                        onMouseEnter={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: layers.sys.colors.onSecondaryContainer}}>summarize</span>
                        <M3Typography variant="label-large" style={{color: layers.sys.colors.onSecondaryContainer,
                            margin: 0}}>Riassumi</M3Typography>
                    </button>
                    <button 
                        onClick={() => handleShortcut("Genera 5 domande a risposta multipla con 4 opzioni ciascuna (indicando la risposta corretta) basandoti sui documenti.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['2'],
                            padding: layers.ref.spacing['3'],
                            backgroundColor: layers.sys.colors.tertiaryContainer,
                            border: `1px solid ${layers.sys.colors.outlineVariant}`,
                            borderRadius: layers.ref.shape.corner.large,
                            cursor: 'pointer',
                            transition: `all ${layers.motion.duration.short} ${layers.motion.easing.standard}`,
                            textDecoration: 'none'}}
                        onMouseEnter={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: layers.sys.colors.onTertiaryContainer}}>quiz</span>
                        <M3Typography variant="label-large" style={{color: layers.sys.colors.onTertiaryContainer,
                            margin: 0}}>Crea Quiz</M3Typography>
                    </button>
                    <button 
                        onClick={() => handleShortcut("Estrai i 5 concetti chiave da questi documenti e descrivili brevemente.")} 
                        style={{display: 'flex',
                            alignItems: 'center',
                            gap: layers.ref.spacing['2'],
                            padding: layers.ref.spacing['3'],
                            backgroundColor: layers.sys.colors.primaryContainer,
                            border: `1px solid ${layers.sys.colors.outlineVariant}`,
                            borderRadius: layers.ref.shape.corner.large,
                            cursor: 'pointer',
                            transition: `all ${layers.motion.duration.short} ${layers.motion.easing.standard}`,
                            textDecoration: 'none'}}
                        onMouseEnter={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget// removed runtime mutation
                            e.currentTarget// removed runtime mutation
                        }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: layers.sys.colors.onPrimaryContainer}}>key</span>
                        <M3Typography variant="label-large" style={{color: layers.sys.colors.onPrimaryContainer,
                            margin: 0}}>Concetti Chiave</M3Typography>
                    </button>
                </div>
            </div>

            <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }}
                style={{display: 'flex',
                    padding: layers.ref.spacing['4'],
                    backgroundColor: layers.sys.colors.surfaceContainerLow,
                    borderTop: `1px solid ${layers.sys.colors.outlineVariant}`,
                    gap: layers.ref.spacing['2']}}
            >
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fai una domanda..."
                    style={{flex: 1,
                        padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                        borderRadius: layers.ref.shape.corner.large,
                        border: `1px solid ${layers.sys.colors.outline}`,
                        backgroundColor: layers.sys.colors.surfaceContainerHigh,
                        color: layers.sys.colors.onSurface,
                        outline: 'none',
                        transition: `border-color ${layers.motion.duration.short} ${layers.motion.easing.standard}`}}
                    onFocus={(e) => {
                        e.target// removed runtime mutation
                    }}
                    onBlur={(e) => {
                        e.target// removed runtime mutation
                    }}
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !chatInput.trim()}
                    style={{borderRadius: layers.ref.shape.corner.large,
                        border: 'none',
                        backgroundColor: (isLoading || !chatInput.trim()) 
                            ? layers.sys.colors.surfaceContainerHigh 
                            : layers.sys.colors.primary,
                        color: (isLoading || !chatInput.trim()) 
                            ? layers.sys.colors.onSurfaceVariant 
                            : layers.sys.colors.onPrimary,
                        cursor: (isLoading || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: `all ${layers.motion.duration.short} ${layers.motion.easing.standard}`}}
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



