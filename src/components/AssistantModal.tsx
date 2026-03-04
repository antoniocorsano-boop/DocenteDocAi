// MD3 Compliant - Block J Migration Complete (4 violations eliminated)
// Note: Scrollable areas use viewport height tokens for functional UX
import React, { useState, useRef, useEffect } from 'react';
import { fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, NotebookLMFile } from '../services/notebooklmService';
import { chatWithAi } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
import { AiSettings, ChatMessage } from '../types';
interface AssistantModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'chat' | 'docs' | 'tools' | 'backup';
  aiSettings: AiSettings;
  context?: unknown;
  onOpenImageAnalysis?: () => void;
  onOpenVideoAnalysis?: () => void;
  onOpenCircularAnalysis?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Come posso usare questa funzione?',
  'Genera una traccia per una lezione',
  'Suggerisci una valutazione',
  'Spiegami questa schermata',
];

const TABS: { key: 'chat' | 'docs' | 'tools'; label: string; icon: string }[] = [
  { key: 'chat', label: 'Chat', icon: 'chat' },
  { key: 'docs', label: 'Documenti', icon: 'import_contacts' },
  { key: 'tools', label: 'Strumenti AI', icon: 'auto_awesome' },
];

const AssistantModal: React.FC<AssistantModalProps> = ({
  open,
  onClose,
  mode = 'chat',
  aiSettings,
  context,
  onOpenImageAnalysis,
  onOpenVideoAnalysis,
  onOpenCircularAnalysis,
}) => {
  const [activeMode, setActiveMode] = React.useState<'chat' | 'docs' | 'tools'>(mode === 'backup' ? 'chat' : (mode as 'chat' | 'docs' | 'tools'));

  // Sync activeMode when mode prop changes (e.g. FAB action selection)
  useEffect(() => {
    if (mode !== 'backup') setActiveMode(mode as 'chat' | 'docs' | 'tools');
  }, [mode]);
  const [input, setInput] = useState('');
  // NotebookLM state
  const [nbFiles, setNbFiles] = useState<NotebookLMFile[]>([]);
  const [nbLoading, setNbLoading] = useState(false);
  const [nbError, setNbError] = useState<string | null>(null);
  const nbFileInput = useRef<HTMLInputElement>(null);
  
  // Carica elenco file NotebookLM all'apertura modale docs
  useEffect(() => {
    if (activeMode === 'docs' && open) {
      setNbLoading(true);
      fetchNotebookFiles().then(setNbFiles).catch(() => setNbError('Errore caricamento files')).finally(() => setNbLoading(false));
    }
  }, [activeMode, open]);

  const handleNbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setNbLoading(true);
    setNbError(null);
    try {
      const file = e.target.files[0];
      const uploaded = await uploadNotebookFile(file);
      setNbFiles(files => [uploaded, ...files]);
    } catch {
      setNbError('Errore upload file');
    } finally {
      setNbLoading(false);
      if (nbFileInput.current) nbFileInput.current.value = '';
    }
  };

  const handleNbDelete = async (id: string) => {
    setNbLoading(true);
    setNbError(null);
    try {
      await deleteNotebookFile(id);
      setNbFiles(files => files.filter(f => f.id !== id));
    } catch {
      setNbError('Errore eliminazione file');
    } finally {
      setNbLoading(false);
    }
  };

  const handleNbSync = async () => {
    setNbLoading(true);
    setNbError(null);
    try {
      const files = await fetchNotebookFiles();
      setNbFiles(files);
    } catch {
      setNbError('Errore sincronizzazione');
    } finally {
      setNbLoading(false);
    }
  };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Voice Recognition Logic ---
  const startVoiceInput = () => {
    setVoiceError(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceError('Il riconoscimento vocale non è supportato su questo browser.');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setTranscript('');
    setIsRecording(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = '';
      for (let i = 0; i < event.results.length; ++i) {
          final += event.results[i][0].transcript;
      }
      setTranscript(final);
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (transcript.trim()) {
        setInput(transcript.trim());
        setTranscript('');
        setTimeout(() => handleSend(), 100); // invia subito
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      setIsRecording(false);
      setTranscript('');
      let msg = 'Errore durante la dettatura.';
      if (event.error === 'not-allowed') msg = 'Permesso microfono negato.';
      if (event.error === 'no-speech') msg = 'Nessun audio rilevato.';
      if (event.error === 'audio-capture') msg = 'Microfono non trovato.';
      setVoiceError(msg);
    };
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Focus input when opened and restore focus on close; handle Escape to close
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      if (inputRef.current) inputRef.current.focus();
    } else {
      if (lastActiveRef.current) {
        lastActiveRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
    return;
  }, [open, onClose]);

  const handleSend = async () => {
    const text = (isRecording ? transcript : input).trim();
    if (!text) return;
    
    const userMsg: ChatMessage = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    setInput('');
    setTranscript('');
    
    try {
      const aiResponse = await chatWithAi(aiSettings, newMessages, context as Record<string, unknown> | undefined);
      setMessages((msgs) => [...msgs, aiResponse]);
    } catch {
      setMessages((msgs) => [...msgs, { role: 'model', text: 'Si è verificato un errore nella generazione della risposta.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  if (!open) return null;

  const tabRow = (
    <div
      role="tablist"
      aria-label="Modalità assistente"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--md-sys-spacing-2)',
        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
      }}
    >
      {TABS.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeMode === tab.key}
          onClick={() => setActiveMode(tab.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)',
            padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-6)',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--md-sys-typescale-label-large-font, inherit)',
            fontSize: 'var(--md-sys-typescale-label-large-size)',
            fontWeight: activeMode === tab.key ? 'var(--md-sys-typescale-weight-bold)' : 'var(--md-sys-typescale-weight-medium)',
            backgroundColor: activeMode === tab.key ? 'var(--md-sys-color-secondary-container)' : 'transparent',
            color: activeMode === tab.key ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
            transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-label-large-size)' }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  const headerContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--md-sys-spacing-4)',
      backgroundColor: 'var(--md-sys-color-surface)',
      borderBottom: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)`
    }}>
      <div style={{
        flexGrow: 1,
        minWidth: "0"
      }}>
        <h2 style={{
          color: 'var(--md-sys-color-on-surface)',
          fontWeight: 'var(--md-sys-typescale-weight-bold)',
          letterSpacing: "var(--md-sys-typescale-body-medium-tracking)"
        }}>
          Assistente DocenteDoc AI
        </h2>
      </div>
      <button
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--md-sys-spacing-4)',
          borderRadius: 'medium',
          width: "var(--md-sys-spacing-10)",
          height: "var(--md-sys-spacing-10)",
          transition: "color var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)"
        }}
        data-focus-priority="-1"
        aria-label="Chiudi assistente"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );

  return (
    <M3Dialog
      title="Assistente DocenteDoc AI"
      onClose={onClose}
      maxWidth="md"
      level={2}
      hideBackdrop={false}
      headerContent={<>{headerContent}{tabRow}</>}
      wrapperTestId="assistant-modal-overlay"
      // Removed wrapperClassName for MD3 compliance; all overlay styling must be handled via MD3 tokens and Dialog implementation
    >
      <M3DialogContent >
        {activeMode === 'chat' && (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-4)',
              overflowY: 'auto',
              
              maxHeight: 'var(--md-sys-viewport-height-50)'
              
            }}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--md-sys-color-primary)'
                }}>
                  Come posso aiutarti?
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--md-sys-spacing-4)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: msg.role === 'user' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                    color: msg.role === 'user' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                    marginLeft: msg.role === 'user' ? 'var(--md-sys-spacing-12)' : '0',
                    marginRight: msg.role === 'user' ? '0' : 'var(--md-sys-spacing-12)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div role="status" aria-live="polite" aria-atomic="true" style={{ color: 'onSurfaceVariant' }}>Sto pensando…</div>}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 'var(--md-sys-spacing-2)'
            }}>
              {SUGGESTED_PROMPTS.map((p) => (
                <M3Button
                  key={p}
                  variant="outlined"
                  onClick={() => handlePrompt(p)}
                  style={{
                    marginRight: 'var(--md-sys-spacing-2)',
                    marginBottom: 'var(--md-sys-spacing-2)'
                  }}
                >
                  {p}
                </M3Button>
              ))}
            </div>
          </>
        )}

        {activeMode === 'tools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', padding: 'var(--md-sys-spacing-4)' }}>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--md-sys-typescale-body-medium-font, inherit)' }}>
              Lancia uno strumento AI direttamente dalla chat.
            </p>
            {[
              {
                key: 'image',
                icon: 'image_search',
                label: 'Analisi Immagine',
                description: 'Carica e analizza immagini con AI',
                onAction: onOpenImageAnalysis,
              },
              {
                key: 'video',
                icon: 'video_search',
                label: 'Analisi Video',
                description: 'Analizza contenuti video con AI',
                onAction: onOpenVideoAnalysis,
              },
              {
                key: 'circular',
                icon: 'description',
                label: 'Analisi Circolare',
                description: 'Estrai dati da circolari scolastiche',
                onAction: onOpenCircularAnalysis,
              },
            ].map(tool => (
              <button
                key={tool.key}
                onClick={() => { tool.onAction?.(); onClose(); }}
                disabled={!tool.onAction}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 'var(--md-sys-spacing-6)',
                  padding: 'var(--md-sys-spacing-5)',
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                  backgroundColor: tool.onAction ? 'var(--md-sys-color-surface-container)' : 'var(--md-sys-color-surface-container-low)',
                  cursor: tool.onAction ? 'pointer' : 'default',
                  opacity: tool.onAction ? '1' : '0.5',
                  textAlign: 'left',
                  width: 'var(--md-sys-percent-full)',
                  transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-10)', color: 'var(--md-sys-color-primary)' }}>{tool.icon}</span>
                <div>
                  <p style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)' }}>{tool.label}</p>
                  <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--md-sys-typescale-body-small-font, inherit)' }}>{tool.description}</p>
                </div>
                <span className="material-symbols-outlined" style={{ marginLeft: 'var(--md-sys-margin-auto)', color: 'var(--md-sys-color-on-surface-variant)' }}>chevron_right</span>
              </button>
            ))}
          </div>
        )}

        {activeMode === 'docs' && (
          <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-2)'
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-secondary)' }}>import_contacts</span>
                <h3>NotebookLM</h3>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 'var(--md-sys-spacing-2)'
              }}>
                <M3Button
                  variant="text"
                  onClick={handleNbSync}
                  disabled={nbLoading}
                >
                  <span className="material-symbols-outlined">sync</span>
                </M3Button>
                <input
                  type="file"
                  ref={nbFileInput}
                  style={{ display: "none" }}
                  onChange={handleNbUpload}
                  accept=".txt,.md,.pdf,.docx"
                  aria-label="Carica file per knowledge base"
                />
                <M3Button
                  variant="text"
                  onClick={() => nbFileInput.current?.click()}
                  disabled={nbLoading}
                >
                  <span className="material-symbols-outlined">upload</span>
                </M3Button>
              </div>
            </div>
            {nbError && <div style={{
              padding: 'var(--md-sys-spacing-4)',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              color: 'var(--md-sys-color-error)',
              backgroundColor: 'var(--md-sys-color-error-container)'
            }}>{nbError}</div>}
            {nbLoading && <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Caricamento…</div>}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-4)',
              overflowY: 'auto',
              
              maxHeight: 'var(--md-sys-viewport-height-40)'
              
            }}>
              {nbFiles.map(file => (
                <div key={file.id} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--md-sys-spacing-4)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  border: `var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)`
                }}>
                  <div style={{
                    flexGrow: 1,
                    minWidth: "0"
                  }}>
                    <p style={{
                      fontWeight: 'var(--md-sys-typescale-weight-bold)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{file.name}</p>
                    <p style={{ color: 'onSurfaceVariant' }}>{new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                  <M3Button
                    variant="text"
                    color="error"
                    onClick={() => handleNbDelete(file.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </M3Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </M3DialogContent>

      {/* Input Footer */}
        <M3DialogActions style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--md-sys-spacing-6)',
          alignItems: 'flex-end',
          width: 'var(--md-sys-percent-full)',
          padding: 'var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          borderTop: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"
        }}>
        <div style={{ flexGrow: 1 }}>
          <TextField
            label={isRecording ? "In ascolto..." : "Scrivi una domanda…"}
            placeholder={isRecording ? "In ascolto..." : "Scrivi una domanda…"}
            value={isRecording ? transcript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            style={isRecording ? { animation: 'pulse var(--md-sys-motion-duration-extra-long) infinite' } : {}}
          />
        </div>
        <M3Button
          variant="text"
          style={{
            color: isRecording ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-secondary)',
            padding: 'var(--md-sys-spacing-4)',
            minWidth: '0'
          }}
          onClick={isRecording ? stopVoiceInput : startVoiceInput}
          title={isRecording ? 'Stop' : 'Voice input'}
        >
          <span className="material-symbols-outlined">
            {isRecording ? 'mic' : 'mic_none'}
          </span>
        </M3Button>
        <M3Button
          variant="filled"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--md-sys-spacing-4)'
          }}
        >
          <span className="material-symbols-outlined">send</span>
        </M3Button>
        {voiceError && <p style={{
          color: 'var(--md-sys-color-error)',
          width: 'var(--md-sys-percent-full)',
          textAlign: 'center'
        }}>{voiceError}</p>}
      </M3DialogActions>
    </M3Dialog>
  );
}

export default AssistantModal;

