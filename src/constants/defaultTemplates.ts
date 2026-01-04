import { DocumentTemplate } from '../types';

export const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl-student-profile-standard',
    name: 'Profilo Studente Standard',
    type: 'student_profile',
    description: 'Template istituzionale per il profilo dello studente con riepilogo voti e competenze.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      includeEvaluations: true,
      includeCompetencyEvaluations: true,
      customSections: ['Osservazioni comportamentali', 'Note per il consiglio di classe']
    },
    content: {
      header: '<h1 style="text-align: center; color: #1a73e8;">Profilo dello Studente</h1><hr/>',
      footer: '<p style="text-align: center; font-size: 10px; color: #666;">Generato con DocenteDoc AI - {{data}}</p>',
      customCss: '.student-info { margin-bottom: 20px; } .grade-table { width: 100%; border-collapse: collapse; }'
    }
  },
  {
    id: 'tpl-lesson-plan-active',
    name: 'Piano Lezione Didattica Attiva',
    type: 'lesson_plan',
    description: 'Template focalizzato su metodologie attive, obiettivi e materiali.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      includeObjectives: true,
      includeMaterials: true,
      customFields: {
        'Metodologia': 'Flipped Classroom / Cooperative Learning',
        'Fase di Engagement': 'Domanda stimolo o video breve'
      }
    },
    content: {
      header: '<div style="background-color: #e8f0fe; padding: 15px; border-radius: 8px;"><h2>Piano di Lezione: {{titolo_lezione}}</h2></div>',
      footer: '<hr/><p style="font-style: italic;">Docente: {{nome_docente}}</p>'
    }
  },
  {
    id: 'tpl-uda-ministeriale',
    name: 'UDA Formato Ministeriale',
    type: 'uda',
    description: 'Struttura completa per Unità di Apprendimento secondo le linee guida ministeriali.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      includePhases: true,
      includeEvaluation: true,
      customIntroduction: 'L\'Unità di Apprendimento mira a sviluppare competenze trasversali e disciplinari.',
      customConclusion: 'La valutazione terrà conto del processo e del prodotto finale.'
    },
    content: {
      header: '<h1 style="text-transform: uppercase; border-bottom: 2px solid #333;">Unità di Apprendimento</h1>',
      footer: '<p style="text-align: right;">Pagina {{page_number}}</p>'
    }
  }
];
