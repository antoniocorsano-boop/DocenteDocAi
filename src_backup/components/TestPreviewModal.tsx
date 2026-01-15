// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
import type { jsPDF as JsPDFType } from 'jspdf';
import { GeneratedQuiz } from '../types';
import { generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, M3Button } from './ui';
import { useTheme } from '../theme/theme';

interface TestPreviewModalProps {
    quiz: GeneratedQuiz;
    onClose: () => void;
}

const TestPreviewModal: React.FC<TestPreviewModalProps> = ({ quiz, onClose }) => {
  const { layers } = useTheme();
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
                html += `<p style="color: green; font-size: 0.9em;"><em>Risposta corretta: ${q.correctAnswer}</em></p>`;
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
                <div  style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", alignItems: "center", gap: layers.ref.spacing['8']}}>
                    <div  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                        <label style={{ borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", cursor: "pointer", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['8'], transition: "color 300ms"}}>
                            <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${showAnswers ? 'bg-primary' : 'bg-[var(--md-sys-color-surface-container-high)]est border border-[var(--md-sys-color-outline-variant)]'}`}>
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-surface shadow-[var(--md-sys-elevation-level2)] transition-all duration-300 ${showAnswers ? 'left-6' : 'left-1'}`}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={showAnswers}
                                onChange={e => setShowAnswers(e.target.checked)}
                                style={{ display: "none" }}
                            />
                            <span  style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7", transition: "opacity 300ms" }}>Soluzioni Docente</span>
                        </label>
                    </div>
                    <div style={{display: "flex", gap: layers.ref.spacing['6']}}>
                        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                        <M3Button 
                            onClick={handleExportDocx} 
                            variant="secondary"
                            icon="description"
                        >
                            Word
                        </M3Button>
                        <M3Button 
                            onClick={handleExportPDF} 
                            variant="primary"
                            icon="picture_as_pdf"
                        >
                            PDF
                        </M3Button>
                    </div>
                </div>
            }
            fullscreen={true}
        >
            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30 }} style={{padding: layers.ref.spacing['8'], overflowY: "auto", height: "100%"}}>
                {/* Aura Ornaments */}
                <div  style={{ width: "100%", height: "100%" }}>
                    <div style={{ backgroundColor: sys.colors.primary/5 }} style={{ borderRadius: ref.spacing[9999] }} />
                    <div style={{ backgroundColor: sys.colors.secondary/5 }} style={{ borderRadius: ref.spacing[9999], animationDelay: '2s' }} />
                </div>

                <div style={{ borderRadius: ref.shape[] }} style={{marginLeft: "auto", marginRight: "auto", backgroundColor: "white", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                    {/* Watermark for preview */}
                    <div  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: sys.colors.[120px] }} style={{ fontWeight: "900", whiteSpace: "nowrap" }}>DOCENTEDOC AI</span>
                    </div>

                    <div  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 style={{ color: sys.colors.4xl }} style={{fontWeight: "900", marginBottom: layers.ref.spacing['6'], textAlign: "center", textTransform: "uppercase", lineHeight: "1"}}>{quiz.title}</h1>
                        <div  style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "1.125rem" }}>
                            <span>Argomento: <span  style={{ fontWeight: "bold" }}>{quiz.topic}</span></span>
                            <span>Data: ______________</span>
                        </div>
                        <div  style={{width: "100%", fontSize: "1.125rem", marginTop: layers.ref.spacing['4'], textAlign: "left"}}>
                            <span>Nome e Cognome: __________________________________________________</span>
                        </div>
                    </div>

                    <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>
                        {quiz.questions.map((q, i) => (
                            <div key={i} >
                                <p style={{fontWeight: "bold", fontSize: "1.25rem", marginBottom: layers.ref.spacing['8'], display: "flex", gap: layers.ref.spacing['6']}}>
                                    <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ opacity: "0.4" }}>{i + 1}.</span> 
                                    <span style={{ flex: "1" }}>{q.text}</span>
                                </p>
                                {q.type === 'multiple_choice' && (
                                    <ul  style={{gap: layers.ref.spacing['3']}}>
                                        {q.options?.map((opt, j) => (
                                            <li key={j} style={{display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['8']}}>
                                                <div  style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem", flexShrink: "0" }}></div>
                                                <span style={{ fontSize: "1.125rem", lineHeight: "1.375" }}>{opt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {q.type === 'true_false' && (
                                    <div  style={{display: "flex", marginTop: layers.ref.spacing['4'], fontWeight: "500", fontSize: "1.125rem"}}>
                                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}><div  style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem" }}></div> Vero</div>
                                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}><div  style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem" }}></div> Falso</div>
                                    </div>
                                )}
                                {q.type === 'open_ended' && (
                                    <div  style={{gap: layers.ref.spacing['6'], marginTop: layers.ref.spacing['6'], opacity: "0.3"}}>
                                        <div  style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div  style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div  style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div  style={{ height: "2.5rem", width: "100%" }}></div>
                                    </div>
                                )}

                                {showAnswers && (
                                    <div style={{ backgroundColor: sys.colors.secondary-container/50, color: sys.colors.on-secondary-container, borderRadius: ref.shape[] }} style={{marginTop: layers.ref.spacing['6'], padding: layers.ref.spacing['5'], fontSize: ref.spacing[16], borderColor: "layers.sys.colors.secondary", display: "flex", gap: layers.ref.spacing['8'], alignItems: "flex-start"}}>
                                        <span  style={{fontSize: "1.5rem", color: "layers.sys.colors.secondary"}}>verified</span>
                                        <div>
                                            <strong  style={{display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "900", opacity: "0.6", marginBottom: layers.ref.spacing['4']}}>Soluzione Docente</strong>
                                            <span style={{ fontWeight: "500" }}>{q.correctAnswer}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div  style={{borderTop: "1px solid layers.sys.colors.outline", textAlign: "center", fontSize: "0.875rem", opacity: "0.4"}}>
                        Generato con DocenteDoc AI - Il tuo assistente didattico intelligente
                    </div>
                </div>
            </div>
        </M3Dialog>
    );
};

export default TestPreviewModal;



