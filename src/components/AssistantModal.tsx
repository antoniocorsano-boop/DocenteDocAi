import React, { useState, useRef, useEffect } from 'react';
import { fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, NotebookLMFile } from '../services/notebooklmService';

interface AssistantModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'chat' | 'docs' | 'tools' | 'backup';
}

const SUGGESTED_PROMPTS = [
  'Come posso usare questa funzione?',
  'Genera una traccia per una lezione',
  'Suggerisci una valutazione',
  'Spiegami questa schermata',
];

const AssistantModal: React.FC<AssistantModalProps> = ({ open, onClose, mode = 'chat' }) => {
  const [input, setInput] = useState('');
  // NotebookLM state
  const [nbFiles, setNbFiles] = useState<NotebookLMFile[]>([]);
  const [nbLoading, setNbLoading] = useState(false);
  const [nbError, setNbError] = useState<string | null>(null);
  const nbFileInput = useRef<HTMLInputElement>(null);

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setNbError('Errore sincronizzazione');
    } finally {
      setNbLoading(false);
    }
  };
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // --- Voice Recognition Logic ---
  const startVoiceInput = () => {
    setVoiceError(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceSupported(false);
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
    setMessages((msgs) => [...msgs, { role: 'user', text }]);
    setLoading(true);
    // clear inputs
    setInput('');
    setTranscript('');
    try {
      // Simulate AI response (replace with real API call)
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { role: 'ai', text: 'Risposta AI (demo): ' + text }]);
        setLoading(false);
      }, 900);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'ai', text: 'Si è verificato un errore nella generazione della risposta.' }]);
      setLoading(false);
    }
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="assistant-modal-overlay" role="dialog" aria-modal="true" aria-label="Assistente AI">
      <div className="assistant-modal mui-elevation-3">
        <header className="assistant-modal-header">
          <span className="material-symbols-outlined" style={{fontSize: '2rem', marginRight: 8}}>smart_toy</span>
          <h3 className="assistant-modal-title">Assistente DocenteDoc AI</h3>
          <button className="assistant-exit-btn" onClick={onClose} aria-label="Chiudi">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <div className="assistant-modal-body">
          {mode === 'chat' && (
            <>
              <div className="assistant-messages">
                {messages.length === 0 && (
                  <div className="assistant-empty">Come posso aiutarti?</div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`assistant-msg assistant-msg-${msg.role}`}>{msg.text}</div>
                ))}
                {loading && <div className="assistant-msg assistant-msg-ai loading">Sto pensando…</div>}
              </div>
              <div className="assistant-prompts">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button key={p} className="assistant-prompt-btn" onClick={() => handlePrompt(p)}>{p}</button>
                ))}
              </div>
            </>
          )}
          {mode === 'docs' && (
            <div className="assistant-docs">
              <div className="assistant-docs-header">
                <span className="material-symbols-outlined">import_contacts</span>
                <span style={{fontWeight:600, fontSize:'1.08rem'}}>NotebookLM</span>
                <button className="mui-fab-expressive assistant-docs-sync" onClick={handleNbSync} title="Sincronizza" disabled={nbLoading}>
                  <span className="material-symbols-outlined">sync</span>
                </button>
                <input type="file" ref={nbFileInput} style={{display:'none'}} onChange={handleNbUpload} accept=".txt,.md,.pdf,.docx" />
                <button className="mui-fab-expressive assistant-docs-upload" onClick={()=>nbFileInput.current?.click()} title="Carica file" disabled={nbLoading}>
                  <span className="material-symbols-outlined">upload</span>
                </button>
              </div>
              {nbError && <div className="assistant-docs-error">{nbError}</div>}
              {nbLoading && <div className="assistant-docs-loading">Caricamento…</div>}
              <div className="assistant-docs-list">
                {nbFiles.length === 0 && !nbLoading && <div className="assistant-empty">Nessun file NotebookLM caricato.</div>}
                {nbFiles.map(f => (
                  <div key={f.id} className="assistant-docs-file mui-elevation-1">
                    <span className="material-symbols-outlined">description</span>
                    <span className="assistant-docs-filename">{f.name}</span>
                    <span className="assistant-docs-date">{new Date(f.lastModified).toLocaleDateString()}</span>
                    <button className="assistant-docs-delete" onClick={()=>handleNbDelete(f.id)} title="Elimina">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mode === 'tools' && (
            <div className="assistant-tools">
              <div className="assistant-empty">Analisi classe/studente, Ricerca web AI, Tools rapidi…</div>
            </div>
          )}
          {mode === 'backup' && (
            <div className="assistant-backup">
              <div className="assistant-empty">Backup locale, Google Drive, Restore…</div>
            </div>
          )}
        </div>
        {mode === 'chat' && (
          <form className="assistant-modal-footer" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <input
              ref={inputRef}
              type="text"
              className={`assistant-input${isRecording ? ' listening' : ''}`}
              placeholder={isRecording ? "Sto ascoltando..." : "Scrivi una domanda o un comando..."}
              value={isRecording ? transcript : input}
              onChange={e => setInput(e.target.value)}
              disabled={loading || isRecording}
              aria-label="Scrivi una domanda o comando per l'assistente"
              style={isRecording ? { background: 'var(--sys-secondary-container, #f0f0f0)', color: '#b00020', fontWeight: 600 } : {}}
            />
            <button
              type="button"
              className={`assistant-mic-btn${isRecording ? ' recording' : ''}`}
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              aria-label={isRecording ? 'Ferma dettatura' : 'Detta domanda'}
              disabled={loading || !voiceSupported}
              title={voiceSupported ? (isRecording ? 'Ferma dettatura' : 'Detta domanda') : 'Riconoscimento vocale non supportato'}
            >
              <span className="material-symbols-outlined">{isRecording ? 'stop_circle' : 'mic'}</span>
            </button>
            <button type="submit" className="assistant-send-btn" disabled={loading || !input.trim() || isRecording}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        )}
        {isRecording && (
          <div className="assistant-voice-feedback">
            <span className="material-symbols-outlined pulse">graphic_eq</span>
            <span>Dettatura in corso… Parla ora.</span>
          </div>
        )}
        {voiceError && (
          <div className="assistant-voice-error">
            <span className="material-symbols-outlined">error</span> {voiceError}
          </div>
        )}
      </div>
      <style>{`
        .assistant-docs-header {
          display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.7rem;
        }
        .assistant-docs-upload, .assistant-docs-sync {
          background: var(--sys-primary, #1976d2); color: var(--sys-on-primary, #fff); border: none; border-radius: 50%; width: 2.2rem; height: 2.2rem; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-left: 0.2rem; cursor: pointer; transition: background 0.18s;
        }
        .assistant-docs-upload:hover, .assistant-docs-sync:hover {
          background: var(--sys-primary-container, #1565c0);
        }
        .assistant-docs-list {
          display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;
        }
        .assistant-docs-file {
          display: flex; align-items: center; gap: 0.7rem; background: var(--sys-surface, #fff); border-radius: 1.1rem; padding: 0.5rem 1rem; font-size: 1.01rem; color: var(--sys-on-surface, #222); position: relative;
        }
        .assistant-docs-filename { flex: 1; font-weight: 500; }
        .assistant-docs-date { font-size: 0.97rem; color: #888; margin-right: 0.7rem; }
        .assistant-docs-delete {
          background: none; border: none; color: var(--sys-error, #b00020); font-size: 1.3rem; cursor: pointer; border-radius: 50%; padding: 0.2rem; transition: background 0.18s;
        }
        .assistant-docs-delete:hover { background: #ffeaea; }
        .assistant-docs-error { color: var(--sys-error, #b00020); margin-bottom: 0.5rem; }
        .assistant-docs-loading { color: var(--sys-primary, #1976d2); margin-bottom: 0.5rem; }
        .mui-elevation-3 { box-shadow: 0 8px 32px rgba(0,0,0,0.18); }
        .assistant-modal-title { font-size: 1.18rem; font-weight: 600; flex: 1; margin: 0; }
        .assistant-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.18); z-index: 1000; display: flex; align-items: center; justify-content: center;
        }
        .assistant-modal {
          background: var(--sys-surface, #fff); color: var(--sys-on-surface, #222); border-radius: 1.2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          width: 95vw; max-width: 420px; min-height: 340px; display: flex; flex-direction: column; overflow: hidden;
        }
        .assistant-modal-header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.2rem 0.5rem 1.2rem; border-bottom: 1px solid var(--sys-outline-variant, #eee); position: relative; }
        .assistant-modal-header h3 { flex: 1; font-size: 1.1rem; font-weight: 600; margin: 0; }
        .assistant-exit-btn { font-size: 1.7rem; background: none; border: none; cursor: pointer; color: var(--sys-on-surface, #222); position: absolute; right: 1rem; top: 0.7rem; padding: 0.2rem; border-radius: 50%; transition: background 0.2s; }
        .assistant-exit-btn:hover { background: var(--sys-surface-variant, #f5f5f5); }
        .assistant-modal-body { flex: 1; display: flex; flex-direction: column; padding: 1rem 1.2rem 0.5rem 1.2rem; gap: 0.5rem; }
        .assistant-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; }
        .assistant-msg { padding: 0.5rem 0.8rem; border-radius: 1rem; max-width: 90%; font-size: 1rem; }
        .assistant-msg-user { align-self: flex-end; background: var(--sys-primary, #e3f2fd); color: var(--sys-on-primary, #222); }
        .assistant-msg-ai { align-self: flex-start; background: var(--sys-surface-variant, #f5f5f5); color: var(--sys-on-surface-variant, #444); }
        .assistant-msg-ai.loading { opacity: 0.7; font-style: italic; }
        .assistant-empty { color: #888; text-align: center; margin: 2rem 0; }
        .assistant-prompts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
        .assistant-prompt-btn { background: var(--sys-secondary-container, #f0f0f0); color: var(--sys-on-secondary-container, #333); border: none; border-radius: 1rem; padding: 0.3rem 0.9rem; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; }
        .assistant-prompt-btn:hover { background: var(--sys-secondary, #e3f2fd); }
        .assistant-modal-footer { display: flex; gap: 0.5rem; padding: 0.7rem 1.2rem 1rem 1.2rem; border-top: 1px solid var(--sys-outline-variant, #eee); }
        .assistant-input { flex: 1; border: 1px solid var(--sys-outline-variant, #ccc); border-radius: 1rem; padding: 0.5rem 1rem; font-size: 1rem; }
        .assistant-send-btn { background: var(--sys-primary, #1976d2); color: var(--sys-on-primary, #fff); border: none; border-radius: 50%; width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; transition: background 0.2s; }
        .assistant-send-btn:disabled { background: #ccc; cursor: not-allowed; }
        .assistant-input.listening {
          border: 2px solid var(--sys-error, #b00020);
          background: var(--sys-secondary-container, #f0f0f0);
          color: #b00020;
          font-weight: 600;
        }
        .assistant-mic-btn {
          background: var(--sys-secondary, #e3f2fd);
          color: var(--sys-on-secondary, #222);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 0.2rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .assistant-mic-btn.recording {
          background: var(--sys-error-container, #ffebee);
          color: var(--sys-error, #b00020);
          animation: pulse-mic 1.2s infinite;
        }
        @keyframes pulse-mic {
          0% { box-shadow: 0 0 0 0 rgba(220,0,0,0.18); }
          70% { box-shadow: 0 0 0 8px rgba(220,0,0,0.10); }
          100% { box-shadow: 0 0 0 0 rgba(220,0,0,0.18); }
        }
        .assistant-voice-feedback {
          display: flex; align-items: center; gap: 0.5rem; color: var(--sys-error, #b00020); font-weight: 600; margin: 0.5rem 0 0.2rem 0.2rem; font-size: 1.05rem;
        }
        .assistant-voice-feedback .pulse { animation: pulse-mic 1.2s infinite; }
        .assistant-voice-error {
          display: flex; align-items: center; gap: 0.4rem; color: var(--sys-error, #b00020); background: #fff0f0; border-radius: 0.7rem; padding: 0.3rem 0.8rem; margin: 0.3rem 0 0.2rem 0.2rem; font-size: 0.98rem;
        }
        @media (max-width: 600px) {
          .assistant-modal-overlay { align-items: stretch; justify-content: stretch; }
          .assistant-modal { width: 100vw; min-height: 100vh; max-width: 100vw; border-radius: 0; box-shadow: none; }
          .assistant-modal-header, .assistant-modal-body, .assistant-modal-footer { padding-left: 1rem; padding-right: 1rem; }
          .assistant-exit-btn { right: 0.7rem; top: 0.7rem; }
        }
      `}</style>
    </div>
  );
}

export default AssistantModal;
