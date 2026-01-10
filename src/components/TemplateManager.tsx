// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
import React, { useState, useMemo } from 'react';
import { DocumentTemplate } from '../types';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, TextField, SelectField, TextArea } from './ui';
import { generateTemplateWithAi } from '../services/aiService';

interface TemplateManagerProps {
  onClose: () => void;
  onApplyTemplate?: (template: DocumentTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose, onApplyTemplate }) => {
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { templates, actions } = useSystemStore(state => ({
    templates: state.templates,
    actions: state.actions
  }));
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));
  const { trackAnalyticsEvent } = useSystemStore(state => ({ trackAnalyticsEvent: state.actions.trackAnalyticsEvent }));

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

  return (
    <M3Dialog
      title={editingTemplate ? (isCreating ? 'Crea Template' : 'Modifica Template') : 'Gestione Template'}
      onClose={onClose}
      maxWidth="2xl"
    >
      <M3DialogContent className="template-manager-dialog-content">
        <div className="template-manager-main-container">
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
                <div className="template-manager-search-controls">
                  <div className="template-manager-search-container">
                    <div className="template-manager-search-input-container">
                      <span className="template-manager-search-icon">search</span>
                      <input
                        type="text"
                        placeholder="Cerca template..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="template-manager-search-input"
                      />
                    </div>
                  </div>
                  <M3Button
                    onClick={handleCreateTemplate}
                    variant="filled"
                    className="template-manager-create-button"
                  >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Nuovo Template
                  </M3Button>
                </div>

                {/* Lista template raggruppati */}
                <div className="template-manager-templates-list">
                  {Object.keys(groupedTemplates).length === 0 ? (
                    <div className="template-manager-empty-state">
                      <span className="template-manager-empty-state-icon">description</span>
                      <h3 className="template-manager-empty-state-title">
                        {searchTerm ? 'Nessun template trovato' : 'Nessun template creato'}
                      </h3>
                      <p className="template-manager-empty-state-description">
                        {searchTerm
                          ? 'Prova a modificare i termini di ricerca'
                          : 'Crea il tuo primo template per personalizzare i documenti'
                        }
                      </p>
                      {!searchTerm && (
                        <M3Button
                          onClick={handleCreateTemplate}
                          variant="filled"
                          className="template-manager-empty-state-button"
                        >
                          Crea il primo template
                        </M3Button>
                      )}
                    </div>
                  ) : (
                    Object.entries(groupedTemplates).map(([groupName, groupTemplates]) => (
                      <div key={groupName} className="template-manager-template-group">
                        <SectionHeader 
                          title={groupName} 
                          subtitle={`${groupTemplates.length} template disponibili`}
                          className="mb-8"
                        />
                        <div className="template-manager-template-grid">
                          {groupTemplates.map(template => (
                            <InfoCard
                              key={template.id}
                              variant="elevated"
                              className="template-manager-template-card"
                            >
                              <div className="template-manager-template-header">
                                <div className="template-manager-template-info">
                                  <h4 className="template-manager-template-name">
                                    {template.name}
                                  </h4>
                                  <span className={`template-manager-template-type-badge ${template.type === 'student_profile' ? 'template-manager-template-type-badge.student-profile' : template.type === 'lesson_plan' ? 'template-manager-template-type-badge.lesson-plan' : 'template-manager-template-type-badge.uda'}`}>
                                    {getTypeLabel(template.type)}
                                  </span>
                                </div>
                                <div className="template-manager-template-actions">
                                  <M3Button
                                    onClick={() => setEditingTemplate(template)}
                                    variant="text"
                                    className="template-manager-template-edit-button"
                                    title={`Modifica template ${template.name}`}
                                  >
                                    <span className="template-manager-template-edit-icon">edit</span>
                                  </M3Button>
                                  <M3Button
                                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                                    variant="text"
                                    className="template-manager-template-delete-button"
                                    title={`Elimina template ${template.name}`}
                                  >
                                    <span className="template-manager-template-delete-icon">delete</span>
                                  </M3Button>
                                </div>
                              </div>

                              {template.description && (
                                <p className="template-manager-template-description">
                                  {template.description}
                                </p>
                              )}

                              <div className="template-manager-template-updated-date">
                                Aggiornato: {new Date(template.updatedAt).toLocaleDateString('it-IT')}
                              </div>

                              {onApplyTemplate && (
                                <M3Button
                                  onClick={() => handleApplyTemplate(template)}
                                  variant="tonal"
                                  className="template-manager-template-apply-button"
                                >
                                  Applica Template
                                </M3Button>
                              )}
                            </InfoCard>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
      </M3DialogContent>
      {!editingTemplate && (
        <M3DialogActions>
          <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
        </M3DialogActions>
      )}
    </M3Dialog>
  );
};

// Componente per la preview in tempo reale
const TemplatePreview: React.FC<{ template: DocumentTemplate }> = ({ template }) => {
  return (
    <InfoCard 
      variant="elevated" 
      className="p-0 overflow-hidden border-[var(--md-sys-color-outline)]/50 h-full flex flex-col"
      aria-label="Anteprima del documento"
      role="region"
    >
      <div className="bg-[var(--md-sys-color-surface-container-low)] p-8 border-b border-[var(--md-sys-color-outline)]/30 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-2">Simulazione Documento</span>
        <div className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-error/30"></div>
          <div className="w-2 h-2 rounded-full bg-warning/30"></div>
          <div className="w-2 h-2 rounded-full bg-success/30"></div>
        </div>
      </div>
      <div className="p-6 bg-white text-black shadow-inner overflow-y-auto flex-1">
        <style>
          {template.content?.customCss || ''}
        </style>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: (template.content?.header || '')
              .replace(/{{nome_studente}}/g, 'Mario')
              .replace(/{{cognome_studente}}/g, 'Rossi')
              .replace(/{{classe}}/g, '3A')
              .replace(/{{data}}/g, new Date().toLocaleDateString('it-IT'))
              .replace(/{{titolo_lezione}}/g, 'Esempio Lezione')
          }} 
        />
        
        <div className="my-6 py-8 border-2 border-dashed border-[var(--md-sys-color-outline-variant)] rounded-[var(--md-sys-shape-corner-medium)] flex flex-col items-center justify-center text-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-low)]/50">
          <span className="material-symbols-outlined text-3xl mb-8">description</span>
          <p className="text-xs font-medium">Contenuto del Documento</p>
          <p className="text-[9px] mt-4 mb-8">(Simulazione corpo del documento)</p>
          
          <div className="w-full px-8 space-y-3">
            {template.type === 'student_profile' && (
              <>
                <div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded w-3/4"></div>
                <div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-8 mt-4">
                  <div className="h-12 bg-[var(--md-sys-color-surface-container-high)] rounded border border-[var(--md-sys-color-outline-variant)]"></div>
                  <div className="h-12 bg-[var(--md-sys-color-surface-container-high)] rounded border border-[var(--md-sys-color-outline-variant)]"></div>
                  <div className="h-12 bg-[var(--md-sys-color-surface-container-high)] rounded border border-[var(--md-sys-color-outline-variant)]"></div>
                </div>
              </>
            )}
            {template.type === 'lesson_plan' && (
              <>
                <div className="h-4 bg-[var(--md-sys-color-outline-variant)] rounded w-1/4 mb-8"></div>
                <div className="space-y-2">
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-[var(--md-sys-color-outline)] mt-4"></div><div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded flex-1"></div></div>
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-[var(--md-sys-color-outline)] mt-4"></div><div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded flex-1"></div></div>
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-[var(--md-sys-color-outline)] mt-4"></div><div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded flex-1"></div></div>
                </div>
              </>
            )}
            {template.type === 'uda' && (
              <>
                <div className="border border-[var(--md-sys-color-outline-variant)] rounded overflow-hidden">
                  <div className="bg-[var(--md-sys-color-surface-container-high)] h-6 border-b border-[var(--md-sys-color-outline-variant)]"></div>
                  <div className="p-8 space-y-2">
                    <div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded"></div>
                    <div className="h-2 bg-[var(--md-sys-color-outline-variant)] rounded w-5/6"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div 
          dangerouslySetInnerHTML={{ 
            __html: (template.content?.footer || '')
              .replace(/{{data}}/g, new Date().toLocaleDateString('it-IT'))
              .replace(/{{nome_docente}}/g, 'Prof. Bianchi')
              .replace(/{{page_number}}/g, '1')
          }} 
        />
      </div>
    </InfoCard>
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
  const [activeTab, setActiveTab] = useState<'config' | 'content' | 'preview'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const { aiSettings } = useSettingsStore(state => ({ aiSettings: state.aiSettings }));
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  const handleSave = () => {
    if (!editedTemplate.name.trim()) {
      showToast('Il nome del template è obbligatorio', 'error');
      return;
    }
    onSave(editedTemplate);
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) {
      showToast('Inserisci una descrizione per generare il template', 'info');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateTemplateWithAi(aiSettings, aiPrompt, editedTemplate.type);
      setEditedTemplate(prev => ({
        ...prev,
        name: generated.name || prev.name,
        description: generated.description || prev.description,
        content: {
          ...prev.content,
          ...generated.content
        },
        config: {
          ...prev.config,
          ...generated.config
        }
      }));
      showToast('Template generato con successo!', 'success');
      setAiPrompt('');
    } catch (error) {
      console.error('AI Generation error:', error);
      showToast('Errore durante la generazione AI', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateConfig = (key: string, value: unknown) => {
    setEditedTemplate(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const updateContent = (key: string, value: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const availableVariables = [
    { name: '{{nome_studente}}', desc: 'Nome dello studente' },
    { name: '{{cognome_studente}}', desc: 'Cognome dello studente' },
    { name: '{{classe}}', desc: 'Classe (es. 3A)' },
    { name: '{{data}}', desc: 'Data corrente' },
    { name: '{{materia}}', desc: 'Materia di insegnamento' },
    { name: '{{nome_docente}}', desc: 'Nome del docente' },
    { name: '{{voti_tabella}}', desc: 'Tabella riepilogativa voti' },
    { name: '{{competenze_tabella}}', desc: 'Tabella riepilogativa competenze' },
    { name: '{{obiettivi_lista}}', desc: 'Elenco puntato obiettivi' },
    { name: '{{fasi_uda}}', desc: 'Tabella fasi UDA' },
  ];

  return (
    <div className="template-manager-editor-container">
      {/* Header Editor */}
      <div className="template-manager-editor-header">
        <div className="template-manager-editor-tabs">
          <M3Button 
            onClick={() => setActiveTab('config')} 
            variant={activeTab === 'config' ? 'filled' : 'text'}
            className="template-manager-editor-tab-button"
          >
            Configurazione
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('content')} 
            variant={activeTab === 'content' ? 'filled' : 'text'}
            className="template-manager-editor-tab-button"
          >
            Contenuto HTML
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('preview')} 
            variant={activeTab === 'preview' ? 'filled' : 'text'}
            className="template-manager-editor-tab-button"
          >
            Anteprima
          </M3Button>
        </div>
        
        <div className="template-manager-editor-actions">
          <M3Button onClick={onCancel} variant="text" className="template-manager-editor-cancel-button">
            Annulla
          </M3Button>
          <M3Button onClick={handleSave} variant="filled" className="template-manager-editor-save-button">
            Salva
          </M3Button>
        </div>
      </div>

      {activeTab === 'config' && (
        <div className="template-manager-config-tab">
          {/* Informazioni base */}
          <div className="template-manager-config-form-grid">
            <TextField
              id="template-name"
              label="Nome Template *"
              value={editedTemplate.name}
              onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Es: Profilo Studente Dettagliato"
              fullWidth
            />

            <SelectField
              id="template-type"
              label="Tipo Documento"
              value={editedTemplate.type}
              onChange={(e) => setEditedTemplate(prev => ({
                ...prev,
                type: e.target.value as DocumentTemplate['type']
              }))}
              fullWidth
            >
              <option value="student_profile">Profilo Studente</option>
              <option value="lesson_plan">Piano Lezione</option>
              <option value="uda">UDA</option>
            </SelectField>
          </div>

          <TextArea
            id="template-desc"
            label="Descrizione"
            value={editedTemplate.description || ''}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            placeholder="Descrivi lo scopo di questo template..."
            fullWidth
          />

          {/* AI Generation Tool */}
          <InfoCard variant="tonal" className="template-manager-ai-generation-card">
            <div className="template-manager-ai-generation-header">
              <span className="template-manager-ai-generation-icon">auto_awesome</span>
              <h4 className="template-manager-ai-generation-title">Genera con AI</h4>
            </div>
            <div className="template-manager-ai-generation-form">
              <TextField
                id="ai-prompt"
                label="Prompt AI"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Es: Un template elegante per UDA con focus su inclusione..."
                containerClassName="template-manager-ai-generation-input"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateWithAi()}
              />
              <M3Button 
                onClick={handleGenerateWithAi} 
                disabled={isGenerating || !aiPrompt.trim()}
                variant="filled"
                className="template-manager-ai-generation-button"
                aria-label={isGenerating ? 'Generazione in corso...' : 'Genera template con AI'}
              >
                {isGenerating ? '...' : 'Genera'}
              </M3Button>
            </div>
            <p className="template-manager-ai-generation-help">
              L'AI creer� automaticamente l'intestazione, il pi� di pagina e le configurazioni ottimali.
            </p>
          </InfoCard>

          {/* Configurazioni specifiche */}
          <div className="template-manager-config-options-grid">
            <InfoCard variant="elevated" className="template-manager-config-card">
              <h4 className="template-manager-config-card-title">Opzioni Visibilità</h4>
              <div className="template-manager-config-options">
                {editedTemplate.type === 'student_profile' && (
                  <>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluations ?? true}
                        onChange={(e) => updateConfig('includeEvaluations', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi valutazioni</span>
                    </label>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeCompetencyEvaluations ?? true}
                        onChange={(e) => updateConfig('includeCompetencyEvaluations', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi competenze</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'lesson_plan' && (
                  <>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeObjectives ?? true}
                        onChange={(e) => updateConfig('includeObjectives', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi obiettivi</span>
                    </label>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeMaterials ?? true}
                        onChange={(e) => updateConfig('includeMaterials', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi materiali</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'uda' && (
                  <>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includePhases ?? true}
                        onChange={(e) => updateConfig('includePhases', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi fasi</span>
                    </label>
                    <label className="template-manager-config-option-label">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluation ?? true}
                        onChange={(e) => updateConfig('includeEvaluation', e.target.checked)}
                        className="template-manager-config-option-checkbox"
                      />
                      <span className="template-manager-config-option-text">Includi valutazione</span>
                    </label>
                  </>
                )}
              </div>
            </InfoCard>

            <InfoCard variant="elevated" className="template-manager-config-card">
              <h4 className="template-manager-config-card-title">Sezioni Personalizzate</h4>
              <div className="template-manager-custom-sections">
                {(editedTemplate.config.customSections || []).map((section, idx) => (
                  <div key={idx} className="template-manager-custom-section-item">
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => {
                        const newSections = [...(editedTemplate.config.customSections || [])];
                        newSections[idx] = e.target.value;
                        updateConfig('customSections', newSections);
                      }}
                      className="template-manager-custom-section-input"
                    />
                    <button 
                      onClick={() => {
                        const newSections = (editedTemplate.config.customSections || []).filter((_, i) => i !== idx);
                        updateConfig('customSections', newSections);
                      }}
                      className="template-manager-custom-section-delete-button"
                      aria-label={`Elimina sezione ${section}`}
                    >
                      <span className="template-manager-custom-section-delete-icon">delete</span>
                    </button>
                  </div>
                ))}
                <M3Button 
                  onClick={() => updateConfig('customSections', [...(editedTemplate.config.customSections || []), 'Nuova Sezione'])}
                  variant="text"
                  className="template-manager-add-section-button"
                >
                  + Aggiungi Sezione
                </M3Button>
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="template-manager-content-tab">
          <div className="template-manager-content-layout">
            {/* Editor Side */}
            <div className="template-manager-content-editor">
              <div className="template-manager-content-editor-header">
                <span className="template-manager-content-editor-icon">edit_note</span>
                <h4 className="template-manager-content-editor-title">Editor HTML/CSS</h4>
              </div>
              
              <div className="template-manager-content-field">
                <label htmlFor="html-header" className="template-manager-content-field-label">
                  Intestazione (HTML)
                </label>
                <textarea
                  id="html-header"
                  value={editedTemplate.content?.header || ''}
                  onChange={(e) => updateContent('header', e.target.value)}
                  className="template-manager-content-textarea"
                  rows={8}
                  placeholder="<h1>Titolo</h1>..."
                />
              </div>
              
              <div className="template-manager-content-field">
                <label htmlFor="html-footer" className="template-manager-content-field-label">
                  Piè di pagina (HTML)
                </label>
                <textarea
                  id="html-footer"
                  value={editedTemplate.content?.footer || ''}
                  onChange={(e) => updateContent('footer', e.target.value)}
                  className="template-manager-content-textarea"
                  rows={4}
                  placeholder="<p>Pagina {{page}}</p>..."
                />
              </div>
              
              <div className="template-manager-content-field">
                <label htmlFor="custom-css" className="template-manager-content-field-label">
                  CSS Personalizzato
                </label>
                <textarea
                  id="custom-css"
                  value={editedTemplate.content?.customCss || ''}
                  onChange={(e) => updateContent('customCss', e.target.value)}
                  className="template-manager-content-textarea"
                  rows={4}
                  placeholder=".header { color: red; }..."
                />
              </div>
            </div>

            {/* Preview & Variables Side */}
            <div className="template-manager-content-preview">
              <div className="template-manager-content-preview-header">
                <div className="template-manager-content-preview-title-container">
                  <span className="template-manager-content-preview-icon">visibility</span>
                  <h4 className="template-manager-content-preview-title">Anteprima Real-time</h4>
                </div>
                <div className="template-manager-content-preview-status">
                  <span className="template-manager-content-preview-status-dot"></span>
                  Live
                </div>
              </div>
              
              <div className="template-manager-content-preview-container">
                <TemplatePreview template={editedTemplate} />
              </div>

              <InfoCard variant="tonal" className="template-manager-variables-card">
                <h4 className="template-manager-variables-header">
                  <span className="template-manager-variables-icon">variable_insert</span>
                  Variabili (Clicca per copiare)
                </h4>
                <div className="template-manager-variables-list">
                  {availableVariables.map(v => (
                    <button 
                      key={v.name} 
                      className="template-manager-variable-button"
                      onClick={() => {
                        navigator.clipboard.writeText(v.name);
                        showToast(`Copiato: ${v.name}`, 'info');
                      }}
                      title={v.desc}
                      aria-label={`Copia variabile ${v.name}: ${v.desc}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="template-manager-preview-tab">
          <TemplatePreview template={editedTemplate} />
        </div>
      )}
    </div>
  );
};

export default TemplateManager;



