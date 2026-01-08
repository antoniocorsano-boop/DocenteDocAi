
import React, { useState } from 'react';
import { Lezione, MaterialeDidattico, KnowledgeBaseEntry, AiSettings, LessonAnalysisResult, TimetableSettings } from '../types';
import { generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generateHomeworkPdf, saveAs } from '../utils/documentUtils';
import { analyzeLessonPedagogy, addContextToLesson } from '../services/aiService';
import MaterialPickerModal from './MaterialPickerModal';
import LessonAnalysisModal from './LessonAnalysisModal';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, AiThinkingGem } from './ui';

interface LessonViewProps {
  lesson: Lezione;
  onClose: () => void;
  onStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
  onUpdateLesson: (lesson: Lezione) => void; 
  knowledgeBase: KnowledgeBaseEntry[];
  aiSettings?: AiSettings;
  settings?: TimetableSettings;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onClose, onStartClassroom, onUpdateLesson, knowledgeBase, aiSettings, settings }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [previewingMaterial, setPreviewingMaterial] = useState<KnowledgeBaseEntry | null>(null);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LessonAnalysisResult | null>(null);

  const handleEnrichLesson = async () => {
    if (!aiSettings) return;
    setIsEnriching(true);
    try {
        const enrichment = await addContextToLesson(aiSettings, lesson);
        if (enrichment) {
            onUpdateLesson({
                ...lesson,
                nota: (lesson.nota ? lesson.nota + '\n\n' : '') + '--- AI ENRICHMENT ---\n' + enrichment
            });
        }
    } catch (error) {
        console.error("Failed to enrich lesson:", error);
    } finally {
        setIsEnriching(false);
    }
  };

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
    if (material.type !== 'file' || !material.file?.content) return;
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
    return 'insert_drive_file';
  };

  const hue = generateHueFromString(lesson.materia || 'default');
  const typeIcon = LESSON_TYPE_ICONS[lesson.tipoLezione || 'Teoria'] || 'school';

  return (
    <>
      <style>{`
        .lesson-icon-dynamic {
          background-color: hsl(${hue}, 80%, 90%);
          color: hsl(${hue}, 60%, 30%);
        }
      `}</style>
      <M3Dialog
        title={
            <div className="flex items-center gap-8">
                <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-center flex-shrink-0 shadow-sm lesson-icon-dynamic">
                    <span className="material-symbols-outlined text-2xl">{typeIcon}</span>
                </div>
                <div className="min-w-0">
                    <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-black leading-tight truncate">Piano Lezione</h2>
                    <p className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant font-mono uppercase tracking-widest opacity-60">{lesson.id.split('-').slice(0,2).join('-')}</p>
                </div>
            </div>
        }
        onClose={onClose}
        mode="fullscreen"
        level={1}
      >
        <M3DialogContent className="bg-[var(--md-sys-color-surface-container-low)]est p-0">
            <div className="max-w-6xl mx-auto w-full">
                {/* HERO SECTION */}
                <div className="p-6 md:p-10 bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)]/30">
                    {lesson.unitaDiApprendimento && (
                        <div className="flex items-center gap-8 mb-8">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">UDA</span>
                            <span className="m3-label-medium font-bold text-[var(--md-sys-color-on-surface)]-variant truncate">{lesson.unitaDiApprendimento}</span>
                        </div>
                    )}
                    <h1 className="m3-headline-medium md:m3-headline-large font-black text-[var(--md-sys-color-on-surface)] mb-6 leading-tight">
                        {lesson.contenuto}
                    </h1>
                    
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-8 px-4 py-4 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/30">
                            <span className="material-symbols-outlined text-primary text-lg">school</span>
                            <span className="m3-label-large font-bold">{lesson.classe}</span>
                        </div>
                        <div className="flex items-center gap-8 px-4 py-4 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/30">
                            <span className="material-symbols-outlined text-secondary text-lg">menu_book</span>
                            <span className="m3-label-large font-bold">{lesson.materia}</span>
                        </div>
                        <div className="flex items-center gap-8 px-4 py-4 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/30">
                            <span className="material-symbols-outlined text-tertiary text-lg">category</span>
                            <span className="m3-label-large font-bold">{lesson.tipoLezione || 'Teoria'}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* AI Assistant */}
                        {aiSettings && (
                            <div className="p-6 bg-tertiary-container/20 border border-tertiary/20 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-between shadow-sm group hover:shadow-[var(--md-sys-elevation-level1)] transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">psychology</span>
                                    </div>
                                    <div>
                                        <p className="m3-title-medium font-black text-[var(--md-sys-color-on-surface)]">Assistente Pedagogico</p>
                                        <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant opacity-80">Analizza inclusività e coinvolgimento</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <M3Button 
                                        onClick={handleEnrichLesson} 
                                        disabled={isEnriching} 
                                        variant="tonal"
                                        className="!h-12 !px-6"
                                        title="Arricchisci con curiosità e spunti AI"
                                    >
                                        {isEnriching ? <AiThinkingGem size="small" inline text="" /> : (
                                            <div className="flex items-center gap-8">
                                                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                                Arricchisci
                                            </div>
                                        )}
                                    </M3Button>
                                    <M3Button 
                                        onClick={handleAnalyzePedagogy} 
                                        disabled={isAnalyzing} 
                                        variant="filled"
                                        className="!bg-tertiary !text-on-tertiary !h-12 !px-6"
                                    >
                                        {isAnalyzing ? <AiThinkingGem size="small" inline text="" /> : 'Analizza'}
                                    </M3Button>
                                </div>
                            </div>
                        )}

                        {/* Objectives */}
                        <section>
                            <SectionHeader title="Obiettivi Didattici" icon="flag" />
                            <div className="mt-4 bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 shadow-sm">
                                {lesson.obiettivi ? (
                                    <div className="prose prose-sm max-w-none text-[var(--md-sys-color-on-surface)]">
                                        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                            {lesson.obiettivi.split('\n').filter(line => line.trim()).map((line, idx) => (
                                                <li key={idx} className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] leading-relaxed">{line.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant italic opacity-60">Nessun obiettivo specificato.</p>
                                )}
                            </div>
                        </section>

                        {/* Content */}
                        <section>
                            <SectionHeader title="Svolgimento e Contenuti" icon="article" />
                            <div className="mt-4 bg-[var(--md-sys-color-surface-container-low)] p-6 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 shadow-sm min-h-[150px]">
                                {lesson.contesto ? (
                                    <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] whitespace-pre-wrap leading-relaxed text-[var(--md-sys-color-on-surface)]">{lesson.contesto}</p>
                                ) : (
                                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant italic opacity-60">Nessun dettaglio sullo svolgimento.</p>
                                )}
                            </div>
                        </section>

                        {/* Notes */}
                        {lesson.nota && (
                            <section>
                                <SectionHeader title="Note Docente" icon="sticky_note_2" />
                                <div className="mt-4 bg-primary-container/10 p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-primary/20 text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] font-medium text-[var(--md-sys-color-on-surface)]-variant italic">
                                    {lesson.nota}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        {/* Materials */}
                        <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden shadow-sm">
                            <div className="p-5 border-b border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container-high)] flex justify-between items-center">
                                <h3 className="m3-title-medium font-black flex items-center gap-6">
                                    <span className="material-symbols-outlined text-primary">attachment</span>
                                    Materiali
                                </h3>
                                <M3Button onClick={() => setIsMaterialPickerOpen(true)} variant="tonal" className="!w-10 !h-10 !p-0 !min-w-0 !rounded-[var(--md-sys-shape-corner-medium)]">
                                    <span className="material-symbols-outlined">add</span>
                                </M3Button>
                            </div>
                            
                            <div className="p-8 space-y-2">
                                {(lesson.materialiDidattici?.length || 0) > 0 ? (
                                    lesson.materialiDidattici!.map(material => (
                                        <div key={material.id} className="flex items-center gap-8 p-6 hover:bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-large)] group transition-all border border-transparent hover:border-[var(--md-sys-color-outline-variant)]/30">
                                            <div className="w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <span className="material-symbols-outlined text-lg">{getMaterialIcon(material)}</span>
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                {material.type === 'link' ? (
                                                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="m3-label-large font-bold text-primary hover:underline truncate block">{material.label}</a>
                                                ) : (
                                                    <span 
                                                        onClick={() => material.type === 'kb' && handlePreviewKbMaterial(material)} 
                                                        className={`m3-label-large font-bold truncate block ${material.type === 'kb' ? 'cursor-pointer hover:text-primary' : 'text-[var(--md-sys-color-on-surface)]'}`}
                                                    >
                                                        {material.type === 'kb' ? material.fileName : material.file?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {material.type === 'file' && (
                                                    <M3Button onClick={() => handleDownloadMaterial(material)} variant="text" className="!p-8 !min-w-0" title="Scarica">
                                                        <span className="material-symbols-outlined">download</span>
                                                    </M3Button>
                                                )}
                                                <M3Button onClick={() => handleRemoveMaterial(material.id)} variant="text" className="!p-8 !min-w-0 text-error" title="Rimuovi">
                                                    <span className="material-symbols-outlined">close</span>
                                                </M3Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center opacity-40">
                                        <span className="material-symbols-outlined text-5xl mb-8">folder_off</span>
                                        <p className="m3-label-medium">Nessun materiale</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inclusion */}
                        <InfoCard 
                            title="Inclusività (BES/DSA)" 
                            icon="diversity_3" 
                            variant={lesson.adattamenti ? 'tertiary' : 'surface'}
                        >
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] leading-relaxed">
                                {lesson.adattamenti || 'Nessun adattamento specifico registrato.'}
                            </p>
                        </InfoCard>

                        {/* Homework */}
                        <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/30 p-6 shadow-sm">
                            <h3 className="m3-title-medium font-black flex items-center gap-6 mb-8">
                                <span className="material-symbols-outlined text-secondary">assignment</span>
                                Compiti per Casa
                            </h3>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant whitespace-pre-wrap leading-relaxed mb-6">
                                {lesson.compiti || 'Nessun compito assegnato.'}
                            </p>
                            
                            {settings && lesson.compiti && (
                                <M3Button onClick={handleExportHomework} disabled={isExporting} variant="outlined" className="w-full !h-12">
                                    <span className="material-symbols-outlined mr-2">print</span> PDF Compiti
                                </M3Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </M3DialogContent>
        <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]est border-t border-[var(--md-sys-color-outline-variant)]/30 p-8 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
                <span className="m3-label-medium text-[var(--md-sys-color-on-surface)]-variant opacity-60 hidden md:inline">
                    Ultima modifica: {new Date().toLocaleDateString()}
                </span>
                <div className="flex gap-6 w-full md:w-auto">
                    <div className="flex gap-8 mr-auto md:mr-4">
                        <M3Button onClick={handleExportDocx} disabled={isExporting} variant="tonal" className="!h-12 !px-4" title="Esporta Word">
                            <span className="material-symbols-outlined">description</span>
                        </M3Button>
                        <M3Button onClick={handleExport} disabled={isExporting} variant="tonal" className="!h-12 !px-4" title="Esporta PDF">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </M3Button>
                    </div>
                    <M3Button onClick={onClose} variant="text" className="!h-12 !px-8">Chiudi</M3Button>
                    <M3Button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `view-${lesson.id}`, lesson)} variant="filled" className="!h-12 !px-8 shadow-[var(--md-sys-elevation-level2)]">
                        <span className="material-symbols-outlined mr-2">door_open</span>
                        Avvia Lezione
                    </M3Button>
                </div>
            </div>
        </M3DialogActions>
      </M3Dialog>
      
      {/* Modals for interactions */}
      {previewingMaterial && (
          <M3Dialog
              onClose={() => setPreviewingMaterial(null)}
              title="Anteprima Materiale"
              maxWidth="2xl"
              level={2}
          >
              <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <h3 className="m3-title-medium mb-8 font-black">{previewingMaterial.fileName}</h3>
                <div className="p-6 bg-[var(--md-sys-color-surface-container-low)]est rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] leading-relaxed">{sanitizeHTML(previewingMaterial.content)}</pre>
                </div>
              </M3DialogContent>
              <M3DialogActions>
                <M3Button onClick={() => setPreviewingMaterial(null)} variant="text">Chiudi</M3Button>
              </M3DialogActions>
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


