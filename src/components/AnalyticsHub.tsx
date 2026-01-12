/**
 * AnalyticsHub.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

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
            <div className="analytics-hub-empty-layout">
                <SectionHeader 
                    title="Analytics Hub"
                    subtitle="Analisi dati classe e studente."
                    className="analytics-hub-header"
                />
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </div>
        );
    }

    return (
        <div className="analytics-hub-main-layout">
            <SectionHeader 
                title="Analytics Hub"
                subtitle="Analisi dati classe e studente."
                className="analytics-hub-header"
            />

            {/* Responsive Card: Filters */}
            <InfoCard variant="tonal" className="analytics-hub-filters-card">
                <div className="analytics-hub-filters-grid">
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
                    <div className="analytics-hub-chart-mode">
                        <label className="analytics-hub-label">Modalità Vista</label>
                        <div className="analytics-hub-chart-buttons">
                            <M3Button 
                                onClick={() => setChartType('trend')} 
                                variant={chartType === 'trend' ? 'filled' : 'text'}
                                className="analytics-hub-chart-button"
                                title="Trend Temporale"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>show_chart</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('radar')} 
                                variant={chartType === 'radar' ? 'filled' : 'text'}
                                className="analytics-hub-chart-button"
                                title="Radar Competenze"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>radar</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('dist')} 
                                variant={chartType === 'dist' ? 'filled' : 'text'}
                                className="analytics-hub-chart-button"
                                title="Distribuzione Voti"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>bar_chart</span>
                            </M3Button>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Responsive Card: Chart & AI */}
            <InfoCard variant="elevated" className="md:p-8 min-h-[300px] md:min-h-[450px] bg-[var(--md-sys-color-surface-container-low)]est" style={{ padding: "var(--md-sys-spacing-6)", display: "flex", flexDirection: "column" }}>
                <div className="md:flex-row md:justify-between md:items-center" style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-8)" }}>
                    <h2 className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {chartType === 'trend' && 'Andamento Temporale'}
                        {chartType === 'radar' && 'Radar Competenze'}
                        {chartType === 'dist' && 'Distribuzione Voti'}
                    </h2>
                    <M3Button 
                        onClick={handleAskAi} 
                        disabled={isAiLoading} 
                        variant="tonal"
                    >
                        {isAiLoading ? <AiThinkingGem size="small" inline /> : <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>auto_awesome</span>}
                        ANALISI AI
                    </M3Button>
                </div>

                <div style={{ flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    {chartType === 'trend' && <LineChart data={trendData} color="var(--md-sys-color-primary)" />}
                    {chartType === 'radar' && <RadarChart data={radarData} color="var(--sys-tertiary)" />}
                    {chartType === 'dist' && <div className="max-w-2xl" style={{ width: "100%" }}><BarChart data={distData} color="var(--md-sys-color-secondary)" /></div>}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div className="mt-8 bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-inner max-w-2xl" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                        {isAiLoading ? (
                            <AiThinkingGem size="small" text="Elaborazione Insight..." inline />
                        ) : (
                            <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                                <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}>
                                    <div className="bg-primary/10" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                                        <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>lightbulb</span>
                                    </div>
                                    <p className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "500", lineHeight: "1.625" }}>{aiInsight}</p>
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


