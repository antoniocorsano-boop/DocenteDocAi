// LEGACY - MD3 Non-compliant
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
import { useTheme } from '../theme/theme';
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
  const { layers } = useTheme();
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
            <div >
                <SectionHeader 
                    title="Analytics Hub"
                    subtitle="Analisi dati classe e studente."
                    
                />
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </div>
        );
    }

    return (
        <div >
            <SectionHeader 
                title="Analytics Hub"
                subtitle="Analisi dati classe e studente."
                
            />

            {/* Responsive Card: Filters */}
            <InfoCard variant="tonal" >
                <div >
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
                    <div >
                        <label >Modalità Vista</label>
                        <div >
                            <M3Button 
                                onClick={() => setChartType('trend')} 
                                variant={chartType === 'trend' ? 'filled' : 'text'}
                                
                                title="Trend Temporale"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>show_chart</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('radar')} 
                                variant={chartType === 'radar' ? 'filled' : 'text'}
                                
                                title="Radar Competenze"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>radar</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('dist')} 
                                variant={chartType === 'dist' ? 'filled' : 'text'}
                                
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
            <InfoCard variant="elevated" style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]est }} style={{padding: layers.ref.spacing['6'], display: "flex", flexDirection: "column"}}>
                <div  style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['8']}}>
                    <h2 style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {chartType === 'trend' && 'Andamento Temporale'}
                        {chartType === 'radar' && 'Radar Competenze'}
                        {chartType === 'dist' && 'Distribuzione Voti'}
                    </h2>
                    <M3Button 
                        onClick={handleAskAi} 
                        disabled={isAiLoading} 
                        variant="tonal"
                    >
                        {isAiLoading ? <AiThinkingGem size="small" inline /> : <span  style={{ marginRight: "0.5rem" }}>auto_awesome</span>}
                        ANALISI AI
                    </M3Button>
                </div>

                <div style={{ flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    {chartType === 'trend' && <LineChart data={trendData} color="var(--md-sys-color-primary)" />}
                    {chartType === 'radar' && <RadarChart data={radarData} color="var(--sys-tertiary)" />}
                    {chartType === 'dist' && <div  style={{ width: "100%" }}><BarChart data={distData} color="var(--md-sys-color-secondary)" /></div>}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline", width: "100%", marginLeft: "auto", marginRight: "auto"}}>
                        {isAiLoading ? (
                            <AiThinkingGem size="small" text="Elaborazione Insight..." inline />
                        ) : (
                            <div style={{marginTop: layers.ref.spacing['4']}}>
                                <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
                                    <div style={{ backgroundColor: sys.colors.primary/10 }} style={{ width: "2.5rem", height: "2.5rem", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                                        <span  style={{color: "layers.sys.colors.primary"}}>lightbulb</span>
                                    </div>
                                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "500", lineHeight: "1.625" }}>{aiInsight}</p>
                                </div>
                                <div >
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



