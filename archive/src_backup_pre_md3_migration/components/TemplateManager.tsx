// LEGACY - MD3 Non-compliant
// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
import React, { useState, useMemo } from 'react';
import { DocumentTemplate } from '../types';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, TextField, SelectField, TextArea } from './ui';
import { generateTemplateWithAi } from '../services/aiService';
import { useTheme } from '../theme/theme';

interface TemplateManagerProps {
  onClose: () => void;
  onApplyTemplate?: (template: DocumentTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose, onApplyTemplate }) => {
  const { layers } = useTheme();
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
      <M3DialogContent style={{ padding: 0 }}>
        <div style={{display: "flex", flexDirection: "column", padding: layers.ref.spacing['16']}}>
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
                <div style={{display: "flex", gap: layers.ref.spacing['12'], marginBottom: layers.ref.spacing['16']}}>
                  <div style={{ flex: 1 }}>
                    <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], backgroundColor: "layers.sys.colors.surface-container", borderRadius: "layers.ref.shape.corner.full", padding: `${layers.ref.spacing['8']} ${layers.ref.spacing['12']}`}}>
                      <span style={{color: "layers.sys.colors.on-surface-variant", fontSize: "1.5rem"}}>search</span>
                      <input
                        type="text"
                        placeholder="Cerca template..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{border: "none", backgroundColor: "transparent", width: "100%", color: "layers.sys.colors.on-surface", fontSize: ref.spacing[16], outline: "none"}}
                      />
                    </div>
                  </div>
                  <M3Button
                    onClick={handleCreateTemplate}
                    variant="filled"
                    style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}
                  >
                    <span  style={{ marginRight: "0.5rem" }}>add</span>
                    Nuovo Template
                  </M3Button>
                </div>

                {/* Lista template raggruppati */}
                <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['16']}}>
                  {Object.keys(groupedTemplates).length === 0 ? (
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: layers.ref.spacing['32'], gap: layers.ref.spacing['16']}}>
                      <span style={{fontSize: ref.spacing[48], color: "layers.sys.colors.outline-variant"}}>description</span>
                      <h3 style={{fontSize: "var(--md-sys-typescale-title-medium)", fontWeight: "500", color: "layers.sys.colors.on-surface"}}>
                        {searchTerm ? 'Nessun template trovato' : 'Nessun template creato'}
                      </h3>
                      <p style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface-variant"}}>
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
                      <div key={groupName} style={{ display: "flex", flexDirection: "column" }}>
                        <SectionHeader 
                          title={groupName} 
                          subtitle={`${groupTemplates.length} template disponibili`}
                          style={{marginBottom: layers.ref.spacing['8']}}
                        />
                        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: layers.ref.spacing['12']}}>
                          {groupTemplates.map(template => (
                            <InfoCard
                              key={template.id}
                              variant="elevated"
                              style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
                            >
                              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: layers.ref.spacing['12']}}>
                                <div style={{flex: 1, display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                                  <h4 style={{fontSize: "var(--md-sys-typescale-title-small)", fontWeight: "500", color: "layers.sys.colors.on-surface", margin: 0}}>
                                    {template.name}
                                  </h4>
                                  <span className={`template-manager-template-type-badge ${template.type === 'student_profile' ? 'template-manager-template-type-badge.student-profile' : template.type === 'lesson_plan' ? 'template-manager-template-type-badge.lesson-plan' : 'template-manager-template-type-badge.uda'}`}>
                                    {getTypeLabel(template.type)}
                                  </span>
                                </div>
                                <div style={{display: "flex", gap: layers.ref.spacing['4']}}>
                                  <M3Button
                                    onClick={() => setEditingTemplate(template)}
                                    variant="text"
                                    
                                    title={`Modifica template ${template.name}`}
                                  >
                                    <span >edit</span>
                                  </M3Button>
                                  <M3Button
                                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                                    variant="text"
                                    
                                    title={`Elimina template ${template.name}`}
                                  >
                                    <span >delete</span>
                                  </M3Button>
                                </div>
                              </div>

                              {template.description && (
                                <p style={{fontSize: "var(--md-sys-typescale-body-small)", color: "layers.sys.colors.on-surface-variant", marginBottom: layers.ref.spacing['12']}}>
                                  {template.description}
                                </p>
                              )}

                              <div style={{fontSize: "0.75rem", color: "layers.sys.colors.outline-variant", marginBottom: layers.ref.spacing['12']}}>
                                Aggiornato: {new Date(template.updatedAt).toLocaleDateString('it-IT')}
                              </div>

                              {onApplyTemplate && (
                                <M3Button
                                  onClick={() => handleApplyTemplate(template)}
                                  variant="tonal"
                                  
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
      style={{border: "1px solid layers.sys.colors.outline", height: "100%", display: "flex", flexDirection: "column" }}
      aria-label="Anteprima del documento"
      role="region"
    >
      <div style={{backgroundColor: "layers.sys.colors.surface-container-low", padding: layers.ref.spacing['8'], borderBottom: "1px solid layers.sys.colors.outline", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span style={{ color: sys.colors.[10px] }} style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.5", marginLeft: "0.5rem" }}>Simulazione Documento</span>
        <div style={{display: "flex", gap: layers.ref.spacing['4']}}>
          <div style={{backgroundColor: "layers.sys.colors.error", width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999] }}></div>
          <div style={{backgroundColor: "layers.sys.colors.warning", width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999] }}></div>
          <div style={{backgroundColor: "layers.sys.colors.success", width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999] }}></div>
        </div>
      </div>
      <div style={{ color: "black", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)", padding: layers.ref.spacing['6'], backgroundColor: "white", overflowY: "auto", flex: "1"}}>
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
        
        <div style={{margin: `${layers.ref.spacing['12']} 0`, padding: layers.ref.spacing['16'], border: `2px dashed ${layers.sys.colors.outlineVariant}`, borderRadius: layers.ref.shape.corner.medium, color: layers.sys.colors.outline, backgroundColor: layers.sys.colors.surfaceContainerLow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span  style={{ fontSize: "1.875rem", marginBottom: layers.ref.spacing['8']}}>description</span>
          <p style={{ fontSize: "0.75rem", fontWeight: "500" }}>Contenuto del Documento</p>
          <p style={{ color: sys.colors.[9px] }} style={{marginTop: layers.ref.spacing['4'], marginBottom: layers.ref.spacing['8']}}>(Simulazione corpo del documento)</p>
          
          <div style={{paddingLeft: layers.ref.spacing['16'], paddingRight: layers.ref.spacing['16'], width: "100%", gap: layers.ref.spacing['3']}}>
            {template.type === 'student_profile' && (
              <>
                <div style={{backgroundColor: "layers.sys.colors.outline-variant", width: "75%", height: "0.5rem", borderRadius: "0.375rem" }}></div>
                <div style={{backgroundColor: "layers.sys.colors.outline-variant", width: "50%", height: "0.5rem", borderRadius: "0.375rem" }}></div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: layers.ref.spacing['8'], marginTop: layers.ref.spacing['4']}}>
                  <div style={{backgroundColor: "layers.sys.colors.surface-container-high", height: ref.spacing[48], borderRadius: "0.375rem", border: "1px solid layers.sys.colors.outline"}}></div>
                  <div style={{backgroundColor: "layers.sys.colors.surface-container-high", height: ref.spacing[48], borderRadius: "0.375rem", border: "1px solid layers.sys.colors.outline"}}></div>
                  <div style={{backgroundColor: "layers.sys.colors.surface-container-high", height: ref.spacing[48], borderRadius: "0.375rem", border: "1px solid layers.sys.colors.outline"}}></div>
                </div>
              </>
            )}
            {template.type === 'lesson_plan' && (
              <>
                <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{height: ref.spacing[16], borderRadius: "0.375rem", marginBottom: layers.ref.spacing['8']}}></div>
                <div style={{gap: layers.ref.spacing['2']}}>
                  <div style={{display: "flex", gap: layers.ref.spacing['8']}}><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline)] }} style={{width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999], marginTop: layers.ref.spacing['4']}}></div><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{ height: "0.5rem", borderRadius: "0.375rem", flex: "1" }}></div></div>
                  <div style={{display: "flex", gap: layers.ref.spacing['8']}}><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline)] }} style={{width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999], marginTop: layers.ref.spacing['4']}}></div><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{ height: "0.5rem", borderRadius: "0.375rem", flex: "1" }}></div></div>
                  <div style={{display: "flex", gap: layers.ref.spacing['8']}}><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline)] }} style={{width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999], marginTop: layers.ref.spacing['4']}}></div><div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{ height: "0.5rem", borderRadius: "0.375rem", flex: "1" }}></div></div>
                </div>
              </>
            )}
            {template.type === 'uda' && (
              <>
                <div style={{ overflow: "hidden", border: "1px solid layers.sys.colors.outline", borderRadius: "0.375rem"}}>
                  <div style={{backgroundColor: "layers.sys.colors.surface-container-high", height: "1.5rem", borderBottom: "1px solid layers.sys.colors.outline"}}></div>
                  <div style={{padding: layers.ref.spacing['8'], gap: layers.ref.spacing['2']}}>
                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{ height: "0.5rem", borderRadius: "0.375rem" }}></div>
                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-outline-variant)] }} style={{ height: "0.5rem", borderRadius: "0.375rem" }}></div>
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
    <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['16']}}>
      {/* Header Editor */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid layers.sys.colors.outline-variant", paddingBottom: layers.ref.spacing['12'], marginBottom: layers.ref.spacing['16']}}>
        <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
          <M3Button 
            onClick={() => setActiveTab('config')} 
            variant={activeTab === 'config' ? 'filled' : 'text'}
            
          >
            Configurazione
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('content')} 
            variant={activeTab === 'content' ? 'filled' : 'text'}
            
          >
            Contenuto HTML
          </M3Button>
          <M3Button 
            onClick={() => setActiveTab('preview')} 
            variant={activeTab === 'preview' ? 'filled' : 'text'}
            
          >
            Anteprima
          </M3Button>
        </div>
        
        <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
          <M3Button onClick={onCancel} variant="text" >
            Annulla
          </M3Button>
          <M3Button onClick={handleSave} variant="filled" >
            Salva
          </M3Button>
        </div>
      </div>

      {activeTab === 'config' && (
        <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['16'], paddingRight: layers.ref.spacing['16']}}>
          {/* Informazioni base */}
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: layers.ref.spacing['16'], marginBottom: layers.ref.spacing['16']}}>
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
          <InfoCard variant="tonal" >
            <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['12']}}>
              <span style={{ fontSize: "1.5rem" }}>auto_awesome</span>
              <h4 style={{margin: 0, fontSize: "var(--md-sys-typescale-title-small)"}}>Genera con AI</h4>
            </div>
            <div style={{display: "flex", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['12']}}>
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
                
                aria-label={isGenerating ? 'Generazione in corso...' : 'Genera template con AI'}
              >
                {isGenerating ? '...' : 'Genera'}
              </M3Button>
            </div>
            <p style={{fontSize: "0.75rem", color: "layers.sys.colors.outline-variant", margin: 0}}>
              L'AI creer� automaticamente l'intestazione, il pi� di pagina e le configurazioni ottimali.
            </p>
          </InfoCard>

          {/* Configurazioni specifiche */}
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: layers.ref.spacing['16']}}>
            <InfoCard variant="elevated" >
              <h4 style={{margin: 0, marginBottom: layers.ref.spacing['12'], fontSize: "var(--md-sys-typescale-title-small)"}}>Opzioni Visibilità</h4>
              <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                {editedTemplate.type === 'student_profile' && (
                  <>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluations ?? true}
                        onChange={(e) => updateConfig('includeEvaluations', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi valutazioni</span>
                    </label>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeCompetencyEvaluations ?? true}
                        onChange={(e) => updateConfig('includeCompetencyEvaluations', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi competenze</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'lesson_plan' && (
                  <>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeObjectives ?? true}
                        onChange={(e) => updateConfig('includeObjectives', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi obiettivi</span>
                    </label>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeMaterials ?? true}
                        onChange={(e) => updateConfig('includeMaterials', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi materiali</span>
                    </label>
                  </>
                )}
                {editedTemplate.type === 'uda' && (
                  <>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includePhases ?? true}
                        onChange={(e) => updateConfig('includePhases', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi fasi</span>
                    </label>
                    <label style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                      <input
                        type="checkbox"
                        checked={editedTemplate.config.includeEvaluation ?? true}
                        onChange={(e) => updateConfig('includeEvaluation', e.target.checked)}
                        style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                      />
                      <span style={{fontSize: "var(--md-sys-typescale-body-medium)", color: "layers.sys.colors.on-surface"}}>Includi valutazione</span>
                    </label>
                  </>
                )}
              </div>
            </InfoCard>

            <InfoCard variant="elevated" >
              <h4 style={{margin: 0, marginBottom: layers.ref.spacing['12'], fontSize: "var(--md-sys-typescale-title-small)"}}>Sezioni Personalizzate</h4>
              <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                {(editedTemplate.config.customSections || []).map((section, idx) => (
                  <div key={idx} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => {
                        const newSections = [...(editedTemplate.config.customSections || [])];
                        newSections[idx] = e.target.value;
                        updateConfig('customSections', newSections);
                      }}
                      style={{flex: 1, padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline", borderRadius: "layers.ref.shape.corner.small", backgroundColor: "layers.sys.colors.surface"}}
                    />
                    <button 
                      onClick={() => {
                        const newSections = (editedTemplate.config.customSections || []).filter((_, i) => i !== idx);
                        updateConfig('customSections', newSections);
                      }}
                      style={{padding: 0, backgroundColor: "transparent", border: "none", cursor: "pointer", color: "layers.sys.colors.error"}}
                      aria-label={`Elimina sezione ${section}`}
                    >
                      <span >delete</span>
                    </button>
                  </div>
                ))}
                <M3Button 
                  onClick={() => updateConfig('customSections', [...(editedTemplate.config.customSections || []), 'Nuova Sezione'])}
                  variant="text"
                  
                >
                  + Aggiungi Sezione
                </M3Button>
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div style={{display: "flex", paddingRight: layers.ref.spacing['16']}}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: layers.ref.spacing['16'], width: "100%"}}>
            {/* Editor Side */}
            <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['12']}}>
              <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                <span style={{ fontSize: "1.5rem" }}>edit_note</span>
                <h4 style={{margin: 0, fontSize: "var(--md-sys-typescale-title-small)"}}>Editor HTML/CSS</h4>
              </div>
              
              <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                <label htmlFor="html-header" style={{fontSize: "var(--md-sys-typescale-label-medium)", fontWeight: "500", color: "layers.sys.colors.on-surface"}}>
                  Intestazione (HTML)
                </label>
                <textarea
                  id="html-header"
                  value={editedTemplate.content?.header || ''}
                  onChange={(e) => updateContent('header', e.target.value)}
                  style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline", borderRadius: "layers.ref.shape.corner.small", backgroundColor: "layers.sys.colors.surface-container-low", fontFamily: "monospace", fontSize: "0.875rem", color: "layers.sys.colors.on-surface", resize: "vertical"}}
                  rows={8}
                  placeholder="<h1>Titolo</h1>..."
                />
              </div>
              
              <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                <label htmlFor="html-footer" style={{fontSize: "var(--md-sys-typescale-label-medium)", fontWeight: "500", color: "layers.sys.colors.on-surface"}}>
                  Piè di pagina (HTML)
                </label>
                <textarea
                  id="html-footer"
                  value={editedTemplate.content?.footer || ''}
                  onChange={(e) => updateContent('footer', e.target.value)}
                  style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline", borderRadius: "layers.ref.shape.corner.small", backgroundColor: "layers.sys.colors.surface-container-low", fontFamily: "monospace", fontSize: "0.875rem", color: "layers.sys.colors.on-surface", resize: "vertical"}}
                  rows={4}
                  placeholder="<p>Pagina {{page}}</p>..."
                />
              </div>
              
              <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                <label htmlFor="custom-css" style={{fontSize: "var(--md-sys-typescale-label-medium)", fontWeight: "500", color: "layers.sys.colors.on-surface"}}>
                  CSS Personalizzato
                </label>
                <textarea
                  id="custom-css"
                  value={editedTemplate.content?.customCss || ''}
                  onChange={(e) => updateContent('customCss', e.target.value)}
                  style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline", borderRadius: "layers.ref.shape.corner.small", backgroundColor: "layers.sys.colors.surface-container-low", fontFamily: "monospace", fontSize: "0.875rem", color: "layers.sys.colors.on-surface", resize: "vertical"}}
                  rows={4}
                  placeholder=".header { color: red; }..."
                />
              </div>
            </div>

            {/* Preview & Variables Side */}
            <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['12']}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                  <span style={{ fontSize: "1.5rem" }}>visibility</span>
                  <h4 style={{margin: 0, fontSize: "var(--md-sys-typescale-title-small)"}}>Anteprima Real-time</h4>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['4'], fontSize: "0.75rem", color: "layers.sys.colors.outline-variant"}}>
                  <span style={{width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: "layers.sys.colors.tertiary"}}></span>
                  Live
                </div>
              </div>
              
              <div style={{maxHeight: ref.spacing[600], overflow: "auto", borderRadius: "layers.ref.shape.corner.medium", border: "1px solid layers.sys.colors.outline-variant"}}>
                <TemplatePreview template={editedTemplate} />
              </div>

              <InfoCard variant="tonal" >
                <h4 style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], margin: 0, marginBottom: layers.ref.spacing['12'], fontSize: "var(--md-sys-typescale-title-small)"}}>
                  <span style={{ fontSize: "1.25rem" }}>variable_insert</span>
                  Variabili (Clicca per copiare)
                </h4>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: layers.ref.spacing['8']}}>
                  {availableVariables.map(v => (
                    <button 
                      key={v.name} 
                      style={{padding: layers.ref.spacing['8'], backgroundColor: "layers.sys.colors.surface-container", border: "1px solid layers.sys.colors.outline-variant", borderRadius: "layers.ref.shape.corner.small", cursor: "pointer", fontSize: "0.75rem", fontFamily: "monospace", color: "layers.sys.colors.on-surface-variant", transition: "all 0.2s ease-in-out"}}
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
        <div style={{display: "flex", justifyContent: "center", paddingRight: layers.ref.spacing['16']}}>
          <TemplatePreview template={editedTemplate} />
        </div>
      )}
    </div>
  );
};

export default TemplateManager;




