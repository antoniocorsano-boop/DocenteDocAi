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
      <M3DialogContent style={{
  paddingTop: 'var(--md-sys-spacing-4)',
  paddingBottom: 'var(--md-sys-spacing-4)'
}}>
        {!isAuthenticated ? (
          <div className="py-12" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div className="bg-primary/10" style={{ width: "5rem", height: "5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--md-sys-spacing-6)" }}>
              <span className="material-symbols-outlined text-4xl" style={{ color: "var(--md-sys-color-primary)" }}>cloud_off</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-8)" }}>Connessione Google Richiesta</h3>
            <p className="text-[var(--md-sys-color-on-surface)]-variant max-w-xs" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>
              Per importare i tuoi materiali da NotebookLM, devi prima connettere il tuo account Google.
            </p>
            <M3Button variant="filled" onClick={onConnect} className="px-8">
              Connetti Account Google
            </M3Button>
          </div>
        ) : (
          <>
            {loading && <div className="py-8" style={{ textAlign: "center" }}>Caricamento file da NotebookLM...</div>}
            {error && <div style={{ color: "var(--md-sys-color-error)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>{error}</div>}

            {step === 'select' && !loading && !error && (
              <>
                <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>Seleziona i materiali da importare nella Knowledge Base.</p>
                <div className="max-h-64" style={{ overflowY: "auto", border: "1px solid var(--md-sys-color-outline)", borderRadius: "0.375rem", marginBottom: "var(--md-sys-spacing-8)" }}>
                  {files.length === 0 && <div className="text-[var(--md-sys-color-on-surface)]-variant" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>Nessun file trovato.</div>}
                  {files.map(f => (
                    <label key={f.id} className="last:border-b-0 hover:bg-[var(--md-sys-color-surface-container-low)]" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", borderBottom: "1px solid var(--md-sys-color-outline)", cursor: "pointer" }}>
                      <input type="checkbox" checked={selected.has(f.id)} onChange={() => handleSelect(f.id)} />
                      <span style={{ flex: "1", fontWeight: "500" }}>{f.name}</span>
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
            <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>Catalogazione materiali importati:</p>
            <div className="max-h-64" style={{ gap: "var(--md-sys-spacing-4)", overflowY: "auto" }}>
              {imported.map(entry => (
                <div key={entry.id} className="bg-[var(--md-sys-color-surface-container-low)]" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", borderRadius: "0.375rem" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>{entry.fileName}</div>
                  <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-4)" }}>
                    <input className="input" placeholder="Materia (opzionale)" value={catalogData[entry.id]?.materia || ''} onChange={e => handleCatalogChange(entry.id, 'materia', e.target.value)} />
                    <input className="input" placeholder="Classe (opzionale)" value={catalogData[entry.id]?.classe || ''} onChange={e => handleCatalogChange(entry.id, 'classe', e.target.value)} />
                    <input className="input" placeholder="Categoria/Tag (opzionale)" value={catalogData[entry.id]?.category || ''} onChange={e => handleCatalogChange(entry.id, 'category', e.target.value)} />
                  </div>
                  <textarea className="input" style={{ width: "100%" }} placeholder="Descrizione/Note" value={catalogData[entry.id]?.content !== undefined ? catalogData[entry.id]?.content : entry.content} onChange={e => handleCatalogChange(entry.id, 'content', e.target.value)} />
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="py-8" style={{ textAlign: "center" }}>
            <span className="material-symbols-outlined m3-display-small" style={{ color: "var(--md-sys-color-success)", marginBottom: "var(--md-sys-spacing-8)" }}>check_circle</span>
            <div style={{ fontWeight: "bold", marginBottom: "var(--md-sys-spacing-8)" }}>Importazione completata!</div>
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



