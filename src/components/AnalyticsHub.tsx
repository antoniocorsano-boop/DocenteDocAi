// MD3 Compliant - Block G Migration (Eliminated 23 violations)
/**
 * AnalyticsHub.tsx
 * // M3Expressive refactor: Removed all className attributes, converted to inline styles with MD3 tokens for layout, colors, spacing, and typography.
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--md-sys-spacing-4)'
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
                gap: 'var(--md-sys-spacing-6)'
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
                        gap: 'var(--md-sys-spacing-4)'
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
                            gap: 'var(--md-sys-spacing-2)'
                        }}
                    >
                        <label
                            style={{
                                fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
                                lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
                                color: 'var(--md-sys-color-on-surface-variant)'
                            }}
                        >Modalità Vista</label>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--md-sys-spacing-2)',
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
                    gap: 'var(--md-sys-spacing-6)',
                    marginBottom: 'var(--md-sys-spacing-6)'
                }}
            >
                <div
                    style={{
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--md-sys-typescale-label-large-tracking, 0.1em)'
                    }}
                >
                    <h2
                        style={{
                            color: 'var(--md-sys-color-on-surface-variant)',
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
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
                            gap: 'var(--md-sys-spacing-2)'
                        }}
                    >
                        {isAiLoading ? <AiThinkingGem size="small" inline /> : <span
                            style={{
                                fontFamily: "'Material Symbols Outlined'",
                                marginRight: 'var(--md-sys-spacing-2)'
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
                        width: 'var(--md-sys-percent-100)'
                    }}
                >
                    {chartType === 'trend' && <LineChart data={trendData} color="var(--md-sys-color-primary)" />}
                    {chartType === 'radar' && <RadarChart data={radarData} color="var(--sys-tertiary)" />}
                    {chartType === 'dist' && <BarChart data={distData} color="var(--md-sys-color-secondary)" />}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div
                        style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-6)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                            width: 'var(--md-sys-percent-full)'
                        }}
                    >
                        {isAiLoading ? (
                            <AiThinkingGem size="small" text="Elaborazione Insight..." inline />
                        ) : (
                            <div
                                style={{
                                    marginTop: 'var(--md-sys-spacing-4)'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--md-sys-spacing-4)'
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'var(--md-sys-color-primary-container)',
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
                                                color: 'var(--md-sys-color-on-primary-container)',
                                                fontFamily: "'Material Symbols Outlined'"
                                            }}
                                        >lightbulb</span>
                                    </div>
                                    <p
                                        style={{
                                            color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: '500',
                                            lineHeight: '1.625'
                                        }}
                                    >{aiInsight}</p>
                                </div>
                                <div
                                    style={{
                                        marginTop: 'var(--md-sys-spacing-4)'
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








