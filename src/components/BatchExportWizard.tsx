import React, { useState, useMemo } from 'react';
import { Studente, Lezione, Uda, TimetableSettings, AiSettings, Valutazione, ValutazioneCompetenza, DocumentTemplate } from '../types';
import { generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { useDataStore } from '../stores/useDataStore';
import { useUIStore } from '../stores/useUIStore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import TemplateManager from './TemplateManager';
import JSZip from 'jszip';

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
  const { trackAnalyticsEvent } = useDataStore(state => ({ trackAnalyticsEvent: state.actions.trackAnalyticsEvent }));
  const modalRef = useKeyboardNavigation(true, props.onClose);

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
    <div className="dialog-backdrop" role="presentation">
      <div
        ref={modalRef}
        className="dialog-container w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="batch-export-title"
      >
        <div className="dialog-header">
          <h2 id="batch-export-title" className="m3-headline-medium">Export Multiplo Documenti</h2>
          <button onClick={props.onClose} className="icon-button" aria-label="Chiudi finestra export multiplo">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="dialog-content space-y-6">
          {/* Progress Bar durante generazione */}
          {progress && (
            <div className="bg-surface-container p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generazione in corso...</span>
                <span className="text-sm text-on-surface-variant">{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-on-surface-variant truncate">{progress.currentDoc}</p>
            </div>
          )}

          {/* Controlli selezione */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Selezionati: {selectedDocuments.length} di {availableDocuments.length}
              </span>
              <div className="flex gap-2">
                <button onClick={selectAll} className="button button-text text-xs" disabled={isGenerating}>
                  Seleziona Tutto
                </button>
                <button onClick={selectNone} className="button button-text text-xs" disabled={isGenerating}>
                  Deseleziona Tutto
                </button>
                <button
                  onClick={() => {
                    setShowTemplateManager(true);
                    trackAnalyticsEvent('feature_usage', 'template_manager');
                  }}
                  className="button button-outlined text-xs"
                  disabled={isGenerating}
                >
                  <span className="material-symbols-outlined mr-1 text-sm">description</span>
                  Template
                </button>
              </div>
            </div>
          </div>

          {/* Lista documenti raggruppati */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedDocuments).map(([groupName, docs]) => (
              <div key={groupName}>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  {groupName} ({docs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {docs.map(doc => {
                    const isSelected = selectedDocuments.some(d => d.id === doc.id);
                    return (
                      <div
                        key={doc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-container/20'
                            : 'border-outline-variant hover:border-primary/50'
                        }`}
                        onClick={() => !isGenerating && toggleDocumentSelection(doc.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            disabled={isGenerating}
                            className="mt-0.5"
                            aria-label={`Seleziona ${doc.title}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{doc.title}</p>
                            <p className="text-xs text-on-surface-variant truncate">{doc.subtitle}</p>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
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
        </div>

        <div className="dialog-footer">
          <button onClick={props.onClose} className="button button-text" disabled={isGenerating}>
            Annulla
          </button>
          <button
            onClick={generateBatch}
            className="button button-filled"
            disabled={isGenerating || selectedDocuments.length === 0}
          >
            {isGenerating ? `Generazione... (${progress?.current || 0}/${progress?.total || 0})` : `Genera ${selectedDocuments.length} Documenti`}
          </button>
        </div>
      </div>

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          onClose={() => setShowTemplateManager(false)}
          onApplyTemplate={handleApplyTemplate}
        />
      )}
    </div>
  );
};

export default BatchExportWizard;