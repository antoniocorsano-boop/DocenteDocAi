
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Studente, Valutazione, GiudizioPeriodico, PeriodoValutazione, TimetableSettings, AiSettings, ValutazioneCompetenza } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { getPeriodicJudgmentSuggestion } from '../services/aiService';
import { generateCouncilTablePdf, generateHtmlDocxBlob, viewPdfInNewTab } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { TabGroup } from './M3Components';


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
            // FIX: Pass correct types to getPeriodicJudgmentSuggestion
            const suggestion = await getPeriodicJudgmentSuggestion(
                aiSettings, 
                student, 
                periodo, 
                studentEvals, 
                studentCompEvals, 
                settings.competenze
            );
            handleLocalChange(student.id, 'giudizio', suggestion);
        } catch (error: any) { // FIX: Cast error to 'any' for message property
            console.error("Error suggesting judgment:", error);
            alert("Errore durante le suggerimento del giudizio.");
        } finally {
            setLoadingAi(null);
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
            viewPdfInNewTab(blob);
        } catch(e: any) { // FIX: Cast error to 'any'
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
            const student = students.find(s => s.classe === selectedClass); // Assuming single student context for trend, but it's per student
            const performance = student ? calculatePerformance(student.id, 'Complessivo', evaluations.filter(e => e.studenteId === student.id)) : { grade: null, trend: null };
            
            let html = `
            <style>
                table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
                th { background-color: #f2f2f2; font-weight: bold; }
                h1 { font-family: Arial, sans-serif; color: #2E74B5; }
                p { font-family: Arial, sans-serif; }
            </style>
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

        } catch (e: any) { // FIX: Cast error to 'any'
            console.error("Error exporting DOCX:", e);
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
                                    <button onClick={() => onViewStudentProfile(student)} className='link-button font-medium rounded-lg hover:shadow-md transition-all'>
                                        {student.cognome} {student.nome}
                                    </button>
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
                                <td className={`min-w-[300px] ${getCellClassName('giudizio')}`}>
                                    <div className='flex items-start gap-1'>
                                        <textarea value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)} className="form-textarea !py-1 flex-grow" rows={2} placeholder="Giudizio sintetico..."></textarea>
                                        <button onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} className="icon-button rounded-lg hover:shadow-md transition-all" title="Suggerisci con AI">
                                            <span className="material-symbols-outlined text-base">{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </button>
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
                             <div className="flex items-center gap-2">
                                {hasStudentChanged(student.id) && <span className="cell-changed-indicator" title="Dati modificati in questa sessione"></span>}
                                <div>
                                    <h3 className="m3-title-medium cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onViewStudentProfile(student); }}>{student.cognome} {student.nome}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="m3-label-large">Media: <strong>{performance.grade || 'N/D'}</strong></span>
                                        {performance.trend && (
                                            <span className={`flex items-center gap-1 m3-label-large ${trendClass}`}>
                                                <span className="material-symbols-outlined text-base">{trendIcon}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span className={`material-symbols-outlined expand-icon ${isExpanded ? 'expanded' : ''}`}>expand_more</span>
                        </div>
                        <div className={`consiglio-student-card-content ${isExpanded ? 'expanded' : ''}`}>
                             <div className="space-y-4 p-4">
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
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor={`giudizio-${student.id}`} className="form-label !mb-0">Note/Giudizio</label>
                                        <button type="button" onClick={() => handleAiSuggest(student)} disabled={loadingAi === student.id} className="button button-text !h-auto !py-1 !px-2 rounded-lg hover:shadow-md transition-all" title="Suggerisci con AI">
                                            <span className="material-symbols-outlined text-base">{loadingAi === student.id ? 'pending' : 'auto_awesome'}</span>
                                        </button>
                                    </div>
                                    <textarea id={`giudizio-${student.id}`} value={giudizioStudente.giudizio} onChange={e => handleLocalChange(student.id, 'giudizio', e.target.value)} className="form-textarea w-full" rows={4} placeholder="Giudizio sintetico..."></textarea>
                                </div>
                                {showFinalGrades && (
                                    <>
                                        <hr className="border-outline-variant" />
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
        <div className="consiglio-di-classe-page space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="m3-display-medium">Consiglio di Classe - {selectedClass}</h1>
                <div className='flex items-center gap-4'>
                    <TabGroup
                        tabs={[
                            { id: 'primo-quadrimestre', label: '1Q' },
                            { id: 'secondo-quadrimestre', label: '2Q' }
                        ]}
                        activeTab={periodo}
                        onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        variant="primary"
                    />
                </div>
            </div>

            <div className="card">
                 <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-outline-variant">
                    <div className="chip-container-stack !flex-row !flex-wrap">
                        {Object.keys(expandedColumns).map(key => (
                            <div key={key} className="chip-checkbox">
                                <input
                                    type="checkbox"
                                    id={`col-toggle-${String(key)}`}
                                    checked={expandedColumns[key as keyof typeof expandedColumns]}
                                    onChange={() => setExpandedColumns(p => ({...p, [key]: !p[key as keyof typeof p]}))}
                                />
                                <label htmlFor={`col-toggle-${String(key)}`} className="chip rounded-lg hover:shadow-md transition-all">
                                    {expandedColumns[key as keyof typeof expandedColumns] && <span className="material-symbols-outlined text-lg">check</span>}
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExportDocx} disabled={isExporting} className="button button-outlined rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined mr-2">description</span>
                            Word
                        </button>
                        <button onClick={handleExportPdf} disabled={isExporting} className="button button-tonal rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
                            PDF
                        </button>
                    </div>
                 </div>
                {renderDesktopTable()}
                {renderMobileList()}
            </div>
        </div>
    );
};

export default ConsiglioClasse;
