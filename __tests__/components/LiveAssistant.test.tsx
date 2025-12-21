// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LiveAssistant from '../../components/LiveAssistant';
import { getGoogleAIClient } from '../../services/aiClient';
import { Modality, LiveServerMessage } from '@google/genai';
import * as aiService from '../../services/aiService';
import { Studente, Valutazione } from '../../types';

// Mock getGoogleAIClient
vi.mock('../../services/aiClient', () => ({
  getGoogleAIClient: vi.fn(),
}));

// Mock aiService for tool calls
vi.mock('../../services/aiService', () => ({
  ...vi.importActual('../../services/aiService'), // Importa le implementazioni reali se necessarie
  performWebSearch: vi.fn(),
}));

// Mock delle API del browser per l'audio
const mockMediaStream = {
  getTracks: vi.fn(() => [{ stop: vi.fn() }]),
};

const mockMediaRecorder = {
  ondataavailable: vi.fn(),
  onstop: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

const mockAudioContext = {
  createMediaStreamSource: vi.fn(() => ({
    connect: vi.fn(),
  })),
  createScriptProcessor: vi.fn(() => ({
    onaudioprocess: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  })),
  resume: vi.fn(),
  close: vi.fn(),
  createBuffer: vi.fn(() => ({ duration: 1 })), // Per decodeAudioData
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    addEventListener: vi.fn(),
  })),
  destination: {},
  currentTime: 0,
};

// Mock di Google GenAI Live Session
const mockLiveSession = {
  sendRealtimeInput: vi.fn(),
  sendToolResponse: vi.fn(),
  close: vi.fn(),
};

describe('LiveAssistant', () => {
  let mockConnect: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn(() => Promise.resolve(mockMediaStream)),
      },
      writable: true,
    });

    // Mock MediaRecorder
    global.MediaRecorder = vi.fn(() => mockMediaRecorder) as any;

    // Mock AudioContext
    global.AudioContext = vi.fn(() => mockAudioContext) as any;
    // @ts-ignore
    global.webkitAudioContext = global.AudioContext; // For cross-browser compatibility

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    });
    global.cancelAnimationFrame = vi.fn();

    // Mock getGoogleAIClient().live.connect
    mockConnect = vi.fn().mockResolvedValue(mockLiveSession);
    (getGoogleAIClient as vi.Mock).mockReturnValue({
      live: {
        connect: mockConnect,
      },
      chats: {
        create: vi.fn(),
      }
    });

    // Mock global.atob and global.btoa for audio encoding/decoding helpers
    global.atob = vi.fn((b64) => (Buffer as any).from(b64, 'base64').toString('binary'));
    global.btoa = vi.fn((bin) => (Buffer as any).from(bin, 'binary').toString('base64'));

    // Mock aiService functions
    (aiService.performWebSearch as vi.Mock).mockResolvedValue({ text: 'Web search result', sources: [] });

    // Mock Date.now() for consistent IDs if needed
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-11-20T10:00:00.000Z');
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('lunedì, 20 novembre 2023');
    vi.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('10:00');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('dovrebbe avviare e fermare la sessione di registrazione vocale', async () => {
    render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    // Avvia registrazione
    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(mockAudioContext.resume).toHaveBeenCalledTimes(2); // Input and output contexts
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockMediaRecorder.start).toHaveBeenCalledTimes(1);

    // Ferma registrazione
    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Avvia Assistente'));
    expect(mockMediaRecorder.stop).toHaveBeenCalledTimes(1);
    expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalledTimes(1);
    expect(mockLiveSession.close).toHaveBeenCalledTimes(1);
    expect(mockAudioContext.close).toHaveBeenCalledTimes(2);
  });

  it('dovrebbe visualizzare la trascrizione dell\'utente e dell\'AI', async () => {
    render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));

    // Simulate incoming messages from Live API
    const liveConnectCallback = mockConnect.mock.calls[0][0].callbacks.onmessage;

    // Simulate input transcription
    await act(async () => {
      await liveConnectCallback({ serverContent: { inputTranscription: { text: 'Ciao, ' } } } as LiveServerMessage);
      await liveConnectCallback({ serverContent: { inputTranscription: { text: 'come stai?' } } } as LiveServerMessage);
    });

    // Simulate output transcription
    await act(async () => {
      await liveConnectCallback({ serverContent: { outputTranscription: { text: 'Sto bene, ' } } } as LiveServerMessage);
      await liveConnectCallback({ serverContent: { outputTranscription: { text: 'grazie!' } } } as LiveServerMessage);
    });

    // Simulate turn complete
    await act(async () => {
      await liveConnectCallback({ serverContent: { turnComplete: true, inputTranscription: { text: 'Ciao, come stai?' }, outputTranscription: { text: 'Sto bene, grazie!' } } } as LiveServerMessage);
    });

    await waitFor(() => {
      expect(screen.getByText('Tu')).toBeInTheDocument();
      expect(screen.getByText('Ciao, come stai?')).toBeInTheDocument();
      expect(screen.getByText('Assistente')).toBeInTheDocument();
      expect(screen.getByText('Sto bene, grazie!')).toBeInTheDocument();
    });
  });

  it('dovrebbe eseguire una funzione di tool calling e inviare la risposta', async () => {
    const mockOnNavigate = vi.fn();
    render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} onNavigate={mockOnNavigate} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));

    const liveConnectCallback = mockConnect.mock.calls[0][0].callbacks.onmessage;

    // Simulate tool call
    const toolCallMessage: LiveServerMessage = {
      toolCall: {
        functionCalls: [{
          id: 'fc-1',
          name: 'navigate',
          args: { destination: 'settings' },
        }],
      },
    };

    await act(async () => {
      await liveConnectCallback(toolCallMessage);
    });

    await waitFor(() => {
      expect(screen.getByText('Esecuzione: navigate...')).toBeInTheDocument();
      expect(mockOnNavigate).toHaveBeenCalledWith('settings', undefined);
      expect(mockLiveSession.sendToolResponse).toHaveBeenCalledWith({
        functionResponses: {
          id: 'fc-1',
          name: 'navigate',
          response: { result: { message: 'Navigazione avviata.' } },
        },
      });
      expect(screen.queryByText('Esecuzione: navigate...')).not.toBeInTheDocument(); // Tool status should clear
    });
  });

  it('dovrebbe gestire l\'esecuzione della funzione searchWeb', async () => {
    (aiService.performWebSearch as vi.Mock).mockResolvedValue({ text: 'Web search result', sources: [] });
    render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));

    const liveConnectCallback = mockConnect.mock.calls[0][0].callbacks.onmessage;

    const toolCallMessage: LiveServerMessage = {
      toolCall: {
        functionCalls: [{
          id: 'fc-web-1',
          name: 'searchWeb',
          args: { query: 'ultime notizie AI didattica' },
        }],
      },
    };

    await act(async () => {
      await liveConnectCallback(toolCallMessage);
    });

    await waitFor(() => {
      expect(aiService.performWebSearch).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-2.5-flash' }),
        'ultime notizie AI didattica'
      );
      expect(mockLiveSession.sendToolResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          functionResponses: {
            id: 'fc-web-1',
            name: 'searchWeb',
            response: { result: { found: true, summary: 'Search result summary' } },
          },
        })
      );
    });
  });

  it('dovrebbe interrompere la riproduzione audio se la sessione viene interrotta', async () => {
    const mockStopAudioSource = vi.fn();
    (mockAudioContext.createBufferSource as vi.Mock).mockReturnValue({
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      addEventListener: vi.fn(),
      stop: mockStopAudioSource,
    });

    render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));

    const liveConnectCallback = mockConnect.mock.calls[0][0].callbacks.onmessage;

    // Simulate incoming audio
    await act(async () => {
      await liveConnectCallback({ serverContent: { modelTurn: { parts: [{ inlineData: { data: 'mock-audio-data', mimeType: 'audio/pcm' } }] } } } as LiveServerMessage);
    });

    // Simulate interruption
    await act(async () => {
      await liveConnectCallback({ serverContent: { interrupted: true } } as LiveServerMessage);
    });

    await waitFor(() => {
      expect(mockStopAudioSource).toHaveBeenCalledTimes(1);
    });
  });

  it('dovrebbe pulire le risorse audio allo smontaggio', async () => {
    const { unmount } = render(<LiveAssistant students={[]} evaluations={[]} slots={{}} lessons={{}} pianiInclusione={{}} knowledgeBase={[]} />);
    const micButton = screen.getByRole('button', { name: /avvia assistente/i });

    fireEvent.click(micButton);
    await waitFor(() => expect(micButton).toHaveAttribute('aria-label', 'Termina Sessione'));

    unmount();

    expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalledTimes(1);
    expect(mockLiveSession.close).toHaveBeenCalledTimes(1);
    expect(mockAudioContext.close).toHaveBeenCalledTimes(2);
    expect(global.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
});