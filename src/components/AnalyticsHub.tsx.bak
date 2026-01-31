// MD3 Compliant - Block G Migration (Eliminated 23 violations)
/**
 * AnalyticsHub.tsx
 * // M3Expressive refactor: Removed all className attributes, converted to inline styles with MD3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, AiSettings } from '../types';
const LineChart = lazy(() => import('./charts/AdvancedCharts').then(m => ({ default: m.LineChart })));
const RadarChart = lazy(() => import('./charts/AdvancedCharts').then(m => ({ default: m.RadarChart })));
const BarChart = lazy(() => import('./charts/BarChart'));
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--app-spacing-container)'
                }}
            >
                <SectionHeader 
                    title="Analytics Hub"
                    subtitle="Analisi dati classe e studente."
                    
                />
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-section)'
            }}
        >
            <SectionHeader 
                title="Analytics Hub"
                subtitle="Analisi dati classe e studente."
                
            />

            {/* Responsive Card: Filters */}
            <InfoCard variant="tonal" >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(var(--md-sys-spacing-25), var(--md-sys-grid-fr-1)))`,
                        gap: 'var(--app-spacing-container)'
                    }}
                >
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-component)'
                        }}
                    >
                        <label
                            style={{
                                fontSize: 'var(--app-text-body)',
                                fontWeight: 'var(--app-text-body-weight)',
                                lineHeight: 'var(--app-text-body-line-height)',
                                color: 'var(--app-color-on-surface-variant)'
                            }}
                        >Modalità Vista</label>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--app-spacing-component)',
                                flexWrap: 'wrap'
                            }}
                        >
                            <M3Button 
                                onClick={() => setChartType('trend')} 
                                variant={chartType === 'trend' ? 'filled' : 'text'}
                                
                                title="Trend Temporale"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >show_chart</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('radar')} 
                                variant={chartType === 'radar' ? 'filled' : 'text'}
                                
                                title="Radar Competenze"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >radar</span>
                            </M3Button>
                            <M3Button 
                                onClick={() => setChartType('dist')} 
                                variant={chartType === 'dist' ? 'filled' : 'text'}
                                
                                title="Distribuzione Voti"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >bar_chart</span>
                            </M3Button>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Responsive Card: Chart & AI */}
            <InfoCard
                variant="elevated"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-section)',
                    marginBottom: 'var(--app-spacing-section)'
                }}
            >
                <div
                    style={{
                        color: 'var(--app-color-on-surface-variant)',
                        fontSize: 'var(--app-text-body)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--md-sys-typescale-label-large-tracking, 0.1em)'
                    }}
                >
                    <h2
                        style={{
                            color: 'var(--app-color-on-surface-variant)',
                            fontSize: 'var(--app-text-body)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--md-sys-typescale-label-large-tracking, 0.1em)'
                        }}
                    >
                        {chartType === 'trend' && 'Andamento Temporale'}
                        {chartType === 'radar' && 'Radar Competenze'}
                        {chartType === 'dist' && 'Distribuzione Voti'}
                    </h2>
                    <M3Button 
                        onClick={handleAskAi} 
                        disabled={isAiLoading} 
                        variant="tonal"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)'
                        }}
                    >
                        {isAiLoading ? <AiThinkingGem size="small" inline /> : <span
                            style={{
                                fontFamily: "'Material Symbols Outlined'",
                                marginRight: 'var(--app-spacing-component)'
                            }}
                        >auto_awesome</span>}
                        ANALISI AI
                    </M3Button>
                </div>

                <div
                    style={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'var(--app-layout-full)'
                    }}
                >
                    {chartType === 'trend' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <LineChart data={trendData} color="var(--app-color-primary)" />
                        </Suspense>
                    )}
                    {chartType === 'radar' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <RadarChart data={radarData} color="var(--sys-tertiary)" />
                        </Suspense>
                    )}
                    {chartType === 'dist' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <BarChart data={distData} color="var(--app-color-secondary)" />
                        </Suspense>
                    )}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div
                        style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--app-spacing-section)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                            width: 'var(--md-sys-percent-full)'
                        }}
                    >
                        {isAiLoading ? (
                            <AiThinkingGem size="small" text="Elaborazione Insight..." inline />
                        ) : (
                            <div
                                style={{
                                    marginTop: 'var(--app-spacing-container)'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--app-spacing-container)'
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'var(--app-color-primary-container)',
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'var(--app-color-on-primary-container)',
                                                fontFamily: "'Material Symbols Outlined'"
                                            }}
                                        >lightbulb</span>
                                    </div>
                                    <p
                                        style={{
                                            color: 'var(--app-color-on-surface)',
                                            fontWeight: '500',
                                            lineHeight: '1.625'
                                        }}
                                    >{aiInsight}</p>
                                </div>
                                <div
                                    style={{
                                        marginTop: 'var(--app-spacing-container)'
                                    }}
                                >
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








