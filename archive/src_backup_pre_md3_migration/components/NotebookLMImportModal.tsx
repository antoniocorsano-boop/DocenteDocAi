// LEGACY - MD3 Non-compliant
import React, { useEffect, useState } from 'react';
import { fetchNotebookFiles, NotebookLMFile } from '../services/notebooklmService';
import { KnowledgeBaseEntry } from '../types';
import { useTheme } from '../theme/theme';
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
  const { layers } = useTheme();
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
      <M3DialogContent style={{paddingTop: layers.ref.spacing['4'],
  paddingBottom: layers.ref.spacing['4']}}>
        {!isAuthenticated ? (
          <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ backgroundColor: sys.colors.primary/10 }} style={{width: ref.spacing[80], height: ref.spacing[80], borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: layers.ref.spacing['6']}}>
              <span style={{ color: sys.colors.4xl }} style={{color: "layers.sys.colors.primary"}}>cloud_off</span>
            </div>
            <h3 style={{fontSize: "1.25rem", fontWeight: "bold", marginBottom: layers.ref.spacing['8']}}>Connessione Google Richiesta</h3>
            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['8']}}>
              Per importare i tuoi materiali da NotebookLM, devi prima connettere il tuo account Google.
            </p>
            <M3Button variant="filled" onClick={onConnect} >
              Connetti Account Google
            </M3Button>
          </div>
        ) : (
          <>
            {loading && <div  style={{ textAlign: "center" }}>Caricamento file da NotebookLM...</div>}
            {error && <div style={{color: "layers.sys.colors.error", paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>{error}</div>}

            {step === 'select' && !loading && !error && (
              <>
                <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['8']}}>Seleziona i materiali da importare nella Knowledge Base.</p>
                <div  style={{overflowY: "auto", border: "1px solid layers.sys.colors.outline", borderRadius: "0.375rem", marginBottom: layers.ref.spacing['8']}}>
                  {files.length === 0 && <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{padding: layers.ref.spacing['8'], textAlign: "center"}}>Nessun file trovato.</div>}
                  {files.map(f => (
                    <label key={f.id}  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], borderBottom: "1px solid layers.sys.colors.outline", cursor: "pointer"}}>
                      <input type="checkbox" checked={selected.has(f.id)} onChange={() => handleSelect(f.id)} />
                      <span style={{ flex: "1", fontWeight: "500" }}>{f.name}</span>
                      <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>{f.lastModified ? new Date(f.lastModified).toLocaleString() : ''}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 'catalog' && (
          <>
            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['8']}}>Catalogazione materiali importati:</p>
            <div  style={{gap: layers.ref.spacing['4'], overflowY: "auto"}}>
              {imported.map(entry => (
                <div key={entry.id} style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline", borderRadius: "0.375rem"}}>
                  <div style={{fontWeight: "bold", marginBottom: layers.ref.spacing['4']}}>{entry.fileName}</div>
                  <div style={{display: "flex", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['4']}}>
                    <input  placeholder="Materia (opzionale)" value={catalogData[entry.id]?.materia || ''} onChange={e => handleCatalogChange(entry.id, 'materia', e.target.value)} />
                    <input  placeholder="Classe (opzionale)" value={catalogData[entry.id]?.classe || ''} onChange={e => handleCatalogChange(entry.id, 'classe', e.target.value)} />
                    <input  placeholder="Categoria/Tag (opzionale)" value={catalogData[entry.id]?.category || ''} onChange={e => handleCatalogChange(entry.id, 'category', e.target.value)} />
                  </div>
                  <textarea  style={{ width: "100%" }} placeholder="Descrizione/Note" value={catalogData[entry.id]?.content !== undefined ? catalogData[entry.id]?.content : entry.content} onChange={e => handleCatalogChange(entry.id, 'content', e.target.value)} />
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'done' && (
          <div  style={{ textAlign: "center" }}>
            <span  style={{color: "layers.sys.colors.success", marginBottom: layers.ref.spacing['8']}}>check_circle</span>
            <div style={{fontWeight: "bold", marginBottom: layers.ref.spacing['8']}}>Importazione completata!</div>
          </div>
        )}
      </M3DialogContent>

      {step !== 'done' && (
        <M3DialogActions style={{gap: layers.ref.spacing['6']}}>
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




