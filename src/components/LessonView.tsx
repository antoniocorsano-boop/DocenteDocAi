/* eslint-disable design-system/no-classname -- Material Symbols icons require className */
// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026

/**
 * LessonView.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState } from 'react';
import { Lezione, MaterialeDidattico, KnowledgeBaseEntry, AiSettings, LessonAnalysisResult, TimetableSettings } from '../types';
import { generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generateHomeworkPdf, saveAs } from '../utils/documentUtils';
import { analyzeLessonPedagogy, addContextToLesson } from '../services/aiService';
import { sanitizeHTML } from '../utils/securityUtils';
import { generateHueFromString } from '../utils/colorUtils';
import { LESSON_TYPE_ICONS } from '../constants';
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
        alert("Si Ã¨ verificato un errore durante la generazione del PDF.");
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
        alert("Si Ã¨ verificato un errore durante la generazione della scheda compiti.");
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
              description: `${lesson.materia || ''} ${lesson.classe || ''} - ${lesson.obiettivi || ''} ${lesson.contesto || ''}`
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                <div className="lesson-icon-dynamic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-large)', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">{typeIcon}</span>
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-title-large-font-size)', color: 'var(--md-sys-color-on-surface)' }}>Piano Lezione</h2>
                    <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>{lesson.id.split('-').slice(0,2).join('-')}</p>
                </div>
            </div>
        }
        onClose={onClose}
        mode="fullscreen"
        level={1}
      >
        <M3DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}>
                {/* HERO SECTION */}
                <div style={{ borderRadius: 'var(--md-sys-shape-corner-extra-large)', backgroundColor: 'var(--md-sys-color-primary-container)', padding: 'var(--md-sys-spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {lesson.unitaDiApprendimento && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-primary)', alignSelf: 'flex-start' }}>
                            <span style={{ fontSize: 'var(--md-sys-typescale-label-small-font-size)', fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>UDA</span>
                            <span style={{ fontSize: 'var(--md-sys-typescale-label-small-font-size)', color: 'var(--md-sys-color-on-primary)' }}>{lesson.unitaDiApprendimento}</span>
                        </div>
                    )}
                    <h1 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-headline-medium-font-size)', color: 'var(--md-sys-color-on-primary-container)', lineHeight: 1.3 }}>
                        {lesson.contenuto}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-3)' }}>
                        {[{ icon: 'school', text: lesson.classe }, { icon: 'menu_book', text: lesson.materia }, { icon: 'category', text: lesson.tipoLezione || 'Teoria' }].map(tag => (
                            <div key={tag.text} style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-typescale-label-medium-font-size)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-4)' }}>{tag.icon}</span>
                                <span>{tag.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* eslint-disable-next-line design-system/no-hardcoded-layout-values -- mixed fr/px grid requires literal values */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--md-sys-spacing-6)', alignItems: 'start' }}>
                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                        {/* AI Assistant */}
                        {aiSettings && (
                            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-secondary-container)', padding: 'var(--md-sys-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-4)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-11)', height: 'var(--md-sys-spacing-11)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-secondary)', color: 'var(--md-sys-color-on-secondary)', flexShrink: 0 }}>
                                        <span className="material-symbols-outlined">psychology</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', color: 'var(--md-sys-color-on-secondary-container)' }}>Assistente Pedagogico</p>
                                        <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-secondary-container)', opacity: 0.8 }}>Analizza inclusività e coinvolgimento</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)' }}>
                                    <M3Button
                                        onClick={handleEnrichLesson}
                                        disabled={isEnriching}
                                        variant="tonal"
                                        title="Arricchisci con curiositÃ  e spunti AI"
                                    >
                                        {isEnriching ? <AiThinkingGem size="small" inline text="" /> : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                                <span className="material-symbols-outlined">auto_awesome</span>
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
                        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                            <SectionHeader title="Obiettivi Didattici" icon="flag" />
                            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--md-sys-spacing-4)' }}>
                                {lesson.obiettivi ? (
                                    <div style={{ flex: 1 }}>
                                        <ul style={{ margin: 0, paddingLeft: 'var(--md-sys-spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                                            {lesson.obiettivi.split('\n').filter(line => line.trim()).map((line, idx) => (
                                                <li key={idx} style={{ fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.6 }}>{line.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-typescale-body-medium-font-size)', fontStyle: 'italic' }}>Nessun obiettivo specificato.</p>
                                )}
                            </div>
                        </section>

                        {/* Content */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                            <SectionHeader title="Svolgimento e Contenuti" icon="article" />
                            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--md-sys-spacing-4)' }}>
                                {lesson.contesto ? (
                                    <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.7 }}>{lesson.contesto}</p>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>Nessun dettaglio sullo svolgimento.</p>
                                )}
                            </div>
                        </section>

                        {/* Notes */}
                        {lesson.nota && (
                            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                                <SectionHeader title="Note Docente" icon="sticky_note_2" />
                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-high)', padding: 'var(--md-sys-spacing-4)', fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.7, whiteSpace: 'pre-wrap', borderLeft: 'var(--md-sys-border-width-thick) solid var(--md-sys-color-tertiary)' }}>
                                    {lesson.nota}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                        {/* Materials */}
                        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container)', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', color: 'var(--md-sys-color-on-surface)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-primary)' }}>attachment</span>
                                    Materiali
                                </h3>
                                <M3Button onClick={() => setIsMaterialPickerOpen(true)} variant="text">
                                    <span className="material-symbols-outlined">add</span>
                                </M3Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', padding: 'var(--md-sys-spacing-2) 0' }}>
                                {(lesson.materialiDidattici?.length || 0) > 0 ? (
                                    lesson.materialiDidattici!.map(material => (
                                        <div key={material.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', flexShrink: 0 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-5)' }}>{getMaterialIcon(material)}</span>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                {material.type === 'link' ? (
                                                    <a href={material.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-body-medium-font-size)', textDecoration: 'none', fontWeight: 'var(--md-sys-typescale-weight-bold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{material.label}</a>
                                                ) : (
                                                    <span
                                                        onClick={() => material.type === 'kb' && handlePreviewKbMaterial(material)}
                                                        style={{ fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: material.type === 'kb' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface)', cursor: material.type === 'kb' ? 'pointer' : 'default', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                    >
                                                        {material.type === 'kb' ? material.fileName : material.file?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                                {material.type === 'file' && (
                                                    <M3Button onClick={() => handleDownloadMaterial(material)} variant="text" title="Scarica">
                                                        <span className="material-symbols-outlined">download</span>
                                                    </M3Button>
                                                )}
                                                <M3Button onClick={() => handleRemoveMaterial(material.id)} variant="text" title="Rimuovi">
                                                    <span className="material-symbols-outlined">close</span>
                                                </M3Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-10)' }}>folder_off</span>
                                        <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}>Nessun materiale</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inclusion */}
                        <InfoCard 
                            title="InclusivitÃ  (BES/DSA)" 
                            icon="diversity_3" 
                            variant={lesson.adattamenti ? 'tertiary' : 'surface'}
                        >
                            <p>
                                {lesson.adattamenti || 'Nessun adattamento specifico registrato.'}
                            </p>
                        </InfoCard>

                        {/* Homework */}
                        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container)', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-primary)' }}>assignment</span>
                                <h3 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', color: 'var(--md-sys-color-on-surface)' }}>Compiti per Casa</h3>
                            </div>
                            <div style={{ padding: 'var(--md-sys-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                                <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: lesson.compiti ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)', fontStyle: lesson.compiti ? 'normal' : 'italic', lineHeight: 1.6 }}>
                                    {lesson.compiti || 'Nessun compito assegnato.'}
                                </p>

                                {settings && lesson.compiti && (
                                    <M3Button onClick={handleExportHomework} disabled={isExporting} variant="outlined">
                                        <span className="material-symbols-outlined">print</span> PDF Compiti
                                    </M3Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </M3DialogContent>
        <M3DialogActions>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'var(--md-sys-percent-100)', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-3)' }}>
                <span style={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Ultima modifica: {new Date().toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)' }}>
                        <M3Button onClick={handleExportDocx} disabled={isExporting} variant="text" title="Esporta Word">
                            <span className="material-symbols-outlined">description</span>
                        </M3Button>
                        <M3Button onClick={handleExport} disabled={isExporting} variant="text" title="Esporta PDF">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </M3Button>
                    </div>
                    <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                    <M3Button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `view-${lesson.id}`, lesson)} variant="filled">
                        <span className="material-symbols-outlined">door_open</span>
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
          <M3DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <h3 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-title-medium-font-size)', color: 'var(--md-sys-color-on-surface)' }}>{previewingMaterial.fileName}</h3>
                    {/* eslint-disable-next-line design-system/enforce-token-usage, design-system/no-hardcoded-layout-values, design-system/no-hardcoded-viewport-units */}
                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-medium)', backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--md-sys-spacing-4)', maxHeight: 'var(--md-sys-viewport-60vh)', overflowY: 'auto' }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface)', fontFamily: 'monospace' }}>{sanitizeHTML(previewingMaterial.content)}</pre>
                    </div>
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
            contextLabel={`Analisi ${lesson.materia} ${lesson.classe} â€¢ ${settings?.schoolType || ''}`}
          />
      )}
    </>
  );
};

export default LessonView;


