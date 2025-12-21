
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SmartDocumentEditor from '../../components/SmartDocumentEditor';
import { AiSettings } from '../../types';
import * as aiService from '../../services/aiService';
import * as documentUtils from '../../utils/documentUtils';
import * as securityUtils from '../../utils/securityUtils';

// Mock di aiService
vi.mock('../../services/aiService', () => ({
  refineTextWithAi: vi.fn(),
  generateDocumentTable: vi.fn(),
}));

// Mock di documentUtils
vi.mock('../../utils/documentUtils', () => ({
  generateHtmlDocxBlob: vi.fn(),
  saveAs: vi.fn(),
}));

// Mock di securityUtils
vi.mock('../../utils/securityUtils', () => ({
  sanitizeHTML: vi.fn((html) => html), // Semplicemente restituisce l'HTML per il test
}));


describe('SmartDocumentEditor', () => {
  const mockAiSettings: AiSettings = { model: 'gemini-2.5-flash' };
  const mockOnClose = vi.fn();
  const mockOnSaveToKb = vi.fn();
  const initialContent = '<p>This is initial content.</p>';
  const documentTitle = 'Test Document';

  // Mock for window.getSelection().toString()
  const mockSelectionToString = vi.fn(() => 'selected text');

  beforeEach(() => {
    vi.clearAllMocks();
    (aiService.refineTextWithAi as vi.Mock).mockResolvedValue('Refined HTML');
    (aiService.generateDocumentTable as vi.Mock).mockResolvedValue('<table><tr><td>Table Content</td></tr></table>');
    (documentUtils.generateHtmlDocxBlob as vi.Mock).mockResolvedValue(new Blob(['docx content']));
    (securityUtils.sanitizeHTML as vi.Mock).mockImplementation((html) => html); // Ensure sanitizeHTML passes content through for tests

    // Mocking window.prompt and window.getSelection
    vi.spyOn(window, 'prompt').mockReturnValue('table description');

    const mockRange = {
      commonAncestorContainer: document.createElement('div'),
      getBoundingClientRect: () => ({ bottom: 100, left: 100, width: 50, height: 20 }),
      cloneRange: vi.fn().mockReturnThis(),
      deleteContents: vi.fn(),
      insertNode: vi.fn(),
      setStartAfter: vi.fn(),
      collapse: vi.fn(),
    };
    const mockSelection = {
      rangeCount: 1,
      getRangeAt: vi.fn(() => mockRange),
      toString: mockSelectionToString, // Assign the mock function here
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    // Mock document.execCommand
    document.execCommand = vi.fn();

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
    // Mock window.alert and window.confirm
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  it('dovrebbe renderizzare il contenuto iniziale sanitizzato', () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const editorElement = screen.getByRole('textbox', { name: /document title/i }).nextElementSibling?.nextElementSibling;
    expect(editorElement?.innerHTML).toBe(initialContent);
    expect(securityUtils.sanitizeHTML).toHaveBeenCalledWith(initialContent);
  });

  it('dovrebbe aggiornare il titolo del documento', () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const titleInput = screen.getByDisplayValue(documentTitle);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
    expect(screen.getByText('• Modificato')).toBeInTheDocument();
  });

  it('dovrebbe chiamare document.execCommand per il grassetto', () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const boldButton = screen.getByTitle('Grassetto');
    fireEvent.click(boldButton);
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
    expect(screen.getByText('• Modificato')).toBeInTheDocument();
  });

  it('dovrebbe chiamare document.execCommand per il corsivo', () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const italicButton = screen.getByTitle('Corsivo');
    fireEvent.click(italicButton);
    expect(document.execCommand).toHaveBeenCalledWith('italic', false, undefined);
  });

  it('dovrebbe mostrare il menu AI flottante sulla selezione del testo', async () => {
    const { container } = render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const editor = container.querySelector('[contenteditable="true"]');
    if (!editor) throw new Error('Editor not found');

    // Simulate text selection within the editor
    const mockRange = document.createRange();
    mockRange.setStart(editor.firstChild!, 0); // Assuming firstChild is a text node
    mockRange.setEnd(editor.firstChild!, 5);
    const mockSelection = window.getSelection()!;
    mockSelection.removeAllRanges();
    mockSelection.addRange(mockRange);

    fireEvent.selectionChange(editor); // Trigger the event listener

    await waitFor(() => {
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Rendi Formale')).toBeInTheDocument();
    });
  });

  it('dovrebbe chiamare refineTextWithAi e inserire il testo raffinato', async () => {
    const { container } = render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const editor = container.querySelector('[contenteditable="true"]');
    if (!editor) throw new Error('Editor not found');

    // Simulate selecting text
    const mockRange = document.createRange();
    mockRange.setStart(editor.firstChild!, 0);
    mockRange.setEnd(editor.firstChild!, 5);
    const mockSelection = window.getSelection()!;
    mockSelection.removeAllRanges();
    mockSelection.addRange(mockRange);
    mockSelectionToString.mockReturnValue('selected text'); // Set selected text for the mock
    fireEvent.selectionChange(editor);

    const refineButton = await screen.findByText('Rendi Formale');
    fireEvent.click(refineButton);

    await waitFor(() => {
      expect(aiService.refineTextWithAi).toHaveBeenCalledWith(mockAiSettings, 'selected text', 'Riscrivi rendendo il tono più formale e professionale.');
      // Verify that sanitizeHTML is called on AI output
      expect(securityUtils.sanitizeHTML).toHaveBeenCalledWith('Refined HTML');
    });
  });

  it('dovrebbe chiamare generateDocumentTable e inserire la tabella', async () => {
    const { container } = render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const editor = container.querySelector('[contenteditable="true"]');
    if (!editor) throw new Error('Editor not found');

    const aiTableButton = screen.getByTitle('Tabella AI');
    fireEvent.click(aiTableButton);

    // Mock window.prompt response
    expect(window.prompt).toHaveBeenCalledWith("Descrivi la tabella che vuoi (es. 'Tabella obiettivi minimi per 3 livelli')");

    await waitFor(() => {
      expect(aiService.generateDocumentTable).toHaveBeenCalledWith(mockAiSettings, 'table description');
      // Verify that sanitizeHTML is called on AI output
      expect(securityUtils.sanitizeHTML).toHaveBeenCalledWith('<table><tr><td>Table Content</td></tr></table>');
    });
  });

  it('dovrebbe salvare in KB quando onSaveToKb è fornito', async () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} onSaveToKb={mockOnSaveToKb} />);
    const saveButton = screen.getByText('Salva');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockOnSaveToKb).toHaveBeenCalledWith(expect.any(String), documentTitle);
      expect(screen.queryByText('• Modificato')).not.toBeInTheDocument();
    });
  });

  it('dovrebbe scaricare il documento DOCX', async () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const docxButton = screen.getByText('DOCX');
    fireEvent.click(docxButton);
    await waitFor(() => {
      expect(documentUtils.generateHtmlDocxBlob).toHaveBeenCalledWith(initialContent, documentTitle);
      expect(documentUtils.saveAs).toHaveBeenCalledWith(expect.any(Blob), `${documentTitle.replace(/\s/g, '_')}.docx`);
    });
  });

  it('dovrebbe copiare il contenuto negli appunti per Google Docs', async () => {
    const { container } = render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const editor = container.querySelector('[contenteditable="true"]');
    if (!editor) throw new Error('Editor not found');

    const copyButton = screen.getByText('Docs');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(window.getSelection().removeAllRanges).toHaveBeenCalled();
      expect(window.getSelection().addRange).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Contenuto copiato!"));
    });
  });

  it('dovrebbe avvisare sulle modifiche non salvate prima di chiudere', () => {
    render(<SmartDocumentEditor initialContent={initialContent} documentTitle={documentTitle} onClose={mockOnClose} aiSettings={mockAiSettings} />);
    const titleInput = screen.getByDisplayValue(documentTitle);
    fireEvent.change(titleInput, { target: { value: 'Changed' } }); // Make it dirty

    (window.confirm as unknown as vi.MockInstance).mockReturnValueOnce(true); // User confirms to close
    // Let's find the back button by class or icon
    const backButton = screen.getAllByRole('button')[0]; // First button is usually back
    fireEvent.click(backButton);

    expect(window.confirm).toHaveBeenCalledWith('Hai modifiche non salvate. Sei sicuro di voler chiudere?');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
