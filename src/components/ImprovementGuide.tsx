import React, { useState, useEffect, useMemo } from 'react';
import { AiSettings, Lezione, RegisterEntry, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { getGoogleAIClient } from '../services/aiClient';
import { RATING_TO_VALUE, RATING_OPTIONS } from '../constants';
import EditableContentCard from './EditableContentCard';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import AiAdvisor from './AiAdvisor';
import { generateHtmlDocxBlob } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import { AiMemoryChip, M3Button, InfoCard, SectionHeader, AiThinkingGem } from './ui';

interface ImprovementGuideProps {
    selectedClass: string;
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    lessons: Record<string, Lezione>;
    register: RegisterEntry[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
}

interface AnalysisResult {
    sintesiGenerale: string;
    puntiDiForza: string[];
    areeDiMiglioramento: string[];
    casiParticolari: string[];
}

const ImprovementGuide: React.FC<ImprovementGuideProps> = ({
    selectedClass,
    students,
    evaluations,
    competencyEvaluations,
    lessons,
    register,
    settings,
    aiSettings,
}) => {
    const [loadingStatus, setLoadingStatus] = useState<string | null>("Inizializzazione...");
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const classStudents = useMemo(() => students.filter(s => s.classe === selectedClass), [students, selectedClass]);
    const classEvaluations = useMemo(() => evaluations.filter(e => classStudents.some(s => s.id === e.studenteId)), [evaluations, classStudents]);
    const classCompetencyEvals = useMemo(() => competencyEvaluations.filter(e => classStudents.some(s => s.id === e.studenteId)), [competencyEvaluations, classStudents]);

    useEffect(() => {
        const generateAnalysis = async () => {
            if (classStudents.length === 0) {
                setError("Nessuno studente in questa classe per poter generare un'analisi.");
                setLoadingStatus(null);
                return;
            }

            setLoadingStatus("Lettura dati registro...");
            setError('');
            try {
                // Short delay to allow UI to render "Reading data..." before heavy AI op
                await new Promise(r => setTimeout(r, 600));

                const ai = await getGoogleAIClient();

                // 1. Pre-process data for the AI
                const dataSummary = {
                    numeroStudenti: classStudents.length,
                    disciplines: settings.disciplines,
                    competenzeFramework: settings.competenze.map(c => ({ nome: c.nome, livelli: c.livelli.map(l => l.descrizione) })),
                    valutazioniRecenti: classEvaluations.slice(-20).map(e => ({ materia: e.materia, tipo: e.tipo, voto: e.voto })),
                    livelliCompetenzeRaggiunti: classCompetencyEvals.map(e => {
                        const comp = settings.competenze.find(c => c.id === e.competenzaId);
                        const level = comp?.livelli.find(l => l.id === e.livelloId);
                        return { competenza: comp?.nome, livello: level?.descrizione };
                    }),
                };

                setLoadingStatus("Analisi del contesto classe...");

                const prompt = `
Sei un esperto pedagogista e assistente per docenti. Il tuo compito è analizzare i dati di una classe e produrre un report sintetico e professionale, adatto per un consiglio di classe.
Dati della Classe ${selectedClass}:
${JSON.stringify(dataSummary, null, 2)}

Basandoti su questi dati, genera una risposta in formato JSON con la seguente struttura:
{
  "sintesiGenerale": "Un paragrafo che riassume l'andamento generale della classe, il clima e il livello di partecipazione.",
  "puntiDiForza": ["Un elenco di 2-3 punti di forza principali della classe (es. 'Buona collaborazione', 'Solide basi nelle materie pratiche')."],
  "areeDiMiglioramento": ["Un elenco di 2-3 aree dove la classe mostra difficoltà o incertezze (es. 'Fragilità nel problem solving complesso', 'Applicazione del metodo di studio da consolidare')."],
  "casiParticolari": ["Un elenco di 2-3 osservazioni su trend specifici, senza fare nomi, mas descrivendo le situazioni (es. 'Si nota un piccolo gruppo di studenti con un rendimento eccellente e in costante crescita.', 'Alcuni studenti mostrano un calo di rendimento nelle prove scritte, pur mantenendo un buon orale.')."]
}
Usa un linguaggio formale, costruttivo e basato sui dati. La tua risposta deve essere solo l'oggetto JSON.
`;

                const response = await ai.models.generateContent({
                    model: aiSettings.model,
                    contents: prompt,
                    config: { responseMimeType: 'application/json' },
                });

                setLoadingStatus("Formattazione report...");
                if (!response.text) throw new Error("L'AI non ha restituito testo.");
                const result = JSON.parse(response.text);
                setAnalysis(result);

            } catch (err) {
                console.error("AI Analysis Error:", err);
                setError("Impossibile generare l'analisi AI. Assicurati di avere abbastanza dati registrati (voti, competenze) e riprova.");
            } finally {
                setLoadingStatus(null);
            }
        };

        generateAnalysis();
    }, [selectedClass, students, evaluations, competencyEvaluations, settings, aiSettings]);


    // Data for Charts
    const gradeDistributionData = useMemo(() => {
        const gradeCounts = classEvaluations.reduce((acc, curr) => {
            const gradeKey = RATING_TO_VALUE[curr.voto] ? Math.floor(RATING_TO_VALUE[curr.voto]).toString() : curr.voto;
            acc[gradeKey] = (acc[gradeKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return RATING_OPTIONS.map(v => v.toString()).filter(v => gradeCounts[RATING_TO_VALUE[v]?.toString()] || gradeCounts[v]).map(v => ({
            label: v,
            value: gradeCounts[RATING_TO_VALUE[v]?.toString()] || gradeCounts[v] || 0
        }));
    }, [classEvaluations]);

    const competencyLevelData = useMemo(() => {
        const data: { name: string; levels: { name: string; value: number }[] }[] = [];
        settings.competenze.forEach(comp => {
            const levelCounts: Record<string, number> = {};
            comp.livelli.forEach(l => levelCounts[l.descrizione] = 0);

            classStudents.forEach(student => {
                const latestEval = classCompetencyEvals
                    .filter(e => e.studenteId === student.id && e.competenzaId === comp.id)
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

                if (latestEval) {
                    const level = comp.livelli.find(l => l.id === latestEval.livelloId);
                    if (level) {
                        levelCounts[level.descrizione]++;
                    }
                }
            });

            data.push({
                name: comp.nome,
                levels: comp.livelli.map(l => ({ name: l.descrizione, value: levelCounts[l.descrizione] }))
            });
        });
        return data;
    }, [classCompetencyEvals, classStudents, settings.competenze]);

    const objectiveAchievementData = useMemo(() => {
        const classRegisterEntries = register.filter(e => e.classe === selectedClass);
        let totalObjectives = 0;
        let checkedObjectives = 0;

        classRegisterEntries.forEach(entry => {
            const lesson = lessons[entry.lessonId];
            if (lesson && lesson.obiettivi) {
                const objectivesList = lesson.obiettivi.split('\n').filter(o => o.trim() !== '');
                totalObjectives += objectivesList.length;
                if (entry.checkedObjectives) {
                    checkedObjectives += Object.values(entry.checkedObjectives).filter(Boolean).length;
                }
            }
        });

        if (totalObjectives === 0) return null;

        return [
            { label: 'Raggiunti', value: checkedObjectives, color: 'var(--sys-primary)' },
            { label: 'Non Verificati', value: totalObjectives - checkedObjectives, color: 'var(--sys-surface-container-highest)' }
        ];
    }, [register, lessons, selectedClass]);


    const handleExportDocx = async () => {
        if (!analysis) return;

        let html = `
        <style>@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap'); body { font-family: 'Roboto', sans-serif; line-height: 1.6; } h1 { color: var(--sys-primary); /* MD3 fix */ } h2 { color: var(--sys-primary); /* MD3 fix */ border-bottom: 1px solid var(--sys-outline-variant); /* MD3 fix */ padding-bottom: 5px; margin-top: 20px; } p { margin-bottom: 10px; } ul { margin-bottom: 10px; } strong { color: var(--sys-primary); /* MD3 fix */ } .header-info { background-color: var(--sys-surface); /* MD3 fix */ padding: 12px; border-radius: var(--md-corner-4); /* MD3 fix */ margin-bottom: 20px; }</style>
        `;

        html += `<h1>Analisi Classe ${selectedClass}</h1>`;
        html += `<div class="header-info">
            <p><strong>Data Report:</strong> ${new Date().toLocaleDateString('it-IT')}</p>
            <p><strong>Numero Studenti:</strong> ${classStudents.length}</p>
        </div>`;

        html += `<h2>Sintesi Generale</h2>`;
        html += `<p>${analysis.sintesiGenerale}</p>`;

        html += `<h2>Punti di Forza</h2><ul>`;
        analysis.puntiDiForza.forEach(p => html += `<li>${p}</li>`);
        html += `</ul>`;

        html += `<h2>Aree di Miglioramento</h2><ul>`;
        analysis.areeDiMiglioramento.forEach(p => html += `<li>${p}</li>`);
        html += `</ul>`;

        html += `<h2>Osservazioni Particolari</h2><ul>`;
        analysis.casiParticolari.forEach(p => html += `<li>${p}</li>`);
        html += `</ul>`;

        const blob = await generateHtmlDocxBlob(html, `Analisi Classe ${selectedClass}`);
        saveAs(blob, `Analisi_Classe_${selectedClass}.docx`);
    };

    if (loadingStatus) {
        return (
            <div className="flex flex-col justify-center items-center p-12 h-64 bg-surface-container-low/30 backdrop-blur-xl rounded-5xl border border-outline-variant/20 animate-in fade-in zoom-in-95 duration-500">
                <AiThinkingGem size="large" text={loadingStatus} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 bg-error/10 border border-error/20 rounded-5xl text-center animate-in fade-in slide-in-from-bottom-4">
                <span className="material-symbols-outlined text-error text-5xl mb-8">error</span>
                <p className="text-error font-black uppercase tracking-widest">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low/30 backdrop-blur-xl p-8 rounded-5xl border border-outline-variant/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">Analisi Classe {selectedClass}</h1>
                    <p className="text-on-surface-variant font-medium opacity-70">Report generato per il consiglio di classe.</p>
                </div>
                <div className="flex gap-6">
                    <M3Button onClick={handleExportDocx} variant="outlined" className="font-black text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined mr-2">description</span>
                        Esporta Word
                    </M3Button>
                    <M3Button onClick={() => window.print()} variant="tonal" className="font-black text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined mr-2">print</span>
                        Stampa
                    </M3Button>
                </div>
            </div>

            {/* AI Summary */}
            <div className="bg-surface-container-low/30 backdrop-blur-xl p-8 rounded-5xl border border-outline-variant/20 space-y-8">
                <div className="flex justify-between items-center">
                    <SectionHeader 
                        title="Sintesi dell'AI" 
                        icon="auto_awesome" 
                        className="!mb-0"
                    />
                    {analysis && <AiMemoryChip label={`Dati Registro ${selectedClass} • ${settings.schoolType}`} />}
                </div>

                {analysis && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EditableContentCard
                            title="Sintesi Generale"
                            icon="summarize"
                            content={analysis.sintesiGenerale}
                            onSave={(newContent) => setAnalysis(prev => prev ? { ...prev, sintesiGenerale: newContent } : null)}
                        />
                        <EditableContentCard
                            title="Punti di Forza"
                            icon="thumb_up"
                            content={analysis.puntiDiForza.join('\n')}
                            onSave={(newContent) => setAnalysis(prev => prev ? { ...prev, puntiDiForza: newContent.split('\n').filter(l => l.trim()) } : null)}
                        />
                        <EditableContentCard
                            title="Aree di Miglioramento"
                            icon="trending_down"
                            content={analysis.areeDiMiglioramento.join('\n')}
                            onSave={(newContent) => setAnalysis(prev => prev ? { ...prev, areeDiMiglioramento: newContent.split('\n').filter(l => l.trim()) } : null)}
                        />
                        <EditableContentCard
                            title="Osservazioni Particolari"
                            icon="person_search"
                            content={analysis.casiParticolari.join('\n')}
                            onSave={(newContent) => setAnalysis(prev => prev ? { ...prev, casiParticolari: newContent.split('\n').filter(l => l.trim()) } : null)}
                        />
                    </div>
                )}
            </div>

            <AiAdvisor
                students={classStudents}
                evaluations={classEvaluations}
                competencyEvals={classCompetencyEvals}
                settings={settings}
                aiSettings={aiSettings}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InfoCard title="Distribuzione Voti" icon="bar_chart" className="h-full">
                    <div className="p-8">
                        <BarChart data={gradeDistributionData} color="var(--sys-secondary)" />
                    </div>
                </InfoCard>
                {objectiveAchievementData && (
                    <InfoCard title="Raggiungimento Obiettivi" icon="pie_chart" className="h-full">
                        <div className="flex justify-center p-8">
                            <DonutChart data={objectiveAchievementData} />
                        </div>
                    </InfoCard>
                )}
            </div>

            <InfoCard title="Livelli di Competenza" icon="school">
                <div className="space-y-10 p-8">
                    {competencyLevelData.map(compData => (
                        <div key={compData.name} className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant opacity-70">{compData.name}</h3>
                            <BarChart
                                data={compData.levels.map(l => ({ label: l.name, value: l.value }))}
                                color="var(--sys-tertiary)"
                                horizontal
                            />
                        </div>
                    ))}
                </div>
            </InfoCard>

        </div>
    );
};

export default ImprovementGuide;
