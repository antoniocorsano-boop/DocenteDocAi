// Service per interscambio con NotebookLM (upload, fetch, sync, delete)
// Da estendere con API reali o mock

export interface NotebookLMFile {
  id: string;
  name: string;
  content: string;
  lastModified: string;
}

export const uploadNotebookFile = async (file: File): Promise<NotebookLMFile> => {
  // TODO: implementa upload reale
  return {
    id: `nb-${Date.now()}`,
    name: file.name,
    content: await file.text(),
    lastModified: new Date().toISOString(),
  };
};

export const fetchNotebookFiles = async (): Promise<NotebookLMFile[]> => {
  // TODO: implementa fetch reale
  return [];
};

export const deleteNotebookFile = async (id: string): Promise<void> => {
  // TODO: implementa delete reale
  void id;
};

export const syncNotebookFiles = async (): Promise<void> => {
  // TODO: implementa sync reale
};
