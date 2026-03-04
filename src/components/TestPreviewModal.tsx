// MD3 Compliant - Block J Migration Complete (2 violations eliminated)

import React, { useState } from 'react';
import type { jsPDF as JsPDFType } from 'jspdf';
import { GeneratedQuiz } from '../types';
import { generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, M3Button, M3Typography } from './ui';
interface TestPreviewModalProps {
    quiz: GeneratedQuiz;
    onClose: () => void;
}

const TestPreviewModal: React.FC<TestPreviewModalProps> = ({ quiz, onClose }) => {
  const [showAnswers, setShowAnswers] = useState(false);

    const handleExportDocx = async () => {
        let html = `<h1>Verifica: ${quiz.title}</h1>`;
        html += `<p><strong>Argomento:</strong> ${quiz.topic} | <strong>Livello:</strong> ${quiz.difficulty}</p>`;
        html += `<p><strong>Nome Studente:</strong> __________________________ <strong>Data:</strong> ____________</p><hr/>`;

        quiz.questions.forEach((q, i) => {
            html += `<p><strong>${i + 1}. ${q.text}</strong></p>`;
            if (q.type === 'multiple_choice' && q.options) {
                html += `<ul>`;
                q.options.forEach(opt => html += `<li>[ ] ${opt}</li>`);
                html += `</ul>`;
            } else if (q.type === 'true_false') {
                html += `<p>[ ] Vero  &nbsp;&nbsp; [ ] Falso</p>`;
            } else {
                html += `<p>___________________________________________________________________</p>`;
                html += `<p>___________________________________________________________________</p>`;
            }

            if (showAnswers) {
                html += `<p style="color: green; font-size: var(--md-sys-typescale-body-small-font-size);"><em>Risposta corretta: ${q.correctAnswer}</em></p>`;
            }
            html += `<br/>`;
        });

        const fileName = `Verifica_${quiz.topic.replace(/\s/g, '_')}_${showAnswers ? 'Docente' : 'Studente'}.docx`;
        const blob = await generateHtmlDocxBlob(html, quiz.title);
        saveAs(blob, fileName);
    };

    const handleExportPDF = async () => {
        // Lazy load jsPDF to avoid document access during module initialization
        const jsPdfModule = await import('jspdf');
        const jsPDF = jsPdfModule.jsPDF as typeof JsPDFType;
        
        const doc = new jsPDF();
        const margin = 20;
        let y = margin;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxLineWidth = pageWidth - margin * 2;

        doc.setFontSize(18).setFont('helvetica', 'bold').text(quiz.title, margin, y);
        y += 10;
        doc.setFontSize(11).setFont('helvetica', 'normal').text(`Argomento: ${quiz.topic}`, margin, y);
        y += 6;
        doc.text(`Nome: __________________________  Data: ____________`, margin, y);
        y += 10;
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        quiz.questions.forEach((q, i) => {
            // Check page break
            if (y > 250) { doc.addPage(); y = margin; }

            const questionTitle = `${i + 1}. ${q.text}`;
            const splitTitle = doc.splitTextToSize(questionTitle, maxLineWidth);
            doc.setFont('helvetica', 'bold').text(splitTitle, margin, y);
            y += (splitTitle.length * 5) + 2;

            if (q.type === 'multiple_choice' && q.options) {
                doc.setFont('helvetica', 'normal');
                q.options.forEach(opt => {
                    doc.text(`[ ] ${opt}`, margin + 5, y);
                    y += 6;
                });
            } else if (q.type === 'true_false') {
                doc.setFont('helvetica', 'normal').text(`[ ] Vero   [ ] Falso`, margin + 5, y);
                y += 8;
            } else {
                y += 5;
                doc.line(margin + 5, y, pageWidth - margin, y);
                y += 8;
                doc.line(margin + 5, y, pageWidth - margin, y);
                y += 8;
            }

            if (showAnswers) {
                doc.setTextColor(0, 150, 0).setFontSize(10).text(`Soluzione: ${q.correctAnswer}`, margin + 5, y);
                doc.setTextColor(0).setFontSize(11);
                y += 6;
            }
            y += 5;
        });

        const blob = doc.output('blob');
        viewPdfInNewTab(blob);
    };

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title="Anteprima Verifica"
            headline="Visualizza e stampa la verifica generata"
            buttons={
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 'var(--md-sys-percent-100)', alignItems: 'center', gap: 'var(--md-sys-spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-medium)', transition: 'color var(--md-sys-motion-duration-medium)' }}>
                            <div style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}>
                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface)' }}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={showAnswers}
                                onChange={e => setShowAnswers(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <span style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 'var(--md-sys-state-opacity-supporting)', transition: 'opacity var(--md-sys-motion-duration-medium)' }}>Soluzioni Docente</span>
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-4)' }}>
                        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                        <M3Button
                            onClick={handleExportDocx}
                            variant="tonal"
                            icon="description"
                        >
                            Word
                        </M3Button>
                        <M3Button
                            onClick={handleExportPDF}
                            variant="filled"
                            icon="picture_as_pdf"
                        >
                            PDF
                        </M3Button>
                    </div>
                </div>
            }
            mode="fullscreen"
        >
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: 'var(--md-sys-spacing-8)', overflowY: 'auto', height: 'var(--md-sys-percent-100)', opacity: 'var(--md-sys-state-opacity-tint-moderate)' }}>
                {/* Aura Ornaments */}
                <div style={{ width: 'var(--md-sys-percent-100)', height: 'var(--md-sys-percent-100)' }}>
                    <div style={{ backgroundColor: 'var(--md-sys-color-primary)', borderRadius: 'var(--md-sys-shape-corner-medium)', opacity: 0.05 }} />
                    <div style={{ backgroundColor: 'var(--md-sys-color-secondary)', borderRadius: 'var(--md-sys-shape-corner-medium)', opacity: 0.05, animationDelay: 'var(--md-sys-motion-duration-long)' }} />
                </div>

                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', marginTop: 0, marginLeft: 'var(--md-sys-margin-auto)', marginBottom: 0, marginRight: 'var(--md-sys-margin-auto)', backgroundColor: 'var(--md-sys-color-surface)', padding: 'var(--md-sys-spacing-8)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)', maxWidth: 'var(--md-sys-layout-workflow-card-min-width)' }}>
                    {/* Watermark for preview */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-bold)', whiteSpace: 'nowrap' }}>DOCENTEDOC AI</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h1 style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', marginBottom: 'var(--md-sys-spacing-6)', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1 }}>{quiz.title}</h1>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: 'var(--md-sys-percent-100)', fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>
                            <span>Argomento: <span style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{quiz.topic}</span></span>
                            <span>Data: ______________</span>
                        </div>
                        <div style={{ width: 'var(--md-sys-percent-100)', fontSize: 'var(--md-sys-typescale-title-large-font-size)', marginTop: 'var(--md-sys-spacing-4)', textAlign: 'left' }}>
                            <span>Nome e Cognome: __________________________________________________</span>
                        </div>
                    </div>

                    {/* Questions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', marginTop: 'var(--md-sys-spacing-12)' }}>
                        {quiz.questions.map((question, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)', borderRadius: 'var(--md-sys-shape-corner-medium)', padding: 'var(--md-sys-spacing-8)', backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-4)' }}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-bold)', minWidth: 'var(--md-sys-spacing-8)' }}>{index + 1}.</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)', width: 'var(--md-sys-percent-100)' }}>
                                        <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>
                                            {question.text}
                                        </M3Typography>
                                        {question.type === 'multiple-choice' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)', marginLeft: 'var(--md-sys-spacing-8)' }}>
                                                {question.options?.map((option, optionIndex) => (
                                                    <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', minWidth: 'var(--md-sys-spacing-6)' }}>
                                                            {String.fromCharCode(65 + optionIndex)}.
                                                        </span>
                                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                                            {option}
                                                        </M3Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {question.type === 'true-false' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)', marginLeft: 'var(--md-sys-spacing-8)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', minWidth: 'var(--md-sys-spacing-6)' }}>A.</span>
                                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>Vero</M3Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', minWidth: 'var(--md-sys-spacing-6)' }}>B.</span>
                                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>Falso</M3Typography>
                                                </div>
                                            </div>
                                        )}
                                        {question.type === 'open-ended' && (
                                            <div style={{ marginLeft: 'var(--md-sys-spacing-8)', marginTop: 'var(--md-sys-spacing-4)' }}>
                                                <div style={{ border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)', borderRadius: 'var(--md-sys-shape-corner-small)', padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface)', minHeight: 'var(--md-sys-spacing-16)' }}>
                                                    <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                        Risposta aperta...
                                                    </M3Typography>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)', textAlign: 'center', paddingTop: 'var(--md-sys-spacing-4)', marginTop: 'var(--md-sys-spacing-12)' }}>
                        <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Generato con DocenteDoc AI - Il tuo assistente didattico intelligente
                        </M3Typography>
                    </div>
                </div>
            </div>
        </M3Dialog>
    );
};

export default TestPreviewModal;

