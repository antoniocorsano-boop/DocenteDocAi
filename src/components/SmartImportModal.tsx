import React, { useState, useCallback } from 'react';

const PAPER_TEXTURE_BG = 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")';
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
    M3Button,
    M3Typography
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
            <M3DialogContent style={{height: 'var(--app-layout-full)', display: "flex", flexDirection: "column", padding: 'var(--md-sys-spacing-8)'}}>
                {step === 'upload' && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 'var(--app-layout-full)' }}>
                        <div
                            {...getRootProps()}
                            style={{
                                width: 'var(--app-layout-full)',
                                maxWidth: 'calc(var(--md-sys-spacing-20) * 7.2)',
                                height: 'calc(var(--md-sys-spacing-20) * 4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `var(--app-border-thick) dashed ${isDragActive ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                backgroundColor: isDragActive ? 'var(--app-color-primary-container)' : 'var(--md-sys-color-surface-container-low)',
                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
                                cursor: 'pointer',
                                transform: isDragActive ? 'scale(1.05)' : 'none'
                            }}
                            data-active={isDragActive}
                        >
                            <input {...getInputProps()} />
                            <div style={{
                                width: 'var(--md-sys-spacing-20)',
                                height: 'var(--md-sys-spacing-20)',
                                borderRadius: 'var(--app-layout-half)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--app-spacing-section)',
                                boxShadow: 'var(--md-sys-elevation-level1)',
                                backgroundColor: isDragActive ? 'var(--app-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                                color: isDragActive ? 'var(--app-color-on-primary)' : 'var(--app-color-primary)'
                            }}>
                                <span style={{ fontFamily: 'Material Symbols Outlined' }}>transform</span>
                            </div>
                            <M3Typography variant="headline-medium" style={{ textAlign: 'center' }}>Carica la vecchia Programmazione</M3Typography>
                            <div style={{marginTop: 'var(--app-spacing-container)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--md-sys-spacing-8)'}}>
                                <span style={{
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    borderRadius: 'var(--app-spacing-container)',
                                    fontSize: 'var(--app-spacing-element)',
                                    border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)'
                                }}>.PDF</span>
                                <span style={{
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    borderRadius: 'var(--app-spacing-container)',
                                    fontSize: 'var(--app-spacing-element)',
                                    border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)'
                                }}>.DOCX</span>
                                <span style={{
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    borderRadius: 'var(--app-spacing-container)',
                                    fontSize: 'var(--app-spacing-element)',
                                    border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)'
                                }}>.TXT</span>
                            </div>
                            <M3Typography variant="body-medium" style={{
                                marginTop: 'var(--app-spacing-section)',
                                textAlign: 'center',
                                opacity: 0.8,
                                color: 'var(--md-sys-color-on-surface-variant)'
                            }}>
                                Trascina qui il file o clicca per selezionare.
                            </M3Typography>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'var(--app-layout-full)', gap: 'var(--md-sys-spacing-8)'}}>
                        <div >
                            <div  style={{borderRadius: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', width: 'var(--app-spacing-container)', borderBottom: 'var(--md-sys-spacing-1) solid var(--md-sys-color-outline)', borderColor: 'var(--app-color-primary)'}}></div>
                            <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{color: 'var(--app-color-primary)', fontFamily: 'Material Symbols Outlined'}}>auto_awesome</span>
                            </div>
                        </div>
                        <div style={{textAlign: 'center', gap: 'var(--app-spacing-component)'}}>
                            <M3Typography variant="body-large" style={{color: 'var(--app-color-primary)'}}>{processingStatus}</M3Typography>
                            <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)'}}>L'Intelligenza Artificiale sta riorganizzando il contenuto...</M3Typography>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div  style={{display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--app-spacing-section)', height: 'var(--app-layout-full)', minHeight: '0'}}>
                        <div style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'var(--app-layout-full)',
                            minHeight: '0',
                            border: 'var(--app-border-normal) solid var(--md-sys-color-outline)'
                        }}>
                            <div style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                padding: 'var(--md-sys-spacing-8)',
                                borderBottom: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-8)'
                            }}>
                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Material Symbols Outlined' }}>description</span>
                                <M3Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Testo Originale (Estratto)</M3Typography>
                            </div>
                            <div style={{
                                color: 'var(--md-sys-color-on-surface-variant)',
                                flexGrow: '1',
                                padding: 'var(--app-spacing-section)',
                                overflowY: 'auto',
                                fontSize: 'var(--app-spacing-element)',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.625'
                            }}>
                                {originalText}
                            </div>
                        </div>
                        <div style={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'var(--app-layout-full)',
                            minHeight: '0',
                            backgroundColor: 'var(--app-color-surface)'
                        }}>
                            {/* Paper texture overlay */}
                            <div style={{ backgroundImage: PAPER_TEXTURE_BG }}></div>

                            <div style={{
                                backgroundColor: 'var(--app-color-surface)',
                                padding: 'var(--md-sys-spacing-8)',
                                borderBottom: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-8)',
                                color: 'var(--app-color-primary)'
                            }}>
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>auto_awesome</span>
                                <h3  style={{ fontWeight: "900" }}>Risultato Ristrutturato</h3>
                            </div>
                            <div  style={{flexGrow: "1", padding: 'var(--md-sys-spacing-8)', overflowY: "auto"}}>
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








