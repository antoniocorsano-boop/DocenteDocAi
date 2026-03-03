// MD3 Compliant - Piano Inclusione Editor
import React, { useState } from 'react';
import { PianoInclusione, PianoInclusioneEditorProps } from '../types';
import { getPIPSuggestion } from '../services/aiService';
import { 

    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
    TextArea, 
    InfoCard,
    SectionHeader,
    AiThinkingGem 
} from './ui';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for inclusion plan editor dialog, form sections, and AI generation features
type SectionKey = 'puntiDiForza' | 'areeDiIntervento' | 'misureCompensative' | 'misureDispensative' | 'criteriValutazionePersonalizzati';

const createEmptyPiano = (studentId: string): PianoInclusione => ({
    id: studentId,
    puntiDiForza: '',
    areeDiIntervento: '',
    misureCompensative: '',
    misureDispensative: '',
    criteriValutazionePersonalizzati: '',
    obiettiviPerMateria: {},
});

const PianoInclusioneEditor: React.FC<PianoInclusioneEditorProps> = ({ student, existingPiano, onClose, onSave, onDeletePiano, aiSettings, evaluations, competencyEvaluations, settings, showToast }) => {
  const [piano, setPiano] = useState<PianoInclusione>(existingPiano || createEmptyPiano(student.id));
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    const handleChange = (field: SectionKey, value: string) => {
        setPiano(prev => ({ ...prev, [field]: value }));
    };

    const handleMateriaChange = (materia: string, value: string) => {
        setPiano(prev => ({
            ...prev,
            obiettiviPerMateria: {
                ...(prev.obiettiviPerMateria || {}),
                [materia]: value
            }
        }));
    };

    const handleGenerateText = async (section: string) => {
        setLoadingSection(section);
        try {
            const studentEvaluations = evaluations.filter(e => e.studenteId === student.id);
            const studentCompetencies = competencyEvaluations.filter(e => e.studenteId === student.id);
            
            const text = await getPIPSuggestion(
                aiSettings,
                student,
                studentEvaluations,
                studentCompetencies,
                settings.competenze,
                section
            );

            if (section.startsWith('obj-')) {
                const materia = section.replace('obj-', '');
                handleMateriaChange(materia, text);
            } else {
                handleChange(section as SectionKey, text);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error generating text for ${section}`, error);
            } else {
                console.error(`Error generating text for ${section}`, String(error));
            }
            showToast("Si è verificato un errore durante la generazione del testo.", "error");
        } finally {
            setLoadingSection(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(piano);
        showToast("Piano di Inclusione salvato con successo!", "success");
        onClose();
    };

    const handleDelete = () => {
        onDeletePiano(student.id);
        onClose();
    }

    const sections: { key: SectionKey; label: string; placeholder: string; }[] = [
        { key: 'puntiDiForza', label: 'Punti di Forza', placeholder: "Descrivere le abilità e le aree in cui lo studente eccelle..." },
        { key: 'areeDiIntervento', label: 'Aree di Intervento e Fragilità', placeholder: "Descrivere le difficoltà, le aree di potenziamento e gli obiettivi specifici..." },
        { key: 'misureCompensative', label: 'Misure Compensative', placeholder: "Elencare gli strumenti e le strategie per compensare le difficoltà (es. mappe concettuali, calcolatrice)..." },
        { key: 'misureDispensative', label: 'Misure Dispensative', placeholder: "Elencare le attività da cui lo studente è dispensato (es. lettura ad alta voce, tempo ridotto)..." },
        { key: 'criteriValutazionePersonalizzati', label: 'Criteri di Valutazione Personalizzati', placeholder: "Descrivere come verranno adattate le verifiche e le valutazioni..." }
    ];

    return (
        <M3Dialog
            title="Piano di Inclusione"
            onClose={onClose}
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} >
                <M3DialogContent >
                    {/* Subtitle */}
                    <div >
                        <SectionHeader 
                            title={`${student.cognome} ${student.nome}`}
                            subtitle={`Classe ${student.classe} • Redazione Piano di Inclusione Personalizzato`}
                            variant="small"
                        />
                    </div>

                    {/* Sections */}
                    <div >
                        {sections.map(section => (
                            <InfoCard key={section.key} variant="elevated" >
                                <div >
                                    <h3 >
                                        {section.label}
                                    </h3>
                                    <M3Button
                                        type="button"
                                        onClick={() => handleGenerateText(section.key)}
                                        disabled={loadingSection === section.key}
                                        variant="tonal"
                                        size="small"
                                        
                                    >
                                        {loadingSection === section.key ? (
                                            <AiThinkingGem size="small" inline text="Generando..." />
                                        ) : (
                                            <>
                                                <span  style={{ fontSize: "var(--md-sys-typescale-body-medium-size)" }}>auto_awesome</span>
                                                AI
                                            </>
                                        )}
                                    </M3Button>
                                </div>
                                <TextArea
                                    id={section.key}
                                    label=""
                                    value={piano[section.key]}
                                    onChange={e => handleChange(section.key, e.target.value)}
                                    rows={5}
                                    placeholder={section.placeholder}
                                    
                                />
                            </InfoCard>
                        ))}

                        {/* Obiettivi per Materia */}
                        <InfoCard variant="elevated" >
                            <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                                <span  style={{color: "var(--md-sys-color-primary)"}}>subject</span>
                                <h3 style={{fontSize: "var(--md-sys-typescale-body-medium-size)", fontWeight: "var(--md-sys-typescale-weight-bold)", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.05em"}}>
                                    Obiettivi per Materia (PEI/PDP)
                                </h3>
                            </div>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontSize: "var(--md-sys-typescale-body-small-size)", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                Definire gli obiettivi minimi o differenziati per ciascuna disciplina, se previsto dal piano.
                            </p>
                            
                            <div >
                                {settings.disciplines.map(materia => (
                                    <div key={materia} >
                                        <div >
                                            <label >
                                                <span style={{ color: "var(--md-sys-color-primary)" }}>book</span>
                                                {materia}
                                            </label>
                                            <M3Button
                                                type="button"
                                                onClick={() => handleGenerateText(`obj-${materia}`)}
                                                disabled={loadingSection === `obj-${materia}`}
                                                variant="text"
                                                size="small"
                                                
                                            >
                                                {loadingSection === `obj-${materia}` ? (
                                                    <AiThinkingGem size="small" inline />
                                                ) : (
                                                    <span style={{ color: 'var(--md-sys-color-primary)' ,  fontSize: "var(--md-sys-typescale-body-medium-size)" }}>auto_awesome</span>
                                                )}
                                            </M3Button>
                                        </div>
                                        <TextArea
                                            id={`obj-${materia}`}
                                            label=""
                                            value={piano.obiettiviPerMateria?.[materia] || ''}
                                            onChange={e => handleMateriaChange(materia, e.target.value)}
                                            rows={3}
                                            placeholder={`Obiettivi per ${materia}...`}
                                            
                                        />
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </div>
                </M3DialogContent>

                {/* Actions */}
                <M3DialogActions >
                    {existingPiano && (
                        <M3Button
                            type="button"
                            onClick={handleDelete}
                            variant="outlined"
                            
                        >
                            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>delete</span>
                            Elimina
                        </M3Button>
                    )}
                    <M3Button
                        type="button"
                        onClick={onClose}
                        variant="text"
                    >
                        Annulla
                    </M3Button>
                    <M3Button
                        type="submit"
                        variant="filled"
                        
                    >
                        Salva Piano
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default PianoInclusioneEditor;

