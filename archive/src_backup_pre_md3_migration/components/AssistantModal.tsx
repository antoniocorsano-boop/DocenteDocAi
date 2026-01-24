// LEGACY - MD3 Non-compliant
import React, { useState, useRef, useEffect } from 'react';
import { fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, NotebookLMFile } from '../services/notebooklmService';
import { chatWithAi } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
import { AiSettings, ChatMessage } from '../types';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
        console.warn('[DEBUG][AssistantModal] Modal aperta (render)', logs.at(-1));
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
      backgroundColor: layers.sys.color.surface,
      paddingLeft: layers.ref.spacing['4'], 
      paddingRight: layers.ref.spacing['4'], 
      paddingTop: layers.ref.spacing['4'], 
      paddingBottom: layers.ref.spacing['4'], 
      borderBottom: `1px solid ${layers.sys.color.outline}`, 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center"
    }}>
      <div style={{ flexGrow: "1", minWidth: "0" }}>
        <h2 style={{ 
          color: layers.sys.color.onSurface,
          fontWeight: "900", 
          letterSpacing: "-0.005em" 
        }}>
          Assistente DocenteDoc AI
        </h2>
      </div>
      <button
        onClick={onClose}
         style={{ 
           width: "2.5rem", 
           height: "2.5rem", 
           borderRadius: layers.ref.shape.corner.full, 
           display: "flex", 
           alignItems: "center", 
           justifyContent: "center", 
           transition: "color 300ms" 
         }}
        data-focus-priority="-1"
        aria-label="Chiudi assistente"
      >
        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
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
      wrapperClassName="assistant-modal-overlay"
      wrapperTestId="assistant-modal-overlay"
    >
      <M3DialogContent >
        {mode === 'chat' && (
          <>
            <div  style={{gap: layers.ref.spacing['4'], overflowY: "auto"}}>
              {messages.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  color: layers.sys.color.primary 
                }}>
                  Come posso aiutarti?
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`m3-body-small p-8 rounded-[var(--md-sys-shape-corner-large)] ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary ml-12'
                      : 'bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)] mr-12'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Sto pensando…</div>}
            </div>
            <div  style={{ display: "flex", flexWrap: "wrap" }}>
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  
                  onClick={() => handlePrompt(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'docs' && (
          <div style={{marginTop: layers.ref.spacing['8']}}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div  style={{ display: "flex", alignItems: "center" }}>
                <span  style={{color: "layers.sys.colors.secondary"}}>import_contacts</span>
                <h3 >NotebookLM</h3>
              </div>
              <div  style={{ display: "flex" }}>
                <M3Button
                  variant="text"
                  onClick={handleNbSync}
                  disabled={nbLoading}
                  
                >
                  <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>sync</span>
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
                  <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>upload</span>
                </M3Button>
              </div>
            </div>
            {nbError && <div style={{ padding: ref.spacing[12], borderRadius: ref.shape[] }} style={{color: "layers.sys.colors.error", backgroundColor: "layers.sys.colors.error-container"}}>{nbError}</div>}
            {nbLoading && <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Caricamento…</div>}
            <div  style={{gap: layers.ref.spacing['4'], overflowY: "auto"}}>
              {nbFiles.map(file => (
                <div key={file.id} style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container)], borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <p  style={{ fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>{new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                  <M3Button
                    variant="text"
                     style={{color: "layers.sys.colors.error"}}
                    onClick={() => handleNbDelete(file.id)}
                  >
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>delete</span>
                  </M3Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </M3DialogContent>

      {/* Input Footer */}
      <M3DialogActions style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]est }} style={{gap: layers.ref.spacing['8'], paddingTop: "0", borderTop: "1px solid layers.sys.colors.outline"}}>
        <div  style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
          <div style={{ flex: "1" }}>
            <TextField
              label={isRecording ? "In ascolto..." : "Scrivi una domanda…"}
              placeholder={isRecording ? "In ascolto..." : "Scrivi una domanda…"}
              value={isRecording ? transcript : input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              className={isRecording ? 'animate-pulse' : ''}
            />
          </div>
          <M3Button
            variant="text"
            className={`${isRecording ? 'text-error' : 'text-secondary'} !p-6 !min-w-0`}
            onClick={isRecording ? stopVoiceInput : startVoiceInput}
            title={isRecording ? 'Stop' : 'Voice input'}
          >
            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </M3Button>
          <M3Button
            variant="filled"
            onClick={handleSend}
            disabled={loading || !input.trim()}
             style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>send</span>
          </M3Button>
        </div>
        {voiceError && <p  style={{color: "layers.sys.colors.error", width: "100%", textAlign: "center"}}>{voiceError}</p>}
      </M3DialogActions>
    </M3Dialog>
  );
}

export default AssistantModal;



