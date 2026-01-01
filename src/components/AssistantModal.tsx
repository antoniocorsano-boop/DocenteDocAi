import React, { useState, useRef, useEffect } from 'react';
import { fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, NotebookLMFile } from '../services/notebooklmService';
import { generateContent } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

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
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
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
    setMessages((msgs) => [...msgs, { role: 'user', text }]);
    setLoading(true);
    setInput('');
    setTranscript('');
    try {
      const aiResponse = await generateContent(text, { temperature: 0.7, maxTokens: 1000 });
      setMessages((msgs) => [...msgs, { role: 'ai', text: aiResponse.content || 'Nessuna risposta.' }]);
    } catch {
      setMessages((msgs) => [...msgs, { role: 'ai', text: 'Si è verificato un errore nella generazione della risposta.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <M3Dialog
      title="Assistente DocenteDoc AI"
      onClose={onClose}
      maxWidth="md"
    >
      <M3DialogContent className="space-y-4">
        {mode === 'chat' && (
          <>
            <div className="assistant-messages space-y-2 h-64 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-primary m3-body-medium py-6">Come posso aiutarti?</div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`m3-body-small p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary ml-8'
                      : 'bg-surface-variant text-on-surface-variant mr-8'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div className="m3-body-small text-on-surface-variant italic">Sto pensando…</div>}
            </div>
            <div className="assistant-prompts flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  className="chip bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full hover:bg-secondary transition-colors"
                  onClick={() => handlePrompt(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'docs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">import_contacts</span>
                <h3 className="m3-title-medium">NotebookLM</h3>
              </div>
              <div className="flex gap-2">
                <button
                  className="icon-button"
                  onClick={handleNbSync}
                  title="Sincronizza"
                  disabled={nbLoading}
                >
                  <span className="material-symbols-outlined">sync</span>
                </button>
                <input
                  type="file"
                  ref={nbFileInput}
                  className="hidden-input"
                  onChange={handleNbUpload}
                  accept=".txt,.md,.pdf,.docx"
                />
                <button
                  className="icon-button"
                  onClick={() => nbFileInput.current?.click()}
                  title="Carica file"
                  disabled={nbLoading}
                >
                  <span className="material-symbols-outlined">upload</span>
                </button>
              </div>
            </div>
            {nbError && <div className="m3-body-small text-error p-2 bg-error-container rounded">{nbError}</div>}
            {nbLoading && <div className="m3-body-small text-on-surface-variant">Caricamento…</div>}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {nbFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-surface-container p-2 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="m3-body-small font-medium truncate">{file.name}</p>
                    <p className="m3-body-small text-on-surface-variant text-xs">{new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="icon-button text-error"
                    onClick={() => handleNbDelete(file.id)}
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </M3DialogContent>

      {/* Input Footer */}
      <M3DialogActions className="!flex-col gap-3">
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef}
            type="text"
            value={isRecording ? transcript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Scrivi una domanda…"
            className={`flex-1 rounded-full px-4 py-2 border m3-body-medium ${
              isRecording ? 'border-error bg-error-container' : 'border-outline-variant bg-surface-container'
            }`}
            disabled={loading}
          />
          <button
            className={`icon-button ${isRecording ? 'text-error' : 'text-secondary'}`}
            onClick={isRecording ? stopVoiceInput : startVoiceInput}
            title={isRecording ? 'Stop' : 'Voice input'}
          >
            <span className="material-symbols-outlined">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </button>
          <button
            className="button button-filled !px-6"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        {voiceError && <p className="m3-body-small text-error">{voiceError}</p>}
      </M3DialogActions>
    </M3Dialog>
  );
}

export default AssistantModal;
