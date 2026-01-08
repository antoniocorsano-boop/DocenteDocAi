
import React, { useState } from 'react';
import { Uda, Competenza, TimetableSettings, Report, AiSettings } from '../types';
import { generateUdaPdf, blobToBase64Parts, generateHtmlDocxBlob, viewPdfInNewTab, saveAs } from '../utils/documentUtils';
import { generateMarkdownReport } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField } from './ui';

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
            console.error("Failed to generate UDA DOCX:", error);
            alert("Si è verificato un errore durante la generazione del file Word.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleAiReport = async () => {
        setIsExporting(true);
        try {
            const prompt = `Genera un report dettagliato per l'UDA "${uda.title}". 
            Contesto: ${uda.introduction}. 
            Fasi: ${uda.phases.map(p => p.title).join(', ')}.
            Tipo documento: ${docType === 'docente' ? 'Progettazione tecnica per docenti' : 'Guida semplificata per studenti'}.`;
            
            const report = await generateMarkdownReport(prompt, aiSettings);
            setMarkdownReport(report);
        } catch (error) {
            console.error("AI Report generation failed:", error);
            alert("L'assistente AI non è riuscito a generare il report.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Esporta UDA"
            maxWidth="sm"
            level={1}
        >
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div className="flex flex-col gap-6 py-4">
                    <div className="p-8 bg-primary-container/10 rounded-[var(--md-sys-shape-corner-large)] border border-primary/20">
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]">
                            Stai esportando: <strong>{uda.title}</strong>
                        </p>
                    </div>

                    <SelectField
                        label="Tipo di Documento"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as 'docente' | 'studente')}
                        options={[
                            { value: 'docente', label: 'Progettazione per Docente (Completa)' },
                            { value: 'studente', label: 'Guida per Studente (Semplificata)' }
                        ]}
                        fullWidth
                    />

                    <div className="grid grid-cols-1 gap-6">
                        <button 
                            onClick={handlePdfExport}
                            disabled={isExporting}
                            className="flex items-center gap-8 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-primary-container/20 transition-all text-left border border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50"
                        >
                            <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                            </div>
                            <div>
                                <p className="m3-label-large font-bold text-lg">Esporta in PDF</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Ideale per stampa e archiviazione</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleDocxExport}
                            disabled={isExporting}
                            className="flex items-center gap-8 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-secondary-container/20 transition-all text-left border border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50"
                        >
                            <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-2xl">description</span>
                            </div>
                            <div>
                                <p className="m3-label-large font-bold text-lg">Esporta in Word</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Per modifiche manuali successive</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleAiReport}
                            disabled={isExporting}
                            className="flex items-center gap-8 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-tertiary-container/20 transition-all text-left border border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50"
                        >
                            <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            </div>
                            <div>
                                <p className="m3-label-large font-bold text-lg">Report con AI</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Genera analisi e suggerimenti didattici</p>
                            </div>
                        </button>
                    </div>

                    {isExporting && (
                        <div className="flex items-center justify-center gap-6 p-8 bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-large)] animate-pulse">
                            <span className="material-symbols-outlined animate-spin">sync</span>
                            <span className="m3-label-large">Generazione in corso...</span>
                        </div>
                    )}

                    {markdownReport && (
                        <div className="mt-4 p-8 bg-[var(--md-sys-color-surface-container-low)]est rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30">
                            <h4 className="m3-label-large mb-8 text-tertiary">Report AI Generato</h4>
                            <div className="prose prose-sm max-h-60 overflow-y-auto">
                                {markdownReport}
                            </div>
                        </div>
                    )}
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UdaExportModal;
