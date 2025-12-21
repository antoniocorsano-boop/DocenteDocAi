// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initTokenClient,
  requestAccessToken,
  revokeAccessToken,
  createAppFolder,
  uploadBackup,
  downloadBackup,
  getBackupMetadata,
  pickGoogleDriveFolder,
} from '../../services/googleDriveService';
import { base64ToBlob, blobToBase64Parts } from '../../utils/documentUtils';

// Mock di Google Identity Services e GAPI
const mockGoogleAccountsOAuth2 = {
  initTokenClient: vi.fn(() => ({
    requestAccessToken: vi.fn(),
  })),
  revoke: vi.fn(),
};

const mockGapi = {
  load: vi.fn((_, callback) => callback()),
  picker: {
    DocsView: vi.fn(() => ({
      setSelectFolderEnabled: vi.fn().mockReturnThis(),
      setMimeTypes: vi.fn().mockReturnThis(),
    })),
    ViewId: { FOLDERS: 'FOLDERS' },
    Action: { PICKED: 'picked', CANCEL: 'cancel' },
    PickerBuilder: vi.fn(() => ({
      addView: vi.fn().mockReturnThis(),
      setOAuthToken: vi.fn().mockReturnThis(),
      setDeveloperKey: vi.fn().mockReturnThis(),
      setCallback: vi.fn().mockReturnThis(),
      build: vi.fn(() => ({
        setVisible: vi.fn(),
      })),
    })),
  },
};

// Mock di fetch
const mockFetch = vi.fn();

// Mock di documentUtils
vi.mock('../../utils/documentUtils', () => ({
  base64ToBlob: vi.fn(),
  blobToBase64Parts: vi.fn(),
}));

// Impostazione di un ambiente globale per i mock
beforeEach(() => {
  global.google = {
    accounts: {
      oauth2: mockGoogleAccountsOAuth2,
    },
  };
  global.gapi = mockGapi;
  global.fetch = mockFetch;
  vi.clearAllMocks();
  (base64ToBlob as vi.Mock).mockClear();
  (blobToBase64Parts as vi.Mock).mockClear();
});

afterEach(() => {
  delete global.google;
  delete global.gapi;
  // @ts-ignore
  delete global.fetch;
});

const mockAccessToken = 'mock-access-token';
const mockClientId = 'mock-client-id';
const mockApiKey = 'mock-api-key';

describe('googleDriveService - Initialization and Authentication', () => {
  it('dovrebbe inizializzare il token client di Google', () => {
    const callback = vi.fn();
    const result = initTokenClient(callback, mockClientId);
    expect(result).toBe(true);
    expect(mockGoogleAccountsOAuth2.initTokenClient).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: mockClientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: expect.any(Function),
      })
    );
  });

  it('dovrebbe richiedere un access token', () => {
    const callback = vi.fn();
    initTokenClient(callback, mockClientId);
    requestAccessToken();
    expect(mockGoogleAccountsOAuth2.initTokenClient().requestAccessToken).toHaveBeenCalledTimes(1);
  });

  it('dovrebbe revocare un access token', () => {
    const callback = vi.fn();
    initTokenClient(callback, mockClientId);
    // Simulate token acquisition
    mockGoogleAccountsOAuth2.initTokenClient.mock.calls[0][0].callback({ access_token: mockAccessToken });
    revokeAccessToken();
    expect(mockGoogleAccountsOAuth2.revoke).toHaveBeenCalledWith(mockAccessToken, expect.any(Function));
  });
});

describe('googleDriveService - Folder Management', () => {
  const mockFolderId = 'mock-folder-id';
  const mockFolderName = 'OrarioDoc_Backups';

  beforeEach(() => {
    initTokenClient(vi.fn(), mockClientId);
    // Simulate access token acquisition
    mockGoogleAccountsOAuth2.initTokenClient.mock.calls[0][0].callback({ access_token: mockAccessToken });
  });

  it('dovrebbe creare la cartella principale se non esiste', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ files: [] }), // Folder not found
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: mockFolderId, name: mockFolderName }), // Folder created
    });

    const folder = await createAppFolder();
    expect(folder).toEqual({ id: mockFolderId, name: mockFolderName });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=name%20%3D%20%27OrarioDoc_Backups%27'), // Search call
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/drive/v3/files', // Create call
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: mockFolderName,
          mimeType: 'application/vnd.google-apps.folder',
        }),
      })
    );
  });

  it('dovrebbe trovare la cartella principale se esiste', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ files: [{ id: mockFolderId, name: mockFolderName }] }), // Folder found
    });

    const folder = await createAppFolder();
    expect(folder).toEqual({ id: mockFolderId, name: mockFolderName });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=name%20%3D%20%27OrarioDoc_Backups%27'),
      expect.any(Object)
    );
  });
});

describe('googleDriveService - Backup and Restore', () => {
  const mockRootFolderId = 'root-folder-id';
  const mockFilesFolderId = 'files-folder-id';
  const mockBackupFileId = 'backup-file-id';
  const mockKbFileId = 'kb-file-id';
  const mockKbFileName = 'test_kb_file.txt';
  const mockKbFileContent = 'dGVzdCBjb250ZW50'; // base64 for "test content"
  const mockKbFileMimeType = 'text/plain';

  beforeEach(() => {
    initTokenClient(vi.fn(), mockClientId);
    mockGoogleAccountsOAuth2.initTokenClient.mock.calls[0][0].callback({ access_token: mockAccessToken });

    // Mock for createAppFolder & createFilesFolder
    mockFetch.mockResolvedValueOnce({ // Search OrarioDoc_Backups
      ok: true,
      json: () => Promise.resolve({ files: [{ id: mockRootFolderId, name: 'OrarioDoc_Backups' }] }),
    });
    mockFetch.mockResolvedValueOnce({ // Search OrarioDoc_Files
      ok: true,
      json: () => Promise.resolve({ files: [{ id: mockFilesFolderId, name: 'OrarioDoc_Files' }] }),
    });
  });

  describe('uploadBackup', () => {
    it('dovrebbe caricare il backup, splittando i file pesanti della KB', async () => {
      const mockAppState = {
        user: { id: '123' },
        knowledgeBase: [
          {
            id: 'kb1',
            fileName: mockKbFileName,
            content: 'heavy content',
            fileContent: { data: mockKbFileContent, mimeType: mockKbFileMimeType },
          },
          { id: 'kb2', fileName: 'light.txt', content: 'light content' },
        ],
      };

      // Mock per uploadFileToDrive (KB file)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: mockKbFileId, webViewLink: 'mock-link' }),
      });
      // Mock per findBackupFile (main JSON)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [] }), // No existing backup JSON
      });
      // Mock per upload del main JSON
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: mockBackupFileId }),
      });

      (base64ToBlob as vi.Mock).mockReturnValue(new Blob([mockKbFileContent]));

      await uploadBackup(mockAppState, mockRootFolderId);

      expect(mockFetch).toHaveBeenCalledTimes(5); // 2 folder searches + 1 KB file upload + 1 backup file search + 1 backup JSON upload
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('uploadType=multipart'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(base64ToBlob).toHaveBeenCalledWith(mockKbFileContent, mockKbFileMimeType);

      const uploadedPayload = JSON.parse(
        Array.from(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][1].body).find(
          (part: any) => part[0] === 'metadata'
        )[1].get('metadata')
      );
      expect(uploadedPayload.knowledgeBase[0].fileContent).toBeUndefined();
      expect(uploadedPayload.knowledgeBase[0].driveFileId).toBe(mockKbFileId);
      expect(uploadedPayload.knowledgeBase[0].driveViewLink).toBe('mock-link');
    });

    it('dovrebbe aggiornare un backup esistente', async () => {
      const mockAppState = {
        user: { id: '123' },
        knowledgeBase: [],
      };

      // Mock per findBackupFile (main JSON)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [{ id: mockBackupFileId }] }), // Existing backup JSON
      });
      // Mock per upload del main JSON (PATCH)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: mockBackupFileId }),
      });

      await uploadBackup(mockAppState, mockRootFolderId);

      expect(mockFetch).toHaveBeenCalledTimes(4); // 2 folder searches + 1 backup file search + 1 backup JSON upload
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`files/${mockBackupFileId}?uploadType=multipart`),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('downloadBackup', () => {
    it('dovrebbe scaricare il backup e re-idratare i file della KB', async () => {
      const mockLightKb = [
        { id: 'kb1', fileName: mockKbFileName, driveFileId: mockKbFileId, driveViewLink: 'mock-link' },
      ];
      const mockBackupPayload = { user: { id: '123' }, knowledgeBase: mockLightKb };

      // Mock per findBackupFile
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [{ id: mockBackupFileId }] }),
      });
      // Mock per download del main JSON
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBackupPayload),
      });
      // Mock per download del file KB
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['decoded content'])),
      });

      (blobToBase64Parts as vi.Mock).mockResolvedValue({
        data: mockKbFileContent,
        mimeType: mockKbFileMimeType,
      });

      const result = await downloadBackup(mockRootFolderId);

      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 search + 1 JSON download + 1 KB file download
      expect(mockFetch).toHaveBeenCalledWith(
        `https://www.googleapis.com/drive/v3/files/${mockBackupFileId}?alt=media`,
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        `https://www.googleapis.com/drive/v3/files/${mockKbFileId}?alt=media`,
        expect.any(Object)
      );
      expect(blobToBase64Parts).toHaveBeenCalledTimes(1);
      expect(result.knowledgeBase[0].fileContent).toEqual({ data: mockKbFileContent, mimeType: mockKbFileMimeType });
    });

    it('dovrebbe lanciare un errore se non viene trovato alcun backup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [] }), // No backup file
      });

      await expect(downloadBackup(mockRootFolderId)).rejects.toThrow('Nessun backup trovato.');
    });
  });

  describe('getBackupMetadata', () => {
    it('dovrebbe recuperare i metadati del file di backup', async () => {
      const mockModifiedTime = new Date().toISOString();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [{ id: mockBackupFileId, modifiedTime: mockModifiedTime }] }),
      });

      const metadata = await getBackupMetadata(mockRootFolderId);
      expect(metadata).toEqual({ modifiedTime: mockModifiedTime });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('fields=files(id,modifiedTime)'),
        expect.any(Object)
      );
    });

    it('dovrebbe restituire null se non viene trovato alcun file di backup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      });

      const metadata = await getBackupMetadata(mockRootFolderId);
      expect(metadata).toBeNull();
    });
  });

  describe('pickGoogleDriveFolder', () => {
    beforeEach(() => {
      global.google = {
        accounts: {
          oauth2: mockGoogleAccountsOAuth2,
        },
      };
      global.gapi = mockGapi;
    });

    it('dovrebbe aprire il picker di Google Drive e risolvere la cartella selezionata', async () => {
      const pickedFolder = { id: 'picked-folder-id', name: 'Picked Folder' };
      // Simulate picker callback with a picked folder
      (mockGapi.picker.PickerBuilder).mockImplementationOnce(() => ({
        addView: vi.fn().mockReturnThis(),
        setOAuthToken: vi.fn().mockReturnThis(),
        setDeveloperKey: vi.fn().mockReturnThis(),
        setCallback: vi.fn((cb) => {
          cb({ action: mockGapi.picker.Action.PICKED, docs: [pickedFolder] });
          return this;
        }),
        build: vi.fn().mockReturnThis(),
        setVisible: vi.fn(),
      }));

      const result = await pickGoogleDriveFolder(mockApiKey);

      expect(mockGapi.load).toHaveBeenCalledWith('picker', expect.any(Object));
      expect(mockGapi.picker.PickerBuilder).toHaveBeenCalledTimes(1);
      expect(result).toEqual(pickedFolder);
    });

    it('dovrebbe risolvere a null se il picker viene annullato', async () => {
      // Simulate picker callback with a cancelled action
      (mockGapi.picker.PickerBuilder).mockImplementationOnce(() => ({
        addView: vi.fn().mockReturnThis(),
        setOAuthToken: vi.fn().mockReturnThis(),
        setDeveloperKey: vi.fn().mockReturnThis(),
        setCallback: vi.fn((cb) => {
          cb({ action: mockGapi.picker.Action.CANCEL });
          return this;
        }),
        build: vi.fn().mockReturnThis(),
        setVisible: vi.fn(),
      }));

      const result = await pickGoogleDriveFolder(mockApiKey);

      expect(result).toBeNull();
    });

    it('dovrebbe lanciare un errore se la API Key è mancante', async () => {
      await expect(pickGoogleDriveFolder(undefined)).rejects.toThrow('API Key mancante. Inseriscila nelle impostazioni Drive.');
    });

    it('dovrebbe lanciare un errore se non autenticato', async () => {
      const callback = vi.fn();
      initTokenClient(callback, mockClientId); // re-init to clear token
      await expect(pickGoogleDriveFolder(mockApiKey)).rejects.toThrow('Autenticazione richiesta.');
    });
  });
});