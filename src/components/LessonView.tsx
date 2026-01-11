
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
            <div className="lesson-view-title">
                <div className="lesson-view-icon">
                    <span className="material-symbols-outlined lesson-view-icon-symbol">{typeIcon}</span>
                </div>
                <div className="lesson-view-title-text">
                    <h2 className="lesson-view-title-main">Piano Lezione</h2>
                    <p className="lesson-view-title-id">{lesson.id.split('-').slice(0,2).join('-')}</p>
                </div>
            </div>
        }
        onClose={onClose}
        mode="fullscreen"
        level={1}
      >
        <M3DialogContent className="lesson-view-content">
            <div className="lesson-view-container">
                {/* HERO SECTION */}
                <div className="lesson-view-hero">
                    {lesson.unitaDiApprendimento && (
                        <div className="lesson-view-uda">
                            <span className="lesson-view-uda-badge">UDA</span>
                            <span className="lesson-view-uda-title">{lesson.unitaDiApprendimento}</span>
                        </div>
                    )}
                    <h1 className="lesson-view-main-title">
                        {lesson.contenuto}
                    </h1>
                    
                    <div className="lesson-view-meta">
                        <div className="lesson-view-meta-item">
                            <span className="material-symbols-outlined lesson-view-meta-icon">school</span>
                            <span className="lesson-view-meta-label">{lesson.classe}</span>
                        </div>
                        <div className="lesson-view-meta-item">
                            <span className="material-symbols-outlined lesson-view-meta-icon">menu_book</span>
                            <span className="lesson-view-meta-label">{lesson.materia}</span>
                        </div>
                        <div className="lesson-view-meta-item">
                            <span className="material-symbols-outlined lesson-view-meta-icon">category</span>
                            <span className="lesson-view-meta-label">{lesson.tipoLezione || 'Teoria'}</span>
                        </div>
                    </div>
                </div>

                <div className="lesson-view-main-grid">
                    {/* LEFT COLUMN */}
                    <div className="lesson-view-main-column">
                        {/* AI Assistant */}
                        {aiSettings && (
                            <div className="lesson-view-ai-assistant">
                                <div className="lesson-view-ai-content">
                                    <div className="lesson-view-ai-icon">
                                        <span className="material-symbols-outlined lesson-view-ai-icon-symbol">psychology</span>
                                    </div>
                                    <div>
                                        <p className="lesson-view-ai-title">Assistente Pedagogico</p>
                                        <p className="lesson-view-ai-subtitle">Analizza inclusività e coinvolgimento</p>
                                    </div>
                                </div>
                                <div className="lesson-view-ai-actions">
                                    <M3Button 
                                        onClick={handleEnrichLesson} 
                                        disabled={isEnriching} 
                                        variant="tonal"
                                        className="lesson-view-ai-enrich-button"
                                        title="Arricchisci con curiosità e spunti AI"
                                    >
                                        {isEnriching ? <AiThinkingGem size="small" inline text="" /> : (
                                            <div className="lesson-view-ai-enrich-content">
                                                <span className="material-symbols-outlined lesson-view-ai-enrich-icon">auto_awesome</span>
                                                Arricchisci
                                            </div>
                                        )}
                                    </M3Button>
                                    <M3Button 
                                        onClick={handleAnalyzePedagogy} 
                                        disabled={isAnalyzing} 
                                        variant="filled"
                                        className="lesson-view-ai-analyze-button"
                                    >
                                        {isAnalyzing ? <AiThinkingGem size="small" inline text="" /> : 'Analizza'}
                                    </M3Button>
                                </div>
                            </div>
                        )}

                        {/* Objectives */}
                        <section className="lesson-view-objectives-section">
                            <SectionHeader title="Obiettivi Didattici" icon="flag" />
                            <div className="lesson-view-objectives-content">
                                {lesson.obiettivi ? (
                                    <div className="lesson-view-objectives-list">
                                        <ul className="lesson-view-objectives-ul">
                                            {lesson.obiettivi.split('\n').filter(line => line.trim()).map((line, idx) => (
                                                <li key={idx} className="lesson-view-objectives-li">{line.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="lesson-view-objectives-empty">Nessun obiettivo specificato.</p>
                                )}
                            </div>
                        </section>

                        {/* Content */}
                        <section className="lesson-view-content-section">
                            <SectionHeader title="Svolgimento e Contenuti" icon="article" />
                            <div className="lesson-view-content-details">
                                {lesson.contesto ? (
                                    <p className="lesson-view-content-text">{lesson.contesto}</p>
                                ) : (
                                    <p className="lesson-view-content-empty">Nessun dettaglio sullo svolgimento.</p>
                                )}
                            </div>
                        </section>

                        {/* Notes */}
                        {lesson.nota && (
                            <section className="lesson-view-notes-section">
                                <SectionHeader title="Note Docente" icon="sticky_note_2" />
                                <div className="lesson-view-notes-content">
                                    {lesson.nota}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lesson-view-sidebar">
                        {/* Materials */}
                        <div className="lesson-view-materials-card">
                            <div className="lesson-view-materials-header">
                                <h3 className="lesson-view-materials-title">
                                    <span className="material-symbols-outlined lesson-view-materials-icon">attachment</span>
                                    Materiali
                                </h3>
                                <M3Button onClick={() => setIsMaterialPickerOpen(true)} variant="tonal" className="lesson-view-materials-add-button">
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add</span>
                                </M3Button>
                            </div>
                            
                            <div className="lesson-view-materials-list">
                                {(lesson.materialiDidattici?.length || 0) > 0 ? (
                                    lesson.materialiDidattici!.map(material => (
                                        <div key={material.id} className="lesson-view-material-item">
                                            <div className="lesson-view-material-icon">
                                                <span className="material-symbols-outlined lesson-view-material-icon-symbol">{getMaterialIcon(material)}</span>
                                            </div>
                                            <div className="lesson-view-material-info">
                                                {material.type === 'link' ? (
                                                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="lesson-view-material-link">{material.label}</a>
                                                ) : (
                                                    <span 
                                                        onClick={() => material.type === 'kb' && handlePreviewKbMaterial(material)} 
                                                        className="lesson-view-material-name"
                                                    >
                                                        {material.type === 'kb' ? material.fileName : material.file?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="lesson-view-material-actions">
                                                {material.type === 'file' && (
                                                    <M3Button onClick={() => handleDownloadMaterial(material)} variant="text" className="lesson-view-material-download" title="Scarica">
                                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>download</span>
                                                    </M3Button>
                                                )}
                                                <M3Button onClick={() => handleRemoveMaterial(material.id)} variant="text" className="lesson-view-material-remove" title="Rimuovi">
                                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
                                                </M3Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="lesson-view-materials-empty">
                                        <span className="material-symbols-outlined lesson-view-materials-empty-icon">folder_off</span>
                                        <p className="lesson-view-materials-empty-text">Nessun materiale</p>
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
                            <p className="lesson-view-inclusion-text">
                                {lesson.adattamenti || 'Nessun adattamento specifico registrato.'}
                            </p>
                        </InfoCard>

                        {/* Homework */}
                        <div className="lesson-view-homework-card">
                            <h3 className="lesson-view-homework-title">
                                <span className="material-symbols-outlined lesson-view-homework-icon">assignment</span>
                                Compiti per Casa
                            </h3>
                            <p className="lesson-view-homework-text">
                                {lesson.compiti || 'Nessun compito assegnato.'}
                            </p>
                            
                            {settings && lesson.compiti && (
                                <M3Button onClick={handleExportHomework} disabled={isExporting} variant="outlined" className="lesson-view-homework-export">
                                    <span className="material-symbols-outlined lesson-view-homework-export-icon">print</span> PDF Compiti
                                </M3Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </M3DialogContent>
        <M3DialogActions className="lesson-view-actions">
            <div className="lesson-view-actions-container">
                <span className="lesson-view-last-modified">
                    Ultima modifica: {new Date().toLocaleDateString()}
                </span>
                <div className="lesson-view-actions-buttons">
                    <div className="lesson-view-export-buttons">
                        <M3Button onClick={handleExportDocx} disabled={isExporting} variant="tonal" className="lesson-view-export-docx" title="Esporta Word">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>description</span>
                        </M3Button>
                        <M3Button onClick={handleExport} disabled={isExporting} variant="tonal" className="lesson-view-export-pdf" title="Esporta PDF">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>picture_as_pdf</span>
                        </M3Button>
                    </div>
                    <M3Button onClick={onClose} variant="text" className="lesson-view-close-button">Chiudi</M3Button>
                    <M3Button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `view-${lesson.id}`, lesson)} variant="filled" className="lesson-view-start-button">
                        <span className="material-symbols-outlined lesson-view-start-icon">door_open</span>
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
              <M3DialogContent className="lesson-view-preview-content">
                <h3 className="lesson-view-preview-title">{previewingMaterial.fileName}</h3>
                <div className="lesson-view-preview-text-container">
                    <pre className="lesson-view-preview-text">{sanitizeHTML(previewingMaterial.content)}</pre>
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


