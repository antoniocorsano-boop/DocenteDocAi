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
    InfoCard,
    SectionHeader,
    AiThinkingGem,
} from './ui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

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
            <InfoCard variant="outlined" >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(var(--md-sys-spacing-25), var(--md-sys-grid-fr-1)))`,
                        gap: 'var(--md-sys-spacing-4)'
                    }}
                >
                    <FormControl size="small" fullWidth>
                        <InputLabel>Classe</InputLabel>
                        <Select label="Classe" value={selectedClass} onChange={e => { setSelectedClass(e.target.value as string); setSelectedStudentId('all'); }}>
                            {userClasses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Studente</InputLabel>
                        <Select label="Studente" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value as string)}>
                            <MenuItem value="all">Tutta la Classe (Media)</MenuItem>
                            {filteredStudents.map(s => <MenuItem key={s.id} value={s.id}>{s.cognome} {s.nome}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Materia</InputLabel>
                        <Select label="Materia" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value as string)}>
                            <MenuItem value="all">Tutte le Materie</MenuItem>
                            {settings.disciplines.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-2)'
                        }}
                    >
                        <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Modalità Vista</Typography>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--md-sys-spacing-2)',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Button 
                                onClick={() => setChartType('trend')} 
                                variant={chartType === 'trend' ? 'contained' : 'text'}
                                
                                title="Trend Temporale"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >show_chart</span>
                            </Button>
                            <Button 
                                onClick={() => setChartType('radar')} 
                                variant={chartType === 'radar' ? 'contained' : 'text'}
                                
                                title="Radar Competenze"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >radar</span>
                            </Button>
                            <Button 
                                onClick={() => setChartType('dist')} 
                                variant={chartType === 'dist' ? 'contained' : 'text'}
                                
                                title="Distribuzione Voti"
                            >
                                <span
                                    style={{
                                        fontFamily: "'Material Symbols Outlined'"
                                    }}
                                >bar_chart</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Responsive Card: Chart & AI */}
            <InfoCard
                elevation={1}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-6)',
                    marginBottom: 'var(--md-sys-spacing-6)'
                }}
            >
                <Typography
                    variant="h6"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                    {chartType === 'trend' && 'Andamento Temporale'}
                    {chartType === 'radar' && 'Radar Competenze'}
                    {chartType === 'dist' && 'Distribuzione Voti'}
                </Typography>
                    <Button 
                        onClick={handleAskAi} 
                        disabled={isAiLoading} 
                        variant="outlined"
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
                    </Button>

                    <div
                        style={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'var(--md-sys-percent-100)'
                        }}
                    >
                    {chartType === 'trend' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <LineChart data={trendData} color="var(--md-sys-color-primary)" />
                        </Suspense>
                    )}
                    {chartType === 'radar' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <RadarChart data={radarData} color="var(--md-sys-color-tertiary)" />
                        </Suspense>
                    )}
                    {chartType === 'dist' && (
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <BarChart data={distData} color="var(--md-sys-color-secondary)" />
                        </Suspense>
                    )}
                </div>

                {(isAiLoading || aiInsight) && (
                    <div
                        style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-6)',
                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                            width: 'var(--md-sys-percent-100)'
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
                                    <Typography
                                        variant="body1"
                                        style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}
                                    >{aiInsight}</Typography>
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

