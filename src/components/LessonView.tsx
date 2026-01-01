
import React, { useState } from 'react';
import { Lezione, MaterialeDidattico, KnowledgeBaseEntry, AiSettings, LessonAnalysisResult, TimetableSettings } from '../types';
import { generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generateHomeworkPdf } from '../utils/documentUtils';
import { analyzeLessonPedagogy } from '../services/aiService';
import { saveAs } from '../utils/documentUtils';
import MaterialPickerModal from './MaterialPickerModal';
import LessonAnalysisModal from './LessonAnalysisModal';
import AiThinkingGem from './AiThinkingGem';
import { sanitizeHTML } from '../utils/securityUtils';
import { LESSON_TYPE_ICONS } from '../constants';
import { generateHueFromString } from '../utils/colorUtils';
import { M3Dialog } from './M3Dialog';

interface LessonViewProps {
  lesson: Lezione;
  onClose: () => void;
  onStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
  onUpdateLesson: (lesson: Lezione) => void; 
  knowledgeBase: KnowledgeBaseEntry[];
  aiSettings?: AiSettings;
  settings?: TimetableSettings; // New prop for context
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onClose, onStartClassroom, onUpdateLesson, knowledgeBase, aiSettings, settings }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [previewingMaterial, setPreviewingMaterial] = useState<KnowledgeBaseEntry | null>(null);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LessonAnalysisResult | null>(null);

  // --- Handlers (Existing logic preserved) ---
  const handleExport = async () => {
    setIsExporting(true);
    try {
        const pdfBlob = await generateLessonPdf(lesson);
        viewPdfInNewTab(pdfBlob);
    } catch (error) {
        console.error("Failed to generate lesson PDF:", error);
        alert("Si è verificato un errore durante la generazione del PDF.");
    } finally {
        setIsExporting(false);
    }
  };

  const handleExportHomework = async () => {
    if (!settings) {
        alert("Impostazioni mancanti. Impossibile generare la scheda compiti.");
        return;
    }
    setIsExporting(true);
    try {
        const pdfBlob = await generateHomeworkPdf(lesson, settings);
        viewPdfInNewTab(pdfBlob);
    } catch (error) {
        console.error("Failed to generate homework PDF:", error);
        alert("Si è verificato un errore durante la generazione della scheda compiti.");
    } finally {
        setIsExporting(false);
    }
  };
  
  const handleExportDocx = async () => {
      const safeContent = sanitizeHTML(lesson.contenuto);
      const safeObjectives = sanitizeHTML(lesson.obiettivi || '');
      const safeContext = sanitizeHTML(lesson.contesto || '');
      const safeHomework = sanitizeHTML(lesson.compiti || '');
      const safeAdaptations = sanitizeHTML(lesson.adattamenti || '');

      let html = `<h1>Lezione: ${safeContent}</h1>`;
      html += `<p><strong>Classe:</strong> ${lesson.classe} | <strong>Materia:</strong> ${lesson.materia}</p>`;
      if (lesson.unitaDiApprendimento) html += `<p><strong>UDA:</strong> ${lesson.unitaDiApprendimento}</p>`;
      
      html += `<h2>Obiettivi</h2><p>${safeObjectives || 'Nessun obiettivo specificato.'}</p>`;
      html += `<h2>Contenuti e Attività</h2><p>${safeContext || ''}</p>`;
      html += `<h2>Compiti</h2><p>${safeHomework || 'Nessun compito assegnato.'}</p>`;
      
      if (lesson.adattamenti) {
          html += `<h2>Adattamenti (Inclusività)</h2><p>${safeAdaptations}</p>`;
      }

      const blob = await generateHtmlDocxBlob(html, lesson.contenuto);
      saveAs(blob, `Lezione_${lesson.contenuto.replace(/ /g, '_')}.docx`);
  };
  
  const handleDownloadMaterial = (material: MaterialeDidattico) => {
    if (material.type !== 'file' || !material.file?.content) return; // Aggiunto optional chaining per file
    try {
        const byteCharacters = atob(material.file.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: material.file.mimeType });
        saveAs(blob, material.file.name);
    } catch (e) {
        console.error("Failed to download local file material", e);
        alert("Errore durante il download del file.");
    }
  };

  const handlePreviewKbMaterial = (material: MaterialeDidattico) => {
    if (material.type !== 'kb') return;
    const kbEntry = knowledgeBase.find(kb => kb.id === material.kbId);
    if (kbEntry) {
        setPreviewingMaterial(kbEntry);
    } else {
        alert("Materiale non trovato nella Knowledge Base.");
    }
  };
  
  const handleAddMaterials = (newMaterials: MaterialeDidattico[]) => {
      const updatedLesson = {
          ...lesson,
          materialiDidattici: [...(lesson.materialiDidattici || []), ...newMaterials]
      };
      onUpdateLesson(updatedLesson);
      setIsMaterialPickerOpen(false);
  };
  
  const handleRemoveMaterial = (materialId: string) => {
      if(!window.confirm("Sei sicuro di voler rimuovere questo allegato?")) return;
      const updatedLesson = {
          ...lesson,
          materialiDidattici: (lesson.materialiDidattici || []).filter(m => m.id !== materialId)
      };
      onUpdateLesson(updatedLesson);
  };
  
  const handleAnalyzePedagogy = async () => {
      if (!aiSettings) {
          alert("Configurazione AI mancante.");
          return;
      }
      setIsAnalyzing(true);
      try {
          const result = await analyzeLessonPedagogy(aiSettings, {
              title: lesson.contenuto,
              subject: lesson.materia,
              className: lesson.classe,
              description: `${lesson.obiettivi || ''} ${lesson.contesto || ''}`
          });
          setAnalysisResult(result);
      } catch (error: unknown) {
          let message = 'Errore sconosciuto';
          if (error instanceof Error) message = error.message;
          alert(message);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const getMaterialIcon = (material: MaterialeDidattico): string => {
    switch (material.type) {
        case 'kb': return 'cloud_done';
        case 'link': return 'link';
        case 'file': return 'attach_file';
    }
    return 'insert_drive_file'; // Default icon
  };

  // --- VISUAL HELPERS ---
  const hue = generateHueFromString(lesson.materia || 'default');
  const typeIcon = LESSON_TYPE_ICONS[lesson.tipoLezione || 'Teoria'] || 'school';

  return (
    <>
      <div className="dialog-backdrop !p-0 md:!p-4 bg-black/60">
        {/* RESPONSIVE CONTAINER: Full screen on mobile, Rounded card on desktop */}
        <div className="dialog-container w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-2xl rounded-none flex flex-col bg-surface-container-low animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* HEADER: Compact & Sticky */}
          <div className="dialog-header bg-surface border-b border-outline-variant flex-shrink-0 z-20 px-4 py-3">
              <div className="flex items-center gap-3 flex-grow min-w-0">
                   <button onClick={onClose} className="icon-button -ml-2 md:hidden">
                      <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `hsl(${hue}, 80%, 90%)`, color: `hsl(${hue}, 60%, 30%)` }}>
                      <span className="material-symbols-outlined">{typeIcon}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="m3-title-medium font-bold leading-tight truncate pr-2">Piano Lezione</h2>
                    <p className="m3-label-small text-on-surface-variant font-mono uppercase tracking-wide opacity-80">{lesson.id.split('-').slice(0,2).join('-')}</p>
                  </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={handleExportDocx} disabled={isExporting} className="icon-button hidden sm:flex" title="Esporta Word">
                      <span className="material-symbols-outlined text-secondary">description</span>
                  </button>
                  <button onClick={handleExport} disabled={isExporting} className="icon-button hidden sm:flex" title="Esporta PDF">
                      <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                  </button>
                   {/* Desktop Close Button */}
                  <button onClick={onClose} className="icon-button bg-surface-container-high hover:bg-surface-container-highest hidden md:flex">
                      <span className="material-symbols-outlined">close</span>
                  </button>
              </div>
          </div>
          
          <div className="dialog-content !p-0 flex-grow overflow-y-auto">
              
              {/* HERO SECTION */}
              <div className="p-4 md:p-6 bg-surface-container border-b border-outline-variant">
                   {lesson.unitaDiApprendimento && (
                       <div className="flex items-center gap-2 mb-2">
                           <span className="m3-label-small font-bold uppercase tracking-wider text-primary bg-primary-container px-2 py-0.5 rounded">UDA</span>
                           <span className="m3-label-small font-medium text-on-surface-variant truncate">{lesson.unitaDiApprendimento}</span>
                       </div>
                   )}
                   <h1 className="m3-headline-small md:m3-headline-medium font-bold text-on-surface mb-3 md:mb-4 leading-tight">
                       {lesson.contenuto}
                   </h1>
                   
                   <div className="flex flex-wrap gap-2">
                       <span className="chip !h-7 m3-label-small bg-surface-container-high border-outline-variant">
                           <span className="material-symbols-outlined m3-label-large mr-1">school</span> {lesson.classe}
                       </span>
                       <span className="chip !h-7 m3-label-small bg-surface-container-high border-outline-variant">
                           <span className="material-symbols-outlined m3-label-large mr-1">menu_book</span> {lesson.materia}
                       </span>
                       <span className="chip !h-7 m3-label-small bg-surface-container-high border-outline-variant">
                           <span className="material-symbols-outlined m3-label-large mr-1">category</span> {lesson.tipoLezione || 'Teoria'}
                       </span>
                   </div>
              </div>

              <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  
                  {/* LEFT COLUMN: Main Content */}
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      
                      {/* AI Action Bar */}
                      {aiSettings && (
                        <div className="p-3 bg-tertiary-container/30 border border-tertiary/20 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined m3-label-large">psychology</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="m3-body-small font-bold text-on-surface">Assistente Pedagogico</p>
                                    <p className="m3-label-small text-on-surface-variant truncate">Analizza inclusività e coinvolgimento</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleAnalyzePedagogy} 
                                disabled={isAnalyzing} 
                                className="button button-text !text-tertiary !h-8 !px-3 m3-label-small flex-shrink-0"
                            >
                                {isAnalyzing ? <AiThinkingGem size="small" inline text="" /> : 'Analizza'}
                            </button>
                        </div>
                      )}

                      {/* Objectives */}
                      <section>
                          <h3 className="section-header-expressive text-primary !mb-2 !mt-0 m3-body-small">
                              <span className="material-symbols-outlined m3-label-large mr-2">flag</span>
                              Obiettivi Didattici
                          </h3>
                          <div className="bg-surface p-4 rounded-xl border border-outline-variant shadow-sm">
                              {lesson.obiettivi ? (
                                  <div className="prose prose-sm max-w-none text-on-surface">
                                      <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                        {lesson.obiettivi.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} className="leading-snug">{line.replace(/^- /, '')}</li>
                                        ))}
                                      </ul>
                                  </div>
                              ) : (
                                  <p className="m3-body-small text-on-surface-variant italic">Nessun obiettivo specificato.</p>
                              )}
                          </div>
                      </section>

                      {/* Content / Context */}
                      <section>
                          <h3 className="section-header-expressive text-secondary !mb-2 m3-body-small">
                              <span className="material-symbols-outlined m3-label-large mr-2">article</span>
                              Svolgimento e Contenuti
                          </h3>
                          <div className="bg-surface p-4 md:p-5 rounded-xl border border-outline-variant shadow-sm min-h-[100px]">
                              {lesson.contesto ? (
                                  <p className="m3-body-medium whitespace-pre-wrap leading-relaxed">{lesson.contesto}</p>
                              ) : (
                                  <p className="m3-body-small text-on-surface-variant italic">Nessun dettaglio sullo svolgimento.</p>
                              )}
                          </div>
                      </section>

                      {/* Lesson Notes */}
                      {lesson.nota && (
                          <section>
                              <h3 className="section-header-expressive text-on-surface-variant !mb-2 m3-body-small">
                                  <span className="material-symbols-outlined m3-label-large mr-2">sticky_note_2</span>
                                  Note Docente
                              </h3>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 m3-body-small font-medium text-on-surface">
                                  {lesson.nota}
                              </div>
                          </section>
                      )}
                  </div>

                  {/* RIGHT COLUMN: Resources & Side Info */}
                  <div className="space-y-4 md:space-y-6">
                      
                      {/* Materials Card */}
                      <div className="card !p-0 overflow-hidden bg-surface">
                          <div className="p-3 md:p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
                              <h3 className="m3-title-small font-bold flex items-center gap-2">
                                  <span className="material-symbols-outlined text-primary">attachment</span>
                                  Materiali
                              </h3>
                              <button onClick={() => setIsMaterialPickerOpen(true)} className="icon-button !w-8 !h-8 bg-surface text-primary shadow-sm border border-outline-variant/50">
                                  <span className="material-symbols-outlined m3-label-large">add</span>
                              </button>
                          </div>
                          
                          <div className="p-2 space-y-1">
                              {(lesson.materialiDidattici?.length || 0) > 0 ? (
                                  lesson.materialiDidattici!.map(material => (
                                      <div key={material.id} className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg group transition-colors">
                                          <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                                              <span className="material-symbols-outlined text-sm">{getMaterialIcon(material)}</span>
                                          </div>
                                          <div className="flex-grow min-w-0">
                                              {material.type === 'link' ? (
                                                  <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate block">{material.label}</a>
                                              ) : (
                                                  <span 
                                                    onClick={() => material.type === 'kb' && handlePreviewKbMaterial(material)} 
                                                    className={`text-sm font-medium truncate block ${material.type === 'kb' ? 'cursor-pointer hover:text-primary' : 'text-on-surface'}`}
                                                  >
                                                      {material.type === 'kb' ? material.fileName : material.file?.name}
                                                  </span>
                                              )}
                                          </div>
                                          <div className="flex md:opacity-0 group-hover:opacity-100 transition-opacity">
                                              {material.type === 'file' && (
                                                  <button onClick={() => handleDownloadMaterial(material)} className="icon-button !w-8 !h-8" title="Scarica">
                                                      <span className="material-symbols-outlined m3-body-medium">download</span>
                                                  </button>
                                              )}
                                              <button onClick={() => handleRemoveMaterial(material.id)} className="icon-button text-error !w-8 !h-8" title="Rimuovi">
                                                  <span className="material-symbols-outlined m3-body-medium">close</span>
                                              </button>
                                          </div>
                                      </div>
                                  ))
                              ) : (
                                  <div className="py-6 text-center text-on-surface-variant opacity-60">
                                      <span className="material-symbols-outlined m3-headline-small mb-1">folder_off</span>
                                      <p className="m3-label-small">Nessun materiale</p>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Inclusion Card */}
                      {lesson.adattamenti ? (
                          <div className="card bg-tertiary-container text-on-tertiary-container !border-none">
                              <h3 className="m3-title-small font-bold flex items-center gap-2 mb-2">
                                  <span className="material-symbols-outlined">diversity_3</span>
                                  Inclusività (BES/DSA)
                              </h3>
                              <p className="m3-body-small opacity-90 whitespace-pre-wrap">{lesson.adattamenti}</p>
                          </div>
                      ) : (
                          <div className="card border-dashed border-outline-variant bg-transparent opacity-60 hover:opacity-100 transition-opacity p-3">
                                <h3 className="m3-title-small font-bold flex items-center gap-2 mb-1 text-on-surface-variant">
                                  <span className="material-symbols-outlined m3-body-medium">diversity_3</span>
                                  Inclusività
                              </h3>
                              <p className="m3-label-small text-on-surface-variant">Nessun adattamento specifico registrato.</p>
                          </div>
                      )}

                      {/* Homework Card */}
                      <div className="card bg-surface-container">
                          <h3 className="m3-title-small font-bold flex items-center gap-2 mb-2 text-on-surface">
                                  <span className="material-symbols-outlined text-secondary">assignment</span>
                                  Compiti per Casa
                          </h3>
                          <p className="m3-body-small text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                              {lesson.compiti || 'Nessun compito assegnato.'}
                          </p>
                          
                          {/* Homework PDF Button */}
                          {settings && lesson.compiti && (
                              <button onClick={handleExportHomework} disabled={isExporting} className="button button-outlined !h-8 m3-label-small w-full mt-3">
                                  <span className="material-symbols-outlined mr-1 m3-label-large">print</span> PDF Compiti
                              </button>
                          )}
                      </div>

                  </div>
              </div>
          </div>

          {/* FOOTER: Fixed at bottom */}
          <div className="dialog-footer bg-surface border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center p-4 gap-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
               <span className="m3-label-small text-on-surface-variant hidden sm:inline">
                   Modificato il {new Date().toLocaleDateString()}
               </span>
               <div className="flex gap-3 w-full sm:w-auto">
                    <button type="button" onClick={onClose} className="button button-text flex-1 sm:flex-none justify-center">Chiudi</button>
                    <button type="button" onClick={() => onStartClassroom(lesson.classe, lesson.materia, `view-${lesson.id}`, lesson)} className="button button-filled flex-1 sm:flex-grow-0 justify-center">
                        <span className="material-symbols-outlined mr-2">door_open</span>
                        Avvia Lezione
                    </button>
               </div>
               
               {/* Mobile Only: Export Actions */}
               <div className="flex sm:hidden gap-2 w-full pt-2 border-t border-outline-variant">
                   <button onClick={handleExportDocx} disabled={isExporting} className="button button-outlined flex-1 justify-center !h-9 m3-label-small">
                       <span className="material-symbols-outlined mr-1 m3-label-large">description</span> Word
                   </button>
                   <button onClick={handleExport} disabled={isExporting} className="button button-outlined flex-1 justify-center !h-9 m3-label-small">
                       <span className="material-symbols-outlined mr-1 m3-label-large">picture_as_pdf</span> PDF
                   </button>
               </div>
          </div>

        </div>
      </div>
      
      {/* Modals for interactions */}
      {previewingMaterial && (
          <M3Dialog
              onClose={() => setPreviewingMaterial(null)}
              title="Anteprima Materiale"
              maxWidth="2xl"
              buttons={
                  <button type="button" onClick={() => setPreviewingMaterial(null)} className="button button-text">Chiudi</button>
              }
          >
              <h3 className="m3-title-medium mb-2">{previewingMaterial.fileName}</h3>
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap m3-body-medium">{sanitizeHTML(previewingMaterial.content)}</pre>
              </div>
          </M3Dialog>
      )}
      
      {isMaterialPickerOpen && (
        <MaterialPickerModal
            knowledgeBase={knowledgeBase}
            currentMaterials={lesson.materialiDidattici || []}
            onClose={() => setIsMaterialPickerOpen(false)}
            onSave={handleAddMaterials}
        />
      )}

      {analysisResult && (
          <LessonAnalysisModal 
            result={analysisResult} 
            onClose={() => setAnalysisResult(null)} 
            title={lesson.contenuto}
            contextLabel={`Analisi ${lesson.materia} ${lesson.classe} • ${settings?.schoolType || ''}`}
          />
      )}
    </>
  );
};

export default LessonView;
