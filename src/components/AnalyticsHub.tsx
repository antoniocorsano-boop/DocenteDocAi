import React, { useState, useMemo, useEffect } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
import { LineChart, RadarChart } from './charts/AdvancedCharts';
import BarChart from './charts/BarChart';
import { calculateClassTrend, calculateCompetencyRadar, calculateGradeDistribution } from '../utils/analyticsUtils';
import { getGoogleAIClient } from '../services/aiClient';
import AiThinkingGem from './AiThinkingGem';
import { EmptyState, AiMemoryChip, SelectField } from './M3Components';

interface AnalyticsHubProps {
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
}

type ChartType = 'trend' | 'radar' | 'dist';

const AnalyticsHub: React.FC<AnalyticsHubProps> = ({
    userClasses, students, evaluations, competencyEvaluations, settings, aiSettings
}) => {
    const [selectedClass, setSelectedClass] = useState<string>(userClasses[0] || '');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [chartType, setChartType] = useState<ChartType>('trend');

    useEffect(() => {
        if (!selectedClass && userClasses.length > 0) {
            setSelectedClass(userClasses[0]);
        }
    }, [userClasses, selectedClass]);

    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const filteredStudents = useMemo(() => students.filter(s => s.classe === selectedClass), [students, selectedClass]);

    const filteredEvals = useMemo(() => {
        return evaluations.filter(e => {
            if (selectedStudentId !== 'all' && e.studenteId !== selectedStudentId) return false;
            if (selectedSubject !== 'all' && e.materia !== selectedSubject) return false;
            if (selectedStudentId === 'all' && !filteredStudents.find(s => s.id === e.studenteId)) return false;
            return true;
        });
    }, [evaluations, selectedStudentId, selectedSubject, filteredStudents]);

    const filteredCompEvals = useMemo(() => {
        return competencyEvaluations.filter(e => {
            if (selectedStudentId !== 'all' && e.studenteId !== selectedStudentId) return false;
            if (selectedStudentId === 'all' && !filteredStudents.find(s => s.id === e.studenteId)) return false;
            return true;
        });
    }, [competencyEvaluations, selectedStudentId, filteredStudents]);

    const trendData = useMemo(() => calculateClassTrend(filteredEvals, filteredStudents), [filteredEvals, filteredStudents]);
    const radarData = useMemo(() => calculateCompetencyRadar(filteredCompEvals, settings.competenze, selectedStudentId !== 'all' ? selectedStudentId : undefined), [filteredCompEvals, settings.competenze, selectedStudentId]);
    const distData = useMemo(() => calculateGradeDistribution(filteredEvals), [filteredEvals]);

    const handleAskAi = async () => {
        setIsAiLoading(true);
        setAiInsight(null);
        try {
            const ai = await getGoogleAIClient();
            const prompt = `Analizza i dati didattici del grafico (${chartType}) per Classe ${selectedClass}. Materia: ${selectedSubject === 'all' ? 'Tutte' : selectedSubject}. Fornisci interpretazione pedagogica concisa (max 3 frasi).`;
            const response = await ai.models.generateContent({ model: aiSettings.model, contents: prompt });
            setAiInsight(response.text?.trim() || "Analisi non disponibile. L'AI non ha restituito testo.");
        } catch (error) {
            setAiInsight("Impossibile generare analisi. Riprova tra poco.");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (userClasses.length === 0) {
        return (
            <div className="page-container-full">
                <h1 className="m3-display-medium">Analytics Hub</h1>
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </div>
        );
    }

    return (
        <div className="page-container-full space-y-6 flex flex-col items-center px-2 sm:px-4 md:px-6 lg:px-0" style={{width:'100%', maxWidth:'100vw'}}>
            <h1 className="m3-display-medium w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6">Analytics Hub</h1>

            {/* Responsive Card: Filters */}
            <div className="card !bg-surface-container-low shadow-md !rounded-[32px] w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-end">
                    <SelectField label="Classe" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudentId('all'); }}>
                        {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField>
                    <SelectField label="Studente" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                        <option value="all">Tutta la Classe (Media)</option>
                        {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                    </SelectField>
                    <SelectField label="Materia" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                        <option value="all">Tutte le Materie</option>
                        {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                    </SelectField>
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[11px] text-primary font-black uppercase tracking-[0.25em] px-2 block">Modalità Vista</label>
                        <div className="segmented-button-group w-full !mb-0 shadow-sm border-outline-variant flex">
                            <button onClick={() => setChartType('trend')} className={`segmented-button flex-1 ${chartType === 'trend' ? 'active' : ''}`} title="Trend Temporale"><span className="material-symbols-outlined">show_chart</span></button>
                            <button onClick={() => setChartType('radar')} className={`segmented-button flex-1 ${chartType === 'radar' ? 'active' : ''}`} title="Radar Competenze"><span className="material-symbols-outlined">radar</span></button>
                            <button onClick={() => setChartType('dist')} className={`segmented-button flex-1 ${chartType === 'dist' ? 'active' : ''}`} title="Distribuzione Voti"><span className="material-symbols-outlined">bar_chart</span></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Card: Chart & AI */}
            <div className="card flex flex-col relative shadow-2xl !rounded-[40px] w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-8 min-h-[320px] md:min-h-[420px] lg:min-h-[450px]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6 md:mb-10">
                    <h2 className="m3-title-large font-black uppercase tracking-[0.2em] text-on-surface/50">
                        {chartType === 'trend' && 'Andamento Temporale'}
                        {chartType === 'radar' && 'Radar Competenze'}
                        {chartType === 'dist' && 'Distribuzione Voti'}
                    </h2>
                    <button onClick={handleAskAi} disabled={isAiLoading} className="button button-tonal !h-10 !px-6 m3-label-small font-black shadow-md">
                        <span className="material-symbols-outlined m3-label-large mr-2">auto_awesome</span> ANALISI AI
                    </button>
                </div>
                <div className="flex-grow flex items-center justify-center p-2 sm:p-4 w-full min-h-[180px] md:min-h-[260px] lg:min-h-[320px]">
                    {chartType === 'trend' && <LineChart data={trendData} color="var(--sys-primary)" />}
                    {chartType === 'radar' && <RadarChart data={radarData} color="var(--sys-tertiary)" />}
                    {chartType === 'dist' && <div className="w-full max-w-2xl"><BarChart data={distData} color="var(--sys-secondary)" /></div>}
                </div>
                {(isAiLoading || aiInsight) && (
                    <div className="mt-6 md:mt-10 p-4 md:p-8 bg-surface-container-high rounded-[32px] md:rounded-[40px] border border-outline-variant animate-in slide-in-from-bottom-4 shadow-inner w-full max-w-2xl mx-auto">
                        {isAiLoading ? <AiThinkingGem size="small" text="Elaborazione Insight..." inline /> : (
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 md:gap-5">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                                    </div>
                                    <p className="m3-body-medium font-bold leading-relaxed text-on-surface">{aiInsight}</p>
                                </div>
                                <div className="pl-10 md:pl-16">
                                    <AiMemoryChip label={`Insight AI • Dati Classe ${selectedClass}`} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsHub;
