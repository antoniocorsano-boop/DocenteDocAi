
import React, { useState } from 'react';
import type { jsPDF as JsPDFType } from 'jspdf';
import { GeneratedQuiz } from '../types';
import { generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog } from './M3Components';

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
                <div className="flex justify-between w-full items-center gap-4">
                    <div className="flex items-center gap-2 mr-auto">
                        <label className="flex items-center cursor-pointer gap-2 p-2 hover:bg-surface-container-high rounded-full transition-colors">
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${showAnswers ? 'bg-primary' : 'bg-surface-container-highest border border-outline'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-surface shadow-sm transition-transform ${showAnswers ? 'left-5' : 'left-1'}`}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={showAnswers}
                                onChange={e => setShowAnswers(e.target.checked)}
                                className="hidden"
                            />
                            <span className="m3-body-medium font-medium">Soluzioni Docente</span>
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="button button-text">Chiudi</button>
                        <button onClick={handleExportDocx} className="button button-outlined">
                            <span className="material-symbols-outlined mr-2">description</span>
                            Word
                        </button>
                        <button onClick={handleExportPDF} className="button button-filled">
                            <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
                            PDF
                        </button>
                    </div>
                </div>
            }
            fullscreen={true}
        >
            <div className="bg-surface-container-lowest p-8 overflow-y-auto h-full rounded-b-xl shadow-inner custom-scrollbar relative">
                {/* Paper effect background */}
                <div className="absolute inset-0 bg-surface-container-lowest opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00000010 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="document-preview-paper max-w-4xl mx-auto bg-surface shadow-md p-10 min-h-[80vh] relative z-10 border border-outline-variant/20">
                    <div className="flex flex-col items-center border-b-2 border-black pb-6 mb-8">
                        <h1 className="text-3xl font-black mb-4 font-serif text-center uppercase tracking-wider">{quiz.title}</h1>
                        <div className="flex justify-between w-full text-base font-serif italic">
                            <span>Argomento: {quiz.topic}</span>
                            <span>Data: ______________</span>
                        </div>
                        <div className="w-full text-base font-serif italic mt-2 text-left">
                            <span>Nome e Cognome: __________________________________________________</span>
                        </div>
                    </div>

                    <div className="space-y-8 font-serif">
                        {quiz.questions.map((q, i) => (
                            <div key={i} className="break-inside-avoid">
                                <p className="font-bold text-lg mb-3 flex gap-2">
                                    <span className="text-on-surface-variant">{i + 1}.</span> {q.text}
                                </p>
                                {q.type === 'multiple_choice' && (
                                    <ul className="pl-6 space-y-2">
                                        {q.options?.map((opt, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className="w-5 h-5 border-2 border-black rounded-sm mt-0.5 flex-shrink-0"></div>
                                                <span className="leading-snug">{opt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {q.type === 'true_false' && (
                                    <div className="flex gap-8 pl-6 mt-2 font-medium">
                                        <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-black rounded-sm"></div> Vero</div>
                                        <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-black rounded-sm"></div> Falso</div>
                                    </div>
                                )}
                                {q.type === 'open_ended' && (
                                    <div className="space-y-4 mt-4 pl-2 opacity-50">
                                        <div className="border-b border-black border-dashed h-8 w-full"></div>
                                        <div className="border-b border-black border-dashed h-8 w-full"></div>
                                        <div className="border-b border-black border-dashed h-8 w-full"></div>
                                    </div>
                                )}

                                {showAnswers && (
                                    <div className="mt-4 p-3 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-sans border-l-4 border-secondary flex gap-2 items-start animate-in fade-in slide-in-from-top-2">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <div>
                                            <strong className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">Soluzione Corretta</strong>
                                            {q.correctAnswer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </M3Dialog>
    );
};

export default TestPreviewModal;
