import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    M3Button, 
    TabGroup, 
    InfoCard, 
    SectionHeader 
} from './ui';
import { Studente, Valutazione, GiudizioPeriodico, PeriodoValutazione, TimetableSettings, AiSettings, ValutazioneCompetenza } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { getPeriodicJudgmentSuggestion, generateClassCouncilNarrativeReport } from '../services/aiService';
import { generateCouncilTablePdf, generateHtmlDocxBlob } from '../utils/documentUtils';
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
            const data = {
                classe: selectedClass,
                periodo,
                studenti: students.map(s => ({
                    nome: `${s.cognome} ${s.nome}`,
                    media: calculatePerformance(s.id, 'Complessivo', evaluations.filter(e => e.studenteId === s.id)).grade,
                    giudizio: localGiudizi[`${String(s.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`]?.giudizio || ''
                }))
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
            const errorMsg = e instanceof Error ? e.message : 'Errore sconosciuto';
            console.error(errorMsg);
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
            
            let html = `
            <style>@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap'); table { width: 100%; border-collapse: collapse; font-family: 'Roboto', sans-serif; } th, td { border: 1px solid #000; padding: var(--md-sys-spacing-2); text-align: left; vertical-align: top; } th { background-color: var(--md-sys-color-primary); font-weight: bold; } /* MD3 fix */ h1 { font-family: 'Roboto', sans-serif; color: var(--md-sys-color-primary); } /* MD3 fix */ p { font-family: 'Roboto', sans-serif; }</style>
            `;
            
            html += `<h1>Tabellone Scrutinio: ${selectedClass}</h1>`;
            html += `<p><strong>Periodo:</strong> ${periodo === 'primo-quadrimestre' ? 'Primo Quadrimestre' : 'Scrutinio Finale'}<br>`;
            html += `<strong>Anno Scolastico:</strong> ${annoScolasticoCorrente}<br>`;
            html += `<strong>Docente:</strong> ${settings.nomeInsegnante}</p>`;

            html += `<table><thead><tr>
                <th>Studente</th>
                <th>Media</th>
                <th>Trend</th>
                <th>Voto Disciplina</th>
                <th>Ed. Civica</th>
                <th>Comportamento</th>
                <th>Giudizio / Note</th>
                ${showFinalGrades ? '<th>Ammissione</th><th>Uscita</th>' : ''}
            </tr></thead><tbody>`;

            students.forEach(student => {
                const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                const studentPerformance = calculatePerformance(student.id, 'Complessivo', studentEvals); // FIX: Use studentPerformance here
                // FIX: Ensure string conversion in template literal key
                const key = `${String(student.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
                const g = localGiudizi[key];
                
                if (!g) return;

                const trendText = studentPerformance.trend === 'up' ? 'In crescita' : studentPerformance.trend === 'down' ? 'In calo' : 'Stabile'; // FIX: Use studentPerformance

                html += `<tr>
                    <td>${student.cognome} ${student.nome}</td>
                    <td>${studentPerformance.grade || '-'}</td>
                    <td>${studentPerformance.trend ? trendText : '-'}</td>
                    <td>${g.votoDisciplina || '-'}</td>
                    <td>${g.educazioneCivica || '-'}</td>
                    <td>${g.comportamento || '-'}</td>
                    <td>${g.giudizio || '-'}</td>
                    ${showFinalGrades ? `<td>${g.votoAmmissione || '-'}</td><td>${g.votoUscita || '-'}</td>` : ''}
                </tr>`;
            });

            html += `</tbody></table>`;

            const blob = await generateHtmlDocxBlob(html, `Scrutinio ${selectedClass}`);
            // FIX: Ensure string conversion in template literal for periodo
            saveAs(blob, `Scrutinio_${selectedClass}_${String(periodo)}.docx`);

        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Errore sconosciuto';
            console.error("Error exporting DOCX:", errorMsg);
            alert("Errore durante la generazione del file Word.");
        } finally {
            setIsExporting(false);
        }
    };

    const hasStudentChanged = (studentId: string): boolean => {
        // FIX: Ensure string conversion in template literal key prefix
        const keyPrefix = `${String(studentId)}-${String(periodo)}-${String(annoScolasticoCorrente)}-`;
        return Array.from(changedCells).some((cellKey: string) => cellKey.startsWith(keyPrefix));
    };

    const renderDesktopTable = () => (
         <div className="table-container desktop-only">
            <table className="table consiglio-table">
                <thead className='sticky-header'>
                    <tr>
                        <th className="sticky-col-student">Studente</th>
                        {expandedColumns.rendimento && <>
                            <th className='text-center'>Media</th>
                            <th className='text-center'>Trend</th>
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
                        const performance = calculatePerformance(student.id, 'Complessivo', studentEvals);
                        const trendClass = performance.trend === 'up' ? 'trend-up' : performance.trend === 'down' ? 'trend-down' : 'trend-stable';
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                        // FIX: Ensure string conversion in template literal key
                        const key = `${String(student.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
                        const giudizioStudente = localGiudizi[key];

                        if (!giudizioStudente) return null;

                        // FIX: Ensure string conversion in cell key
                        const getCellClassName = (field: string) => changedCells.has(`${key}-${String(field)}`) ? 'cell-changed' : '';

                        return (
                            <tr key={student.id}>
                                <td className="sticky-col-student">
                                    <M3Button variant="text" onClick={() => onViewStudentProfile(student)} className="font-medium rounded-[var(--md-sys-shape-corner-small)]" type="button">
                                        {student.cognome} {student.nome}
                                    </M3Button>
                                </td>
                                {expandedColumns.rendimento && <>
                                    <td className='text-center font-bold'>{performance.grade || 'N/D'}</td>
                                    <td className='text-center'>
                                        {performance.trend && <span title={performance.trend || ''} className={`material-symbols-outlined ${trendClass}`}>{trendIcon}</span>}
                                    </td>
                                </>}
                                {expandedColumns.valutazione && <>
                                    <td className={getCellClassName('votoDisciplina')}><input type="text" className='form-input !py-1' value={giudizioStudente.votoDisciplina} onChange={e => handleLocalChange(student.id, 'votoDisciplina', e.target.value)} /></td>
                                    <td className={getCellClassName('educazioneCivica')}><input type="text" className='form-input !py-1' value={giudizioStudente.educazioneCivica} onChange={e => handleLocalChange(student.id, 'educazioneCivica', e.target.value)} /></td>
                                    <td className={getCellClassName('comportamento')}>
                                        <select className='form-select !py-1' value={giudizioStudente.comportamento} onChange={e => handleLocalChange(student.id, 'comportamento', e.target.value)}>
                                            <option value="">-</option>
                                            {[10,9,8,7,6,5].map(v => <option key={v} value={v.toString()}>{v}</option>)}
                                        </select>
                                    </td>
                                </>}
                                {expandedColumns.giudizio &&
                                <td className={`min-w-[200px] md:min-w-[300px] ${getCellClassName('giudizio')}`}>
                                    <div className='flex items-start gap-2'>
                                        <textarea value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)} className="form-textarea !py-1 flex-grow" rows={2} placeholder="Giudizio sintetico..."></textarea>
                                        <M3Button variant="text" onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} className="rounded-[var(--md-sys-shape-corner-small)]" title="Suggerisci con AI" type="button">
                                            <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </M3Button>
                                    </div>
                                </td>}
                                {showFinalGrades && expandedColumns.valutazione && <>
                                    <td className={getCellClassName('votoAmmissione')}><input type="text" className='form-input !py-1' value={giudizioStudente.votoAmmissione} onChange={e => handleLocalChange(student.id, 'votoAmmissione', e.target.value)} /></td>
                                    <td className={getCellClassName('votoUscita')}><input type="text" className='form-input !py-1' value={giudizioStudente.votoUscita} onChange={e => handleLocalChange(student.id, 'votoUscita', e.target.value)} /></td>
                                </>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const renderMobileList = () => (
        <div className="space-y-3 mobile-only">
            {students.map(student => {
                 const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                 const performance = calculatePerformance(student.id, 'Complessivo', studentEvals);
                 const trendClass = performance.trend === 'up' ? 'trend-up' : performance.trend === 'down' ? 'trend-down' : 'trend-stable';
                 const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                 const isExpanded = expandedStudentId === student.id;
                 // FIX: Ensure string conversion in template literal key
                 const key = `${String(student.id)}-${String(periodo)}-${String(annoScolasticoCorrente)}`;
                 const giudizioStudente = localGiudizi[key];

                 if (!giudizioStudente) return null;

                return (
                    <div key={student.id} className="consiglio-student-card-expandable">
                        <div className="consiglio-student-card-header" onClick={() => setExpandedStudentId(prev => prev === student.id ? null : student.id)}>
                             <div className="flex items-center gap-8">
                                {hasStudentChanged(student.id) && <span className="cell-changed-indicator" title="Dati modificati in questa sessione"></span>}
                                <div>
                                    <h3 className="m3-title-medium cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onViewStudentProfile(student); }}>{student.cognome} {student.nome}</h3>
                                    <div className="flex items-center gap-8 mt-4">
                                        <span className="m3-label-large">Media: <strong>{performance.grade || 'N/D'}</strong></span>
                                        {performance.trend && (
                                            <span className={`flex items-center gap-4 m3-label-large ${trendClass}`}>
                                                <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{trendIcon}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span className={`material-symbols-outlined expand-icon ${isExpanded ? 'expanded' : ''}`}>expand_more</span>
                        </div>
                        <div className={`consiglio-student-card-content ${isExpanded ? 'expanded' : ''}`}>
                             <div className="space-y-4 p-8">
                                <div>
                                    <label htmlFor={`votoDisciplina-${student.id}`} className="form-label">Voto Disciplina</label>
                                    <input id={`votoDisciplina-${student.id}`} type="text" className='form-input w-full' value={giudizioStudente.votoDisciplina} onChange={e => handleLocalChange(student.id, 'votoDisciplina', e.target.value)} />
                                </div>
                                <div className="responsive-grid">
                                    <div>
                                        <label htmlFor={`educazioneCivica-${student.id}`} className="form-label">Ed. Civica</label>
                                        <input id={`educazioneCivica-${student.id}`} type="text" className='form-input w-full' value={giudizioStudente.educazioneCivica} onChange={e => handleLocalChange(student.id, 'educazioneCivica', e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor={`comportamento-${student.id}`} className="form-label">Comportamento</label>
                                        <select id={`comportamento-${student.id}`} className='form-select w-full' value={giudizioStudente.comportamento} onChange={e => handleLocalChange(student.id, 'comportamento', e.target.value)}>
                                            <option value="">-</option>
                                            {[10,9,8,7,6,5].map(v => <option key={v} value={v.toString()}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label htmlFor={`giudizio-${student.id}`} className="form-label !mb-0">Note/Giudizio</label>
                                        <M3Button variant="text" onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} className="!h-auto !py-1 !px-4 rounded-[var(--md-sys-shape-corner-small)]" title="Suggerisci con AI" type="button">
                                            <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </M3Button>
                                    </div>
                                    <textarea id={`giudizio-${student.id}`} value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)} className="form-textarea w-full" rows={4} placeholder="Giudizio sintetico..."></textarea>
                                </div>
                                {showFinalGrades && (
                                    <>
                                        <hr className="border-[var(--md-sys-color-outline-variant)]" />
                                        <div className='responsive-grid'>
                                            <div>
                                                <label htmlFor={`votoAmmissione-${student.id}`} className="form-label">Voto di Ammissione</label>
                                                <input id={`votoAmmissione-${student.id}`} type="text" className='form-input w-full' value={giudizioStudente.votoAmmissione} onChange={e => handleLocalChange(student.id, 'votoAmmissione', e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor={`votoUscita-${student.id}`} className="form-label">Voto di Uscita</label>
                                                <input id={`votoUscita-${student.id}`} type="text" className='form-input w-full' value={giudizioStudente.votoUscita} onChange={e => handleLocalChange(student.id, 'votoUscita', e.target.value)} />
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
        <div className="page-layout max-w-full mx-auto w-full px-4 pb-24">
            <SectionHeader 
                title="Consiglio di Classe"
                subtitle={`Scrutinio e Valutazione Periodica • Classe ${selectedClass}`}
                className="py-12 text-center"
            />

            {/* Controls */}
            <InfoCard variant="tonal" className="p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <TabGroup 
                        activeTab={periodo}
                        onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        variant="primary"
                        tabs={[
                            { id: 'primo-quadrimestre', label: '1° Quadrimestre', icon: 'looks_one' },
                            { id: 'secondo-quadrimestre', label: '2° Quadrimestre', icon: 'looks_two' },
                        ]}
                    />

                    <div className="flex gap-8">
                        <M3Button 
                            onClick={handleExportPdf} 
                            disabled={isExporting}
                            variant="tonal"
                        >
                            <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
                            Esporta PDF
                        </M3Button>
                        <M3Button 
                            onClick={handleExportDocx} 
                            disabled={isExporting}
                            variant="tonal"
                        >
                            <span className="material-symbols-outlined mr-2">description</span>
                            Esporta Word
                        </M3Button>
                        <M3Button 
                            onClick={handleGenerateNarrativeReport} 
                            disabled={isGeneratingNarrative}
                            variant="filled"
                        >
                            <span className="material-symbols-outlined mr-2">auto_awesome</span>
                            {isGeneratingNarrative ? 'Generazione...' : 'Report Narrativo AI'}
                        </M3Button>
                    </div>
                </div>
            </InfoCard>

            {narrativeReport && (
                <InfoCard variant="elevated" className="p-8 mb-8 bg-primary-container/5 border-primary/20 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Report Narrativo Suggerito</h3>
                        </div>
                        <div className="flex gap-8">
                            <M3Button variant="text" onClick={() => setNarrativeReport(null)}>Chiudi</M3Button>
                            <M3Button variant="tonal" onClick={() => {
                                navigator.clipboard.writeText(narrativeReport);
                                alert("Report copiato!");
                            }}>
                                <span className="material-symbols-outlined mr-2">content_copy</span>
                                Copia
                            </M3Button>
                        </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-[var(--md-sys-color-on-surface)] leading-relaxed whitespace-pre-wrap italic bg-[var(--md-sys-color-surface-container-low)]est/50 p-6 rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/20">
                        {narrativeReport}
                    </div>
                </InfoCard>
            )}

            <InfoCard variant="elevated" className="bg-[var(--md-sys-color-surface-container-low)]est overflow-hidden">
                 <div className="p-8 flex flex-wrap justify-between items-center gap-8 border-b border-[var(--md-sys-color-outline-variant)]/30">
                    <div className="flex flex-wrap gap-8">
                        {Object.keys(expandedColumns).map(key => (
                            <M3Button
                                key={key}
                                variant={expandedColumns[key as keyof typeof expandedColumns] ? 'tonal' : 'text'}
                                onClick={() => setExpandedColumns(p => ({...p, [key]: !p[key as keyof typeof p]}))}
                                size="small"
                                className="!rounded-full"
                            >
                                {expandedColumns[key as keyof typeof expandedColumns] && <span className="material-symbols-outlined mr-1 text-sm">check</span>}
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </M3Button>
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


