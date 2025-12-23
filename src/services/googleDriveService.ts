
import { DEFAULT_TIMETABLE_SETTINGS } from '../constants';
import { base64ToBlob, blobToBase64Parts } from '../utils/documentUtils';

const BACKUP_FILE_NAME = 'OrarioDoc_Backup.json';
const BACKUP_MIME_TYPE = 'application/json';
const DEFAULT_BACKUP_FOLDER_NAME = 'OrarioDoc_Backups';
const NOTEBOOKLM_FOLDER_NAME = 'OrarioDoc_NotebookLM';
const FILES_SUBFOLDER_NAME = 'OrarioDoc_Files';

let tokenClient: any = null;
let accessToken: string | null = null;

const getEnvClientId = () => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
            return import.meta.env.VITE_GOOGLE_CLIENT_ID;
        }
    } catch (e) { }
    return undefined;
};

export const initTokenClient = (callback: (tokenResponse: any) => void, explicitClientId?: string): boolean => {
    if (typeof google === 'undefined' || typeof google.accounts === 'undefined' || typeof google.accounts.oauth2 === 'undefined') {
        return false;
    }
    const clientId = explicitClientId || getEnvClientId() || DEFAULT_TIMETABLE_SETTINGS.googleClientId;
    if (!clientId) return false;
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse: any) => {
            accessToken = tokenResponse.access_token;
            callback(tokenResponse);
        },
    });
    return true;
};

/**
 * Request access token. Can accept specific scopes for incremental auth (e.g. Gmail).
 */
// FIX: Updated requestAccessToken to accept an optional overrideScope parameter to satisfy gmailService requirements
export const requestAccessToken = (overrideScope?: string) => {
    if (tokenClient) {
        if (overrideScope) {
            tokenClient.requestAccessToken({ prompt: 'consent', scope: overrideScope });
        } else {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    }
};

export const getAccessToken = () => accessToken;
export const revokeAccessToken = () => { if (accessToken) { google.accounts.oauth2.revoke(accessToken, () => accessToken = null); } };

/**
 * Initializes the GAPI client.
 */
// FIX: Added loadGapiClient export to satisfy gmailService requirements
export const loadGapiClient = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof gapi === 'undefined') {
            reject(new Error("Google API Script not loaded."));
            return;
        }
        gapi.load('client', { callback: resolve });
    });
};

const searchFolder = async (name: string, parentId?: string): Promise<{ id: string; name: string } | null> => {
    let query = `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    if (parentId) query += ` and '${parentId}' in parents`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.files && data.files.length > 0) ? data.files[0] : null;
};

const createFolder = async (name: string, parentId?: string): Promise<{ id: string; name: string }> => {
    const metadata: any = { name, mimeType: 'application/vnd.google-apps.folder' };
    if (parentId) metadata.parents = [parentId];
    const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
    });
    return await res.json();
};

export const uploadNotebookSource = async (fileName: string, content: string): Promise<void> => {
    if (!accessToken) throw new Error("Autenticazione Google richiesta.");

    let folder = await searchFolder(NOTEBOOKLM_FOLDER_NAME);
    if (!folder) folder = await createFolder(NOTEBOOKLM_FOLDER_NAME);

    const metadata = { name: fileName, mimeType: 'text/markdown', parents: [folder.id] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'text/markdown' }));

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: form,
    });
    if (!res.ok) throw new Error("Upload fallito.");
};

export const uploadBackup = async (data: any, folderId?: string): Promise<void> => {
    if (!accessToken) return;
    const fileContent = JSON.stringify(data);
    const metadata = { name: BACKUP_FILE_NAME, mimeType: BACKUP_MIME_TYPE, parents: folderId ? [folderId] : [] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: BACKUP_MIME_TYPE }));
    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: form,
    });
};

export const downloadBackup = async (fileId: string): Promise<any> => {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    return await res.json();
};

export const pickGoogleDriveFolder = async (apiKey?: string): Promise<{ id: string; name: string } | null> => {
    if (!apiKey) throw new Error('API Key mancante. Inseriscila nelle impostazioni Drive.');
    if (!accessToken) throw new Error('Autenticazione richiesta.');
    
    return new Promise((resolve, reject) => {
        gapi.load('picker', () => {
            const pickerBuilder = new gapi.picker.PickerBuilder()
                .addView(new gapi.picker.DocsView().setSelectFolderEnabled(true).setMimeTypes('application/vnd.google-apps.folder'))
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setCallback((data: any) => {
                    if (data.action === gapi.picker.Action.PICKED) {
                        resolve(data.docs[0]);
                    } else if (data.action === gapi.picker.Action.CANCEL) {
                        resolve(null);
                    }
                });
            pickerBuilder.build().setVisible(true);
        });
    });
};

export const createAppFolder = async () => {
    const folder = await searchFolder(DEFAULT_BACKUP_FOLDER_NAME);
    if (folder) return folder;
    return await createFolder(DEFAULT_BACKUP_FOLDER_NAME);
};

export const getBackupMetadata = async (folderId: string) => {
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`name='${BACKUP_FILE_NAME}' and '${folderId}' in parents and trashed=false`)}&fields=files(id,modifiedTime)`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.files?.[0] ? { modifiedTime: data.files[0].modifiedTime } : null;
};
