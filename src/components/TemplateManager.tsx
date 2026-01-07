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
      <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
        <div className="p-6 space-y-6">
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
                <div className="flex items-center justify-between gap-8">
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
                        className="w-full pl-10 pr-4 py-4 border border-outline rounded-lg focus:border-primary focus:outline-none bg-surface"
                      />
                    </div>
                  </div>
                  <M3Button
                    onClick={handleCreateTemplate}
                    variant="filled"
                  >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Nuovo Template
                  </M3Button>
                </div>

                {/* Lista template raggruppati */}
                <div className="space-y-8">
                  {Object.keys(groupedTemplates).length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-8">
                        description
                      </span>
                      <h3 className="text-lg font-medium text-on-surface mb-8">
                        {searchTerm ? 'Nessun template trovato' : 'Nessun template creato'}
                      </h3>
                      <p className="text-on-surface-variant mb-8">
                        {searchTerm
                          ? 'Prova a modificare i termini di ricerca'
                          : 'Crea il tuo primo template per personalizzare i documenti'
                        }
                      </p>
                      {!searchTerm && (
                        <M3Button
                          onClick={handleCreateTemplate}
                          variant="filled"
                        >
                          Crea il primo template
                        </M3Button>
                      )}
                    </div>
                  ) : (
                    Object.entries(groupedTemplates).map(([groupName, groupTemplates]) => (
                      <div key={groupName}>
                        <SectionHeader 
                          title={groupName} 
                          subtitle={`${groupTemplates.length} template disponibili`}
                          className="mb-8"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {groupTemplates.map(template => (
                            <InfoCard
                              key={template.id}
                              variant="elevated"
                              className="p-8 hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-on-surface truncate mb-4">
                                    {template.name}
                                  </h4>
                                  <span className={`inline-block px-4 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${getTypeColor(template.type)}`}>
                                    {getTypeLabel(template.type)}
                                  </span>
                                </div>
                                <div className="flex gap-4 ml-2">
                                  <M3Button
                                    onClick={() => setEditingTemplate(template)}
                                    variant="text"
                                    className="!min-w-0 !p-1"
                                    title={`Modifica template ${template.name}`}
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                  </M3Button>
                                  <M3Button
                                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                                    variant="text"
                                    className="!min-w-0 !p-1 text-error"
                                    title={`Elimina template ${template.name}`}
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </M3Button>
                                </div>
                              </div>

                              {template.description && (
                                <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">
                                  {template.description}
                                </p>
                              )}

                              <div className="text-[10px] text-on-surface-variant mb-6 opacity-70">
                                Aggiornato: {new Date(template.updatedAt).toLocaleDateString('it-IT')}
                              </div>

                              {onApplyTemplate && (
                                <M3Button
                                  onClick={() => handleApplyTemplate(template)}
                                  variant="tonal"
                                  className="w-full !py-1 text-xs"
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
      className="p-0 overflow-hidden border-outline/50 h-full flex flex-col"
      aria-label="Anteprima del documento"
      role="region"
    >
      <div className="bg-surface-container-low p-8 border-b border-outline/30 flex items-center justify-between shrink-0">
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
        
        <div className="my-6 py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
          <span className="material-symbols-outlined text-3xl mb-8">description</span>
          <p className="text-xs font-medium">Contenuto del Documento</p>
          <p className="text-[9px] mt-4 mb-8">(Simulazione corpo del documento)</p>
          
          <div className="w-full px-8 space-y-3">
            {template.type === 'student_profile' && (
              <>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-8 mt-4">
                  <div className="h-12 bg-gray-100 rounded border border-gray-200"></div>
                  <div className="h-12 bg-gray-100 rounded border border-gray-200"></div>
                  <div className="h-12 bg-gray-100 rounded border border-gray-200"></div>
                </div>
              </>
            )}
            {template.type === 'lesson_plan' && (
              <>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="space-y-2">
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-gray-300 mt-4"></div><div className="h-2 bg-gray-200 rounded flex-1"></div></div>
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-gray-300 mt-4"></div><div className="h-2 bg-gray-200 rounded flex-1"></div></div>
                  <div className="flex gap-8"><div className="w-2 h-2 rounded-full bg-gray-300 mt-4"></div><div className="h-2 bg-gray-200 rounded flex-1"></div></div>
                </div>
              </>
            )}
            {template.type === 'uda' && (
              <>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="bg-gray-100 h-6 border-b border-gray-200"></div>
                  <div className="p-8 space-y-2">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
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
      showToast('Il nome del template Ã¨ obbligatorio', 'error');
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
    <div className="space-y-6">
      {/* Header Editor */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex gap-8">
          <M3Button 
            onClick={() => setActiveTab('config')} 
            variant={activeTab === 'config' ? 'filled' : 'text'}
            className="!py-1"
          >
            Configurazione
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('content')} 
            variant={activeTab === 'content' ? 'filled' : 'text'}
            className="!py-1"
          >
            Contenuto HTML
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('preview')} 
            variant={activeTab === 'preview' ? 'filled' : 'text'}
            className="!py-1"
          >
            Anteprima
          </M3Button>
        </div>
        
        <div className="flex gap-8">
          <M3Button onClick={onCancel} variant="text" className="!py-1">
            Annulla
          </M3Button>
          <M3Button onClick={handleSave} variant="filled" className="!py-1">
            Salva
          </M3Button>
        </div>
      </div>

      {activeTab === 'config' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Informazioni base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <InfoCard variant="tonal" className="p-8 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-8 mb-6">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h4 className="font-bold text-primary text-sm">Genera con AI</h4>
            </div>
            <div className="flex gap-8">
              <TextField
                id="ai-prompt"
                label="Prompt AI"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Es: Un template elegante per UDA con focus su inclusione..."
                containerClassName="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateWithAi()}
              />
              <M3Button 
                onClick={handleGenerateWithAi} 
                disabled={isGenerating || !aiPrompt.trim()}
                variant="filled"
                className="mt-6 !py-4"
                aria-label={isGenerating ? 'Generazione in corso...' : 'Genera template con AI'}
              >
                {isGenerating ? '...' : 'Genera'}
              </M3Button>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-4">
              L'AI creerà automaticamente l'intestazione, il piè di pagina e le configurazioni ottimali.
            </p>
          </InfoCard>

          {/* Configurazioni specifiche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard variant="elevated" style={{ padding: 'var(--md-sys-spacing-6)' }}>
              <h4 className="font-bold text-sm mb-8">Opzioni Visibilità</h4>
              <div className="space-y-3">
                {editedTemplate.type === 'student_profile' && (
                  <>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluations ?? true}
                        onChange={(e) => updateConfig('includeEvaluations', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi valutazioni</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeCompetencyEvaluations ?? true}
                        onChange={(e) => updateConfig('includeCompetencyEvaluations', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi competenze</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'lesson_plan' && (
                  <>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeObjectives ?? true}
                        onChange={(e) => updateConfig('includeObjectives', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi obiettivi</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeMaterials ?? true}
                        onChange={(e) => updateConfig('includeMaterials', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi materiali</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'uda' && (
                  <>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includePhases ?? true}
                        onChange={(e) => updateConfig('includePhases', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi fasi</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluation ?? true}
                        onChange={(e) => updateConfig('includeEvaluation', e.target.checked)}
                        className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">Includi valutazione</span>
                    </label>
                  </>
                )}
              </div>
            </InfoCard>

            <InfoCard variant="elevated" style={{ padding: 'var(--md-sys-spacing-6)' }}>
              <h4 className="font-bold text-sm mb-8">Sezioni Personalizzate</h4>
              <div className="space-y-2">
                {(editedTemplate.config.customSections || []).map((section, idx) => (
                  <div key={idx} className="flex items-center gap-8">
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => {
                        const newSections = [...(editedTemplate.config.customSections || [])];
                        newSections[idx] = e.target.value;
                        updateConfig('customSections', newSections);
                      }}
                      className="flex-1 px-4 py-1 border border-outline rounded bg-surface text-xs"
                    />
                    <button 
                      onClick={() => {
                        const newSections = (editedTemplate.config.customSections || []).filter((_, i) => i !== idx);
                        updateConfig('customSections', newSections);
                      }}
                      className="text-error hover:bg-error/10 p-1 rounded"
                      aria-label={`Elimina sezione ${section}`}
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
                <M3Button 
                  onClick={() => updateConfig('customSections', [...(editedTemplate.config.customSections || []), 'Nuova Sezione'])}
                  variant="text"
                  className="w-full !py-1 text-[10px]"
                >
                  + Aggiungi Sezione
                </M3Button>
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor Side */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-8 mb-8">
                <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                <h4 className="font-bold text-sm">Editor HTML/CSS</h4>
              </div>
              
              <div>
                <label htmlFor="html-header" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-4">
                  Intestazione (HTML)
                </label>
                <textarea
                  id="html-header"
                  value={editedTemplate.content?.header || ''}
                  onChange={(e) => updateContent('header', e.target.value)}
                  className="w-full px-3 py-4 border border-outline rounded-lg focus:border-primary focus:outline-none bg-surface font-mono text-[11px] leading-relaxed"
                  rows={8}
                  placeholder="<h1>Titolo</h1>..."
                />
              </div>
              
              <div>
                <label htmlFor="html-footer" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-4">
                  PiÃ¨ di pagina (HTML)
                </label>
                <textarea
                  id="html-footer"
                  value={editedTemplate.content?.footer || ''}
                  onChange={(e) => updateContent('footer', e.target.value)}
                  className="w-full px-3 py-4 border border-outline rounded-lg focus:border-primary focus:outline-none bg-surface font-mono text-[11px] leading-relaxed"
                  rows={4}
                  placeholder="<p>Pagina {{page}}</p>..."
                />
              </div>
              
              <div>
                <label htmlFor="custom-css" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-4">
                  CSS Personalizzato
                </label>
                <textarea
                  id="custom-css"
                  value={editedTemplate.content?.customCss || ''}
                  onChange={(e) => updateContent('customCss', e.target.value)}
                  className="w-full px-3 py-4 border border-outline rounded-lg focus:border-primary focus:outline-none bg-surface font-mono text-[11px] leading-relaxed"
                  rows={4}
                  placeholder=".header { color: red; }..."
                />
              </div>
            </div>

            {/* Preview & Variables Side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8">
                  <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                  <h4 className="font-bold text-sm">Anteprima Real-time</h4>
                </div>
                <div 
                  className="flex items-center gap-2.5 px-4 py-0.5 rounded-full bg-success/10 text-success text-[9px] font-black uppercase tracking-wider animate-pulse"
                  aria-live="polite"
                  role="status"
                >
                  <span className="w-1 h-1 rounded-full bg-success"></span>
                  Live
                </div>
              </div>
              
              <div className="h-[450px]">
                <TemplatePreview template={editedTemplate} />
              </div>

              <InfoCard variant="tonal" style={{ padding: 'var(--md-sys-spacing-5)' }}>
                <h4 className="font-bold text-[11px] mb-8 flex items-center gap-8">
                  <span className="material-symbols-outlined text-primary text-xs">variable_insert</span>
                  Variabili (Clicca per copiare)
                </h4>
                <div className="flex flex-wrap gap-2.5 max-h-[120px] overflow-y-auto">
                  {availableVariables.map(v => (
                    <button 
                      key={v.name} 
                      className="px-4 py-1 rounded bg-surface-container-low border border-outline/30 hover:border-primary/50 text-[10px] font-mono text-primary transition-colors"
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
        <div className="animate-in fade-in slide-in-from-bottom-2 h-[600px]">
          <TemplatePreview template={editedTemplate} />
        </div>
      )}
    </div>
  );
};

export default TemplateManager;

