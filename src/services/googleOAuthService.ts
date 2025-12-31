// src/services/googleOAuthService.ts
// Google OAuth 2.0 logic for NotebookLM integration (PWA-friendly)

export interface GoogleOAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
}

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // TODO: Replace with real client id
const REDIRECT_URI = window.location.origin + '/oauth-callback';
const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SCOPES = [
  'https://www.googleapis.com/auth/notebooks',
];

// --- Step 1: Get Auth URL ---
export function getGoogleAuthUrl(state: string = ''): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

// --- Step 2: Exchange code for tokens ---
export async function exchangeCodeForTokens(code: string): Promise<GoogleOAuthTokens> {
  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: 'YOUR_CLIENT_SECRET', // TODO: Securely store and inject
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error('Token exchange failed');
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
}

// --- Step 3: Refresh token ---
export async function refreshAccessToken(refreshToken: string): Promise<GoogleOAuthTokens> {
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: 'YOUR_CLIENT_SECRET',
    grant_type: 'refresh_token',
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error('Token refresh failed');
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
}

// --- Step 4: Token storage helpers (localStorage for PWA) ---
const TOKEN_KEY = 'notebooklm_google_oauth_tokens';

export function saveTokens(tokens: GoogleOAuthTokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function loadTokens(): GoogleOAuthTokens | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}
