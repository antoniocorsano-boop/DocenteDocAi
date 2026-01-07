import React, { useState, useMemo } from 'react';
import { Studente, Lezione, Uda, TimetableSettings, AiSettings, Valutazione, ValutazioneCompetenza, DocumentTemplate } from '../types';
import { generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import TemplateManager from './TemplateManager';
import JSZip from 'jszip';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

// Type guards migliorati
const isStudent = (data: unknown): data is Studente => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'nome' in data &&
    'cognome' in data &&
    typeof (data as Record<string, unknown>).nome === 'string' &&
    typeof (data as Record<string, unknown>).cognome === 'string'
  );
};

const isLesson = (data: unknown): data is Lezione => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'contenuto' in data &&
    'materia' in data &&
    typeof (data as Record<string, unknown>).contenuto === 'string' &&
    typeof (data as Record<string, unknown>).materia === 'string'
  );
};

const isUda = (data: unknown): data is Uda => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'title' in data &&
    'classe' in data &&
    typeof (data as Record<string, unknown>).title === 'string' &&
    typeof (data as Record<string, unknown>).classe === 'string'
  );
};

// Tipi per l'export multiplo
export interface BatchDocument {
  id: string;
  type: 'student_profile' | 'lesson_plan' | 'uda' | 'syllabus' | 'council_report';
  title: string;
  subtitle: string;
  data: Studente | Lezione | Uda | { class: string; subject: string; lessons: Lezione[] }; // Tipi specifici invece di any
  format: 'pdf' | 'docx';
  selected: boolean;
}

interface BatchExportWizardProps {
  onClose: () => void;
  students: Studente[];
  lessons: Record<string, Lezione>;
  uda: Uda[];
  evaluations: Valutazione[];
  competencyEvaluations: ValutazioneCompetenza[];
  settings: TimetableSettings;
  aiSettings: AiSettings;
  userClasses: string[];
}

const BatchExportWizard: React.FC<BatchExportWizardProps> = (props) => {
  const [selectedDocuments, setSelectedDocuments] = useState<BatchDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; currentDoc: string } | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));
  const { trackAnalyticsEvent } = useSystemStore(state => ({ trackAnalyticsEvent: state.actions.trackAnalyticsEvent }));

  // Track apertura wizard
  React.useEffect(() => {
    trackAnalyticsEvent('feature_usage', 'batch_export_wizard');
  }, [trackAnalyticsEvent]);

  // Genera la lista di tutti i documenti disponibili
  const availableDocuments = useMemo((): BatchDocument[] => {
    const docs: BatchDocument[] = [];

    // Profili Studente
    props.students.forEach(student => {
      docs.push({
        id: `student-${student.id}`,
        type: 'student_profile',
        title: `Profilo ${student.cognome} ${student.nome}`,
        subtitle: `Classe ${student.classe}`,
        data: student,
        format: 'pdf',
        selected: false
      });
    });

    // Piani Lezione
    Object.values(props.lessons).forEach(lesson => {
      docs.push({
        id: `lesson-${lesson.id}`,
        type: 'lesson_plan',
        title: `Piano: ${lesson.contenuto}`,
        subtitle: `${lesson.materia} - ${lesson.classe}`,
        data: lesson,
        format: 'pdf',
        selected: false
      });
    });

    // UDA
    props.uda.forEach(uda => {
      docs.push({
        id: `uda-${uda.id}`,
        type: 'uda',
        title: `UDA: ${uda.title}`,
        subtitle: `Classe ${uda.classe}`,
        data: uda,
        format: 'docx', // Corretto: UDA genera DOCX
        selected: false
      });
    });

    return docs;
  }, [props.students, props.lessons, props.uda]);

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.some(d => d.id === docId)
        ? prev.filter(d => d.id !== docId)
        : [...prev, availableDocuments.find(d => d.id === docId)!]
    );
  };

  const selectAll = () => {
    setSelectedDocuments(availableDocuments);
  };

  const selectNone = () => {
    setSelectedDocuments([]);
  };

  const handleApplyTemplate = (template: DocumentTemplate) => {
    // Per ora mostriamo solo un messaggio, in futuro applicheremo effettivamente il template
    showToast(`Template "${template.name}" selezionato. Funzionalità di applicazione template in sviluppo.`, "info");
  };

  const generateBatch = async () => {
    console.log('generateBatch called');
    console.log('Selected documents:', selectedDocuments);

    if (selectedDocuments.length === 0) {
      console.log('No documents selected, calling showToast');
      showToast('Seleziona almeno un documento da generare', 'info');
      return;
    }

    console.log('Proceeding with batch generation');
    setIsGenerating(true);
    setProgress({ current: 0, total: selectedDocuments.length, currentDoc: '' });

    // Track inizio generazione batch
    trackAnalyticsEvent('export_batch', 'batch_generation', {
      documentCount: selectedDocuments.length,
      documentTypes: selectedDocuments.map(d => d.type).join(', ')
    });

    console.log("generateBatch called", selectedDocuments);
    console.log("selectedDocuments state:", selectedDocuments);

    try {
      const generatedFiles: { name: string; blob: Blob }[] = [];

      for (let i = 0; i < selectedDocuments.length; i++) {
        const doc = selectedDocuments[i];
        setProgress({ current: i + 1, total: selectedDocuments.length, currentDoc: doc.title });

        let blob: Blob;
        let fileName: string;

        switch (doc.type) {
          case 'student_profile': {
            if (!isStudent(doc.data)) continue;
            const student = doc.data;
            const studentEvals = props.evaluations.filter(e => e.studenteId === student.id);
            const studentCompEvals = props.competencyEvaluations.filter(e => e.studenteId === student.id);
            blob = await generateStudentProfilePdf(student, studentEvals, studentCompEvals, props.settings);
            fileName = `Profilo_${student.cognome}_${student.nome}.pdf`;
            break;
          }

          case 'lesson_plan': {
            if (!isLesson(doc.data)) continue;
            const lesson = doc.data;
            blob = await generateLessonPdf(lesson);
            fileName = `Piano_Lezione_${lesson.id}.pdf`;
            break;
          }

          case 'uda': {
            if (!isUda(doc.data)) continue;
            const uda = doc.data;
            const udaHtml = `
              <h1>${uda.title}</h1>
              <p><strong>Classe:</strong> ${uda.classe}</p>
              <p><strong>Descrizione:</strong> ${uda.introduction || 'N/A'}</p>
              <p><strong>Obiettivi:</strong> ${uda.evaluation || 'N/A'}</p>
            `;
            blob = await generateHtmlDocxBlob(udaHtml, `UDA_${uda.title}`);
            fileName = `UDA_${uda.title.replace(/\s+/g, '_')}.docx`;
            break;
          }

          default:
            throw new Error(`Tipo documento non supportato: ${doc.type}`);
        }

        generatedFiles.push({ name: fileName, blob });

        // Track generazione documento
        trackAnalyticsEvent('document_generated', doc.type, {
          format: doc.format,
          source: 'batch_export'
        });
      }

      if (generatedFiles.length > 1) {
        const zip = new JSZip();
        generatedFiles.forEach(file => {
          zip.file(file.name, file.blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'Documenti_Export.zip');
      } else if (generatedFiles.length === 1) {
        saveAs(generatedFiles[0].blob, generatedFiles[0].name);
      }

      showToast(`Generati con successo ${generatedFiles.length} documenti!`, "success");
      props.onClose();

    } catch (error) {
      console.error("Errore generazione batch:", error);
      showToast("Errore durante la generazione dei documenti. Riprova.", "error");
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const groupedDocuments = useMemo(() => {
    const groups: Record<string, BatchDocument[]> = {};
    availableDocuments.forEach(doc => {
      const groupKey = doc.type === 'student_profile' ? 'Profili Studente' :
                      doc.type === 'lesson_plan' ? 'Piani Lezione' :
                      doc.type === 'uda' ? 'UDA' : 'Altri';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(doc);
    });
    return groups;
  }, [availableDocuments]);

  return (
    <M3Dialog
      title="Export Multiplo Documenti"
      onClose={props.onClose}
      maxWidth="2xl"
      level={1}
    >
      <M3DialogContent>
          {/* Progress Bar durante generazione */}
          {progress && (
            <div className="bg-surface-container p-8 rounded-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="m3-body-small font-medium">Generazione in corso...</span>
                <span className="m3-body-small text-on-surface-variant">{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 mb-8">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="m3-label-small text-on-surface-variant truncate">{progress.currentDoc}</p>
            </div>
          )}

          {/* Controlli selezione */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="m3-body-small font-medium">
                Selezionati: {selectedDocuments.length} di {availableDocuments.length}
              </span>
              <div className="flex gap-8">
                <M3Button onClick={selectAll} variant="text" className="m3-label-small" disabled={isGenerating}>
                  Seleziona Tutto
                </M3Button>
                <M3Button onClick={selectNone} variant="text" className="m3-label-small" disabled={isGenerating}>
                  Deseleziona Tutto
                </M3Button>
                <M3Button
                  onClick={() => {
                    setShowTemplateManager(true);
                    trackAnalyticsEvent('feature_usage', 'template_manager');
                  }}
                  variant="outlined"
                  className="m3-label-small"
                  disabled={isGenerating}
                >
                  <span className="material-symbols-outlined mr-1 m3-body-small">description</span>
                  Template
                </M3Button>
              </div>
            </div>
          </div>

          {/* Lista documenti raggruppati */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedDocuments).map(([groupName, docs]) => (
              <div key={groupName}>
                <h3 className="m3-body-small font-bold text-on-surface-variant uppercase tracking-wider mb-8">
                  {groupName} ({docs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {docs.map(doc => {
                    const isSelected = selectedDocuments.some(d => d.id === doc.id);
                    return (
                      <div
                        key={doc.id}
                        className={`p-6 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-container/20'
                            : 'border-outline-variant hover:border-primary/50'
                        }`}
                        onClick={() => !isGenerating && toggleDocumentSelection(doc.id)}
                      >
                        <div className="flex items-start gap-6">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            disabled={isGenerating}
                            className="mt-0.5"
                            aria-label={`Seleziona ${doc.title}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium m3-body-small truncate">{doc.title}</p>
                            <p className="m3-label-small text-on-surface-variant truncate">{doc.subtitle}</p>
                            <span className={`inline-block px-4 py-0.5 m3-label-small rounded-full mt-4 ${
                              doc.format === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {doc.format.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
      </M3DialogContent>

      <M3DialogActions>
          <M3Button onClick={props.onClose} variant="text" disabled={isGenerating}>
            Annulla
          </M3Button>
          <M3Button
            onClick={generateBatch}
            variant="filled"
            disabled={isGenerating || selectedDocuments.length === 0}
          >
            {isGenerating ? `Generazione... (${progress?.current || 0}/${progress?.total || 0})` : `Genera ${selectedDocuments.length} Documenti`}
          </M3Button>
      </M3DialogActions>

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          onClose={() => setShowTemplateManager(false)}
          onApplyTemplate={handleApplyTemplate}
        />
      )}
    </M3Dialog>
  );
};

export default BatchExportWizard;
