import React, { useEffect, useState } from 'react';
import { fetchNotebookFiles, NotebookLMFile } from '../services/notebooklmService';
import { KnowledgeBaseEntry } from '../types';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button 
} from './ui';

interface NotebookLMImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (imported: KnowledgeBaseEntry[]) => void;
  isAuthenticated?: boolean;
  onConnect?: () => void;
}

const NotebookLMImportModal: React.FC<NotebookLMImportModalProps> = ({ 
  open, 
  onClose, 
  onImport,
  isAuthenticated = false,
  onConnect
}) => {
  const [files, setFiles] = useState<NotebookLMFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'catalog' | 'done'>('select');
  const [imported, setImported] = useState<KnowledgeBaseEntry[]>([]);

  // Catalogazione
  const [catalogData, setCatalogData] = useState<Record<string, { materia?: string; classe?: string; tags?: string; content?: string; category?: string }>>({});

  useEffect(() => {
    if (open && isAuthenticated) {
      setLoading(true);
      fetchNotebookFiles()
        .then(f => setFiles(f))
        .catch(() => setError('Errore nel recupero dei file da NotebookLM'))
        .finally(() => setLoading(false));
    }
  }, [open, isAuthenticated]);

  const handleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImport = async () => {
    setLoading(true);
    // Simula download e conversione in KnowledgeBaseEntry
    const toImport: KnowledgeBaseEntry[] = files.filter(f => selected.has(f.id)).map(f => ({
      id: f.id,
      fileName: f.name,
      content: f.content || '',
      // Optionally fill other fields as needed
    }));
    setImported(toImport);
    setStep('catalog');
    setLoading(false);
  };

  const handleCatalogChange = (id: string, field: 'materia' | 'classe' | 'tags' | 'content' | 'category', value: string) => {
    setCatalogData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleCatalogConfirm = () => {
    const final = imported.map(entry => {
      const cat = catalogData[entry.id] || {};
      return {
        ...entry,
        content: cat.content !== undefined ? cat.content : entry.content,
        category: cat.category,
        // materia, classe, category are not in KnowledgeBaseEntry by default, but can be mapped to category or ignored
        // tags: not present in KnowledgeBaseEntry, can be mapped to category or ignored
      };
    });
    onImport(final);
    setStep('done');
  };

  if (!open) return null;

  return (
    <M3Dialog
      title="Importa da NotebookLM"
      onClose={onClose}
      maxWidth="xl"
    >
      <M3DialogContent className="py-4">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">cloud_off</span>
            </div>
            <h3 className="text-xl font-bold mb-8">Connessione Google Richiesta</h3>
            <p className="text-[var(--md-sys-color-on-surface)]-variant mb-8 max-w-xs">
              Per importare i tuoi materiali da NotebookLM, devi prima connettere il tuo account Google.
            </p>
            <M3Button variant="filled" onClick={onConnect} className="px-8">
              Connetti Account Google
            </M3Button>
          </div>
        ) : (
          <>
            {loading && <div className="text-center py-8">Caricamento file da NotebookLM...</div>}
            {error && <div className="text-error py-4">{error}</div>}

            {step === 'select' && !loading && !error && (
              <>
                <p className="mb-8 text-[var(--md-sys-color-on-surface)]-variant">Seleziona i materiali da importare nella Knowledge Base.</p>
                <div className="max-h-64 overflow-y-auto border rounded mb-8">
                  {files.length === 0 && <div className="p-8 text-center text-[var(--md-sys-color-on-surface)]-variant">Nessun file trovato.</div>}
                  {files.map(f => (
                    <label key={f.id} className="flex items-center gap-6 px-4 py-4 border-b last:border-b-0 cursor-pointer hover:bg-[var(--md-sys-color-surface-container-low)]">
                      <input type="checkbox" checked={selected.has(f.id)} onChange={() => handleSelect(f.id)} />
                      <span className="flex-1 font-medium">{f.name}</span>
                      <span className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant">{f.lastModified ? new Date(f.lastModified).toLocaleString() : ''}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 'catalog' && (
          <>
            <p className="mb-8 text-[var(--md-sys-color-on-surface)]-variant">Catalogazione materiali importati:</p>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {imported.map(entry => (
                <div key={entry.id} className="p-6 border rounded bg-[var(--md-sys-color-surface-container-low)]">
                  <div className="font-bold mb-4">{entry.fileName}</div>
                  <div className="flex gap-8 mb-4">
                    <input className="input" placeholder="Materia (opzionale)" value={catalogData[entry.id]?.materia || ''} onChange={e => handleCatalogChange(entry.id, 'materia', e.target.value)} />
                    <input className="input" placeholder="Classe (opzionale)" value={catalogData[entry.id]?.classe || ''} onChange={e => handleCatalogChange(entry.id, 'classe', e.target.value)} />
                    <input className="input" placeholder="Categoria/Tag (opzionale)" value={catalogData[entry.id]?.category || ''} onChange={e => handleCatalogChange(entry.id, 'category', e.target.value)} />
                  </div>
                  <textarea className="input w-full" placeholder="Descrizione/Note" value={catalogData[entry.id]?.content !== undefined ? catalogData[entry.id]?.content : entry.content} onChange={e => handleCatalogChange(entry.id, 'content', e.target.value)} />
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined m3-display-small text-success mb-8">check_circle</span>
            <div className="font-bold mb-8">Importazione completata!</div>
          </div>
        )}
      </M3DialogContent>

      {step !== 'done' && (
        <M3DialogActions style={{ gap: 'var(--md-sys-spacing-6)' }}>
          {step === 'select' && (
            <>
              <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
              <M3Button variant="filled" disabled={selected.size === 0} onClick={handleImport}>Importa selezionati</M3Button>
            </>
          )}
          {step === 'catalog' && (
            <>
              <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
              <M3Button variant="filled" onClick={handleCatalogConfirm}>Conferma e importa</M3Button>
            </>
          )}
        </M3DialogActions>
      )}

      {step === 'done' && (
        <M3DialogActions>
          <M3Button variant="filled" fullWidth onClick={onClose}>Chiudi</M3Button>
        </M3DialogActions>
      )}
    </M3Dialog>
  );
};

export default NotebookLMImportModal;

