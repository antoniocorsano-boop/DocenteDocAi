
import React, { useState, useEffect, useMemo } from 'react';
import { AiSettings, Competenza, Lezione, RegisterEntry, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza } from '../types';
import { getGoogleAIClient } from '../services/aiClient';
import { RATING_TO_VALUE, RATING_OPTIONS } from '../constants';
import EditableContentCard from './EditableContentCard';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import AiAdvisor from './AiAdvisor';
import { generateHtmlDocxBlob } from '../utils/documentUtils';
import { saveAs } from '../utils/documentUtils';
import AiThinkingGem from './AiThinkingGem';
import { AiMemoryChip } from './M3Components';

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
  "casiParticolari": ["Un elenco di 2-3 osservazioni su trend specifici, senza fare nomi, ma descrivendo le situazioni (es. 'Si nota un piccolo gruppo di studenti con un rendimento eccellente e in costante crescita.', 'Alcuni studenti mostrano un calo di rendimento nelle prove scritte, pur mantenendo un buon orale.')."]
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
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            h1 { color: #2E74B5; }
            h2 { color: #2E74B5; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; }
            p { margin-bottom: 10px; }
            ul { margin-bottom: 10px; }
            strong { color: #333; }
            .header-info { background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
        </style>
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
            <div className="flex flex-col justify-center items-center p-12 h-64">
                <AiThinkingGem size="large" text={loadingStatus} />
            </div>
        );
    }

    if (error) {
        return <div className="card text-center p-8 bg-error-container text-on-error-container">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 className="page-title">Analisi Classe {selectedClass}</h1>
                    <p className="m3-body-large text-on-surface-variant -mt-4">Report generato per il consiglio di classe.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportDocx} className="button button-outlined">
                        <span className="material-symbols-outlined mr-2">description</span>
                        Esporta Word
                    </button>
                    <button onClick={() => window.print()} className="button button-tonal">
                        <span className="material-symbols-outlined mr-2">print</span>
                        Stampa
                    </button>
                </div>
            </div>

            {/* AI Summary */}
            <div className="card">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="m3-title-large flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        Sintesi dell'AI
                    </h2>
                    {analysis && <AiMemoryChip label={`Dati Registro ${selectedClass} • ${settings.schoolType}`} />}
                </div>

                {analysis && (
                    <div className="space-y-4">
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
            <div className="improvement-guide-grid">
                <div className="card">
                    <h2 className="m3-title-large mb-4">Distribuzione Voti</h2>
                    <BarChart data={gradeDistributionData} color="var(--sys-secondary)" />
                </div>
                {objectiveAchievementData && (
                    <div className="card flex flex-col items-center">
                        <h2 className="m3-title-large mb-4">Raggiungimento Obiettivi</h2>
                        <DonutChart data={objectiveAchievementData} />
                    </div>
                )}
            </div>

            <div className="card">
                <h2 className="m3-title-large mb-4">Livelli di Competenza</h2>
                <div className="space-y-6">
                    {competencyLevelData.map(compData => (
                        <div key={compData.name}>
                            <h3 className="m3-title-medium mb-2">{compData.name}</h3>
                            <BarChart
                                data={compData.levels.map(l => ({ label: l.name, value: l.value }))}
                                color="var(--sys-tertiary)"
                                horizontal
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ImprovementGuide;
