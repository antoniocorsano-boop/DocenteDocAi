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
}

const SUGGESTED_PROMPTS = [
  'Come posso usare questa funzione?',
  'Genera una traccia per una lezione',
  'Suggerisci una valutazione',
  'Spiegami questa schermata',
];

const AssistantModal: React.FC<AssistantModalProps> = ({ open, onClose, mode = 'chat', aiSettings, context }) => {
  const [input, setInput] = useState('');
  // NotebookLM state
  const [nbFiles, setNbFiles] = useState<NotebookLMFile[]>([]);
  const [nbLoading, setNbLoading] = useState(false);
  const [nbError, setNbError] = useState<string | null>(null);
  const nbFileInput = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (open) {
      // Log persistente anche a livello di render/modal
      if (typeof window !== 'undefined') {
        const logs = JSON.parse(localStorage.getItem('assistant_open_debug') || '[]');
        logs.push({
          ts: new Date().toISOString(),
          stack: new Error().stack,
          location: window.location.href,
          source: 'AssistantModal render',
          mode
        });
        localStorage.setItem('assistant_open_debug', JSON.stringify(logs.slice(-30)));
        console.warn('[DEBUG] [AssistantModal] Modal aperta (render)', logs.at(-1));
      }
      console.warn('[DEBUG] AssistantModal opened', { mode, width: window.innerWidth, height: window.innerHeight, stack: new Error().stack });
    }
  }, [open, mode]);

  // Carica elenco file NotebookLM all'apertura modale docs
  useEffect(() => {
    if (mode === 'docs' && open) {
      setNbLoading(true);
      fetchNotebookFiles().then(setNbFiles).catch(() => setNbError('Errore caricamento files')).finally(() => setNbLoading(false));
    }
  }, [mode, open]);

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
      const aiResponse = await chatWithAi(aiSettings, newMessages, context);
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

  const headerContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--app-spacing-container)',
      backgroundColor: 'var(--app-color-surface)',
      borderBottom: `var(--app-border-normal) solid var(--md-sys-color-outline)`
    }}>
      <div style={{
        flexGrow: 1,
        minWidth: "0"
      }}>
        <h2 style={{
          color: 'var(--app-color-on-surface)',
          fontWeight: 'bold',
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
          gap: 'var(--app-spacing-container)',
          borderRadius: 'medium',
          width: "var(--md-sys-spacing-10)",
          height: "var(--md-sys-spacing-10)",
          transition: "color var(--app-motion-standard) var(--app-easing-standard)"
        }}
        data-focus-priority="-1"
        aria-label="Chiudi assistente"
      >
        <span style={{ fontFamily: 'Material Symbols Outlined' }}>close</span>
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
      headerContent={headerContent}
      wrapperTestId="assistant-modal-overlay"
      // Removed wrapperClassName for MD3 compliance; all overlay styling must be handled via MD3 tokens and Dialog implementation
    >
      <M3DialogContent >
        {mode === 'chat' && (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--app-spacing-container)',
              overflowY: 'auto',
              
              maxHeight: 'var(--md-sys-viewport-height-50)'
              
            }}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--app-color-primary)'
                }}>
                  Come posso aiutarti?
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--app-spacing-container)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: msg.role === 'user' ? 'var(--app-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                    color: msg.role === 'user' ? 'var(--app-color-on-primary)' : 'var(--app-color-on-surface)',
                    marginLeft: msg.role === 'user' ? 'var(--md-sys-spacing-12)' : '0',
                    marginRight: msg.role === 'user' ? '0' : 'var(--md-sys-spacing-12)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div style={{ color: 'onSurfaceVariant' }}>Sto pensando…</div>}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 'var(--app-spacing-component)'
            }}>
              {SUGGESTED_PROMPTS.map((p) => (
                <M3Button
                  key={p}
                  variant="outlined"
                  onClick={() => handlePrompt(p)}
                  style={{
                    marginRight: 'var(--app-spacing-component)',
                    marginBottom: 'var(--app-spacing-component)'
                  }}
                >
                  {p}
                </M3Button>
              ))}
            </div>
          </>
        )}

        {mode === 'docs' && (
          <div style={{ marginTop: 'var(--app-spacing-container)' }}>
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
                gap: 'var(--app-spacing-component)'
              }}>
                <span style={{ fontFamily: 'Material Symbols Outlined', color: 'var(--app-color-secondary)' }}>import_contacts</span>
                <h3>NotebookLM</h3>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 'var(--app-spacing-component)'
              }}>
                <M3Button
                  variant="text"
                  onClick={handleNbSync}
                  disabled={nbLoading}
                >
                  <span style={{ fontFamily: 'Material Symbols Outlined' }}>sync</span>
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
                  <span style={{ fontFamily: 'Material Symbols Outlined' }}>upload</span>
                </M3Button>
              </div>
            </div>
            {nbError && <div style={{
              padding: 'var(--app-spacing-container)',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              color: 'var(--md-sys-color-error)',
              backgroundColor: 'var(--md-sys-color-error-container)'
            }}>{nbError}</div>}
            {nbLoading && <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Caricamento…</div>}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--app-spacing-container)',
              overflowY: 'auto',
              
              maxHeight: 'var(--md-sys-viewport-height-40)'
              
            }}>
              {nbFiles.map(file => (
                <div key={file.id} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--app-spacing-container)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  border: `var(--app-border-thin) solid var(--md-sys-color-outline)`
                }}>
                  <div style={{
                    flexGrow: 1,
                    minWidth: "0"
                  }}>
                    <p style={{
                      fontWeight: 'bold',
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
                    <span style={{ fontFamily: 'Material Symbols Outlined' }}>delete</span>
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
          gap: 'var(--app-spacing-section)',
          alignItems: 'flex-end',
          width: 'var(--md-sys-percent-full)',
          padding: 'var(--app-spacing-container)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          borderTop: "var(--app-border-thin) solid var(--md-sys-color-outline)"
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
            color: isRecording ? 'var(--md-sys-color-error)' : 'var(--app-color-secondary)',
            padding: 'var(--app-spacing-container)',
            minWidth: '0'
          }}
          onClick={isRecording ? stopVoiceInput : startVoiceInput}
          title={isRecording ? 'Stop' : 'Voice input'}
        >
          <span style={{ fontFamily: 'Material Symbols Outlined' }}>
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
            gap: 'var(--app-spacing-container)'
          }}
        >
          <span style={{ fontFamily: 'Material Symbols Outlined' }}>send</span>
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








