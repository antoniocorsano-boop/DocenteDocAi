
import React, { useState, useCallback } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { extractTextFromFile, generateHtmlDocxBlob } from '../utils/documentUtils';
import { refactorProgrammazione } from '../services/aiService';
import { AiSettings } from '../types';
import { saveAs } from '../utils/documentUtils';
import { sanitizeHTML } from '../utils/securityUtils';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button 
} from './ui';

interface SmartImportModalProps {
    onClose: () => void;
    aiSettings: AiSettings;
}

const SmartImportModal: React.FC<SmartImportModalProps> = ({ onClose, aiSettings }) => {
    const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalText, setOriginalText] = useState('');
    const [refactoredHtml, setRefactoredHtml] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        setOriginalFile(file);
        setStep('processing');
        setProcessingStatus('Lettura file originale...');

        try {
            const text = await extractTextFromFile(file);
            setOriginalText(text);

            setProcessingStatus('Analisi e Ristrutturazione con AI...');
            const html = await refactorProgrammazione(aiSettings, text);

            // Sanitize output before storing/rendering
            setRefactoredHtml(sanitizeHTML(html));

            setStep('result');
        } catch (error: unknown) {
            console.error(error);
            let message = 'Errore durante l\'elaborazione.';
            if (error instanceof Error) {
                message = "Errore durante l'elaborazione: " + error.message;
            }
            alert(message);
            setStep('upload');
        }
    }, [aiSettings]);

    const { getRootProps, getInputProps, isDragActive } = useFileDrop({
        onDrop,
        accept: 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain',
        multiple: false
    });

    const handleDownloadDocx = async () => {
        const blob = await generateHtmlDocxBlob(refactoredHtml, `Refactor - ${originalFile?.name}`);
        saveAs(blob, `Refactored_${originalFile?.name?.split('.')[0]}.docx`);
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Smart Import & Refactor"
            headline="Trasforma vecchi documenti in file standardizzati"
            mode="fullscreen"
        >
            <M3DialogContent style={{ height: "100%", display: "flex", flexDirection: "column", padding: "var(--md-sys-spacing-8)" }}>
                {step === 'upload' && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div
                            {...getRootProps()}
                            className={`dropzone-area w-full max-w-xl h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-[var(--md-sys-shape-corner-extra-large)] transition-all cursor-pointer ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:border-[var(--md-sys-color-outline)]'}`}
                            data-active={isDragActive}
                        >
                            <input {...getInputProps()} />
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-[var(--md-sys-elevation-level1)] transition-colors ${isDragActive ? 'bg-primary text-on-primary' : 'bg-[var(--md-sys-color-surface-container-high)]est text-primary'}`}>
                                <span className="material-symbols-outlined text-4xl">transform</span>
                            </div>
                            <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold", textAlign: "center" }}>Carica la vecchia Programmazione</h3>
                            <div style={{ marginTop: "var(--md-sys-spacing-4)", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="px-3 py-1 bg-[var(--md-sys-color-surface-container-high)]est font-mono text-[var(--md-sys-color-on-surface)]-variant border-[var(--md-sys-color-outline-variant)]" style={{ borderRadius: "9999px", fontSize: "0.75rem", border: "1px solid var(--md-sys-color-outline)" }}>.PDF</span>
                                <span className="px-3 py-1 bg-[var(--md-sys-color-surface-container-high)]est font-mono text-[var(--md-sys-color-on-surface)]-variant border-[var(--md-sys-color-outline-variant)]" style={{ borderRadius: "9999px", fontSize: "0.75rem", border: "1px solid var(--md-sys-color-outline)" }}>.DOCX</span>
                                <span className="px-3 py-1 bg-[var(--md-sys-color-surface-container-high)]est font-mono text-[var(--md-sys-color-on-surface)]-variant border-[var(--md-sys-color-outline-variant)]" style={{ borderRadius: "9999px", fontSize: "0.75rem", border: "1px solid var(--md-sys-color-outline)" }}>.TXT</span>
                            </div>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant max-w-xs" style={{ marginTop: "var(--md-sys-spacing-6)", textAlign: "center", opacity: "0.8" }}>
                                Trascina qui il file o clicca per selezionare.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "var(--md-sys-spacing-8)" }}>
                        <div className="relative">
                            <div className="animate-spin" style={{ borderRadius: "9999px", height: "6rem", width: "6rem", borderBottom: "4px solid var(--md-sys-color-outline)", borderColor: "var(--md-sys-color-primary)" }}></div>
                            <div className="absolute inset-0" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined text-3xl animate-pulse" style={{ color: "var(--md-sys-color-primary)" }}>auto_awesome</span>
                            </div>
                        </div>
                        <div style={{ textAlign: "center", gap: "var(--md-sys-spacing-2)" }}>
                            <p className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] animate-pulse" style={{ color: "var(--md-sys-color-primary)", fontWeight: "bold" }}>{processingStatus}</p>
                            <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem" }}>L'Intelligenza Artificiale sta riorganizzando il contenuto...</p>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)", height: "100%", minHeight: "0" }}>
                        <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)] overflow-hidden" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "0", border: "1px solid var(--md-sys-color-outline)" }}>
                            <div className="border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-sm sticky top-0 z-10" style={{ padding: "var(--md-sys-spacing-8)", borderBottom: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">description</span>
                                <h3 className="m3-title-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "bold" }}>Testo Originale (Estratto)</h3>
                            </div>
                            <div className="font-mono text-[var(--md-sys-color-on-surface)]-variant" style={{ flexGrow: "1", padding: "var(--md-sys-spacing-6)", overflowY: "auto", fontSize: "0.75rem", whiteSpace: "pre-wrap", lineHeight: "1.625" }}>
                                {originalText}
                            </div>
                        </div>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] border-2 border-primary/10 shadow-[var(--md-sys-elevation-level2)] overflow-hidden relative" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "0", backgroundColor: "var(--md-sys-color-surface)" }}>
                            {/* Paper texture overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

                            <div className="border-primary/10 bg-surface/95 backdrop-blur-sm sticky top-0 z-10" style={{ padding: "var(--md-sys-spacing-8)", borderBottom: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", color: "var(--md-sys-color-primary)" }}>
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>auto_awesome</span>
                                <h3 className="m3-title-medium" style={{ fontWeight: "900" }}>Risultato Ristrutturato</h3>
                            </div>
                            <div className="prose max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-[var(--md-sys-color-on-surface)] prose-li:text-[var(--md-sys-color-on-surface)]" style={{ flexGrow: "1", padding: "var(--md-sys-spacing-8)", overflowY: "auto" }}>
                                <div dangerouslySetInnerHTML={{ __html: refactoredHtml }} />
                            </div>
                        </div>
                    </div>
                )}
            </M3DialogContent>
            <M3DialogActions>
                {step === 'result' ? (
                    <>
                        <M3Button variant="text" onClick={() => setStep('upload')}>
                            Ricomincia
                        </M3Button>
                        <M3Button 
                            variant="filled" 
                            onClick={handleDownloadDocx}
                            startIcon={<span style={{
  fontFamily: 'Material Symbols Outlined'
}}>download</span>}
                        >
                            Scarica DOCX
                        </M3Button>
                    </>
                ) : (
                    <M3Button variant="text" onClick={onClose}>
                        Annulla
                    </M3Button>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SmartImportModal;


