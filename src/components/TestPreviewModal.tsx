
import React, { useState } from 'react';
import type { jsPDF as JsPDFType } from 'jspdf';
import { GeneratedQuiz } from '../types';
import { generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, M3Button } from './ui';

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
                <div className="md:flex-row" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                    <div className="mr-auto" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                        <label className="hover:bg-[var(--md-sys-color-surface-container-high)]/50 rounded-[var(--md-sys-shape-corner-large)] group" style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-8)", transition: "color 300ms" }}>
                            <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${showAnswers ? 'bg-primary' : 'bg-[var(--md-sys-color-surface-container-high)]est border border-[var(--md-sys-color-outline-variant)]'}`}>
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-surface shadow-[var(--md-sys-elevation-level2)] transition-all duration-300 ${showAnswers ? 'left-6' : 'left-1'}`}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={showAnswers}
                                onChange={e => setShowAnswers(e.target.checked)}
                                style={{ display: "none" }}
                            />
                            <span className="m3-label-large group-hover:opacity-100" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7", transition: "opacity 300ms" }}>Soluzioni Docente</span>
                        </label>
                    </div>
                    <div style={{ display: "flex", gap: "var(--md-sys-spacing-6)" }}>
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
            <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl md:p-12 custom-scrollbar relative animate-in fade-in duration-500" style={{ padding: "var(--md-sys-spacing-8)", overflowY: "auto", height: "100%" }}>
                {/* Aura Ornaments */}
                <div className="absolute top-0 left-0 overflow-hidden pointer-events-none" style={{ width: "100%", height: "100%" }}>
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} style={{ animationDelay: '2s' }} />
                </div>

                <div className="document-preview-paper max-w-4xl shadow-[var(--md-sys-elevation-level4)] md:p-16 min-h-[100vh] relative z-10 border-[var(--md-sys-color-outline-variant)]/10 rounded-s" style={{ marginLeft: "auto", marginRight: "auto", backgroundColor: "white", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
                    {/* Watermark for preview */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="text-[120px] rotate-[-45deg]" style={{ fontWeight: "900", whiteSpace: "nowrap" }}>DOCENTEDOC AI</span>
                    </div>

                    <div className="border-b-2 border-black pb-8 mb-10 relative" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 className="text-4xl font-serif tracking-tighter" style={{ fontWeight: "900", marginBottom: "var(--md-sys-spacing-6)", textAlign: "center", textTransform: "uppercase", lineHeight: "1" }}>{quiz.title}</h1>
                        <div className="font-serif italic" style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "1.125rem" }}>
                            <span>Argomento: <span className="not-italic" style={{ fontWeight: "bold" }}>{quiz.topic}</span></span>
                            <span>Data: ______________</span>
                        </div>
                        <div className="font-serif italic" style={{ width: "100%", fontSize: "1.125rem", marginTop: "var(--md-sys-spacing-4)", textAlign: "left" }}>
                            <span>Nome e Cognome: __________________________________________________</span>
                        </div>
                    </div>

                    <div className="space-y-10 font-serif text-[var(--md-sys-color-on-surface)]">
                        {quiz.questions.map((q, i) => (
                            <div key={i} className="break-inside-avoid relative group">
                                <p style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "var(--md-sys-spacing-8)", display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                                    <span className="text-[var(--md-sys-color-on-surface)]-variant" style={{ opacity: "0.4" }}>{i + 1}.</span> 
                                    <span style={{ flex: "1" }}>{q.text}</span>
                                </p>
                                {q.type === 'multiple_choice' && (
                                    <ul className="pl-8" style={{ gap: "var(--md-sys-spacing-3)" }}>
                                        {q.options?.map((opt, j) => (
                                            <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-8)" }}>
                                                <div className="border-2 border-black mt-0.5" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem", flexShrink: "0" }}></div>
                                                <span style={{ fontSize: "1.125rem", lineHeight: "1.375" }}>{opt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {q.type === 'true_false' && (
                                    <div className="gap-12 pl-8" style={{ display: "flex", marginTop: "var(--md-sys-spacing-4)", fontWeight: "500", fontSize: "1.125rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}><div className="border-2 border-black" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem" }}></div> Vero</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}><div className="border-2 border-black" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.125rem" }}></div> Falso</div>
                                    </div>
                                )}
                                {q.type === 'open_ended' && (
                                    <div className="pl-4" style={{ gap: "var(--md-sys-spacing-6)", marginTop: "var(--md-sys-spacing-6)", opacity: "0.3" }}>
                                        <div className="border-b-2 border-black border-dotted" style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div className="border-b-2 border-black border-dotted" style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div className="border-b-2 border-black border-dotted" style={{ height: "2.5rem", width: "100%" }}></div>
                                        <div className="border-b-2 border-black border-dotted" style={{ height: "2.5rem", width: "100%" }}></div>
                                    </div>
                                )}

                                {showAnswers && (
                                    <div className="bg-secondary-container/50 backdrop-blur-sm text-on-secondary-container rounded-[var(--md-sys-shape-corner-large)] font-sans border-l-8 animate-in zoom-in-95 duration-300 shadow-[var(--md-sys-elevation-level2)]" style={{ marginTop: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-5)", fontSize: "1rem", borderColor: "var(--md-sys-color-secondary)", display: "flex", gap: "var(--md-sys-spacing-8)", alignItems: "flex-start" }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: "1.5rem", color: "var(--md-sys-color-secondary)" }}>verified</span>
                                        <div>
                                            <strong className="tracking-[0.2em]" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "900", opacity: "0.6", marginBottom: "var(--md-sys-spacing-4)" }}>Soluzione Docente</strong>
                                            <span style={{ fontWeight: "500" }}>{q.correctAnswer}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 pt-8 border-black/10 font-serif italic" style={{ borderTop: "1px solid var(--md-sys-color-outline)", textAlign: "center", fontSize: "0.875rem", opacity: "0.4" }}>
                        Generato con DocenteDoc AI - Il tuo assistente didattico intelligente
                    </div>
                </div>
            </div>
        </M3Dialog>
    );
};

export default TestPreviewModal;


