import { describe, it, expect, beforeEach } from 'vitest';
import { useDataStore } from '../../src/stores/useDataStore';
import { Studente, Valutazione, ValutazioneCompetenza, UserProfile, Lezione, EventoCalendario, KnowledgeBaseEntry, AiSuggestion, SystemSuggestion, Notifica, ToDoItem } from '../../src/types';

describe('useDataStore', () => {
  beforeEach(() => {
    useDataStore.getState().actions.resetAll();
  });

  // User Profile Tests
  describe('User Profile', () => {
    it('dovrebbe inizializzare con user null', () => {
      const state = useDataStore.getState();
      expect(state.user).toBeNull();
    });

    it('dovrebbe impostare l\'utente', () => {
      const mockUser: UserProfile = {
        id: 'user1',
        displayName: 'Prof Rossi',
        email: 'prof@test.it',
      };

      useDataStore.getState().actions.setUser(mockUser);
      const state = useDataStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.user?.displayName).toBe('Prof Rossi');
    });

    it('dovrebbe permettere di azzerare l\'utente', () => {
      const mockUser: UserProfile = {
        id: 'user1',
        displayName: 'Prof Rossi',
        email: 'prof@test.it',
      };

      useDataStore.getState().actions.setUser(mockUser);
      useDataStore.getState().actions.setUser(null);
      expect(useDataStore.getState().user).toBeNull();
    });
  });

  // Students Tests
  describe('Students', () => {
    it('dovrebbe inizializzare con array vuoto di studenti', () => {
      expect(useDataStore.getState().students).toEqual([]);
    });

    it('dovrebbe aggiungere studenti', () => {
      const students: Studente[] = [
        { id: 's1', nome: 'Marco', cognome: 'Verdi', classe: 'III-A' },
        { id: 's2', nome: 'Luca', cognome: 'Bianchi', classe: 'III-A' },
      ];

      useDataStore.getState().actions.setStudents(students);
      expect(useDataStore.getState().students).toEqual(students);
      expect(useDataStore.getState().students.length).toBe(2);
    });

    it('dovrebbe aggiornare studenti tramite funzione', () => {
      const initialStudents: Studente[] = [
        { id: 's1', nome: 'Marco', cognome: 'Verdi', classe: 'III-A' },
      ];

      useDataStore.getState().actions.setStudents(initialStudents);
      
      // Aggiungi uno studente tramite funzione
    useDataStore.getState().actions.setStudents((prev: Studente[]) => [
      ...prev,
      { id: 's2', nome: 'Luca', cognome: 'Bianchi', classe: 'III-A' },
    ]);

      expect(useDataStore.getState().students.length).toBe(2);
    });
  });

  // Evaluations Tests
  describe('Evaluations', () => {
    it('dovrebbe inizializzare con array vuoto di valutazioni', () => {
      expect(useDataStore.getState().evaluations).toEqual([]);
    });

    it('dovrebbe impostare valutazioni', () => {
      const evaluations: Valutazione[] = [
        {
          id: 'v1',
          studenteId: 's1',
          materia: 'Italiano',
          tipo: 'Scritto',
          voto: '8',
          data: '2024-12-20',
        },
        {
          id: 'v2',
          studenteId: 's1',
          materia: 'Matematica',
          tipo: 'Orale',
          voto: '7',
          data: '2024-12-19',
        },
      ];

      useDataStore.getState().actions.setEvaluations(evaluations);
      expect(useDataStore.getState().evaluations).toEqual(evaluations);
      expect(useDataStore.getState().evaluations.length).toBe(2);
    });

    it('dovrebbe aggiungere valutazioni tramite funzione', () => {
      const firstEval: Valutazione = {
        id: 'v1',
        studenteId: 's1',
        materia: 'Italiano',
        tipo: 'Scritto',
        voto: '8',
        data: '2024-12-20',
      };

      useDataStore.getState().actions.setEvaluations([firstEval]);
      
    useDataStore.getState().actions.setEvaluations((prev: Valutazione[]) => [
      ...prev,
      {
        id: 'v2',
        studenteId: 's1',
        materia: 'Matematica',
        tipo: 'Orale',
        voto: '7',
        data: '2024-12-19',
      },
    ]);

      expect(useDataStore.getState().evaluations.length).toBe(2);
    });
  });

  // Competency Evaluations Tests
  describe('Competency Evaluations', () => {
    it('dovrebbe inizializzare con array vuoto di competency evals', () => {
      expect(useDataStore.getState().competencyEvals).toEqual([]);
    });

    it('dovrebbe impostare valutazioni competenza', () => {
      const competencyEvals: ValutazioneCompetenza[] = [
        {
          id: 'c1',
          studenteId: 's1',
          competenzaId: 'comp1',
          livelloId: 'lvl_a',
          data: '2024-12-20',
          materia: 'Italiano',
        },
      ];

      useDataStore.getState().actions.setCompetencyEvals(competencyEvals);
      expect(useDataStore.getState().competencyEvals).toEqual(competencyEvals);
    });
  });

  // Lessons Tests
  describe('Lessons', () => {
    it('dovrebbe inizializzare con oggetto vuoto di lezioni', () => {
      expect(useDataStore.getState().lessons).toEqual({});
    });

    it('dovrebbe impostare lezioni', () => {
      const lessons: Record<string, Lezione> = {
        'lez1': {
          id: 'lez1',
          classe: 'III-A',
          materia: 'Italiano',
          contenuto: '<p>Contenuto</p>',
          svolta: false,
        },
      };

      useDataStore.getState().actions.setLessons(lessons);
      expect(useDataStore.getState().lessons).toEqual(lessons);
      expect(useDataStore.getState().lessons['lez1']?.materia).toBe('Italiano');
    });

    it('dovrebbe aggiornare lezioni tramite funzione', () => {
      const initialLessons: Record<string, Lezione> = {
        'lez1': {
          id: 'lez1',
          classe: 'III-A',
          materia: 'Italiano',
          contenuto: '<p>Contenuto</p>',
          svolta: false,
        },
      };

      useDataStore.getState().actions.setLessons(initialLessons);
      
    useDataStore.getState().actions.setLessons((prev: Record<string, Lezione>) => ({
      ...prev,
      'lez2': {
        id: 'lez2',
        classe: 'III-A',
        materia: 'Italiano',
        contenuto: '<p>Contenuto 2</p>',
        svolta: false,
      },
    }));

      expect(Object.keys(useDataStore.getState().lessons).length).toBe(2);
    });
  });

  // Knowledge Base Tests
  describe('Knowledge Base', () => {
    it('dovrebbe inizializzare con KB guide di default', () => {
      const kb = useDataStore.getState().knowledgeBase;
      expect(Array.isArray(kb)).toBe(true);
      expect(kb.length).toBeGreaterThan(0);
    });

    it('dovrebbe aggiungere entry alla knowledge base', () => {
      const initialKB = useDataStore.getState().knowledgeBase;
      const newEntry: KnowledgeBaseEntry = {
        id: 'kb1',
        fileName: 'Nota Importante',
        content: 'Questo è importante',
      };

    useDataStore.getState().actions.setKnowledgeBase((prev: KnowledgeBaseEntry[]) => [
      ...prev,
      newEntry,
    ]);

      const newKB = useDataStore.getState().knowledgeBase;
      expect(newKB.length).toBe(initialKB.length + 1);
    });
  });

  // Events Tests
  describe('Events (Calendario)', () => {
    it('dovrebbe inizializzare con array vuoto di eventi', () => {
      expect(useDataStore.getState().eventi).toEqual([]);
    });

    it('dovrebbe impostare eventi', () => {
      const events: EventoCalendario[] = [
        {
          id: 'evt1',
          titolo: 'Riunione',
          data: '2024-12-20',
          oraInizio: '10:00',
          tipo: 'consiglio',
        },
      ];

      useDataStore.getState().actions.setEventi(events);
      expect(useDataStore.getState().eventi).toEqual(events);
    });
  });

  // AI Suggestions Tests
  describe('AI Suggestions & Context', () => {
    it('dovrebbe inizializzare senza suggerimenti', () => {
      const state = useDataStore.getState();
      expect(state.suggestions).toEqual([]);
      expect(state.activeSuggestion).toBeNull();
    });

    it('dovrebbe impostare suggerimenti AI', () => {
      const suggestions: AiSuggestion[] = [
        {
          id: 'sugg1',
          icon: 'info',
          title: 'Suggerimento',
          description: 'Suggerimento 1',
          action: { type: 'view', payload: {} },
        },
      ];

      useDataStore.getState().actions.setSuggestions(suggestions);
      expect(useDataStore.getState().suggestions).toEqual(suggestions);
    });

    it('dovrebbe impostare suggerimento attivo', () => {
      const activeSugg: SystemSuggestion = {
        id: 'sys1',
        message: 'Suggerimento Attivo',
        targetView: 'home',
        actionLabel: 'Aggiungi',
        action: { type: 'add', payload: {} },
      };

      useDataStore.getState().actions.setActiveSuggestion(activeSugg);
      expect(useDataStore.getState().activeSuggestion).toEqual(activeSugg);
    });

    it('dovrebbe cancellare suggerimento attivo', () => {
      const activeSugg: SystemSuggestion = {
        id: 'sys1',
        message: 'Suggerimento Attivo',
        targetView: 'home',
        actionLabel: 'Aggiungi',
        action: { type: 'add', payload: {} },
      };

      useDataStore.getState().actions.setActiveSuggestion(activeSugg);
      useDataStore.getState().actions.setActiveSuggestion(null);
      expect(useDataStore.getState().activeSuggestion).toBeNull();
    });

    it('dovrebbe dismissare suggerimenti', () => {
      useDataStore.getState().actions.dismissSuggestion('sugg1');
      const dismissed = useDataStore.getState().dismissedSuggestions;
      expect(dismissed.has('sugg1')).toBe(true);
    });
  });

  // Student Profile Context
  describe('Student Profile Context', () => {
    it('dovrebbe inizializzare senza student context', () => {
      expect(useDataStore.getState().studentProfileContext).toBeNull();
    });

    it('dovrebbe impostare student context', () => {
      const student: Studente = {
        id: 's1',
        nome: 'Marco',
        cognome: 'Verdi',
        classe: 'III-A',
      };

      useDataStore.getState().actions.setStudentProfileContext(student);
      expect(useDataStore.getState().studentProfileContext).toEqual(student);
    });
  });

  // Class Selection
  describe('Class Selection for Dashboard', () => {
    it('dovrebbe inizializzare senza classe selezionata', () => {
      expect(useDataStore.getState().selectedClassForDashboard).toBeNull();
    });

    it('dovrebbe impostare classe selezionata', () => {
      useDataStore.getState().actions.setSelectedClassForDashboard('III-A');
      expect(useDataStore.getState().selectedClassForDashboard).toBe('III-A');
    });

    it('dovrebbe permettere di deselezionare la classe', () => {
      useDataStore.getState().actions.setSelectedClassForDashboard('III-A');
      useDataStore.getState().actions.setSelectedClassForDashboard(null);
      expect(useDataStore.getState().selectedClassForDashboard).toBeNull();
    });
  });

  // Bulk Operations
  describe('Bulk Load & Reset', () => {
    it('dovrebbe caricare dati da backup', () => {
      const backupData = {
        user: {
          id: 'user1',
          displayName: 'Prof Rossi',
          email: 'prof@test.it',
        } as UserProfile,
        students: [
          { id: 's1', nome: 'Marco', cognome: 'Verdi', classe: 'III-A' },
        ],
      };

      useDataStore.getState().actions.loadFromBackup(backupData);
      const state = useDataStore.getState();
      expect(state.user?.displayName).toBe('Prof Rossi');
      expect(state.students.length).toBe(1);
    });

    it('dovrebbe resettare tutto lo store', () => {
      // Popola lo store
      useDataStore.getState().actions.setUser({
        id: 'user1',
        displayName: 'Prof Rossi',
        email: 'prof@test.it',
      });
      useDataStore.getState().actions.setStudents([
        { id: 's1', nome: 'Marco', cognome: 'Verdi', classe: 'III-A' },
      ]);

      // Reset
      useDataStore.getState().actions.resetAll();

      // Verifica che sia vuoto
      const state = useDataStore.getState();
      expect(state.user).toBeNull();
      expect(state.students).toEqual([]);
      expect(state.evaluations).toEqual([]);
    });
  });

  // Notifications Tests
  describe('Notifications', () => {
    it('dovrebbe inizializzare con notifiche vuote', () => {
      expect(useDataStore.getState().notifiche).toEqual([]);
    });

    it('dovrebbe impostare notifiche', () => {
      const notifications: Notifica[] = [
        {
          id: 'notif1',
          titolo: 'Avviso',
          messaggio: 'Messaggio importante',
          type: 'circular',
          data: new Date().toISOString(),
          letta: false,
        },
      ];

      useDataStore.getState().actions.setNotifiche(notifications);
      expect(useDataStore.getState().notifiche).toEqual(notifications);
    });
  });

  // Memos/ToDo Tests
  describe('Memos & ToDo', () => {
    it('dovrebbe inizializzare con memos vuoti', () => {
      expect(useDataStore.getState().memos).toEqual([]);
    });

    it('dovrebbe impostare memos', () => {
      const memos: ToDoItem[] = [
        {
          id: 'memo1',
          text: 'Compito',
          done: false,
        },
      ];

      useDataStore.getState().actions.setMemos(memos);
      expect(useDataStore.getState().memos).toEqual(memos);
    });

    it('dovrebbe aggiungere memo tramite funzione', () => {
      const initialMemo: ToDoItem = {
        id: 'memo1',
        text: 'Compito 1',
        done: false,
      };

      useDataStore.getState().actions.setMemos([initialMemo]);
      
    useDataStore.getState().actions.setMemos((prev: ToDoItem[]) => [
      ...prev,
      {
        id: 'memo2',
        text: 'Compito 2',
        done: false,
      },
    ]);

      expect(useDataStore.getState().memos.length).toBe(2);
    });
  });
});
