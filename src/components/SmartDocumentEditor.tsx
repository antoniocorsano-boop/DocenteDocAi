import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AiSettings } from '../types';
import { refineTextWithAi, generateDocumentTable } from '../services/aiService';
import { generateHtmlDocxBlob } from '../utils/documentUtils';
import { sanitizeHTML } from '../utils/securityUtils';
import { saveAs } from '../utils/documentUtils';
import AiThinkingGem from './AiThinkingGem';

interface SmartDocumentEditorProps {
    initialContent: string;
    documentTitle: string;
    onClose: () => void;
    aiSettings: AiSettings;
    onSaveToKb?: (content: string, title: string) => void;
}

const SmartDocumentEditor: React.FC<SmartDocumentEditorProps> = ({ initialContent, documentTitle, onClose, aiSettings, onSaveToKb }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [aiMenuPosition, setAiMenuPosition] = useState<{top: number, left: number} | null>(null);
    const [selectedText, setSelectedText] = useState('');
    const [editorTitle, setEditorTitle] = useState(documentTitle);
    const [isDirty, setIsDirty] = useState(false);
    
    // CRITICAL FIX: Store the last valid selection range within the editor
    // This persists the cursor position even when clicking toolbar buttons (which steals focus)
    const savedRange = useRef<Range | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            // SECURITY: Sanitize initial content to prevent Stored XSS from malicious saves
            editorRef.current.innerHTML = sanitizeHTML(initialContent);
        }
    }, [initialContent]);

    const handleSelectionChange = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        
        // Check if selection is inside our editor
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
            // Save this valid range for later use
            savedRange.current = range.cloneRange();

            // Update UI for floating menu if text is selected
            if (selection.toString().length > 0) {
                const rect = range.getBoundingClientRect();
                setAiMenuPosition({
                    top: Math.min(window.innerHeight - 150, Math.max(10, rect.bottom + window.scrollY + 10)),
                    left: Math.min(window.innerWidth - 250, Math.max(10, rect.left + window.scrollX))
                });
                setSelectedText(selection.toString());
            } else {
                setAiMenuPosition(null);
                setSelectedText('');
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [handleSelectionChange]);

    const handleInput = useCallback(() => {
        if (!isDirty) setIsDirty(true);
    }, [isDirty]);

    const handleCloseSafe = useCallback(() => {
        if (isDirty) {
            if (window.confirm("Hai modifiche non salvate. Sei sicuro di voler chiudere?")) {
                onClose();
            }
        } else {
            onClose();
        }
    }, [isDirty, onClose]);

    const execCmd = useCallback((command: string, value: string | undefined = undefined) => {
        // Restore range before executing command to ensure it applies to the right place
        // This is crucial for toolbar buttons (Bold, Italic, etc.)
        if (savedRange.current) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedRange.current);
            }
        }
        
        document.execCommand(command, false, value);
        
        // Refocus editor and update saved range
        if (editorRef.current) {
            editorRef.current.focus();
            // Update saved range after modification
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                savedRange.current = sel.getRangeAt(0).cloneRange();
            }
        }
        setIsDirty(true);
    }, [setIsDirty]);

    /**
     * Modern replacement for document.execCommand('insertHTML').
     * Uses Range API to insert nodes directly at the cursor position.
     * Robustly handles focus loss by using savedRange.
     */
    const insertHtmlAtCursor = useCallback((html: string) => {
        const sel = window.getSelection();
        if (!sel) return;

        let range: Range | null = null;
        
        // 1. Try current selection if it's valid and inside editor
        if (sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
            range = sel.getRangeAt(0);
        } 
        // 2. Fallback to saved range if current focus is lost (e.g. clicked on AI button)
        else if (savedRange.current) {
            range = savedRange.current;
            // Restore visual selection
            sel.removeAllRanges();
            sel.addRange(range);
        }

        // 3. If still no valid range, we append to end of editor as fallback
        if (!range && editorRef.current) {
             editorRef.current.focus();
             range = document.createRange();
             range.selectNodeContents(editorRef.current);
             range.collapse(false); // Collapse to end
             sel.removeAllRanges();
             sel.addRange(range);
        }

        if (!range) return;

        // Execute Insertion
        range.deleteContents();

        const template = document.createElement('template');
        template.innerHTML = html;
        const fragment = template.content;
        const lastNode = fragment.lastChild;
        
        range.insertNode(fragment);

        // Move cursor to end of inserted content
        if (lastNode) {
            const newRange = range.cloneRange();
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            
            // Update saved range
            savedRange.current = newRange;
        }
        
        setIsDirty(true);
        
        // Trigger input event manually for React state updates if needed
        if (editorRef.current) {
            editorRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [setIsDirty]);

    const handleAiRefine = useCallback(async (instruction: string) => {
        // Use selectedText if available, otherwise use full content or handle appropriately
        const textToProcess = selectedText || (editorRef.current ? editorRef.current.innerText : '');
        
        if (!textToProcess) {
             alert("Scrivi o seleziona del testo prima di chiedere all'AI.");
             return;
        }

        setIsAiThinking(true);
        try {
            const newText = await refineTextWithAi(aiSettings, textToProcess, instruction);
            // SECURITY: Sanitize AI output before insertion
            const safeText = sanitizeHTML(newText);
            
            insertHtmlAtCursor(safeText);
            
        } catch (e: unknown) {
            let message = 'Errore AI.';
            if (e instanceof Error) {
                message = "Errore AI: " + e.message;
            }
            alert(message);
        } finally {
            setIsAiThinking(false);
            setAiMenuPosition(null);
        }
    }, [selectedText, editorRef, aiSettings, insertHtmlAtCursor, setIsAiThinking]);

    const handleAiTable = useCallback(async () => {
        // We use prompt() which steals focus, so savedRange is essential here
        const desc = prompt("Descrivi la tabella che vuoi (es. 'Tabella obiettivi minimi per 3 livelli')");
        if (!desc) return;
        
        setIsAiThinking(true);
        try {
            const tableHtml = await generateDocumentTable(aiSettings, desc);
            const safeTable = sanitizeHTML(tableHtml);
            
            // Insert table followed by a break to allow typing after it
            insertHtmlAtCursor(safeTable + '<p><br></p>'); 
            
        } catch (e: unknown) {
            let message = 'Errore AI.';
            if (e instanceof Error) {
                message = "Errore AI: " + e.message;
            }
            alert(message);
        } finally {
            setIsAiThinking(false);
        }
    }, [aiSettings, insertHtmlAtCursor, setIsAiThinking]);

    const handleDownload = useCallback(async () => {
        if (!editorRef.current) return;
        try {
            const htmlContent = editorRef.current.innerHTML;
            const blob = await generateHtmlDocxBlob(htmlContent, editorTitle);
            saveAs(blob, `${editorTitle.replace(/\s/g, '_')}.docx`);
        } catch (e: unknown) {
            console.error("Export error:", e);
            let message = 'Errore esportazione DOCX. Riprova.';
            if (e instanceof Error) {
                message = "Errore esportazione DOCX: " + e.message;
            }
            alert(message);
        }
    }, [editorRef, editorTitle]);
    
    const handleCopyForGoogleDocs = useCallback(() => {
         if (!editorRef.current) return;
         
         const range = document.createRange();
         range.selectNode(editorRef.current);
         const selection = window.getSelection();
         
         if(selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            
            // Restore user's cursor position using savedRange if available
            if (savedRange.current) {
                selection.removeAllRanges();
                selection.addRange(savedRange.current);
            } else {
                selection.removeAllRanges();
            }
            
            alert("Contenuto copiato! Ora puoi incollarlo (Ctrl+V) direttamente in un nuovo documento Google Docs mantenendo la formattazione.");
         }
    }, [editorRef]);

    const handleSave = useCallback(() => {
        if (!editorRef.current || !onSaveToKb) return;
        onSaveToKb(editorRef.current.innerHTML, editorTitle);
        setIsDirty(false);
    }, [editorRef, onSaveToKb, editorTitle, setIsDirty]);

    const handlePrint = useCallback(() => {
        if (!editorRef.current) return;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>' + editorTitle + '</title>');
            printWindow.document.write('<style>@import url(\'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap\'); body{font-family:\'Roboto\',sans-serif; padding: 20px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ccc;padding:8px;} h1,h2,h3{color:var(--sys-primary);}</style>'); // MD3 fix
            printWindow.document.write('</head><body>');
            printWindow.document.write(editorRef.current.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }, [editorRef, editorTitle]);

    return (
        <div className="fixed inset-0 z-[1050] bg-surface flex flex-col animate-in fade-in">
            {/* TOOLBAR */}
            <div className="flex items-center justify-between p-2 border-b border-outline-variant bg-surface-container shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={handleCloseSafe} className="icon-button"><span className="material-symbols-outlined">arrow_back</span></button>
                    <input 
                        type="text" 
                        value={editorTitle} 
                        onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }} 
                        className="bg-transparent border-none text-lg font-bold text-on-surface focus:ring-0"
                    />
                    {isDirty && <span className="text-xs text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">• Modificato</span>}
                </div>
                
                <div className="flex items-center gap-1 bg-surface rounded-lg border border-outline-variant p-1 hidden md:flex">
                    <button onClick={() => execCmd('bold')} className="icon-button !w-8 !h-8 rounded-lg hover:shadow-md transition-all" title="Grassetto"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                    <button onClick={() => execCmd('italic')} className="icon-button !w-8 !h-8 rounded-lg hover:shadow-md transition-all" title="Corsivo"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                    <button onClick={() => execCmd('formatBlock', 'h2')} className="icon-button !w-8 !h-8 rounded-lg hover:shadow-md transition-all" title="Titolo"><span className="material-symbols-outlined text-lg">title</span></button>
                    <div className="w-px h-6 bg-outline-variant mx-1"></div>
                    <button onClick={() => execCmd('insertUnorderedList')} className="icon-button !w-8 !h-8 rounded-lg hover:shadow-md transition-all" title="Elenco"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                    <button onClick={handleAiTable} className="icon-button !w-8 !h-8 text-primary rounded-lg hover:shadow-md transition-all" title="Tabella AI"><span className="material-symbols-outlined text-lg">table_chart</span></button>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleCopyForGoogleDocs} className="button button-tonal !h-9 !px-3 text-sm rounded-lg hover:shadow-md transition-all" title="Copia per Google Docs">
                        <span className="material-symbols-outlined mr-2 text-base">content_copy</span> Docs
                    </button>
                    <button onClick={handleDownload} className="button button-outlined !h-9 !px-3 text-sm rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2 text-base">download</span> DOCX
                    </button>
                    <button onClick={handlePrint} className="icon-button !w-9 !h-9 rounded-lg hover:bg-surface-container-high transition-all" title="Stampa / PDF">
                        <span className="material-symbols-outlined text-base">print</span>
                    </button>
                    {onSaveToKb && (
                        <button onClick={handleSave} className="button button-filled !h-9 !px-3 text-sm rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined mr-2 text-base">save</span> Salva
                        </button>
                    )}
                </div>
            </div>

            {/* EDITOR AREA */}
            <div className="flex-grow overflow-y-auto bg-surface-container-low p-4 md:p-8">
                <div 
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="max-w-4xl mx-auto min-h-[800px] bg-white text-black p-12 shadow-md outline-none prose focus:ring-2 ring-primary/20 transition-shadow"
                    style={{ fontFamily: "'Times New Roman', serif", fontSize: '12pt', lineHeight: '1.5' }}
                >
                </div>
            </div>

            {/* AI FLOATING MENU */}
            {aiMenuPosition && (
                <div 
                    className="absolute bg-surface-container-high rounded-xl shadow-xl border border-outline-variant p-2 flex flex-col gap-1 z-[1060] animate-in zoom-in-95"
                    style={{ top: aiMenuPosition.top, left: aiMenuPosition.left }}
                >
                    <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant mb-1">
                        <AiThinkingGem size="small" />
                        <span className="text-xs font-bold text-on-surface-variant">AI Assistant</span>
                    </div>
                    {isAiThinking ? (
                        <div className="p-2 text-center text-xs">Elaborazione...</div>
                    ) : (
                        <>
                            <button onClick={() => handleAiRefine("Riscrivi rendendo il tono più formale e professionale.")} className="text-left px-3 py-2 hover:bg-secondary-container rounded-lg text-sm flex gap-2">
                                <span className="material-symbols-outlined text-sm">history_edu</span> Rendi Formale
                            </button>
                            <button onClick={() => handleAiRefine("Espandi questo concetto aggiungendo dettagli pedagogici.")} className="text-left px-3 py-2 hover:bg-secondary-container rounded-lg text-sm flex gap-2">
                                <span className="material-symbols-outlined text-sm">unfold_more</span> Espandi
                            </button>
                            <button onClick={() => handleAiRefine("Sintetizza in un elenco puntato.")} className="text-left px-3 py-2 hover:bg-secondary-container rounded-lg text-sm flex gap-2">
                                <span className="material-symbols-outlined text-sm">format_list_bulleted</span> Sintetizza
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartDocumentEditor;
