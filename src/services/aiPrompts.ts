

import { Uda, Lezione, Competenza, PianoInclusione, KnowledgeBaseEntry } from '../types';

export const JSON_OUTPUT_FORMAT_LESSON = `{
    "contenuto": "Un titolo specifico e sequenziale per la lezione (es. '3. Modellazione delle Forme Complesse')",
    "tipoLezione": "Il tipo di lezione più appropriato ('Teoria', 'Laboratorio', 'Disegno', 'Test', 'Verifica')",
    "obiettivi": "Un elenco puntato di 2-3 obiettivi didattici specifici, formattato come una singola stringa con \\n per le nuove righe.",
    "compiti": "Una breve idea concreta per i compiti a casa.",
    "adattamenti": "Un elenco puntato di 1-2 suggerimenti per l'inclusività basati sui piani forniti, formattato come stringa con \\n. Se non sono necessari o non ci sono piani, restituisci una stringa vuota."
}`;

export const getCircularAnalysisPrompt = (documentText: string, today: string) => `
TASK: Analizza il testo di una circolare scolastica e estrai informazioni strutturate.
TESTO:
---
${documentText}
---
ISTRUZIONI:
1.  **summary**: Riassumi lo scopo in una frase.
2.  **events**: Trova eventi con data specifica. Estrai 'titolo', 'data' (formato ISO AAAA-MM-GG, assumendo oggi: ${today}), e 'oraInizio' (HH:MM).
3.  **deadlines**: Trova scadenze burocratiche o operative. Estrai 'title' e 'date' (AAAA-MM-GG).
4.  **notes**: Estrai il contenuto principale come nota informativa, con un 'title' e 'content'.

FORMATO OUTPUT: Restituisci ESCLUSIVAMENTE un oggetto JSON valido.
`;

export const getLessonSuggestionPrompt = (
    context: {
        classe: string; materia: string; uda?: Uda; existingLessonsInUda: Lezione[];
        topic?: string; knowledgeBase?: KnowledgeBaseEntry[]; pianiInclusione?: PianoInclusione[]; allCompetenze: Competenza[];
    }
) => {
    const inclusionContext = (context.pianiInclusione && context.pianiInclusione.length > 0)
    ? `\n\n**SUPPORTO ALL'INCLUSIVITÀ:**
- **Piani di Inclusione Attivi:** ${context.pianiInclusione.length} studenti con BES/DSA.
- **Richiesta:** Nel campo "adattamenti", suggerisci 1-2 strategie specifiche (es. mappe, tempi aggiuntivi) basate su questi bisogni.`
    : '';

    if (context.uda) {
        const competencyNames = context.uda.competencyIds
            .map(id => context.allCompetenze.find(c => c.id === id)?.nome)
            .filter(Boolean);

        return `
TASK: Generare la prossima lezione logica per un'Unità di Apprendimento (UDA) in corso.

**DATI UDA:**
- **Titolo:** ${context.uda.title}
- **Prodotto Finale:** ${context.uda.finalProduct}
- **Competenze Target:** ${competencyNames.join(', ')}
- **Fasi Previste:**
${context.uda.phases.map(p => `  - ${p.title}: ${p.description}`).join('\n')}

**PROGRESSO ATTUALE (Lezioni già svolte/pianificate):**
${context.existingLessonsInUda.length > 0 ? context.existingLessonsInUda.map(l => `  - "${l.contenuto}"`).join('\n') : '  - Nessuna (Inizio UDA).'}

**INPUT SPECIFICO:** "${context.topic || 'Prosegui sequenza logica'}"
${inclusionContext}

**ISTRUZIONI:**
1. Analizza il progresso rispetto alle fasi dell'UDA.
2. Genera il contenuto della prossima lezione coerente.
3. Definisci obiettivi misurabili e tipo di lezione.

**FORMATO OUTPUT:** JSON
${JSON_OUTPUT_FORMAT_LESSON}
`;
    } else {
        const kbContext = (context.knowledgeBase && context.knowledgeBase.length > 0)
            ? `\n\n**CONTESTO KNOWLEDGE BASE (Usa se pertinente):**\n---\n${context.knowledgeBase.map(e => e.content).join('\n').substring(0, 5000)}\n---`
            : '';

        return `
TASK: Generare una lezione singola (Spot).
ARGOMENTO: "${context.topic || 'Argomento a piacere del programma'}"
${kbContext}
${inclusionContext}

Genera una struttura di lezione completa.

**FORMATO OUTPUT:** JSON
${JSON_OUTPUT_FORMAT_LESSON}
`;
    }
};

export const getPedagogicalAnalysisPrompt = (lesson: { title: string; description: string; }) => `
TASK: Analisi Pedagogica e Inclusiva di un piano lezione.

**LEZIONE DA ANALIZZARE:**
- Titolo: "${lesson.title}"
- Contenuto: "${lesson.description}"

**RICHIESTA:**
Fornisci un output strutturato su due assi:
1. **Engagement (Coinvolgimento):** 3 strategie concrete per rendere la lezione attiva (es. ganci, gamification).
2. **Universal Design for Learning (UDL):** 3 adattamenti per supportare diversi stili di apprendimento (visivo, uditivo, cinestetico).

**FORMATO OUTPUT:** JSON ESCLUSIVO
{
    "engagementSuggestions": [
        { "title": "...", "description": "...", "activityType": "..." }
    ],
    "inclusivityAdaptations": [
        { "targetGroup": "...", "suggestion": "..." }
    ]
}
`;

export const getLessonFromIdeaPrompt = (ideaText: string, kbContent?: string) => `
TASK: Trasformare un appunto informale in un piano di lezione professionale.

**IDEA GREZZA:** "${ideaText}"

${kbContent ? `**CONTESTO DOCUMENTALE (KB):**\n${kbContent.substring(0, 5000)}\n` : ''}

**RICHIESTA:**
Espandi l'idea in una lezione strutturata pronta per l'aula. Cerca di essere creativo ma concreto.

**FORMATO OUTPUT:** JSON ESCLUSIVO
{
    "title": "Titolo Formale",
    "htmlContent": "HTML (senza tag html/body) con: <h2>Obiettivi</h2> (lista), <h2>Svolgimento</h2> (descrizione fasi), <h2>Materiali</h2>, <h2>Compiti</h2>."
}
`;

export const getWebSearchPrompt = (query: string) => `
TASK: Ricerca web sintetica.
QUERY: "${query}"

Fornisci una risposta chiara, fattuale e aggiornata. Se trovi dati statistici o normativi recenti, citali.
`;

export const getClassPlanningPrompt = (data: any) => `
TASK: Redigere il documento "Progettazione Disciplinare di Classe".

**DATI DI INPUT:**
- **Analisi Classe:** ${data.situazionePartenza}
- **Statistiche:** ${data.studentiStats}
- **Inclusione:** ${data.inclusioneStats}
- **UDA Previste:** ${data.udaList}
- **Riferimenti (KB):** ${data.kbContext.substring(0, 10000)}
- **Metodologie:** ${data.metodologie}

**ISTRUZIONI:**
Genera un documento HTML strutturato (h1, h2, p, ul, table) pronto per la stampa/export.
Sezioni richieste:
1. Analisi Situazione di Partenza (usa linguaggio formale).
2. Obiettivi di Apprendimento (OSA) e Obiettivi Minimi.
3. Metodologie e Strumenti.
4. Criteri di Valutazione (griglie, livelli).
5. Scansione Temporale (Tabella UDA vs Periodi).
6. Strategie di Recupero/Potenziamento.

TONO: Istituzionale e professionale.
`;

export const getProactiveSuggestionsPrompt = (studentContext: any[], studentsLength: number, evaluations: any[], competencyEvals: any[], udas: any[]) => `
TASK: Analisi Dati Classe e Suggerimenti Proattivi.

**DATI:**
- Studenti (${studentsLength}): ${JSON.stringify(studentContext)}
- Voti Recenti: ${JSON.stringify(evaluations)}
- Competenze: ${JSON.stringify(competencyEvals)}
- UDA Attive: ${JSON.stringify(udas)}

**OBIETTIVO:**
Identifica 3-4 azioni prioritarie per il docente.
Esempi:
- Studente con calo voti -> Suggerisci 'VIEW_STUDENT'.
- UDA ferma da tempo -> Suggerisci 'VIEW_UDA'.
- Classe con media bassa -> Suggerisci 'ANALYZE_CLASS'.
- Pochi voti registrati -> Suggerisci 'PLAN_LESSON'.

**FORMATO OUTPUT:** JSON ESCLUSIVO (Array)
[{
  "icon": "icona_m3 (es. warning, trending_up)",
  "title": "Titolo breve",
  "description": "Motivazione del suggerimento.",
  "action": { 
      "type": "VIEW_STUDENT" | "PLAN_LESSON" | "ANALYZE_CLASS" | "VIEW_UDA", 
      "payload": { "studentId": "...", "class": "..." } 
  }
}]
`;

export const getQuizPrompt = (config: any, corpusContent: string) => `
TASK: Generare una Verifica Scritta.

**CONFIGURAZIONE:**
- Argomento: "${config.topic}"
- Difficoltà: ${config.difficulty}
- Domande: ${config.questionCount}
- Tipi ammessi: ${config.selectedTypes}

**FONTE (KB):**
${corpusContent.substring(0, 20000)}

**FORMATO OUTPUT:** JSON ESCLUSIVO
{
  "title": "Titolo Verifica",
  "topic": "${config.topic}",
  "difficulty": "${config.difficulty}",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice" | "true_false" | "open_ended",
      "text": "Domanda...",
      "options": ["A", "B", "C", "D"], // Solo se multiple_choice
      "correctAnswer": "Soluzione o criteri di correzione"
    }
  ]
}
`;

export const getThemePrompt = (prompt: string) => `
TASK: Generare Palette Colori Material Design 3.
INPUT: "${prompt}"

Crea 3 colori esadecimali armoniosi che rispecchino l'input (es. "Oceano" -> Blu/Teal).

**FORMATO OUTPUT:** JSON ESCLUSIVO
{
    "primary": "#HEX",
    "secondary": "#HEX",
    "tertiary": "#HEX",
    "name": "Nome creativo (es. Deep Ocean)"
}
`;

export const getClassAnalysisPrompt = (selectedClass: string, dataSummary: any) => `
TASK: Report Consiglio di Classe (Analisi Dati).

**DATI CLASSE ${selectedClass}:**
${JSON.stringify(dataSummary, null, 2)}

**RICHIESTA:**
Analizza i dati e produci un testo per il verbale.

**FORMATO OUTPUT:** JSON ESCLUSIVO
{
  "sintesiGenerale": "Paragrafo discorsivo su andamento e clima.",
  "puntiDiForza": ["List item 1", "List item 2"],
  "areeDiMiglioramento": ["List item 1", "List item 2"],
  "casiParticolari": ["Osservazione anonima su trend (es. gruppo eccellente, casi in calo)"]
}
`;
