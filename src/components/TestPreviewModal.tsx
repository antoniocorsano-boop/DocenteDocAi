
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
                <div className="flex flex-col md:flex-row justify-between w-full items-center gap-8">
                    <div className="flex items-center gap-6 mr-auto">
                        <label className="flex items-center cursor-pointer gap-6 p-8 hover:bg-surface-container-high/50 rounded-2xl transition-colors group">
                            <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${showAnswers ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant'}`}>
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-surface shadow-lg transition-all duration-300 ${showAnswers ? 'left-6' : 'left-1'}`}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={showAnswers}
                                onChange={e => setShowAnswers(e.target.checked)}
                                className="hidden"
                            />
                            <span className="m3-label-large font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Soluzioni Docente</span>
                        </label>
                    </div>
                    <div className="flex gap-6">
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
            <div className="bg-surface-container-low/30 backdrop-blur-xl p-8 md:p-12 overflow-y-auto h-full custom-scrollbar relative animate-in fade-in duration-500">
                {/* Aura Ornaments */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="document-preview-paper max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-16 min-h-[100vh] relative z-10 border border-outline-variant/10 rounded-s">
                    {/* Watermark for preview */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
                        <span className="text-[120px] font-black rotate-[-45deg] whitespace-nowrap">DOCENTEDOC AI</span>
                    </div>

                    <div className="flex flex-col items-center border-b-2 border-black pb-8 mb-10 relative">
                        <h1 className="text-4xl font-black mb-6 font-serif text-center uppercase tracking-tighter leading-none">{quiz.title}</h1>
                        <div className="flex justify-between w-full text-lg font-serif italic">
                            <span>Argomento: <span className="font-bold not-italic">{quiz.topic}</span></span>
                            <span>Data: ______________</span>
                        </div>
                        <div className="w-full text-lg font-serif italic mt-4 text-left">
                            <span>Nome e Cognome: __________________________________________________</span>
                        </div>
                    </div>

                    <div className="space-y-10 font-serif text-on-surface">
                        {quiz.questions.map((q, i) => (
                            <div key={i} className="break-inside-avoid relative group">
                                <p className="font-bold text-xl mb-8 flex gap-6">
                                    <span className="text-on-surface-variant opacity-40">{i + 1}.</span> 
                                    <span className="flex-1">{q.text}</span>
                                </p>
                                {q.type === 'multiple_choice' && (
                                    <ul className="pl-8 space-y-3">
                                        {q.options?.map((opt, j) => (
                                            <li key={j} className="flex items-start gap-8">
                                                <div className="w-6 h-6 border-2 border-black rounded-sm mt-0.5 flex-shrink-0"></div>
                                                <span className="text-lg leading-snug">{opt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {q.type === 'true_false' && (
                                    <div className="flex gap-12 pl-8 mt-4 font-medium text-lg">
                                        <div className="flex items-center gap-6"><div className="w-6 h-6 border-2 border-black rounded-sm"></div> Vero</div>
                                        <div className="flex items-center gap-6"><div className="w-6 h-6 border-2 border-black rounded-sm"></div> Falso</div>
                                    </div>
                                )}
                                {q.type === 'open_ended' && (
                                    <div className="space-y-6 mt-6 pl-4 opacity-30">
                                        <div className="border-b-2 border-black border-dotted h-10 w-full"></div>
                                        <div className="border-b-2 border-black border-dotted h-10 w-full"></div>
                                        <div className="border-b-2 border-black border-dotted h-10 w-full"></div>
                                        <div className="border-b-2 border-black border-dotted h-10 w-full"></div>
                                    </div>
                                )}

                                {showAnswers && (
                                    <div className="mt-6 p-5 bg-secondary-container/50 backdrop-blur-sm text-on-secondary-container rounded-2xl text-base font-sans border-l-8 border-secondary flex gap-8 items-start animate-in zoom-in-95 duration-300 shadow-lg">
                                        <span className="material-symbols-outlined text-2xl text-secondary">verified</span>
                                        <div>
                                            <strong className="block text-xs uppercase tracking-[0.2em] font-black opacity-60 mb-4">Soluzione Docente</strong>
                                            <span className="font-medium">{q.correctAnswer}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 pt-8 border-t border-black/10 text-center text-sm font-serif italic opacity-40">
                        Generato con DocenteDoc AI - Il tuo assistente didattico intelligente
                    </div>
                </div>
            </div>
        </M3Dialog>
    );
};

export default TestPreviewModal;
