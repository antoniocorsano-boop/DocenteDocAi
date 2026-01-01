
import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { Uda, Competenza, TimetableSettings, Report, AiSettings } from '../types';
import { generateUdaPdf, blobToBase64Parts, generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { generateMarkdownReport } from '../services/aiService';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, M3DialogActions } from './M3Dialog';

interface UdaExportModalProps {
    uda: Uda;
    competenze: Competenza[];
    settings: TimetableSettings;
    onClose: () => void;
    onSaveReport: (report: Report) => void;
    aiSettings: AiSettings;
}

export const UdaExportModal: React.FC<UdaExportModalProps> = ({ uda, competenze, settings, onClose, onSaveReport, aiSettings }) => {
    const [docType, setDocType] = useState<'docente' | 'studente'>('docente');
    const [isExporting, setIsExporting] = useState(false);
    const [markdownReport, setMarkdownReport] = useState<string | null>(null);

    const handlePdfExport = async () => {
        setIsExporting(true);
        try {
            const pdfBlob = await generateUdaPdf(uda, competenze, settings, docType);
            const { data: base64Content, mimeType } = await blobToBase64Parts(pdfBlob);
            const fileName = docType === 'docente' 
                ? `Progettazione_UDA_${uda.title.replace(/ /g, '_')}.pdf` 
                : `Guida_Progetto_${uda.title.replace(/ /g, '_')}.pdf`;

            const newReport: Report = {
                id: `report-${Date.now()}`,
                nome: docType === 'docente' ? `Progettazione UDA: ${uda.title}` : `Guida Progetto: ${uda.title}`,
                dataCreazione: new Date().toISOString(),
                contesto: {
                    tipo: 'uda',
                    id: uda.id,
                    titolo: uda.title,
                },
                modelloUsato: {
                    nome: docType === 'docente' ? 'PDF Docente (Standard)' : 'PDF Studente (Standard)',
                    tipo: 'pdf',
                },
                file: {
                    name: fileName,
                    content: base64Content,
                    mimeType: mimeType,
                }
            };
            onSaveReport(newReport);

            viewPdfInNewTab(pdfBlob);
            onClose();
        } catch (error) {
            console.error("Failed to generate UDA PDF:", error);
            alert("Si è verificato un errore durante la generazione del PDF.");
        } finally {
            setIsExporting(false);
        }
    };
    
    const handleDocxExport = async () => {
        setIsExporting(true);
        try {
            // Build HTML content
            let html = `<h1>${uda.title}</h1>`;
            html += `<p><strong>Classe:</strong> ${uda.classe} | <strong>Materia:</strong> ${uda.materia}</p>`;
            html += `<p><strong>Docente:</strong> ${settings.nomeInsegnante}</p>`;
            html += `<h2>Introduzione</h2><p>${uda.introduction}</p>`;
            html += `<h2>Prodotto Finale</h2><p>${uda.finalProduct}</p>`;
            
            if (docType === 'docente') {
                 html += `<h2>Competenze Target</h2><ul>`;
                 uda.competencyIds.forEach(id => {
                     const c = competenze.find(comp => comp.id === id);
                     if (c) html += `<li>${c.nome} (${c.codice})</li>`;
                 });
                 html += `</ul>`;
            }
            
            html += `<h2>Fasi di Lavoro</h2>`;
            uda.phases.forEach((phase, index) => {
                html += `<h3>Fase ${index + 1}: ${phase.title} (${phase.duration})</h3>`;
                html += `<p><strong>Descrizione:</strong> ${phase.description}</p>`;
                html += `<p><strong>Attività:</strong> ${phase.activities}</p>`;
            });
            
            if (docType === 'docente') {
                html += `<h2>Valutazione</h2><p>${uda.evaluation}</p>`;
            }
            html += `<h2>Strumenti</h2><p>${uda.tools}</p>`;

            const blob = await generateHtmlDocxBlob(html, uda.title);
            const fileName = `Progettazione_UDA_${uda.title.replace(/ /g, '_')}.docx`;
            saveAs(blob, fileName);
            onClose();
            
        } catch (error) {
             console.error("Failed to generate DOCX:", error);
             alert("Errore durante la generazione del file Word.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleGenerateMarkdownReport = async () => {
        setIsExporting(true);
        try {
            const data = {
                ...uda,
                docente: settings.nomeInsegnante,
                istituto: settings.nomeIstituto,
                competenze: uda.competencyIds.map(id => competenze.find(c => c.id === id)?.nome).filter(Boolean)
            };
            const report = await generateMarkdownReport(aiSettings, 'uda', data);
            setMarkdownReport(report);
        } catch (error) {
            console.error("Failed to generate markdown report:", error);
            alert("Errore durante la generazione del report.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyToClipboard = () => {
        if (!markdownReport) return;
        navigator.clipboard.writeText(markdownReport).then(() => {
            alert('Report copiato negli appunti!');
            onClose();
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Impossibile copiare il testo.');
        });
    };

    if (markdownReport) {
        return (
             <div className="dialog-backdrop">
                <div className="dialog-container w-full max-w-2xl">
                    <div className="dialog-header">
                        <h2 className="m3-headline-medium">Report Generato</h2>
                                                <Tooltip label="Chiudi">
                                                    <button onClick={onClose} className="icon-button" aria-label="Chiudi"><span className="material-symbols-outlined">close</span></button>
                                                </Tooltip>
                    </div>
                    <div className="dialog-content">
                        <p className="m3-body-medium text-on-surface-variant mb-2">Copia questo testo e incollalo in Google Docs, Word o un altro editor di testo.</p>
                        <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant max-h-[60vh] overflow-y-auto">
                            <pre className="whitespace-pre-wrap m3-body-medium">{markdownReport}</pre>
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <button onClick={onClose} className="button button-text">Annulla</button>
                        <button onClick={handleCopyToClipboard} className="button button-filled">Copia negli Appunti</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <M3Dialog
            title="Esporta Progetto"
            headline={uda.title}
            onClose={onClose}
            maxWidth="md"
        >
            <div className="space-y-4">
                <div className="segmented-button-group">
                    <button onClick={() => setDocType('docente')} className={`segmented-button ${docType === 'docente' ? 'active' : ''}`}>Uso Docente</button>
                    <button onClick={() => setDocType('studente')} className={`segmented-button ${docType === 'studente' ? 'active' : ''}`}>Uso Studente</button>
                </div>
                <p className="m3-body-medium text-on-surface-variant">
                    {docType === 'docente'
                        ? "Genera un documento dettagliato per la programmazione, includendo competenze e metodi di valutazione."
                        : "Genera una guida al progetto semplificata per gli studenti, senza dettagli sulla valutazione."}
                </p>
            </div>

            <M3DialogActions>
                <button onClick={onClose} className="button button-text" disabled={isExporting}>Annulla</button>
                <button onClick={handleGenerateMarkdownReport} className="button button-tonal" disabled={isExporting}>Report Testuale</button>
                <button onClick={handleDocxExport} className="button button-outlined" disabled={isExporting}>
                    <span className="material-symbols-outlined mr-2">description</span>
                    Word (.docx)
                </button>
                <button onClick={handlePdfExport} className="button button-filled" disabled={isExporting}>
                    <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
                    {isExporting ? 'Esportazione...' : 'Esporta PDF'}
                </button>
            </M3DialogActions>
        </M3Dialog>
    );
};
