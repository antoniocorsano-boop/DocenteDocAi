import React, { useState, useMemo } from 'react';
import { DocumentTemplate } from '../types';
import { useDataStore } from '../stores/useDataStore';
import { useUIStore } from '../stores/useUIStore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { M3Dialog } from './M3Dialog';

interface TemplateManagerProps {
  onClose: () => void;
  onApplyTemplate?: (template: DocumentTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose, onApplyTemplate }) => {
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { templates, actions } = useDataStore(state => ({
    templates: state.templates,
    actions: state.actions
  }));
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));
  const { trackAnalyticsEvent } = useDataStore(state => ({ trackAnalyticsEvent: state.actions.trackAnalyticsEvent }));

  const modalRef = useKeyboardNavigation(true, onClose);

  // Track apertura template manager
  React.useEffect(() => {
    trackAnalyticsEvent('feature_usage', 'template_manager');
  }, [trackAnalyticsEvent]);

  // Filtra template per ricerca
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates;
    return templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  // Raggruppa template per tipo
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, DocumentTemplate[]> = {};
    filteredTemplates.forEach(template => {
      const groupKey = template.type === 'student_profile' ? 'Profili Studente' :
                      template.type === 'lesson_plan' ? 'Piani Lezione' :
                      template.type === 'uda' ? 'UDA' : 'Altri';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const handleCreateTemplate = () => {
    const newTemplate: DocumentTemplate = {
      id: `template-${Date.now()}`,
      name: 'Nuovo Template',
      type: 'student_profile',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: {
        includeEvaluations: true,
        includeCompetencyEvaluations: true,
        customSections: []
      }
    };
    setEditingTemplate(newTemplate);
    setIsCreating(true);
  };

  const handleSaveTemplate = (template: DocumentTemplate) => {
    if (isCreating) {
      actions.setTemplates(prev => [...prev, template]);
      showToast(`Template "${template.name}" creato con successo!`, 'success');
      trackAnalyticsEvent('template_created', template.type, {
        templateId: template.id,
        hasDescription: !!template.description
      });
    } else {
      actions.setTemplates(prev =>
        prev.map(t => t.id === template.id ? { ...template, updatedAt: new Date().toISOString() } : t)
      );
      showToast(`Template "${template.name}" aggiornato con successo!`, 'success');
    }
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    if (confirm(`Sei sicuro di voler eliminare il template "${templateName}"?`)) {
      actions.setTemplates(prev => prev.filter(t => t.id !== templateId));
      showToast(`Template "${templateName}" eliminato.`, 'info');
    }
  };

  const handleApplyTemplate = (template: DocumentTemplate) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
      showToast(`Template "${template.name}" applicato!`, 'success');
      onClose();
    }
  };

  const getTypeLabel = (type: DocumentTemplate['type']) => {
    switch (type) {
      case 'student_profile': return 'Profilo Studente';
      case 'lesson_plan': return 'Piano Lezione';
      case 'uda': return 'UDA';
      default: return type;
    }
  };

  const getTypeColor = (type: DocumentTemplate['type']) => {
    switch (type) {
      case 'student_profile': return 'bg-blue-100 text-blue-800';
      case 'lesson_plan': return 'bg-green-100 text-green-800';
      case 'uda': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <M3Dialog
      title={editingTemplate ? (isCreating ? 'Crea Template' : 'Modifica Template') : 'Gestione Template'}
      onClose={onClose}
      maxWidth="2xl"
    >
      <div className="space-y-6">
          {editingTemplate ? (
            <TemplateEditor
              template={editingTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setEditingTemplate(null);
                setIsCreating(false);
              }}
            />
          ) : (
            <>
              {/* Barra di ricerca e controlli */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Cerca template..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateTemplate}
                  className="button button-filled"
                >
                  <span className="material-symbols-outlined mr-2">add</span>
                  Nuovo Template
                </button>
              </div>

              {/* Lista template raggruppati */}
              <div className="space-y-6">
                {Object.keys(groupedTemplates).length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">
                      description
                    </span>
                    <h3 className="text-lg font-medium text-on-surface mb-2">
                      {searchTerm ? 'Nessun template trovato' : 'Nessun template creato'}
                    </h3>
                    <p className="text-on-surface-variant mb-4">
                      {searchTerm
                        ? 'Prova a modificare i termini di ricerca'
                        : 'Crea il tuo primo template per personalizzare i documenti'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={handleCreateTemplate}
                        className="button button-filled"
                      >
                        Crea il primo template
                      </button>
                    )}
                  </div>
                ) : (
                  Object.entries(groupedTemplates).map(([groupName, groupTemplates]) => (
                    <div key={groupName}>
                      <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                        {groupName} ({groupTemplates.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupTemplates.map(template => (
                          <div
                            key={template.id}
                            className="bg-surface-container border border-outline-variant rounded-xl p-4 hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-on-surface truncate mb-1">
                                  {template.name}
                                </h4>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getTypeColor(template.type)}`}>
                                  {getTypeLabel(template.type)}
                                </span>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() => setEditingTemplate(template)}
                                  className="icon-button icon-button-small"
                                  aria-label={`Modifica template ${template.name}`}
                                >
                                  <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template.id, template.name)}
                                  className="icon-button icon-button-small text-error"
                                  aria-label={`Elimina template ${template.name}`}
                                >
                                  <span className="material-symbols-outlined">delete</span>
                                </button>
                              </div>
                            </div>

                            {template.description && (
                              <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">
                                {template.description}
                              </p>
                            )}

                            <div className="text-xs text-on-surface-variant mb-3">
                              Aggiornato: {new Date(template.updatedAt).toLocaleDateString('it-IT')}
                            </div>

                            {onApplyTemplate && (
                              <button
                                onClick={() => handleApplyTemplate(template)}
                                className="button button-filled button-small w-full"
                              >
                                Applica Template
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </M3Dialog>
    );
  };

// Componente per editare/creare template
interface TemplateEditorProps {
  template: DocumentTemplate;
  onSave: (template: DocumentTemplate) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const [editedTemplate, setEditedTemplate] = useState<DocumentTemplate>(template);

  const handleSave = () => {
    if (!editedTemplate.name.trim()) {
      alert('Il nome del template è obbligatorio');
      return;
    }
    onSave(editedTemplate);
  };

  const updateConfig = (key: string, value: boolean | string | string[]) => {
    setEditedTemplate(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Informazioni base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Nome Template *
          </label>
          <input
            type="text"
            value={editedTemplate.name}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-outline rounded-lg focus:border-primary focus:outline-none"
            placeholder="Es: Profilo Studente Dettagliato"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Tipo Documento
          </label>
          <select
            value={editedTemplate.type}
            onChange={(e) => setEditedTemplate(prev => ({
              ...prev,
              type: e.target.value as DocumentTemplate['type']
            }))}
            className="w-full px-3 py-2 border border-outline rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="student_profile">Profilo Studente</option>
            <option value="lesson_plan">Piano Lezione</option>
            <option value="uda">UDA</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface mb-2">
          Descrizione
        </label>
        <textarea
          value={editedTemplate.description || ''}
          onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-outline rounded-lg focus:border-primary focus:outline-none"
          rows={3}
          placeholder="Descrivi lo scopo di questo template..."
        />
      </div>

      {/* Configurazioni specifiche per tipo */}
      <div className="bg-surface-container rounded-xl p-4">
        <h3 className="font-medium text-on-surface mb-4">Configurazioni</h3>

        {editedTemplate.type === 'student_profile' && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includeEvaluations ?? true}
                onChange={(e) => updateConfig('includeEvaluations', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi valutazioni</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includeCompetencyEvaluations ?? true}
                onChange={(e) => updateConfig('includeCompetencyEvaluations', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi valutazioni competenze</span>
            </label>
          </div>
        )}

        {editedTemplate.type === 'lesson_plan' && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includeObjectives ?? true}
                onChange={(e) => updateConfig('includeObjectives', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi obiettivi</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includeMaterials ?? true}
                onChange={(e) => updateConfig('includeMaterials', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi materiali</span>
            </label>
          </div>
        )}

        {editedTemplate.type === 'uda' && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includePhases ?? true}
                onChange={(e) => updateConfig('includePhases', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi fasi</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedTemplate.config.includeEvaluation ?? true}
                onChange={(e) => updateConfig('includeEvaluation', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Includi valutazione</span>
            </label>
          </div>
        )}
      </div>

      {/* Azioni */}
      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
        <button onClick={onCancel} className="button button-text">
          Annulla
        </button>
        <button onClick={handleSave} className="button button-filled">
          Salva Template
        </button>
      </div>
    </div>
  );
};

export default TemplateManager;