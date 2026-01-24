// LEGACY - MD3 Non-compliant

/**
 * LessonView.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

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
              description: `${lesson.obiettivi || '} ${lesson.contesto || '}`
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
          background-color: hsl(${hue}, var(--md-sys-percent-80), var(--md-sys-percent-90));
          color: hsl(${hue}, var(--md-sys-percent-60), var(--md-sys-percent-30));
        }
      `}</style>
      <M3Dialog
        title={
            <div >
                <div >
                    <span >{typeIcon}</span>
                </div>
                <div >
                    <h2 >Piano Lezione</h2>
                    <p >{lesson.id.split('-').slice(0,2).join('-')}</p>
                </div>
            </div>
        }
        onClose={onClose}
        mode="fullscreen"
        level={1}
      >
        <M3DialogContent >
            <div >
                {/* HERO SECTION */}
                <div >
                    {lesson.unitaDiApprendimento && (
                        <div >
                            <span >UDA</span>
                            <span >{lesson.unitaDiApprendimento}</span>
                        </div>
                    )}
                    <h1 >
                        {lesson.contenuto}
                    </h1>
                    
                    <div >
                        <div >
                            <span >school</span>
                            <span >{lesson.classe}</span>
                        </div>
                        <div >
                            <span >menu_book</span>
                            <span >{lesson.materia}</span>
                        </div>
                        <div >
                            <span >category</span>
                            <span >{lesson.tipoLezione || 'Teoria'}</span>
                        </div>
                    </div>
                </div>

                <div >
                    {/* LEFT COLUMN */}
                    <div >
                        {/* AI Assistant */}
                        {aiSettings && (
                            <div >
                                <div >
                                    <div >
                                        <span >psychology</span>
                                    </div>
                                    <div>
                                        <p >Assistente Pedagogico</p>
                                        <p >Analizza inclusività e coinvolgimento</p>
                                    </div>
                                </div>
                                <div >
                                    <M3Button 
                                        onClick={handleEnrichLesson} 
                                        disabled={isEnriching} 
                                        variant="tonal"
                                        
                                        title="Arricchisci con curiosità e spunti AI"
                                    >
                                        {isEnriching ? <AiThinkingGem size="small" inline text="" /> : (
                                            <div >
                                                <span >auto_awesome</span>
                                                Arricchisci
                                            </div>
                                        )}
                                    </M3Button>
                                    <M3Button 
                                        onClick={handleAnalyzePedagogy} 
                                        disabled={isAnalyzing} 
                                        variant="filled"
                                        
                                    >
                                        {isAnalyzing ? <AiThinkingGem size="small" inline text="" /> : 'Analizza'}
                                    </M3Button>
                                </div>
                            </div>
                        )}

                        {/* Objectives */}
                        <section >
                            <SectionHeader title="Obiettivi Didattici" icon="flag" />
                            <div >
                                {lesson.obiettivi ? (
                                    <div >
                                        <ul >
                                            {lesson.obiettivi.split('\n').filter(line => line.trim()).map((line, idx) => (
                                                <li key={idx}>{line.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p >Nessun obiettivo specificato.</p>
                                )}
                            </div>
                        </section>

                        {/* Content */}
                        <section >
                            <SectionHeader title="Svolgimento e Contenuti" icon="article" />
                            <div >
                                {lesson.contesto ? (
                                    <p >{lesson.contesto}</p>
                                ) : (
                                    <p >Nessun dettaglio sullo svolgimento.</p>
                                )}
                            </div>
                        </section>

                        {/* Notes */}
                        {lesson.nota && (
                            <section >
                                <SectionHeader title="Note Docente" icon="sticky_note_2" />
                                <div >
                                    {lesson.nota}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div >
                        {/* Materials */}
                        <div >
                            <div >
                                <h3 >
                                    <span >attachment</span>
                                    Materiali
                                </h3>
                                <M3Button onClick={() => setIsMaterialPickerOpen(true)} variant="tonal" >
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add</span>
                                </M3Button>
                            </div>
                            
                            <div >
                                {(lesson.materialiDidattici?.length || 0) > 0 ? (
                                    lesson.materialiDidattici!.map(material => (
                                        <div key={material.id} >
                                            <div >
                                                <span >{getMaterialIcon(material)}</span>
                                            </div>
                                            <div >
                                                {material.type === 'link' ? (
                                                    <a href={material.url} target="_blank" rel="noopener noreferrer" >{material.label}</a>
                                                ) : (
                                                    <span 
                                                        onClick={() => material.type === 'kb' && handlePreviewKbMaterial(material)} 
                                                        
                                                    >
                                                        {material.type === 'kb' ? material.fileName : material.file?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div >
                                                {material.type === 'file' && (
                                                    <M3Button onClick={() => handleDownloadMaterial(material)} variant="text"  title="Scarica">
                                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>download</span>
                                                    </M3Button>
                                                )}
                                                <M3Button onClick={() => handleRemoveMaterial(material.id)} variant="text"  title="Rimuovi">
                                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
                                                </M3Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div >
                                        <span >folder_off</span>
                                        <p >Nessun materiale</p>
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
                            <p >
                                {lesson.adattamenti || 'Nessun adattamento specifico registrato.'}
                            </p>
                        </InfoCard>

                        {/* Homework */}
                        <div >
                            <h3 >
                                <span >assignment</span>
                                Compiti per Casa
                            </h3>
                            <p >
                                {lesson.compiti || 'Nessun compito assegnato.'}
                            </p>
                            
                            {settings && lesson.compiti && (
                                <M3Button onClick={handleExportHomework} disabled={isExporting} variant="outlined" >
                                    <span >print</span> PDF Compiti
                                </M3Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </M3DialogContent>
        <M3DialogActions >
            <div >
                <span >
                    Ultima modifica: {new Date().toLocaleDateString()}
                </span>
                <div >
                    <div >
                        <M3Button onClick={handleExportDocx} disabled={isExporting} variant="tonal"  title="Esporta Word">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>description</span>
                        </M3Button>
                        <M3Button onClick={handleExport} disabled={isExporting} variant="tonal"  title="Esporta PDF">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>picture_as_pdf</span>
                        </M3Button>
                    </div>
                    <M3Button onClick={onClose} variant="text" >Chiudi</M3Button>
                    <M3Button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `view-${lesson.id}`, lesson)} variant="filled" >
                        <span >door_open</span>
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
              <M3DialogContent >
                <h3 >{previewingMaterial.fileName}</h3>
                <div >
                    <pre >{sanitizeHTML(previewingMaterial.content)}</pre>
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








