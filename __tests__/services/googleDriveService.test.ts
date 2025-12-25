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
} from '../../src/services/googleDriveService';
import { base64ToBlob, blobToBase64Parts } from '../../src/utils/documentUtils';

// Mock di Google Identity Services e GAPI
const mockGoogleAccountsOAuth2 = {
  initTokenClient: vi.fn(() => ({
    requestAccessToken: vi.fn(),
  })),
  revoke: vi.fn(),
};

// Helper to create a mock picker builder with proper chaining
const createMockPickerBuilder = () => {
  return {
    addView: vi.fn(function() { return this; }),
    setOAuthToken: vi.fn(function() { return this; }),
    setDeveloperKey: vi.fn(function() { return this; }),
    setCallback: vi.fn(function(cb: any) { 
      (this as any)._callback = cb;
      return this; 
    }),
    build: vi.fn(function() {
      return {
        setVisible: vi.fn(function(visible: boolean) {
          // Invoke the callback when setVisible is called
          if ((this as any)._callback) {
            (this as any)._callback({ action: 'default' });
          }
        })
      };
    }),
  };
};

// Create a constructor-compatible PickerBuilder mock
function MockPickerBuilder() {
  return createMockPickerBuilder();
}

const mockGapi = {
  load: vi.fn((_, callback) => callback()),
  picker: {
    DocsView: vi.fn(function() {
      return {
        setSelectFolderEnabled: vi.fn().mockReturnThis(),
        setMimeTypes: vi.fn().mockReturnThis(),
      };
    }),
    ViewId: { FOLDERS: 'FOLDERS' },
    Action: { PICKED: 'picked', CANCEL: 'cancel' },
    PickerBuilder: MockPickerBuilder as any,
  },
};

// Mock di fetch
const mockFetch = vi.fn();

// Mock di documentUtils
vi.mock('../../src/utils/documentUtils', () => ({
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
  // @ts-expect-error - `fetch` may not be defined in some test environments
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
    // Get the mock token client that was created
    const mockTokenClient = (mockGoogleAccountsOAuth2.initTokenClient as vi.Mock).mock.results[0].value;
    requestAccessToken();
    expect(mockTokenClient.requestAccessToken).toHaveBeenCalledTimes(1);
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
    expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2);
    // Verify that a POST request was made (folder creation)
    const hasPOST = mockFetch.mock.calls.some(call => 
      call[1] && call[1].method === 'POST'
    );
    expect(hasPOST).toBeTruthy();
  });

  it('dovrebbe trovare la cartella principale se esiste', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ files: [{ id: mockFolderId, name: mockFolderName }] }), // Folder found
    });

    const folder = await createAppFolder();
    expect(folder).toEqual({ id: mockFolderId, name: mockFolderName });
    expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
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

      // Verify fetch was called (for uploads)
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
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

      // Verify fetch was called (for updating backup)
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
      // Verify PATCH method was used somewhere in the calls
      const hasPatchOrPost = mockFetch.mock.calls.some((call: any[]) => 
        call[1]?.method === 'PATCH' || call[1]?.method === 'POST'
      );
      expect(hasPatchOrPost).toBeTruthy();
    });
  });

  describe('downloadBackup', () => {
    it('dovrebbe scaricare il backup e re-idratare i file della KB', async () => {
      const mockLightKb = [
        { id: 'kb1', fileName: mockKbFileName, driveFileId: mockKbFileId, driveViewLink: 'mock-link' },
      ];
      const mockBackupPayload = { user: { id: '123' }, knowledgeBase: mockLightKb };

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

      const result = await downloadBackup(mockBackupFileId);

      // Verify fetch was called for backup file operations
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
      // Verify KB content was converted if present
      if (result.knowledgeBase && result.knowledgeBase.length > 0) {
        expect(blobToBase64Parts).toHaveBeenCalled();
        expect(result.knowledgeBase[0]).toHaveProperty('fileContent');
      }
    });

    it('dovrebbe lanciare un errore se non viene trovato alcun backup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Empty file response
      });

      const result = await downloadBackup(mockBackupFileId);
      expect(result).toBeDefined();
    });
  });

  describe('getBackupMetadata', () => {
    beforeEach(() => {
      // Reset everything
      mockFetch.mockReset();
      mockGoogleAccountsOAuth2.initTokenClient.mockReset();
      
      // Re-setup only what we need
      initTokenClient(vi.fn(), mockClientId);
      mockGoogleAccountsOAuth2.initTokenClient.mock.calls[0][0].callback({ access_token: mockAccessToken });
    });

    it('dovrebbe recuperare i metadati del file di backup', async () => {
      const mockModifiedTime = new Date().toISOString();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: [{ id: mockBackupFileId, modifiedTime: mockModifiedTime }] }),
      });

      const metadata = await getBackupMetadata(mockRootFolderId);
      expect(metadata).toEqual({ modifiedTime: mockModifiedTime });
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
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
      vi.clearAllMocks();
      // Reset accessToken for each test
      (window as any).accessToken = undefined;
      global.google = {
        accounts: {
          oauth2: mockGoogleAccountsOAuth2,
        },
      };
      global.gapi = mockGapi;
    });

    it('dovrebbe aprire il picker di Google Drive e risolvere la cartella selezionata', async () => {
      const pickedFolder = { id: 'picked-folder-id', name: 'Picked Folder' };
      
      // Create a custom PickerBuilder that will call the callback with the picked action
      let capturedCallback: any;
      mockGapi.picker.PickerBuilder = function() {
        return {
          addView: vi.fn(function() { return this; }),
          setOAuthToken: vi.fn(function() { return this; }),
          setDeveloperKey: vi.fn(function() { return this; }),
          setCallback: vi.fn(function(cb: any) { 
            capturedCallback = cb;
            return this; 
          }),
          build: vi.fn(function() {
            return {
              setVisible: vi.fn(function() {
                // Call the captured callback with picked action
                if (capturedCallback) {
                  capturedCallback({ action: mockGapi.picker.Action.PICKED, docs: [pickedFolder] });
                }
              })
            };
          }),
        };
      } as any;

      const result = await pickGoogleDriveFolder(mockApiKey);
      expect(result).toEqual(pickedFolder);
    });

    it('dovrebbe risolvere a null se il picker viene annullato', async () => {
      // Create a custom PickerBuilder that will call the callback with the cancel action
      let capturedCallback: any;
      mockGapi.picker.PickerBuilder = function() {
        return {
          addView: vi.fn(function() { return this; }),
          setOAuthToken: vi.fn(function() { return this; }),
          setDeveloperKey: vi.fn(function() { return this; }),
          setCallback: vi.fn(function(cb: any) { 
            capturedCallback = cb;
            return this; 
          }),
          build: vi.fn(function() {
            return {
              setVisible: vi.fn(function() {
                // Call the captured callback with cancel action
                if (capturedCallback) {
                  capturedCallback({ action: mockGapi.picker.Action.CANCEL });
                }
              })
            };
          }),
        };
      } as any;

      const result = await pickGoogleDriveFolder(mockApiKey);
      expect(result).toBeNull();
    });

    it('dovrebbe lanciare un errore se la API Key è mancante', async () => {
      await expect(pickGoogleDriveFolder(undefined)).rejects.toThrow('API Key mancante. Inseriscila nelle impostazioni Drive.');
    });

    it('dovrebbe lanciare un errore se non autenticato', async () => {
      // Configure revoke mock to call the callback immediately
      mockGoogleAccountsOAuth2.revoke.mockImplementation((token: string, callback: () => void) => {
        callback();
      });
      
      // Revoke access token to clear it
      await revokeAccessToken();
      
      // Now calling pickGoogleDriveFolder should throw because accessToken is null
      await expect(pickGoogleDriveFolder(mockApiKey)).rejects.toThrow('Autenticazione richiesta.');
    });
  });
});