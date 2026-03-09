// MD3 Compliant — Consiglio Classe Wizard

import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, TimetableSettings, AiSettings, Report, ValutazioneCompetenza, PeriodoValutazione } from '../types';
import { generateCouncilDataPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { M3Dialog, InfoCard } from './ui';
import {DialogContent, DialogActions, Button , FormControl, InputLabel, NativeSelect , Tabs, Tab, Badge, Box } from '@mui/material';

interface ConsiglioClasseWizardProps {
    onClose: () => void;
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveReport: (report: Report) => void;
}

const ConsiglioClasseWizard: React.FC<ConsiglioClasseWizardProps> = (props) => {
  const [step, setStep] = useState<1 | 2>(1);
    const [selectedClass, setSelectedClass] = useState<string>(props.userClasses[0] || '');
    const [periodo, setPeriodo] = useState<PeriodoValutazione>('primo-quadrimestre');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const classStudents = useMemo(() => {
        return props.students.filter(s => s.classe === selectedClass);
    }, [selectedClass, props.students]);
    
    const handleGeneratePdf = async () => {
        if (!selectedClass) return;
        setIsLoading(true);
        setLoadingMessage('Aggregazione dati e creazione PDF...');
        try {
            const blob = await generateCouncilDataPdf(
                selectedClass,
                periodo,
                classStudents,
                props.evaluations,
                props.competencyEvaluations,
                props.settings
            );
            viewPdfInNewTab(blob);
            props.onClose();
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Errore durante la generazione del PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <>
            <DialogContent style={{gap: 'var(--md-sys-spacing-6)'}}>
                <InfoCard 
                    title="Seleziona il contesto" 
                    description="Scegli la classe e il periodo di riferimento per il quale desideri generare il report." 
                    icon="tune"
                    variant="surface"
                    
                />
                
                                <FormControl sx={{ mb: 2 }}>
                  <InputLabel htmlFor="council-class-select">Classe</InputLabel>
                  <NativeSelect
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    inputProps={{ id: 'council-class-select' }}
                  >

                    {props.userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                
                  </NativeSelect>
                </FormControl>

                 <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                    <label  style={{color: "var(--md-sys-color-primary)", fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>Periodo di Valutazione</label>
                                        <Tabs
                      value={periodo}
                      onChange={(_, v: string) => ((id) => setPeriodo(id as PeriodoValutazione))(v)}
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="Sezioni di navigazione"
                      sx={{
                        bgcolor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        minHeight: 'auto',
                        p: 0.5,
                        ...{ width: 'var(--md-sys-percent-100)' },
                      }}
                    >
                      {([
                            { id: 'primo-quadrimestre', label: 'Primo Quadrimestre (1Q)' },
                            { id: 'secondo-quadrimestre', label: 'Scrutinio Finale (2Q)' }
                        ]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                        <Tab
                          key={tab.id}
                          value={tab.id}
                          id={`tab-${tab.id}`}
                          aria-controls={`panel-${tab.id}`}
                          data-testid={`tab-${tab.id}`}
                          label={(
                            <Badge badgeContent={tab.badge} color="error">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                {tab.label}
                              </Box>
                            </Badge>
                          )}
                          sx={{
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            minHeight: 'auto',
                            py: 1,
                            px: 2,
                            textTransform: 'uppercase',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                          }}
                        />
                      ))}
                    </Tabs>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={props.onClose}>Annulla</Button>
                <Button 
                    variant="contained" 
                    onClick={() => setStep(2)} 
                    disabled={!selectedClass}
                    endIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                >
                    Continua
                </Button>
            </DialogActions>
        </>
    );

    const renderStep2 = () => (
        <>
            <DialogContent style={{gap: 'var(--md-sys-spacing-6)'}}>
                <div style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary-container) 20%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-5)', border: `var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)`, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <p style={{fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", color: "var(--md-sys-color-primary)"}}>Context Active</p>
                        <h3 style={{ color: 'var(--md-sys-color-on-primary-container)' ,  fontWeight: "var(--md-sys-typescale-weight-black)" }}>{selectedClass} • {periodo === 'primo-quadrimestre' ? '1Q' : 'Finale'}</h3>
                    </div>
                    <Button variant="outlined" onClick={() => setStep(1)}  style={{ fontSize: "var(--md-sys-typescale-body-small-font-size)", fontWeight: "var(--md-sys-typescale-weight-bold)", textTransform: "uppercase" }}>Cambia</Button>
                </div>

                <div  style={{gap: 'var(--md-sys-spacing-3)'}}>
                    <button onClick={handleGeneratePdf} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' ,  transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', width: 'var(--md-sys-percent-100)', textAlign: "left" }}>
                        <div><span  style={{ transition: "transform var(--md-sys-motion-duration-medium)" }}>picture_as_pdf</span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <p>Tabellone Dati (PDF)</p>
                            <p>Medie, trend e rilevazioni competenze.</p>
                        </div>
                    </button>
                </div>
                
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , textAlign: "center", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>
                    Il report verrà generato e aperto in una nuova scheda del browser.
                </p>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={() => setStep(1)}>Indietro</Button>
            </DialogActions>
        </>
    );
    
    if (isLoading) {
        return (
             <M3Dialog
                 onClose={() => {}}
                 title=""
                 maxWidth="sm"
             >
                <DialogContent  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div  style={{borderRadius: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', width: 'var(--md-sys-spacing-4)', borderBottom: `var(--md-sys-border-width-thick) solid var(--md-sys-color-outline)`, borderColor: 'var(--md-sys-color-primary)', marginBottom: 'var(--md-sys-spacing-6)'}}></div>
                    <p  style={{fontWeight: "var(--md-sys-typescale-weight-black)", color: "var(--md-sys-color-primary)"}}>{loadingMessage}</p>
                </DialogContent>
            </M3Dialog>
        )
    }

    return (
        <M3Dialog
            onClose={props.onClose}
            title="Wizard Report Consiglio"
            maxWidth="xl"
        >
            {step === 1 ? renderStep1() : renderStep2()}
        </M3Dialog>
    );
};

export default ConsiglioClasseWizard;

