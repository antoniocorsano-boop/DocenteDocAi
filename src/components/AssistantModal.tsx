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
    <div className="px-4 md:px-6 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0 bg-gradient-to-r from-transparent via-surface-container-highest/10 to-transparent">
      <div className="flex-grow min-w-0">
        <h2 className="m3-headline-small font-black text-on-surface tracking-tight">Assistente DocenteDoc AI</h2>
      </div>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors ml-4 assistant-exit-btn"
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
      headerContent={headerContent}
      wrapperClassName="assistant-modal-overlay"
      wrapperTestId="assistant-modal-overlay"
    >
      <M3DialogContent className="space-y-12 px-12 pt-12 pb-0">
        {mode === 'chat' && (
          <>
            <div className="assistant-messages space-y-4 h-64 overflow-y-auto custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-primary m3-body-medium py-8">Come posso aiutarti?</div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`m3-body-small p-8 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary ml-12'
                      : 'bg-surface-container-highest text-on-surface mr-12'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div className="m3-body-small text-on-surface-variant italic animate-pulse">Sto pensando…</div>}
            </div>
            <div className="assistant-prompts flex flex-wrap gap-12">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  className="m3-button-tonal !px-4 !py-2 !h-auto !m3-label-small !rounded-full"
                  onClick={() => handlePrompt(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'docs' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <span className="material-symbols-outlined text-secondary">import_contacts</span>
                <h3 className="m3-title-medium">NotebookLM</h3>
              </div>
              <div className="flex gap-12">
                <M3Button
                  variant="text"
                  onClick={handleNbSync}
                  disabled={nbLoading}
                  className="!p-12"
                >
                  <span className="material-symbols-outlined">sync</span>
                </M3Button>
                <input
                  type="file"
                  ref={nbFileInput}
                  className="hidden"
                  onChange={handleNbUpload}
                  accept=".txt,.md,.pdf,.docx"
                  aria-label="Carica file per knowledge base"
                />
                <M3Button
                  variant="text"
                  onClick={() => nbFileInput.current?.click()}
                  disabled={nbLoading}
                  className="!p-12"
                >
                  <span className="material-symbols-outlined">upload</span>
                </M3Button>
              </div>
            </div>
            {nbError && <div className="m3-body-small text-error p-12 bg-error-container rounded-xl">{nbError}</div>}
            {nbLoading && <div className="m3-body-small text-on-surface-variant animate-pulse">Caricamento…</div>}
            <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
              {nbFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-surface-container p-8 rounded-2xl border border-outline-variant/30">
                  <div className="flex-1 min-w-0">
                    <p className="m3-body-small font-medium truncate">{file.name}</p>
                    <p className="m3-body-small text-on-surface-variant m3-label-small">{new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                  <M3Button
                    variant="text"
                    className="text-error !p-12"
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
      <M3DialogActions className="!flex-col gap-8 px-12 pb-12 pt-0 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex gap-12 items-end w-full">
          <div className="flex-1">
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
            <span className="material-symbols-outlined">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </M3Button>
          <M3Button
            variant="filled"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="!h-16 !w-16 !p-0 !min-w-0 flex items-center justify-center !rounded-2xl"
          >
            <span className="material-symbols-outlined">send</span>
          </M3Button>
        </div>
        {voiceError && <p className="m3-body-small text-error w-full text-center">{voiceError}</p>}
      </M3DialogActions>
    </M3Dialog>
  );
}

export default AssistantModal;
