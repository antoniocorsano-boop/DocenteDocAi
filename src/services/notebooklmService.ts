// Service per interscambio con NotebookLM (upload, fetch, sync, delete)
// Integrazione con Google NotebookLM API

export interface NotebookLMFile {
  id: string;
  name: string;
  content: string;
  lastModified: string;
  notebookId?: string; // ID del notebook associato
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

// Interfaccia per la risposta API di NotebookLM
interface NotebookLMApiDocument {
  documentId: string;
  displayName?: string;
  name?: string;
  updateTime?: string;
  createTime?: string;
  notebookId?: string;
  processingState?: string;
}

// Configurazione API NotebookLM
const NOTEBOOKLM_CONFIG = {
  baseUrl: 'https://notebooks.googleapis.com/v1',
  scopes: ['https://www.googleapis.com/auth/notebooks'],
};

// Helper per ottenere token di autenticazione
const getAuthToken = async (): Promise<string | null> => {
  // TODO: Implementare autenticazione OAuth con Google
  // Per ora restituiamo null per simulare mancanza auth
  return null;
};

// Helper per gestire errori API
const handleApiError = (error: unknown, operation: string) => {
  console.error(`NotebookLM ${operation} error:`, error);
  const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
  throw new Error(`Errore durante ${operation}: ${errorMessage}`);
};

export const uploadNotebookFile = async (file: File): Promise<NotebookLMFile> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      // Fallback: salva localmente se non autenticato
      console.warn('NotebookLM non autenticato, salvataggio locale');
      return {
        id: `nb-local-${Date.now()}`,
        name: file.name,
        content: await file.text(),
        lastModified: new Date().toISOString(),
        status: 'ready'
      };
    }

    // Preparazione del form data per upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify({
      name: file.name,
      mimeType: file.type || 'application/octet-stream'
    }));

    // Chiamata API reale a NotebookLM
    const response = await fetch(`${NOTEBOOKLM_CONFIG.baseUrl}/notebooks/documents:upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      id: result.documentId || `nb-${Date.now()}`,
      name: file.name,
      content: await file.text(), // Mantieni copia locale
      lastModified: new Date().toISOString(),
      notebookId: result.notebookId,
      status: 'processing' // NotebookLM processa i documenti
    };

  } catch (error) {
    return handleApiError(error, 'upload');
  }
};

export const fetchNotebookFiles = async (): Promise<NotebookLMFile[]> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      // Fallback: restituisci array vuoto se non autenticato
      console.warn('NotebookLM non autenticato, nessun file remoto');
      return [];
    }

    // Chiamata API per ottenere la lista dei documenti
    const response = await fetch(`${NOTEBOOKLM_CONFIG.baseUrl}/notebooks/documents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Mappa la risposta API al nostro formato
    return (result.documents || []).map((doc: NotebookLMApiDocument) => ({
      id: doc.documentId,
      name: doc.displayName || doc.name || 'Documento senza nome',
      content: '', // Il contenuto non viene restituito nella lista, solo metadata
      lastModified: doc.updateTime || doc.createTime || new Date().toISOString(),
      notebookId: doc.notebookId,
      status: doc.processingState === 'PROCESSING' ? 'processing' :
              doc.processingState === 'READY' ? 'ready' : 'error'
    }));

  } catch (error) {
    return handleApiError(error, 'fetch');
  }
};

export const deleteNotebookFile = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.warn('NotebookLM non autenticato, impossibile eliminare file remoto');
      return;
    }

    // Chiamata API per eliminare il documento
    const response = await fetch(`${NOTEBOOKLM_CONFIG.baseUrl}/notebooks/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Documento ${id} eliminato da NotebookLM`);

  } catch (error) {
    return handleApiError(error, 'delete');
  }
};

export const syncNotebookFiles = async (): Promise<void> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.warn('NotebookLM non autenticato, sincronizzazione saltata');
      return;
    }

    console.log('Avvio sincronizzazione NotebookLM...');

    // Recupera lista file remoti
    const remoteFiles = await fetchNotebookFiles();

    // TODO: Confronta con file locali e sincronizza
    // Per ora, solo log della sincronizzazione
    console.log(`Sincronizzati ${remoteFiles.length} file da NotebookLM`);

    // Potrebbe includere:
    // - Upload file locali non presenti remotamente
    // - Download metadata di file remoti
    // - Risoluzione conflitti
    // - Pulizia file locali eliminati remotamente

  } catch (error) {
    return handleApiError(error, 'sync');
  }
};

// Utility per verificare stato autenticazione
export const isNotebookLMAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return token !== null;
  } catch {
    return false;
  }
};

// Utility per ottenere URL di autorizzazione
export const getNotebookLMAuthUrl = (): string => {
  // TODO: Implementare OAuth flow
  // Per ora restituiamo un placeholder
  return `https://accounts.google.com/oauth/authorize?scope=${encodeURIComponent(NOTEBOOKLM_CONFIG.scopes.join(' '))}&response_type=code&client_id=YOUR_CLIENT_ID`;
};
