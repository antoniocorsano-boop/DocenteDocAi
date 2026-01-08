import React, { useState, useMemo, useEffect } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
import { LineChart, RadarChart } from './charts/AdvancedCharts';
import BarChart from './charts/BarChart';
import { calculateClassTrend, calculateCompetencyRadar, calculateGradeDistribution } from '../utils/analyticsUtils';
import { getGoogleAIClient } from '../services/aiClient';
import { 
    EmptyState, 
    AiMemoryChip, 
    SelectField, 
    M3Button, 
    InfoCard, 
    SectionHeader,
    AiThinkingGem 
} from './ui';

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
        } catch {
            setAiInsight("Impossibile generare analisi. Riprova tra poco.");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (userClasses.length === 0) {
        return (
            <div className="page-layout max-w-6xl mx-auto w-full px-4">
                <SectionHeader 
                    title="Analytics Hub"
                    subtitle="Analisi dati classe e studente."
                    className="py-12 text-center"
                />
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </div>
        );
    }

    return (
        <div className="page-layout max-w-6xl mx-auto w-full px-4 pb-24">
            <SectionHeader 
                title="Analytics Hub"
                subtitle="Analisi dati classe e studente."
                className="py-12 text-center"
            />

            {/* Responsive Card: Filters */}
            <InfoCard variant="tonal" className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 items-end">
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
                        <label className="m3-label-small text-primary font-black uppercase tracking-[0.25em] px-4 block">Modalità Vista</label>
                        <div className="flex gap-4 bg-surface-container-high p-1 rounded-xl">
                            <M3Button 
                                onClick={() => setChartType('trend')} 
                                variant={chartType === 'trend' ? 'filled' : 'text'}
                                className="flex-1 !min-w-0 !px-0"
                                title="Trend Temporale"
                            >
                                <span className="material-symbols-outlined">show_chart</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('radar')} 
                                variant={chartType === 'radar' ? 'filled' : 'text'}
                                className="flex-1 !min-w-0 !px-0"
                                title="Radar Competenze"
                            >
                                <span className="material-symbols-outlined">radar</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('dist')} 
                                variant={chartType === 'dist' ? 'filled' : 'text'}
                                className="flex-1 !min-w-0 !px-0"
                                title="Distribuzione Voti"
                            >
                                <span className="material-symbols-outlined">bar_chart</span>
                            </M3Button>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Responsive Card: Chart & AI */}
            <InfoCard variant="elevated" className="p-6 md:p-8 min-h-[300px] md:min-h-[450px] flex flex-col bg-surface-container-lowest">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-8">
                    <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        {chartType === 'trend' && 'Andamento Temporale'}
                        {chartType === 'radar' && 'Radar Competenze'}
                        {chartType === 'dist' && 'Distribuzione Voti'}
                    </h2>
                    <M3Button 
                        onClick={handleAskAi} 
                        disabled={isAiLoading} 
                        variant="tonal"
                    >
                        {isAiLoading ? <AiThinkingGem size="small" inline /> : <span className="material-symbols-outlined mr-2">auto_awesome</span>}
                        ANALISI AI
                    </M3Button>
                </div>

                <div className="flex-grow flex items-center justify-center w-full">
                    {chartType === 'trend' && <LineChart data={trendData} color="var(--sys-primary)" />}
                    {chartType === 'radar' && <RadarChart data={radarData} color="var(--sys-tertiary)" />}
                    {chartType === 'dist' && <div className="w-full max-w-2xl"><BarChart data={distData} color="var(--sys-secondary)" /></div>}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div className="mt-8 p-6 bg-surface-container-high rounded-3xl border border-outline-variant/30 shadow-inner w-full max-w-2xl mx-auto">
                        {isAiLoading ? (
                            <AiThinkingGem size="small" text="Elaborazione Insight..." inline />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-8">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                                    </div>
                                    <p className="text-on-surface font-medium leading-relaxed">{aiInsight}</p>
                                </div>
                                <div className="pl-14">
                                    <AiMemoryChip label={`Insight AI • Dati Classe ${selectedClass}`} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </InfoCard>
        </div>
    );
};

export default AnalyticsHub;
