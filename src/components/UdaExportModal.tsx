
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
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>
                    <div className="bg-primary-container/10 rounded-[var(--md-sys-shape-corner-large)] border-primary/20" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
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

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
                        <button 
                            onClick={handlePdfExport}
                            disabled={isExporting}
                            className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-primary-container/20 border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid var(--md-sys-color-outline)" }}
                        >
                            <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-primary-container group-hover:scale-110 shadow-sm" style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>picture_as_pdf</span>
                            </div>
                            <div>
                                <p className="m3-label-large" style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Esporta in PDF</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Ideale per stampa e archiviazione</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleDocxExport}
                            disabled={isExporting}
                            className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-secondary-container/20 border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid var(--md-sys-color-outline)" }}
                        >
                            <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-secondary-container group-hover:scale-110 shadow-sm" style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>description</span>
                            </div>
                            <div>
                                <p className="m3-label-large" style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Esporta in Word</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Per modifiche manuali successive</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleAiReport}
                            disabled={isExporting}
                            className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-tertiary-container/20 border-[var(--md-sys-color-outline-variant)]/30 group disabled:opacity-50" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid var(--md-sys-color-outline)" }}
                        >
                            <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-tertiary-container group-hover:scale-110 shadow-sm" style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-tertiary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>auto_awesome</span>
                            </div>
                            <div>
                                <p className="m3-label-large" style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Report con AI</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Genera analisi e suggerimenti didattici</p>
                            </div>
                        </button>
                    </div>

                    {isExporting && (
                        <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-large)] animate-pulse" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-8)" }}>
                            <span className="material-symbols-outlined animate-spin">sync</span>
                            <span className="m3-label-large">Generazione in corso...</span>
                        </div>
                    )}

                    {markdownReport && (
                        <div className="bg-[var(--md-sys-color-surface-container-low)]est rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30" style={{ marginTop: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <h4 className="m3-label-large" style={{ marginBottom: "var(--md-sys-spacing-8)", color: "var(--md-sys-color-tertiary)" }}>Report AI Generato</h4>
                            <div className="prose prose-sm max-h-60" style={{ overflowY: "auto" }}>
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


