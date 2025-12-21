
import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromFile, generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { refactorProgrammazione } from '../services/aiService';
import { AiSettings } from '../types';
import { saveAs } from '../utils/documentUtils';
import { sanitizeHTML } from '../utils/securityUtils';
import { M3Dialog } from './M3Components';

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
        } catch (error: any) {
            console.error(error);
            alert("Errore durante l'elaborazione: " + error.message);
            setStep('upload');
        }
    }, [aiSettings]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        multiple: false
    });

    const handleDownloadDocx = async () => {
        const blob = await generateHtmlDocxBlob(refactoredHtml, `Refactor - ${originalFile?.name}`);
        saveAs(blob, `Refactored_${originalFile?.name?.split('.')[0]}.docx`);
    };

    const dialogButtons = useMemo(() => {
        if (step === 'result') {
            return (
                <>
                    <button onClick={() => setStep('upload')} className="button button-text">
                        Ricomincia
                    </button>
                    <button onClick={handleDownloadDocx} className="button button-filled">
                        <span className="material-symbols-outlined mr-2">download</span>
                        Scarica DOCX
                    </button>
                </>
            );
        } else {
            return (
                <button onClick={onClose} className="button button-text">
                    Annulla
                </button>
            );
        }
    }, [step, handleDownloadDocx, onClose]);

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title="Smart Import & Refactor"
            headline="Trasforma vecchi documenti in file standardizzati"
            buttons={dialogButtons}
            fullscreen={true}
        >
            <div className="h-full flex flex-col p-2">
                {step === 'upload' && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div
                            {...getRootProps()}
                            className={`dropzone-area w-full max-w-xl h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all cursor-pointer ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high hover:border-outline'}`}
                            data-active={isDragActive}
                        >
                            <input {...getInputProps()} />
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-colors ${isDragActive ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'}`}>
                                <span className="material-symbols-outlined text-4xl">transform</span>
                            </div>
                            <h3 className="m3-headline-small text-on-surface font-bold text-center">Carica la vecchia Programmazione</h3>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-xs font-mono text-on-surface-variant border border-outline-variant">.PDF</span>
                                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-xs font-mono text-on-surface-variant border border-outline-variant">.DOCX</span>
                                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-xs font-mono text-on-surface-variant border border-outline-variant">.TXT</span>
                            </div>
                            <p className="m3-body-medium text-on-surface-variant mt-6 text-center max-w-xs opacity-80">
                                Trascina qui il file o clicca per selezionare.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-primary"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_awesome</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <p className="m3-headline-small animate-pulse text-primary font-bold">{processingStatus}</p>
                            <p className="text-on-surface-variant text-sm">L'Intelligenza Artificiale sta riorganizzando il contenuto...</p>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0">
                        <div className="flex flex-col h-full min-h-0 bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden">
                            <div className="p-4 border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined text-on-surface-variant">description</span>
                                <h3 className="m3-title-medium text-on-surface-variant font-bold">Testo Originale (Estratto)</h3>
                            </div>
                            <div className="flex-grow p-6 overflow-y-auto font-mono text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                                {originalText}
                            </div>
                        </div>
                        <div className="flex flex-col h-full min-h-0 bg-surface rounded-2xl border-2 border-primary/10 shadow-lg overflow-hidden relative">
                            {/* Paper texture overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

                            <div className="p-4 border-b border-primary/10 bg-surface/95 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                <h3 className="m3-title-medium font-black">Risultato Ristrutturato</h3>
                            </div>
                            <div className="flex-grow p-8 overflow-y-auto prose max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-on-surface prose-li:text-on-surface">
                                <div dangerouslySetInnerHTML={{ __html: refactoredHtml }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </M3Dialog>
    );
};

export default SmartImportModal;
