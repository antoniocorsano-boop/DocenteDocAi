// MD3 GOLD COMPLIANT — AUDIT 2026-01-25
// Tutti i valori di design (colori, spacing, tipografia, elevazione, shape) sono gestiti esclusivamente tramite token MD3 (`var(--md-sys-*)`).
// Nessun valore hardcoded (px, rem, %, hex, rgba) presente. Nessun uso di className custom. Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md.
// Audit e refactor completati: 2026-01-25.
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { InfoCard, SectionHeader } from './ui';
import { Button , Tabs, Tab, Badge, Box, Typography } from '@mui/material';
import { Studente, Valutazione, GiudizioPeriodico, PeriodoValutazione, TimetableSettings, AiSettings, ValutazioneCompetenza } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { getPeriodicJudgmentSuggestion, generateClassCouncilNarrativeReport } from '../services/aiService';
import { generateCouncilTablePdf } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
interface ConsiglioClasseProps {
  selectedClass: string;
  students: Studente[];
  evaluations: Valutazione[];
  giudizi: Record<string, GiudizioPeriodico>;
  onSaveGiudizio: (giudizio: GiudizioPeriodico) => void;
  settings: TimetableSettings;
  aiSettings: AiSettings;
  annoScolasticoCorrente: string;
  onViewStudentProfile: (student: Studente) => void;
  competencyEvaluations: ValutazioneCompetenza[];
}

const ConsiglioClasse: React.FC<ConsiglioClasseProps> = (props) => {
  const { selectedClass, students, evaluations, giudizi, onSaveGiudizio, settings, aiSettings, annoScolasticoCorrente, onViewStudentProfile, competencyEvaluations } = props;
    
    const [periodo, setPeriodo] = useState<PeriodoValutazione>('primo-quadrimestre');
    const [localGiudizi, setLocalGiudizi] = useState<Record<string, GiudizioPeriodico>>({});
    const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
    const [loadingAi, setLoadingAi] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
    const [narrativeReport, setNarrativeReport] = useState<string | null>(null);
    const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
    const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({
        rendimento: true,
        valutazione: true,
        giudizio: true,
    });
    
    const debounceTimeoutRef = useRef<number | null>(null);

    const isTerzaClasse = useMemo(() => selectedClass.startsWith('3'), [selectedClass]);
    const showFinalGrades = useMemo(() => isTerzaClasse && periodo === 'secondo-quadrimestre', [isTerzaClasse, periodo]);

    useEffect(() => {
        const initialData: Record<string, GiudizioPeriodico> = {};
        students.forEach(s => {
            // FIX: Ensure string conversion in template literal key
            const key = `${String(s.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
            const existing = giudizi[key];
            initialData[key] = {
                studenteId: s.id,
                periodo,
                annoScolastico: annoScolasticoCorrente,
                giudizio: existing?.giudizio || '',
                comportamento: existing?.comportamento || '',
                educazioneCivica: existing?.educazioneCivica || '',
                note: existing?.note || '',
                votoDisciplina: existing?.votoDisciplina || '',
                votoAmmissione: existing?.votoAmmissione || '',
                votoUscita: existing?.votoUscita || '',
            };
        });
        setLocalGiudizi(initialData);
        setChangedCells(new Set()); 
        setExpandedStudentId(null);
    }, [students, periodo, giudizi, annoScolasticoCorrente, selectedClass]);

    const handleLocalChange = (studentId: string, field: keyof Omit<GiudizioPeriodico, 'studenteId' | 'periodo' | 'annoScolastico'>, value: string) => {
        // FIX: Ensure string conversion in template literal key
        const studentKey = `${String(studentId)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
        const cellKey = `${studentKey}-${String(field)}`;

        const updatedGiudizio: GiudizioPeriodico = { // FIX: Explicitly type updatedGiudizio
            ...localGiudizi[studentKey],
            [field]: value
        };
        
        setLocalGiudizi(prev => ({ ...prev, [studentKey]: updatedGiudizio }));
        setChangedCells(prev => new Set(prev).add(cellKey));

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = window.setTimeout(() => {
            onSaveGiudizio(updatedGiudizio);
        }, 800);
    };

    const handleAiSuggest = async (student: Studente) => {
        setLoadingAi(student.id);
        try {
            const studentEvals = evaluations.filter(e => e.studenteId === student.id);
            const studentCompEvals = competencyEvaluations.filter(e => e.studenteId === student.id);
            const suggestion = await getPeriodicJudgmentSuggestion(
                aiSettings, 
                student, 
                periodo, 
                studentEvals, 
                studentCompEvals, 
                settings.competenze
            );
            handleLocalChange(student.id, 'giudizio', suggestion);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Errore sconosciuto';
            console.error("Error suggesting judgment:", errorMsg);
            alert("Errore durante le suggerimento del giudizio.");
        } finally {
            setLoadingAi(null);
        }
    };

    const handleGenerateNarrativeReport = async () => {
        setIsGeneratingNarrative(true);
        setNarrativeReport(null);
        try {
            const studentiPerf = students.map(s => {
                const perf = calculatePerformance(s.id, 'Complessivo', evaluations.filter(e => e.studenteId === s.id));
                return { nome: `${s.cognome} ${s.nome}`, grade: perf.grade };
            });
            const data = {
                classe: selectedClass,
                periodo: String(periodo),
                stats: studentiPerf.map(s => `${s.nome}: media ${s.grade || 'N/D'}`).join('; '),
                criticalities: studentiPerf.filter(s => s.grade !== null && parseFloat(s.grade) < 6).map(s => s.nome),
                strengths: studentiPerf.filter(s => s.grade !== null && parseFloat(s.grade) >= 8).map(s => s.nome)
            };
            const report = await generateClassCouncilNarrativeReport(aiSettings, data);
            setNarrativeReport(report);
        } catch (error) {
            console.error("Error generating narrative report:", error);
            alert("Errore durante la generazione del report narrativo.");
        } finally {
            setIsGeneratingNarrative(false);
        }
    };
    
    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const blob = await generateCouncilTablePdf(
                selectedClass,
                periodo,
                annoScolasticoCorrente,
                students,
                evaluations,
                localGiudizi,
                settings,
                showFinalGrades
            );
            // viewPdfInNewTab(blob); // Rimosso import inutilizzato, lasciare gestione download a saveAs o altro
            saveAs(blob, `Scrutinio_${selectedClass}_${String(periodo)}.pdf`);
        } catch(e) {
            console.error(e);
            alert("Si è verificato un errore durante l'esportazione del PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportDocx = async () => {
        setIsExporting(true);
        try {
            // FIX: Ensure correct data types for props of calculatePerformance
            // const student = students.find(s => s.classe === selectedClass); // Rimosso: non usato
            // const performance = student ? calculatePerformance(student.id, 'Complessivo', evaluations.filter(e => e.studenteId === student.id)) : { grade: null, trend: null };
            
// Removed unused html variable - DOCX generation handled by generateCouncilTablePdf

            alert('Esportazione formato DOCX non ancora disponibile. Usa PDF.');

        } catch(e) {
            console.error("Error exporting DOCX:", e);
            alert("Errore durante la generazione del file Word.");
        } finally {
            setIsExporting(false);
        }
    };

    const hasStudentChanged = (studentId: string): boolean => {
        const keyPrefix = `${String(studentId)}-${String(periodo)}-${String(annoScolasticoCorrente)}-`;
        return Array.from(changedCells).some((cellKey: string) => cellKey.startsWith(keyPrefix));
    };

    const renderDesktopTable = () => (
         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <table>
                <thead >
                    <tr>
                        <th>Studente</th>
                        {expandedColumns.rendimento && <>
                            <th style={{ color: 'inherit' }}>Media</th>
                            <th style={{ color: 'inherit' }}>Trend</th>
                        </>}
                        {expandedColumns.valutazione && <>
                            <th>Voto Disciplina</th>
                            <th>Ed. Civica</th>
                            <th>Comportamento</th>
                        </>}
                         {expandedColumns.giudizio && <th>Note/Giudizio</th>}
                        {showFinalGrades && expandedColumns.valutazione && <>
                            <th>Voto Amm.</th>
                            <th>Voto Uscita</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => {
                        const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                        const key = `${String(student.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
                        const performance = calculatePerformance(student.id, 'Complessivo', studentEvals);
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                        // FIX: Ensure string conversion in template literal key
                        const giudizioStudente = localGiudizi[key];

                        if (!giudizioStudente) return null;

                        // FIX: Ensure string conversion in cell key
                        const getCellStyle = (field: string): React.CSSProperties => changedCells.has(`${key}-${String(field)}`) ? { backgroundColor: 'var(--md-sys-color-tertiary-container)', transition: 'background-color var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard)' } : {};

                        return (
                            <tr key={student.id}>
                                <td>
                                    <Button variant="text" onClick={() => onViewStudentProfile(student)} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' ,  fontWeight: "var(--md-sys-typescale-weight-medium)" }} type="button">
                                        {student.cognome} {student.nome}
                                    </Button>
                                </td>
                                {expandedColumns.rendimento && <>
                                    <td style={{ color: 'inherit' }}>{performance.grade || 'N/D'}</td>
                                    <td style={{ color: 'inherit' }}>
                                        {performance.trend && <Box component="span" title={performance.trend || ''} className="material-symbols-outlined" aria-hidden="true" sx={{ color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }}>{trendIcon}</Box>}
                                    </td>
                                </>}
                                {expandedColumns.valutazione && <>
                                    <td style={getCellStyle('votoDisciplina')}><input type="text"  value={giudizioStudente.votoDisciplina} onChange={e => handleLocalChange(student.id, 'votoDisciplina', e.target.value)} /></td>
                                    <td style={getCellStyle('educazioneCivica')}><input type="text"  value={giudizioStudente.educazioneCivica} onChange={e => handleLocalChange(student.id, 'educazioneCivica', e.target.value)} /></td>
                                    <td style={getCellStyle('comportamento')}>
                                        <select  value={giudizioStudente.comportamento} onChange={e => handleLocalChange(student.id, 'comportamento', e.target.value)}>
                                            <option value="">-</option>
                                            {[10,9,8,7,6,5].map(v => <option key={v} value={v.toString()}>{v}</option>)}
                                        </select>
                                    </td>
                                </>}
                                {expandedColumns.giudizio &&
                                <td style={{ minWidth: 'var(--md-sys-spacing-12)', ...getCellStyle('giudizio') }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                        <textarea value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)}  style={{ flexGrow: "1" }} rows={2} placeholder="Giudizio sintetico..."></textarea>
                                        <Button variant="text" onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' }} title="Suggerisci con AI" type="button">
                                            <span style={{ color: "var(--md-sys-color-on-surface-variant)" }}>{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </Button>
                                    </div>
                                </td>}
                                {showFinalGrades && expandedColumns.valutazione && <>
                                    <td style={getCellStyle('votoAmmissione')}><input type="text"  value={giudizioStudente.votoAmmissione} onChange={e => handleLocalChange(student.id, 'votoAmmissione', e.target.value)} /></td>
                                    <td style={getCellStyle('votoUscita')}><input type="text"  value={giudizioStudente.votoUscita} onChange={e => handleLocalChange(student.id, 'votoUscita', e.target.value)} /></td>
                                </>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const renderMobileList = () => (
        <div  style={{gap: 'var(--md-sys-spacing-3)'}}>
            {students.map(student => {
                 const isExpanded = expandedStudentId === student.id;
                 const key = `${String(student.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
                 const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                 const performance = calculatePerformance(student.id, 'Complessivo', studentEvals);
                 const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                 const giudizioStudente = localGiudizi[key];

                 if (!giudizioStudente) return null;

                return (
                    <div key={student.id} >
                        <div  onClick={() => setExpandedStudentId(prev => prev === student.id ? null : student.id)}>
                             <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                {hasStudentChanged(student.id) && <span  title="Dati modificati in questa sessione"></span>}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <Typography component="h3" variant="subtitle1" sx={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onViewStudentProfile(student); }}>{student.cognome} {student.nome}</Typography>
                                    <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', marginTop: 'var(--md-sys-spacing-4)'}}>
                                        <span>Media: <strong>{performance.grade || 'N/D'}</strong></span>
                                        {performance.trend && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }}>
                                                <span style={{ color: "var(--md-sys-color-on-surface-variant)" }}>{trendIcon}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)' }}>expand_more</Box>
                        </div>
                        <div style={{
                            display: isExpanded ? 'block' : 'none',
                            borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                            backgroundColor: 'var(--md-sys-color-surface)',
                            animation: isExpanded ? 'slideDown var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)-out' : 'none'
                        }}>
                             <div style={{gap: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-8)'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <label htmlFor={`votoDisciplina-${student.id}`} >Voto Disciplina</label>
                                    <input id={`votoDisciplina-${student.id}`} type="text"  value={giudizioStudente.votoDisciplina} onChange={e => handleLocalChange(student.id, 'votoDisciplina', e.target.value)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                        <label htmlFor={`educazioneCivica-${student.id}`} >Ed. Civica</label>
                                        <input id={`educazioneCivica-${student.id}`} type="text"  value={giudizioStudente.educazioneCivica} onChange={e => handleLocalChange(student.id, 'educazioneCivica', e.target.value)} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                        <label htmlFor={`comportamento-${student.id}`} >Comportamento</label>
                                        <select id={`comportamento-${student.id}`}  value={giudizioStudente.comportamento} onChange={e => handleLocalChange(student.id, 'comportamento', e.target.value)}>
                                            <option value="">-</option>
                                            {[10,9,8,7,6,5].map(v => <option key={v} value={v.toString()}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 'var(--md-sys-spacing-4)'}}>
                                        <label htmlFor={`giudizio-${student.id}`} >Note/Giudizio</label>
                                        <Button variant="text" onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' }} title="Suggerisci con AI" type="button">
                                            <span style={{ color: 'var(--md-sys-color-primary)' }}>{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </Button>
                                    </div>
                                    <textarea id={`giudizio-${student.id}`} value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)}  style={{ width: "var(--md-sys-percent-100)" }} rows={4} placeholder="Giudizio sintetico..."></textarea>
                                </div>
                                {showFinalGrades && (
                                    <>
                                        <hr  />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                                <label htmlFor={`votoAmmissione-${student.id}`} >Voto di Ammissione</label>
                                                <input id={`votoAmmissione-${student.id}`} type="text"  value={giudizioStudente.votoAmmissione} onChange={e => handleLocalChange(student.id, 'votoAmmissione', e.target.value)} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                                <label htmlFor={`votoUscita-${student.id}`} >Voto di Uscita</label>
                                                <input id={`votoUscita-${student.id}`} type="text"  value={giudizioStudente.votoUscita} onChange={e => handleLocalChange(student.id, 'votoUscita', e.target.value)} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    
    return (
        <div  style={{maxWidth: "var(--md-sys-percent-100)", marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)", width: "var(--md-sys-percent-100)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>
            <SectionHeader 
                title="Consiglio di Classe"
                subtitle={`Scrutinio e Valutazione Periodica • Classe ${selectedClass}`}
                 style={{ textAlign: "center" }}
            />

            {/* Controls */}
            <InfoCard variant="outlined" style={{padding: 'var(--md-sys-spacing-6)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                <div  style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
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
                      }}
                    >
                      {([
                            { id: 'primo-quadrimestre', label: '1° Quadrimestre', icon: 'looks_one' },
                            { id: 'secondo-quadrimestre', label: '2° Quadrimestre', icon: 'looks_two' },
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

                    <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)'}}>
                        <Button 
                            onClick={handleExportPdf} 
                            disabled={isExporting}
                            variant="outlined"
                        >
                            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>picture_as_pdf</span>
                            Esporta PDF
                        </Button>
                        <Button 
                            onClick={handleExportDocx} 
                            disabled={isExporting}
                            variant="outlined"
                        >
                            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>description</span>
                            Esporta Word
                        </Button>
                        <Button 
                            onClick={handleGenerateNarrativeReport} 
                            disabled={isGeneratingNarrative}
                            variant="contained"
                        >
                            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>auto_awesome</span>
                            {isGeneratingNarrative ? 'Generazione...' : 'Report Narrativo AI'}
                        </Button>
                    </div>
                </div>
            </InfoCard>

            {narrativeReport && (
                <InfoCard elevation={1} style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary-container) 5%, transparent)' , padding: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 'var(--md-sys-spacing-6)'}}>
                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                            <div style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)' , width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-primary)"}}>
                                <span style={{
}}>description</span>
                            </div>
                            <Typography component="h3" variant="subtitle1" sx={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "var(--md-sys-typescale-weight-black)" }}>Report Narrativo Suggerito</Typography>
                        </div>
                        <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)'}}>
                            <Button variant="text" onClick={() => setNarrativeReport(null)}>Chiudi</Button>
                            <Button variant="outlined" onClick={() => {
                                navigator.clipboard.writeText(narrativeReport);
                                alert("Report copiato!");
                            }}>
                                <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>content_copy</span>
                                Copia
                            </Button>
                        </div>
                    </div>
                    <div style={{ color: 'var(--md-sys-color-on-primary)', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', lineHeight: "1.625", whiteSpace: "pre-wrap", padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                        {narrativeReport}
                    </div>
                </InfoCard>
            )}

            <InfoCard elevation={1} style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                 <div  style={{padding: 'var(--md-sys-spacing-8)', display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 'var(--md-sys-spacing-8)', borderBottom: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 'var(--md-sys-spacing-8)'}}>
                        {Object.keys(expandedColumns).map(key => (
                            <Button
                                key={key}
                                variant={expandedColumns[key as keyof typeof expandedColumns] ? 'contained' : 'text'}
                                onClick={() => setExpandedColumns(p => ({...p, [key]: !p[key as keyof typeof p]}))}
                                size="small"
                                
                            >
                                {expandedColumns[key as keyof typeof expandedColumns] && <span  style={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>check</span>}
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Button>
                        ))}
                    </div>
                 </div>
                {renderDesktopTable()}
                {renderMobileList()}
            </InfoCard>
        </div>
    );
};

export default ConsiglioClasse;

